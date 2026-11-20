import { LUMINA_V1_CATALOG_ID } from '@a2ui-catalog/core';

export const AGENT_BASE_URL =
  (import.meta.env.VITE_AGENT_URL as string | undefined) || 'http://localhost:10002';

export interface AgentHealth {
  status: string;
  protocolVersion: string;
  catalogId: string;
  mode: 'gemini' | 'replay';
  scenarios: Array<{
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    prompt: string;
    icon: string;
  }>;
}

export interface StreamCallbacks {
  onText: (text: string) => void;
  onA2uiMessage: (msg: Record<string, unknown>) => void;
  onRawFrame?: (frame: Record<string, unknown>) => void;
}

export async function fetchAgentHealth(): Promise<AgentHealth> {
  const res = await fetch(`${AGENT_BASE_URL}/health`);
  if (!res.ok) throw new Error(`Agent health check failed (${res.status})`);
  return (await res.json()) as AgentHealth;
}

export async function streamA2aTurn(options: {
  contextId: string;
  text?: string;
  action?: Record<string, unknown>;
  geminiApiKey?: string;
  forceReplay?: boolean;
  callbacks: StreamCallbacks;
}): Promise<void> {
  const parts: Array<Record<string, unknown>> = [];
  if (options.text) {
    parts.push({ kind: 'text', text: options.text });
  }
  if (options.action) {
    parts.push({
      kind: 'data',
      mimeType: 'application/a2ui+json',
      data: {
        version: '1.0',
        action: options.action,
      },
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (options.geminiApiKey?.trim()) {
    headers['X-Gemini-Api-Key'] = options.geminiApiKey.trim();
  }
  if (options.forceReplay) {
    headers['X-Lumina-Mode'] = 'replay';
  }

  const response = await fetch(`${AGENT_BASE_URL}/a2a/json-rpc`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'message/stream',
      params: {
        message: {
          kind: 'message',
          messageId: `msg-${Date.now()}`,
          contextId: options.contextId,
          role: 'user',
          parts,
          metadata: {
            a2uiRendererCapabilities: {
              '1.0': {
                supportedCatalogIds: [LUMINA_V1_CATALOG_ID],
              },
            },
          },
        },
      },
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Agent request failed (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let splitIdx = buffer.indexOf('\n\n');
    while (splitIdx !== -1) {
      const rawEvent = buffer.slice(0, splitIdx);
      buffer = buffer.slice(splitIdx + 2);
      splitIdx = buffer.indexOf('\n\n');

      const dataLines = rawEvent
        .split('\n')
        .filter((l) => l.startsWith('data:'))
        .map((l) => l.slice(5).trim());
      if (dataLines.length === 0) continue;

      try {
        const frame = JSON.parse(dataLines.join('\n')) as {
          result?: {
            status?: {
              message?: {
                parts?: Array<{ kind?: string; text?: string; mimeType?: string; data?: Record<string, unknown> }>;
              };
            };
          };
        };
        options.callbacks.onRawFrame?.(frame as Record<string, unknown>);
        const msgParts = frame.result?.status?.message?.parts ?? [];
        for (const p of msgParts) {
          if (p.kind === 'text' && p.text) {
            options.callbacks.onText(p.text);
          } else if (p.kind === 'data' && p.data) {
            options.callbacks.onA2uiMessage(p.data);
          }
        }
      } catch {
        // ignore malformed partial frame
      }
    }
  }
}

import express, { type Express } from 'express';
import crypto from 'node:crypto';
import { LUMINA_V1_CATALOG_ID } from '@a2ui-catalog/core';
import { HERO_SCENARIO_LIST, resolveReplayTurn } from './scenarios/hero-scenarios.js';
import { generateWithGemini } from './gemini-backend.js';

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: {
    message?: {
      contextId?: string;
      parts?: Array<{ kind?: string; text?: string; data?: Record<string, unknown> }>;
      metadata?: Record<string, unknown>;
    };
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractRequestIntent(body: JsonRpcRequest) {
  const msg = body?.params?.message;
  const parts = Array.isArray(msg?.parts) ? msg.parts : [];
  let query = '';
  let actionName: string | undefined;
  let actionContext: Record<string, unknown> | undefined;

  for (const part of parts) {
    if (part.kind === 'text' && typeof part.text === 'string') {
      query = query ? `${query}\n${part.text}` : part.text;
    } else if (part.kind === 'data' && part.data && typeof part.data === 'object') {
      const action = part.data.action as Record<string, unknown> | undefined;
      if (action && typeof action.name === 'string') {
        actionName = action.name;
        actionContext = (action.context as Record<string, unknown>) ?? {};
        if (!query && typeof action.userMessage === 'string') {
          query = action.userMessage;
        }
      }
    }
  }

  const caps = (msg?.metadata?.a2uiRendererCapabilities as Record<string, unknown> | undefined)?.[
    '1.0'
  ] as { supportedCatalogIds?: string[] } | undefined;
  const supportedCatalogIds = Array.isArray(caps?.supportedCatalogIds)
    ? caps.supportedCatalogIds
    : [LUMINA_V1_CATALOG_ID];

  return {
    contextId: msg?.contextId || crypto.randomUUID(),
    query,
    actionName,
    actionContext,
    supportedCatalogIds,
  };
}

export function createAgentApp(): Express {
  const app = express();
  let turnCounter = 0;

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Gemini-Api-Key, X-Lumina-Mode');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  app.use(express.json({ limit: '2mb' }));

  app.get('/health', (_req, res) => {
    const hasEnvKey = Boolean(process.env.GEMINI_API_KEY);
    const forcedReplay = process.env.LUMINA_AGENT_MODE === 'replay';
    res.json({
      status: 'ok',
      protocolVersion: '1.0',
      catalogId: LUMINA_V1_CATALOG_ID,
      mode: hasEnvKey && !forcedReplay ? 'gemini' : 'replay',
      scenarios: HERO_SCENARIO_LIST,
    });
  });

  app.post('/a2a/json-rpc', async (req, res) => {
    const rpc = (req.body ?? {}) as JsonRpcRequest;
    const rpcId = rpc.id ?? 1;
    const method = rpc.method ?? 'message/stream';
    const taskId = crypto.randomUUID();
    const intent = extractRequestIntent(rpc);
    turnCounter += 1;

    const headerKey = typeof req.headers['x-gemini-api-key'] === 'string'
      ? req.headers['x-gemini-api-key'].trim()
      : '';
    const requestedMode = typeof req.headers['x-lumina-mode'] === 'string'
      ? req.headers['x-lumina-mode'].trim()
      : '';
    const apiKey = headerKey || (process.env.LUMINA_AGENT_MODE === 'replay' ? '' : (process.env.GEMINI_API_KEY ?? ''));
    const useGemini = Boolean(apiKey) && requestedMode !== 'replay';

    const writeSse = (eventPayload: Record<string, unknown>) => {
      res.write(`data: ${JSON.stringify({ jsonrpc: '2.0', id: rpcId, result: eventPayload })}\n\n`);
    };

    const isStream = method === 'message/stream';
    if (isStream) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();
    }

    try {
      if (useGemini) {
        if (isStream) {
          writeSse({
            kind: 'status-update',
            taskId,
            contextId: intent.contextId,
            final: false,
            status: { state: 'working' },
          });
        }

        const result = await generateWithGemini({
          apiKey,
          query: intent.query,
          actionName: intent.actionName,
          actionContext: intent.actionContext,
          supportedCatalogIds: intent.supportedCatalogIds,
        });

        const parts = [
          { kind: 'text', text: result.text },
          ...result.a2uiMessages.map((msg) => ({
            kind: 'data',
            mimeType: 'application/a2ui+json',
            data: msg,
          })),
        ];

        if (isStream) {
          writeSse({
            kind: 'status-update',
            taskId,
            contextId: intent.contextId,
            final: false,
            status: {
              state: 'working',
              message: { kind: 'message', role: 'agent', parts },
            },
          });
          writeSse({
            kind: 'status-update',
            taskId,
            contextId: intent.contextId,
            final: true,
            status: { state: 'input-required' },
          });
          res.end();
        } else {
          res.json({
            jsonrpc: '2.0',
            id: rpcId,
            result: {
              kind: 'task',
              id: taskId,
              contextId: intent.contextId,
              status: {
                state: 'input-required',
                message: { kind: 'message', role: 'agent', parts },
              },
            },
          });
        }
        return;
      }

      // Deterministic chunk-streamed Replay mode (zero API key required!)
      const turn = resolveReplayTurn({
        query: intent.query,
        actionName: intent.actionName,
        actionContext: intent.actionContext,
        turnCounter,
      });

      if (isStream) {
        writeSse({
          kind: 'status-update',
          taskId,
          contextId: intent.contextId,
          final: false,
          status: {
            state: 'working',
            message: {
              kind: 'message',
              role: 'agent',
              parts: [{ kind: 'text', text: turn.textPrefix }],
            },
          },
        });

        for (const chunk of turn.chunks) {
          if (chunk.delayMs > 0) await sleep(chunk.delayMs);
          writeSse({
            kind: 'status-update',
            taskId,
            contextId: intent.contextId,
            final: false,
            status: {
              state: 'working',
              message: {
                kind: 'message',
                role: 'agent',
                parts: chunk.messages.map((msg) => ({
                  kind: 'data',
                  mimeType: 'application/a2ui+json',
                  data: msg,
                })),
              },
            },
          });
        }

        writeSse({
          kind: 'status-update',
          taskId,
          contextId: intent.contextId,
          final: true,
          status: { state: turn.finalState },
        });
        res.end();
      } else {
        const allParts = [
          { kind: 'text', text: turn.textPrefix },
          ...turn.chunks.flatMap((c) =>
            c.messages.map((msg) => ({
              kind: 'data',
              mimeType: 'application/a2ui+json',
              data: msg,
            })),
          ),
        ];
        res.json({
          jsonrpc: '2.0',
          id: rpcId,
          result: {
            kind: 'task',
            id: taskId,
            contextId: intent.contextId,
            status: {
              state: turn.finalState,
              message: { kind: 'message', role: 'agent', parts: allParts },
            },
          },
        });
      }
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      if (isStream) {
        writeSse({
          kind: 'status-update',
          taskId,
          contextId: intent.contextId,
          final: true,
          status: {
            state: 'failed',
            message: {
              kind: 'message',
              role: 'agent',
              parts: [{ kind: 'text', text: `Agent error: ${detail}` }],
            },
          },
        });
        res.end();
      } else {
        res.status(500).json({
          jsonrpc: '2.0',
          id: rpcId,
          error: { code: -32000, message: detail },
        });
      }
    }
  });

  return app;
}

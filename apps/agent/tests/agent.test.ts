import { describe, expect, it } from 'vitest';
import { MessageProcessor } from '@a2ui/web_core';
import {
  LUMINA_V1_CATALOG_ID,
  luminaCoreCatalog,
  processLuminaMessages,
} from '@a2ui-catalog/core';
import { HERO_SCENARIO_LIST, resolveReplayTurn } from '../src/scenarios/hero-scenarios.js';
import { createAgentApp } from '../src/server.js';

describe('@a2ui-catalog/agent — A2A v1.0 Hero Scenarios & JSON-RPC Validation', () => {
  it('validates every turn of all 4 Hero Scenarios against luminaCoreCatalog MessageProcessor', () => {
    const turns = [
      resolveReplayTurn({ query: HERO_SCENARIO_LIST[0].prompt, turnCounter: 1 }),
      resolveReplayTurn({
        query: '',
        actionName: 'select_flight',
        actionContext: { flight: 'ANA NH 105', fare: 4280, hotel: 'Aman Tokyo' },
        turnCounter: 2,
      }),
      resolveReplayTurn({
        query: '',
        actionName: 'confirm_booking',
        actionContext: { flight: 'ANA NH 105', hotel: 'Aman Tokyo', travelers: 2, nights: 4 },
        turnCounter: 3,
      }),
      resolveReplayTurn({ query: HERO_SCENARIO_LIST[1].prompt, turnCounter: 4 }),
      resolveReplayTurn({ query: '', actionName: 'drilldown_margin', turnCounter: 5 }),
      resolveReplayTurn({ query: HERO_SCENARIO_LIST[2].prompt, turnCounter: 6 }),
      resolveReplayTurn({ query: '', actionName: 'approve_rollout', turnCounter: 7 }),
      resolveReplayTurn({ query: HERO_SCENARIO_LIST[3].prompt, turnCounter: 8 }),
      resolveReplayTurn({
        query: '',
        actionName: 'apply_rebalance',
        actionContext: { monthlyReinvest: 650 },
        turnCounter: 9,
      }),
    ];

    for (const [idx, turn] of turns.entries()) {
      const processor = new MessageProcessor([luminaCoreCatalog]);
      const allMsgs = turn.chunks.flatMap((c) => c.messages);
      expect(allMsgs.length, `Turn ${idx + 1} should emit A2UI messages`).toBeGreaterThan(0);
      expect(
        () => processLuminaMessages(processor, allMsgs),
        `Turn ${idx + 1} failed A2UI v1.0 schema validation`,
      ).not.toThrow();
    }
  });

  it('serves A2A v1.0 message/stream SSE frames over HTTP JSON-RPC', async () => {
    const app = createAgentApp();
    const server = await new Promise<ReturnType<typeof app.listen>>((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    const addr = server.address();
    const port = typeof addr === 'object' && addr ? addr.port : 0;

    try {
      const health = await fetch(`http://127.0.0.1:${port}/health`).then((r) => r.json());
      expect(health.status).toBe('ok');
      expect(health.protocolVersion).toBe('1.0');
      expect(health.catalogId).toBe(LUMINA_V1_CATALOG_ID);

      const res = await fetch(`http://127.0.0.1:${port}/a2a/json-rpc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Lumina-Mode': 'replay' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'message/stream',
          params: {
            message: {
              kind: 'message',
              role: 'user',
              parts: [{ kind: 'text', text: 'Plan a 4-day executive trip to Tokyo' }],
              metadata: {
                a2uiRendererCapabilities: {
                  '1.0': { supportedCatalogIds: [LUMINA_V1_CATALOG_ID] },
                },
              },
            },
          },
        }),
      });

      const body = await res.text();
      expect(res.status).toBe(200);
      expect(body).toContain('application/a2ui+json');
      expect(body).toContain('ComparisonMatrix');
      expect(body).toContain('"final":true');
    } finally {
      server.close();
    }
  });
});

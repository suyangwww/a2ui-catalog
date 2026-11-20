import { createAgentApp } from './server.js';

const PORT = Number(process.env.PORT ?? 10002);
const app = createAgentApp();

app.listen(PORT, () => {
  const mode =
    process.env.GEMINI_API_KEY && process.env.LUMINA_AGENT_MODE !== 'replay'
      ? 'gemini'
      : 'replay';
  console.log(`[lumina-agent] A2A v1.0 server listening on http://localhost:${PORT} (mode=${mode})`);
});

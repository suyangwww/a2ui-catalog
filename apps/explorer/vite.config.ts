import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_MEDIA_DIR = path.resolve(__dirname, '../../docs/media');

const MIME_BY_EXT: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

function createMediaMiddleware() {
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const rawUrl = req.url?.split('?')[0] ?? '';
    if (!rawUrl.startsWith('/media/')) {
      next();
      return;
    }

    const safeName = path.basename(rawUrl.slice('/media/'.length));
    const filePath = path.join(DOCS_MEDIA_DIR, safeName);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      next();
      return;
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(safeName).toLowerCase();
    const contentType = MIME_BY_EXT[ext] ?? 'application/octet-stream';
    const rangeHeader = req.headers.range;

    if (rangeHeader && rangeHeader.startsWith('bytes=')) {
      const [startStr, endStr] = rangeHeader.replace('bytes=', '').split('-');
      const start = Math.max(0, Number.parseInt(startStr, 10) || 0);
      const end = endStr
        ? Math.min(stat.size - 1, Number.parseInt(endStr, 10))
        : stat.size - 1;
      const chunkSize = Math.max(0, end - start + 1);

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      'Accept-Ranges': 'bytes',
      'Content-Length': stat.size,
      'Content-Type': contentType,
    });
    fs.createReadStream(filePath).pipe(res);
  };
}

function luminaMediaPlugin(): Plugin {
  return {
    name: 'lumina-docs-media',
    configureServer(server) {
      server.middlewares.use(createMediaMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(createMediaMiddleware());
    },
    closeBundle() {
      if (!fs.existsSync(DOCS_MEDIA_DIR)) return;
      const outMediaDir = path.resolve(__dirname, 'dist/media');
      fs.mkdirSync(outMediaDir, { recursive: true });
      for (const entry of fs.readdirSync(DOCS_MEDIA_DIR)) {
        const src = path.join(DOCS_MEDIA_DIR, entry);
        if (fs.statSync(src).isFile()) {
          fs.copyFileSync(src, path.join(outMediaDir, entry));
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), luminaMediaPlugin()],
  server: {
    port: 5173,
    strictPort: true,
  },
});

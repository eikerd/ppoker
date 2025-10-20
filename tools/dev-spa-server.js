#!/usr/bin/env node
// Simple SPA server that serves index.html for any non-file route
// No external dependencies - uses built-in http/fs modules

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT ? Number(process.env.PORT) : 4200;
const STATIC_DIR = path.resolve(__dirname, '../apps/planning-poker/src');

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.woff': return 'font/woff';
    case '.woff2': return 'font/woff2';
    case '.ttf': return 'font/ttf';
    default: return 'application/octet-stream';
  }
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    // Prevent directory traversal
    if (urlPath.includes('..')) {
      res.writeHead(400);
      return res.end('Bad request');
    }

    // Map to static file path
    const maybeFile = path.join(STATIC_DIR, urlPath === '/' ? 'index.html' : urlPath);

    // If the requested path is a file that exists, serve it
    if (fs.existsSync(maybeFile) && fs.statSync(maybeFile).isFile()) {
      const ct = contentType(maybeFile);
      res.writeHead(200, { 'Content-Type': ct });
      return fs.createReadStream(maybeFile).pipe(res);
    }

    // Otherwise fallback to index.html (SPA route handling)
    const indexFile = path.join(STATIC_DIR, 'index.html');
    if (fs.existsSync(indexFile)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(indexFile).pipe(res);
    }

    res.writeHead(404);
    res.end('Not found');
  } catch (err) {
    console.error('Error serving request', err);
    res.writeHead(500);
    res.end('Internal server error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SPA dev server running at http://localhost:${PORT}/`);
  console.log(`Serving files from ${STATIC_DIR}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});


const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// ── Load .env if present ──────────────────────────────────────────────────
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=').trim();
    if (key && value) process.env[key.trim()] = value;
  });
  console.log('[ENV] Loaded .env configuration');
}

const PORT = 5000;

// Prefer compiled client/dist, fallback to app
const CLIENT_DIST = path.join(__dirname, 'client', 'dist');
const APP_DIR = fs.existsSync(CLIENT_DIST) ? CLIENT_DIST : path.join(__dirname, 'app');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0].split('#')[0];
  if (cleanUrl === '/' || cleanUrl === '') {
    cleanUrl = '/index.html';
  }

  let filePath = path.join(APP_DIR, cleanUrl);

  // If path is a directory, serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  // SPA fallback for dynamic routes like /passport/:id
  if (!fs.existsSync(filePath) && !path.extname(cleanUrl)) {
    filePath = path.join(APP_DIR, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    const content = fs.readFileSync(filePath);

    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Length': content.length,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(content);
  } else {
    const notFound = `<html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>404 - SkillProof Resource Not Found</h2><p>Cannot find: ${req.url}</p><a href="/">Return to SkillProof Home</a></body></html>`;
    res.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': Buffer.byteLength(notFound)
    });
    res.end(notFound);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================================`);
  console.log(`   SKILLPROOF LIVE PRODUCTION SERVER RUNNING ON PORT ${PORT}`);
  console.log(`   Serving Directory: ${APP_DIR}`);
  console.log(`   URL: http://localhost:${PORT}/`);
  console.log(`===================================================================`);

  // ── Spawn the AI API server on port 5001 ─────────────────────────────
  const apiServerPath = path.join(__dirname, 'server', 'server.js');
  if (fs.existsSync(apiServerPath)) {
    const apiProc = spawn(process.execPath, [apiServerPath], {
      env: { ...process.env, PORT: '5001' },
      stdio: 'inherit',
      windowsHide: false
    });
    apiProc.on('error', err => console.error('[API Server] Failed to start:', err.message));
    console.log('[ONLINE] AI API Server      → http://localhost:5001/api');
  } else {
    console.warn('[WARN] server/server.js not found — AI features require the API server.');
  }
});

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const APP_DIR = path.join(__dirname, 'app');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
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
    console.log(`[${new Date().toLocaleTimeString()}] 200 ${req.method} ${req.url}`);
  } else {
    const notFound = `<html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>404 - SkillProof Resource Not Found</h2><p>Cannot find: ${req.url}</p><a href="/">Return to SkillProof Home</a></body></html>`;
    res.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': Buffer.byteLength(notFound)
    });
    res.end(notFound);
    console.log(`[${new Date().toLocaleTimeString()}] 404 ${req.method} ${req.url}`);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('==================================================================');
  console.log('     SKILLPROOF - High-Performance Enterprise Verification Server ');
  console.log('     "Don\'t Just Claim Your Skills. Prove Them."                  ');
  console.log('==================================================================');
  console.log(`[ONLINE] SkillProof Server running at http://localhost:${PORT}/`);
  console.log(`[ONLINE] Serving application from: ${APP_DIR}`);
});

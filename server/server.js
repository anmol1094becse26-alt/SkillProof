/**
 * SKILLPROOF - EXPRESS BACKEND SERVER & API GATEWAY
 */

const http = require('http');
const url = require('url');
const path = require('path');
const db = require('./config/db');

const PORT = process.env.PORT || 5001;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API router
  if (pathname.startsWith('/api/')) {
    const apiRoute = require('./routes/api');
    return apiRoute(req, res, parsedUrl);
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'online', service: 'SkillProof REST API', version: '2.0.0' }));
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[SkillProof API Server] Running on http://localhost:${PORT}`);
  });
}

module.exports = server;

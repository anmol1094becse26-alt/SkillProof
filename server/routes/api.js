/**
 * SKILLPROOF - CENTRAL REST API ROUTER
 */

const { getChallenges, getChallengeById, submitAssessment } = require('../controllers/assessmentController');
const { getPassport, verifyPassport } = require('../controllers/passportController');
const db = require('../config/db');

module.exports = function apiRouter(req, res, parsedUrl) {
  const { pathname, query } = parsedUrl;
  const method = req.method;

  // Helper to read JSON request body
  function parseBody(cb) {
    let raw = '';
    req.on('data', chunk => raw += chunk);
    req.on('end', () => {
      try {
        const json = raw ? JSON.parse(raw) : {};
        cb(json);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON payload' }));
      }
    });
  }

  // GET /api/challenges
  if (pathname === '/api/challenges' && method === 'GET') {
    return getChallenges(req, res);
  }

  // GET /api/challenges/:id
  if (pathname.startsWith('/api/challenges/') && method === 'GET') {
    const id = pathname.split('/')[3];
    return getChallengeById(req, res, id);
  }

  // POST /api/submissions
  if (pathname === '/api/submissions' && method === 'POST') {
    return parseBody(body => submitAssessment(req, res, body));
  }

  // GET /api/passports/:id
  if (pathname.startsWith('/api/passports/') && method === 'GET') {
    const id = pathname.split('/')[3];
    return getPassport(req, res, id);
  }

  // GET /api/verify/:id
  if (pathname.startsWith('/api/verify/') && method === 'GET') {
    const id = pathname.split('/')[3];
    return verifyPassport(req, res, id);
  }

  // GET /api/jobs
  if (pathname === '/api/jobs' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(db.getCollection('jobs')));
  }

  // GET /api/candidates
  if (pathname === '/api/candidates' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(db.getCollection('studentProfiles')));
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
};

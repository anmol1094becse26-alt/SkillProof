/**
 * SKILLPROOF - CENTRAL REST API ROUTER
 */

const { getChallenges, getChallengeById, submitAssessment } = require('../controllers/assessmentController');
const { getPassport, verifyPassport } = require('../controllers/passportController');
const db = require('../config/db');
const ai = require('../ai');

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

  // ── POST /api/generate-challenge ─────────────────────────────────────────
  if (pathname === '/api/generate-challenge' && method === 'POST') {
    return parseBody(async (body) => {
      const { skill, difficulty, style, context } = body;
      if (!skill || !difficulty || !style) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'skill, difficulty, and style are required.' }));
      }
      try {
        const challenge = await ai.generateChallenge({ skill, difficulty, style, context });
        // Normalize to match existing schema
        const challengeId = 'chl_ai_' + Date.now();
        const normalized = {
          challengeId,
          title: challenge.title,
          description: challenge.problem_statement,
          category: challenge.category || skill,
          difficulty: challenge.difficulty || difficulty,
          durationMinutes: challenge.duration_minutes || 30,
          requiredSkills: challenge.required_skills || [skill],
          testCases: (challenge.test_cases || []).map(tc => ({
            type: tc.type || 'visible',
            name: tc.name,
            input: tc.input,
            expected: tc.expected,
            explanation: tc.explanation || ''
          })),
          starterCode: { javascript: challenge.starter_code || '// Write your solution here\n' },
          requirements: challenge.requirements || [],
          evaluationRubric: challenge.evaluation_rubric || {},
          verificationQuestions: challenge.verification_questions || [],
          aiGenerated: true,
          createdAt: new Date().toISOString()
        };
        // Persist to in-memory store; Supabase insert happens from the frontend on "Publish"
        db.set('challenges', challengeId, normalized);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, challenge: normalized }));
      } catch (err) {
        console.error('[AI] generate-challenge error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }

  // ── POST /api/generate-followup ─────────────────────────────────────────
  if (pathname === '/api/generate-followup' && method === 'POST') {
    return parseBody(async (body) => {
      const { challengeTitle, challengeProblem, studentCode } = body;
      if (!studentCode || !challengeTitle) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'challengeTitle and studentCode are required.' }));
      }
      try {
        const result = await ai.generateFollowUpQuestions({ challengeTitle, challengeProblem, studentCode });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, questions: result.questions || [] }));
      } catch (err) {
        console.error('[AI] generate-followup error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }

  // ── POST /api/evaluate-submission ─────────────────────────────────────────
  if (pathname === '/api/evaluate-submission' && method === 'POST') {
    return parseBody(async (body) => {
      const { challengeTitle, rubric, studentCode, followUpQuestions, followUpAnswers } = body;
      if (!studentCode || !challengeTitle || !followUpQuestions) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'challengeTitle, studentCode, and followUpQuestions are required.' }));
      }
      try {
        const result = await ai.evaluateSubmission({ challengeTitle, rubric, studentCode, followUpQuestions, followUpAnswers });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, evaluation: result }));
      } catch (err) {
        console.error('[AI] evaluate-submission error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
};

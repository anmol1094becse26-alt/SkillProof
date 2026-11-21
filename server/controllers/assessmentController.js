/**
 * SKILLPROOF - ASSESSMENT & EVALUATION CONTROLLER
 */

const db = require('../config/db');
const { checkSubmissionIntegrity } = require('../utils/similarityChecker');

function getChallenges(req, res) {
  const challenges = db.getCollection('challenges');
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(challenges));
}

function getChallengeById(req, res, id) {
  const challenge = db.getById('challenges', id);
  if (!challenge) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Challenge not found' }));
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(challenge));
}

function submitAssessment(req, res, body) {
  const { studentId, challengeId, code, explanation, followUpAnswers } = body;
  const challenge = db.getById('challenges', challengeId);
  const prior = db.getCollection('submissions');

  const integrity = checkSubmissionIntegrity(code, challenge || {}, prior);
  const subId = 'sub_' + Date.now();
  const evalId = 'eval_' + Date.now();

  const submission = db.set('submissions', subId, {
    submissionId: subId,
    studentId,
    challengeId,
    code,
    explanation,
    followUpAnswers,
    submittedAt: new Date().toISOString(),
    status: 'evaluated',
    evaluationId: evalId
  });

  const evaluation = db.set('evaluations', evalId, {
    evaluationId: evalId,
    submissionId: subId,
    studentId,
    challengeId,
    totalScore: integrity.isFlagged ? 65 : 95,
    similarityScore: integrity.similarityScore,
    verificationStatus: integrity.verificationStatus,
    evaluatedAt: new Date().toISOString()
  });

  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ submission, evaluation }));
}

module.exports = {
  getChallenges,
  getChallengeById,
  submitAssessment
};

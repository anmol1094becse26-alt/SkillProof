/**
 * SKILLPROOF - PASSPORT & VERIFICATION CONTROLLER
 */

const db = require('../config/db');

function getPassport(req, res, passportId) {
  const passport = db.getById('skillPassports', passportId);
  if (!passport) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Passport not found' }));
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(passport));
}

function verifyPassport(req, res, passportId) {
  const passport = db.getById('skillPassports', passportId);
  if (!passport) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ valid: false, error: 'Passport not found' }));
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    valid: true,
    passportId: passport.passportId,
    studentName: passport.studentName,
    university: passport.university,
    trustScore: passport.trustScore,
    verifiedSkills: passport.verifiedSkills,
    cryptographicSeal: passport.cryptographicSeal,
    issuedAt: passport.issuedAt
  }));
}

module.exports = {
  getPassport,
  verifyPassport
};

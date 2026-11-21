/**
 * SKILLPROOF - SERVER SEED DATASET
 */

const fs = require('fs');
const path = require('path');

// Reference client seed data or export unified dataset
const appSeedPath = path.join(__dirname, '..', '..', 'app', 'js', 'seed-data.js');

let seedData = {};
if (fs.existsSync(appSeedPath)) {
  const content = fs.readFileSync(appSeedPath, 'utf8');
  const sandbox = {};
  const fn = new Function('window', content + '; return SEED_DATA;');
  seedData = fn(sandbox);
}

module.exports = seedData;

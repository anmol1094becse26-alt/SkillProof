/**
 * SKILLPROOF - AST STRUCTURE & JACCARD TOKEN SIMILARITY CHECKER
 * Identifies plagiarized submissions (>85% token structural overlap).
 */

function tokenize(code) {
  if (!code) return new Set();
  const clean = code
    .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
    .replace(/'[^']*'|"[^"]*"|`[^`]*`/g, 'STR')
    .replace(/\b\d+\b/g, 'NUM')
    .replace(/\b(let|var|const|function|return|if|else|for|while|class|constructor)\b/g, '$1')
    .replace(/[^a-zA-Z0-9_$]/g, ' ')
    .toLowerCase();

  const words = clean.split(/\s+/).filter(w => w.length > 1);
  const trigrams = new Set();
  for (let i = 0; i < words.length - 2; i++) {
    trigrams.add(`${words[i]}_${words[i + 1]}_${words[i + 2]}`);
  }
  return trigrams;
}

function calculateSimilarity(codeA, codeB) {
  const setA = tokenize(codeA);
  const setB = tokenize(codeB);
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : Math.round((intersection / union) * 100);
}

function checkSubmissionIntegrity(code, challenge, priorSubmissions = []) {
  let maxSim = 0;
  for (const sub of priorSubmissions) {
    if (sub.code && sub.challengeId === challenge.challengeId) {
      const sim = calculateSimilarity(code, sub.code);
      if (sim > maxSim) maxSim = sim;
    }
  }

  const isFlagged = maxSim > 85;
  return {
    similarityScore: maxSim,
    astUniqueness: Math.max(0, 100 - maxSim),
    verificationStatus: isFlagged ? 'Under Review' : 'Approved',
    isFlagged
  };
}

module.exports = {
  tokenize,
  calculateSimilarity,
  checkSubmissionIntegrity
};

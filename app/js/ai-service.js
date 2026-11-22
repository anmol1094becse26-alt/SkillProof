/**
 * SKILLPROOF — AI Agent Service (Frontend)
 * All calls go to the secure backend at /api — API key NEVER lives in browser.
 * Port 5001 = Node API server; falls back to relative path when served together.
 */

const AIService = (() => {
  // Auto-detect: if served by C# on 5000, Node API is on 5001
  const API_BASE = (() => {
    if (window.location.port === '5000') return 'http://localhost:5001';
    return '';
  })();

  /**
   * Shows/hides a named loading overlay inside a given element.
   */
  function setLoading(containerId, loading, message = 'AI Agent working...') {
    const el = document.getElementById(containerId);
    if (!el) return;
    const existing = el.querySelector('.ai-loading-overlay');
    if (loading) {
      if (existing) return;
      const overlay = document.createElement('div');
      overlay.className = 'ai-loading-overlay absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20 rounded-2xl';
      overlay.innerHTML = `
        <div class="flex gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-brand animate-bounce" style="animation-delay:0s"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-brand animate-bounce" style="animation-delay:.15s"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-brand animate-bounce" style="animation-delay:.3s"></span>
        </div>
        <p class="text-xs font-semibold text-brand font-mono">${message}</p>
      `;
      el.style.position = 'relative';
      el.appendChild(overlay);
    } else {
      if (existing) existing.remove();
    }
  }

  /**
   * POST a JSON body to our backend and return the parsed response.
   */
  async function post(endpoint, payload) {
    const resp = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await resp.json();
    if (!resp.ok || data.error) throw new Error(data.error || `HTTP ${resp.status}`);
    return data;
  }

  /**
   * 1. Generate a challenge from the AI agent.
   * Returns the full normalized challenge object.
   */
  async function generateChallenge({ skill, difficulty, style, context, loadingContainerId }) {
    if (loadingContainerId) setLoading(loadingContainerId, true, 'AI Agent crafting real-world task...');
    try {
      const data = await post('/api/generate-challenge', { skill, difficulty, style, context });
      return data.challenge;
    } finally {
      if (loadingContainerId) setLoading(loadingContainerId, false);
    }
  }

  /**
   * 2. Generate 2 personalized follow-up questions for a student's submitted code.
   */
  async function generateFollowUp({ challengeTitle, challengeProblem, studentCode, loadingContainerId }) {
    if (loadingContainerId) setLoading(loadingContainerId, true, 'AI Agent analyzing your code...');
    try {
      const data = await post('/api/generate-followup', { challengeTitle, challengeProblem, studentCode });
      return data.questions;
    } finally {
      if (loadingContainerId) setLoading(loadingContainerId, false);
    }
  }

  /**
   * 3. Evaluate code + follow-up answers — returns ai_score, reviewer_notes, verification_status.
   */
  async function evaluateSubmission({ challengeTitle, rubric, studentCode, followUpQuestions, followUpAnswers, loadingContainerId }) {
    if (loadingContainerId) setLoading(loadingContainerId, true, 'AI Agent scoring your submission...');
    try {
      const data = await post('/api/evaluate-submission', { challengeTitle, rubric, studentCode, followUpQuestions, followUpAnswers });
      return data.evaluation;
    } finally {
      if (loadingContainerId) setLoading(loadingContainerId, false);
    }
  }

  return { generateChallenge, generateFollowUp, evaluateSubmission, setLoading };
})();

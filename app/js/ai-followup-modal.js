/**
 * SKILLPROOF — AI Follow-Up Questions Modal (Anti-Cheat Proof-of-Understanding)
 * Triggered after student runs tests; replaces static verification modal.
 * Requires: ai-service.js, db-service.js, trust-score.js, passport-service.js, notification-service.js
 *
 * Usage:
 *   AIFollowUpModal.open({ challenge, evaluation, code, currentUser, onComplete });
 */

const AIFollowUpModal = (() => {
  let _ctx = {};  // { challenge, evaluation, code, currentUser, onComplete }
  let _questions = [];
  let _aiEval = null;

  // ── Inject HTML ────────────────────────────────────────────────────────
  function _injectHTML() {
    if (document.getElementById('fu-modal')) return;
    const tpl = `
    <!-- SkillProof AI Follow-Up Questions Modal -->
    <div id="fu-modal" class="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-[70] flex items-center justify-center p-3 hidden">
      <div class="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">

        <!-- Header -->
        <div class="bg-gradient-to-r from-[#0B1C30] to-[#213145] p-5 text-white flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl text-mintLight">psychology</span>
            </div>
            <div>
              <h3 class="text-base font-bold">Proof-of-Understanding Defense</h3>
              <p class="text-xs text-slate-300 font-mono">AI Agent is analyzing your code...</p>
            </div>
          </div>
        </div>

        <!-- Loading Phase -->
        <div id="fu-loading" class="p-10 flex flex-col items-center gap-4">
          <div class="flex gap-2">
            <span class="w-3 h-3 rounded-full bg-brand animate-bounce" style="animation-delay:0s"></span>
            <span class="w-3 h-3 rounded-full bg-brand animate-bounce" style="animation-delay:.15s"></span>
            <span class="w-3 h-3 rounded-full bg-brand animate-bounce" style="animation-delay:.3s"></span>
          </div>
          <p class="text-sm font-semibold text-brand font-mono" id="fu-loading-msg">AI Agent analyzing your code...</p>
          <p class="text-xs text-slate-500 text-center max-w-xs">Generating personalized questions based on your specific implementation choices.</p>
        </div>

        <!-- Questions Phase -->
        <div id="fu-questions-phase" class="hidden overflow-y-auto flex-1">
          <div class="p-6 space-y-5">
            <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <span class="material-symbols-outlined text-sm mt-0.5 text-amber-600">gavel</span>
              <span>Answer these questions about <strong>your specific code</strong>. Vague answers will lower your Trust Score. The AI reviews both your code and your explanations together.</span>
            </div>

            <div id="fu-code-preview" class="p-4 bg-slate-900 rounded-xl border border-slate-700 overflow-x-auto">
              <p class="text-[10px] text-slate-400 font-mono uppercase mb-2">Your Submitted Code</p>
              <pre id="fu-code-text" class="font-mono text-xs text-green-300 whitespace-pre-wrap"></pre>
            </div>

            <div class="space-y-5" id="fu-qs-container">
              <!-- Populated dynamically -->
            </div>

            <div id="fu-error" class="hidden p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <span class="material-symbols-outlined text-sm mt-0.5">error</span>
              <span id="fu-error-text"></span>
            </div>

            <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button onclick="AIFollowUpModal.close()" class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button onclick="AIFollowUpModal._submit()" id="fu-submit-btn"
                class="px-5 py-2.5 bg-brand hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-brand/20 flex items-center gap-2 transition-all">
                <span class="material-symbols-outlined text-sm">lock</span>
                <span>Submit & Get AI Score</span>
              </button>
            </div>
          </div>
        </div>

        <!-- AI Evaluation Result Phase -->
        <div id="fu-result-phase" class="hidden p-6 space-y-5 overflow-y-auto flex-1">
          <div id="fu-result-banner" class="p-4 rounded-xl border flex items-start gap-3">
            <span class="material-symbols-outlined text-2xl" id="fu-result-icon">verified</span>
            <div>
              <p class="font-bold text-sm" id="fu-result-title">AI Pre-Verified</p>
              <p class="text-xs text-slate-600 mt-0.5" id="fu-result-subtitle"></p>
            </div>
          </div>

          <!-- Score doughnut display -->
          <div class="flex items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div class="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 36 36" class="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" stroke-width="3.2"/>
                <circle id="fu-score-ring" cx="18" cy="18" r="15.9" fill="none" stroke="#0152D9" stroke-width="3.2"
                  stroke-dasharray="0 100" stroke-linecap="round" style="transition: stroke-dasharray 1s ease"/>
              </svg>
              <span id="fu-score-num" class="absolute inset-0 flex items-center justify-center font-bold text-xl text-ink font-mono">—</span>
            </div>
            <div>
              <p class="text-xs text-slate-500 uppercase font-mono mb-1">AI Trust Score</p>
              <p class="font-bold text-2xl text-ink" id="fu-score-big">—</p>
              <p class="text-xs text-slateMuted mt-1">Out of 100 · Cryptographic seal will reflect this score</p>
            </div>
          </div>

          <!-- Reviewer Notes -->
          <div class="space-y-3">
            <p class="font-bold text-ink text-sm">AI Reviewer Notes</p>
            <p class="text-xs text-slate-700 leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-200" id="fu-notes-text"></p>
          </div>

          <!-- Strengths / Gaps -->
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
              <p class="font-bold text-emerald-800 flex items-center gap-1"><span class="material-symbols-outlined text-sm">thumb_up</span>Strengths</p>
              <ul id="fu-strengths" class="space-y-1 text-emerald-900 list-disc list-inside"></ul>
            </div>
            <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
              <p class="font-bold text-amber-800 flex items-center gap-1"><span class="material-symbols-outlined text-sm">flag</span>Areas to Improve</p>
              <ul id="fu-gaps" class="space-y-1 text-amber-900 list-disc list-inside"></ul>
            </div>
          </div>

          <div class="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button onclick="AIFollowUpModal._finalSubmit()" id="fu-final-btn"
              class="px-5 py-2.5 bg-brand hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-brand/20 flex items-center gap-2 transition-all">
              <span class="material-symbols-outlined text-sm">verified</span>
              <span>Mint Seal & Save to Passport</span>
            </button>
          </div>
        </div>

      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', tpl);
  }

  // ── Open modal & trigger AI question generation ─────────────────────
  async function open(ctx) {
    _injectHTML();
    _ctx = ctx;
    _questions = [];
    _aiEval = null;

    // Show modal in loading state
    document.getElementById('fu-modal').classList.remove('hidden');
    document.getElementById('fu-loading').classList.remove('hidden');
    document.getElementById('fu-questions-phase').classList.add('hidden');
    document.getElementById('fu-result-phase').classList.add('hidden');

    try {
      _questions = await AIService.generateFollowUp({
        challengeTitle: ctx.challenge.title,
        challengeProblem: ctx.challenge.description || ctx.challenge.problem_statement || '',
        studentCode: ctx.code
      });

      _renderQuestions();
    } catch (err) {
      // Fallback: show generic questions if AI fails
      _questions = [
        'Explain the main algorithm or approach you used in your solution and why you chose it.',
        'What are the edge cases your solution handles, and how does it behave with unexpected input?'
      ];
      _renderQuestions();
      if (typeof NotificationService !== 'undefined') {
        NotificationService.showToast('AI Note', 'Using fallback questions (AI offline or key missing).', 'warning');
      }
    }
  }

  function _renderQuestions() {
    // Show code preview
    document.getElementById('fu-code-text').textContent = _ctx.code || '';

    // Build question textareas
    const container = document.getElementById('fu-qs-container');
    container.innerHTML = _questions.map((q, i) => `
      <div class="space-y-2">
        <label class="block font-bold text-ink text-xs">Question ${i+1}</label>
        <p class="text-xs text-slateMuted p-3 bg-blue-50 rounded-xl border border-blue-200 font-medium leading-relaxed">${q}</p>
        <textarea id="fu-answer-${i}" rows="3" required
          placeholder="Your answer here — be specific about your code..."
          class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none leading-relaxed"></textarea>
      </div>
    `).join('');

    // Transition phases
    document.getElementById('fu-loading').classList.add('hidden');
    document.getElementById('fu-questions-phase').classList.remove('hidden');
  }

  // ── Collect answers & call AI evaluator ──────────────────────────────
  async function _submit() {
    const answers = _questions.map((_, i) => (document.getElementById(`fu-answer-${i}`)?.value || '').trim());
    if (answers.some(a => a.length < 10)) {
      document.getElementById('fu-error').classList.remove('hidden');
      document.getElementById('fu-error-text').textContent = 'Please provide a meaningful answer to each question (at least 10 characters each).';
      return;
    }
    document.getElementById('fu-error').classList.add('hidden');

    const submitBtn = document.getElementById('fu-submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">refresh</span><span>AI Scoring...</span>`;

    try {
      _aiEval = await AIService.evaluateSubmission({
        challengeTitle: _ctx.challenge.title,
        rubric: _ctx.challenge.evaluationRubric || {},
        studentCode: _ctx.code,
        followUpQuestions: _questions,
        followUpAnswers: answers
      });
    } catch (err) {
      // Graceful fallback score
      _aiEval = {
        ai_score: 72,
        reviewer_notes: 'AI evaluation unavailable — manual review required. Score is provisional.',
        verification_status: 'Pending Review',
        strengths: ['Submitted code and explanations recorded.'],
        gaps: ['AI scoring offline — a human reviewer will assess this submission.']
      };
    }

    _ctx._followUpQuestions = _questions;
    _ctx._followUpAnswers = answers;

    _renderResult(_aiEval);
  }

  function _renderResult(evalResult) {
    const score = evalResult.ai_score || 0;
    const isVerified = evalResult.verification_status === 'AI Pre-Verified';

    // Banner
    const banner = document.getElementById('fu-result-banner');
    banner.className = `p-4 rounded-xl border flex items-start gap-3 ${isVerified ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`;
    document.getElementById('fu-result-icon').textContent = isVerified ? 'verified' : 'pending';
    document.getElementById('fu-result-icon').className = `material-symbols-outlined text-2xl ${isVerified ? 'text-emerald-600' : 'text-amber-600'}`;
    document.getElementById('fu-result-title').textContent = evalResult.verification_status;
    document.getElementById('fu-result-subtitle').textContent = isVerified
      ? 'Your code and explanations demonstrate genuine understanding.'
      : 'A human reviewer will check your submission before final approval.';

    // Score ring
    document.getElementById('fu-score-num').textContent = score;
    document.getElementById('fu-score-big').textContent = score + '/100';
    const ring = document.getElementById('fu-score-ring');
    ring.setAttribute('stroke', isVerified ? '#006B49' : '#d97706');
    setTimeout(() => ring.setAttribute('stroke-dasharray', `${score} 100`), 100);

    // Notes
    document.getElementById('fu-notes-text').textContent = evalResult.reviewer_notes || '—';

    // Strengths / Gaps
    const sList = document.getElementById('fu-strengths');
    const gList = document.getElementById('fu-gaps');
    sList.innerHTML = (evalResult.strengths || ['Good attempt.']).map(s => `<li>${s}</li>`).join('');
    gList.innerHTML  = (evalResult.gaps     || ['Keep practicing.']).map(g => `<li>${g}</li>`).join('');

    // Phase transition
    document.getElementById('fu-questions-phase').classList.add('hidden');
    document.getElementById('fu-result-phase').classList.remove('hidden');
  }

  // ── Final submission: save to DB + mint passport seal ──────────────────
  async function _finalSubmit() {
    const finalBtn = document.getElementById('fu-final-btn');
    finalBtn.disabled = true;
    finalBtn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">refresh</span><span>Minting Seal...</span>`;

    try {
      const { challenge, evaluation, code, currentUser } = _ctx;
      const aiScore    = _aiEval?.ai_score ?? 75;
      const aiStatus   = _aiEval?.verification_status ?? 'Pending Review';
      const aiNotes    = _aiEval?.reviewer_notes ?? '';
      const fqAnswers  = _ctx._followUpAnswers || [];

      // ── Compute trust score using existing TrustScoreEngine ────────────
      const pastEvals  = await DBService.getEvaluations(currentUser.uid);
      const pastScores = pastEvals.map(ev => ev.totalScore || 85);

      const trustBreakdown = TrustScoreEngine.computeTrustScore({
        S_perf:          evaluation?.S_perf || aiScore,
        explanationText: fqAnswers.join(' '),
        followUpAnswers: { q1: fqAnswers[0], q2: fqAnswers[1] },
        pastScores,
        similarityScore: evaluation?.similarityScore || 0
      });

      // Blend AI score (60%) and trust score (40%) for final
      const finalScore = Math.round(aiScore * 0.6 + trustBreakdown.trustScore * 0.4);

      // ── Save submission ─────────────────────────────────────────────────
      const subId  = 'sub_' + Date.now();
      const evalId = 'eval_' + Date.now();

      await DBService.createSubmission({
        submissionId:         subId,
        studentId:            currentUser.uid,
        challengeId:          challenge.challengeId,
        language:             'javascript',
        code,
        explanation:          fqAnswers[0] || '',
        followUpAnswers:      { q1: fqAnswers[0], q2: fqAnswers[1] },
        followUpQuestions:    _questions,
        aiScore,
        aiNotes,
        submittedAt:          new Date().toISOString(),
        status:               'evaluated',
        evaluationId:         evalId,
        verificationStatus:   aiStatus
      });

      // ── Save evaluation ─────────────────────────────────────────────────
      await DBService.createEvaluation({
        evaluationId:      evalId,
        submissionId:      subId,
        studentId:         currentUser.uid,
        challengeId:       challenge.challengeId,
        totalScore:        finalScore,
        aiScore,
        aiNotes,
        verificationStatus: aiStatus,
        skillScores:       evaluation?.skillScores || {},
        passedTests:       evaluation?.passedTests || 0,
        totalTests:        evaluation?.totalTests  || 0,
        testResults:       evaluation?.testResults || [],
        similarityScore:   evaluation?.similarityScore || 0,
        evaluatedAt:       new Date().toISOString()
      });

      // ── Update / mint passport ──────────────────────────────────────────
      let passport = await DBService.getPassportByStudentId(currentUser.uid);
      const studentProfile = await DBService.getStudentProfile(currentUser.uid);

      if (!passport) {
        passport = {
          passportId:    'SKP-' + Math.floor(1000 + Math.random() * 9000),
          studentId:     currentUser.uid,
          studentName:   currentUser.name,
          university:    (studentProfile && studentProfile.university) || 'University',
          course:        (studentProfile && studentProfile.course)     || 'Computer Science',
          assessmentCount: 0,
          verifiedSkills: [],
          issuedAt:      new Date().toISOString()
        };
      }

      const verifiedList = passport.verifiedSkills ? [...passport.verifiedSkills] : [];
      (challenge.requiredSkills || []).forEach(sk => {
        const score = finalScore;
        const level = PassportService.getMasteryLevel(score);
        const idx   = verifiedList.findIndex(v => v.skill.toLowerCase() === sk.toLowerCase());
        const entry = { skill: sk, score, level, verifiedAt: new Date().toISOString().split('T')[0], challengeTitle: challenge.title };
        if (idx >= 0) verifiedList[idx] = entry; else verifiedList.push(entry);
      });

      passport.verifiedSkills    = verifiedList;
      passport.assessmentCount   = (passport.assessmentCount || 0) + 1;
      passport.trustScore        = finalScore;
      passport.verificationStatus = aiStatus;
      passport.aiVerificationNotes = aiNotes;
      passport.updatedAt         = new Date().toISOString();
      passport.cryptographicSeal = await PassportService.generatePassportSeal(passport);
      passport.publicVerificationUrl = `verify.html?id=${passport.passportId}`;

      await DBService.savePassport(passport);

      await DBService.createNotification({
        userId:  currentUser.uid,
        title:   'Skill Passport Updated',
        message: `"${challenge.title}" scored ${finalScore}/100 · Status: ${aiStatus}. SHA-256 seal minted.`,
        type:    'passport',
        link:    'my-skills-and-passport.html'
      });

      NotificationService.showToast('Submission Complete', `Trust Score: ${finalScore}/100 — ${aiStatus}`, 'success');
      close();
      setTimeout(() => window.location.href = 'my-skills-and-passport.html', 800);

    } catch (err) {
      console.error('[FU] Final submit error:', err);
      NotificationService.showToast('Error', err.message, 'error');
      finalBtn.disabled = false;
      finalBtn.innerHTML = `<span class="material-symbols-outlined text-sm">verified</span><span>Mint Seal & Save to Passport</span>`;
    }
  }

  function close() {
    const m = document.getElementById('fu-modal');
    if (m) m.classList.add('hidden');
  }

  return { open, close, _submit, _finalSubmit };
})();

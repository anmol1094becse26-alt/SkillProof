/**
 * SKILLPROOF — Challenge Generator Modal
 * Self-contained: injects the modal DOM + handles all interaction.
 * Requires: ai-service.js, db-service.js, notification-service.js
 *
 * Usage:
 *   ChallengeGeneratorModal.open({ onPublish: (challenge) => ... });
 */

const ChallengeGeneratorModal = (() => {
  let _onPublish = null;
  let _generatedChallenge = null;

  // ── Inject modal HTML once ─────────────────────────────────────────────
  function _injectHTML() {
    if (document.getElementById('cg-modal')) return;
    const tpl = `
    <!-- SkillProof AI Challenge Generator Modal -->
    <div id="cg-modal" class="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-[60] flex items-center justify-center p-3 hidden">
      <div class="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">

        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-brand to-indigo-600 p-5 text-white flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">auto_awesome</span>
            </div>
            <div>
              <h3 class="text-base font-bold">AI Challenge Generator</h3>
              <p class="text-xs text-blue-100 font-mono">Powered by Gemini · Secure server-side generation</p>
            </div>
          </div>
          <button onclick="ChallengeGeneratorModal.close()" class="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Two-step content area -->
        <div class="overflow-y-auto flex-1" id="cg-body">

          <!-- STEP 1: Input Form -->
          <div id="cg-step-1" class="p-6 space-y-5">
            <div class="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-brand flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">info</span>
              <span>The AI agent generates a complete, realistic workplace task — no textbook trivia. All generation happens securely on the server.</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <!-- Skill Track -->
              <div class="sm:col-span-2">
                <label class="block font-bold text-ink mb-1.5">Skill / Role Track <span class="text-rose-500">*</span></label>
                <input id="cg-skill" type="text" placeholder="e.g. C Programming, Frontend HTML/CSS/JS, Python Data Processing..."
                  class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 font-mono" />
              </div>

              <!-- Difficulty -->
              <div>
                <label class="block font-bold text-ink mb-1.5">Difficulty Level <span class="text-rose-500">*</span></label>
                <div class="grid grid-cols-3 gap-2" id="cg-difficulty-group">
                  <button type="button" onclick="ChallengeGeneratorModal._pickDiff(this,'Beginner')"
                    class="cg-diff-btn py-2 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold transition-all">Beginner</button>
                  <button type="button" onclick="ChallengeGeneratorModal._pickDiff(this,'Intermediate')"
                    class="cg-diff-btn py-2 rounded-xl border-2 border-slate-200 text-slate-500 font-semibold hover:border-blue-300 transition-all">Intermediate</button>
                  <button type="button" onclick="ChallengeGeneratorModal._pickDiff(this,'Advanced')"
                    class="cg-diff-btn py-2 rounded-xl border-2 border-slate-200 text-slate-500 font-semibold hover:border-rose-300 transition-all">Advanced</button>
                </div>
                <input type="hidden" id="cg-difficulty" value="Beginner">
              </div>

              <!-- Task Style -->
              <div>
                <label class="block font-bold text-ink mb-1.5">Task Style <span class="text-rose-500">*</span></label>
                <select id="cg-style" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30">
                  <option value="Debug Broken Code">🐛 Debug Broken Code</option>
                  <option value="Build Mini Feature">⚙️ Build Mini Feature</option>
                  <option value="Fix Edge Cases">🔬 Fix Edge Cases</option>
                  <option value="Explain & Refactor">📋 Explain & Refactor</option>
                </select>
              </div>

              <!-- Custom Context -->
              <div class="sm:col-span-2">
                <label class="block font-bold text-ink mb-1.5">Custom Context <span class="text-slate-400 font-normal">(optional)</span></label>
                <textarea id="cg-context" rows="2" placeholder='e.g. "1st-semester C pointer/loop bug" or "Responsive navbar layout issue for a fintech app"'
                  class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"></textarea>
              </div>
            </div>

            <!-- Error display -->
            <div id="cg-error" class="hidden p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <span class="material-symbols-outlined text-sm mt-0.5">error</span>
              <span id="cg-error-text"></span>
            </div>

            <div class="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button onclick="ChallengeGeneratorModal.close()" class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button onclick="ChallengeGeneratorModal._generate()" id="cg-generate-btn"
                class="px-5 py-2.5 bg-brand hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-brand/20 flex items-center gap-2 transition-all">
                <span class="material-symbols-outlined text-sm">auto_awesome</span>
                <span>Generate with AI</span>
              </button>
            </div>
          </div>

          <!-- STEP 2: Preview / Edit / Publish -->
          <div id="cg-step-2" class="hidden p-6 space-y-5">
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              <span>Challenge generated! Review and edit below, then click <strong>Publish Challenge</strong> to make it live.</span>
            </div>

            <div class="space-y-4 text-xs">
              <div>
                <label class="block font-bold text-ink mb-1">Title</label>
                <input id="cg-prev-title" type="text" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 font-semibold" />
              </div>
              <div>
                <label class="block font-bold text-ink mb-1">Problem Statement</label>
                <textarea id="cg-prev-desc" rows="4" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none leading-relaxed"></textarea>
              </div>
              <div>
                <label class="block font-bold text-ink mb-1">Starter Code / Scenario</label>
                <textarea id="cg-prev-code" rows="8" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 bg-slate-900 text-green-300 resize-none"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block font-bold text-ink mb-1">Requirements (one per line)</label>
                  <textarea id="cg-prev-reqs" rows="4" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"></textarea>
                </div>
                <div>
                  <label class="block font-bold text-ink mb-1">Verification Questions (one per line)</label>
                  <textarea id="cg-prev-vqs" rows="4" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"></textarea>
                </div>
              </div>

              <!-- Test Cases summary (read-only) -->
              <div>
                <label class="block font-bold text-ink mb-1">AI-Generated Test Cases <span class="text-slate-400 font-normal">(auto-applied)</span></label>
                <div id="cg-prev-cases" class="space-y-2"></div>
              </div>

              <!-- Rubric -->
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <p class="font-bold text-ink mb-2">Evaluation Rubric</p>
                <div id="cg-prev-rubric" class="space-y-1"></div>
              </div>
            </div>

            <div id="cg-publish-error" class="hidden p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <span class="material-symbols-outlined text-sm mt-0.5">error</span>
              <span id="cg-publish-error-text"></span>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-slate-100">
              <button onclick="ChallengeGeneratorModal._backToForm()" class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">arrow_back</span>
                Regenerate
              </button>
              <button onclick="ChallengeGeneratorModal._publish()" id="cg-publish-btn"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all">
                <span class="material-symbols-outlined text-sm">publish</span>
                <span>Publish Challenge</span>
              </button>
            </div>
          </div>

        </div><!-- /cg-body -->
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', tpl);
  }

  // ── Difficulty picker ─────────────────────────────────────────────────
  function _pickDiff(btn, value) {
    document.getElementById('cg-difficulty').value = value;
    document.querySelectorAll('.cg-diff-btn').forEach(b => {
      b.className = 'cg-diff-btn py-2 rounded-xl border-2 border-slate-200 text-slate-500 font-semibold hover:border-blue-300 transition-all';
    });
    const colors = { Beginner: 'border-emerald-500 bg-emerald-50 text-emerald-700', Intermediate: 'border-brand bg-blue-50 text-brand', Advanced: 'border-rose-500 bg-rose-50 text-rose-700' };
    btn.className = `cg-diff-btn py-2 rounded-xl border-2 font-semibold transition-all ${colors[value]}`;
  }

  // ── Show error ─────────────────────────────────────────────────────────
  function _showError(id, msg) {
    const el = document.getElementById(id);
    const txt = document.getElementById(id + '-text') || el;
    if (el) el.classList.remove('hidden');
    if (txt) txt.textContent = msg;
  }
  function _hideError(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  }

  // ── GENERATE ──────────────────────────────────────────────────────────
  async function _generate() {
    _hideError('cg-error');
    const skill = document.getElementById('cg-skill').value.trim();
    const difficulty = document.getElementById('cg-difficulty').value;
    const style = document.getElementById('cg-style').value;
    const context = document.getElementById('cg-context').value.trim();

    if (!skill) return _showError('cg-error', 'Please enter a skill or role track.');

    const btn = document.getElementById('cg-generate-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">refresh</span> <span>Generating...</span>`;

    try {
      const challenge = await AIService.generateChallenge({ skill, difficulty, style, context });
      _generatedChallenge = challenge;
      _populatePreview(challenge);
      document.getElementById('cg-step-1').classList.add('hidden');
      document.getElementById('cg-step-2').classList.remove('hidden');
    } catch (err) {
      _showError('cg-error', '⚠️ ' + (err.message || 'AI generation failed. Check your GEMINI_API_KEY in .env and restart the server.'));
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span class="material-symbols-outlined text-sm">auto_awesome</span><span>Generate with AI</span>`;
    }
  }

  // ── Populate preview ──────────────────────────────────────────────────
  function _populatePreview(c) {
    document.getElementById('cg-prev-title').value = c.title || '';
    document.getElementById('cg-prev-desc').value  = c.description || '';
    document.getElementById('cg-prev-code').value  = (c.starterCode && c.starterCode.javascript) || c.starter_code || '';
    document.getElementById('cg-prev-reqs').value  = (c.requirements || []).join('\n');
    document.getElementById('cg-prev-vqs').value   = (c.verificationQuestions || []).join('\n');

    // Test cases
    const casesEl = document.getElementById('cg-prev-cases');
    casesEl.innerHTML = (c.testCases || []).map((tc, i) => `
      <div class="p-2.5 rounded-xl border border-slate-200 bg-white font-mono text-[11px]">
        <div class="flex items-center justify-between mb-1">
          <span class="font-bold text-ink">Case ${i+1}: ${tc.name}</span>
          <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase text-[10px]">${tc.type}</span>
        </div>
        <div class="text-slate-500">Input: <span class="text-slate-800">${tc.input}</span></div>
        <div class="text-slate-500">Expected: <span class="text-emerald-700 font-semibold">${tc.expected}</span></div>
      </div>`).join('');

    // Rubric
    const rubric = c.evaluationRubric || {};
    const rubricEl = document.getElementById('cg-prev-rubric');
    const labels = { correctness: '✓ Correctness (50 pts)', code_quality: '📐 Code Quality (30 pts)', edge_cases: '🔬 Edge Cases (20 pts)' };
    rubricEl.innerHTML = Object.entries(labels).map(([k, label]) => `
      <div class="flex items-start gap-2 text-[11px]">
        <span class="font-bold text-ink w-40 shrink-0">${label}</span>
        <span class="text-slate-600">${rubric[k] || '—'}</span>
      </div>`).join('');
  }

  // ── Back to form ──────────────────────────────────────────────────────
  function _backToForm() {
    document.getElementById('cg-step-2').classList.add('hidden');
    document.getElementById('cg-step-1').classList.remove('hidden');
    _hideError('cg-publish-error');
  }

  // ── PUBLISH ────────────────────────────────────────────────────────────
  async function _publish() {
    _hideError('cg-publish-error');
    const publishBtn = document.getElementById('cg-publish-btn');
    publishBtn.disabled = true;
    publishBtn.innerHTML = `<span class="material-symbols-outlined text-sm animate-spin">refresh</span><span>Publishing...</span>`;

    // Read back potentially-edited values
    const updated = {
      ..._generatedChallenge,
      title:       document.getElementById('cg-prev-title').value.trim(),
      description: document.getElementById('cg-prev-desc').value.trim(),
      starterCode: { javascript: document.getElementById('cg-prev-code').value },
      requirements: document.getElementById('cg-prev-reqs').value.split('\n').map(s=>s.trim()).filter(Boolean),
      verificationQuestions: document.getElementById('cg-prev-vqs').value.split('\n').map(s=>s.trim()).filter(Boolean)
    };

    try {
      // Persist via DBService (which routes to Supabase or localStorage adapter)
      const saved = await DBService.createChallenge(updated);
      if (typeof NotificationService !== 'undefined') {
        NotificationService.showToast('Challenge Published', `"${updated.title}" is now live for students.`, 'success');
      }
      close();
      if (_onPublish) _onPublish(saved || updated);
    } catch (err) {
      _showError('cg-publish-error', 'Publish failed: ' + err.message);
    } finally {
      publishBtn.disabled = false;
      publishBtn.innerHTML = `<span class="material-symbols-outlined text-sm">publish</span><span>Publish Challenge</span>`;
    }
  }

  // ── Public API ─────────────────────────────────────────────────────────
  function open({ onPublish } = {}) {
    _injectHTML();
    _onPublish = onPublish || null;
    _generatedChallenge = null;
    // Reset to step 1
    const s1 = document.getElementById('cg-step-1');
    const s2 = document.getElementById('cg-step-2');
    if (s1) s1.classList.remove('hidden');
    if (s2) s2.classList.add('hidden');
    _hideError('cg-error');
    _hideError('cg-publish-error');
    document.getElementById('cg-modal').classList.remove('hidden');
    document.getElementById('cg-skill').focus();
  }

  function close() {
    const modal = document.getElementById('cg-modal');
    if (modal) modal.classList.add('hidden');
  }

  return { open, close, _generate, _publish, _backToForm, _pickDiff };
})();

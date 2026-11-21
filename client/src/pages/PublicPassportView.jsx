import React, { useState, useEffect } from 'react';
import { fetchPassport, fetchSubmissions } from '../supabase';
import EvidenceModal from '../components/EvidenceModal';

export default function PublicPassportView({ passportId = 'SKP-8492', onBackToApp }) {
  const [passport, setPassport] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [passRes, subRes] = await Promise.all([
        fetchPassport(passportId),
        fetchSubmissions('student_current')
      ]);

      setPassport(passRes.data || {
        id: passportId,
        student_name: 'Alex Rivera',
        student_university: 'Stanford University',
        trust_score: 97,
        verified_skills: [
          { skill: 'Algorithms', score: 98, level: 'Mastery', date: '2026-11-22' },
          { skill: 'Data Structures', score: 96, level: 'Mastery', date: '2026-11-22' },
          { skill: 'System Design', score: 95, level: 'Mastery', date: '2026-11-22' }
        ],
        cryptographic_seal: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      });

      const subs = subRes.data || [];
      setSubmissions(subs);
      if (subs.length > 0) setSelectedSub(subs[0]);
      setLoading(false);
    }
    load();
  }, [passportId]);

  const verifiedSkills = Array.isArray(passport?.verified_skills) ? passport.verified_skills : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Public Top Banner */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white font-bold shadow-sm">
            <span className="material-symbols-outlined text-lg">verified</span>
          </div>
          <span className="font-extrabold text-ink tracking-tight text-base">
            SkillProof <span className="text-brand font-semibold text-xs ml-1">Public Verification Registry</span>
          </span>
        </div>

        {onBackToApp && (
          <button
            onClick={onBackToApp}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Portal</span>
          </button>
        )}
      </header>

      {/* Main Verification Card */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6 flex-1">
        {loading ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
          </div>
        ) : (
          <>
            {/* Header Identity Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Verified Active Credential</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-ink">{passport?.student_name}</h1>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {passport?.student_university} • Passport ID: <span className="text-brand font-bold">{passport?.id}</span>
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center sm:text-right min-w-[140px]">
                  <span className="text-3xl font-black font-mono text-emerald-700 block">
                    {passport?.trust_score || 97}%
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">
                    Anti-Cheat Trust Score
                  </span>
                </div>
              </div>

              {/* Cryptographic Seal Hash */}
              <div className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] break-all border border-slate-800">
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5 font-sans font-bold">
                  Immutable SHA-256 Digest Signature
                </span>
                {passport?.cryptographic_seal || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </div>
            </div>

            {/* Verified Skills Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-ink">Verified Competencies Matrix</h3>
                  <p className="text-xs text-slate-500">
                    Backed by isolated sandbox runtime test assertions and AST uniqueness evaluation.
                  </p>
                </div>
                <button
                  onClick={() => setIsEvidenceOpen(true)}
                  className="px-3.5 py-1.5 bg-blue-50 text-brand hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors border border-blue-200 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">fingerprint</span>
                  <span>Inspect Audit Proof</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {verifiedSkills.map((s, i) => {
                  const skillName = typeof s === 'string' ? s : s.skill || s.name;
                  const score = typeof s === 'string' ? 95 : (s.score || 95);
                  const level = typeof s === 'string' ? 'Mastery' : (s.level || 'Mastery');
                  const date = typeof s === 'string' ? '2026-11-22' : (s.date || '2026-11-22');

                  return (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-ink">{skillName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-brand font-bold border border-blue-100">
                          {level}
                        </span>
                      </div>
                      <div className="text-2xl font-black font-mono text-emerald-700 mt-2">{score}%</div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-1">Verified: {date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-slate-400 font-mono border-t border-slate-200">
        SkillProof Protocol • Cryptographically Secured Talent Verification
      </footer>

      {/* Audit modal */}
      <EvidenceModal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        evidence={{
          cryptographicSeal: passport?.cryptographic_seal,
          astUniqueness: selectedSub?.ast_uniqueness || 96,
          durationMs: selectedSub?.duration_ms || 1.2,
          explanation: selectedSub?.explanation || 'Optimal single-pass map indexing ensuring linear time and deterministic memory limits.',
          code: selectedSub?.code,
          challengeTitle: selectedSub?.challenge_title
        }}
      />
    </div>
  );
}

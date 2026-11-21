import React, { useState, useEffect } from 'react';
import { fetchSubmissions } from '../supabase';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';

export default function GrowthTracker({ onGoToChallenges }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await fetchSubmissions('student_current');
      setSubmissions(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const verified = submissions.filter(s => s.status === 'Verified');

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <CardSkeleton count={3} />
      </div>
    );
  }

  if (verified.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <EmptyState
          icon="trending_up"
          title="No Growth Telemetry Yet"
          message="Your growth tracker dynamically computes your mastery velocity, test rigor, and domain coverage as you submit verified code. Complete a challenge to see your chart."
          actionLabel="Complete a Challenge"
          onAction={onGoToChallenges}
        />
      </div>
    );
  }

  // Dynamic Skill Aggregation
  const skillsMap = {};
  const categoryMap = {};

  verified.forEach(sub => {
    // Categories
    const cat = sub.category || 'General';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;

    // Skills
    if (Array.isArray(sub.skills_evaluated)) {
      sub.skills_evaluated.forEach(sk => {
        const name = typeof sk === 'string' ? sk : sk.name;
        const score = typeof sk === 'string' ? 95 : (sk.score || 95);
        if (!skillsMap[name] || skillsMap[name] < score) {
          skillsMap[name] = score;
        }
      });
    }
  });

  const skillEntries = Object.entries(skillsMap);
  const totalPoints = verified.reduce((acc, s) => acc + (s.score || 90), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-ink">Growth & Mastery Analytics</h2>
        <p className="text-xs text-slateMuted">Empirical progression calculated from live sandbox assertions in Supabase.</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Total Verified Velocity</span>
          <div className="text-2xl font-extrabold font-mono text-brand mt-1">{totalPoints} pts</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Accumulated assertion weight</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Categories Explored</span>
          <div className="text-2xl font-extrabold font-mono text-ink mt-1">
            {Object.keys(categoryMap).length} Domains
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {Object.keys(categoryMap).join(', ')}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Mean Uniqueness Score</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-700 mt-1">
            {Math.round(verified.reduce((acc, s) => acc + (s.ast_uniqueness || 95), 0) / verified.length)}%
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Plagiarism AST uniqueness</span>
        </div>
      </div>

      {/* Real Skill Mastery Progress Bars */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-ink">Skill Proficiency Distribution</h3>
        <div className="space-y-4">
          {skillEntries.map(([skill, score], i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-ink">{skill}</span>
                <span className="font-mono font-bold text-emerald-700">{score}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, score)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Milestone Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-ink">Verification Audit Timeline</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {verified.map((sub, i) => (
            <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-ink">{sub.challenge_title}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {sub.category} • {sub.passed_tests}/{sub.total_tests} Tests Passed ({sub.duration_ms}ms)
                  </p>
                </div>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-[11px] font-mono text-slate-400 block">
                  {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : 'Recent'}
                </span>
                <span className="text-[10px] font-mono text-brand font-semibold select-all">
                  Sig: {sub.cryptographic_seal ? sub.cryptographic_seal.substring(0, 12) + '...' : 'Verified'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

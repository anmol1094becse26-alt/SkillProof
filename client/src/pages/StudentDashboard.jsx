import React, { useState, useEffect } from 'react';
import { fetchChallenges, fetchSubmissions, subscribeToTable, seedSupabaseWithInitialChallenges } from '../supabase';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

export default function StudentDashboard({ onStartChallenge, onAddToast }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [chlRes, subRes] = await Promise.all([
        fetchChallenges(),
        fetchSubmissions('student_current')
      ]);
      setChallenges(chlRes.data || []);
      setSubmissions(subRes.data || []);
    } catch (err) {
      if (onAddToast) onAddToast({ type: 'error', message: 'Failed to load challenges from Supabase' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Realtime subscriptions
    const unsubChallenges = subscribeToTable(
      'challenges',
      (newChl) => setChallenges(prev => [newChl, ...prev.filter(c => c.id !== newChl.id)]),
      (updChl) => setChallenges(prev => prev.map(c => c.id === updChl.id ? updChl : c)),
      (delChl) => setChallenges(prev => prev.filter(c => c.id !== delChl.id))
    );

    const unsubSubmissions = subscribeToTable(
      'submissions',
      (newSub) => {
        setSubmissions(prev => [newSub, ...prev.filter(s => s.id !== newSub.id)]);
        if (onAddToast) onAddToast({ type: 'success', title: 'New Submission Verified', message: `${newSub.challenge_title} has been recorded live!` });
      }
    );

    return () => {
      unsubChallenges();
      unsubSubmissions();
    };
  }, []);

  const handleSeedChallenges = async () => {
    setSeeding(true);
    try {
      await seedSupabaseWithInitialChallenges();
      await loadData();
      if (onAddToast) onAddToast({ type: 'success', title: 'Challenges Loaded', message: 'Connected to Supabase and synchronized initial challenges.' });
    } catch (err) {
      if (onAddToast) onAddToast({ type: 'error', message: 'Could not write challenges to Supabase.' });
    } finally {
      setSeeding(false);
    }
  };

  // Dynamically compute bento stats from verified submissions
  const verifiedSubmissions = submissions.filter(s => s.status === 'Verified');
  const passedCount = verifiedSubmissions.length;
  
  const avgScore = passedCount > 0 
    ? Math.round(verifiedSubmissions.reduce((acc, s) => acc + Number(s.score || 0), 0) / passedCount)
    : 0;

  // Extract unique verified skills
  const verifiedSkillsSet = new Set();
  verifiedSubmissions.forEach(sub => {
    if (Array.isArray(sub.skills_evaluated)) {
      sub.skills_evaluated.forEach(sk => verifiedSkillsSet.add(typeof sk === 'string' ? sk : sk.name));
    }
  });
  const verifiedSkillsCount = verifiedSkillsSet.size;

  // Trust score: average of score & uniqueness
  const trustScore = passedCount > 0
    ? Math.min(100, Math.round(avgScore * 0.7 + (verifiedSubmissions[0]?.ast_uniqueness || 95) * 0.3))
    : 0;

  // Categories
  const categories = ['All', ...new Set(challenges.map(c => c.category).filter(Boolean))];
  const filteredChallenges = activeCategory === 'All' 
    ? challenges 
    : challenges.filter(c => c.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Bento Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase font-mono">Challenges Passed</span>
          <div className="text-3xl font-extrabold font-mono text-ink mt-1">
            {passedCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Live from Supabase</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase font-mono">Average Score</span>
          <div className={`text-3xl font-extrabold font-mono mt-1 ${passedCount > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
            {passedCount > 0 ? `${avgScore}%` : '—'}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Unit & perf benchmark</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase font-mono">Verified Skills</span>
          <div className="text-3xl font-extrabold font-mono text-brand mt-1">
            {verifiedSkillsCount}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Proven competencies</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase font-mono">Trust Score</span>
          <div className={`text-3xl font-extrabold font-mono mt-1 ${trustScore > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
            {trustScore > 0 ? `${trustScore} / 100` : '—'}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">SHA-256 sealed integrity</span>
        </div>
      </div>

      {/* Challenge Hub Header & Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-ink">Active Verification Challenges</h2>
            <p className="text-xs text-slateMuted">Complete live coding gauntlets to mint tamper-proof verified skill credentials.</p>
          </div>

          <div className="flex items-center gap-2">
            {categories.length > 1 && (
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      activeCategory === cat ? 'bg-white text-brand shadow-sm font-bold' : 'text-slate-600 hover:text-ink'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content State: Loading, Empty, or Challenges Grid */}
        {loading ? (
          <CardSkeleton count={3} />
        ) : filteredChallenges.length === 0 ? (
          <EmptyState
            icon="terminal"
            title="No Challenges in Database"
            message="There are currently no challenges loaded into Supabase. You can initialize the standard enterprise challenges now."
            actionLabel={seeding ? "Initializing..." : "Load Sample Challenges to Supabase"}
            onAction={handleSeedChallenges}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredChallenges.map(c => {
              const isAlreadyPassed = verifiedSubmissions.some(s => s.challenge_id === c.id);
              return (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-brand font-bold border border-blue-100">
                        {c.category}
                      </span>
                      <span className={`text-xs font-semibold ${
                        c.difficulty === 'Hard' ? 'text-rose-600' : c.difficulty === 'Medium' ? 'text-amber-600' : 'text-emerald-700'
                      }`}>
                        {c.difficulty}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-ink mb-1.5">{c.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {c.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {c.skills?.map((s, i) => (
                        <span key={i} className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {c.duration}
                    </span>

                    {isAlreadyPassed ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          Verified
                        </span>
                        <button
                          onClick={() => onStartChallenge(c.id)}
                          className="px-2.5 py-1 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 border border-slate-200"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onStartChallenge(c.id)}
                        className="px-3 py-1.5 bg-brand text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <span>Start Gauntlet</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

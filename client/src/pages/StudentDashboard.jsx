import React, { useState } from 'react';

export default function StudentDashboard({ onStartChallenge }) {
  const [activeTab, setActiveTab] = useState('All');

  const challenges = [
    {
      id: 'chl_two_sum',
      title: 'Optimal Two-Sum & Hash Indexing',
      category: 'Algorithms',
      difficulty: 'Easy',
      duration: '25m',
      skills: ['Algorithms', 'Data Structures', 'Time Complexity']
    },
    {
      id: 'chl_lru_cache',
      title: 'O(1) In-Memory LRU Cache',
      category: 'System Design',
      difficulty: 'Hard',
      duration: '45m',
      skills: ['System Design', 'Cache Algorithms']
    },
    {
      id: 'chl_token_bucket',
      title: 'Distributed Token Bucket Rate Limiter',
      category: 'Security',
      difficulty: 'Medium',
      duration: '35m',
      skills: ['Security', 'Distributed Systems', 'Rate Limiting']
    }
  ];

  const filtered = activeTab === 'All' ? challenges : challenges.filter(c => c.category === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Bento Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Challenges Passed</span>
          <div className="text-3xl font-extrabold font-mono text-ink mt-1">2</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Avg Score</span>
          <div className="text-3xl font-extrabold font-mono text-emerald-700 mt-1">96.5%</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Verified Skills</span>
          <div className="text-3xl font-extrabold font-mono text-brand mt-1">5</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Trust Score</span>
          <div className="text-3xl font-extrabold font-mono text-emerald-700 mt-1">97 / 100</div>
        </div>
      </div>

      {/* Challenge Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Verification Challenges</h2>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['All', 'Algorithms', 'System Design', 'Security'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === cat ? 'bg-white text-brand shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map(c => (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-brand font-bold">{c.category}</span>
                  <span className="text-xs font-semibold text-slate-500">{c.difficulty}</span>
                </div>
                <h3 className="text-base font-bold text-ink">{c.title}</h3>
                <div className="mt-3 flex flex-wrap gap-1">
                  {c.skills.map(s => (
                    <span key={s} className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{s}</span>
                  ))}
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">{c.duration}</span>
                <button
                  onClick={() => onStartChallenge(c.id)}
                  className="px-3 py-1.5 bg-brand text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

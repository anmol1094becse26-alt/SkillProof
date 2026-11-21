import React, { useState } from 'react';

export default function EmployerDashboard() {
  const [candidates, setCandidates] = useState([
    { id: '1', name: 'Alex Rivera', uni: 'Stanford University', trust: 97, skills: ['Algorithms 98%', 'System Design 96%'], shortlisted: true },
    { id: '2', name: 'Sarah Chen', uni: 'MIT', trust: 94, skills: ['Distributed Systems 94%', 'Security 95%'], shortlisted: false },
    { id: '3', name: 'Priya Patel', uni: 'Carnegie Mellon', trust: 92, skills: ['Cache Algorithms 91%', 'System Design 94%'], shortlisted: false }
  ]);

  const toggleShortlist = (id) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, shortlisted: !c.shortlisted } : c));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Recruiter Command Center</h2>
          <p className="text-xs text-slateMuted">Filter verified candidates with mathematical match ratios and unforgeable trust scores.</p>
        </div>
        <span className="px-3 py-1 bg-blue-50 text-brand text-xs font-bold rounded-xl border border-blue-200">
          Stripe Enterprise Recruiter
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {candidates.map(c => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-sm text-ink">{c.name}</h3>
                  <p className="text-xs text-slate-500">{c.uni}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-emerald-700 text-sm">{c.trust}%</span>
                  <span className="block text-[9px] text-slate-400 font-mono">Trust Score</span>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                {c.skills.map((s, i) => (
                  <span key={i} className="inline-block text-[10px] font-mono bg-blue-50 text-brand px-2 py-0.5 rounded border border-blue-100 mr-1 mb-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center">
              <a href="/verify.html?id=SKP-8492" target="_blank" rel="noreferrer" className="text-xs text-brand font-bold hover:underline">
                Inspect Passport
              </a>
              <button
                onClick={() => toggleShortlist(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  c.shortlisted ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c.shortlisted ? 'Shortlisted ✓' : 'Shortlist'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

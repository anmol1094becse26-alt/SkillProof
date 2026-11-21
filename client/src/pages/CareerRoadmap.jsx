import React, { useState, useEffect } from 'react';
import { fetchSubmissions, fetchChallenges } from '../supabase';
import EmptyState from '../components/EmptyState';

export default function CareerRoadmap({ onStartChallenge }) {
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Industry Standard Career Roles
  const targetRoles = [
    {
      id: 'fullstack',
      title: 'Full-Stack Software Engineer',
      level: 'Mid-Senior Level',
      requiredSkills: [
        { name: 'Algorithms', weight: 90 },
        { name: 'Data Structures', weight: 90 },
        { name: 'System Design', weight: 85 },
        { name: 'Hash Maps', weight: 80 }
      ],
      description: 'Architect scalable web services, API integrations, and robust algorithmic workflows.'
    },
    {
      id: 'systems',
      title: 'Distributed Systems & Infrastructure',
      level: 'Senior Specialist',
      requiredSkills: [
        { name: 'System Design', weight: 95 },
        { name: 'Cache Algorithms', weight: 90 },
        { name: 'Rate Limiting', weight: 85 },
        { name: 'Distributed Systems', weight: 90 }
      ],
      description: 'Design low-latency in-memory data structures, cache topologies, and fault-tolerant nodes.'
    },
    {
      id: 'security',
      title: 'Application Security Engineer',
      level: 'Senior Specialist',
      requiredSkills: [
        { name: 'Security', weight: 95 },
        { name: 'Rate Limiting', weight: 90 },
        { name: 'Concurrency', weight: 85 },
        { name: 'Algorithms', weight: 80 }
      ],
      description: 'Harden web APIs, mitigate Denial-of-Service attacks, and prevent race condition exploits.'
    }
  ];

  useEffect(() => {
    async function init() {
      setLoading(true);
      const [subRes, chlRes] = await Promise.all([
        fetchSubmissions('student_current'),
        fetchChallenges()
      ]);

      const subs = subRes.data || [];
      const verified = subs.filter(s => s.status === 'Verified');
      const skillMap = {};

      verified.forEach(sub => {
        if (Array.isArray(sub.skills_evaluated)) {
          sub.skills_evaluated.forEach(sk => {
            const name = typeof sk === 'string' ? sk : sk.name;
            const score = typeof sk === 'string' ? 95 : (sk.score || 95);
            if (!skillMap[name] || skillMap[name] < score) {
              skillMap[name] = score;
            }
          });
        }
      });

      setVerifiedSkills(skillMap);
      setChallenges(chlRes.data || []);
      setLoading(false);
    }
    init();
  }, []);

  const calculateRoleMatch = (requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) return 0;
    let totalScore = 0;

    requiredSkills.forEach(req => {
      const studentScore = verifiedSkills[req.name] || 0;
      const ratio = Math.min(1.0, studentScore / req.weight);
      totalScore += ratio;
    });

    return Math.round((totalScore / requiredSkills.length) * 100);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-48 bg-white rounded-2xl border border-slate-200"></div>
        <div className="h-48 bg-white rounded-2xl border border-slate-200"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-ink">Career Roadmap & Role Alignment</h2>
        <p className="text-xs text-slateMuted">
          Mathematical skill gap engine: compares your verified Supabase assertions against market engineering benchmarks.
        </p>
      </div>

      <div className="space-y-6">
        {targetRoles.map(role => {
          const matchPercent = calculateRoleMatch(role.requiredSkills);
          return (
            <div key={role.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-ink">{role.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      {role.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">{role.description}</p>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-2xl font-black font-mono text-brand">{matchPercent}%</span>
                  <span className="text-[10px] font-mono text-slate-400 block">Verified Match Ratio</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    matchPercent >= 80 ? 'bg-emerald-500' : matchPercent >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${matchPercent}%` }}
                ></div>
              </div>

              {/* Skills breakdown */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {role.requiredSkills.map((req, i) => {
                  const hasSkill = Boolean(verifiedSkills[req.name]);
                  const score = verifiedSkills[req.name] || 0;
                  return (
                    <div 
                      key={i} 
                      className={`p-3 rounded-xl border flex flex-col justify-between ${
                        hasSkill 
                          ? 'bg-emerald-50/50 border-emerald-200' 
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-ink">{req.name}</span>
                        <span className={`text-[10px] font-mono font-bold ${hasSkill ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {hasSkill ? `${score}%` : 'Missing'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Benchmark: {req.weight}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Action recommendations if gap exists */}
              {matchPercent < 100 && (
                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-brand">lightbulb</span>
                    <span>Complete targeted gauntlets to increase match ratio to 100%.</span>
                  </span>
                  {challenges.length > 0 && onStartChallenge && (
                    <button
                      onClick={() => onStartChallenge(challenges[0].id)}
                      className="px-3 py-1 bg-brand text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Bridge Skill Gap &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

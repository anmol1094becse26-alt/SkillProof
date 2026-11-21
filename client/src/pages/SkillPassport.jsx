import React, { useState } from 'react';
import QRPassportCard from '../components/QRPassportCard';
import EvidenceModal from '../components/EvidenceModal';

export default function SkillPassport() {
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  const verifiedSkills = [
    { skill: 'Algorithms', score: 98, level: 'Mastery', date: '2026-10-10' },
    { skill: 'Data Structures', score: 96, level: 'Mastery', date: '2026-10-10' },
    { skill: 'System Design', score: 96, level: 'Mastery', date: '2026-10-12' },
    { skill: 'Cache Algorithms', score: 94, level: 'Advanced', date: '2026-10-12' },
    { skill: 'Time Complexity', score: 100, level: 'Mastery', date: '2026-10-10' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dynamic QR Passport Card */}
      <QRPassportCard 
        passportId="SKP-8492"
        trustScore={97}
        studentName="Alex Rivera"
        university="Stanford University"
      />

      {/* Competencies Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-ink">Verified Competency Matrix</h3>
            <p className="text-xs text-slateMuted">Immutable credentials backed by isolated sandbox test assertions.</p>
          </div>
          <button 
            onClick={() => setIsEvidenceOpen(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Inspect Audit Evidence
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {verifiedSkills.map((s, i) => (
            <div key={i} className="p-4 bg-canvas rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-ink">{s.skill}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-brand font-bold">{s.level}</span>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-700 mt-2">{s.score}%</div>
              <span className="text-[10px] text-slate-400 font-mono">Verified: {s.date}</span>
            </div>
          ))}
        </div>
      </div>

      <EvidenceModal 
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        evidence={{
          cryptographicSeal: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          astUniqueness: 98,
          durationMs: 1.2,
          explanation: 'Implemented a single-pass hash map to achieve strict O(n) runtime with constant memory bounds.'
        }}
      />
    </div>
  );
}

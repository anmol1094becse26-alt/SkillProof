import React from 'react';

export default function ReviewerQueue() {
  const cohort = [
    { name: 'Alex Rivera', course: 'B.S. CS (Stanford)', score: 98, status: 'Approved', passport: 'SKP-8492' },
    { name: 'Sarah Chen', course: 'M.Eng. EECS (MIT)', score: 94, status: 'Approved', passport: 'SKP-7104' },
    { name: 'Liam O\'Connor', course: 'M.Sc. CS (Oxford)', score: 78, status: 'Under Review', passport: 'SKP-4158' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">University Placement & Reviewer Queue</h2>
          <p className="text-xs text-slateMuted">Institutional cohort moderation, credential audit, and plagiarism review.</p>
        </div>
        <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
          Cohort 2026 Active
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-mono uppercase border-b border-slate-200">
            <tr>
              <th className="p-4">Candidate</th>
              <th className="p-4">Department</th>
              <th className="p-4">Gauntlet Score</th>
              <th className="p-4">Verification Status</th>
              <th className="p-4 text-right">Inspection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cohort.map((c, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-ink">{c.name}</td>
                <td className="p-4 text-slate-600">{c.course}</td>
                <td className="p-4 font-mono font-bold text-emerald-700">{c.score}%</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    c.status === 'Approved' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <a href={`/verify.html?id=${c.passport}`} target="_blank" rel="noreferrer" className="text-brand font-mono font-bold hover:underline">
                    {c.passport}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

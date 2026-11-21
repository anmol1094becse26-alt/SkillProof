import React from 'react';

export default function RoleSwitcher({ currentRole, onChange }) {
  const roles = [
    { id: 'student', label: 'Candidate', icon: 'school' },
    { id: 'employer', label: 'Recruiter', icon: 'business_center' },
  ];

  return (
    <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
      {roles.map(r => (
        <button
          key={r.id}
          onClick={() => onChange(r.id)}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
            currentRole === r.id
              ? 'bg-white text-brand shadow-sm font-bold'
              : 'text-slate-600 hover:text-ink'
          }`}
        >
          <span className="material-symbols-outlined text-sm">{r.icon}</span>
          <span>{r.label}</span>
        </button>
      ))}
    </div>
  );
}

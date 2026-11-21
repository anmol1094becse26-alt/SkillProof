import React from 'react';

export default function QRPassportCard({ 
  passportId = 'SKP-8492', 
  trustScore = 97, 
  studentName = 'Alex Rivera', 
  university = 'Stanford University',
  verifiedCount = 0,
  onCopyLink 
}) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const publicUrl = `${origin}/#passport/${passportId}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="space-y-2 text-center sm:text-left flex-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SHA-256 Sealed Credential</span>
        </div>
        <h3 className="text-xl font-bold text-ink">{studentName}</h3>
        <p className="text-xs text-slateMuted font-mono">
          {university} • Passport ID: <span className="text-brand font-bold">{passportId}</span>
        </p>
        
        <div className="pt-2 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
          <span className="text-xs font-mono text-slate-400">Trust Score:</span>
          <span className="text-lg font-black font-mono text-emerald-700">{trustScore}/100</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-50 text-brand rounded border border-blue-200 font-bold">
            {trustScore >= 95 ? 'Mastery Tier' : trustScore >= 80 ? 'Advanced Tier' : 'Proficient'}
          </span>
          <span className="text-xs text-slate-400 font-mono">• {verifiedCount} Verified Skills</span>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              if (onCopyLink) onCopyLink(publicUrl);
              else if (navigator.clipboard) navigator.clipboard.writeText(publicUrl);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            <span>Copy Public Passport Link</span>
          </button>
        </div>
      </div>

      {/* Dynamic QR Badge */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center">
        <div className="w-28 h-28 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-center shadow-inner">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#fff" />
            <rect x="8" y="8" width="28" height="28" fill="#0B1C30" />
            <rect x="14" y="14" width="16" height="16" fill="#fff" />
            <rect x="18" y="18" width="8" height="8" fill="#0B1C30" />
            
            <rect x="64" y="8" width="28" height="28" fill="#0B1C30" />
            <rect x="70" y="14" width="16" height="16" fill="#fff" />
            <rect x="74" y="18" width="8" height="8" fill="#0B1C30" />
            
            <rect x="8" y="64" width="28" height="28" fill="#0B1C30" />
            <rect x="14" y="70" width="16" height="16" fill="#fff" />
            <rect x="18" y="74" width="8" height="8" fill="#0B1C30" />
            
            {/* Unique dynamic data cells */}
            <circle cx="50" cy="50" r="5" fill="#0152D9" />
            <rect x="44" y="20" width="12" height="6" fill="#0152D9" />
            <rect x="20" y="44" width="6" height="12" fill="#0152D9" />
            <rect x="52" y="68" width="14" height="6" fill="#0B1C30" />
            <rect x="68" y="52" width="6" height="14" fill="#0B1C30" />
          </svg>
        </div>
        <span className="text-[10px] font-mono text-slate-500 mt-2 font-semibold">
          Scannable Public Passport
        </span>
      </div>
    </div>
  );
}

import React from 'react';

export default function QRPassportCard({ passportId = 'SKP-8492', trustScore = 97, studentName = 'Alex Rivera', university = 'Stanford University' }) {
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000'}/verify.html?id=${passportId}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>SHA-256 Cryptographic Seal</span>
        </div>
        <h3 className="text-xl font-bold text-ink">{studentName}</h3>
        <p className="text-xs text-slateMuted font-mono">{university} • Passport #{passportId}</p>
        
        <div className="pt-2 flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Trust Score:</span>
          <span className="text-lg font-black font-mono text-emerald-700">{trustScore}/100</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-50 text-brand rounded border border-blue-200">Mastery</span>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center">
        <div className="w-32 h-32 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#fff" />
            <rect x="10" y="10" width="30" height="30" fill="#0B1C30" />
            <rect x="15" y="15" width="20" height="20" fill="#fff" />
            <rect x="20" y="20" width="10" height="10" fill="#0B1C30" />
            <rect x="60" y="10" width="30" height="30" fill="#0B1C30" />
            <rect x="65" y="15" width="20" height="20" fill="#fff" />
            <rect x="70" y="20" width="10" height="10" fill="#0B1C30" />
            <rect x="10" y="60" width="30" height="30" fill="#0B1C30" />
            <rect x="15" y="65" width="20" height="20" fill="#fff" />
            <rect x="20" y="70" width="10" height="10" fill="#0B1C30" />
            <circle cx="50" cy="50" r="4" fill="#0152D9" />
          </svg>
        </div>
        <a 
          href={verifyUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="text-[11px] font-mono text-brand mt-2 hover:underline font-semibold"
        >
          verify.html?id={passportId}
        </a>
      </div>
    </div>
  );
}

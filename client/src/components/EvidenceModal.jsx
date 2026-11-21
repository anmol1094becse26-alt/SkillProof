import React from 'react';

export default function EvidenceModal({ isOpen, onClose, evidence }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <span className="material-symbols-outlined text-brand">fingerprint</span>
            <span>Cryptographic Proof & Telemetry</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
        </div>

        <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          {evidence?.challengeTitle && (
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Associated Gauntlet</span>
              <span className="text-sm font-bold text-ink">{evidence.challengeTitle}</span>
            </div>
          )}

          <div>
            <span className="font-semibold text-slate-700 block mb-1">SHA-256 Digest Signature</span>
            <p className="p-2.5 bg-terminalDark text-emerald-300 font-mono text-[11px] rounded-lg break-all select-all">
              {evidence?.cryptographicSeal || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">AST Token Uniqueness</span>
              <span className="text-lg font-bold font-mono text-ink">{evidence?.astUniqueness || 96}%</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">&lt; 15% similarity (Plagiarism-free)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Benchmark Execution Timing</span>
              <span className="text-lg font-bold font-mono text-emerald-700">{evidence?.durationMs || 1.2}ms</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">V8 isolated sandbox timing</span>
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-700 block mb-1">Candidate Conceptual Justification</span>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 italic">
              "{evidence?.explanation || 'Optimal single-pass map indexing ensuring linear time and deterministic memory limits.'}"
            </p>
          </div>

          {evidence?.code && (
            <div>
              <span className="font-semibold text-slate-700 block mb-1">Submitted Source Code</span>
              <pre className="p-3 bg-terminalDark text-emerald-300 font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed max-h-48">
                {evidence.code}
              </pre>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
          >
            Close Audit Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

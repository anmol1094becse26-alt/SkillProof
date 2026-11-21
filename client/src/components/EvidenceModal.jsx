import React from 'react';

export default function EvidenceModal({ isOpen, onClose, evidence }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <span className="material-symbols-outlined text-brand">fingerprint</span>
            <span>Cryptographic Proof & Evidence</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div>
            <span className="font-semibold text-slate-700 block mb-1">SHA-256 Digest</span>
            <p className="p-2.5 bg-terminalDark text-emerald-300 font-mono text-[11px] rounded-lg break-all">
              {evidence?.cryptographicSeal || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">AST Uniqueness</span>
              <span className="text-lg font-bold font-mono text-ink">{evidence?.astUniqueness || 98}%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Execution Timing</span>
              <span className="text-lg font-bold font-mono text-emerald-700">{evidence?.durationMs || 1.4}ms</span>
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-700 block mb-1">Conceptual Defense Justification</span>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 italic">
              "{evidence?.explanation || 'Single pass hash map maintaining O(n) runtime with invariant edge checks.'}"
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700"
          >
            Close Audit Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

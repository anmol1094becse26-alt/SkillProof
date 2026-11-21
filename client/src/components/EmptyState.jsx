import React from 'react';

export default function EmptyState({ 
  icon = 'inbox', 
  title = 'No records found', 
  message = 'There is currently no data in this view.', 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand flex items-center justify-center mb-4 border border-blue-100">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-base font-bold text-ink mb-1">{title}</h3>
      <p className="text-xs text-slateMuted mb-6 max-w-md leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}

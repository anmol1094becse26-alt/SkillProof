import React from 'react';

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/5"></div>
          </div>
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="flex gap-2">
            <div className="h-5 bg-slate-100 rounded w-16"></div>
            <div className="h-5 bg-slate-100 rounded w-20"></div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <div className="h-3 bg-slate-200 rounded w-12"></div>
            <div className="h-7 bg-slate-200 rounded-xl w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 4 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-10 bg-slate-100 border-b border-slate-200"></div>
      <div className="divide-y divide-slate-100 p-4 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-8 bg-slate-100 rounded"></div>
        ))}
      </div>
    </div>
  );
}

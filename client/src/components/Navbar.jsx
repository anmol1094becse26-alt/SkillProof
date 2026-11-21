import React from 'react';
import RoleSwitcher from './RoleSwitcher';

export default function Navbar({ currentRole, setCurrentRole, currentPage, setCurrentPage }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white shadow-sm shadow-brand/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-ink">
              Skill<span className="text-brand">Proof</span>
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-brand border border-blue-200">
            {currentRole} view
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slateMuted">
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className={`hover:text-brand transition-colors ${currentPage === 'dashboard' ? 'text-brand' : ''}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentPage('passport')}
            className={`hover:text-brand transition-colors ${currentPage === 'passport' ? 'text-brand' : ''}`}
          >
            Skill Passport
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <RoleSwitcher currentRole={currentRole} onChange={setCurrentRole} />
        </div>
      </div>
    </header>
  );
}

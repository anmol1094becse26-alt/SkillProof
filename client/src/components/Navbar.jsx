import React from 'react';
import RoleSwitcher from './RoleSwitcher';

export default function Navbar({ currentRole, setCurrentRole, currentPage, setCurrentPage, realtimeActive = true }) {
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'challenges', label: 'Challenges', icon: 'terminal' },
    { id: 'passport', label: 'Skill Passport', icon: 'verified' },
    { id: 'growth', label: 'Growth Tracker', icon: 'trending_up' },
    { id: 'roadmap', label: 'Career Roadmap', icon: 'map' },
  ];

  const employerNavItems = [
    { id: 'candidates', label: 'Candidates', icon: 'groups' },
    { id: 'employer-challenges', label: 'Manage Challenges', icon: 'playlist_add_check' },
    { id: 'invites', label: 'Interview Pipeline', icon: 'send' },
  ];

  const navItems = currentRole === 'student' ? studentNavItems : employerNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setCurrentPage(currentRole === 'student' ? 'dashboard' : 'candidates')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white shadow-sm shadow-brand/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-ink">
              Skill<span className="text-brand">Proof</span>
            </span>
          </div>
          
          {/* Realtime Live Pulse Indicator */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-semibold border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Supabase Realtime Live</span>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-blue-50 text-brand font-bold'
                    : 'text-slate-600 hover:text-ink hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <RoleSwitcher 
            currentRole={currentRole} 
            onChange={(role) => {
              setCurrentRole(role);
              setCurrentPage(role === 'student' ? 'dashboard' : 'candidates');
            }} 
          />
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-100 gap-1 text-xs bg-slate-50/50">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap font-medium text-xs flex items-center gap-1 ${
                isActive ? 'bg-brand text-white font-bold' : 'text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudentDashboard from './pages/StudentDashboard';
import TaskSimulator from './pages/TaskSimulator';
import SkillPassport from './pages/SkillPassport';
import GrowthTracker from './pages/GrowthTracker';
import CareerRoadmap from './pages/CareerRoadmap';
import EmployerDashboard from './pages/EmployerDashboard';
import PublicPassportView from './pages/PublicPassportView';
import Toast from './components/Toast';

export default function App() {
  const [currentRole, setCurrentRole] = useState('student'); // 'student' | 'employer'
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedChallenge, setSelectedChallenge] = useState('chl_two_sum');
  const [publicPassportId, setPublicPassportId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast Management
  const addToast = ({ type = 'success', title = '', message = '' }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, type, title, message }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // URL Hash-based dynamic routing for public passport view (/passport/:id or #passport/:id)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#passport/')) {
        const id = hash.replace('#passport/', '');
        setPublicPassportId(id);
      } else {
        setPublicPassportId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle direct public view request
  if (publicPassportId) {
    return (
      <>
        <PublicPassportView
          passportId={publicPassportId}
          onBackToApp={() => {
            window.location.hash = '';
            setPublicPassportId(null);
          }}
        />
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink font-sans selection:bg-brand selection:text-white">
      {/* Top Navigation */}
      <Navbar 
        currentRole={currentRole} 
        setCurrentRole={(role) => {
          setCurrentRole(role);
          setCurrentPage(role === 'student' ? 'dashboard' : 'candidates');
        }}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        realtimeActive={true}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {/* ================= CANDIDATE VIEWS ================= */}
        {currentRole === 'student' && currentPage === 'dashboard' && (
          <StudentDashboard 
            onStartChallenge={(id) => {
              setSelectedChallenge(id);
              setCurrentPage('challenges');
            }}
            onAddToast={addToast}
          />
        )}

        {currentRole === 'student' && currentPage === 'challenges' && (
          <TaskSimulator 
            challengeId={selectedChallenge} 
            onFinish={() => setCurrentPage('passport')}
            onAddToast={addToast}
          />
        )}

        {currentRole === 'student' && currentPage === 'passport' && (
          <SkillPassport 
            onGoToChallenges={() => setCurrentPage('challenges')}
            onAddToast={addToast}
            onOpenPublicView={(id) => {
              window.location.hash = `passport/${id}`;
            }}
          />
        )}

        {currentRole === 'student' && currentPage === 'growth' && (
          <GrowthTracker 
            onGoToChallenges={() => setCurrentPage('challenges')}
          />
        )}

        {currentRole === 'student' && currentPage === 'roadmap' && (
          <CareerRoadmap 
            onStartChallenge={(id) => {
              setSelectedChallenge(id);
              setCurrentPage('challenges');
            }}
          />
        )}

        {/* ================= RECRUITER VIEWS ================= */}
        {currentRole === 'employer' && (
          <EmployerDashboard 
            subView={currentPage}
            onAddToast={addToast}
            onInspectPassport={(id) => {
              window.location.hash = `passport/${id}`;
            }}
          />
        )}
      </main>

      {/* Reactive Global Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

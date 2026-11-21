import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StudentDashboard from './pages/StudentDashboard';
import TaskSimulator from './pages/TaskSimulator';
import ReviewerQueue from './pages/ReviewerQueue';
import SkillPassport from './pages/SkillPassport';
import EmployerDashboard from './pages/EmployerDashboard';

export default function App() {
  const [currentRole, setCurrentRole] = useState('student');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedChallenge, setSelectedChallenge] = useState('chl_two_sum');

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <Navbar 
        currentRole={currentRole} 
        setCurrentRole={setCurrentRole}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <main className="flex-1">
        {currentRole === 'student' && currentPage === 'dashboard' && (
          <StudentDashboard onStartChallenge={(id) => { setSelectedChallenge(id); setCurrentPage('simulator'); }} />
        )}
        {currentRole === 'student' && currentPage === 'simulator' && (
          <TaskSimulator challengeId={selectedChallenge} onFinish={() => setCurrentPage('passport')} />
        )}
        {currentPage === 'passport' && (
          <SkillPassport />
        )}
        {currentRole === 'employer' && (
          <EmployerDashboard />
        )}
        {currentRole === 'university' && (
          <ReviewerQueue />
        )}
      </main>
    </div>
  );
}

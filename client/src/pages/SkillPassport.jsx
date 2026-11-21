import React, { useState, useEffect } from 'react';
import QRPassportCard from '../components/QRPassportCard';
import EvidenceModal from '../components/EvidenceModal';
import EmptyState from '../components/EmptyState';
import { fetchPassport, fetchSubmissions, subscribeToTable } from '../supabase';

export default function SkillPassport({ onGoToChallenges, onAddToast, onOpenPublicView }) {
  const [passport, setPassport] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadPassportData = async () => {
    setLoading(true);
    try {
      const [passRes, subRes] = await Promise.all([
        fetchPassport('student_current'),
        fetchSubmissions('student_current')
      ]);

      setPassport(passRes.data || null);
      setSubmissions(subRes.data || []);
      if (subRes.data && subRes.data.length > 0) {
        setSelectedSubmission(subRes.data[0]);
      }
    } catch (err) {
      if (onAddToast) onAddToast({ type: 'error', message: 'Failed to load passport from Supabase' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPassportData();

    const unsub = subscribeToTable('submissions', () => {
      loadPassportData();
    });

    return () => unsub();
  }, []);

  const verifiedSubmissions = submissions.filter(s => s.status === 'Verified');

  // Compute skill matrix dynamically from live verified submissions
  const skillMatrix = [];
  const skillTracker = new Map();

  verifiedSubmissions.forEach(sub => {
    if (Array.isArray(sub.skills_evaluated)) {
      sub.skills_evaluated.forEach(sk => {
        const name = typeof sk === 'string' ? sk : sk.name;
        const score = typeof sk === 'string' ? 95 : (sk.score || 95);
        if (!skillTracker.has(name) || skillTracker.get(name).score < score) {
          const level = score >= 95 ? 'Mastery' : score >= 85 ? 'Advanced' : 'Proficient';
          skillTracker.set(name, {
            skill: name,
            score,
            level,
            date: sub.created_at ? new Date(sub.created_at).toISOString().split('T')[0] : '2026-11-22',
            submission: sub
          });
        }
      });
    }
  });

  const verifiedSkills = Array.from(skillTracker.values());
  const passportId = passport?.id || 'SKP-8492';
  const trustScore = passport?.trust_score || (verifiedSkills.length > 0 ? 97 : 0);

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    if (onAddToast) {
      onAddToast({
        type: 'success',
        title: 'Public Link Copied!',
        message: 'Shareable verification URL copied to clipboard.'
      });
    }
  };

  const handleInspectAudit = (item) => {
    setSelectedSubmission(item.submission || verifiedSubmissions[0]);
    setIsEvidenceOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-pulse">
        <div className="h-40 bg-white rounded-2xl border border-slate-200"></div>
        <div className="h-64 bg-white rounded-2xl border border-slate-200"></div>
      </div>
    );
  }

  if (verifiedSkills.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <EmptyState
          icon="verified"
          title="No Verified Skills Yet"
          message="Your Skill Passport is minted dynamically as you pass live coding gauntlets. Complete a challenge to earn your first cryptographic seal!"
          actionLabel="Go to Challenges"
          onAction={onGoToChallenges}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dynamic QR Passport Card */}
      <QRPassportCard 
        passportId={passportId}
        trustScore={trustScore}
        studentName={passport?.student_name || "Alex Rivera"}
        university={passport?.student_university || "Stanford University"}
        verifiedCount={verifiedSkills.length}
        onCopyLink={handleCopyLink}
      />

      {/* Competencies Matrix */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-ink">Verified Competency Matrix</h3>
            <p className="text-xs text-slateMuted">
              Calculated live from {verifiedSubmissions.length} sandbox assessment suites in Supabase.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onOpenPublicView && (
              <button
                onClick={() => onOpenPublicView(passportId)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-brand text-xs font-bold rounded-xl transition-colors flex items-center gap-1 border border-blue-200"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span>Open Public View</span>
              </button>
            )}
            <button 
              onClick={() => {
                if (verifiedSubmissions.length > 0) {
                  setSelectedSubmission(verifiedSubmissions[0]);
                  setIsEvidenceOpen(true);
                }
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">fingerprint</span>
              <span>Inspect Latest Audit</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {verifiedSkills.map((s, i) => (
            <div key={i} className="p-4 bg-canvas rounded-xl border border-slate-200 hover:border-blue-200 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-ink">{s.skill}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-brand font-bold border border-blue-100">
                    {s.level}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-700 mt-2">{s.score}%</div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Verified: {s.date}</span>
                <button
                  onClick={() => handleInspectAudit(s)}
                  className="text-brand font-bold hover:underline"
                >
                  View Evidence &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Inspector Modal */}
      <EvidenceModal 
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        evidence={{
          cryptographicSeal: selectedSubmission?.cryptographic_seal || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          astUniqueness: selectedSubmission?.ast_uniqueness || 96,
          durationMs: selectedSubmission?.duration_ms || 1.2,
          explanation: selectedSubmission?.explanation || 'Single pass hash map maintaining strict O(n) runtime with O(1) space bound.',
          code: selectedSubmission?.code,
          challengeTitle: selectedSubmission?.challenge_title
        }}
      />
    </div>
  );
}

/**
 * SKILLPROOF - RULE-BASED CANDIDATE-TO-JOB MATCHING & CURRICULUM GAP ENGINE
 * Mathematical Formulation:
 * Match Percentage = (sum_{s in Skills} min(1.0, CandidateScore(s) / RequiredScore(s))) / |RequiredSkills| * 100
 * Unverified skills count strictly as 0%.
 */

const JobMatchingEngine = (function () {
  /**
   * Match a candidate's verified passport against a single technical job posting
   */
  function matchCandidateToJob(passport, job) {
    const requiredSkills = job.requiredSkills || [];
    const minimumScores = job.minimumScores || {};

    if (requiredSkills.length === 0) {
      return {
        overallMatch: 100,
        meetingSkills: [],
        missingSkills: [],
        recommendations: ["Job has no strict required skills specified."]
      };
    }

    // Map verified skills
    const verifiedMap = {};
    if (passport && passport.verifiedSkills) {
      passport.verifiedSkills.forEach((s) => {
        verifiedMap[s.skill.toLowerCase()] = s.score;
      });
    }

    let skillMatchSum = 0;
    const meetingSkills = [];
    const missingSkills = [];
    const recommendations = [];

    requiredSkills.forEach((skillName) => {
      const key = skillName.toLowerCase();
      const requiredScore = minimumScores[skillName] || 80;
      const candidateScore = verifiedMap[key] || 0; // Unverified counts as 0%

      if (candidateScore > 0) {
        const ratio = Math.min(1.0, candidateScore / requiredScore);
        skillMatchSum += ratio;

        meetingSkills.push({
          skill: skillName,
          candidateScore: candidateScore,
          requiredScore: requiredScore,
          ratio: Math.round(ratio * 100),
          met: candidateScore >= requiredScore
        });

        if (candidateScore < requiredScore) {
          recommendations.push(
            `Improve ${skillName} score from ${candidateScore} to minimum ${requiredScore} by re-attempting advanced challenges.`
          );
        }
      } else {
        // Missing unverified skill
        missingSkills.push({
          skill: skillName,
          requiredScore: requiredScore,
          candidateScore: 0,
          met: false
        });

        recommendations.push(
          `Take the practical challenge to cryptographically verify "${skillName}" (required minimum ${requiredScore}%).`
        );
      }
    });

    const overallMatch = Math.round((skillMatchSum / requiredSkills.length) * 100);

    return {
      jobId: job.jobId,
      jobTitle: job.title,
      companyName: job.companyName,
      overallMatch,
      meetingSkills,
      missingSkills,
      recommendations
    };
  }

  /**
   * Match one candidate against all available active jobs
   */
  function matchCandidateAcrossJobs(passport, jobs = []) {
    return jobs.map((job) => ({
      job,
      matchResult: matchCandidateToJob(passport, job)
    })).sort((a, b) => b.matchResult.overallMatch - a.matchResult.overallMatch);
  }

  /**
   * Match one job against a pool of candidates
   */
  function rankCandidatesForJob(job, candidates = []) {
    return candidates.map((cand) => {
      const match = matchCandidateToJob(cand.passport, job);
      return {
        candidate: cand,
        matchResult: match,
        trustScore: cand.passport ? cand.passport.trustScore : 0
      };
    }).sort((a, b) => b.matchResult.overallMatch - a.matchResult.overallMatch);
  }

  /**
   * Curriculum Skill Gap Engine for University Placement
   * Compares the entire cohort's verified skills against active employer job requirements.
   */
  function computeCohortSkillGaps(cohort = [], jobs = []) {
    if (jobs.length === 0) return { gaps: [], employerDemand: [] };

    // Aggregate employer demand frequencies
    const skillDemandMap = {};
    jobs.forEach((job) => {
      (job.requiredSkills || []).forEach((skill) => {
        if (!skillDemandMap[skill]) {
          skillDemandMap[skill] = {
            skill: skill,
            jobCount: 0,
            avgMinScore: 0,
            scores: []
          };
        }
        skillDemandMap[skill].jobCount++;
        const minScore = (job.minimumScores && job.minimumScores[skill]) || 80;
        skillDemandMap[skill].scores.push(minScore);
      });
    });

    // Compute cohort proficiency for each demanded skill
    const cohortSize = Math.max(1, cohort.length);
    const gaps = [];

    for (const skill of Object.keys(skillDemandMap)) {
      const demand = skillDemandMap[skill];
      const avgRequired = Math.round(
        demand.scores.reduce((a, b) => a + b, 0) / demand.scores.length
      );

      let verifiedStudentsCount = 0;
      let totalVerifiedScore = 0;

      cohort.forEach((cand) => {
        if (cand.passport && cand.passport.verifiedSkills) {
          const match = cand.passport.verifiedSkills.find(
            (s) => s.skill.toLowerCase() === skill.toLowerCase()
          );
          if (match && match.score >= avgRequired) {
            verifiedStudentsCount++;
            totalVerifiedScore += match.score;
          }
        }
      });

      const readinessPct = Math.round((verifiedStudentsCount / cohortSize) * 100);
      const gapPct = 100 - readinessPct;

      gaps.push({
        skill: skill,
        jobDemandCount: demand.jobCount,
        avgRequiredScore: avgRequired,
        verifiedStudentsCount: verifiedStudentsCount,
        cohortSize: cohortSize,
        readinessPct: readinessPct,
        gapPct: gapPct,
        severity: gapPct > 60 ? "Critical Deficit" : gapPct > 35 ? "Moderate Gap" : "Well Aligned"
      });
    }

    gaps.sort((a, b) => b.gapPct - a.gapPct);

    return {
      gaps,
      totalJobsAnalyzed: jobs.length,
      cohortSize
    };
  }

  return {
    matchCandidateToJob,
    matchCandidateAcrossJobs,
    rankCandidatesForJob,
    computeCohortSkillGaps
  };
})();

if (typeof window !== "undefined") {
  window.JobMatchingEngine = JobMatchingEngine;
}

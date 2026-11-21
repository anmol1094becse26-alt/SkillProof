/**
 * SKILLPROOF - CORE DATA SCHEMAS & MODELS
 * Defines entities for Students, Employers, University Officers,
 * Challenges, Submissions, Evaluations, Skill Passports, and Jobs.
 */

class User {
  constructor({ uid, name, email, role, profileImage, createdAt, accountStatus }) {
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.role = role; // 'student' | 'employer' | 'university'
    this.profileImage = profileImage || '';
    this.createdAt = createdAt || new Date().toISOString();
    this.accountStatus = accountStatus || 'active';
  }
}

class StudentProfile {
  constructor({ uid, university, course, academicYear, department, skills, bio, profileCompletion, passportId }) {
    this.uid = uid;
    this.university = university;
    this.course = course;
    this.academicYear = academicYear;
    this.department = department;
    this.skills = skills || [];
    this.bio = bio || '';
    this.profileCompletion = profileCompletion || 80;
    this.passportId = passportId;
  }
}

class EmployerProfile {
  constructor({ uid, companyName, companyDescription, industry, website, designation, companySize, companyLogo }) {
    this.uid = uid;
    this.companyName = companyName;
    this.companyDescription = companyDescription;
    this.industry = industry;
    this.website = website;
    this.designation = designation;
    this.companySize = companySize;
    this.companyLogo = companyLogo || '';
  }
}

class UniversityProfile {
  constructor({ uid, universityName, department, officerName, officialEmail, verificationCode }) {
    this.uid = uid;
    this.universityName = universityName;
    this.department = department;
    this.officerName = officerName;
    this.officialEmail = officialEmail;
    this.verificationCode = verificationCode;
  }
}

class Challenge {
  constructor({ challengeId, title, description, category, difficulty, durationMinutes, requiredSkills, testCases, starterCode }) {
    this.challengeId = challengeId;
    this.title = title;
    this.description = description;
    this.category = category;
    this.difficulty = difficulty;
    this.durationMinutes = durationMinutes;
    this.requiredSkills = requiredSkills || [];
    this.testCases = testCases || [];
    this.starterCode = starterCode || {};
  }
}

class Submission {
  constructor({ submissionId, studentId, challengeId, language, code, explanation, followUpAnswers, submittedAt, status, evaluationId }) {
    this.submissionId = submissionId;
    this.studentId = studentId;
    this.challengeId = challengeId;
    this.language = language || 'javascript';
    this.code = code;
    this.explanation = explanation;
    this.followUpAnswers = followUpAnswers || {};
    this.submittedAt = submittedAt || new Date().toISOString();
    this.status = status || 'evaluated';
    this.evaluationId = evaluationId;
  }
}

class Evaluation {
  constructor({ evaluationId, submissionId, studentId, challengeId, totalScore, skillScores, passedTests, totalTests, testResults, feedback, areasForImprovement, explanationScore, followUpScore, similarityScore, verificationStatus, evaluatedAt }) {
    this.evaluationId = evaluationId;
    this.submissionId = submissionId;
    this.studentId = studentId;
    this.challengeId = challengeId;
    this.totalScore = totalScore;
    this.skillScores = skillScores || {};
    this.passedTests = passedTests;
    this.totalTests = totalTests;
    this.testResults = testResults || [];
    this.feedback = feedback;
    this.areasForImprovement = areasForImprovement || [];
    this.explanationScore = explanationScore;
    this.followUpScore = followUpScore;
    this.similarityScore = similarityScore;
    this.verificationStatus = verificationStatus || 'Approved';
    this.evaluatedAt = evaluatedAt || new Date().toISOString();
  }
}

class SkillPassport {
  constructor({ passportId, studentId, studentName, university, course, trustScore, verificationStatus, assessmentCount, verifiedSkills, telemetry, cryptographicSeal, publicVerificationUrl, issuedAt, updatedAt }) {
    this.passportId = passportId;
    this.studentId = studentId;
    this.studentName = studentName;
    this.university = university;
    this.course = course;
    this.trustScore = trustScore;
    this.verificationStatus = verificationStatus || 'Cryptographically Verified';
    this.assessmentCount = assessmentCount || 0;
    this.verifiedSkills = verifiedSkills || [];
    this.telemetry = telemetry || { astUniqueness: 98, replayIntegrity: 99, behavioralTelemetry: 95 };
    this.cryptographicSeal = cryptographicSeal;
    this.publicVerificationUrl = publicVerificationUrl || `verify.html?id=${passportId}`;
    this.issuedAt = issuedAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }
}

class Job {
  constructor({ jobId, employerId, companyName, title, description, location, employmentType, requiredSkills, minimumScores, status, createdAt }) {
    this.jobId = jobId;
    this.employerId = employerId;
    this.companyName = companyName;
    this.title = title;
    this.description = description;
    this.location = location;
    this.employmentType = employmentType || 'Full-time';
    this.requiredSkills = requiredSkills || [];
    this.minimumScores = minimumScores || {};
    this.status = status || 'active';
    this.createdAt = createdAt || new Date().toISOString();
  }
}

class Shortlist {
  constructor({ shortlistId, employerId, studentId, jobId, status, notes, createdAt }) {
    this.shortlistId = shortlistId;
    this.employerId = employerId;
    this.studentId = studentId;
    this.jobId = jobId;
    this.status = status || 'shortlisted';
    this.notes = notes || '';
    this.createdAt = createdAt || new Date().toISOString();
  }
}

class Notification {
  constructor({ notificationId, userId, title, message, type, link, isRead, createdAt }) {
    this.notificationId = notificationId;
    this.userId = userId;
    this.title = title;
    this.message = message;
    this.type = type;
    this.link = link || '';
    this.isRead = isRead || false;
    this.createdAt = createdAt || new Date().toISOString();
  }
}

class FollowUpQuestion {
  constructor({ questionId, submissionId, studentId, question, answer, evaluation, score, createdAt }) {
    this.questionId = questionId;
    this.submissionId = submissionId;
    this.studentId = studentId;
    this.question = question;
    this.answer = answer;
    this.evaluation = evaluation;
    this.score = score;
    this.createdAt = createdAt || new Date().toISOString();
  }
}

module.exports = {
  User,
  StudentProfile,
  EmployerProfile,
  UniversityProfile,
  Challenge,
  Submission,
  Evaluation,
  SkillPassport,
  Job,
  Shortlist,
  Notification,
  FollowUpQuestion
};

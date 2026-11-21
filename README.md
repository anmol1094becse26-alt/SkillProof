# SkillProof: Enterprise Skill Verification & Recruitment Platform

> *"Don't Just Claim Your Skills. Prove Them."*

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/anmol1094becse26-alt/SkillProof.git)
[![Status](https://img.shields.io/badge/Status-Production--Grade-emerald)](#)
[![Security](https://img.shields.io/badge/Integrity-SHA--256%20Sealed-indigo)](#)
[![Engine](https://img.shields.io/badge/Dual--Mode-Firestore%20%7C%20Local-blue)](#)

---

## 1. Executive Summary

**SkillProof** is a high-precision, triple-sided enterprise verification and recruitment platform connecting:
1. **Students / Candidates**: Prove technical depth in an isolated code execution sandbox, earning an immutable, SHA-256 sealed **Digital Skill Passport** with dynamic SVG QR verification.
2. **Employers / Recruiters**: Search candidates by verified gauntlet scores, eliminate resume inflation, evaluate mathematical candidate-to-job match percentages, and manage interview pipelines.
3. **University Career & Placement Offices**: Monitor cohort readiness, analyze curriculum skill gaps against live market demand, and provide accredited verifiable talent directories to industry partners.

---

## 2. System Architecture & Directory Structure

```
skillproof/
├── start.bat                     # 1-Click launcher opening http://localhost:5000/
├── README.md                     # System documentation & usage instructions
├── firestore.rules               # Strict Firestore Security Rules (RBAC)
├── storage.rules                 # Firebase Storage Security Rules
├── Server.cs                     # Standalone high-performance C# HTTP web server
├── SkillProofServer.exe          # Compiled binary running on port 5000
└── app/                          # Full-Stack Web Application
    ├── index.html                # Public Landing Page (hero, live stats, how-it-works)
    ├── auth.html                 # 3-Role Authentication (Student, Employer, University)
    ├── student-dashboard.html    # Candidate Studio (Bento stats, challenge hub, profile edit)
    ├── challenge-workspace.html  # Live Assessment IDE, Test Runner & Follow-Up Modal
    ├── my-skills-and-passport.html # Digital Skill Passport with Scannable QR & JSON Proof
    ├── verify.html               # Public QR Verification Portal (Third-party inspection)
    ├── employer-dashboard.html   # Recruiter Portal (Jobs, Candidate Search, Shortlisting)
    ├── university-dashboard.html # Placement Office (Cohort Directory, Skill Gap Engine)
    └── js/                       # Modular Backend Services
        ├── firebase-config.js    # Firebase SDK config + High-Fidelity Dual-Mode Adapter
        ├── seed-data.js          # Initial challenges, benchmarks & initial cohort
        ├── auth-service.js       # Auth, session management & role-based route guards
        ├── db-service.js         # Centralized Firestore queries & business logic
        ├── evaluation-engine.js  # Safe test runner & AST similarity detection
        ├── trust-score.js        # Mathematical Anti-Cheat Trust Score formula
        ├── passport-service.js   # SHA-256 seal & dynamic QR code generator
        ├── job-matching.js       # Rule-based candidate-to-job matching algorithm
        └── notification-service.js # Real-time notification dispatch & unread badges
```

---

## 3. Core Mathematical Engines

### A. Anti-Cheat Trust Score Formula
$$\text{Trust Score} = (S_{\text{perf}} \times 0.40) + (S_{\text{explain}} \times 0.30) + (S_{\text{followup}} \times 0.20) + (S_{\text{consistency}} \times 0.10)$$

- **$S_{\text{perf}}$ (40%)**: Weighted pass rate on visible (30%), edge (40%), and performance (30%) unit assertions.
- **$S_{\text{explain}}$ (30%)**: Technical justification score analyzing algorithmic keywords, memory model, and Big-O complexity statements.
- **$S_{\text{followup}}$ (20%)**: Dynamic defense questions addressing invariants and boundary conditions.
- **$S_{\text{consistency}}$ (10%)**: Standard deviation penalty across historic candidate challenge attempts ($\max(60, 100 - \min(35, \sigma \times 1.5))$).
- **Plagiarism AST Check**: Jaccard token/n-gram similarity $> 85\%$ flags the submission as `'Under Review'`.

### B. Safe Code Execution Sandbox
- Isolated JavaScript execution context.
- **2,500ms timeout race** against runaway recursion or infinite loops (`Promise.race`).
- Benchmarks execution time in milliseconds with precision down to $0.1\text{ms}$.

### C. Rule-Based Candidate-to-Job Matching Formula
$$\text{Match Percentage} = \frac{\sum_{s \in \text{Skills}} \min\left(1.0, \frac{\text{CandidateScore}(s)}{\text{RequiredScore}(s)}\right)}{|\text{RequiredSkills}|} \times 100$$
- Unverified skills count strictly as $0\%$.
- Returns categorized breakdown: `meetingSkills`, `missingSkills`, and actionable recommendations.

### D. Cryptographic Passport & Dynamic SVG QR
- Mints a 64-character SHA-256 hex seal (`crypto.subtle.digest('SHA-256', ...)`) binding candidate ID, verified competencies, scores, and timestamps.
- Generates dynamic, client-side SVG QR codes linking to `verify.html?id=SKP-XXXX`.

---

## 4. 12 Database Collections (Dual-Mode Persistence)

1. `users`: Master user accounts with role-based attributes.
2. `studentProfiles`: University, course, academic cohort, bio, claimed skills.
3. `employerProfiles`: Company name, description, industry, website, size.
4. `universityProfiles`: Institution name, department, officer name, official email.
5. `challenges`: Title, description, difficulty, time limit, test cases (visible/edge/perf), starter code.
6. `submissions`: Candidate code, submitted timestamp, follow-up answers, status.
7. `evaluations`: Passed tests, total tests, feedback, skill scores, AST similarity, verification status.
8. `skillPassports`: Passport ID (`SKP-XXXX`), trust score, verified skills matrix, SHA-256 seal, telemetry.
9. `jobs`: Employer ID, job title, description, location, required skills, minimum threshold scores.
10. `shortlists`: Shortlisted candidates, recruitment notes, interview stage (`shortlisted`, `interviewing`, `offered`).
11. `notifications`: Real-time system, shortlist, and passport seal updates.
12. `followUpQuestions`: Verification defense questions and conceptual scores.

---

## 5. Quick Start Instructions (Windows)

### Option 1: 1-Click Launch (Recommended)
Double-click `start.bat` in the root folder.
1. Compiles `Server.cs` using the built-in Microsoft .NET Framework compiler (`csc.exe`) if not already compiled.
2. Starts `SkillProofServer.exe` on `http://localhost:5000/`.
3. Opens your default web browser automatically.

### Option 2: Manual Terminal Execution
```powershell
# 1. Compile C# Server (Standard Windows .NET Framework)
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe /target:exe /out:SkillProofServer.exe /optimize+ Server.cs

# 2. Run the server
.\SkillProofServer.exe

# 3. Open in browser
http://localhost:5000/
```

---

## 6. Pre-Configured 1-Click Demo Accounts

On `auth.html`, use the top **1-Click Quick Demo Bar** for instant access:
- **Student**: Alex Rivera (`alex.rivera@stanford.edu`) &rarr; Candidate Studio
- **Employer**: Stripe Talent (`recruiter@stripe.com`) &rarr; Recruiter Portal
- **University**: Stanford Career Center (`placement@stanford.edu`) &rarr; Placement Office

---

## 7. Connecting to GitHub Repository

This project is connected to the official GitHub repository:
```bash
git remote add origin https://github.com/anmol1094becse26-alt/SkillProof.git
git branch -M main
git push -u origin main
```

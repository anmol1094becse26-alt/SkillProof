/**
 * SKILLPROOF - AUTHENTICATION & ROLE-BASED ROUTE GUARD SERVICE
 * Supports 3 Roles: Student (Candidate), Employer (Recruiter), University (Placement Office).
 * Includes 1-Click Quick Demo authentication bar.
 */

const AuthService = (function () {
  const SESSION_KEY = "skillproof_active_session";

  // Pre-configured demo accounts matching SEED_DATA
  const DEMO_ACCOUNTS = {
    student: {
      uid: "student_alex",
      email: "alex.rivera@stanford.edu",
      name: "Alex Rivera",
      role: "student",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      targetDashboard: "student-dashboard.html"
    },
    employer: {
      uid: "employer_stripe",
      email: "recruiter@stripe.com",
      name: "Stripe Talent Acquisition",
      role: "employer",
      profileImage: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
      targetDashboard: "employer-dashboard.html"
    },
    university: {
      uid: "university_stanford",
      email: "placement@stanford.edu",
      name: "Stanford Career Development Center",
      role: "university",
      profileImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80",
      targetDashboard: "university-dashboard.html"
    }
  };

  function getCurrentUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("AuthService: failed to read session", e);
      return null;
    }
  }

  function setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(SESSION_KEY);
    } else {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }
  }

  function getDashboardForRole(role) {
    switch (role) {
      case "student":
      case "candidate":
        return "student-dashboard.html";
      case "employer":
      case "recruiter":
        return "employer-dashboard.html";
      case "university":
      case "placement":
        return "university-dashboard.html";
      default:
        return "student-dashboard.html";
    }
  }

  async function signIn(email, password, expectedRole) {
    const db = window.SkillProofDB;
    if (!db) throw new Error("Database adapter not loaded");

    const usersSnap = await db.getDocs(db.collection("users"), db.where("email", "==", email.trim().toLowerCase()));

    let user = null;
    if (!usersSnap.empty) {
      user = usersSnap.docs[0].data();
    } else {
      // If not found in database, check demo accounts or match by email prefix
      for (const key of Object.keys(DEMO_ACCOUNTS)) {
        if (DEMO_ACCOUNTS[key].email.toLowerCase() === email.trim().toLowerCase()) {
          user = DEMO_ACCOUNTS[key];
          break;
        }
      }
    }

    if (!user) {
      throw new Error("No SkillProof account found matching this email. Please check your credentials or register.");
    }

    // Role check if specified
    const normalizedRole = expectedRole === "candidate" ? "student" : expectedRole === "recruiter" ? "employer" : expectedRole === "placement" ? "university" : expectedRole;
    if (normalizedRole && user.role !== normalizedRole) {
      throw new Error(`This email belongs to a ${user.role} profile. Please select the correct portal tab.`);
    }

    setCurrentUser(user);
    return user;
  }

  async function signUp({ name, email, password, role, details }) {
    const db = window.SkillProofDB;
    if (!db) throw new Error("Database adapter not loaded");

    const cleanEmail = email.trim().toLowerCase();
    const existingSnap = await db.getDocs(db.collection("users"), db.where("email", "==", cleanEmail));
    if (!existingSnap.empty) {
      throw new Error("An account with this email address already exists.");
    }

    const normalizedRole = role === "candidate" ? "student" : role === "recruiter" ? "employer" : role === "placement" ? "university" : role;
    const uid = "usr_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);

    const newUser = {
      uid: uid,
      name: name.trim(),
      email: cleanEmail,
      role: normalizedRole,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0152D9&color=fff&size=128`,
      createdAt: new Date().toISOString(),
      accountStatus: "active"
    };

    // Save to users collection
    await db.setDoc(db.doc("users", uid), newUser);

    // Create role-specific profile
    if (normalizedRole === "student") {
      const passportId = "SKP-" + Math.floor(1000 + Math.random() * 9000);
      const studentProfile = {
        uid: uid,
        university: details.university || "Stanford University",
        course: details.course || "B.S. Computer Science",
        academicYear: details.academicYear || "Senior (2026)",
        department: details.department || "School of Engineering",
        skills: details.skills || ["Algorithms", "Data Structures"],
        bio: details.bio || "Candidate preparing for technical verification.",
        profileCompletion: 70,
        passportId: passportId
      };
      await db.setDoc(db.doc("studentProfiles", uid), studentProfile);

      // Create initial starter passport
      const newPassport = {
        passportId: passportId,
        studentId: uid,
        studentName: newUser.name,
        university: studentProfile.university,
        course: studentProfile.course,
        trustScore: 85,
        verificationStatus: "Provisionally Active",
        assessmentCount: 0,
        verifiedSkills: [],
        telemetry: {
          astUniqueness: 95,
          replayIntegrity: 95,
          behavioralTelemetry: 95
        },
        cryptographicSeal: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        publicVerificationUrl: `verify.html?id=${passportId}`,
        issuedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await db.setDoc(db.doc("skillPassports", passportId), newPassport);
    } else if (normalizedRole === "employer") {
      const employerProfile = {
        uid: uid,
        companyName: details.companyName || name + " Enterprise",
        companyDescription: details.companyDescription || "Technology leader recruiting high-integrity verified engineering talent.",
        industry: details.industry || "Technology / Software",
        website: details.website || "https://example.com",
        designation: details.designation || "Engineering Recruiter",
        companySize: details.companySize || "500 - 1,000",
        companyLogo: "https://cdn.worldvectorlogo.com/logos/linear-2.svg"
      };
      await db.setDoc(db.doc("employerProfiles", uid), employerProfile);
    } else if (normalizedRole === "university") {
      const universityProfile = {
        uid: uid,
        universityName: details.universityName || name,
        department: details.department || "University Placement Cell",
        officerName: name,
        officialEmail: cleanEmail,
        verificationCode: "EDU-" + Math.floor(1000 + Math.random() * 9000)
      };
      await db.setDoc(db.doc("universityProfiles", uid), universityProfile);
    }

    setCurrentUser(newUser);
    return newUser;
  }

  function signOut() {
    setCurrentUser(null);
    window.location.href = "auth.html";
  }

  function quickDemoLogin(role) {
    const normalizedRole = role === "candidate" ? "student" : role === "recruiter" ? "employer" : role === "placement" ? "university" : role;
    const demo = DEMO_ACCOUNTS[normalizedRole];
    if (demo) {
      setCurrentUser(demo);
      window.location.href = demo.targetDashboard;
    }
  }

  function requireAuth(allowedRoles = []) {
    const user = getCurrentUser();
    if (!user) {
      const current = encodeURIComponent(window.location.pathname.split("/").pop());
      window.location.href = `auth.html?redirect=${current}`;
      return null;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      console.warn(`Unauthorized role ${user.role} for this route. Redirecting...`);
      window.location.href = getDashboardForRole(user.role);
      return null;
    }

    return user;
  }

  return {
    getCurrentUser,
    setCurrentUser,
    getDashboardForRole,
    signIn,
    signUp,
    signOut,
    quickDemoLogin,
    requireAuth,
    DEMO_ACCOUNTS
  };
})();

if (typeof window !== "undefined") {
  window.AuthService = AuthService;
}

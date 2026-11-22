/**
 * SKILLPROOF - CENTRALIZED FIRESTORE QUERIES & BUSINESS LOGIC SERVICE
 * Exposes strongly-typed data access methods for all 12 platform collections.
 */

const DBService = (function () {
  function getDB() {
    return window.SkillProofDB;
  }

  // CHALLENGES
  async function getChallenges(category = null) {
    const db = getDB();
    const snap = await db.getDocs(db.collection("challenges"));
    let challenges = snap.docs.map((d) => d.data());
    if (category && category !== "All") {
      challenges = challenges.filter((c) => c.category === category);
    }
    return challenges;
  }

  async function createChallenge(challengeData) {
    const db = getDB();
    const id = challengeData.challengeId || ("chl_ai_" + Date.now());
    const payload = {
      ...challengeData,
      challengeId: id,
      aiGenerated: true,
      createdAt: challengeData.createdAt || new Date().toISOString()
    };
    await db.setDoc(db.doc("challenges", id), payload);
    return payload;
  }

  async function getChallengeById(challengeId) {
    const db = getDB();
    const docSnap = await db.getDoc(db.doc("challenges", challengeId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    // Fallback: search across all challenges
    const snap = await db.getDocs(db.collection("challenges"));
    const match = snap.docs.find((d) => d.data().challengeId === challengeId);
    return match ? match.data() : null;
  }

  // SUBMISSIONS
  async function getSubmissions(studentId = null) {
    const db = getDB();
    let snap;
    if (studentId) {
      snap = await db.getDocs(db.collection("submissions"), db.where("studentId", "==", studentId));
    } else {
      snap = await db.getDocs(db.collection("submissions"));
    }
    const list = snap.docs.map((d) => d.data());
    list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    return list;
  }

  async function createSubmission(submissionData) {
    const db = getDB();
    const id = submissionData.submissionId || "sub_" + Date.now();
    const payload = {
      ...submissionData,
      submissionId: id,
      submittedAt: submissionData.submittedAt || new Date().toISOString()
    };
    await db.setDoc(db.doc("submissions", id), payload);
    return payload;
  }

  // EVALUATIONS
  async function getEvaluations(studentId = null) {
    const db = getDB();
    let snap;
    if (studentId) {
      snap = await db.getDocs(db.collection("evaluations"), db.where("studentId", "==", studentId));
    } else {
      snap = await db.getDocs(db.collection("evaluations"));
    }
    return snap.docs.map((d) => d.data());
  }

  async function getEvaluationById(evaluationId) {
    const db = getDB();
    const docSnap = await db.getDoc(db.doc("evaluations", evaluationId));
    if (docSnap.exists()) return docSnap.data();
    const snap = await db.getDocs(db.collection("evaluations"));
    const match = snap.docs.find((d) => d.data().evaluationId === evaluationId);
    return match ? match.data() : null;
  }

  async function createEvaluation(evalData) {
    const db = getDB();
    const id = evalData.evaluationId || "eval_" + Date.now();
    const payload = {
      ...evalData,
      evaluationId: id,
      evaluatedAt: evalData.evaluatedAt || new Date().toISOString()
    };
    await db.setDoc(db.doc("evaluations", id), payload);
    return payload;
  }

  // SKILL PASSPORTS
  async function getPassportByStudentId(studentId) {
    const db = getDB();
    const snap = await db.getDocs(db.collection("skillPassports"), db.where("studentId", "==", studentId));
    if (!snap.empty) {
      return snap.docs[0].data();
    }
    // Search in local map fallback
    const allSnap = await db.getDocs(db.collection("skillPassports"));
    const found = allSnap.docs.find((d) => d.data().studentId === studentId);
    return found ? found.data() : null;
  }

  async function getPassportById(passportId) {
    const db = getDB();
    const docSnap = await db.getDoc(db.doc("skillPassports", passportId));
    if (docSnap.exists()) return docSnap.data();
    const snap = await db.getDocs(db.collection("skillPassports"));
    const match = snap.docs.find((d) => d.data().passportId === passportId);
    return match ? match.data() : null;
  }

  async function savePassport(passportData) {
    const db = getDB();
    const id = passportData.passportId;
    const payload = {
      ...passportData,
      updatedAt: new Date().toISOString()
    };
    await db.setDoc(db.doc("skillPassports", id), payload);
    return payload;
  }

  // JOBS
  async function getJobs(status = "active") {
    const db = getDB();
    const snap = await db.getDocs(db.collection("jobs"));
    let jobs = snap.docs.map((d) => d.data());
    if (status) {
      jobs = jobs.filter((j) => j.status === status);
    }
    jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return jobs;
  }

  async function getEmployerJobs(employerId) {
    const db = getDB();
    const snap = await db.getDocs(db.collection("jobs"), db.where("employerId", "==", employerId));
    const list = snap.docs.map((d) => d.data());
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }

  async function createJob(jobData) {
    const db = getDB();
    const id = jobData.jobId || "job_" + Date.now();
    const payload = {
      ...jobData,
      jobId: id,
      status: "active",
      createdAt: new Date().toISOString()
    };
    await db.setDoc(db.doc("jobs", id), payload);
    return payload;
  }

  // SHORTLISTS
  async function getShortlists(employerId = null) {
    const db = getDB();
    let snap;
    if (employerId) {
      snap = await db.getDocs(db.collection("shortlists"), db.where("employerId", "==", employerId));
    } else {
      snap = await db.getDocs(db.collection("shortlists"));
    }
    return snap.docs.map((d) => d.data());
  }

  async function getStudentShortlists(studentId) {
    const db = getDB();
    const snap = await db.getDocs(db.collection("shortlists"), db.where("studentId", "==", studentId));
    return snap.docs.map((d) => d.data());
  }

  async function toggleShortlist(employerId, studentId, jobId, notes = "") {
    const db = getDB();
    const existingSnap = await db.getDocs(db.collection("shortlists"), db.where("employerId", "==", employerId));
    const match = existingSnap.docs.find(
      (d) => d.data().studentId === studentId && (jobId ? d.data().jobId === jobId : true)
    );

    if (match) {
      await db.deleteDoc(db.doc("shortlists", match.id));
      return { shortlisted: false };
    } else {
      const shortlistId = "sl_" + Date.now();
      const newShortlist = {
        shortlistId: shortlistId,
        employerId: employerId,
        studentId: studentId,
        jobId: jobId || "job_general",
        status: "shortlisted",
        notes: notes || "Shortlisted via SkillProof Recruiter Search.",
        createdAt: new Date().toISOString()
      };
      await db.setDoc(db.doc("shortlists", shortlistId), newShortlist);

      // Trigger candidate notification
      await createNotification({
        userId: studentId,
        title: "Enterprise Shortlist Notification",
        message: "An employer has reviewed your verified Skill Passport and added you to their active shortlist.",
        type: "shortlist",
        link: "my-skills-and-passport.html"
      });

      return { shortlisted: true, item: newShortlist };
    }
  }

  async function updateShortlistStatus(shortlistId, status) {
    const db = getDB();
    await db.updateDoc(db.doc("shortlists", shortlistId), { status: status });
    return true;
  }

  // NOTIFICATIONS
  async function getNotifications(userId) {
    const db = getDB();
    const snap = await db.getDocs(db.collection("notifications"), db.where("userId", "==", userId));
    const list = snap.docs.map((d) => d.data());
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }

  async function markNotificationRead(notificationId) {
    const db = getDB();
    await db.updateDoc(db.doc("notifications", notificationId), { isRead: true });
    return true;
  }

  async function markAllNotificationsRead(userId) {
    const db = getDB();
    const list = await getNotifications(userId);
    for (const notif of list) {
      if (!notif.isRead) {
        await db.updateDoc(db.doc("notifications", notif.notificationId), { isRead: true });
      }
    }
    return true;
  }

  async function createNotification(notifData) {
    const db = getDB();
    const id = notifData.notificationId || "notif_" + Date.now();
    const payload = {
      ...notifData,
      notificationId: id,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    await db.setDoc(db.doc("notifications", id), payload);
    return payload;
  }

  // PROFILES
  async function getStudentProfile(uid) {
    const db = getDB();
    const docSnap = await db.getDoc(db.doc("studentProfiles", uid));
    if (docSnap.exists()) return docSnap.data();
    const userDoc = await db.getDoc(db.doc("users", uid));
    return userDoc.exists() ? { ...userDoc.data(), uid } : null;
  }

  async function updateStudentProfile(uid, profileData) {
    const db = getDB();
    await db.setDoc(db.doc("studentProfiles", uid), profileData, { merge: true });
    if (profileData.name) {
      await db.updateDoc(db.doc("users", uid), { name: profileData.name });
    }
    return true;
  }

  async function getEmployerProfile(uid) {
    const db = getDB();
    const docSnap = await db.getDoc(db.doc("employerProfiles", uid));
    if (docSnap.exists()) return docSnap.data();
    const userDoc = await db.getDoc(db.doc("users", uid));
    return userDoc.exists() ? { ...userDoc.data(), uid } : null;
  }

  async function updateEmployerProfile(uid, data) {
    const db = getDB();
    await db.setDoc(db.doc("employerProfiles", uid), data, { merge: true });
    return true;
  }

  async function getUniversityProfile(uid) {
    const db = getDB();
    const docSnap = await db.getDoc(db.doc("universityProfiles", uid));
    if (docSnap.exists()) return docSnap.data();
    return null;
  }

  // COMPOSITE QUERIES
  async function getAllStudentsWithPassports() {
    const db = getDB();
    const [usersSnap, profilesSnap, passportsSnap] = await Promise.all([
      db.getDocs(db.collection("users"), db.where("role", "==", "student")),
      db.getDocs(db.collection("studentProfiles")),
      db.getDocs(db.collection("skillPassports"))
    ]);

    const usersMap = {};
    usersSnap.docs.forEach((d) => (usersMap[d.data().uid] = d.data()));

    const profilesMap = {};
    profilesSnap.docs.forEach((d) => (profilesMap[d.data().uid] = d.data()));

    const passportsByStudent = {};
    passportsSnap.docs.forEach((d) => {
      const p = d.data();
      passportsByStudent[p.studentId] = p;
    });

    return Object.keys(usersMap).map((uid) => {
      const user = usersMap[uid];
      const profile = profilesMap[uid] || {};
      const passport = passportsByStudent[uid] || null;
      return {
        uid,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        university: profile.university || "University Cohort",
        course: profile.course || "Computer Science",
        department: profile.department || "Engineering",
        academicYear: profile.academicYear || "Senior",
        skills: profile.skills || [],
        bio: profile.bio || "",
        passport: passport
      };
    });
  }

  return {
    getChallenges,
    getChallengeById,
    createChallenge,
    getSubmissions,
    createSubmission,
    getEvaluations,
    getEvaluationById,
    createEvaluation,
    getPassportByStudentId,
    getPassportById,
    savePassport,
    getJobs,
    getEmployerJobs,
    createJob,
    getShortlists,
    getStudentShortlists,
    toggleShortlist,
    updateShortlistStatus,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    createNotification,
    getStudentProfile,
    updateStudentProfile,
    getEmployerProfile,
    updateEmployerProfile,
    getUniversityProfile,
    getAllStudentsWithPassports
  };
})();

if (typeof window !== "undefined") {
  window.DBService = DBService;
}

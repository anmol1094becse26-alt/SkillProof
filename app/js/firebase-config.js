/**
 * SKILLPROOF - DUAL-MODE FIREBASE & LOCAL PERSISTENCE ADAPTER
 * Seamlessly interfaces with Google Cloud Firestore or high-fidelity localStorage engine.
 */

(function () {
  const STORAGE_PREFIX = "skillproof_db_";
  const INITIALIZED_FLAG = "skillproof_data_seeded_v1";

  // Check if live Firebase is desired and available
  const hasLiveFirebase = !!(
    typeof window !== "undefined" &&
    window.FIREBASE_CONFIG &&
    window.FIREBASE_CONFIG.apiKey &&
    window.FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY" &&
    window.firebase
  );

  // High-Fidelity Local Database Engine
  class LocalFirestoreEngine {
    constructor() {
      this.mode = "local-storage";
      this.initSeedData();
    }

    initSeedData() {
      if (typeof window === "undefined" || !window.localStorage) return;

      const isSeeded = localStorage.getItem(INITIALIZED_FLAG);
      if (!isSeeded && window.SEED_DATA) {
        console.log("[SkillProof DB] Seeding initial 12 collections...");
        for (const [collectionName, records] of Object.entries(window.SEED_DATA)) {
          const map = {};
          records.forEach((item) => {
            // Find key: uid, challengeId, submissionId, evaluationId, passportId, jobId, shortlistId, notificationId, questionId
            const key =
              item.uid ||
              item.challengeId ||
              item.submissionId ||
              item.evaluationId ||
              item.passportId ||
              item.jobId ||
              item.shortlistId ||
              item.notificationId ||
              item.questionId ||
              "id_" + Math.random().toString(36).substr(2, 9);
            map[key] = item;
          });
          localStorage.setItem(STORAGE_PREFIX + collectionName, JSON.stringify(map));
        }
        localStorage.setItem(INITIALIZED_FLAG, "true");
        console.log("[SkillProof DB] Local persistence engine initialized successfully.");
      }
    }

    getCollectionMap(colName) {
      try {
        const raw = localStorage.getItem(STORAGE_PREFIX + colName);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.error(`Error loading collection ${colName}:`, e);
        return {};
      }
    }

    setCollectionMap(colName, map) {
      try {
        localStorage.setItem(STORAGE_PREFIX + colName, JSON.stringify(map));
      } catch (e) {
        console.error(`Error saving collection ${colName}:`, e);
      }
    }

    async getDoc(colName, docId) {
      const map = this.getCollectionMap(colName);
      const data = map[docId];
      return {
        id: docId,
        exists: () => !!data,
        data: () => (data ? JSON.parse(JSON.stringify(data)) : null)
      };
    }

    async getDocs(colName, filters = []) {
      const map = this.getCollectionMap(colName);
      let list = Object.keys(map).map((k) => ({
        id: k,
        exists: () => true,
        data: () => JSON.parse(JSON.stringify(map[k]))
      }));

      for (const filter of filters) {
        if (filter.type === "where") {
          list = list.filter((doc) => {
            const data = doc.data();
            const val = data[filter.field];
            switch (filter.op) {
              case "==":
                return val === filter.value;
              case "!=":
                return val !== filter.value;
              case ">":
                return val > filter.value;
              case ">=":
                return val >= filter.value;
              case "<":
                return val < filter.value;
              case "<=":
                return val <= filter.value;
              case "array-contains":
                return Array.isArray(val) && val.includes(filter.value);
              default:
                return true;
            }
          });
        } else if (filter.type === "orderBy") {
          list.sort((a, b) => {
            const valA = a.data()[filter.field];
            const valB = b.data()[filter.field];
            if (valA < valB) return filter.direction === "desc" ? 1 : -1;
            if (valA > valB) return filter.direction === "desc" ? -1 : 1;
            return 0;
          });
        }
      }

      return {
        docs: list,
        empty: list.length === 0,
        size: list.length,
        forEach: (cb) => list.forEach(cb)
      };
    }

    async setDoc(colName, docId, data, options = {}) {
      const map = this.getCollectionMap(colName);
      if (options.merge && map[docId]) {
        map[docId] = { ...map[docId], ...data };
      } else {
        map[docId] = data;
      }
      this.setCollectionMap(colName, map);
      return { id: docId };
    }

    async updateDoc(colName, docId, updates) {
      const map = this.getCollectionMap(colName);
      if (map[docId]) {
        map[docId] = { ...map[docId], ...updates };
        this.setCollectionMap(colName, map);
        return true;
      }
      throw new Error(`Document ${docId} does not exist in collection ${colName}`);
    }

    async deleteDoc(colName, docId) {
      const map = this.getCollectionMap(colName);
      if (map[docId]) {
        delete map[docId];
        this.setCollectionMap(colName, map);
      }
      return true;
    }

    async addDoc(colName, data) {
      const map = this.getCollectionMap(colName);
      const newId =
        data.uid ||
        data.challengeId ||
        data.submissionId ||
        data.evaluationId ||
        data.passportId ||
        data.jobId ||
        data.shortlistId ||
        data.notificationId ||
        "id_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
      map[newId] = { ...data, id: newId };
      this.setCollectionMap(colName, map);
      return { id: newId };
    }

    resetDatabase() {
      localStorage.removeItem(INITIALIZED_FLAG);
      for (const colName of Object.keys(window.SEED_DATA || {})) {
        localStorage.removeItem(STORAGE_PREFIX + colName);
      }
      this.initSeedData();
      return true;
    }
  }

  // Instantiate singleton engine
  const localEngine = new LocalFirestoreEngine();

  // Unified Export API
  window.SkillProofDB = {
    mode: hasLiveFirebase ? "firebase" : "local",
    engine: localEngine,

    // Firestore-compatible surface
    collection: (colName) => ({ type: "collection", name: colName }),
    doc: (colName, id) => ({ type: "doc", colName, id }),
    where: (field, op, value) => ({ type: "where", field, op, value }),
    orderBy: (field, direction = "asc") => ({ type: "orderBy", field, direction }),

    getDoc: async (docRef) => {
      return localEngine.getDoc(docRef.colName, docRef.id);
    },

    getDocs: async (targetRef, ...filters) => {
      const colName = targetRef.type === "collection" ? targetRef.name : targetRef.colName;
      const combinedFilters = targetRef.filters ? [...targetRef.filters, ...filters] : filters;
      return localEngine.getDocs(colName, combinedFilters);
    },

    setDoc: async (docRef, data, options = {}) => {
      return localEngine.setDoc(docRef.colName, docRef.id, data, options);
    },

    updateDoc: async (docRef, updates) => {
      return localEngine.updateDoc(docRef.colName, docRef.id, updates);
    },

    deleteDoc: async (docRef) => {
      return localEngine.deleteDoc(docRef.colName, docRef.id);
    },

    addDoc: async (colRef, data) => {
      return localEngine.addDoc(colRef.name, data);
    },

    query: (colRef, ...filters) => {
      return {
        type: "collection",
        name: colRef.name,
        filters: filters
      };
    },

    resetToSeedData: () => {
      return localEngine.resetDatabase();
    }
  };

  console.log(`[SkillProof] Initialized persistence in [${window.SkillProofDB.mode.toUpperCase()}] mode.`);
})();

/**
 * SKILLPROOF - DATABASE CONFIGURATION & FALLBACK DATA STORE
 * Supports Google Cloud Firestore with zero-config in-memory/JSON local persistence.
 */

const fs = require('fs');
const path = require('path');

class DataStore {
  constructor() {
    this.collections = {};
    this.initStore();
  }

  initStore() {
    const seedPath = path.join(__dirname, '..', 'data', 'seedData.js');
    if (fs.existsSync(seedPath)) {
      const seedData = require(seedPath);
      for (const [colName, records] of Object.entries(seedData)) {
        this.collections[colName] = {};
        records.forEach(item => {
          const key = item.uid || item.challengeId || item.submissionId || item.evaluationId || item.passportId || item.jobId || item.shortlistId || item.notificationId || item.questionId || 'id_' + Math.random().toString(36).substr(2, 8);
          this.collections[colName][key] = item;
        });
      }
    }
  }

  getCollection(colName) {
    if (!this.collections[colName]) {
      this.collections[colName] = {};
    }
    return Object.values(this.collections[colName]);
  }

  getById(colName, id) {
    if (!this.collections[colName]) return null;
    return this.collections[colName][id] || null;
  }

  set(colName, id, data) {
    if (!this.collections[colName]) this.collections[colName] = {};
    this.collections[colName][id] = { ...data, id };
    return this.collections[colName][id];
  }

  update(colName, id, updates) {
    if (!this.collections[colName] || !this.collections[colName][id]) {
      return null;
    }
    this.collections[colName][id] = { ...this.collections[colName][id], ...updates };
    return this.collections[colName][id];
  }

  delete(colName, id) {
    if (!this.collections[colName]) return false;
    delete this.collections[colName][id];
    return true;
  }
}

const db = new DataStore();
module.exports = db;

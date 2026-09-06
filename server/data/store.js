import { initialIssues } from './defaultData.js';

class IssuesStore {
  constructor() {
    this.issues = JSON.parse(JSON.stringify(initialIssues));
  }

  getAll() {
    return this.issues;
  }

  getById(id) {
    return this.issues.find(i => i.id === id);
  }

  add(issue) {
    this.issues.unshift(issue);
    return issue;
  }

  update(id, updates) {
    const idx = this.issues.findIndex(i => i.id === id);
    if (idx !== -1) {
      this.issues[idx] = { ...this.issues[idx], ...updates };
      return this.issues[idx];
    }
    return null;
  }

  delete(id) {
    const idx = this.issues.findIndex(i => i.id === id);
    if (idx !== -1) {
      const removed = this.issues.splice(idx, 1);
      return removed[0];
    }
    return null;
  }

  reset() {
    this.issues = JSON.parse(JSON.stringify(initialIssues));
    return this.issues;
  }
}

export const store = new IssuesStore();

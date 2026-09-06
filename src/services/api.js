const API_BASE = '/api';

const TOKEN_KEY = 'fixlocal_auth_token';
const USER_KEY = 'fixlocal_auth_user';
const UPVOTE_KEY = 'fixlocal_user_upvotes';

// --- Auth Token & User Helpers ---

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthSession = (token, user) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = () => {
  try {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  setAuthSession(data.token, data.user);
  return data;
};

export const registerUser = async (userData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  setAuthSession(data.token, data.user);
  return data;
};

export const verifyCurrentSession = async () => {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      clearAuthSession();
      return null;
    }
    const data = await res.json();
    setAuthSession(token, data.user);
    return data.user;
  } catch {
    return null;
  }
};

// --- Upvotes Storage ---

export const getUserUpvotes = () => {
  try {
    const saved = localStorage.getItem(UPVOTE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const saveUserUpvote = (issueId, hasUpvoted) => {
  try {
    let list = getUserUpvotes();
    if (hasUpvoted) {
      if (!list.includes(issueId)) list.push(issueId);
    } else {
      list = list.filter(id => id !== issueId);
    }
    localStorage.setItem(UPVOTE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Storage error', e);
  }
};

// --- Issues API ---

export const fetchIssues = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.category && params.category !== 'all') query.append('category', params.category);
  if (params.severity && params.severity !== 'all') query.append('severity', params.severity);
  if (params.search) query.append('search', params.search);
  if (params.sort) query.append('sort', params.sort);

  const res = await fetch(`${API_BASE}/issues?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to load issues');
  return res.json();
};

export const fetchIssueById = async (id) => {
  const res = await fetch(`${API_BASE}/issues/${id}`);
  if (!res.ok) throw new Error('Issue not found');
  return res.json();
};

export const createIssue = async (issueData) => {
  const res = await fetch(`${API_BASE}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(issueData)
  });
  if (!res.ok) throw new Error('Failed to create issue');
  return res.json();
};

export const toggleUpvote = async (issueId, userId = 'usr_guest') => {
  const res = await fetch(`${API_BASE}/issues/${issueId}/upvote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  if (!res.ok) throw new Error('Failed to upvote');
  const data = await res.json();
  saveUserUpvote(issueId, data.hasUpvoted);
  return data;
};

export const updateIssueStatus = async (issueId, { status, note, authorityName, department, priority }) => {
  const res = await fetch(`${API_BASE}/issues/${issueId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note, authorityName, department, priority })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
};

export const deleteIssue = async (issueId) => {
  const res = await fetch(`${API_BASE}/issues/${issueId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete issue');
  return res.json();
};

export const fetchAnalytics = async () => {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Failed to load analytics');
  return res.json();
};

export const analyzeReportAI = async (payload) => {
  const res = await fetch(`${API_BASE}/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('AI analysis failed');
  return res.json();
};

export const resetSampleData = async () => {
  const res = await fetch(`${API_BASE}/issues/reset`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Reset failed');
  return res.json();
};

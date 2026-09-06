import { Router } from 'express';
import {
  getIssues,
  getIssueById,
  createIssue,
  upvoteIssue,
  updateStatus,
  deleteIssue,
  resetData
} from '../controllers/issuesController.js';
import { getAnalytics } from '../controllers/analyticsController.js';
import { analyzeReport } from '../controllers/aiController.js';
import { register, login, getCurrentUser, getAllUsers } from '../controllers/authController.js';

const router = Router();

// Authentication Endpoints
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', getCurrentUser);
router.get('/auth/users', getAllUsers);

// Issues CRUD & Interactions
router.get('/issues', getIssues);
router.get('/issues/:id', getIssueById);
router.post('/issues', createIssue);
router.post('/issues/:id/upvote', upvoteIssue);
router.patch('/issues/:id/status', updateStatus);
router.delete('/issues/:id', deleteIssue);
router.post('/issues/reset', resetData);

// Analytics
router.get('/analytics', getAnalytics);

// Civic AI Engine
router.post('/ai/analyze', analyzeReport);

export default router;

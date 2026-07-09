import express from 'express';
import {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getAllBlogPosts
} from '../controllers/blogController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getBlogPosts);
router.get('/:id', getBlogPost);

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, getAllBlogPosts);

// Protected routes (admin only for now)
router.post('/', authenticateToken, requireAdmin, createBlogPost);
router.put('/:id', authenticateToken, requireAdmin, updateBlogPost);
router.delete('/:id', authenticateToken, requireAdmin, deleteBlogPost);

export default router;
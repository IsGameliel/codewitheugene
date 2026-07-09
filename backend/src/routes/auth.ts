import express from 'express';
import { register, login, getProfile, getAllUsers, updateUserRole, deleteUser } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

// Admin routes
router.get('/admin/users', authenticateToken, requireAdmin, getAllUsers);
router.put('/admin/users/:id/role', authenticateToken, requireAdmin, updateUserRole);
router.delete('/admin/users/:id', authenticateToken, requireAdmin, deleteUser);

export default router;
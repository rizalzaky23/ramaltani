/**
 * Auth Routes
 * POST /api/auth/login
 * POST /api/auth/logout
 * GET  /api/auth/me
 */
const express = require('express');
const { z } = require('zod');
const authService = require('../services/authService');
const { authenticate } = require('../middleware/auth');
const { success, error } = require('../utils/apiResponse');

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password tidak boleh kosong'),
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.authenticateUser(email, password);

    return success(res, result, { message: 'Login berhasil' });
  } catch (err) {
    if (err.name === 'ZodError') return next(err);
    return error(res, 'AUTH_FAILED', err.message || 'Login gagal', 401);
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, (req, res) => {
  // JWT is stateless; logout is client-side
  return success(res, null, { message: 'Logout berhasil' });
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  const user = authService.getUserById(req.user.userId);
  if (!user) {
    return error(res, 'USER_NOT_FOUND', 'Pengguna tidak ditemukan', 404);
  }
  return success(res, user);
});

module.exports = router;

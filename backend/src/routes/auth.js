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

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['farmer', 'extension_officer', 'admin']).optional().default('farmer'),
  phone: z.string().optional(),
  location: z.string().optional(),
  commodity: z.string().optional(),
  landSize: z.union([z.number(), z.string()]).optional(),
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.registerUser(validatedData);

    return success(res, result, { message: 'Pendaftaran berhasil. Akun Anda telah disimpan di database!' }, 201);
  } catch (err) {
    if (err.name === 'ZodError') return next(err);
    return error(res, 'REGISTER_FAILED', err.message || 'Pendaftaran gagal', 400);
  }
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
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.userId);
    if (!user) {
      return error(res, 'USER_NOT_FOUND', 'Pengguna tidak ditemukan', 404);
    }
    return success(res, user);
  } catch (err) {
    return error(res, 'SERVER_ERROR', err.message, 500);
  }
});

module.exports = router;

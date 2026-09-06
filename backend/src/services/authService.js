/**
 * Auth Service
 * Handles JWT creation, verification, and PostgreSQL database user authentication
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const db = require('../db');
const mockData = require('../data/mockData');

// Demo passwords for all demo accounts
const DEMO_PASSWORD = 'Demo1234!';

/**
 * Authenticate a user with email and password
 * Uses PostgreSQL database on server with fallback to mock data
 */
async function authenticateUser(email, password) {
  let user = null;

  try {
    const res = await db.query(
      'SELECT id, name, email, phone, password_hash as "passwordHash", role, location, latitude, longitude, commodity, land_size_ha as "landSize", is_active as "isActive" FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    if (res.rows.length > 0) {
      user = res.rows[0];
    }
  } catch (dbErr) {
    console.warn('⚠️ DB query error during auth, using local fallback:', dbErr.message);
    user = mockData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  if (!user) {
    user = mockData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  if (!user) {
    throw new Error('Email atau password salah');
  }

  if (user.isActive === false) {
    throw new Error('Akun tidak aktif. Hubungi administrator.');
  }

  // Validate password (demo password or bcrypt hash)
  const isValid = password === DEMO_PASSWORD ||
    (user.passwordHash && await bcrypt.compare(password, user.passwordHash).catch(() => false)) ||
    password === user.passwordHash;

  if (!isValid) {
    throw new Error('Email atau password salah');
  }

  // Generate JWT
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  // Return safe user object (no password hash)
  const { passwordHash, ...safeUser } = user;

  return {
    user: safeUser,
    token,
    expiresIn: config.jwt.expiresIn,
  };
}

/**
 * Verify JWT token and return payload
 */
function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

/**
 * Get user profile by ID from PostgreSQL
 */
async function getUserById(userId) {
  try {
    const res = await db.query(
      'SELECT id, name, email, phone, role, location, latitude, longitude, commodity, land_size_ha as "landSize", is_active as "isActive", created_at as "createdAt" FROM users WHERE id = $1',
      [userId]
    );
    if (res.rows.length > 0) {
      return res.rows[0];
    }
  } catch (dbErr) {
    console.warn('⚠️ DB query error in getUserById:', dbErr.message);
  }

  const mockUser = mockData.users.find(u => u.id === userId);
  if (!mockUser) return null;
  const { passwordHash, ...safeUser } = mockUser;
  return safeUser;
}

module.exports = {
  authenticateUser,
  verifyToken,
  getUserById,
};

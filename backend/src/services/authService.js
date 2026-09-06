/**
 * Auth Service
 * Handles JWT creation and verification
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const mockData = require('../data/mockData');

// Demo passwords for all demo accounts
const DEMO_PASSWORD = 'Demo1234!';

/**
 * Authenticate a user with email and password
 * Returns user data and JWT token on success
 */
async function authenticateUser(email, password) {
  // Find user in mock data
  const user = mockData.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    throw new Error('Email atau password salah');
  }

  if (!user.isActive) {
    throw new Error('Akun tidak aktif. Hubungi administrator.');
  }

  // For demo accounts, check against demo password
  const isValid = password === DEMO_PASSWORD ||
    await bcrypt.compare(password, user.passwordHash).catch(() => false);

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
 * Get user profile by ID from mock data
 */
function getUserById(userId) {
  const user = mockData.users.find(u => u.id === userId);
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  authenticateUser,
  verifyToken,
  getUserById,
};

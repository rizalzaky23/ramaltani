/**
 * Authentication Middleware
 * JWT verification and role-based access control
 */
const { verifyToken } = require('../services/authService');
const { error } = require('../utils/apiResponse');

/**
 * Verify JWT token from Authorization header
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'AUTH_REQUIRED', 'Autentikasi diperlukan. Silakan login.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'TOKEN_EXPIRED', 'Sesi telah berakhir. Silakan login kembali.', 401);
    }
    return error(res, 'TOKEN_INVALID', 'Token tidak valid.', 401);
  }
}

/**
 * Role-based access control middleware factory
 * @param {...string} roles - Allowed roles
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'AUTH_REQUIRED', 'Autentikasi diperlukan.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(
        res,
        'FORBIDDEN',
        'Anda tidak memiliki akses ke fitur ini.',
        403
      );
    }

    next();
  };
}

/**
 * Optional authentication — attaches user if token present, continues if not
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = verifyToken(token);
  } catch {
    req.user = null;
  }
  next();
}

module.exports = { authenticate, requireRole, optionalAuth };

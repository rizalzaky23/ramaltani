/**
 * Error handling middleware
 */
const { error } = require('../utils/apiResponse');

/**
 * Global error handler — catches unhandled errors from route handlers
 */
function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);

  // Validation errors (Zod)
  if (err.name === 'ZodError') {
    return error(
      res,
      'VALIDATION_ERROR',
      'Data tidak valid: ' + err.errors.map(e => e.message).join(', '),
      422
    );
  }

  // Generic errors
  const statusCode = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = process.env.NODE_ENV === 'production'
    ? 'Terjadi kesalahan pada server. Silakan coba lagi.'
    : err.message;

  return error(res, code, message, statusCode);
}

/**
 * 404 handler — route not found
 */
function notFound(req, res) {
  return error(res, 'NOT_FOUND', `Endpoint ${req.method} ${req.path} tidak ditemukan.`, 404);
}

module.exports = { errorHandler, notFound };

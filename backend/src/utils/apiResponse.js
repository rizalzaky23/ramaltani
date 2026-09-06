/**
 * Standard API response helpers
 */

/**
 * Success response
 */
function success(res, data, meta = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
}

/**
 * Error response
 */
function error(res, code, message, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Paginated response
 */
function paginated(res, data, page, limit, total, meta = {}) {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
}

module.exports = { success, error, paginated };

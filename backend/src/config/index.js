require('dotenv').config();

const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  bmkg: {
    baseUrl: process.env.BMKG_BASE_URL || 'https://api.bmkg.go.id',
    cacheTTL: parseInt(process.env.BMKG_CACHE_TTL_MINUTES || '30') * 60, // seconds
  },
  openMeteo: {
    baseUrl: process.env.OPEN_METEO_BASE_URL || 'https://api.open-meteo.com',
    geocodingUrl: process.env.OPEN_METEO_GEOCODING_URL || 'https://geocoding-api.open-meteo.com',
    cacheTTL: parseInt(process.env.OPEN_METEO_CACHE_TTL_MINUTES || '30') * 60,
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  },
};

module.exports = config;

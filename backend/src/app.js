/**
 * RamalTani Backend API
 * Climate-Smart Farming Decision Platform
 * 
 * Architecture: Express.js with layered services
 * External APIs: BMKG (primary weather), Open-Meteo (fallback)
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');
const recommendationRoutes = require('./routes/recommendations');
const apiRoutes = require('./routes/api');

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow map tiles
}));

app.use(cors({
  origin: [
    config.cors.frontendUrl,
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Terlalu banyak permintaan. Coba lagi dalam beberapa menit.',
    },
  },
});
app.use('/api', limiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ──────────────────────────────────────────────────────────────────
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api', apiRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'RamalTani API',
    version: '1.0.0',
    description: 'Climate-Smart Farming Decision Platform',
    tagline: 'Baca Cuaca. Atur Tanam. Jaga Panen.',
    docs: '/api/health',
    status: 'running',
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = config.port;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🌾 RamalTani API berjalan di http://localhost:${PORT}`);
    console.log(`📡 BMKG API: ${config.bmkg.baseUrl}`);
    console.log(`🌤️  Open-Meteo: ${config.openMeteo.baseUrl}`);
    console.log(`🔐 JWT expires: ${config.jwt.expiresIn}`);
    console.log(`🌍 Frontend URL: ${config.cors.frontendUrl}\n`);
  });
}

module.exports = app; // For testing

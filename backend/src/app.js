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

// ─── Kinde Authentication (Google / Social Auth) ─────────────────────────────
const { setupKinde, getUser, GrantType } = require('@kinde-oss/kinde-node-express');
const jwt = require('jsonwebtoken');
const db = require('./db');

const kindeConfig = {
  clientId: process.env.KINDE_CLIENT_ID || 'a00410884d8e4a6db60f78c7784477d3',
  issuerBaseUrl: process.env.KINDE_ISSUER_BASE_URL || 'https://rizalzaky.kinde.com',
  siteUrl: process.env.KINDE_SITE_URL || 'http://localhost:5001/kinde-success',
  secret: process.env.KINDE_SECRET || 'WRidKLM6K6ngUX3YJEYwHukS0tcOyVCjw6R3cdkCtqfWnVYfWW',
  redirectUrl: process.env.KINDE_REDIRECT_URL || 'http://localhost:3000/callback',
  grantType: GrantType.AUTHORIZATION_CODE,
  unAuthorisedUrl: `${config.cors.frontendUrl}/login?error=kinde_unauthorized`,
  postLogoutRedirectUrl: config.cors.frontendUrl,
};

setupKinde(kindeConfig, app);

// Kinde Success Callback: sync user to PostgreSQL and redirect to frontend
app.get('/kinde-success', getUser, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      console.warn('⚠️ No user profile returned by Kinde in /kinde-success');
      return res.redirect(`${config.cors.frontendUrl}/login?error=kinde_no_user`);
    }

    const email = req.user.email.toLowerCase().trim();
    const name = [req.user.given_name, req.user.family_name].filter(Boolean).join(' ') || req.user.name || email.split('@')[0];
    const picture = req.user.picture || null;

    // Check if user already exists in PostgreSQL
    let userRow;
    const existing = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (existing.rows.length > 0) {
      userRow = existing.rows[0];
    } else {
      const newId = `usr-${Date.now()}`;
      const insertRes = await db.query(
        `INSERT INTO users (id, name, email, role, location, commodity, land_size_ha, is_active)
         VALUES ($1, $2, $3, 'farmer', 'Ngawi, Jawa Timur', 'Padi', 1.0, TRUE)
         RETURNING *`,
        [newId, name, email]
      );
      userRow = insertRes.rows[0];
      console.log(`✅ Akun Google/Kinde baru berhasil dibuat di database PostgreSQL: ${email}`);
    }

    // Sign JWT token
    const token = jwt.sign(
      {
        userId: userRow.id,
        email: userRow.email,
        role: userRow.role,
        name: userRow.name,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const safeUser = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      phone: userRow.phone,
      role: userRow.role,
      location: userRow.location,
      commodity: userRow.commodity,
      landSize: userRow.land_size_ha,
      avatarUrl: picture,
      isActive: true,
    };

    const target = `${config.cors.frontendUrl}/auth/kinde-callback?token=${encodeURIComponent(token)}&user=${encodeURIComponent(JSON.stringify(safeUser))}`;
    return res.redirect(target);
  } catch (err) {
    console.error('❌ Error handling Kinde success callback:', err);
    return res.redirect(`${config.cors.frontendUrl}/login?error=${encodeURIComponent(err.message)}`);
  }
});

// Aliases for frontend Kinde entrypoints
app.get('/kinde/login', (req, res) => res.redirect('/login'));
app.get('/kinde/register', (req, res) => res.redirect('/register'));
app.get('/kinde/logout', (req, res) => res.redirect('/logout'));

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
    kinde: {
      authDomain: kindeConfig.issuerBaseUrl,
      clientId: kindeConfig.clientId,
      loginUrl: '/login',
      registerUrl: '/register',
    }
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
    console.log(`🔑 Kinde Auth endpoint: http://localhost:${PORT}/login`);
    console.log(`📡 BMKG API: ${config.bmkg.baseUrl}`);
    console.log(`🌤️  Open-Meteo: ${config.openMeteo.baseUrl}`);
    console.log(`🔐 JWT expires: ${config.jwt.expiresIn}`);
    console.log(`🌍 Frontend URL: ${config.cors.frontendUrl}\n`);
  });

  if (PORT !== 3000) {
    try {
      const server3000 = app.listen(3000, () => {
        console.log(`🔗 Kinde Callback Bridge aktif di http://localhost:3000/callback\n`);
      });
      server3000.on('error', (e) => console.log('Port 3000 callback listener note:', e.message));
    } catch (_) {}
  }
}

module.exports = app; // For testing

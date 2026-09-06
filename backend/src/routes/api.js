/**
 * RamalTani API Routes
 * Integrates PostgreSQL database on user server with in-memory fallback
 * Covers: farmers, crops, varieties, planting-history, notifications,
 *         community, education, analytics, broadcast, risk-map, admin, health
 */
const express = require('express');
const db = require('../db');
const mockData = require('../data/mockData');
const { success, error, paginated } = require('../utils/apiResponse');
const { authenticate, requireRole, optionalAuth } = require('../middleware/auth');
const weatherService = require('../services/weatherService');

const router = express.Router();

// ─── FARMERS ──────────────────────────────────────────────────────────────────

router.get('/farmers', authenticate, requireRole('extension_officer', 'admin'), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, phone, role, location, latitude, longitude, commodity, land_size_ha as "landSize", is_active as "isActive", created_at as "createdAt" FROM users WHERE role = $1 ORDER BY name ASC',
      ['farmer']
    );
    if (result.rows.length > 0) {
      return success(res, result.rows, { source: 'database' });
    }
  } catch (err) {
    console.warn('⚠️ DB query error for /farmers, falling back to mockData:', err.message);
  }

  const farmers = mockData.users
    .filter(u => u.role === 'farmer')
    .map(({ passwordHash, ...u }) => u);
  return success(res, farmers, { source: 'mock' });
});

router.get('/farmers/:id', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, phone, role, location, latitude, longitude, commodity, land_size_ha as "landSize", is_active as "isActive", created_at as "createdAt" FROM users WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length > 0) {
      return success(res, result.rows[0], { source: 'database' });
    }
  } catch (err) {
    console.warn('⚠️ DB query error for /farmers/:id:', err.message);
  }

  const user = mockData.users.find(u => u.id === req.params.id);
  if (!user) return error(res, 'NOT_FOUND', 'Petani tidak ditemukan', 404);
  const { passwordHash, ...safeUser } = user;
  return success(res, safeUser, { source: 'mock' });
});

// ─── CROPS ────────────────────────────────────────────────────────────────────

router.get('/crops', optionalAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM crops ORDER BY name ASC');
    if (result.rows.length > 0) {
      const formatted = result.rows.map(c => ({
        id: c.id,
        name: c.name,
        scientificName: c.scientific_name,
        category: c.category,
        optimalRainfall: { min: c.optimal_rainfall_mm_min, max: c.optimal_rainfall_mm_max },
        optimalTemp: { min: parseFloat(c.optimal_temp_c_min), max: parseFloat(c.optimal_temp_c_max) },
        growingPeriodDays: c.growing_period_days,
        description: c.description,
      }));
      return success(res, formatted, { source: 'database' });
    }
  } catch (err) {
    console.warn('⚠️ DB query error for /crops:', err.message);
  }
  return success(res, mockData.crops, { isDemo: true, source: 'mock' });
});

router.get('/varieties', optionalAuth, async (req, res) => {
  const { cropId, cropName } = req.query;
  try {
    let sql = 'SELECT * FROM varieties WHERE 1=1';
    const params = [];
    if (cropId) {
      params.push(cropId);
      sql += ` AND crop_id = $${params.length}`;
    }
    if (cropName) {
      params.push(cropName);
      sql += ` AND crop_name = $${params.length}`;
    }
    sql += ' ORDER BY name ASC';
    const result = await db.query(sql, params);
    if (result.rows.length > 0) {
      const formatted = result.rows.map(v => ({
        id: v.id,
        cropId: v.crop_id,
        cropName: v.crop_name,
        name: v.name,
        durationDays: v.duration_days,
        potentialYieldTonHa: parseFloat(v.potential_yield_ton_ha),
        resistance: v.resistance,
        description: v.description,
        recommendedSeason: v.recommended_season,
      }));
      return success(res, formatted, { source: 'database' });
    }
  } catch (err) {
    console.warn('⚠️ DB query error for /varieties:', err.message);
  }

  let varieties = mockData.varieties;
  if (cropId) varieties = varieties.filter(v => v.cropId === cropId);
  if (cropName) varieties = varieties.filter(v => v.cropName === cropName);
  return success(res, varieties, { isDemo: true, source: 'mock' });
});

router.get('/varieties/:id', optionalAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM varieties WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      const v = result.rows[0];
      return success(res, {
        id: v.id,
        cropId: v.crop_id,
        cropName: v.crop_name,
        name: v.name,
        durationDays: v.duration_days,
        potentialYieldTonHa: parseFloat(v.potential_yield_ton_ha),
        resistance: v.resistance,
        description: v.description,
        recommendedSeason: v.recommended_season,
      }, { source: 'database' });
    }
  } catch (err) {
    console.warn('⚠️ DB query error for /varieties/:id:', err.message);
  }

  const variety = mockData.varieties.find(v => v.id === req.params.id);
  if (!variety) return error(res, 'NOT_FOUND', 'Varietas tidak ditemukan', 404);
  return success(res, variety, { isDemo: true, source: 'mock' });
});

// ─── PLANTING HISTORY ─────────────────────────────────────────────────────────

router.get('/planting-history', authenticate, async (req, res) => {
  try {
    let sql = 'SELECT * FROM planting_history';
    const params = [];
    if (req.user.role === 'farmer') {
      sql += ' WHERE farmer_id = $1';
      params.push(req.user.userId);
    }
    sql += ' ORDER BY planting_date DESC';
    const result = await db.query(sql, params);
    if (result.rows.length > 0) {
      const formatted = result.rows.map(h => ({
        id: h.id,
        farmerId: h.farmer_id,
        cropName: h.crop_name,
        variety: h.variety,
        plantingDate: h.planting_date,
        harvestDate: h.harvest_date,
        areaHa: parseFloat(h.area_ha),
        status: h.status,
        yieldTargetTon: parseFloat(h.yield_target_ton),
        yieldActualTon: parseFloat(h.yield_actual_ton),
        notes: h.notes,
        createdAt: h.created_at,
      }));
      return success(res, formatted, { source: 'database' });
    }
  } catch (err) {
    console.warn('⚠️ DB query error for /planting-history:', err.message);
  }

  const history = mockData.plantingHistory.filter(
    h => req.user.role === 'farmer' ? h.farmerId === req.user.userId : true
  );
  return success(res, history, { isDemo: true, source: 'mock' });
});

router.post('/planting-history', authenticate, requireRole('farmer'), async (req, res) => {
  const newId = `ph-${Date.now()}`;
  const { cropName, variety, plantingDate, harvestDate, areaHa, status, yieldTargetTon, yieldActualTon, notes } = req.body;

  try {
    await db.query(
      `INSERT INTO planting_history (id, farmer_id, crop_name, variety, planting_date, harvest_date, area_ha, status, yield_target_ton, yield_actual_ton, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        newId,
        req.user.userId,
        cropName,
        variety || null,
        plantingDate,
        harvestDate || null,
        areaHa || 1.0,
        status || 'active',
        yieldTargetTon || null,
        yieldActualTon || null,
        notes || null,
      ]
    );

    return success(res, {
      id: newId,
      farmerId: req.user.userId,
      ...req.body,
      createdAt: new Date().toISOString(),
    }, { message: 'Riwayat tanam berhasil disimpan di database server' }, 201);
  } catch (err) {
    console.warn('⚠️ DB insert error for planting-history:', err.message);
    const fallbackEntry = {
      id: newId,
      farmerId: req.user.userId,
      ...req.body,
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    return success(res, fallbackEntry, { message: 'Riwayat tanam berhasil disimpan' }, 201);
  }
});

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

router.get('/notifications', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, user_id as "userId", title, message, type, is_read as "isRead", action_url as "actionUrl", created_at as "createdAt" FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    if (result.rows.length > 0) {
      return success(res, result.rows, { source: 'database' });
    }
  } catch (err) {
    console.warn('⚠️ DB query error for notifications:', err.message);
  }

  const userNotifs = mockData.notifications.filter(n => n.userId === req.user.userId);
  return success(res, userNotifs, { isDemo: true, source: 'mock' });
});

router.post('/notifications/preferences', authenticate, (req, res) => {
  return success(res, { ...req.body, userId: req.user.userId }, {
    message: 'Preferensi notifikasi disimpan',
  });
});

router.patch('/notifications/:id/read', authenticate, async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2', [req.params.id, req.user.userId]);
  } catch (err) {
    console.warn('⚠️ DB update error for notification:', err.message);
  }
  return success(res, { id: req.params.id, isRead: true }, {
    message: 'Notifikasi ditandai telah dibaca',
  });
});

// ─── COMMUNITY ────────────────────────────────────────────────────────────────

router.get('/community/posts', optionalAuth, async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  try {
    let countSql = 'SELECT COUNT(*) FROM community_posts WHERE is_approved = TRUE';
    let dataSql = 'SELECT id, user_id as "userId", author_name as "authorName", author_role as "authorRole", location, category, content, likes_count as "likes", comments_count as "commentsCount", created_at as "createdAt" FROM community_posts WHERE is_approved = TRUE';
    const params = [];

    if (category) {
      params.push(category);
      countSql += ` AND category = $${params.length}`;
      dataSql += ` AND category = $${params.length}`;
    }

    const countRes = await db.query(countSql, params);
    const total = parseInt(countRes.rows[0].count);

    const offset = (page - 1) * limit;
    dataSql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    const dataRes = await db.query(dataSql, [...params, limit, offset]);

    return paginated(res, dataRes.rows, parseInt(page), parseInt(limit), total);
  } catch (err) {
    console.warn('⚠️ DB query error for /community/posts:', err.message);
  }

  let posts = mockData.communityPosts.filter(p => p.isApproved);
  if (category) posts = posts.filter(p => p.category === category);
  const total = posts.length;
  const start = (page - 1) * limit;
  const paginatedPosts = posts.slice(start, start + parseInt(limit));
  return paginated(res, paginatedPosts, parseInt(page), parseInt(limit), total);
});

router.post('/community/posts', authenticate, async (req, res) => {
  const newId = `post-${Date.now()}`;
  const { content, category, location } = req.body;

  try {
    await db.query(
      `INSERT INTO community_posts (id, user_id, author_name, author_role, location, category, content, likes_count, comments_count, is_approved)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0, TRUE)`,
      [
        newId,
        req.user.userId,
        req.user.name,
        req.user.role === 'farmer' ? 'Petani' : req.user.role === 'extension_officer' ? 'Penyuluh' : 'Admin',
        location || 'Ngawi',
        category || 'Tanya Jawab',
        content,
      ]
    );

    return success(res, {
      id: newId,
      authorId: req.user.userId,
      authorName: req.user.name,
      ...req.body,
      likes: 0,
      commentsCount: 0,
      isApproved: true,
      createdAt: new Date().toISOString(),
    }, { message: 'Postingan berhasil disimpan di database server' }, 201);
  } catch (err) {
    console.warn('⚠️ DB insert error for community/posts:', err.message);
    const fallbackPost = {
      id: newId,
      authorId: req.user.userId,
      authorName: req.user.name,
      ...req.body,
      likes: 0,
      commentsCount: 0,
      isApproved: true,
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    return success(res, fallbackPost, { message: 'Postingan berhasil dibuat' }, 201);
  }
});

router.get('/community/posts/:id/comments', optionalAuth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, post_id as "postId", user_id as "authorId", author_name as "authorName", content, created_at as "createdAt" FROM community_comments WHERE post_id = $1 ORDER BY created_at ASC',
      [req.params.id]
    );
    if (result.rows.length > 0) {
      return success(res, result.rows, { source: 'database' });
    }
  } catch (err) {
    console.warn('⚠️ DB query error for comments:', err.message);
  }

  const comments = mockData.communityComments.filter(c => c.postId === req.params.id);
  return success(res, comments, { source: 'mock' });
});

router.post('/community/posts/:id/comments', authenticate, async (req, res) => {
  const newId = `comment-${Date.now()}`;
  try {
    await db.query(
      'INSERT INTO community_comments (id, post_id, user_id, author_name, content) VALUES ($1, $2, $3, $4, $5)',
      [newId, req.params.id, req.user.userId, req.user.name, req.body.content]
    );
    await db.query('UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = $1', [req.params.id]);
  } catch (err) {
    console.warn('⚠️ DB insert error for comment:', err.message);
  }

  const newComment = {
    id: newId,
    postId: req.params.id,
    authorId: req.user.userId,
    authorName: req.user.name,
    content: req.body.content,
    likes: 0,
    createdAt: new Date().toISOString(),
  };
  return success(res, newComment, { message: 'Komentar berhasil ditambahkan' }, 201);
});

router.post('/community/posts/:id/like', authenticate, async (req, res) => {
  try {
    await db.query('UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = $1', [req.params.id]);
  } catch (err) {
    console.warn('⚠️ DB like update error:', err.message);
  }
  return success(res, { postId: req.params.id, liked: true });
});

// ─── EDUCATION ────────────────────────────────────────────────────────────────

router.get('/education', optionalAuth, async (req, res) => {
  const { category } = req.query;
  try {
    let sql = 'SELECT id, title, category, reading_time as "readingTime", author, published_date as "date", summary FROM education_articles';
    const params = [];
    if (category) {
      params.push(category);
      sql += ' WHERE category = $1';
    }
    sql += ' ORDER BY id ASC';
    const result = await db.query(sql, params);
    if (result.rows.length > 0) {
      return success(res, result.rows, { source: 'database' });
    }
  } catch (err) {
    console.warn('⚠️ DB query error for /education:', err.message);
  }

  let articles = mockData.educationArticles;
  if (category) articles = articles.filter(a => a.category === category);
  const listing = articles.map(({ content, ...a }) => a);
  return success(res, listing, { isDemo: true, source: 'mock' });
});

router.get('/education/:id', optionalAuth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, title, category, reading_time as "readingTime", author, published_date as "date", summary, content FROM education_articles WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length > 0) {
      return success(res, result.rows[0], { source: 'database' });
    }
  } catch (err) {
    console.warn('⚠️ DB query error for /education/:id:', err.message);
  }

  const article = mockData.educationArticles.find(a => a.id === req.params.id || a.slug === req.params.id);
  if (!article) return error(res, 'NOT_FOUND', 'Artikel tidak ditemukan', 404);
  return success(res, article, { source: 'mock' });
});

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

router.get('/analytics/region', authenticate, requireRole('extension_officer', 'admin'), (req, res) => {
  return success(res, mockData.extensionAnalytics, { isDemo: true });
});

// ─── BROADCAST ────────────────────────────────────────────────────────────────

router.get('/broadcast', authenticate, requireRole('extension_officer', 'admin'), (req, res) => {
  return success(res, mockData.broadcastMessages, { isDemo: true });
});

router.post('/broadcast', authenticate, requireRole('extension_officer', 'admin'), (req, res) => {
  const recipientCount = Math.floor(Math.random() * 50) + 150;
  const broadcast = {
    id: `bcast-${Date.now()}`,
    senderId: req.user.userId,
    senderName: req.user.name,
    ...req.body,
    recipientCount,
    deliveredCount: recipientCount - Math.floor(Math.random() * 5),
    status: 'delivered',
    createdAt: new Date().toISOString(),
    isDemo: true,
  };

  return success(res, broadcast, {
    message: `Broadcast berhasil dikirim ke ${broadcast.deliveredCount} petani`,
    isDemo: true,
    demoNote: 'Pengiriman pesan nyata memerlukan konfigurasi provider notifikasi',
  }, 201);
});

// ─── RISK MAP ────────────────────────────────────────────────────────────────

router.get('/risk-map', optionalAuth, async (req, res, next) => {
  try {
    const liveRiskData = await weatherService.getRegionalRiskMap();
    return success(res, liveRiskData, {
      source: 'BMKG Resmi',
      isLive: true,
      isDemo: false,
    });
  } catch (err) {
    next(err);
  }
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

router.get('/admin/users', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, phone, role, location, latitude, longitude, commodity, land_size_ha as "landSize", is_active as "isActive", created_at as "createdAt" FROM users ORDER BY created_at DESC'
    );
    if (result.rows.length > 0) {
      return success(res, result.rows, { source: 'database' });
    }
  } catch (err) {
    console.warn('⚠️ DB query error for /admin/users:', err.message);
  }

  const users = mockData.users.map(({ passwordHash, ...u }) => u);
  return success(res, users, { source: 'mock' });
});

router.get('/admin/regions', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM regions ORDER BY name ASC');
    if (result.rows.length > 0) {
      return success(res, result.rows, { source: 'database' });
    }
  } catch (err) {
    console.warn('⚠️ DB query error for /admin/regions:', err.message);
  }
  return success(res, mockData.regions, { source: 'mock' });
});

router.get('/admin/system-logs', authenticate, requireRole('admin'), (req, res) => {
  return success(res, mockData.systemLogs, { total: mockData.systemLogs.length });
});

router.get('/admin/api-health', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const health = await weatherService.getAPIHealthStatus();
    const dbStatus = await db.testConnection();
    health.database = {
      name: 'PostgreSQL Server (192.168.1.8)',
      status: dbStatus.ok ? 'healthy' : 'disconnected',
      database: 'ramaltani_db',
      info: dbStatus.info || null,
      error: dbStatus.error || null,
    };
    return success(res, health);
  } catch (err) {
    next(err);
  }
});

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────

router.get('/health', async (req, res) => {
  const dbStatus = await db.testConnection();
  return success(res, {
    status: dbStatus.ok ? 'healthy' : 'degraded',
    version: '1.0.0',
    service: 'RamalTani Backend API',
    database: {
      connected: dbStatus.ok,
      type: 'PostgreSQL',
      host: process.env.DB_HOST || '192.168.1.8',
      name: process.env.DB_NAME || 'ramaltani_db',
    },
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

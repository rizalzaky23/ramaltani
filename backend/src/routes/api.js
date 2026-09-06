/**
 * All remaining API routes bundled in one file for efficiency
 * Covers: farmers, crops, varieties, planting-history, notifications,
 *         community, education, analytics, broadcast, risk-map, admin, health
 */
const express = require('express');
const mockData = require('../data/mockData');
const { success, error, paginated } = require('../utils/apiResponse');
const { authenticate, requireRole, optionalAuth } = require('../middleware/auth');
const weatherService = require('../services/weatherService');

const router = express.Router();

// ─── FARMERS ──────────────────────────────────────────────────────────────────

router.get('/farmers', authenticate, requireRole('extension_officer', 'admin'), (req, res) => {
  const farmers = mockData.users
    .filter(u => u.role === 'farmer')
    .map(({ passwordHash, ...u }) => u);
  return success(res, farmers);
});

router.get('/farmers/:id', authenticate, (req, res) => {
  const user = mockData.users.find(u => u.id === req.params.id);
  if (!user) return error(res, 'NOT_FOUND', 'Petani tidak ditemukan', 404);
  const { passwordHash, ...safeUser } = user;
  return success(res, safeUser);
});

// ─── CROPS ────────────────────────────────────────────────────────────────────

router.get('/crops', optionalAuth, (req, res) => {
  return success(res, mockData.crops, { isDemo: true });
});

router.get('/varieties', optionalAuth, (req, res) => {
  const { cropId, cropName } = req.query;
  let varieties = mockData.varieties;

  if (cropId) varieties = varieties.filter(v => v.cropId === cropId);
  if (cropName) varieties = varieties.filter(v => v.cropName === cropName);

  return success(res, varieties, { isDemo: true });
});

router.get('/varieties/:id', optionalAuth, (req, res) => {
  const variety = mockData.varieties.find(v => v.id === req.params.id);
  if (!variety) return error(res, 'NOT_FOUND', 'Varietas tidak ditemukan', 404);
  return success(res, variety, { isDemo: true });
});

// ─── PLANTING HISTORY ─────────────────────────────────────────────────────────

router.get('/planting-history', authenticate, (req, res) => {
  const history = mockData.plantingHistory.filter(
    h => req.user.role === 'farmer' ? h.farmerId === req.user.userId : true
  );
  return success(res, history, { isDemo: true });
});

router.post('/planting-history', authenticate, requireRole('farmer'), (req, res) => {
  const newEntry = {
    id: `ph-${Date.now()}`,
    farmerId: req.user.userId,
    ...req.body,
    createdAt: new Date().toISOString(),
    isDemo: true,
  };
  // In production, this would write to DB
  return success(res, newEntry, { message: 'Riwayat tanam berhasil disimpan' }, 201);
});

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

router.get('/notifications', authenticate, (req, res) => {
  const userNotifs = mockData.notifications.filter(n => n.userId === req.user.userId);
  return success(res, userNotifs, { isDemo: true });
});

router.post('/notifications/preferences', authenticate, (req, res) => {
  return success(res, { ...req.body, userId: req.user.userId }, {
    message: 'Preferensi notifikasi disimpan',
  });
});

router.patch('/notifications/:id/read', authenticate, (req, res) => {
  return success(res, { id: req.params.id, isRead: true }, {
    message: 'Notifikasi ditandai telah dibaca',
  });
});

// ─── COMMUNITY ────────────────────────────────────────────────────────────────

router.get('/community/posts', optionalAuth, (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  let posts = mockData.communityPosts.filter(p => p.isApproved);

  if (category) posts = posts.filter(p => p.category === category);

  const total = posts.length;
  const start = (page - 1) * limit;
  const paginatedPosts = posts.slice(start, start + parseInt(limit));

  return paginated(res, paginatedPosts, parseInt(page), parseInt(limit), total);
});

router.post('/community/posts', authenticate, (req, res) => {
  const newPost = {
    id: `post-${Date.now()}`,
    authorId: req.user.userId,
    authorName: req.user.name,
    ...req.body,
    likes: 0,
    commentsCount: 0,
    isApproved: true,
    isReported: false,
    createdAt: new Date().toISOString(),
    isDemo: true,
  };
  return success(res, newPost, { message: 'Postingan berhasil dibuat' }, 201);
});

router.get('/community/posts/:id/comments', optionalAuth, (req, res) => {
  const comments = mockData.communityComments.filter(c => c.postId === req.params.id);
  return success(res, comments);
});

router.post('/community/posts/:id/comments', authenticate, (req, res) => {
  const newComment = {
    id: `comment-${Date.now()}`,
    postId: req.params.id,
    authorId: req.user.userId,
    authorName: req.user.name,
    content: req.body.content,
    likes: 0,
    createdAt: new Date().toISOString(),
    isDemo: true,
  };
  return success(res, newComment, { message: 'Komentar berhasil ditambahkan' }, 201);
});

router.post('/community/posts/:id/like', authenticate, (req, res) => {
  return success(res, { postId: req.params.id, liked: true });
});

// ─── EDUCATION ────────────────────────────────────────────────────────────────

router.get('/education', optionalAuth, (req, res) => {
  const { category } = req.query;
  let articles = mockData.educationArticles;
  if (category) articles = articles.filter(a => a.category === category);

  // Return without full content for listing
  const listing = articles.map(({ content, ...a }) => a);
  return success(res, listing, { isDemo: true });
});

router.get('/education/:slug', optionalAuth, (req, res) => {
  const article = mockData.educationArticles.find(a => a.slug === req.params.slug);
  if (!article) return error(res, 'NOT_FOUND', 'Artikel tidak ditemukan', 404);
  return success(res, article);
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
  const region = mockData.regions.find(r => r.id === req.body.regionId);
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

router.get('/risk-map', optionalAuth, (req, res) => {
  return success(res, mockData.riskData, {
    source: 'Demo Data',
    isDemo: true,
  });
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

router.get('/admin/users', authenticate, requireRole('admin'), (req, res) => {
  const users = mockData.users.map(({ passwordHash, ...u }) => u);
  return success(res, users);
});

router.get('/admin/regions', authenticate, requireRole('admin'), (req, res) => {
  return success(res, mockData.regions);
});

router.get('/admin/system-logs', authenticate, requireRole('admin'), (req, res) => {
  return success(res, mockData.systemLogs, { total: mockData.systemLogs.length });
});

router.get('/admin/api-health', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const health = await weatherService.getAPIHealthStatus();
    return success(res, health);
  } catch (err) {
    next(err);
  }
});

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────

router.get('/health', (req, res) => {
  return success(res, {
    status: 'healthy',
    version: '1.0.0',
    service: 'RamalTani Backend API',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

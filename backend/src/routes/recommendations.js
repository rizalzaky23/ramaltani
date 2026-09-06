/**
 * Recommendations Routes
 * GET  /api/recommendations — Get saved recommendations
 * POST /api/recommendations/calculate — Calculate new recommendation
 * GET  /api/risk-map — Get risk data for all regions
 */
const express = require('express');
const { z } = require('zod');
const { generateRecommendation } = require('../utils/recommendationEngine');
const weatherService = require('../services/weatherService');
const mockData = require('../data/mockData');
const { success, error } = require('../utils/apiResponse');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

const recommendationSchema = z.object({
  regionId: z.string().min(1, 'Region diperlukan'),
  cropName: z.string().min(1, 'Nama tanaman diperlukan'),
  varietyName: z.string().optional(),
  soilCondition: z.enum(['sandy', 'clay', 'loam', 'normal']).optional().default('normal'),
  targetDate: z.string().optional(),
  farmArea: z.number().positive().optional(),
});

// POST /api/recommendations/calculate
router.post('/calculate', optionalAuth, async (req, res, next) => {
  try {
    const input = recommendationSchema.parse(req.body);

    // Get weather forecast for the region
    const weatherData = await weatherService.getWeatherData(input.regionId);
    const forecast = weatherData?.forecast || [];

    // Generate recommendation
    const recommendation = generateRecommendation({
      crop: input.cropName,
      variety: input.varietyName || null,
      forecast,
      soilCondition: input.soilCondition,
    });

    return success(res, recommendation, {
      source: weatherData?.source || 'Demo Data',
      weatherLocation: weatherData?.location?.name,
      isMock: weatherData?.isMock || false,
      engine: 'Climate-aware rule engine v1.0',
      disclaimer: 'Rekomendasi ini merupakan interpretasi data cuaca, bukan jaminan hasil panen. Konsultasikan dengan penyuluh pertanian setempat.',
    });
  } catch (err) {
    if (err.name === 'ZodError') return next(err);
    next(err);
  }
});

// GET /api/recommendations — Farmer's saved recommendations
router.get('/', authenticate, (req, res) => {
  // Return mock recommendation for demo
  const mockRecommendation = {
    id: 'rec-001',
    userId: req.user.userId,
    crop: 'Padi',
    variety: 'Ciherang',
    regionId: 'reg-001',
    status: 'LAYAK TANAM',
    window: {
      start: '12 September 2026',
      end: '15 September 2026',
      startDate: '2026-09-12',
      endDate: '2026-09-15',
    },
    confidence: 82,
    risk: 'Rendah',
    riskBadge: 'Aman',
    riskScore: 24,
    reason: 'Curah hujan diperkirakan mulai stabil dan tidak terdapat indikasi hujan ekstrem dalam 5 hari pertama penanaman.',
    action: 'Mulai persiapan lahan dan benih. Kondisi cuaca mendukung penanaman dalam waktu dekat.',
    alternative: '17–19 September 2026',
    generatedAt: '2026-09-06T08:05:00+07:00',
    isDemo: true,
  };

  return success(res, [mockRecommendation], {
    source: 'Demo Data',
  });
});

// GET /api/risk-map — Risk data for all regions
router.get('/risk-map', optionalAuth, (req, res) => {
  return success(res, mockData.riskData, {
    source: 'Demo Data',
    isDemo: true,
  });
});

module.exports = router;

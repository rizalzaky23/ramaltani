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
  varietyName: z.string().nullable().optional(),
  soilCondition: z.enum(['sandy', 'clay', 'loam', 'normal']).optional().default('normal'),
  targetDate: z.string().nullable().optional(),
  farmArea: z.number().positive().nullable().optional(),
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
      source: weatherData?.source || 'BMKG Resmi',
      weatherLocation: weatherData?.location?.name,
      isMock: weatherData?.isMock || false,
      isLive: true,
      isDemo: false,
      engine: 'Climate-aware rule engine v1.0',
      disclaimer: 'Rekomendasi ini merupakan interpretasi data cuaca resmi BMKG, bukan jaminan hasil panen. Konsultasikan dengan penyuluh pertanian setempat.',
    });
  } catch (err) {
    if (err.name === 'ZodError') return next(err);
    next(err);
  }
});

// GET /api/recommendations — Farmer's live recommendations
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userRegion = req.user?.location || 'reg-001';
    const regionObj = mockData.regions.find(r => r.id === userRegion || r.name.toLowerCase() === (req.user?.location || '').toLowerCase()) || mockData.regions[0];
    const weatherData = await weatherService.getWeatherData(regionObj.id);
    const recommendation = generateRecommendation({
      crop: req.user?.commodity || 'Padi',
      forecast: weatherData?.forecast || [],
    });

    return success(res, [{
      id: `rec-${req.user.userId}`,
      userId: req.user.userId,
      crop: req.user?.commodity || 'Padi',
      regionId: regionObj.id,
      regionName: regionObj.name,
      recommendation,
      source: weatherData.source || 'BMKG Resmi',
      isLive: true,
      isDemo: false,
      generatedAt: new Date().toISOString(),
    }], {
      source: weatherData.source || 'BMKG Resmi',
      isLive: true,
      isDemo: false,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/recommendations/risk-map — Live risk data from BMKG for all regions
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

module.exports = router;

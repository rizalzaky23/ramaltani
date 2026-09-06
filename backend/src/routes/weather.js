/**
 * Weather Routes
 * GET /api/weather/:regionId
 * GET /api/weather/:regionId/forecast
 * GET /api/weather/alerts
 */
const express = require('express');
const weatherService = require('../services/weatherService');
const mockData = require('../data/mockData');
const { success, error } = require('../utils/apiResponse');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/weather/alerts — Get all active alerts
router.get('/alerts', optionalAuth, async (req, res, next) => {
  try {
    const liveAlerts = await weatherService.getLiveWeatherAlerts();
    return success(res, liveAlerts, {
      source: 'BMKG Resmi',
      count: liveAlerts.length,
      isLive: true,
      isDemo: false,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/weather/regions — List all available regions
router.get('/regions', (req, res) => {
  return success(res, mockData.regions);
});

// GET /api/weather/:regionId — Get current weather + forecast
router.get('/:regionId', optionalAuth, async (req, res, next) => {
  try {
    const { regionId } = req.params;

    const weatherData = await weatherService.getWeatherData(regionId);

    return success(res, weatherData, {
      source: weatherData.source,
      fromCache: weatherData.fromCache || false,
      isMock: weatherData.isMock || false,
    });
  } catch (err) {
    if (err.message.includes('tidak ditemukan')) {
      return error(res, 'REGION_NOT_FOUND', err.message, 404);
    }
    next(err);
  }
});

// GET /api/weather/:regionId/forecast — Get forecast only
router.get('/:regionId/forecast', optionalAuth, async (req, res, next) => {
  try {
    const { regionId } = req.params;
    const weatherData = await weatherService.getWeatherData(regionId);

    return success(res, weatherData.forecast, {
      source: weatherData.source,
      location: weatherData.location,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

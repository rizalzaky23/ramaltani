/**
 * BMKG Weather Service
 * Fetches and caches weather data from BMKG Open Data API
 */
const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config');
const { normalizeBMKGResponse } = require('../utils/weatherNormalizer');
const mockData = require('../data/mockData');

// Cache with TTL from config
const cache = new NodeCache({ stdTTL: config.bmkg.cacheTTL });

/**
 * Fetch weather forecast from BMKG for a given ADM4 code
 * @param {string} adm4Code - BMKG administrative code (e.g., '33.10.08.2001')
 * @param {string} regionName - Human-readable region name
 * @returns {Object|null} Normalized weather data or null on failure
 */
async function fetchBMKGForecast(adm4Code, regionName) {
  const cacheKey = `bmkg_${adm4Code}`;

  // Return cached data if available
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`[WeatherService] Serving BMKG cache for ${regionName}`);
    return { ...cached, fromCache: true };
  }

  try {
    const url = `${config.bmkg.baseUrl}/publik/prakiraan-cuaca?adm4=${adm4Code}`;
    console.log(`[WeatherService] Fetching BMKG: ${url}`);

    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RamalTani/1.0 (climate-smart-farming-platform)',
      },
    });

    const normalized = normalizeBMKGResponse(response.data, regionName);

    if (normalized) {
      cache.set(cacheKey, normalized);
      console.log(`[WeatherService] BMKG data cached for ${regionName}`);
      return { ...normalized, fromCache: false };
    }

    throw new Error('Normalization failed');
  } catch (err) {
    console.error(`[WeatherService] BMKG fetch failed for ${regionName}: ${err.message}`);
    return null;
  }
}

/**
 * Get weather data for a region, with mock fallback
 * @param {string} regionId - Internal region ID
 * @returns {Object} Weather data (live or mock)
 */
async function getWeatherForRegion(regionId) {
  // Find region metadata
  const region = mockData.regions.find(r => r.id === regionId);
  if (!region) {
    throw new Error(`Region ${regionId} not found`);
  }

  // Try BMKG live data first
  const liveData = await fetchBMKGForecast(region.adm4Code, region.name);

  if (liveData) {
    return liveData;
  }

  // Fall back to Open-Meteo (handled by openMeteoService)
  return null; // Signal to caller to try Open-Meteo
}

/**
 * Get cached weather or mark as needs refresh
 */
function getCacheStatus(regionId) {
  const region = mockData.regions.find(r => r.id === regionId);
  if (!region) return null;

  const cacheKey = `bmkg_${region.adm4Code}`;
  const cached = cache.get(cacheKey);

  return {
    hasCachedData: !!cached,
    ttlRemaining: cache.getTtl(cacheKey),
    source: 'BMKG',
  };
}

/**
 * Clear cache for a specific region (for admin use)
 */
function clearRegionCache(regionId) {
  const region = mockData.regions.find(r => r.id === regionId);
  if (region) {
    cache.del(`bmkg_${region.adm4Code}`);
    return true;
  }
  return false;
}

module.exports = {
  fetchBMKGForecast,
  getWeatherForRegion,
  getCacheStatus,
  clearRegionCache,
};

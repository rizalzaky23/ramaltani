/**
 * Open-Meteo Weather Service
 * Fallback weather provider using Open-Meteo free API
 */
const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config');
const { normalizeOpenMeteoResponse } = require('../utils/weatherNormalizer');

const cache = new NodeCache({ stdTTL: config.openMeteo.cacheTTL });

/**
 * Geocode a location name using Open-Meteo geocoding API
 * @param {string} locationName - Name of the location
 * @returns {Object|null} { lat, lon, name } or null
 */
async function geocodeLocation(locationName) {
  const cacheKey = `geocode_${locationName.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${config.openMeteo.geocodingUrl}/v1/search`, {
      params: {
        name: locationName,
        count: 1,
        language: 'id',
        format: 'json',
      },
      timeout: 5000,
    });

    const results = response.data?.results;
    if (!results || results.length === 0) return null;

    const location = {
      name: results[0].name,
      lat: results[0].latitude,
      lon: results[0].longitude,
      country: results[0].country,
      admin1: results[0].admin1,
    };

    cache.set(cacheKey, location, 86400); // Cache geocoding for 24 hours
    return location;
  } catch (err) {
    console.error(`[OpenMeteo] Geocoding failed for ${locationName}: ${err.message}`);
    return null;
  }
}

/**
 * Fetch weather forecast from Open-Meteo
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} locationName - Human-readable location name
 * @returns {Object|null} Normalized weather data
 */
async function fetchOpenMeteoForecast(lat, lon, locationName) {
  const cacheKey = `openmeteo_${lat.toFixed(3)}_${lon.toFixed(3)}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    console.log(`[WeatherService] Serving Open-Meteo cache for ${locationName}`);
    return { ...cached, fromCache: true };
  }

  try {
    const response = await axios.get(`${config.openMeteo.baseUrl}/v1/forecast`, {
      params: {
        latitude: lat,
        longitude: lon,
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'relative_humidity_2m_mean',
          'precipitation_sum',
          'precipitation_probability_max',
          'rain_sum',
          'wind_speed_10m_max',
          'weather_code',
          'et0_fao_evapotranspiration',
        ].join(','),
        timezone: 'Asia/Jakarta',
        forecast_days: 14,
      },
      timeout: 8000,
    });

    const normalized = normalizeOpenMeteoResponse(response.data, locationName, lat, lon);

    if (normalized) {
      cache.set(cacheKey, normalized);
      console.log(`[WeatherService] Open-Meteo data cached for ${locationName}`);
      return { ...normalized, fromCache: false };
    }

    throw new Error('Normalization failed');
  } catch (err) {
    console.error(`[OpenMeteo] Fetch failed for ${locationName}: ${err.message}`);
    return null;
  }
}

/**
 * Get weather with geocoding lookup
 * @param {string} locationName - Location to search
 * @returns {Object|null} Weather data
 */
async function getWeatherByName(locationName) {
  const location = await geocodeLocation(locationName);
  if (!location) return null;

  return fetchOpenMeteoForecast(location.lat, location.lon, location.name);
}

/**
 * Get weather by lat/lon directly
 */
async function getWeatherByCoords(lat, lon, locationName = 'Unknown') {
  return fetchOpenMeteoForecast(lat, lon, locationName);
}

module.exports = {
  geocodeLocation,
  fetchOpenMeteoForecast,
  getWeatherByName,
  getWeatherByCoords,
};

/**
 * Unified Weather Service
 * Orchestrates BMKG (primary) and Open-Meteo (fallback)
 * Returns mock data if both external APIs are unavailable
 */
const bmkgService = require('./bmkgService');
const openMeteoService = require('./openMeteoService');
const mockData = require('../data/mockData');

/**
 * Get weather data for a region using tiered fallback
 * BMKG → Open-Meteo → Mock Data
 * @param {string} regionId - Internal region ID
 * @returns {Object} Weather data with source attribution
 */
async function getWeatherData(regionId) {
  const region = mockData.regions.find(r => r.id === regionId);
  if (!region) {
    throw new Error(`Region tidak ditemukan: ${regionId}`);
  }

  // Tier 1: BMKG
  try {
    const bmkgData = await bmkgService.getWeatherForRegion(regionId);
    if (bmkgData) {
      console.log(`[WeatherService] Serving BMKG data for ${region.name}`);
      return {
        ...bmkgData,
        source: 'BMKG',
        fallback: false,
      };
    }
  } catch (err) {
    console.warn(`[WeatherService] BMKG unavailable for ${region.name}: ${err.message}`);
  }

  // Tier 2: Open-Meteo
  try {
    const openMeteoData = await openMeteoService.getWeatherByCoords(
      region.latitude,
      region.longitude,
      region.name
    );
    if (openMeteoData) {
      console.log(`[WeatherService] Serving Open-Meteo fallback for ${region.name}`);
      return {
        ...openMeteoData,
        source: 'Open-Meteo',
        fallback: true,
        fallbackReason: 'Data BMKG sementara tidak tersedia',
      };
    }
  } catch (err) {
    console.warn(`[WeatherService] Open-Meteo unavailable for ${region.name}: ${err.message}`);
  }

  // Tier 3: Mock Data
  console.log(`[WeatherService] Serving mock data for ${region.name}`);
  const mockWeather = mockData.weatherData[regionId] || generateMockWeather(region);

  return {
    ...mockWeather,
    source: mockWeather.source || 'Demo Data',
    fallback: true,
    isMock: true,
    fallbackReason: 'Menggunakan data demo karena layanan cuaca eksternal tidak tersedia',
  };
}

/**
 * Generate basic mock weather for regions without dedicated mock data
 */
function generateMockWeather(region) {
  const forecast = mockData.generateWeatherForecast(region.id);
  return {
    location: {
      name: region.name,
      regionId: region.id,
      latitude: region.latitude,
      longitude: region.longitude,
    },
    current: forecast[0],
    forecast,
    source: 'Demo Data',
    lastUpdated: new Date().toISOString(),
    isDemo: true,
  };
}

/**
 * Get API health status for all weather providers
 */
async function getAPIHealthStatus() {
  const status = { ...mockData.apiHealth };

  // Live check BMKG
  try {
    const start = Date.now();
    await require('axios').get(`${require('../config').bmkg.baseUrl}/publik/prakiraan-cuaca?adm4=33.10.08.2001`, {
      timeout: 5000,
    });
    status.bmkg = {
      ...status.bmkg,
      status: 'healthy',
      responseMs: Date.now() - start,
      lastSync: new Date().toISOString(),
    };
  } catch {
    status.bmkg = {
      ...status.bmkg,
      status: 'degraded',
      lastSync: status.bmkg.lastSync,
    };
  }

  // Live check Open-Meteo
  try {
    const start = Date.now();
    await require('axios').get(`${require('../config').openMeteo.baseUrl}/v1/forecast`, {
      params: { latitude: -7.7058, longitude: 110.6069, daily: 'temperature_2m_max', forecast_days: 1 },
      timeout: 5000,
    });
    status.openMeteo = {
      ...status.openMeteo,
      status: 'healthy',
      responseMs: Date.now() - start,
      lastSync: new Date().toISOString(),
    };
  } catch {
    status.openMeteo = {
      ...status.openMeteo,
      status: 'degraded',
    };
  }

  return status;
}

module.exports = {
  getWeatherData,
  generateMockWeather,
  getAPIHealthStatus,
};

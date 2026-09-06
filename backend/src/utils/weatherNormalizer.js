/**
 * Weather normalization utilities
 * Converts BMKG and Open-Meteo responses to a common internal format
 */

/**
 * Normalize BMKG forecast response to internal format
 * @param {Object} bmkgResponse - Raw BMKG API response
 * @param {string} regionName - Region name for context
 * @returns {Object} Normalized weather data
 */
function normalizeBMKGResponse(bmkgResponse, regionName) {
  try {
    if (!bmkgResponse || !bmkgResponse.data) {
      throw new Error('Invalid BMKG response structure');
    }

    const data = bmkgResponse.data;
    const lokasi = data.lokasi || {};
    const cuaca = data.cuaca || [];

    // Flatten cuaca array (BMKG returns nested arrays by day)
    const flatForecasts = cuaca.flat ? cuaca.flat() : [].concat(...cuaca);

    const forecast = flatForecasts.slice(0, 10).map((item) => {
      const localDate = item.local_datetime || item.utc_datetime;
      const date = localDate ? localDate.split(' ')[0] : new Date().toISOString().split('T')[0];

      return {
        date,
        dateLabel: formatDateLabel(date),
        description: translateBMKGWeather(item.weather_desc || ''),
        weatherCode: mapBMKGWeatherCode(item.weather || 0),
        rainProbability: parseInt(item.hujan_persen || item.hu || 0),
        rainfallMm: parseFloat(item.curah_hujan || 0),
        temperature: parseFloat(item.t || item.tmax || 28),
        temperatureMin: parseFloat(item.tmin || (item.t - 4) || 24),
        temperatureMax: parseFloat(item.tmax || (item.t + 2) || 30),
        humidity: parseInt(item.rh || 75),
        windSpeed: parseFloat(item.ws_ms || item.ws || 10) * 3.6, // m/s to km/h
        soilMoisture: estimateSoilMoisture(parseInt(item.rh || 75), parseFloat(item.curah_hujan || 0)),
      };
    });

    return {
      location: {
        name: regionName || lokasi.desa || lokasi.kecamatan || 'Unknown',
        province: lokasi.provinsi || '',
        latitude: parseFloat(lokasi.lat || 0),
        longitude: parseFloat(lokasi.lon || 0),
      },
      current: forecast[0] || null,
      forecast,
      source: 'BMKG',
      lastUpdated: new Date().toISOString(),
      isLive: true,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Normalize Open-Meteo response to internal format
 * @param {Object} openMeteoResponse - Raw Open-Meteo response
 * @param {string} locationName - Location name
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Object} Normalized weather data
 */
function normalizeOpenMeteoResponse(openMeteoResponse, locationName, lat, lon) {
  try {
    const daily = openMeteoResponse.daily;
    if (!daily) throw new Error('No daily data in Open-Meteo response');

    const forecast = daily.time.slice(0, 10).map((date, i) => ({
      date,
      dateLabel: formatDateLabel(date),
      description: mapOpenMeteoWMOCode(daily.weather_code?.[i] || 0),
      weatherCode: mapOpenMeteoCodeToInternal(daily.weather_code?.[i] || 0),
      rainProbability: parseInt(daily.precipitation_probability_max?.[i] || 0),
      rainfallMm: parseFloat(daily.precipitation_sum?.[i] || 0),
      temperature: parseFloat(
        ((daily.temperature_2m_max?.[i] || 28) + (daily.temperature_2m_min?.[i] || 24)) / 2
      ).toFixed(1) * 1,
      temperatureMin: parseFloat(daily.temperature_2m_min?.[i] || 24),
      temperatureMax: parseFloat(daily.temperature_2m_max?.[i] || 30),
      humidity: parseFloat(daily.relative_humidity_2m_mean?.[i] || 75),
      windSpeed: parseFloat(daily.wind_speed_10m_max?.[i] || 10),
      soilMoisture: estimateSoilMoisture(
        parseFloat(daily.relative_humidity_2m_mean?.[i] || 75),
        parseFloat(daily.precipitation_sum?.[i] || 0)
      ),
      et0: parseFloat(daily.et0_fao_evapotranspiration?.[i] || 0),
    }));

    return {
      location: {
        name: locationName || 'Unknown',
        latitude: lat || 0,
        longitude: lon || 0,
      },
      current: forecast[0] || null,
      forecast,
      source: 'Open-Meteo',
      lastUpdated: new Date().toISOString(),
      isLive: true,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Translate BMKG weather description to Indonesian
 */
function translateBMKGWeather(desc) {
  const map = {
    'Cerah': 'Cerah',
    'Cerah Berawan': 'Cerah berawan',
    'Berawan': 'Berawan',
    'Berawan Tebal': 'Berawan tebal',
    'Hujan Ringan': 'Hujan ringan',
    'Hujan Sedang': 'Hujan sedang',
    'Hujan Lebat': 'Hujan lebat',
    'Hujan Lokal': 'Hujan lokal',
    'Hujan Petir': 'Hujan disertai petir',
    'Asap': 'Kabut asap',
    'Kabut': 'Berkabut',
    'Udara Kabur': 'Udara berkabur',
  };
  return map[desc] || desc || 'Tidak tersedia';
}

/**
 * Map BMKG weather code to internal weather code
 */
function mapBMKGWeatherCode(code) {
  const map = {
    0: 'sunny',
    1: 'sunny',
    2: 'partly_cloudy',
    3: 'cloudy',
    4: 'thick_cloud',
    45: 'foggy',
    60: 'light_rain',
    61: 'light_rain',
    63: 'moderate_rain',
    65: 'heavy_rain',
    80: 'light_rain',
    81: 'moderate_rain',
    82: 'heavy_rain',
    95: 'thunderstorm',
    97: 'thunderstorm',
  };
  return map[code] || 'partly_cloudy';
}

/**
 * Map Open-Meteo WMO code to description in Indonesian
 */
function mapOpenMeteoWMOCode(code) {
  if (code === 0) return 'Cerah';
  if (code <= 2) return 'Cerah berawan';
  if (code <= 3) return 'Berawan';
  if (code <= 19) return 'Berkabut';
  if (code <= 29) return 'Hujan ringan';
  if (code <= 39) return 'Badai debu';
  if (code <= 49) return 'Berkabut';
  if (code <= 59) return 'Gerimis';
  if (code <= 65) return code >= 63 ? 'Hujan lebat' : 'Hujan ringan';
  if (code <= 75) return 'Hujan salju';
  if (code <= 79) return 'Hujan es';
  if (code <= 84) return code >= 82 ? 'Hujan lebat' : 'Hujan ringan';
  if (code <= 90) return 'Hujan petir';
  if (code <= 99) return 'Hujan petir lebat';
  return 'Tidak tersedia';
}

/**
 * Map Open-Meteo WMO code to internal code
 */
function mapOpenMeteoCodeToInternal(code) {
  if (code === 0) return 'sunny';
  if (code <= 2) return 'partly_cloudy';
  if (code <= 3) return 'cloudy';
  if (code <= 49) return 'foggy';
  if (code <= 59) return 'drizzle';
  if (code <= 65) return code >= 63 ? 'heavy_rain' : 'light_rain';
  if (code <= 75) return 'snow';
  if (code <= 84) return code >= 82 ? 'heavy_rain' : 'moderate_rain';
  if (code <= 99) return 'thunderstorm';
  return 'partly_cloudy';
}

/**
 * Estimate soil moisture based on humidity and rainfall
 */
function estimateSoilMoisture(humidity, rainfallMm) {
  if (rainfallMm > 20 || humidity > 88) return 'Sangat Tinggi';
  if (rainfallMm > 10 || humidity > 80) return 'Tinggi';
  if (rainfallMm > 2 || humidity > 70) return 'Sedang';
  return 'Rendah';
}

/**
 * Format date to Indonesian label
 */
function formatDateLabel(dateStr) {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

module.exports = {
  normalizeBMKGResponse,
  normalizeOpenMeteoResponse,
  translateBMKGWeather,
  mapBMKGWeatherCode,
  mapOpenMeteoWMOCode,
  estimateSoilMoisture,
  formatDateLabel,
};

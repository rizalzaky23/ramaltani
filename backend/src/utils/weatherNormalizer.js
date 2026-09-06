/**
 * Weather normalization utilities
 * Converts BMKG and Open-Meteo responses to a common internal format
 */

/**
 * Normalize real BMKG forecast response to internal format
 * @param {Object} bmkgResponse - Raw BMKG API response
 * @param {string} regionName - Region name for context
 * @returns {Object} Normalized weather data
 */
function normalizeBMKGResponse(bmkgResponse, regionName) {
  try {
    if (!bmkgResponse) throw new Error('Empty BMKG response');

    const rootLokasi = bmkgResponse.lokasi || {};
    const regionData = Array.isArray(bmkgResponse.data) ? bmkgResponse.data[0] : (bmkgResponse.data || {});
    const lokasi = regionData.lokasi || rootLokasi;
    const rawCuaca = regionData.cuaca || [];

    // Flatten all time points across all days (BMKG provides array of days containing 3-hourly time points)
    const flatPoints = (rawCuaca.flat ? rawCuaca.flat(2) : [].concat(...rawCuaca));

    if (!flatPoints || flatPoints.length === 0) {
      throw new Error('No weather forecast points found in BMKG response');
    }

    // Group by date (YYYY-MM-DD)
    const byDate = {};
    for (const pt of flatPoints) {
      const dStr = (pt.local_datetime || pt.datetime || "").split(" ")[0].split("T")[0];
      if (!dStr) continue;
      if (!byDate[dStr]) byDate[dStr] = [];
      byDate[dStr].push(pt);
    }

    const forecast = Object.entries(byDate).map(([date, points]) => {
      const temps = points.map(p => p.t).filter(v => typeof v === 'number');
      const tMin = temps.length ? Math.min(...temps) : 23;
      const tMax = temps.length ? Math.max(...temps) : 33;
      const tAvg = temps.length ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length) : 28;

      const hus = points.map(p => p.hu).filter(v => typeof v === 'number');
      const huAvg = hus.length ? Math.round(hus.reduce((a, b) => a + b, 0) / hus.length) : 80;

      const wss = points.map(p => p.ws).filter(v => typeof v === 'number');
      const wsMax = wss.length ? Math.max(...wss) : 10;

      const tps = points.map(p => p.tp).filter(v => typeof v === 'number');
      const rainfallSum = tps.length ? parseFloat(tps.reduce((a, b) => a + b, 0).toFixed(1)) : 0;

      // Pick midday or representative weather point
      const midday = points.find(p => (p.local_datetime || '').includes('12:00') || (p.local_datetime || '').includes('15:00'))
        || points[Math.floor(points.length / 2)]
        || points[0];

      const wCode = mapBMKGWeatherCode(midday.weather || 1);
      const isRainy = (midday.weather >= 60 && midday.weather <= 97) || rainfallSum > 0;
      const rainProb = rainfallSum > 10 ? 90 : rainfallSum > 2 ? 75 : isRainy ? 65 : 20;

      const desc = translateBMKGWeather(midday.weather_desc || '');

      return {
        date,
        dateLabel: formatDateLabel(date),
        description: desc,
        weatherDesc: desc,
        weatherCode: wCode,
        temperature: tAvg,
        temperatureC: tAvg,
        temperatureMin: tMin,
        temperatureMax: tMax,
        humidity: huAvg,
        windSpeed: parseFloat((wsMax).toFixed(1)),
        rainfallMm: rainfallSum,
        rainProbability: rainProb,
        soilMoisture: estimateSoilMoisture(huAvg, rainfallSum),
        iconUrl: midday.image || null,
        rawBMKGCode: midday.weather,
      };
    });

    // Find point closest to right now (current hour observation)
    const now = new Date();
    let closestPoint = flatPoints[0];
    let minDiff = Infinity;
    for (const p of flatPoints) {
      const pTime = new Date(p.datetime || p.utc_datetime).getTime();
      const diff = Math.abs(pTime - now.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closestPoint = p;
      }
    }

    const currentDesc = translateBMKGWeather(closestPoint?.weather_desc || '');
    const current = closestPoint ? {
      date: closestPoint.local_datetime?.split(' ')[0] || forecast[0]?.date,
      time: closestPoint.local_datetime?.split(' ')[1]?.slice(0, 5) || '00:00',
      localDatetime: closestPoint.local_datetime,
      description: currentDesc,
      weatherDesc: currentDesc,
      weatherCode: mapBMKGWeatherCode(closestPoint.weather || 1),
      temperature: closestPoint.t ?? forecast[0]?.temperature,
      temperatureC: closestPoint.t ?? forecast[0]?.temperature,
      temperatureMin: forecast[0]?.temperatureMin,
      temperatureMax: forecast[0]?.temperatureMax,
      humidity: closestPoint.hu ?? forecast[0]?.humidity,
      windSpeed: closestPoint.ws ?? forecast[0]?.windSpeed,
      windDirection: closestPoint.wd || '',
      rainfallMm: closestPoint.tp || 0,
      rainProbability: forecast[0]?.rainProbability ?? 20,
      iconUrl: closestPoint.image || forecast[0]?.iconUrl,
      rawBMKGCode: closestPoint.weather,
    } : (forecast[0] || null);

    return {
      location: {
        name: regionName || lokasi.kotkab || lokasi.desa || 'Wilayah Pertanian',
        city: lokasi.kotkab || '',
        subdistrict: lokasi.kecamatan || '',
        village: lokasi.desa || '',
        province: lokasi.provinsi || 'Jawa',
        latitude: parseFloat(lokasi.lat || 0),
        longitude: parseFloat(lokasi.lon || 0),
        adm4: lokasi.adm4 || '',
      },
      current,
      forecast,
      source: 'BMKG Resmi',
      sourceAttribution: 'Badan Meteorologi, Klimatologi, dan Geofisika (BMKG Resmi)',
      isLive: true,
      isDemo: false,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.warn('⚠️ normalizeBMKGResponse error:', error.message);
    return null;
  }
}

/**
 * Normalize Open-Meteo response to internal format
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
        name: locationName || 'Wilayah Pertanian',
        latitude: lat || 0,
        longitude: lon || 0,
      },
      current: forecast[0] || null,
      forecast,
      source: 'Open-Meteo',
      sourceAttribution: 'Open-Meteo Global Weather Service',
      lastUpdated: new Date().toISOString(),
      isLive: true,
      isDemo: false,
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
    'Cerah Berawan': 'Cerah Berawan',
    'Berawan': 'Berawan',
    'Berawan Tebal': 'Berawan Tebal',
    'Hujan Ringan': 'Hujan Ringan',
    'Hujan Sedang': 'Hujan Sedang',
    'Hujan Lebat': 'Hujan Lebat',
    'Hujan Lokal': 'Hujan Lokal',
    'Hujan Petir': 'Hujan Petir',
    'Asap': 'Kabut Asap',
    'Kabut': 'Berkabut',
    'Udara Kabur': 'Udara Kabur',
  };
  return map[desc] || desc || 'Cerah Berawan';
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
    10: 'foggy',
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
  if (code <= 2) return 'Cerah Berawan';
  if (code <= 3) return 'Berawan';
  if (code <= 19) return 'Berkabut';
  if (code <= 29) return 'Hujan Ringan';
  if (code <= 39) return 'Badai Debu';
  if (code <= 49) return 'Berkabut';
  if (code <= 59) return 'Gerimis';
  if (code <= 65) return code >= 63 ? 'Hujan Lebat' : 'Hujan Ringan';
  if (code <= 75) return 'Hujan Salju';
  if (code <= 79) return 'Hujan Es';
  if (code <= 84) return code >= 82 ? 'Hujan Lebat' : 'Hujan Ringan';
  if (code <= 90) return 'Hujan Petir';
  if (code <= 99) return 'Hujan Petir Lebat';
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
  mapOpenMeteoCodeToInternal,
  estimateSoilMoisture,
  formatDateLabel,
};

/**
 * RamalTani Recommendation Engine
 * Climate-aware rule engine for planting recommendations
 * This is a transparent rule-based system, NOT an ML model.
 */

/**
 * Risk levels and labels
 */
const RISK_LEVELS = {
  LOW: { min: 0, max: 30, label: 'Rendah', badge: 'Aman', color: '#6E9F43' },
  MODERATE: { min: 31, max: 60, label: 'Waspada', badge: 'Perlu Perhatian', color: '#D8A83E' },
  HIGH: { min: 61, max: 80, label: 'Tinggi', badge: 'Berisiko', color: '#C07020' },
  CRITICAL: { min: 81, max: 100, label: 'Sangat Tinggi', badge: 'Darurat', color: '#B03A2E' },
};

/**
 * Crop requirements for risk scoring
 */
const CROP_REQUIREMENTS = {
  'Padi': {
    optimalRainProbMin: 40,
    optimalRainProbMax: 80,
    criticalRainThreshold: 50, // mm/day
    minHumidity: 60,
    maxHumidity: 90,
    minTemp: 22,
    maxTemp: 35,
    consecutiveWetDaysLimit: 5,
    droughtRiskAfterDryDays: 4,
  },
  'Jagung': {
    optimalRainProbMin: 30,
    optimalRainProbMax: 70,
    criticalRainThreshold: 40,
    minHumidity: 55,
    maxHumidity: 85,
    minTemp: 18,
    maxTemp: 38,
    consecutiveWetDaysLimit: 4,
    droughtRiskAfterDryDays: 5,
  },
  'Cabai': {
    optimalRainProbMin: 25,
    optimalRainProbMax: 65,
    criticalRainThreshold: 30,
    minHumidity: 50,
    maxHumidity: 80,
    minTemp: 18,
    maxTemp: 35,
    consecutiveWetDaysLimit: 3,
    droughtRiskAfterDryDays: 3,
  },
  'Kedelai': {
    optimalRainProbMin: 35,
    optimalRainProbMax: 70,
    criticalRainThreshold: 35,
    minHumidity: 55,
    maxHumidity: 85,
    minTemp: 20,
    maxTemp: 34,
    consecutiveWetDaysLimit: 4,
    droughtRiskAfterDryDays: 5,
  },
  'Bawang Merah': {
    optimalRainProbMin: 20,
    optimalRainProbMax: 55,
    criticalRainThreshold: 25,
    minHumidity: 50,
    maxHumidity: 75,
    minTemp: 20,
    maxTemp: 33,
    consecutiveWetDaysLimit: 3,
    droughtRiskAfterDryDays: 3,
  },
};

/**
 * Calculate risk score for a given forecast window
 * @param {Array} forecastDays - Array of forecast objects
 * @param {string} cropName - Target crop name
 * @returns {number} Risk score 0-100
 */
function calculateRiskScore(forecastDays, cropName = 'Padi') {
  const req = CROP_REQUIREMENTS[cropName] || CROP_REQUIREMENTS['Padi'];
  let score = 0;
  const reasons = [];

  if (!forecastDays || forecastDays.length === 0) {
    return { score: 50, reasons: ['Data cuaca tidak tersedia, risiko diasumsikan sedang'] };
  }

  // 1. Consecutive wet days check (heavy rain impact)
  let consecutiveWetDays = 0;
  let maxConsecutiveWet = 0;
  for (const day of forecastDays) {
    if (day.rainProbability > 70 && day.rainfallMm > 10) {
      consecutiveWetDays++;
      maxConsecutiveWet = Math.max(maxConsecutiveWet, consecutiveWetDays);
    } else {
      consecutiveWetDays = 0;
    }
  }

  if (maxConsecutiveWet >= req.consecutiveWetDaysLimit) {
    const penalty = Math.min(25, maxConsecutiveWet * 5);
    score += penalty;
    reasons.push(`Hujan lebih dari ${maxConsecutiveWet} hari berturut-turut dapat mengganggu persemaian`);
  }

  // 2. Extreme rainfall check
  const extremeRainDays = forecastDays.filter(d => d.rainfallMm >= req.criticalRainThreshold);
  if (extremeRainDays.length > 0) {
    const penalty = Math.min(30, extremeRainDays.length * 10);
    score += penalty;
    reasons.push(`${extremeRainDays.length} hari dengan potensi hujan ekstrem (>${req.criticalRainThreshold}mm)`);
  }

  // 3. Rain probability average
  const avgRainProb = forecastDays.reduce((sum, d) => sum + d.rainProbability, 0) / forecastDays.length;
  if (avgRainProb > req.optimalRainProbMax) {
    const excess = avgRainProb - req.optimalRainProbMax;
    const penalty = Math.min(20, excess * 0.5);
    score += penalty;
    reasons.push(`Rata-rata peluang hujan ${Math.round(avgRainProb)}% melebihi optimal`);
  } else if (avgRainProb < req.optimalRainProbMin) {
    const deficit = req.optimalRainProbMin - avgRainProb;
    const penalty = Math.min(15, deficit * 0.4);
    score += penalty;
    reasons.push(`Peluang hujan terlalu rendah (${Math.round(avgRainProb)}%), risiko kekeringan`);
  }

  // 4. Dry spell check
  let dryDays = 0;
  let maxDrySpell = 0;
  for (const day of forecastDays) {
    if (day.rainProbability < 30 && day.rainfallMm < 1) {
      dryDays++;
      maxDrySpell = Math.max(maxDrySpell, dryDays);
    } else {
      dryDays = 0;
    }
  }
  if (maxDrySpell >= req.droughtRiskAfterDryDays) {
    const penalty = Math.min(15, maxDrySpell * 3);
    score += penalty;
    reasons.push(`Periode kering ${maxDrySpell} hari berpotensi mengganggu pertumbuhan`);
  }

  // 5. Temperature check
  const avgTemp = forecastDays.reduce((sum, d) => sum + d.temperature, 0) / forecastDays.length;
  if (avgTemp > req.maxTemp) {
    score += 10;
    reasons.push(`Suhu rata-rata (${Math.round(avgTemp)}°C) melebihi optimal untuk ${cropName}`);
  } else if (avgTemp < req.minTemp) {
    score += 10;
    reasons.push(`Suhu rata-rata (${Math.round(avgTemp)}°C) terlalu rendah untuk ${cropName}`);
  }

  // 6. Humidity check
  const avgHumidity = forecastDays.reduce((sum, d) => sum + d.humidity, 0) / forecastDays.length;
  if (avgHumidity > req.maxHumidity) {
    score += 5;
    reasons.push(`Kelembapan tinggi (${Math.round(avgHumidity)}%) meningkatkan risiko penyakit tanaman`);
  }

  return {
    score: Math.min(100, Math.round(score)),
    reasons: reasons.length > 0 ? reasons : ['Kondisi cuaca dalam batas normal'],
    details: {
      avgRainProbability: Math.round(avgRainProb),
      avgTemperature: Math.round(avgTemp),
      avgHumidity: Math.round(avgHumidity),
      maxConsecutiveWetDays: maxConsecutiveWet,
      maxDrySpell,
      extremeRainDays: extremeRainDays.length,
    },
  };
}

/**
 * Get risk level object from score
 */
function getRiskLevel(score) {
  if (score <= 30) return RISK_LEVELS.LOW;
  if (score <= 60) return RISK_LEVELS.MODERATE;
  if (score <= 80) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.CRITICAL;
}

/**
 * Calculate confidence score for recommendation
 * Higher confidence when weather data is consistent and stable
 */
function calculateConfidence(forecastDays, riskScore) {
  if (!forecastDays || forecastDays.length === 0) return 40;

  // Variance in rain probability (lower variance = higher confidence)
  const rainProbs = forecastDays.map(d => d.rainProbability);
  const avgRain = rainProbs.reduce((a, b) => a + b, 0) / rainProbs.length;
  const variance = rainProbs.reduce((sum, p) => sum + Math.pow(p - avgRain, 2), 0) / rainProbs.length;
  const stdDev = Math.sqrt(variance);

  let confidence = 90;

  // Higher variability = lower confidence
  if (stdDev > 25) confidence -= 15;
  else if (stdDev > 15) confidence -= 8;

  // Higher risk = lower confidence in positive recommendation
  if (riskScore > 60) confidence -= 20;
  else if (riskScore > 40) confidence -= 10;

  // Fewer forecast days = lower confidence
  if (forecastDays.length < 5) confidence -= 10;

  return Math.max(40, Math.min(95, Math.round(confidence)));
}

/**
 * Find best planting window in the next 14 days
 * @param {Array} forecastDays - Extended forecast array
 * @param {string} cropName - Target crop
 * @returns {Object} Best window with start/end dates
 */
function findBestPlantingWindow(forecastDays, cropName = 'Padi') {
  if (!forecastDays || forecastDays.length < 3) {
    return { start: null, end: null, found: false };
  }

  const req = CROP_REQUIREMENTS[cropName] || CROP_REQUIREMENTS['Padi'];
  let bestWindowScore = Infinity;
  let bestWindowStart = 0;
  const windowSize = 4; // 4-day window

  for (let i = 0; i <= forecastDays.length - windowSize; i++) {
    const window = forecastDays.slice(i, i + windowSize);
    const { score } = calculateRiskScore(window, cropName);

    if (score < bestWindowScore) {
      bestWindowScore = score;
      bestWindowStart = i;
    }
  }

  const startDay = forecastDays[bestWindowStart];
  const endDay = forecastDays[Math.min(bestWindowStart + windowSize - 1, forecastDays.length - 1)];

  return {
    start: startDay?.date,
    startLabel: formatDate(startDay?.date),
    end: endDay?.date,
    endLabel: formatDate(endDay?.date),
    riskScore: bestWindowScore,
    found: bestWindowScore < 70,
  };
}

/**
 * Find alternative planting window (after primary window)
 */
function findAlternativeWindow(forecastDays, cropName, primaryWindowEnd) {
  if (!forecastDays || !primaryWindowEnd) return null;

  const afterPrimary = forecastDays.filter(d => d.date > primaryWindowEnd);
  if (afterPrimary.length < 3) return null;

  const alt = findBestPlantingWindow(afterPrimary, cropName);
  if (!alt.found) return null;

  return `${alt.startLabel} – ${alt.endLabel}`;
}

/**
 * Generate recommendation action based on risk level and crop stage
 */
function generateRecommendedAction(riskScore, cropName, status) {
  if (status === 'TIDAK DISARANKAN') {
    return 'Tunda penanaman hingga kondisi cuaca lebih stabil. Gunakan waktu ini untuk mempersiapkan lahan dan benih.';
  }
  if (riskScore <= 30) {
    return 'Mulai persiapan lahan dan benih. Kondisi cuaca mendukung penanaman dalam waktu dekat.';
  }
  if (riskScore <= 60) {
    return 'Persiapkan lahan dan pantau prakiraan cuaca setiap hari. Hindari penanaman pada hari dengan peluang hujan >80%.';
  }
  return 'Tunggu kondisi cuaca lebih stabil. Pastikan drainase lahan berfungsi baik sebelum mulai menanam.';
}

/**
 * Generate full planting recommendation
 * @param {Object} input - { crop, variety, forecast, soilCondition }
 * @returns {Object} Complete recommendation
 */
function generateRecommendation(input) {
  const { crop = 'Padi', variety = null, forecast = [], soilCondition = 'normal' } = input;

  // Use first 7 days for primary analysis
  const primaryForecast = forecast.slice(0, 7);
  const { score: riskScore, reasons, details } = calculateRiskScore(primaryForecast, crop);
  const riskLevel = getRiskLevel(riskScore);
  const confidence = calculateConfidence(primaryForecast, riskScore);

  // Determine planting window
  const primaryWindow = findBestPlantingWindow(forecast, crop);
  const alternativeWindow = findAlternativeWindow(forecast, crop, primaryWindow?.end);

  // Determine status
  let status;
  if (riskScore <= 30) status = 'LAYAK TANAM';
  else if (riskScore <= 60) status = 'PERLU PERHATIAN';
  else if (riskScore <= 80) status = 'TUNDA DULU';
  else status = 'TIDAK DISARANKAN';

  const action = generateRecommendedAction(riskScore, crop, status);

  // Primary reason (most important)
  const primaryReason = reasons[0] || 'Kondisi cuaca dalam batas normal untuk penanaman.';

  return {
    crop,
    variety,
    recommendation: {
      status,
      window: primaryWindow.found ? {
        start: primaryWindow.startLabel,
        end: primaryWindow.endLabel,
        startDate: primaryWindow.start,
        endDate: primaryWindow.end,
      } : null,
      confidence,
      risk: riskLevel.label,
      riskBadge: riskLevel.badge,
      riskScore,
      riskColor: riskLevel.color,
      reason: primaryReason,
      allReasons: reasons,
      action,
      alternative: alternativeWindow,
      details,
    },
    engine: 'Climate-aware rule engine v1.0',
    generatedAt: new Date().toISOString(),
    isLive: true,
    isDemo: false,
  };
}

/**
 * Format date to Indonesian readable format
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

module.exports = {
  calculateRiskScore,
  getRiskLevel,
  calculateConfidence,
  findBestPlantingWindow,
  generateRecommendation,
  RISK_LEVELS,
  CROP_REQUIREMENTS,
};

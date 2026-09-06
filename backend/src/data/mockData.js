/**
 * RamalTani — Mock Data Seeds
 * Realistic Indonesian agricultural demo data
 * All data is clearly labeled as demo/sample
 */

// ─── REGIONS ──────────────────────────────────────────────────────────────────
const regions = [
  {
    id: 'reg-001',
    name: 'Klaten',
    province: 'Jawa Tengah',
    latitude: -7.7058,
    longitude: 110.6069,
    adm4Code: '33.10.08.2001',
    area: 'Wilayah Demo',
    mainCrops: ['Padi', 'Jagung', 'Kedelai'],
    totalFarmers: 8420,
    totalArea: 12400, // ha
  },
  {
    id: 'reg-002',
    name: 'Sleman',
    province: 'DI Yogyakarta',
    latitude: -7.7158,
    longitude: 110.3553,
    adm4Code: '34.04.10.2003',
    area: 'Wilayah Demo',
    mainCrops: ['Padi', 'Cabai', 'Bawang Merah'],
    totalFarmers: 6310,
    totalArea: 8900,
  },
  {
    id: 'reg-003',
    name: 'Bantul',
    province: 'DI Yogyakarta',
    latitude: -7.8880,
    longitude: 110.3325,
    adm4Code: '34.02.05.2001',
    area: 'Wilayah Demo',
    mainCrops: ['Padi', 'Kacang Tanah', 'Cabai'],
    totalFarmers: 5920,
    totalArea: 7100,
  },
  {
    id: 'reg-004',
    name: 'Kulon Progo',
    province: 'DI Yogyakarta',
    latitude: -7.8205,
    longitude: 110.1622,
    adm4Code: '34.01.08.2002',
    area: 'Wilayah Demo',
    mainCrops: ['Padi', 'Melon', 'Cabai'],
    totalFarmers: 4200,
    totalArea: 5800,
  },
  {
    id: 'reg-005',
    name: 'Magelang',
    province: 'Jawa Tengah',
    latitude: -7.4797,
    longitude: 110.2177,
    adm4Code: '33.08.05.2001',
    area: 'Wilayah Demo',
    mainCrops: ['Padi', 'Jagung', 'Tembakau'],
    totalFarmers: 7180,
    totalArea: 9600,
  },
  {
    id: 'reg-006',
    name: 'Karanganyar',
    province: 'Jawa Tengah',
    latitude: -7.6028,
    longitude: 111.0167,
    adm4Code: '33.13.04.2001',
    area: 'Wilayah Demo',
    mainCrops: ['Padi', 'Singkong', 'Kedelai'],
    totalFarmers: 5640,
    totalArea: 7200,
  },
  {
    id: 'reg-007',
    name: 'Sragen',
    province: 'Jawa Tengah',
    latitude: -7.4264,
    longitude: 111.0187,
    adm4Code: '33.14.06.2001',
    area: 'Wilayah Demo',
    mainCrops: ['Padi', 'Jagung', 'Semangka'],
    totalFarmers: 6870,
    totalArea: 8400,
  },
  {
    id: 'reg-008',
    name: 'Boyolali',
    province: 'Jawa Tengah',
    latitude: -7.5327,
    longitude: 110.5988,
    adm4Code: '33.09.07.2001',
    area: 'Wilayah Demo',
    mainCrops: ['Padi', 'Jagung', 'Cabai'],
    totalFarmers: 5210,
    totalArea: 6900,
  },
  {
    id: 'reg-009',
    name: 'Ngawi',
    province: 'Jawa Timur',
    latitude: -7.4042,
    longitude: 111.4462,
    adm4Code: '35.21.01.2001',
    area: 'Sentra Padi Jawa Timur',
    mainCrops: ['Padi', 'Jagung', 'Kedelai'],
    totalFarmers: 9850,
    totalArea: 14200,
  },
];

// ─── CROPS ────────────────────────────────────────────────────────────────────
const crops = [
  { id: 'crop-001', name: 'Padi', nameEn: 'Rice', icon: '🌾', category: 'Serealia' },
  { id: 'crop-002', name: 'Jagung', nameEn: 'Corn', icon: '🌽', category: 'Serealia' },
  { id: 'crop-003', name: 'Cabai', nameEn: 'Chili', icon: '🌶️', category: 'Sayuran' },
  { id: 'crop-004', name: 'Kedelai', nameEn: 'Soybean', icon: '🫘', category: 'Kacang-kacangan' },
  { id: 'crop-005', name: 'Bawang Merah', nameEn: 'Red Onion', icon: '🧅', category: 'Sayuran' },
  { id: 'crop-006', name: 'Singkong', nameEn: 'Cassava', icon: '🥔', category: 'Umbi-umbian' },
  { id: 'crop-007', name: 'Kacang Tanah', nameEn: 'Peanut', icon: '🥜', category: 'Kacang-kacangan' },
];

// ─── CROP VARIETIES ───────────────────────────────────────────────────────────
const varieties = [
  {
    id: 'var-001',
    cropId: 'crop-001',
    cropName: 'Padi',
    name: 'Inpari 32',
    fullName: 'Inpari 32 HDB',
    characteristics: {
      droughtTolerant: false,
      floodTolerant: true,
      harvestAgeDays: 118,
      yieldPotential: 8.0, // ton/ha
      yieldAverage: 6.2,
    },
    suitableRegions: ['Dataran rendah', 'Irigasi teknis'],
    description: 'Varietas unggul dengan ketahanan terhadap genangan air dan blast.',
    isDemo: true,
  },
  {
    id: 'var-002',
    cropId: 'crop-001',
    cropName: 'Padi',
    name: 'Inpari 42',
    fullName: 'Inpari 42 Agritan GSR',
    characteristics: {
      droughtTolerant: true,
      floodTolerant: false,
      harvestAgeDays: 110,
      yieldPotential: 8.9,
      yieldAverage: 6.5,
    },
    suitableRegions: ['Dataran rendah', 'Lahan kering potensial'],
    description: 'Toleran kekeringan, cocok untuk daerah dengan curah hujan tidak menentu.',
    isDemo: true,
  },
  {
    id: 'var-003',
    cropId: 'crop-001',
    cropName: 'Padi',
    name: 'Ciherang',
    fullName: 'Ciherang',
    characteristics: {
      droughtTolerant: false,
      floodTolerant: false,
      harvestAgeDays: 116,
      yieldPotential: 8.5,
      yieldAverage: 6.0,
    },
    suitableRegions: ['Dataran rendah', 'Irigasi'],
    description: 'Varietas populer dengan rasa nasi pulen dan produktivitas stabil.',
    isDemo: true,
  },
  {
    id: 'var-004',
    cropId: 'crop-001',
    cropName: 'Padi',
    name: 'IR64',
    fullName: 'IR64',
    characteristics: {
      droughtTolerant: false,
      floodTolerant: false,
      harvestAgeDays: 120,
      yieldPotential: 7.5,
      yieldAverage: 5.5,
    },
    suitableRegions: ['Dataran rendah', 'Irigasi teknis'],
    description: 'Varietas standar dengan adaptabilitas luas dan pasar yang sudah terbentuk.',
    isDemo: true,
  },
  {
    id: 'var-005',
    cropId: 'crop-001',
    cropName: 'Padi',
    name: 'Situbagendit',
    fullName: 'Situbagendit',
    characteristics: {
      droughtTolerant: true,
      floodTolerant: false,
      harvestAgeDays: 112,
      yieldPotential: 7.0,
      yieldAverage: 5.0,
    },
    suitableRegions: ['Lahan tadah hujan', 'Dataran rendah hingga menengah'],
    description: 'Cocok untuk lahan tadah hujan dengan ketersediaan air terbatas.',
    isDemo: true,
  },
  {
    id: 'var-006',
    cropId: 'crop-002',
    cropName: 'Jagung',
    name: 'Bisi-18',
    fullName: 'Bisi 18 Hibrida',
    characteristics: {
      droughtTolerant: true,
      floodTolerant: false,
      harvestAgeDays: 105,
      yieldPotential: 12.0,
      yieldAverage: 9.2,
    },
    suitableRegions: ['Dataran rendah hingga menengah'],
    description: 'Jagung hibrida dengan potensi hasil tinggi dan adaptasi luas.',
    isDemo: true,
  },
  {
    id: 'var-007',
    cropId: 'crop-003',
    cropName: 'Cabai',
    name: 'TM 999',
    fullName: 'Cabai Merah TM 999',
    characteristics: {
      droughtTolerant: false,
      floodTolerant: false,
      harvestAgeDays: 85,
      yieldPotential: 20.0, // ton/ha
      yieldAverage: 14.5,
    },
    suitableRegions: ['Dataran rendah', 'Dataran menengah'],
    description: 'Varietas cabai merah produktif dengan ketahanan terhadap penyakit virus.',
    isDemo: true,
  },
];

// ─── USERS ────────────────────────────────────────────────────────────────────
const users = [
  {
    id: 'usr-001',
    name: 'Budi Santoso',
    email: 'farmer@ramaltani.demo',
    // password: Demo1234! (bcrypt hash below is for demo)
    passwordHash: '$2b$10$demo.hash.budi.santoso.ramaltani',
    role: 'farmer',
    avatar: null,
    phone: '+6281234567890',
    regionId: 'reg-001',
    village: 'Desa Karanglo',
    isActive: true,
    createdAt: '2025-01-15T08:00:00+07:00',
  },
  {
    id: 'usr-002',
    name: 'Siti Rahayu',
    email: 'siti@demo.ramaltani',
    passwordHash: '$2b$10$demo.hash.siti.rahayu.ramaltani',
    role: 'farmer',
    avatar: null,
    phone: '+6281234567891',
    regionId: 'reg-001',
    village: 'Desa Tegalrejo',
    isActive: true,
    createdAt: '2025-02-10T09:00:00+07:00',
  },
  {
    id: 'usr-003',
    name: 'Slamet Riyadi',
    email: 'slamet@demo.ramaltani',
    passwordHash: '$2b$10$demo.hash.slamet.riyadi.ramaltani',
    role: 'farmer',
    avatar: null,
    phone: '+6281234567892',
    regionId: 'reg-002',
    village: 'Desa Maguwoharjo',
    isActive: true,
    createdAt: '2025-01-20T10:00:00+07:00',
  },
  {
    id: 'usr-004',
    name: 'Joko Widodo',
    email: 'joko@demo.ramaltani',
    passwordHash: '$2b$10$demo.hash.joko.widodo.ramaltani',
    role: 'farmer',
    avatar: null,
    phone: '+6281234567893',
    regionId: 'reg-001',
    village: 'Desa Karanglo',
    isActive: true,
    createdAt: '2025-03-05T11:00:00+07:00',
  },
  {
    id: 'usr-005',
    name: 'Darmi Wati',
    email: 'darmi@demo.ramaltani',
    passwordHash: '$2b$10$demo.hash.darmi.wati.ramaltani',
    role: 'farmer',
    avatar: null,
    phone: '+6281234567894',
    regionId: 'reg-003',
    village: 'Desa Sriharjo',
    isActive: true,
    createdAt: '2025-01-28T08:30:00+07:00',
  },
  {
    id: 'usr-006',
    name: 'Agus Setiawan',
    email: 'agus@demo.ramaltani',
    passwordHash: '$2b$10$demo.hash.agus.setiawan.ramaltani',
    role: 'farmer',
    avatar: null,
    phone: '+6281234567895',
    regionId: 'reg-001',
    village: 'Desa Bayat',
    isActive: true,
    createdAt: '2025-02-14T09:15:00+07:00',
  },
  {
    id: 'usr-007',
    name: 'Wahyudi Pratama',
    email: 'penyuluh@ramaltani.demo',
    passwordHash: '$2b$10$demo.hash.wahyudi.penyuluh.ramaltani',
    role: 'extension_officer',
    avatar: null,
    phone: '+6281234567896',
    regionId: 'reg-001',
    village: null,
    isActive: true,
    createdAt: '2024-12-01T08:00:00+07:00',
  },
  {
    id: 'usr-008',
    name: 'Admin RamalTani',
    email: 'admin@ramaltani.demo',
    passwordHash: '$2b$10$demo.hash.admin.ramaltani',
    role: 'admin',
    avatar: null,
    phone: '+6281234567897',
    regionId: null,
    village: null,
    isActive: true,
    createdAt: '2024-11-01T08:00:00+07:00',
  },
];

// ─── FARMS ────────────────────────────────────────────────────────────────────
const farms = [
  {
    id: 'farm-001',
    userId: 'usr-001',
    name: 'Sawah Utara',
    regionId: 'reg-001',
    village: 'Desa Karanglo',
    area: 1.2, // ha
    soilType: 'Lempung berdebu',
    irrigationType: 'Irigasi teknis',
    latitude: -7.7024,
    longitude: 110.6080,
    mainCrop: 'Padi',
    notes: 'Lahan warisan, kondisi baik',
  },
  {
    id: 'farm-002',
    userId: 'usr-001',
    name: 'Sawah Selatan',
    regionId: 'reg-001',
    village: 'Desa Karanglo',
    area: 0.8,
    soilType: 'Lempung',
    irrigationType: 'Tadah hujan',
    latitude: -7.7089,
    longitude: 110.6055,
    mainCrop: 'Padi',
    notes: 'Sering tergenang saat hujan deras',
  },
  {
    id: 'farm-003',
    userId: 'usr-002',
    name: 'Kebun Tegalrejo',
    regionId: 'reg-001',
    village: 'Desa Tegalrejo',
    area: 0.5,
    soilType: 'Liat',
    irrigationType: 'Pompa air',
    latitude: -7.6998,
    longitude: 110.6120,
    mainCrop: 'Cabai',
    notes: null,
  },
];

// ─── WEATHER MOCK DATA ────────────────────────────────────────────────────────
const generateWeatherForecast = (regionId, startDate) => {
  const baseDate = startDate ? new Date(startDate) : new Date('2026-09-06');
  const forecasts = [];

  const weatherPatterns = [
    { desc: 'Hujan ringan', rainProb: 68, rainfallMm: 12.4, temp: 28, humidity: 82, windSpeed: 12, code: 'light_rain' },
    { desc: 'Cerah berawan', rainProb: 25, rainfallMm: 0, temp: 31, humidity: 70, windSpeed: 8, code: 'partly_cloudy' },
    { desc: 'Hujan sedang', rainProb: 82, rainfallMm: 18.4, temp: 27, humidity: 88, windSpeed: 15, code: 'moderate_rain' },
    { desc: 'Hujan lebat', rainProb: 91, rainfallMm: 38.2, temp: 25, humidity: 92, windSpeed: 20, code: 'heavy_rain' },
    { desc: 'Cerah', rainProb: 10, rainfallMm: 0, temp: 33, humidity: 65, windSpeed: 6, code: 'sunny' },
    { desc: 'Berawan', rainProb: 40, rainfallMm: 2.1, temp: 29, humidity: 76, windSpeed: 10, code: 'cloudy' },
    { desc: 'Hujan ringan', rainProb: 62, rainfallMm: 8.8, temp: 27, humidity: 84, windSpeed: 11, code: 'light_rain' },
    { desc: 'Cerah berawan', rainProb: 22, rainfallMm: 0, temp: 32, humidity: 68, windSpeed: 7, code: 'partly_cloudy' },
    { desc: 'Berawan', rainProb: 45, rainfallMm: 3.5, temp: 30, humidity: 78, windSpeed: 9, code: 'cloudy' },
    { desc: 'Hujan sedang', rainProb: 78, rainfallMm: 22.6, temp: 26, humidity: 90, windSpeed: 16, code: 'moderate_rain' },
  ];

  for (let i = 0; i < 10; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    const pattern = weatherPatterns[i];

    forecasts.push({
      date: date.toISOString().split('T')[0],
      dateLabel: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
      description: pattern.desc,
      weatherCode: pattern.code,
      rainProbability: pattern.rainProb,
      rainfallMm: pattern.rainfallMm,
      temperature: pattern.temp,
      temperatureMin: pattern.temp - 4,
      temperatureMax: pattern.temp + 2,
      humidity: pattern.humidity,
      windSpeed: pattern.windSpeed,
      soilMoisture: pattern.humidity > 80 ? 'Tinggi' : pattern.humidity > 65 ? 'Sedang' : 'Rendah',
    });
  }

  return forecasts;
};

const weatherData = {
  'reg-001': {
    location: {
      name: 'Klaten',
      regionId: 'reg-001',
      latitude: -7.7058,
      longitude: 110.6069,
    },
    current: {
      date: '2026-09-06',
      time: '20:00',
      description: 'Hujan ringan',
      weatherCode: 'light_rain',
      temperature: 28,
      feelsLike: 30,
      humidity: 82,
      windSpeed: 12,
      rainProbability: 68,
      rainfallMm: 4.2,
      uvIndex: 2,
      visibility: 8,
    },
    forecast: generateWeatherForecast('reg-001'),
    source: 'BMKG',
    lastUpdated: '2026-09-06T20:31:00+07:00',
    isDemo: true,
  },
  'reg-002': {
    location: { name: 'Sleman', regionId: 'reg-002', latitude: -7.7158, longitude: 110.3553 },
    current: {
      date: '2026-09-06', time: '20:00',
      description: 'Berawan', weatherCode: 'cloudy',
      temperature: 29, feelsLike: 31, humidity: 76, windSpeed: 10,
      rainProbability: 42, rainfallMm: 0, uvIndex: 3, visibility: 10,
    },
    forecast: generateWeatherForecast('reg-002'),
    source: 'BMKG',
    lastUpdated: '2026-09-06T20:30:00+07:00',
    isDemo: true,
  },
};

// ─── RISK DATA ────────────────────────────────────────────────────────────────
const riskData = regions.map((region, idx) => {
  const riskScores = [62, 38, 45, 28, 71, 52, 44, 33];
  const score = riskScores[idx] || 40;
  let level, label, color;

  if (score <= 30) { level = 'low'; label = 'Aman'; color = '#6E9F43'; }
  else if (score <= 60) { level = 'moderate'; label = 'Perlu Perhatian'; color = '#D8A83E'; }
  else if (score <= 80) { level = 'high'; label = 'Berisiko'; color = '#C07020'; }
  else { level = 'critical'; label = 'Darurat'; color = '#B03A2E'; }

  return {
    regionId: region.id,
    regionName: region.name,
    score,
    level,
    label,
    color,
    affectedFarmers: Math.floor(region.totalFarmers * score / 100),
    mainRisk: score > 60 ? 'Peluang hujan lebat tinggi' : score > 30 ? 'Potensi curah hujan tidak menentu' : 'Kondisi cuaca relatif stabil',
    rainProbability: 40 + score,
    isDemo: true,
  };
});

// ─── PLANTING HISTORY ─────────────────────────────────────────────────────────
const plantingHistory = [
  {
    id: 'ph-001',
    farmerId: 'usr-001',
    farmId: 'farm-001',
    cropId: 'crop-001',
    cropName: 'Padi',
    varietyId: 'var-003',
    varietyName: 'Ciherang',
    plantingDate: '2026-01-10',
    harvestDate: '2026-05-06',
    season: 'Musim Tanam I',
    areaHa: 1.2,
    yieldTon: 7.1,
    yieldPerHa: 5.92,
    weatherCondition: 'Baik',
    recommendationFollowed: true,
    notes: 'Hasil memuaskan, cuaca mendukung',
    isDemo: true,
  },
  {
    id: 'ph-002',
    farmerId: 'usr-001',
    farmId: 'farm-001',
    cropId: 'crop-001',
    cropName: 'Padi',
    varietyId: 'var-001',
    varietyName: 'Inpari 32',
    plantingDate: '2025-06-15',
    harvestDate: '2025-10-11',
    season: 'Musim Tanam II',
    areaHa: 1.2,
    yieldTon: 6.5,
    yieldPerHa: 5.42,
    weatherCondition: 'Kurang Baik',
    recommendationFollowed: false,
    notes: 'Sempat terkena genangan, hasil sedikit turun',
    isDemo: true,
  },
  {
    id: 'ph-003',
    farmerId: 'usr-001',
    farmId: 'farm-001',
    cropId: 'crop-001',
    cropName: 'Padi',
    varietyId: 'var-003',
    varietyName: 'Ciherang',
    plantingDate: '2025-01-12',
    harvestDate: '2025-05-08',
    season: 'Musim Tanam I',
    areaHa: 1.2,
    yieldTon: 7.4,
    yieldPerHa: 6.17,
    weatherCondition: 'Baik',
    recommendationFollowed: true,
    notes: 'Musim terbaik sejauh ini',
    isDemo: true,
  },
  {
    id: 'ph-004',
    farmerId: 'usr-001',
    farmId: 'farm-001',
    cropId: 'crop-001',
    cropName: 'Padi',
    varietyId: 'var-002',
    varietyName: 'Inpari 42',
    plantingDate: '2024-06-20',
    harvestDate: '2024-10-08',
    season: 'Musim Tanam II',
    areaHa: 1.2,
    yieldTon: 5.8,
    yieldPerHa: 4.83,
    weatherCondition: 'Kurang Baik',
    recommendationFollowed: true,
    notes: 'Kemarau lebih panjang dari biasa',
    isDemo: true,
  },
  {
    id: 'ph-005',
    farmerId: 'usr-001',
    farmId: 'farm-001',
    cropId: 'crop-001',
    cropName: 'Padi',
    varietyId: 'var-004',
    varietyName: 'IR64',
    plantingDate: '2024-01-08',
    harvestDate: '2024-05-07',
    season: 'Musim Tanam I',
    areaHa: 1.2,
    yieldTon: 6.9,
    yieldPerHa: 5.75,
    weatherCondition: 'Baik',
    recommendationFollowed: true,
    notes: null,
    isDemo: true,
  },
];

// ─── WEATHER ALERTS ───────────────────────────────────────────────────────────
const weatherAlerts = [
  {
    id: 'alert-001',
    regionId: 'reg-001',
    regionName: 'Klaten',
    type: 'heavy_rain',
    level: 'warning',
    label: 'WASPADA',
    title: 'Hujan Lebat Diprakirakan',
    message: 'Hujan lebat diperkirakan besok sore (7 Sep 2026, 14:00–18:00). Intensitas: >50mm/hari. Tunda pemupukan dan kegiatan di lahan terbuka.',
    validFrom: '2026-09-07T14:00:00+07:00',
    validUntil: '2026-09-07T18:00:00+07:00',
    isActive: true,
    source: 'BMKG',
    isDemo: true,
    createdAt: '2026-09-06T20:00:00+07:00',
  },
  {
    id: 'alert-002',
    regionId: 'reg-005',
    regionName: 'Magelang',
    type: 'extreme_rain',
    level: 'danger',
    label: 'BAHAYA',
    title: 'Potensi Banjir Lokal',
    message: 'Curah hujan ekstrem diperkirakan di beberapa titik. Waspadai potensi banjir lokal dan longsor di daerah perbukitan.',
    validFrom: '2026-09-07T10:00:00+07:00',
    validUntil: '2026-09-08T06:00:00+07:00',
    isActive: true,
    source: 'BMKG',
    isDemo: true,
    createdAt: '2026-09-06T19:30:00+07:00',
  },
  {
    id: 'alert-003',
    regionId: 'reg-003',
    regionName: 'Bantul',
    type: 'dry_spell',
    level: 'watch',
    label: 'PERLU PERHATIAN',
    title: 'Periode Kering Berlanjut',
    message: 'Tidak ada hujan signifikan dalam 8 hari ke depan. Kelola irigasi dengan cermat untuk menghindari kekeringan pada fase vegetatif.',
    validFrom: '2026-09-06T00:00:00+07:00',
    validUntil: '2026-09-14T00:00:00+07:00',
    isActive: true,
    source: 'Open-Meteo',
    isDemo: true,
    createdAt: '2026-09-06T08:00:00+07:00',
  },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
const notifications = [
  {
    id: 'notif-001',
    userId: 'usr-001',
    type: 'weather_alert',
    channel: 'in_app',
    title: 'Peringatan Cuaca',
    message: 'Pak Budi, besok diperkirakan hujan lebat. Sebaiknya tunda pemupukan.',
    isRead: false,
    sentAt: '2026-09-06T20:00:00+07:00',
    deliveryStatus: 'delivered',
    isDemo: true,
  },
  {
    id: 'notif-002',
    userId: 'usr-001',
    type: 'recommendation',
    channel: 'in_app',
    title: 'Rekomendasi Tanam Tersedia',
    message: 'Analisis cuaca terbaru tersedia. Waktu tanam yang disarankan: 12–15 September.',
    isRead: true,
    sentAt: '2026-09-06T08:00:00+07:00',
    deliveryStatus: 'delivered',
    isDemo: true,
  },
  {
    id: 'notif-003',
    userId: 'usr-001',
    type: 'broadcast',
    channel: 'whatsapp',
    title: 'Informasi dari Penyuluh',
    message: 'Pak Budi, besok ada pertemuan kelompok tani jam 09.00 di balai desa. Hadir ya, Pak.',
    isRead: false,
    sentAt: '2026-09-05T16:30:00+07:00',
    deliveryStatus: 'delivered',
    isDemo: true,
  },
];

// ─── COMMUNITY POSTS ──────────────────────────────────────────────────────────
const communityPosts = [
  {
    id: 'post-001',
    authorId: 'usr-004',
    authorName: 'Joko Widodo',
    authorVillage: 'Desa Karanglo, Klaten',
    category: 'Padi',
    title: 'Ada yang sudah mulai tanam padi?',
    content: 'Pak-pak dan Bu-bu, saya mau nanya nih. Sudah ada yang mulai tanam padi musim ini? Saya masih ragu karena katanya bulan ini masih sering hujan deras. Yang di Karanglo gimana?',
    likes: 24,
    commentsCount: 47,
    isReported: false,
    isApproved: true,
    createdAt: '2026-09-06T18:15:00+07:00',
    tags: ['padi', 'musim tanam', 'cuaca'],
    isDemo: true,
  },
  {
    id: 'post-002',
    authorId: 'usr-002',
    authorName: 'Siti Rahayu',
    authorVillage: 'Desa Tegalrejo, Klaten',
    category: 'Hama',
    title: 'Wereng coklat menyerang sawah saya',
    content: 'Bu dan Pak, sawah saya kena serangan wereng coklat. Daun mulai menguning. Ada yang punya pengalaman mengatasi ini? Sudah pakai pestisida tapi belum maksimal hasilnya.',
    likes: 31,
    commentsCount: 23,
    isReported: false,
    isApproved: true,
    createdAt: '2026-09-05T10:30:00+07:00',
    tags: ['hama', 'wereng', 'padi'],
    isDemo: true,
  },
  {
    id: 'post-003',
    authorId: 'usr-006',
    authorName: 'Agus Setiawan',
    authorVillage: 'Desa Bayat, Klaten',
    category: 'Cuaca',
    title: 'Prakiraan hujan September di Klaten',
    content: 'Saya baca di RamalTani kalau September masih ada peluang hujan tinggi. Menurut saya lebih baik tunggu dulu sampai pertengahan bulan. Bagaimana menurut Bapak dan Ibu?',
    likes: 18,
    commentsCount: 12,
    isReported: false,
    isApproved: true,
    createdAt: '2026-09-04T14:20:00+07:00',
    tags: ['cuaca', 'September', 'prakiraan'],
    isDemo: true,
  },
];

const communityComments = [
  {
    id: 'comment-001',
    postId: 'post-001',
    authorId: 'usr-001',
    authorName: 'Budi Santoso',
    authorVillage: 'Desa Karanglo',
    content: 'Saya belum tanam Pak, masih nunggu cuaca lebih stabil. RamalTani bilang baiknya mulai 12-15 September.',
    likes: 8,
    createdAt: '2026-09-06T19:00:00+07:00',
    isDemo: true,
  },
  {
    id: 'comment-002',
    postId: 'post-001',
    authorId: 'usr-007',
    authorName: 'Wahyudi Pratama',
    authorVillage: 'PPL Kecamatan Cawas',
    content: 'Betul Pak Budi. Kami dari penyuluh juga sarankan tunggu dulu sampai 12 September. Curah hujan diperkirakan lebih stabil mulai pertengahan bulan.',
    likes: 15,
    createdAt: '2026-09-06T19:30:00+07:00',
    isDemo: true,
  },
];

// ─── EDUCATION ARTICLES ───────────────────────────────────────────────────────
const educationArticles = [
  {
    id: 'art-001',
    title: 'Apa Arti Peluang Hujan 70%?',
    slug: 'arti-peluang-hujan-70-persen',
    category: 'Cuaca',
    readingTimeMin: 5,
    summary: 'Prakiraan cuaca sering menyebut "peluang hujan 70%". Apa artinya sebenarnya dan bagaimana cara menggunakannya dalam keputusan tanam?',
    content: `
Sering kita lihat di prakiraan cuaca kalimat seperti "peluang hujan 70%". Bagi petani, ini adalah informasi penting — tapi apa artinya sebenarnya?

## Apa Itu Peluang Hujan?

Peluang hujan (dalam bahasa ilmiah disebut "Probability of Precipitation" atau PoP) adalah angka yang menunjukkan seberapa besar kemungkinan hujan akan terjadi di suatu wilayah pada waktu tertentu.

**Peluang hujan 70%** artinya: dari 10 kondisi atmosfer yang serupa, hujan terjadi di 7 di antaranya.

## Yang Perlu Dipahami

- **Bukan berarti akan hujan selama 70% waktu**
- **Bukan berarti intensitasnya pasti tinggi**
- Angka ini adalah perkiraan probabilitas, bukan kepastian

## Cara Menggunakannya untuk Bertani

| Peluang Hujan | Rekomendasi |
|---------------|-------------|
| <30% | Aman untuk kegiatan lapangan |
| 30-60% | Siap payung, tapi kegiatan bisa lanjut |
| 60-80% | Pertimbangkan tunda kegiatan sensitif |
| >80% | Tunda pemupukan dan penyemprotan |

## Kombinasikan dengan Jumlah Hujan

Peluang hujan 80% dengan curah hujan 2mm berbeda dengan peluang 60% dengan curah hujan 40mm. Perhatikan kedua angka ini bersama-sama.
    `,
    author: 'Tim RamalTani',
    publishedAt: '2026-08-15T09:00:00+07:00',
    tags: ['cuaca', 'prakiraan', 'literasi cuaca'],
    isDemo: true,
  },
  {
    id: 'art-002',
    title: 'Kapan Waktu Terbaik Menanam Padi?',
    slug: 'waktu-terbaik-menanam-padi',
    category: 'Tanam',
    readingTimeMin: 7,
    summary: 'Waktu tanam yang tepat adalah kunci keberhasilan panen padi. Pelajari faktor-faktor yang perlu dipertimbangkan sebelum mulai menanam.',
    content: `
Menanam padi di waktu yang tepat dapat meningkatkan hasil panen hingga 30%. Berikut panduan lengkapnya.

## Faktor Penentu Waktu Tanam

### 1. Curah Hujan
Padi membutuhkan air yang cukup di fase awal pertumbuhan. Curah hujan ideal saat tanam: 150-200mm/bulan.

### 2. Suhu
Suhu optimal untuk padi: 25-30°C. Suhu terlalu tinggi (>35°C) atau terlalu rendah (<15°C) bisa menghambat pertumbuhan.

### 3. Ketersediaan Air Irigasi
Untuk lahan irigasi teknis, ketersediaan air lebih terjamin. Untuk tadah hujan, waktu tanam sangat bergantung pada curah hujan.

## Musim Tanam di Jawa Tengah

- **Musim Tanam I (MT-I)**: Oktober – Maret (memanfaatkan musim hujan)
- **Musim Tanam II (MT-II)**: April – September (memerlukan irigasi)

## Tanda-Tanda Waktu Tanam yang Tepat

✅ Curah hujan mulai stabil (>5 hari berturut-turut)
✅ Tidak ada prakiraan hujan ekstrem dalam 5 hari pertama
✅ Suhu rata-rata 26-30°C
✅ Kelembapan tanah cukup untuk persemaian
    `,
    author: 'Tim RamalTani',
    publishedAt: '2026-08-10T09:00:00+07:00',
    tags: ['padi', 'waktu tanam', 'musim'],
    isDemo: true,
  },
  {
    id: 'art-003',
    title: 'Menghadapi Musim Hujan yang Bergeser',
    slug: 'menghadapi-musim-hujan-bergeser',
    category: 'Iklim',
    readingTimeMin: 6,
    summary: 'Perubahan iklim membuat musim hujan semakin tidak dapat diprediksi. Bagaimana petani bisa beradaptasi?',
    content: `
Dalam 10 tahun terakhir, pola hujan di Indonesia mengalami pergeseran yang signifikan. Musim hujan yang biasanya mulai Oktober kini bisa mundur hingga Desember — atau bahkan lebih awal dari biasanya.

## Tantangan bagi Petani

- Kalender tanam tradisional tidak lagi akurat
- Periode kering di tengah musim tanam (dry spell) lebih sering terjadi
- Hujan ekstrem lebih intens dan singkat
- Ketidakpastian meningkat, risiko gagal tanam lebih tinggi

## Strategi Adaptasi

### 1. Gunakan Data Cuaca Terkini
Jangan hanya bergantung pada kalender musim tanam lama. Pantau prakiraan cuaca BMKG dan gunakan platform seperti RamalTani.

### 2. Pilih Varietas yang Adaptif
- Varietas tahan kekeringan: Situbagendit, Inpari 42
- Varietas tahan genangan: Inpari 32, Inpari 30

### 3. Manajemen Air yang Cermat
Simpan air hujan, optimalkan irigasi, dan kurangi penguapan.

### 4. Diversifikasi Tanaman
Jangan hanya tanam padi. Pertimbangkan tanaman palawija yang lebih tahan terhadap variasi cuaca.
    `,
    author: 'Tim RamalTani',
    publishedAt: '2026-08-05T09:00:00+07:00',
    tags: ['iklim', 'perubahan cuaca', 'adaptasi'],
    isDemo: true,
  },
  {
    id: 'art-004',
    title: 'Mengenal Varietas Padi Tahan Kekeringan',
    slug: 'varietas-padi-tahan-kekeringan',
    category: 'Varietas',
    readingTimeMin: 6,
    summary: 'Saat musim kemarau panjang, memilih varietas yang tepat bisa menjadi faktor penentu keberhasilan panen.',
    content: `
Dengan meningkatnya frekuensi kemarau panjang, varietas padi tahan kekeringan menjadi semakin relevan.

## Mengapa Varietas Penting?

Pemilihan varietas yang sesuai dengan kondisi iklim bisa menghemat biaya produksi sekaligus menjaga hasil panen tetap optimal.

## Varietas Unggulan Tahan Kekeringan

### Inpari 42 Agritan GSR
- Umur panen: 110 hari
- Potensi hasil: 8.9 ton/ha
- Keunggulan: Toleran kekeringan di fase vegetatif

### Situbagendit
- Umur panen: 112 hari
- Potensi hasil: 7.0 ton/ha
- Keunggulan: Adaptif di lahan tadah hujan

*Data di atas adalah data referensi demo. Selalu konsultasikan dengan penyuluh pertanian setempat untuk rekomendasi yang sesuai kondisi lahan Anda.*
    `,
    author: 'Tim RamalTani',
    publishedAt: '2026-07-28T09:00:00+07:00',
    tags: ['varietas', 'kekeringan', 'padi'],
    isDemo: true,
  },
  {
    id: 'art-005',
    title: 'Cara Membaca Prakiraan Cuaca BMKG',
    slug: 'cara-membaca-prakiraan-cuaca-bmkg',
    category: 'Cuaca',
    readingTimeMin: 5,
    summary: 'BMKG menyediakan data cuaca lengkap, namun bahasanya teknis. Pelajari cara membacanya untuk keperluan pertanian.',
    content: `
BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) adalah sumber data cuaca resmi Indonesia. Data BMKG sangat akurat, namun bisa terasa teknis bagi yang belum terbiasa.

## Istilah yang Perlu Diketahui

**CH** = Curah Hujan (mm)
**PoP** = Probability of Precipitation (Peluang Hujan dalam %)
**Kec. Angin** = Kecepatan Angin (km/jam)
**RH** = Relative Humidity (Kelembapan Udara dalam %)

## Cara Membaca Prakiraan BMKG untuk Bertani

1. **Lihat prakiraan 3 hari ke depan** — jangan terlalu jauh, akurasi turun
2. **Perhatikan PoP >70%** — ini tanda hujan cukup pasti
3. **Waspadai CH >50mm/hari** — hujan lebat, hindari kegiatan sensitif
4. **Kombinasikan dengan kelembapan** — RH >85% + CH tinggi = risiko penyakit tinggi

*RamalTani mengambil data dari BMKG dan menerjemahkannya menjadi rekomendasi yang mudah dipahami.*
    `,
    author: 'Tim RamalTani',
    publishedAt: '2026-07-20T09:00:00+07:00',
    tags: ['BMKG', 'cuaca', 'literasi'],
    isDemo: true,
  },
];

// ─── BROADCAST MESSAGES ───────────────────────────────────────────────────────
const broadcastMessages = [
  {
    id: 'bcast-001',
    senderId: 'usr-007',
    senderName: 'Wahyudi Pratama',
    regionId: 'reg-001',
    title: 'Pertemuan Kelompok Tani',
    message: 'Bapak/Ibu petani wilayah Klaten, besok Senin 7 Sep 2026 ada pertemuan kelompok tani jam 09.00 di Balai Desa Karanglo. Mohon hadir.',
    targetCrop: null,
    channels: ['whatsapp', 'in_app'],
    recipientCount: 184,
    deliveredCount: 181,
    createdAt: '2026-09-05T16:00:00+07:00',
    status: 'delivered',
    isDemo: true,
  },
  {
    id: 'bcast-002',
    senderId: 'usr-007',
    senderName: 'Wahyudi Pratama',
    regionId: 'reg-001',
    title: 'Peringatan Cuaca - Tunda Pemupukan',
    message: 'Kepada petani padi wilayah Klaten: Besok (7 Sep) diprakirakan hujan lebat. Harap tunda kegiatan pemupukan dan penyemprotan pestisida sampai kondisi cuaca lebih stabil.',
    targetCrop: 'Padi',
    channels: ['whatsapp', 'sms', 'in_app'],
    recipientCount: 142,
    deliveredCount: 139,
    createdAt: '2026-09-06T18:00:00+07:00',
    status: 'delivered',
    isDemo: true,
  },
];

// ─── EXTENSION OFFICER ANALYTICS ──────────────────────────────────────────────
const extensionAnalytics = {
  regionId: 'reg-001',
  period: 'September 2026',
  summary: {
    totalFarmers: 184,
    activeFarmers: 149,
    activePercent: 81,
    atRiskRegions: 7,
    failureRisk: 12,
    alertsActive: 2,
  },
  cropDistribution: [
    { crop: 'Padi', count: 124, percent: 67 },
    { crop: 'Jagung', count: 28, percent: 15 },
    { crop: 'Cabai', count: 18, percent: 10 },
    { crop: 'Kedelai', count: 8, percent: 4 },
    { crop: 'Lainnya', count: 6, percent: 3 },
  ],
  monthlyActivity: [
    { month: 'Apr', planting: 45, harvest: 12 },
    { month: 'Mei', planting: 38, harvest: 67 },
    { month: 'Jun', planting: 12, harvest: 89 },
    { month: 'Jul', planting: 8, harvest: 42 },
    { month: 'Agu', planting: 52, harvest: 18 },
    { month: 'Sep', planting: 91, harvest: 5 },
  ],
  isDemo: true,
};

// ─── SYSTEM LOGS ──────────────────────────────────────────────────────────────
const systemLogs = [
  { id: 'log-001', level: 'info', service: 'WeatherService', message: 'BMKG data fetched successfully for Klaten', timestamp: '2026-09-06T20:31:00+07:00' },
  { id: 'log-002', level: 'info', service: 'WeatherService', message: 'Open-Meteo data fetched for Sleman', timestamp: '2026-09-06T20:30:00+07:00' },
  { id: 'log-003', level: 'warn', service: 'NotificationService', message: 'WhatsApp delivery retry for notif-002', timestamp: '2026-09-06T20:15:00+07:00' },
  { id: 'log-004', level: 'info', service: 'AuthService', message: 'User usr-001 logged in', timestamp: '2026-09-06T20:00:00+07:00' },
  { id: 'log-005', level: 'error', service: 'WeatherService', message: 'BMKG timeout for adm4 34.01.08.2002, falling back to cache', timestamp: '2026-09-06T19:45:00+07:00' },
  { id: 'log-006', level: 'info', service: 'RecommendationEngine', message: 'Recommendation calculated for usr-001, farm-001, crop: Padi', timestamp: '2026-09-06T08:05:00+07:00' },
];

// ─── API HEALTH ───────────────────────────────────────────────────────────────
const apiHealth = {
  bmkg: {
    name: 'BMKG Open Data API',
    status: 'healthy',
    lastSync: '2026-09-06T20:31:00+07:00',
    responseMs: 240,
    uptime: 99.2,
    endpoint: 'https://api.bmkg.go.id/publik/prakiraan-cuaca',
  },
  openMeteo: {
    name: 'Open-Meteo API',
    status: 'healthy',
    lastSync: '2026-09-06T20:30:00+07:00',
    responseMs: 310,
    uptime: 99.8,
    endpoint: 'https://api.open-meteo.com/v1/forecast',
  },
};

module.exports = {
  regions,
  crops,
  varieties,
  users,
  farms,
  weatherData,
  generateWeatherForecast,
  riskData,
  plantingHistory,
  weatherAlerts,
  notifications,
  communityPosts,
  communityComments,
  educationArticles,
  broadcastMessages,
  extensionAnalytics,
  systemLogs,
  apiHealth,
};

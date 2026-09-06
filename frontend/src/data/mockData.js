/**
 * Frontend mock data — mirrors backend mock data
 * Used for offline/demo mode when backend is unavailable
 */

export const DEMO_REGIONS = [
  { id: 'reg-001', name: 'Klaten', province: 'Jawa Tengah', latitude: -7.7058, longitude: 110.6069 },
  { id: 'reg-002', name: 'Sleman', province: 'DI Yogyakarta', latitude: -7.7158, longitude: 110.3553 },
  { id: 'reg-003', name: 'Bantul', province: 'DI Yogyakarta', latitude: -7.8880, longitude: 110.3325 },
  { id: 'reg-004', name: 'Kulon Progo', province: 'DI Yogyakarta', latitude: -7.8205, longitude: 110.1622 },
  { id: 'reg-005', name: 'Magelang', province: 'Jawa Tengah', latitude: -7.4797, longitude: 110.2177 },
  { id: 'reg-006', name: 'Karanganyar', province: 'Jawa Tengah', latitude: -7.6028, longitude: 111.0167 },
  { id: 'reg-007', name: 'Sragen', province: 'Jawa Tengah', latitude: -7.4264, longitude: 111.0187 },
  { id: 'reg-008', name: 'Boyolali', province: 'Jawa Tengah', latitude: -7.5327, longitude: 110.5988 },
  { id: 'reg-009', name: 'Ngawi', province: 'Jawa Timur', latitude: -7.4042, longitude: 111.4462 },
];

export const DEMO_CROPS = [
  { id: 'crop-001', name: 'Padi', category: 'Serealia' },
  { id: 'crop-002', name: 'Jagung', category: 'Serealia' },
  { id: 'crop-003', name: 'Cabai', category: 'Sayuran' },
  { id: 'crop-004', name: 'Kedelai', category: 'Kacang-kacangan' },
  { id: 'crop-005', name: 'Bawang Merah', category: 'Sayuran' },
  { id: 'crop-006', name: 'Singkong', category: 'Umbi-umbian' },
  { id: 'crop-007', name: 'Kacang Tanah', category: 'Kacang-kacangan' },
];

export const DEMO_VARIETIES = {
  'Padi': [
    { id: 'var-001', name: 'Inpari 32', droughtTolerant: false, floodTolerant: true, harvestAgeDays: 118, yieldAverage: 6.2 },
    { id: 'var-002', name: 'Inpari 42', droughtTolerant: true, floodTolerant: false, harvestAgeDays: 110, yieldAverage: 6.5 },
    { id: 'var-003', name: 'Ciherang', droughtTolerant: false, floodTolerant: false, harvestAgeDays: 116, yieldAverage: 6.0 },
    { id: 'var-004', name: 'IR64', droughtTolerant: false, floodTolerant: false, harvestAgeDays: 120, yieldAverage: 5.5 },
    { id: 'var-005', name: 'Situbagendit', droughtTolerant: true, floodTolerant: false, harvestAgeDays: 112, yieldAverage: 5.0 },
  ],
  'Jagung': [
    { id: 'var-006', name: 'Bisi-18', droughtTolerant: true, floodTolerant: false, harvestAgeDays: 105, yieldAverage: 9.2 },
  ],
};

export const DEMO_WEATHER = {
  current: {
    description: 'Hujan ringan',
    weatherCode: 'light_rain',
    temperature: 28,
    feelsLike: 30,
    humidity: 82,
    windSpeed: 12,
    rainProbability: 68,
    rainfallMm: 4.2,
  },
  forecast: [
    { date: '2026-09-06', dateLabel: 'Min, 6 Sep', description: 'Hujan ringan', weatherCode: 'light_rain', rainProbability: 68, rainfallMm: 12.4, temperature: 28, temperatureMin: 24, temperatureMax: 30, humidity: 82, windSpeed: 12 },
    { date: '2026-09-07', dateLabel: 'Sen, 7 Sep', description: 'Hujan lebat', weatherCode: 'heavy_rain', rainProbability: 91, rainfallMm: 38.2, temperature: 25, temperatureMin: 22, temperatureMax: 27, humidity: 92, windSpeed: 20 },
    { date: '2026-09-08', dateLabel: 'Sel, 8 Sep', description: 'Hujan sedang', weatherCode: 'moderate_rain', rainProbability: 82, rainfallMm: 18.4, temperature: 27, temperatureMin: 23, temperatureMax: 29, humidity: 88, windSpeed: 15 },
    { date: '2026-09-09', dateLabel: 'Rab, 9 Sep', description: 'Berawan', weatherCode: 'cloudy', rainProbability: 45, rainfallMm: 3.5, temperature: 30, temperatureMin: 26, temperatureMax: 32, humidity: 78, windSpeed: 9 },
    { date: '2026-09-10', dateLabel: 'Kam, 10 Sep', description: 'Cerah berawan', weatherCode: 'partly_cloudy', rainProbability: 25, rainfallMm: 0, temperature: 31, temperatureMin: 27, temperatureMax: 33, humidity: 70, windSpeed: 8 },
    { date: '2026-09-11', dateLabel: 'Jum, 11 Sep', description: 'Cerah berawan', weatherCode: 'partly_cloudy', rainProbability: 22, rainfallMm: 0, temperature: 32, temperatureMin: 28, temperatureMax: 34, humidity: 68, windSpeed: 7 },
    { date: '2026-09-12', dateLabel: 'Sab, 12 Sep', description: 'Hujan ringan', weatherCode: 'light_rain', rainProbability: 62, rainfallMm: 8.8, temperature: 27, temperatureMin: 23, temperatureMax: 29, humidity: 84, windSpeed: 11 },
    { date: '2026-09-13', dateLabel: 'Min, 13 Sep', description: 'Berawan', weatherCode: 'cloudy', rainProbability: 40, rainfallMm: 2.1, temperature: 29, temperatureMin: 25, temperatureMax: 31, humidity: 76, windSpeed: 10 },
    { date: '2026-09-14', dateLabel: 'Sen, 14 Sep', description: 'Cerah', weatherCode: 'sunny', rainProbability: 10, rainfallMm: 0, temperature: 33, temperatureMin: 29, temperatureMax: 35, humidity: 65, windSpeed: 6 },
    { date: '2026-09-15', dateLabel: 'Sel, 15 Sep', description: 'Hujan ringan', weatherCode: 'light_rain', rainProbability: 55, rainfallMm: 6.2, temperature: 28, temperatureMin: 24, temperatureMax: 30, humidity: 80, windSpeed: 10 },
  ],
  source: 'Demo Data',
  lastUpdated: '2026-09-06T20:31:00+07:00',
  isDemo: true,
};

export const DEMO_RECOMMENDATION = {
  crop: 'Padi',
  variety: 'Ciherang',
  recommendation: {
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
    riskColor: '#6E9F43',
    reason: 'Curah hujan diperkirakan mulai stabil dan tidak terdapat indikasi hujan ekstrem dalam 5 hari pertama penanaman.',
    allReasons: [
      'Curah hujan diperkirakan mulai stabil dan tidak terdapat indikasi hujan ekstrem dalam 5 hari pertama penanaman.',
    ],
    action: 'Mulai persiapan lahan dan benih. Kondisi cuaca mendukung penanaman dalam waktu dekat.',
    alternative: '17–19 September 2026',
    details: {
      avgRainProbability: 52,
      avgTemperature: 29,
      avgHumidity: 78,
      maxConsecutiveWetDays: 2,
      maxDrySpell: 2,
      extremeRainDays: 0,
    },
  },
  engine: 'Climate-aware rule engine v1.0',
  generatedAt: '2026-09-06T08:05:00+07:00',
  isDemo: true,
};

export const DEMO_ALERTS = [
  {
    id: 'alert-001',
    regionName: 'Klaten',
    type: 'heavy_rain',
    level: 'warning',
    label: 'WASPADA',
    title: 'Hujan Lebat Diprakirakan',
    message: 'Hujan lebat diperkirakan besok sore (7 Sep 2026). Intensitas: >50mm/hari. Tunda pemupukan dan kegiatan di lahan terbuka.',
    validFrom: '2026-09-07T14:00:00+07:00',
    validUntil: '2026-09-07T18:00:00+07:00',
    isActive: true,
    source: 'BMKG',
    isDemo: true,
  },
];

export const DEMO_PLANTING_HISTORY = [
  { id: 'ph-001', cropName: 'Padi', varietyName: 'Ciherang', plantingDate: '2026-01-10', harvestDate: '2026-05-06', season: 'Musim Tanam I', areaHa: 1.2, yieldTon: 7.1, yieldPerHa: 5.92, weatherCondition: 'Baik', recommendationFollowed: true },
  { id: 'ph-002', cropName: 'Padi', varietyName: 'Inpari 32', plantingDate: '2025-06-15', harvestDate: '2025-10-11', season: 'Musim Tanam II', areaHa: 1.2, yieldTon: 6.5, yieldPerHa: 5.42, weatherCondition: 'Kurang Baik', recommendationFollowed: false },
  { id: 'ph-003', cropName: 'Padi', varietyName: 'Ciherang', plantingDate: '2025-01-12', harvestDate: '2025-05-08', season: 'Musim Tanam I', areaHa: 1.2, yieldTon: 7.4, yieldPerHa: 6.17, weatherCondition: 'Baik', recommendationFollowed: true },
  { id: 'ph-004', cropName: 'Padi', varietyName: 'Inpari 42', plantingDate: '2024-06-20', harvestDate: '2024-10-08', season: 'Musim Tanam II', areaHa: 1.2, yieldTon: 5.8, yieldPerHa: 4.83, weatherCondition: 'Kurang Baik', recommendationFollowed: true },
  { id: 'ph-005', cropName: 'Padi', varietyName: 'IR64', plantingDate: '2024-01-08', harvestDate: '2024-05-07', season: 'Musim Tanam I', areaHa: 1.2, yieldTon: 6.9, yieldPerHa: 5.75, weatherCondition: 'Baik', recommendationFollowed: true },
];

export const DEMO_COMMUNITY_POSTS = [
  {
    id: 'post-001',
    authorName: 'Joko Widodo',
    authorVillage: 'Desa Karanglo, Klaten',
    category: 'Padi',
    title: 'Ada yang sudah mulai tanam padi?',
    content: 'Pak-pak dan Bu-bu, saya mau nanya nih. Sudah ada yang mulai tanam padi musim ini? Saya masih ragu karena katanya bulan ini masih sering hujan deras.',
    likes: 24,
    commentsCount: 47,
    createdAt: '2026-09-06T18:15:00+07:00',
    isDemo: true,
  },
  {
    id: 'post-002',
    authorName: 'Siti Rahayu',
    authorVillage: 'Desa Tegalrejo, Klaten',
    category: 'Hama',
    title: 'Wereng coklat menyerang sawah saya',
    content: 'Bu dan Pak, sawah saya kena serangan wereng coklat. Daun mulai menguning. Ada yang punya pengalaman mengatasi ini?',
    likes: 31,
    commentsCount: 23,
    createdAt: '2026-09-05T10:30:00+07:00',
    isDemo: true,
  },
  {
    id: 'post-003',
    authorName: 'Agus Setiawan',
    authorVillage: 'Desa Bayat, Klaten',
    category: 'Cuaca',
    title: 'Prakiraan hujan September di Klaten',
    content: 'Saya baca di RamalTani kalau September masih ada peluang hujan tinggi. Menurut saya lebih baik tunggu dulu sampai pertengahan bulan.',
    likes: 18,
    commentsCount: 12,
    createdAt: '2026-09-04T14:20:00+07:00',
    isDemo: true,
  },
];

export const DEMO_EDUCATION_ARTICLES = [
  { id: 'art-001', title: 'Apa Arti Peluang Hujan 70%?', slug: 'arti-peluang-hujan-70-persen', category: 'Cuaca', readingTimeMin: 5, summary: 'Prakiraan cuaca sering menyebut "peluang hujan 70%". Apa artinya sebenarnya?' },
  { id: 'art-002', title: 'Kapan Waktu Terbaik Menanam Padi?', slug: 'waktu-terbaik-menanam-padi', category: 'Tanam', readingTimeMin: 7, summary: 'Waktu tanam yang tepat adalah kunci keberhasilan panen padi.' },
  { id: 'art-003', title: 'Menghadapi Musim Hujan yang Bergeser', slug: 'menghadapi-musim-hujan-bergeser', category: 'Iklim', readingTimeMin: 6, summary: 'Perubahan iklim membuat musim hujan semakin tidak dapat diprediksi.' },
  { id: 'art-004', title: 'Mengenal Varietas Padi Tahan Kekeringan', slug: 'varietas-padi-tahan-kekeringan', category: 'Varietas', readingTimeMin: 6, summary: 'Pemilihan varietas yang tepat bisa menjadi faktor penentu keberhasilan panen.' },
  { id: 'art-005', title: 'Cara Membaca Prakiraan Cuaca BMKG', slug: 'cara-membaca-prakiraan-cuaca-bmkg', category: 'Cuaca', readingTimeMin: 5, summary: 'BMKG menyediakan data cuaca lengkap, namun bahasanya teknis.' },
];

export const DEMO_NOTIFICATIONS = [
  { id: 'notif-001', type: 'weather_alert', channel: 'in_app', title: 'Peringatan Cuaca', message: 'Pak Budi, besok diperkirakan hujan lebat. Sebaiknya tunda pemupukan.', isRead: false, sentAt: '2026-09-06T20:00:00+07:00', deliveryStatus: 'delivered' },
  { id: 'notif-002', type: 'recommendation', channel: 'in_app', title: 'Rekomendasi Tanam Tersedia', message: 'Analisis cuaca terbaru tersedia. Waktu tanam yang disarankan: 12–15 September.', isRead: true, sentAt: '2026-09-06T08:00:00+07:00', deliveryStatus: 'delivered' },
  { id: 'notif-003', type: 'broadcast', channel: 'whatsapp', title: 'Informasi dari Penyuluh', message: 'Pak Budi, besok ada pertemuan kelompok tani jam 09.00 di balai desa.', isRead: false, sentAt: '2026-09-05T16:30:00+07:00', deliveryStatus: 'delivered' },
];

export const DEMO_RISK_DATA = [
  { regionId: 'reg-001', regionName: 'Klaten', score: 62, level: 'high', label: 'Berisiko', color: '#C07020', affectedFarmers: 184, mainRisk: 'Peluang hujan lebat tinggi', rainProbability: 78, latitude: -7.7058, longitude: 110.6069 },
  { regionId: 'reg-002', regionName: 'Sleman', score: 38, level: 'moderate', label: 'Perlu Perhatian', color: '#D8A83E', affectedFarmers: 95, mainRisk: 'Potensi curah hujan tidak menentu', rainProbability: 54, latitude: -7.7158, longitude: 110.3553 },
  { regionId: 'reg-003', regionName: 'Bantul', score: 45, level: 'moderate', label: 'Perlu Perhatian', color: '#D8A83E', affectedFarmers: 112, mainRisk: 'Potensi curah hujan tidak menentu', rainProbability: 61, latitude: -7.8880, longitude: 110.3325 },
  { regionId: 'reg-004', regionName: 'Kulon Progo', score: 28, level: 'low', label: 'Aman', color: '#6E9F43', affectedFarmers: 42, mainRisk: 'Kondisi cuaca relatif stabil', rainProbability: 38, latitude: -7.8205, longitude: 110.1622 },
  { regionId: 'reg-005', regionName: 'Magelang', score: 71, level: 'high', label: 'Berisiko', color: '#C07020', affectedFarmers: 256, mainRisk: 'Peluang hujan lebat tinggi', rainProbability: 85, latitude: -7.4797, longitude: 110.2177 },
  { regionId: 'reg-006', regionName: 'Karanganyar', score: 52, level: 'moderate', label: 'Perlu Perhatian', color: '#D8A83E', affectedFarmers: 128, mainRisk: 'Potensi curah hujan tidak menentu', rainProbability: 68, latitude: -7.6028, longitude: 111.0167 },
  { regionId: 'reg-007', regionName: 'Sragen', score: 44, level: 'moderate', label: 'Perlu Perhatian', color: '#D8A83E', affectedFarmers: 108, mainRisk: 'Potensi curah hujan tidak menentu', rainProbability: 59, latitude: -7.4264, longitude: 111.0187 },
  { regionId: 'reg-008', regionName: 'Boyolali', score: 33, level: 'moderate', label: 'Perlu Perhatian', color: '#D8A83E', affectedFarmers: 58, mainRisk: 'Potensi curah hujan tidak menentu', rainProbability: 48, latitude: -7.5327, longitude: 110.5988 },
  { regionId: 'reg-009', regionName: 'Ngawi', score: 26, level: 'low', label: 'Aman', color: '#6E9F43', affectedFarmers: 64, mainRisk: 'Kondisi cuaca BMKG relatif kondusif', rainProbability: 35, latitude: -7.4042, longitude: 111.4462 },
];

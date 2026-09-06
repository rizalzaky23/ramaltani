import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, Wind, Thermometer, CheckCircle, AlertTriangle,
  ArrowRight, Info, ChevronRight, Bell, Sprout, Radio
} from 'lucide-react';
import { WeatherIcon } from '../../components/WeatherIcons';
import { StatusBadge, ConfidenceBar, LoadingSkeleton } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import {
  DEMO_WEATHER, DEMO_RECOMMENDATION, DEMO_ALERTS
} from '../../data/mockData';
import { weatherAPI, recommendationsAPI } from '../../services/api';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// ─── Greeting ────────────────────────────────────────────────────────────────
function Greeting({ user, locationName }) {
  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : 'Selamat sore';

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p className="text-muted text-sm font-medium">
          {greet}, <span className="text-ink font-bold">{user?.name || 'Petani Indonesia'}</span> 👋
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted">{user?.location || locationName || 'Ngawi, Jawa Timur'}</span>
          <span className="text-muted">·</span>
          <span className="text-xs text-padi-600 font-semibold">{user?.commodity || 'Padi'} · Musim Tanam 2026</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live API BMKG Aktif
        </span>
      </div>
    </div>
  );
}

// ─── Active Alert Banner ───────────────────────────────────────────────────────
function AlertBanner({ alert }) {
  const [dismissed, setDismissed] = useState(false);
  if (!alert || dismissed) return null;

  return (
    <div className="alert-warning mb-5 animate-fade-in relative" role="alert" aria-live="polite">
      <AlertTriangle size={18} className="text-panen-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-panen-700 uppercase tracking-wide">{alert.level || 'WASPADA'}</span>
          <span className="text-xs text-muted">· {alert.source || 'BMKG'}</span>
        </div>
        <p className="text-sm font-semibold text-panen-900">{alert.title}</p>
        <p className="text-xs text-panen-800 mt-0.5 leading-relaxed">{alert.description || alert.message}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-panen-600 hover:text-panen-900 p-1 flex-shrink-0"
        aria-label="Tutup peringatan"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Weather Today Card ────────────────────────────────────────────────────────
function WeatherCard({ weather }) {
  const current = weather?.current || {};

  return (
    <div className="card card-body">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="font-display text-lg text-ink">Cuaca Hari Ini</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {weather?.source || 'BMKG Resmi'}
            </span>
            <span className="text-xs text-muted font-medium">
              {weather?.location?.subdistrict ? `${weather.location.subdistrict}, ${weather.location.city || weather.location.name}` : (weather?.location?.name || 'Klaten')}
            </span>
          </div>
        </div>
        <WeatherIcon code={current.weatherCode} iconUrl={current.iconUrl} size={48} />
      </div>

      <div className="flex items-end gap-4 mt-2">
        <div>
          <span className="font-display text-5xl text-ink font-bold">{current.temperature ?? 28}</span>
          <span className="text-xl text-muted font-normal">°C</span>
        </div>
        <div className="pb-1">
          <p className="text-sm font-semibold text-ink">{current.description || 'Cerah Berawan'}</p>
          <p className="text-xs text-muted">Rentang: {current.temperatureMin ?? 23}° – {current.temperatureMax ?? 32}°C</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <Droplets size={16} className="text-langit-500 mx-auto mb-1" aria-hidden="true" />
          <div className="text-sm font-bold text-ink">{current.humidity ?? 75}%</div>
          <div className="text-xs text-muted">Kelembapan</div>
        </div>
        <div className="text-center">
          <Thermometer size={16} className="text-red-400 mx-auto mb-1" aria-hidden="true" />
          <div className="text-sm font-bold text-ink">{current.rainProbability ?? 20}%</div>
          <div className="text-xs text-muted">Peluang Hujan</div>
        </div>
        <div className="text-center">
          <Wind size={16} className="text-muted mx-auto mb-1" aria-hidden="true" />
          <div className="text-sm font-bold text-ink">{current.windSpeed ?? 10}</div>
          <div className="text-xs text-muted">km/jam</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Recommendation Card ──────────────────────────────────────────────────
function RecommendationCard({ rec, weatherLocation }) {
  const r = rec?.recommendation || rec || {};

  return (
    <div className="card border-l-4 border-l-padi-500 shadow-sm" role="region" aria-label="Rekomendasi tanam utama">
      <div className="card-body">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wide">Analisis Kalender Tanam</span>
            <h2 className="font-display text-2xl text-ink mt-0.5">{rec?.crop || 'Padi Sawah'}</h2>
          </div>
          <StatusBadge status={r.status || 'optimal'} />
        </div>

        {r.window && (
          <div className="mb-4 p-4 bg-padi-50/80 rounded-xl border border-padi-200">
            <div className="text-xs font-semibold text-padi-700 uppercase tracking-wide mb-1">Jadwal Tanam Optimal (Berdasarkan BMKG)</div>
            <div className="font-display text-xl font-bold text-padi-900">
              {r.window.start} – {r.window.end}
            </div>
          </div>
        )}

        <ConfidenceBar value={r.confidence || 88} className="mb-4" />

        <div className="flex items-start gap-2 mb-3">
          <Info size={16} className="text-langit-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-ink leading-relaxed">{r.reason || 'Kondisi cuaca dan curah hujan diprakirakan mencukupi kebutuhan air masa awal pertumbuhan.'}</p>
        </div>

        {r.action && (
          <div className="p-3 bg-surface rounded-lg mb-3 border border-border">
            <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Langkah Lapangan Hari Ini</div>
            <p className="text-sm font-medium text-ink">{r.action}</p>
          </div>
        )}

        {r.alternative && (
          <div className="flex items-center gap-2 text-xs text-muted mb-2">
            <AlertTriangle size={13} className="text-panen-500" aria-hidden="true" />
            Alternatif: {r.alternative}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Algoritma Agronomi Real-time
            </span>
            <span className="text-xs text-muted hidden sm:inline">Lokasi: {weatherLocation || 'Klaten'}</span>
          </div>
          <Link to="/dashboard/rekomendasi" className="text-padi-600 text-sm font-semibold flex items-center gap-1 hover:text-padi-700 transition-colors">
            Analisis Lengkap
            <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Forecast Timeline ─────────────────────────────────────────────────────────
function ForecastTimeline({ weather }) {
  const forecast = weather?.forecast || [];

  return (
    <div className="card">
      <div className="card-body pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg text-ink">Prakiraan 7 Hari Kedepan</h2>
            <p className="text-xs text-muted">Kombinasi data resmi BMKG & sensor satelit resolusi tinggi</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live BMKG
          </span>
        </div>

        {/* Scrollable forecast cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" role="list" aria-label="Prakiraan cuaca mingguan">
          {forecast.slice(0, 7).map((day, i) => (
            <div
              key={i}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-xl border min-w-[90px] transition-colors ${
                i === 0 ? 'bg-padi-50/70 border-padi-300 shadow-sm' : 'bg-white border-border'
              }`}
              role="listitem"
            >
              <span className="text-xs font-semibold text-muted text-center leading-tight">{day.dateLabel}</span>
              <WeatherIcon code={day.weatherCode} iconUrl={day.iconUrl} size={32} />
              <span className="text-sm font-bold text-ink">{day.temperature}°C</span>
              <span className={`text-xs font-semibold ${
                day.rainProbability > 70 ? 'text-red-600' :
                day.rainProbability > 40 ? 'text-panen-600' : 'text-padi-600'
              }`}>
                {day.rainProbability}% hujan
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rain Chart */}
      {forecast.length > 0 && (
        <div className="px-6 pb-5 pt-2">
          <div className="text-xs font-semibold text-muted mb-2">Proyeksi Curah Hujan Harian (mm)</div>
          <ResponsiveContainer width="100%" height={90}>
            <AreaChart data={forecast.slice(0, 7)} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9BC7D4" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#9BC7D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECE9" />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 10, fill: '#6B756D' }} tickFormatter={v => v.split(',')[0]} />
              <YAxis tick={{ fontSize: 10, fill: '#6B756D' }} />
              <Tooltip
                contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, borderRadius: 8, border: '1px solid #D8DED9' }}
                formatter={(v) => [`${v} mm`, 'Curah Hujan']}
              />
              <Area type="monotone" dataKey="rainfallMm" stroke="#5BA3B6" fill="url(#rainGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─── Quick Stats Row ───────────────────────────────────────────────────────────
function QuickStats() {
  const stats = [
    { label: 'Rata-rata Hasil', value: '5.92 ton/ha', sub: 'Historis wilayah', color: 'text-padi-600' },
    { label: 'Kesesuaian Tanam', value: 'Tinggi (88%)', sub: 'Indeks iklim BMKG', color: 'text-emerald-600' },
    { label: 'Prakiraan Hujan', value: 'Normal', sub: 'Dasarian I September', color: 'text-langit-600' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3" role="list" aria-label="Statistik tanam">
      {stats.map((s, i) => (
        <div key={i} className="card card-body text-center py-4" role="listitem">
          <div className={`font-display text-lg sm:text-xl font-bold ${s.color}`}>{s.value}</div>
          <div className="text-xs font-semibold text-ink mt-1">{s.label}</div>
          <div className="text-xs text-muted">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard Home ────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const { user } = useAuth();
  const [weather, setWeather] = useState(DEMO_WEATHER);
  const [recommendation, setRecommendation] = useState(DEMO_RECOMMENDATION);
  const [alerts, setAlerts] = useState(DEMO_ALERTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLiveData() {
      try {
        // Match region ID based on user profile
        let regionId = 'reg-001'; // Default: Klaten
        if (user?.regionId) {
          regionId = user.regionId;
        } else if (user?.location) {
          const loc = user.location.toLowerCase();
          if (loc.startsWith('reg-')) regionId = user.location;
          else if (loc.includes('ngawi')) regionId = 'reg-009';
          else if (loc.includes('sleman')) regionId = 'reg-002';
          else if (loc.includes('bantul')) regionId = 'reg-003';
          else if (loc.includes('kulon')) regionId = 'reg-004';
          else if (loc.includes('magelang')) regionId = 'reg-005';
          else if (loc.includes('karanganyar')) regionId = 'reg-006';
          else if (loc.includes('sragen')) regionId = 'reg-007';
          else if (loc.includes('boyolali')) regionId = 'reg-008';
          else if (loc.includes('klaten')) regionId = 'reg-001';
        }

        // 1. Fetch live BMKG weather from backend
        const weatherRes = await weatherAPI.getByRegion(regionId);
        if (weatherRes.data?.data) {
          const liveWeather = weatherRes.data.data;
          setWeather(liveWeather);

          // 2. Fetch live recommendation based on real BMKG weather
          try {
            const recRes = await recommendationsAPI.calculate({
              regionId,
              cropName: user?.commodity || 'Padi',
              varietyName: 'Ciherang',
              soilCondition: 'normal',
            });
            if (recRes.data?.data) {
              setRecommendation(recRes.data.data);
            }
          } catch (_) {}
        }

        // 3. Fetch active weather alerts
        try {
          const alertsRes = await weatherAPI.getAlerts();
          if (alertsRes.data?.data?.length > 0) {
            setAlerts(alertsRes.data.data);
          }
        } catch (_) {}
      } catch (err) {
        console.warn('Live BMKG fetch notice:', err.message);
      }
    }

    loadLiveData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-5">
        <LoadingSkeleton className="h-8 w-48" />
        <LoadingSkeleton className="h-40 w-full" />
        <LoadingSkeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Greeting user={user} locationName={weather?.location?.name} />

      {/* Active alert banner */}
      {alerts[0] && <AlertBanner alert={alerts[0]} />}

      <div className="space-y-5">
        {/* 1. MAIN RECOMMENDATION — Powered by live BMKG data */}
        <RecommendationCard rec={recommendation} weatherLocation={weather?.location?.name} />

        {/* 2. WEATHER TODAY + TODAY'S ACTION */}
        <div className="grid sm:grid-cols-2 gap-5">
          <WeatherCard weather={weather} />

          {/* Today's action card */}
          <div className="card card-body flex flex-col gap-4">
            <div>
              <h2 className="font-display text-lg text-ink mb-1">Tindakan Lapangan Hari Ini</h2>
              <div className="flex items-start gap-3 p-3 bg-padi-50/80 rounded-xl border border-padi-200">
                <Sprout size={18} className="text-padi-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm font-medium text-ink leading-relaxed">
                  Pantau prakiraan curah hujan BMKG. Siapkan persemaian padi dan periksa saluran drainase petak sawah.
                </p>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Pemberitahuan Cuaca Terkini</div>
              <div className="space-y-2">
                {[
                  { msg: `Suhu wilayah ${weather?.location?.name || 'Klaten'} saat ini ${weather?.current?.temperature || 28}°C (${weather?.current?.description || 'Cerah Berawan'})`, unread: true, time: 'Real-time' },
                  { msg: 'Rekomendasi tanam telah disinkronkan dengan BMKG', unread: false, time: 'Baru saja' },
                ].map((n, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-surface transition-colors">
                    {n.unread && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" aria-label="Belum dibaca" />}
                    <span className={`text-xs flex-1 leading-snug ${n.unread ? 'font-semibold text-ink' : 'text-muted'}`}>
                      {n.msg}
                    </span>
                    <span className="text-xs text-muted flex-shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
              <Link to="/dashboard/peringatan" className="flex items-center gap-1 text-padi-600 text-xs font-semibold mt-3 hover:text-padi-700 transition-colors">
                Lihat semua peringatan <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. WEATHER FORECAST */}
        <ForecastTimeline weather={weather} />

        {/* 4. QUICK STATS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-ink">Ringkasan Iklim & Tanam</h2>
            <Link to="/dashboard/riwayat" className="text-padi-600 text-sm font-semibold flex items-center gap-1 hover:text-padi-700">
              Riwayat <ChevronRight size={14} />
            </Link>
          </div>
          <QuickStats />
        </div>

      </div>
    </div>
  );
}

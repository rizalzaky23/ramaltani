import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Droplets, Wind, Thermometer, AlertTriangle,
  ArrowRight, Info, ChevronRight, Sprout, Crosshair, X
} from 'lucide-react';
import { WeatherIcon } from '../../components/WeatherIcons';
import { StatusBadge, ConfidenceBar, LoadingSkeleton } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import {
  DEMO_WEATHER, DEMO_RECOMMENDATION, DEMO_ALERTS
} from '../../data/mockData';
import { weatherAPI, recommendationsAPI } from '../../services/api';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// ─── Greeting ────────────────────────────────────────────────────────────────
function Greeting({ user, locationName, coords, onOpenGPS }) {
  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : 'Selamat Sore';
  const emoji = hour < 11 ? '🌅' : hour < 15 ? '☀️' : '🌤️';

  return (
    <div className="mb-8 relative">
      {/* Background accent gradient */}
      <div className="absolute -inset-4 bg-gradient-to-br from-emerald-50/60 via-transparent to-transparent rounded-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <p className="text-xs uppercase tracking-widest text-[#71717a] font-medium">
          Pusat Kendali Petani · {coords?.isGPS ? coords.regionName : (user?.location || locationName || 'Klaten, Jawa Tengah')}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGPS}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-emerald-50 text-[#09090b] border border-[#e4e4e7] hover:border-emerald-300 transition-all shadow-sm"
            title="Sinkronkan sensor lokasi GPS"
          >
            <Crosshair size={12} className={coords?.isGPS ? "text-emerald-600 animate-pulse" : "text-[#71717a]"} />
            <span>{coords?.isGPS ? 'GPS Aktif' : 'Sinkronkan GPS'}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
            BMKG Live
          </span>
        </div>
      </div>

      <div className="relative">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#09090b] leading-[1.08]" style={{ animation: 'heroSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
          {greet} {emoji},
        </h1>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.08] bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 bg-clip-text text-transparent" style={{ animation: 'heroSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.22s both' }}>
          {user?.name?.split(' ')[0] || 'Petani'}.
        </h1>
      </div>
      <p className="text-base sm:text-lg text-[#71717a] mt-3 max-w-xl leading-relaxed" style={{ animation: 'heroSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s both' }}>
        Komoditas utama Anda <strong className="text-[#09090b] font-medium">{user?.commodity || 'Padi Sawah'}</strong>. Iklim dasarian ini terpantau mendukung aktivitas lapangan.
      </p>
    </div>
  );
}

// ─── Active Alert Banner ───────────────────────────────────────────────────────
function AlertBanner({ alert }) {
  const [dismissed, setDismissed] = useState(false);
  if (!alert || dismissed) return null;

  return (
    <div className="mb-6 relative flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-xs" role="alert">
      <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700">
            {alert.level || 'WASPADA'}
          </span>
          <span className="text-xs text-amber-700/70">· {alert.source || 'BMKG'}</span>
        </div>
        <p className="text-sm font-semibold text-[#09090b]">{alert.title}</p>
        <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{alert.description || alert.message}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-600 hover:text-amber-800 p-1 flex-shrink-0 transition-colors rounded-lg"
        aria-label="Tutup peringatan"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// ─── Signature Evasion 4-Column Specs Grid (upgraded with gradient accents) ──
function ClimateSpecsGrid({ weather }) {
  const current = weather?.current || {};
  const rain = current.rainProbability ?? 20;
  const rainColor = rain > 70 ? 'text-rose-600' : rain > 40 ? 'text-amber-600' : 'text-emerald-700';

  const specs = [
    {
      label: 'Suhu Udara Lahan',
      value: current.temperature ?? 28,
      unit: '°C',
      sub: current.description || 'Cerah Berawan',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      delay: '0.05s',
    },
    {
      label: 'Peluang Hujan',
      value: rain,
      unit: '%',
      sub: rain > 70 ? 'Probabilitas Tinggi' : rain > 40 ? 'Probabilitas Sedang' : 'Probabilitas Rendah',
      color: rainColor,
      bg: rain > 70 ? 'bg-rose-50' : rain > 40 ? 'bg-amber-50' : 'bg-emerald-50',
      delay: '0.10s',
    },
    {
      label: 'Kelembapan Udara',
      value: current.humidity ?? 75,
      unit: '%',
      sub: `Angin ${current.windSpeed ?? 10} km/jam`,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      delay: '0.15s',
    },
    {
      label: 'Kesesuaian Tanam',
      value: 88,
      unit: '%',
      sub: 'Indeks Iklim Optimal',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      delay: '0.20s',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-y border-[#e4e4e7] divide-y md:divide-y-0 md:divide-x divide-[#e4e4e7] my-8">
      {specs.map((s, i) => (
        <div
          key={i}
          className={`card-enter card-enter-${i + 1} p-6 text-center relative overflow-hidden group hover:${s.bg} transition-colors duration-300`}
        >
          <div className={`absolute inset-0 ${s.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-widest text-[#71717a] mb-2 font-medium">{s.label}</p>
            <p className={`text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight ${s.color}`}>
              {s.value}<span className="text-xl font-light text-[#71717a]">{s.unit}</span>
            </p>
            <p className="text-xs text-[#71717a] font-mono mt-1.5">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Recommendation Card ──────────────────────────────────────────────────
function RecommendationCard({ rec, weatherLocation }) {
  const r = rec?.recommendation || rec || {};

  return (
    <div className="rounded-2xl border border-emerald-200/80 p-6 sm:p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0fdfa 100%)' }} role="region" aria-label="Rekomendasi tanam utama">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600" />
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/30 rounded-full -translate-y-24 translate-x-24 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-800 font-medium mb-1">
              Kalender Tanam Rekomendasi
            </p>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#09090b]">
              {rec?.crop || 'Padi Sawah'}
            </h2>
          </div>
          <StatusBadge status={r.status || 'optimal'} />
        </div>

        {r.window && (
          <div className="mb-6 p-5 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
            <p className="text-xs font-mono font-medium text-emerald-800 uppercase tracking-wider mb-1">
              Jadwal Tanam Optimal (Berdasarkan BMKG)
            </p>
            <div className="text-2xl sm:text-3xl font-light text-[#09090b] tracking-tight">
              {r.window.start} – {r.window.end}
            </div>
          </div>
        )}

        <ConfidenceBar value={r.confidence || 88} className="mb-6" />

        <div className="flex items-start gap-3 mb-5 p-4 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
          <Info size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-[#09090b] leading-relaxed">
            {r.reason || 'Kondisi cuaca dan curah hujan diprakirakan mencukupi kebutuhan air masa awal pertumbuhan.'}
          </p>
        </div>

        {r.action && (
          <div className="p-4 bg-emerald-50/60 rounded-xl mb-5 border border-emerald-200">
            <p className="text-xs uppercase tracking-widest text-emerald-900 font-medium mb-1">Langkah Lapangan Hari Ini</p>
            <p className="text-sm font-medium text-emerald-950 leading-relaxed">{r.action}</p>
          </div>
        )}

        <div className="pt-4 border-t border-[#e4e4e7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#71717a]">
            <span>Lokasi acuan: <strong className="text-[#09090b] font-medium">{weatherLocation || 'Klaten'}</strong></span>
            <span>·</span>
            <span>Sensor: Radar BMKG</span>
          </div>
          <Link to="/dashboard/rekomendasi" className="text-emerald-700 font-semibold flex items-center gap-1 hover:text-emerald-800 transition-colors">
            <span>Kalkulasi Ulang Kalender</span>
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
    <div className="rounded-2xl bg-white border border-[#e4e4e7] shadow-xs overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-0.5">Telemetry Satelit</p>
            <h2 className="font-medium text-xl text-[#09090b]">Prakiraan 7 Hari Kedepan</h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Live BMKG
          </span>
        </div>

        {/* Scrollable forecast cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" role="list" aria-label="Prakiraan cuaca mingguan">
          {forecast.slice(0, 7).map((day, i) => (
            <div
              key={i}
              className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-xl border min-w-[100px] transition-all ${
                i === 0
                  ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                  : 'bg-[#fafafa] border-[#e4e4e7] hover:border-emerald-200'
              }`}
              role="listitem"
            >
              <span className="text-xs font-mono text-[#71717a] text-center">{day.dateLabel}</span>
              <WeatherIcon code={day.weatherCode} iconUrl={day.iconUrl} size={32} />
              <span className="text-base font-semibold text-[#09090b] font-mono">{day.temperature}°C</span>
              <span className={`text-[11px] font-mono font-medium ${
                day.rainProbability > 70 ? 'text-rose-600' :
                day.rainProbability > 40 ? 'text-amber-600' : 'text-emerald-700'
              }`}>
                {day.rainProbability}% hujan
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rain Chart */}
      {forecast.length > 0 && (
        <div className="px-6 pb-6 pt-2">
          <p className="text-xs uppercase tracking-widest text-[#71717a] mb-3 font-medium">Proyeksi Curah Hujan Harian (mm)</p>
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={forecast.slice(0, 7)} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 10, fill: '#71717a' }} tickFormatter={v => v.split(',')[0]} stroke="#e4e4e7" tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#71717a' }} stroke="#e4e4e7" tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: 8, color: '#09090b', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                itemStyle={{ color: '#059669' }}
                formatter={(v) => [`${v} mm`, 'Curah Hujan']}
              />
              <Area type="monotone" dataKey="rainfallMm" stroke="#059669" fill="url(#rainGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Home ────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const { user } = useAuth();
  const outletContext = useOutletContext() || {};
  const { coords, openGPSModal } = outletContext;
  const containerRef = useScrollReveal();

  const [weather, setWeather] = useState(DEMO_WEATHER);
  const [recommendation, setRecommendation] = useState(DEMO_RECOMMENDATION);
  const [alerts, setAlerts] = useState(DEMO_ALERTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLiveData() {
      try {
        let regionId = coords?.regionId;

        if (!regionId) {
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
        }

        if (!regionId) regionId = 'reg-001';

        const weatherRes = await weatherAPI.getByRegion(regionId);
        if (weatherRes.data?.data) {
          const liveWeather = weatherRes.data.data;
          setWeather(liveWeather);

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
  }, [user, coords?.regionId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-10 w-64" />
        <LoadingSkeleton className="h-40 w-full" />
        <LoadingSkeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="text-[#09090b] page-enter">
      {/* Animated Greeting */}
      <Greeting
        user={user}
        locationName={weather?.location?.name}
        coords={coords}
        onOpenGPS={openGPSModal}
      />

      {/* Active alert banner */}
      {alerts[0] && <AlertBanner alert={alerts[0]} />}

      {/* Climate Specs Grid with hover animations */}
      <ClimateSpecsGrid weather={weather} />

      <div className="space-y-6">
        {/* 1. MAIN RECOMMENDATION CARD */}
        <div className="card-enter card-enter-1">
          <RecommendationCard rec={recommendation} weatherLocation={weather?.location?.name} />
        </div>

        {/* 2. WEATHER FORECAST & FIELD ACTIONS */}
        <div className="grid lg:grid-cols-3 gap-5 card-enter card-enter-2">
          <div className="lg:col-span-2">
            <ForecastTimeline weather={weather} />
          </div>

          {/* Today's action panel — with gradient accent */}
          <div className="rounded-2xl border border-[#e4e4e7] p-6 flex flex-col justify-between gap-6 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #fafafa 0%, #ffffff 100%)' }}>
            {/* Accent dot decoration */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-500" />

            <div>
              <p className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1">Panduan Tindakan</p>
              <h3 className="font-medium text-lg text-[#09090b] mb-3">Pekerjaan Lapangan Hari Ini</h3>
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                <div className="flex items-start gap-2.5">
                  <Sprout size={18} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-emerald-950 leading-relaxed">
                    Siapkan persemaian padi Ciherang. Bersihkan saluran irigasi primer menjelang potensi hujan sedang 3 hari ke depan.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-2.5">
                Peringatan Cuaca Terkini
              </p>
              <div className="space-y-2">
                {[
                  { msg: `Suhu wilayah ${weather?.location?.name || 'Klaten'} saat ini ${weather?.current?.temperature || 28}°C (${weather?.current?.description || 'Cerah Berawan'})`, unread: true },
                  { msg: 'Rekomendasi tanam telah disinkronkan dengan BMKG', unread: false },
                ].map((n, i) => (
                  <div key={i} className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-200 ${
                    n.unread
                      ? 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-400'
                      : 'bg-[#fafafa] border-[#e4e4e7] hover:border-emerald-200'
                  }`}>
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot flex-shrink-0" />}
                    <span className={`text-xs flex-1 leading-snug ${n.unread ? 'font-medium text-[#09090b]' : 'text-[#71717a]'}`}>
                      {n.msg}
                    </span>
                  </div>
                ))}
              </div>
              <Link to="/dashboard/peringatan" className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-semibold mt-3 hover:text-emerald-800 transition-colors group">
                <span>Lihat semua peringatan</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

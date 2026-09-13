import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Droplets, Wind, Thermometer, CheckCircle, AlertTriangle,
  ArrowRight, Info, ChevronRight, Bell, Sprout, Radio,
  Crosshair, X, Sparkles
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
function Greeting({ user, locationName, coords, onOpenGPS }) {
  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : 'Selamat sore';

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p className="text-[#71717a] text-sm">
          {greet},{' '}
          <span className="text-white font-bold tracking-tight">
            {user?.name || 'Petani Indonesia'}
          </span>
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-[#71717a] font-mono">
            {coords?.isGPS
              ? `${coords.regionName} (${coords.latitude.toFixed(2)}°, ${coords.longitude.toFixed(2)}°)`
              : (user?.location || locationName || 'Ngawi, Jawa Timur')}
          </span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-emerald-400 font-medium">
            {user?.commodity || 'Padi'} · Musim Tanam 2026
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenGPS}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-[#181D26] text-emerald-400 border border-emerald-500/20 transition-all shadow-sm group"
          title="Sinkronkan dengan sensor lokasi GPS perangkat"
        >
          <Crosshair size={13} className={coords?.isGPS ? "text-emerald-400 animate-pulse" : "text-[#71717a] group-hover:text-emerald-400"} />
          <span>{coords?.isGPS ? 'GPS Lahan Aktif' : 'Sinkronkan GPS Lahan'}</span>
        </button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          BMKG Live
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
    <div className="mb-5 animate-fade-in relative flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 shadow-lg" role="alert" aria-live="polite">
      <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            {alert.level || 'WASPADA'}
          </span>
          <span className="text-xs text-amber-300/70">· {alert.source || 'BMKG'}</span>
        </div>
        <p className="text-sm font-semibold text-white">{alert.title}</p>
        <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">{alert.description || alert.message}</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400/60 hover:text-amber-300 p-1 flex-shrink-0 transition-colors rounded-lg"
        aria-label="Tutup peringatan"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// ─── Weather Today Card ────────────────────────────────────────────────────────
function WeatherCard({ weather }) {
  const current = weather?.current || {};

  return (
    <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="font-medium text-lg text-white font-normal">Cuaca Hari Ini</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {weather?.source || 'BMKG Resmi'}
            </span>
            <span className="text-xs text-[#71717a]">
              {weather?.location?.subdistrict ? `${weather.location.subdistrict}, ${weather.location.city || weather.location.name}` : (weather?.location?.name || 'Klaten')}
            </span>
          </div>
        </div>
        <WeatherIcon code={current.weatherCode} iconUrl={current.iconUrl} size={48} />
      </div>

      <div className="flex items-end gap-3 mt-4">
        <div>
          <span className="font-medium text-5xl text-white font-normal tracking-tight">{current.temperature ?? 28}</span>
          <span className="text-xl text-[#71717a] font-light ml-1">°C</span>
        </div>
        <div className="pb-1.5">
          <p className="text-sm font-semibold text-white">{current.description || 'Cerah Berawan'}</p>
          <p className="text-xs text-[#71717a] font-mono">Rentang: {current.temperatureMin ?? 23}° – {current.temperatureMax ?? 32}°C</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-[#e4e4e7]">
        <div className="text-center p-2 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
          <Droplets size={16} className="text-sky-400 mx-auto mb-1" aria-hidden="true" />
          <div className="text-sm font-bold text-white font-mono">{current.humidity ?? 75}%</div>
          <div className="text-[11px] text-[#71717a]">Kelembapan</div>
        </div>
        <div className="text-center p-2 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
          <Thermometer size={16} className="text-amber-400 mx-auto mb-1" aria-hidden="true" />
          <div className="text-sm font-bold text-white font-mono">{current.rainProbability ?? 20}%</div>
          <div className="text-[11px] text-[#71717a]">Peluang Hujan</div>
        </div>
        <div className="text-center p-2 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
          <Wind size={16} className="text-teal-400 mx-auto mb-1" aria-hidden="true" />
          <div className="text-sm font-bold text-white font-mono">{current.windSpeed ?? 10}</div>
          <div className="text-[11px] text-[#71717a]">km/jam</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Recommendation Card ──────────────────────────────────────────────────
function RecommendationCard({ rec, weatherLocation }) {
  const r = rec?.recommendation || rec || {};

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#13161C] to-[#161B24] border border-emerald-500/20 p-5 sm:p-7 shadow-2xl relative overflow-hidden" role="region" aria-label="Rekomendasi tanam utama">
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-emerald-400 mb-1">
              <Sparkles size={12} />
              Analisis Kalender Tanam Terra AI
            </div>
            <h2 className="font-medium text-2xl sm:text-3xl text-white font-normal">{rec?.crop || 'Padi Sawah'}</h2>
          </div>
          <StatusBadge status={r.status || 'optimal'} />
        </div>

        {r.window && (
          <div className="mb-5 p-4 rounded-xl bg-[#fafafa]/80 border border-emerald-500/20">
            <div className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Jadwal Tanam Optimal (Berdasarkan BMKG)
            </div>
            <div className="font-medium text-xl sm:text-2xl text-white font-normal">
              {r.window.start} – {r.window.end}
            </div>
          </div>
        )}

        <ConfidenceBar value={r.confidence || 88} className="mb-5" />

        <div className="flex items-start gap-2.5 mb-4 p-3 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
          <Info size={16} className="text-sky-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-[#09090b] leading-relaxed">
            {r.reason || 'Kondisi cuaca dan curah hujan diprakirakan mencukupi kebutuhan air masa awal pertumbuhan.'}
          </p>
        </div>

        {r.action && (
          <div className="p-3.5 bg-[#fafafa] rounded-xl mb-4 border border-[#e4e4e7]">
            <div className="text-xs uppercase tracking-widest text-[#71717a] mb-1">Langkah Lapangan Hari Ini</div>
            <p className="text-sm font-medium text-emerald-300">{r.action}</p>
          </div>
        )}

        {r.alternative && (
          <div className="flex items-center gap-2 text-xs text-[#71717a] mb-2">
            <AlertTriangle size={13} className="text-amber-400" aria-hidden="true" />
            <span>Alternatif: {r.alternative}</span>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-[#e4e4e7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Algoritma Agronomi Real-time
            </span>
            <span className="text-xs text-[#71717a] hidden sm:inline">Lokasi: {weatherLocation || 'Klaten'}</span>
          </div>
          <Link to="/dashboard/rekomendasi" className="text-emerald-400 text-sm font-semibold flex items-center gap-1 hover:text-emerald-300 transition-colors">
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
    <div className="rounded-2xl bg-white border border-[#e4e4e7] shadow-xl overflow-hidden">
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-medium text-lg text-white font-normal">Prakiraan 7 Hari Kedepan</h2>
            <p className="text-xs text-[#71717a]">Kombinasi data resmi BMKG & sensor satelit resolusi tinggi</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live BMKG
          </span>
        </div>

        {/* Scrollable forecast cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" role="list" aria-label="Prakiraan cuaca mingguan">
          {forecast.slice(0, 7).map((day, i) => (
            <div
              key={i}
              className={`flex-shrink-0 flex flex-col items-center gap-2 p-3.5 rounded-xl border min-w-[95px] transition-all ${
                i === 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                  : 'bg-[#fafafa] border-[#e4e4e7] hover:border-[#e4e4e7]'
              }`}
              role="listitem"
            >
              <span className="text-xs font-mono text-[#71717a] text-center leading-tight">{day.dateLabel}</span>
              <WeatherIcon code={day.weatherCode} iconUrl={day.iconUrl} size={32} />
              <span className="text-sm font-bold text-white font-mono">{day.temperature}°C</span>
              <span className={`text-[11px] font-mono font-semibold ${
                day.rainProbability > 70 ? 'text-rose-400' :
                day.rainProbability > 40 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {day.rainProbability}% hujan
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rain Chart */}
      {forecast.length > 0 && (
        <div className="px-5 sm:px-6 pb-6 pt-2">
          <div className="text-xs uppercase tracking-widest text-[#71717a] mb-3">Proyeksi Curah Hujan Harian (mm)</div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={forecast.slice(0, 7)} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 10, fill: '#717684' }} tickFormatter={v => v.split(',')[0]} stroke="rgba(255,255,255,0.1)" />
              <YAxis tick={{ fontSize: 10, fill: '#717684' }} stroke="rgba(255,255,255,0.1)" />
              <Tooltip
                contentStyle={{ backgroundColor: '#13161C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 12 }}
                itemStyle={{ color: '#10b981' }}
                formatter={(v) => [`${v} mm`, 'Curah Hujan']}
              />
              <Area type="monotone" dataKey="rainfallMm" stroke="#10b981" fill="url(#rainGrad)" strokeWidth={2} />
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
    { label: 'Rata-rata Hasil', value: '5.92 ton/ha', sub: 'Historis wilayah', color: 'text-emerald-400' },
    { label: 'Kesesuaian Tanam', value: 'Tinggi (88%)', sub: 'Indeks iklim BMKG', color: 'text-teal-400' },
    { label: 'Prakiraan Hujan', value: 'Normal', sub: 'Dasarian I September', color: 'text-sky-400' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3" role="list" aria-label="Statistik tanam">
      {stats.map((s, i) => (
        <div key={i} className="rounded-2xl bg-white border border-[#e4e4e7] p-4 text-center shadow-lg" role="listitem">
          <div className={`font-medium text-lg sm:text-xl font-normal ${s.color}`}>{s.value}</div>
          <div className="text-xs font-medium text-white mt-1">{s.label}</div>
          <div className="text-[11px] text-[#71717a]">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard Home ────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const { user } = useAuth();
  const outletContext = useOutletContext() || {};
  const { coords, openGPSModal } = outletContext;

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
      <div className="space-y-5">
        <LoadingSkeleton className="h-8 w-48" />
        <LoadingSkeleton className="h-40 w-full" />
        <LoadingSkeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in text-[#09090b]">
      <Greeting
        user={user}
        locationName={weather?.location?.name}
        coords={coords}
        onOpenGPS={openGPSModal}
      />

      {/* Active alert banner */}
      {alerts[0] && <AlertBanner alert={alerts[0]} />}

      <div className="space-y-6">
        {/* 1. MAIN RECOMMENDATION — Powered by live BMKG data */}
        <RecommendationCard rec={recommendation} weatherLocation={weather?.location?.name} />

        {/* 2. WEATHER TODAY + TODAY'S ACTION */}
        <div className="grid sm:grid-cols-2 gap-6">
          <WeatherCard weather={weather} />

          {/* Today's action card */}
          <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-xl flex flex-col justify-between gap-5">
            <div>
              <h2 className="font-medium text-lg text-white font-normal mb-3">Tindakan Lapangan Hari Ini</h2>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Sprout size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs sm:text-sm font-medium text-emerald-200 leading-relaxed">
                  Pantau prakiraan curah hujan BMKG. Siapkan persemaian padi dan periksa saluran drainase petak sawah.
                </p>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-[#71717a] mb-2.5">
                Pemberitahuan Cuaca Terkini
              </div>
              <div className="space-y-2">
                {[
                  { msg: `Suhu wilayah ${weather?.location?.name || 'Klaten'} saat ini ${weather?.current?.temperature || 28}°C (${weather?.current?.description || 'Cerah Berawan'})`, unread: true, time: 'Real-time' },
                  { msg: 'Rekomendasi tanam telah disinkronkan dengan BMKG', unread: false, time: 'Baru saja' },
                ].map((n, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#fafafa] border border-[#e4e4e7] hover:border-[#e4e4e7] transition-colors">
                    {n.unread && <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" aria-label="Belum dibaca" />}
                    <span className={`text-xs flex-1 leading-snug ${n.unread ? 'font-medium text-white' : 'text-[#71717a]'}`}>
                      {n.msg}
                    </span>
                    <span className="text-[11px] font-mono text-[#71717a] flex-shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
              <Link to="/dashboard/peringatan" className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-medium mt-3.5 hover:text-emerald-300 transition-colors">
                <span>Lihat semua peringatan</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. WEATHER FORECAST */}
        <ForecastTimeline weather={weather} />

        {/* 4. QUICK STATS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-lg text-white font-normal">Ringkasan Iklim & Tanam</h2>
            <Link to="/dashboard/riwayat" className="text-emerald-400 text-sm font-medium flex items-center gap-1 hover:text-emerald-300 transition-colors">
              <span>Riwayat</span>
              <ChevronRight size={14} />
            </Link>
          </div>
          <QuickStats />
        </div>

      </div>
    </div>
  );
}

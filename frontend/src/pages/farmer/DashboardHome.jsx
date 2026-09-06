import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, Wind, Thermometer, CheckCircle, AlertTriangle,
  ArrowRight, Info, ChevronRight, Bell, Sprout
} from 'lucide-react';
import { WeatherIcon } from '../../components/WeatherIcons';
import { RiskBadge, StatusBadge, ConfidenceBar, LoadingSkeleton, SourceBadge, DemoBadge } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import {
  DEMO_WEATHER, DEMO_RECOMMENDATION, DEMO_ALERTS, DEMO_PLANTING_HISTORY
} from '../../data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// ─── Greeting ────────────────────────────────────────────────────────────────
function Greeting({ user }) {
  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : 'Selamat sore';

  return (
    <div className="mb-6">
      <p className="text-muted text-sm font-medium">
        {greet}, <span className="text-ink font-bold">{user?.name?.split(' ')[0] || 'Pak/Bu'}</span> 👋
      </p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-xs text-muted">{user?.village || 'Desa Karanglo'}, Klaten</span>
        <span className="text-muted">·</span>
        <span className="text-xs text-padi-600 font-semibold">Padi · Musim Tanam I</span>
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
          <span className="text-xs font-bold text-panen-700 uppercase tracking-wide">{alert.label}</span>
          <span className="text-xs text-muted">· {alert.source}</span>
        </div>
        <p className="text-sm font-semibold text-panen-900">{alert.title}</p>
        <p className="text-xs text-panen-800 mt-0.5 leading-relaxed">{alert.message}</p>
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
function WeatherCard({ current }) {
  return (
    <div className="card card-body">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="font-display text-lg text-ink">Cuaca Hari Ini</h2>
          <div className="text-xs text-muted mt-0.5">
            <SourceBadge source="BMKG" isDemo />
          </div>
        </div>
        <WeatherIcon code={current.weatherCode} size={40} />
      </div>

      <div className="flex items-end gap-4">
        <div>
          <span className="font-display text-5xl text-ink">{current.temperature}</span>
          <span className="text-xl text-muted">°C</span>
        </div>
        <div className="pb-1">
          <p className="text-sm font-semibold text-ink">{current.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <Droplets size={16} className="text-langit-500 mx-auto mb-1" aria-hidden="true" />
          <div className="text-sm font-bold text-ink">{current.humidity}%</div>
          <div className="text-xs text-muted">Lembapan</div>
        </div>
        <div className="text-center">
          <Thermometer size={16} className="text-red-400 mx-auto mb-1" aria-hidden="true" />
          <div className="text-sm font-bold text-ink">{current.rainProbability}%</div>
          <div className="text-xs text-muted">Peluang hujan</div>
        </div>
        <div className="text-center">
          <Wind size={16} className="text-muted mx-auto mb-1" aria-hidden="true" />
          <div className="text-sm font-bold text-ink">{current.windSpeed}</div>
          <div className="text-xs text-muted">km/jam</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Recommendation Card ──────────────────────────────────────────────────
function RecommendationCard({ rec }) {
  const r = rec.recommendation;

  return (
    <div className="card border-l-4 border-l-padi-400" role="region" aria-label="Rekomendasi tanam utama">
      <div className="card-body">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wide">Rekomendasi Tanam</span>
            <h2 className="font-display text-2xl text-ink mt-0.5">{rec.crop}</h2>
          </div>
          <StatusBadge status={r.status} />
        </div>

        {r.window && (
          <div className="mb-4 p-4 bg-padi-50 rounded-xl border border-padi-100">
            <div className="text-xs font-semibold text-padi-600 uppercase tracking-wide mb-1">Waktu Tanam Disarankan</div>
            <div className="font-display text-xl text-padi-800">
              {r.window.start} – {r.window.end}
            </div>
          </div>
        )}

        <ConfidenceBar value={r.confidence} className="mb-4" />

        <div className="flex items-start gap-2 mb-3">
          <Info size={15} className="text-langit-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-ink leading-relaxed">{r.reason}</p>
        </div>

        {r.action && (
          <div className="p-3 bg-surface rounded-lg mb-3 border border-border">
            <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Yang perlu dilakukan hari ini</div>
            <p className="text-sm font-medium text-ink">{r.action}</p>
          </div>
        )}

        {r.alternative && (
          <div className="flex items-center gap-2 text-xs text-muted">
            <AlertTriangle size={12} className="text-panen-500" aria-hidden="true" />
            Alternatif: {r.alternative}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DemoBadge />
            <span className="text-xs text-muted">{rec.engine}</span>
          </div>
          <Link to="/dashboard/rekomendasi" className="text-padi-600 text-sm font-semibold flex items-center gap-1 hover:text-padi-700 transition-colors">
            Lihat detail
            <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Forecast Timeline ─────────────────────────────────────────────────────────
function ForecastTimeline({ forecast }) {
  return (
    <div className="card">
      <div className="card-body pb-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-ink">Prakiraan 7 Hari</h2>
          <SourceBadge source="BMKG" isDemo />
        </div>

        {/* Scrollable forecast cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" role="list" aria-label="Prakiraan cuaca mingguan">
          {forecast.slice(0, 7).map((day, i) => (
            <div
              key={i}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-xl border min-w-[80px] transition-colors ${
                i === 0 ? 'bg-padi-50 border-padi-200' : 'bg-white border-border'
              }`}
              role="listitem"
              aria-label={`${day.dateLabel}: ${day.description}, ${day.temperature}°C, peluang hujan ${day.rainProbability}%`}
            >
              <span className="text-xs font-semibold text-muted text-center leading-tight">{day.dateLabel}</span>
              <WeatherIcon code={day.weatherCode} size={32} />
              <span className="text-sm font-bold text-ink">{day.temperature}°</span>
              <span className={`text-xs font-semibold ${
                day.rainProbability > 70 ? 'text-red-600' :
                day.rainProbability > 50 ? 'text-panen-600' : 'text-padi-600'
              }`}>
                {day.rainProbability}%
              </span>
              {day.rainfallMm > 0 && (
                <span className="text-xs text-muted">{day.rainfallMm}mm</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-6 pb-5">
        <div className="text-xs text-muted mb-2">Curah Hujan (mm)</div>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={forecast.slice(0, 7)} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9BC7D4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#9BC7D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECE9" />
            <XAxis dataKey="dateLabel" tick={{ fontSize: 10, fill: '#6B756D' }} tickFormatter={v => v.split(',')[0]} />
            <YAxis tick={{ fontSize: 10, fill: '#6B756D' }} />
            <Tooltip
              contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, borderRadius: 8, border: '1px solid #D8DED9' }}
              formatter={(v) => [`${v}mm`, 'Curah Hujan']}
            />
            <Area type="monotone" dataKey="rainfallMm" stroke="#5BA3B6" fill="url(#rainGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Quick Stats Row ───────────────────────────────────────────────────────────
function QuickStats() {
  const stats = [
    { label: 'Rata-rata Hasil', value: '5.92 ton/ha', sub: '5 musim tanam', color: 'text-padi-600' },
    { label: 'Musim Terbaik', value: 'MT-I 2025', sub: '6.17 ton/ha', color: 'text-panen-600' },
    { label: 'Rekomendasi Diikuti', value: '78%', sub: 'dari 5 tanam', color: 'text-langit-600' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3" role="list" aria-label="Statistik tanam">
      {stats.map((s, i) => (
        <div key={i} className="card card-body text-center py-4" role="listitem">
          <div className={`font-display text-xl font-bold ${s.color}`}>{s.value}</div>
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
  const [weather] = useState(DEMO_WEATHER);
  const [recommendation] = useState(DEMO_RECOMMENDATION);
  const [alerts] = useState(DEMO_ALERTS);
  const [loading] = useState(false);

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
      <Greeting user={user} />

      {/* Active alert banner */}
      {alerts[0] && <AlertBanner alert={alerts[0]} />}

      {/* Information hierarchy: WHAT DO I DO → WHY → WHAT WEATHER → WATCH → HISTORY */}
      <div className="space-y-5">

        {/* 1. MAIN RECOMMENDATION — dominates visually */}
        <RecommendationCard rec={recommendation} />

        {/* 2. WEATHER TODAY + TODAY'S ACTION */}
        <div className="grid sm:grid-cols-2 gap-5">
          <WeatherCard current={weather.current} />

          {/* Today's action card */}
          <div className="card card-body flex flex-col gap-4">
            <div>
              <h2 className="font-display text-lg text-ink mb-1">Tindakan Hari Ini</h2>
              <div className="flex items-start gap-3 p-3 bg-padi-50 rounded-xl border border-padi-100">
                <Sprout size={18} className="text-padi-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm font-medium text-ink leading-relaxed">
                  Persiapkan benih. Belum perlu melakukan penyemaian — tunggu 12 September untuk mulai.
                </p>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Notifikasi Terbaru</div>
              <div className="space-y-2">
                {[
                  { msg: 'Peringatan hujan lebat besok sore', unread: true, time: '1j lalu' },
                  { msg: 'Rekomendasi tanam telah diperbarui', unread: true, time: '12j lalu' },
                ].map((n, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-surface transition-colors">
                    {n.unread && <span className="w-2 h-2 rounded-full bg-padi-500 flex-shrink-0" aria-label="Belum dibaca" />}
                    <span className={`text-xs flex-1 leading-snug ${n.unread ? 'font-semibold text-ink' : 'text-muted'}`}>
                      {n.msg}
                    </span>
                    <span className="text-xs text-muted flex-shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
              <Link to="/dashboard/peringatan" className="flex items-center gap-1 text-padi-600 text-xs font-semibold mt-3 hover:text-padi-700 transition-colors">
                Lihat semua <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. WEATHER FORECAST */}
        <ForecastTimeline forecast={weather.forecast} />

        {/* 4. QUICK STATS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-ink">Statistik Tanam Saya</h2>
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

import { useState, useEffect } from 'react';
import { Activity, Users, MapPin, Database, Leaf, Sparkles, Terminal, Shield, Zap, TrendingUp } from 'lucide-react';
import { DemoBadge } from '../../components/ui';
import { adminAPI } from '../../services/api';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const MOCK_API_HEALTH = {
  bmkg: { name: 'BMKG Open Data API', status: 'healthy', lastSync: '2026-09-06T20:31:00+07:00', responseMs: 240, uptime: 99.2 },
  openMeteo: { name: 'Open-Meteo High-Res API', status: 'healthy', lastSync: '2026-09-06T20:30:00+07:00', responseMs: 310, uptime: 99.8 },
};

const MOCK_LOGS = [
  { id: 'l1', level: 'info', service: 'WeatherService', message: 'BMKG data fetched & cached for Klaten', timestamp: '2026-09-06T20:31:00+07:00' },
  { id: 'l2', level: 'info', service: 'WeatherService', message: 'Open-Meteo telemetry synced for Sleman', timestamp: '2026-09-06T20:30:00+07:00' },
  { id: 'l3', level: 'warn', service: 'NotificationService', message: 'WhatsApp gateway latency detected (2.1s)', timestamp: '2026-09-06T20:15:00+07:00' },
  { id: 'l4', level: 'info', service: 'AuthService', message: 'JWT session authenticated for farmer@ramaltani.demo', timestamp: '2026-09-06T20:00:00+07:00' },
  { id: 'l5', level: 'error', service: 'WeatherService', message: 'BMKG station 96781 timeout; served cached dasarian forecast', timestamp: '2026-09-06T19:45:00+07:00' },
  { id: 'l6', level: 'info', service: 'RuleEngine', message: 'Agronomic calendar calculation executed (status: optimal, confidence: 88%)', timestamp: '2026-09-06T08:05:00+07:00' },
];

export default function AdminDashboard() {
  const [apiHealth, setApiHealth] = useState(MOCK_API_HEALTH);
  const [logs] = useState(MOCK_LOGS);
  const containerRef = useScrollReveal();

  useEffect(() => {
    adminAPI.getAPIHealth()
      .then(r => setApiHealth(r.data.data))
      .catch(() => {});
  }, []);

  const logColor = {
    info: 'text-emerald-400',
    warn: 'text-amber-400',
    error: 'text-rose-400'
  };

  const logBg = {
    info: 'border-emerald-900/40 bg-emerald-950/20',
    warn: 'border-amber-900/40 bg-amber-950/20',
    error: 'border-rose-900/40 bg-rose-950/20',
  };

  const statCards = [
    {
      label: 'Total Pengguna',
      value: '8',
      icon: <Users size={20} />,
      color: 'text-emerald-400',
      iconBg: 'bg-emerald-900/40 border-emerald-700/50',
      gradient: 'from-emerald-900/20 to-transparent',
      sub: '+2 bulan ini',
    },
    {
      label: 'Stasiun Radar Aktif',
      value: '9',
      icon: <MapPin size={20} />,
      color: 'text-sky-400',
      iconBg: 'bg-sky-900/40 border-sky-700/50',
      gradient: 'from-sky-900/20 to-transparent',
      sub: 'Coverage 94%',
    },
    {
      label: 'Basis Varietas',
      value: '7',
      icon: <Leaf size={20} />,
      color: 'text-teal-400',
      iconBg: 'bg-teal-900/40 border-teal-700/50',
      gradient: 'from-teal-900/20 to-transparent',
      sub: 'Padi & Sayuran',
    },
    {
      label: 'Uptime Platform',
      value: '99.5%',
      icon: <Activity size={20} />,
      color: 'text-violet-400',
      iconBg: 'bg-violet-900/40 border-violet-700/50',
      gradient: 'from-violet-900/20 to-transparent',
      sub: 'SLA Terpenuhi',
    },
  ];

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto page-enter">
      {/* ─── Dark Hero Header ─── */}
      <div className="relative mb-10 rounded-3xl overflow-hidden p-8 sm:p-10 lg:p-12"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 60%, #0f172a 100%)' }}>
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-500/10 blur-3xl rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={14} className="text-emerald-400" />
            <p className="text-xs uppercase tracking-widest text-emerald-400/80 font-medium font-mono">
              System Administration · Telemetry
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-[10px] font-mono text-emerald-400 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              LIVE
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.08]"
            style={{ animation: 'heroSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
            Pusat Kendali
          </h1>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.08] bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent"
            style={{ animation: 'heroSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.22s both' }}>
            Sistem.
          </h1>
          <p className="text-base text-slate-400 mt-3 max-w-xl leading-relaxed"
            style={{ animation: 'heroSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s both' }}>
            Monitoring uptime gateway API BMKG, audit log sistem, dan manajemen hak akses pengguna.
          </p>
        </div>

        {/* Decorative terminal cursor */}
        <div className="absolute bottom-8 right-8 text-xs font-mono text-emerald-500/60 flex items-center gap-1">
          <span>$ ./system-status --live</span>
          <span className="terminal-cursor" />
        </div>
      </div>

      {/* ─── System stats with dark cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s, i) => (
          <div key={i}
            className={`card-enter card-enter-${i + 1} relative rounded-2xl border border-[#e4e4e7] p-5 overflow-hidden group cursor-default transition-all duration-300 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5`}
            style={{ background: `linear-gradient(135deg, var(--from-color, #fafafa) 0%, #ffffff 100%)` }}>
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${s.iconBg} ${s.color}`}>
                {s.icon}
              </div>
              <div className={`font-semibold text-2xl text-[#09090b] group-hover:${s.color} transition-colors`}>{s.value}</div>
              <div className="text-xs font-medium text-[#71717a] mt-0.5">{s.label}</div>
              <div className={`text-[11px] font-mono mt-1.5 ${s.color} opacity-70`}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── API Health ─── */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 mb-6 shadow-sm reveal-up overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400" />
        <div className="flex items-center gap-2 mb-5">
          <Zap size={16} className="text-emerald-600" />
          <h2 className="font-medium text-base text-[#09090b]">Monitoring Gateway Eksternal</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(apiHealth).map(([key, api]) => (
            <div key={key} className="p-4 rounded-xl bg-[#fafafa] border border-[#e4e4e7] hover:border-emerald-200 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#09090b]">{api.name}</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${
                  api.status === 'healthy'
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    : 'text-amber-700 bg-amber-50 border border-amber-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${api.status === 'healthy' ? 'bg-emerald-600' : 'bg-amber-600'} pulse-dot`} />
                  {api.status === 'healthy' ? 'Sehat (Live)' : 'Degraded'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {[
                  { label: 'Last Sync', val: new Date(api.lastSync).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) },
                  { label: 'Latency', val: `${api.responseMs} ms`, green: true },
                  { label: 'SLA Uptime', val: `${api.uptime}%` },
                ].map((info, j) => (
                  <div key={j} className="p-2 rounded-lg bg-white border border-[#e4e4e7] group-hover:border-emerald-100 transition-colors">
                    <div className="text-[#71717a] text-[10px] uppercase">{info.label}</div>
                    <div className={`font-medium mt-0.5 ${info.green ? 'text-emerald-700' : 'text-[#09090b]'}`}>{info.val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── User management ─── */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] overflow-hidden mb-6 shadow-sm reveal-up">
        <div className="p-5 border-b border-[#e4e4e7] flex items-center gap-2 relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-400 to-teal-400" />
          <Users size={16} className="text-[#71717a]" />
          <h2 className="font-medium text-base text-[#09090b]">Daftar Pengguna & Hak Akses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" aria-label="Tabel pengguna sistem">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e4e4e7] text-[#71717a] font-mono text-[11px] uppercase tracking-wider">
                {['Nama', 'Email', 'Peran', 'Wilayah Basis', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e4e7] text-sm">
              {[
                { name: 'Budi Santoso', email: 'farmer@ramaltani.demo', role: 'farmer', region: 'Klaten', active: true },
                { name: 'Wahyudi Pratama', email: 'penyuluh@ramaltani.demo', role: 'extension_officer', region: 'Klaten', active: true },
                { name: 'Admin RamalTani', email: 'admin@ramaltani.demo', role: 'admin', region: 'Pusat (Cloud)', active: true },
                { name: 'Siti Rahayu', email: 'siti@demo.ramaltani', role: 'farmer', region: 'Klaten', active: true },
                { name: 'Slamet Riyadi', email: 'slamet@demo.ramaltani', role: 'farmer', region: 'Sleman', active: true },
              ].map((u, i) => (
                <tr key={i} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-6 py-3.5 font-medium text-[#09090b] flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      u.role === 'admin' ? 'bg-violet-100 text-violet-700' :
                      u.role === 'extension_officer' ? 'bg-teal-100 text-teal-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {u.name[0]}
                    </div>
                    {u.name}
                  </td>
                  <td className="px-6 py-3.5 text-xs font-mono text-[#71717a]">{u.email}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                      u.role === 'admin' ? 'bg-violet-50 text-violet-700 border-violet-200' :
                      u.role === 'extension_officer' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {u.role === 'farmer' ? 'Petani' : u.role === 'extension_officer' ? 'Penyuluh (PPL)' : 'Administrator'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-[#71717a]">{u.region}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" /> Aktif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── System logs — dark terminal style ─── */}
      <div className="rounded-2xl border border-[#27272a] overflow-hidden shadow-lg reveal-up"
        style={{ background: '#0d1117' }}>
        {/* Terminal header bar */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-400/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Terminal size={13} className="text-emerald-400" />
            <span className="text-[11px] font-mono text-slate-400">ramaltani-system · audit.log · live</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700/50 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
            STREAMING
          </span>
        </div>

        {/* Log content */}
        <div className="p-5 space-y-2 font-mono">
          {logs.map((log, idx) => (
            <div
              key={log.id}
              className={`flex items-start gap-3 p-3 rounded-lg border text-xs leading-relaxed card-enter card-enter-${Math.min(idx + 1, 6)} ${logBg[log.level]}`}
            >
              <span className="text-slate-600 flex-shrink-0 text-[10px]">
                {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className={`font-bold uppercase flex-shrink-0 ${logColor[log.level]}`}>
                [{log.level}]
              </span>
              <span className="text-slate-500 flex-shrink-0">{log.service}:</span>
              <span className="text-slate-300 flex-1">{log.message}</span>
            </div>
          ))}

          {/* Blinking cursor at end */}
          <div className="flex items-center gap-2 px-3 py-2 text-xs font-mono text-emerald-500/60">
            <span>$</span>
            <span className="terminal-cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}

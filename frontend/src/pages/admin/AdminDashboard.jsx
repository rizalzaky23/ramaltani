import { useState, useEffect } from 'react';
import { Activity, Users, MapPin, Database, Leaf, Sparkles, Terminal } from 'lucide-react';
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
    info: 'text-emerald-700',
    warn: 'text-amber-700',
    error: 'text-rose-700'
  };

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto text-[#09090b] page-enter">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
            <Sparkles size={12} />
            System Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#09090b] tracking-tight">Pusat Kendali Sistem & Telemetri</h1>
          <p className="text-[#71717a] text-sm mt-1">
            Monitoring uptime gateway API BMKG, audit log sistem, dan manajemen hak akses pengguna.
          </p>
        </div>
        <DemoBadge />
      </div>

      {/* System stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 reveal-up">
        {[
          { label: 'Total Pengguna', value: '8', icon: <Users size={20} />, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'Stasiun Radar Aktif', value: '9', icon: <MapPin size={20} />, color: 'text-sky-700 bg-sky-50 border-sky-200' },
          { label: 'Basis Varietas', value: '7', icon: <Leaf size={20} />, color: 'text-teal-700 bg-teal-50 border-teal-200' },
          { label: 'Uptime Platform', value: '99.5%', icon: <Activity size={20} />, color: 'text-amber-700 bg-amber-50 border-amber-200' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white border border-[#e4e4e7] p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${s.color}`}>
              {s.icon}
            </div>
            <div className="font-semibold text-2xl text-[#09090b]">{s.value}</div>
            <div className="text-xs font-medium text-[#71717a] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* API Health */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 mb-6 shadow-sm reveal-up">
        <h2 className="font-medium text-base text-[#09090b] mb-4">Monitoring Gateway Eksternal</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(apiHealth).map(([key, api]) => (
            <div key={key} className="p-4 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#09090b]">{api.name}</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${
                  api.status === 'healthy'
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    : 'text-amber-700 bg-amber-50 border border-amber-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${api.status === 'healthy' ? 'bg-emerald-600' : 'bg-amber-600'} animate-pulse`} />
                  {api.status === 'healthy' ? 'Sehat (Live)' : 'Degraded'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-white border border-[#e4e4e7]">
                  <div className="text-[#71717a] text-[10px] uppercase">Last Sync</div>
                  <div className="font-medium text-[#09090b] mt-0.5">
                    {new Date(api.lastSync).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-[#e4e4e7]">
                  <div className="text-[#71717a] text-[10px] uppercase">Latency</div>
                  <div className="font-medium text-emerald-700 mt-0.5">{api.responseMs} ms</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-[#e4e4e7]">
                  <div className="text-[#71717a] text-[10px] uppercase">SLA Uptime</div>
                  <div className="font-medium text-[#09090b] mt-0.5">{api.uptime}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User management */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] overflow-hidden mb-6 shadow-sm reveal-up">
        <div className="p-5 border-b border-[#e4e4e7]">
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
                <tr key={i} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-6 py-3.5 font-medium text-[#09090b]">{u.name}</td>
                  <td className="px-6 py-3.5 text-xs font-mono text-[#71717a]">{u.email}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                      u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      u.role === 'extension_officer' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {u.role === 'farmer' ? 'Petani' : u.role === 'extension_officer' ? 'Penyuluh (PPL)' : 'Administrator'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-[#71717a]">{u.region}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Aktif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System logs */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-sm reveal-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-emerald-700" />
            <h2 className="font-medium text-base text-[#09090b]">Audit Log & Event Telemetri</h2>
          </div>
          <span className="text-[11px] font-mono text-[#71717a]">Sinkronisasi Realtime</span>
        </div>
        <div className="space-y-2 font-mono">
          {logs.map(log => (
            <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-xs leading-relaxed">
              <span className={`font-bold uppercase flex-shrink-0 ${logColor[log.level]}`}>
                [{log.level}]
              </span>
              <span className="text-[#71717a] flex-shrink-0">{log.service}:</span>
              <span className="text-[#09090b] flex-1">{log.message}</span>
              <span className="text-[#71717a] text-[11px] flex-shrink-0">
                {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Activity, CheckCircle, AlertTriangle, Users, MapPin, Database, Leaf, Sparkles, Terminal } from 'lucide-react';
import { SectionHeader, DemoBadge } from '../../components/ui';
import { adminAPI } from '../../services/api';

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

  return (
    <div className="max-w-6xl mx-auto text-[#09090b] animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            System Administration
          </div>
          <h1 className="font-medium text-2xl sm:text-3xl text-white font-normal">Pusat Kendali Sistem & Telemetri</h1>
          <p className="text-[#71717a] text-sm mt-1">
            Monitoring uptime gateway API BMKG, audit log sistem, dan manajemen hak akses pengguna.
          </p>
        </div>
        <DemoBadge />
      </div>

      {/* System stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Pengguna', value: '8', icon: <Users size={20} />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Stasiun Radar Aktif', value: '9', icon: <MapPin size={20} />, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
          { label: 'Basis Varietas', value: '7', icon: <Leaf size={20} />, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
          { label: 'Uptime Platform', value: '99.5%', icon: <Activity size={20} />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white border border-[#e4e4e7] p-5 shadow-xl">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${s.color}`}>
              {s.icon}
            </div>
            <div className="font-medium text-2xl font-normal text-white">{s.value}</div>
            <div className="text-xs font-medium text-[#71717a] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* API Health */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 mb-6 shadow-xl">
        <h2 className="font-medium text-base text-white font-normal mb-4">Monitoring Gateway Eksternal</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(apiHealth).map(([key, api]) => (
            <div key={key} className="p-4 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">{api.name}</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${
                  api.status === 'healthy'
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${api.status === 'healthy' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                  {api.status === 'healthy' ? 'Sehat (Live)' : 'Degraded'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">
                  <div className="text-[#71717a] text-[10px] uppercase">Last Sync</div>
                  <div className="font-medium text-white mt-0.5">
                    {new Date(api.lastSync).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">
                  <div className="text-[#71717a] text-[10px] uppercase">Latency</div>
                  <div className="font-medium text-emerald-400 mt-0.5">{api.responseMs} ms</div>
                </div>
                <div className="p-2 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">
                  <div className="text-[#71717a] text-[10px] uppercase">SLA Uptime</div>
                  <div className="font-medium text-white mt-0.5">{api.uptime}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User management */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] overflow-hidden mb-6 shadow-xl">
        <div className="p-5 border-b border-[#e4e4e7]">
          <h2 className="font-medium text-base text-white font-normal">Daftar Pengguna & Hak Akses</h2>
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
            <tbody className="divide-y divide-white/5 text-sm">
              {[
                { name: 'Budi Santoso', email: 'farmer@ramaltani.demo', role: 'farmer', region: 'Klaten', active: true },
                { name: 'Wahyudi Pratama', email: 'penyuluh@ramaltani.demo', role: 'extension_officer', region: 'Klaten', active: true },
                { name: 'Admin RamalTani', email: 'admin@ramaltani.demo', role: 'admin', region: 'Pusat (Cloud)', active: true },
                { name: 'Siti Rahayu', email: 'siti@demo.ramaltani', role: 'farmer', region: 'Klaten', active: true },
                { name: 'Slamet Riyadi', email: 'slamet@demo.ramaltani', role: 'farmer', region: 'Sleman', active: true },
              ].map((u, i) => (
                <tr key={i} className="hover:bg-[#fafafa]/50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-white">{u.name}</td>
                  <td className="px-6 py-3.5 text-xs font-mono text-[#71717a]">{u.email}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                      u.role === 'admin' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' :
                      u.role === 'extension_officer' ? 'bg-teal-500/10 text-teal-300 border-teal-500/20' :
                      'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    }`}>
                      {u.role === 'farmer' ? 'Petani' : u.role === 'extension_officer' ? 'Penyuluh (PPL)' : 'Administrator'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-[#71717a]">{u.region}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Aktif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System logs */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-emerald-400" />
            <h2 className="font-medium text-base text-white font-normal">Audit Log & Event Telemetri</h2>
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

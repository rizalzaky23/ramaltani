import { useState, useEffect } from 'react';
import { Activity, CheckCircle, AlertTriangle, Users, MapPin, Database, Leaf } from 'lucide-react';
import { SectionHeader, DemoBadge } from '../../components/ui';
import { adminAPI } from '../../services/api';

const MOCK_API_HEALTH = {
  bmkg: { name: 'BMKG Open Data API', status: 'healthy', lastSync: '2026-09-06T20:31:00+07:00', responseMs: 240, uptime: 99.2 },
  openMeteo: { name: 'Open-Meteo API', status: 'healthy', lastSync: '2026-09-06T20:30:00+07:00', responseMs: 310, uptime: 99.8 },
};

const MOCK_LOGS = [
  { id: 'l1', level: 'info', service: 'WeatherService', message: 'BMKG data fetched for Klaten', timestamp: '2026-09-06T20:31:00+07:00' },
  { id: 'l2', level: 'info', service: 'WeatherService', message: 'Open-Meteo data fetched for Sleman', timestamp: '2026-09-06T20:30:00+07:00' },
  { id: 'l3', level: 'warn', service: 'NotificationService', message: 'WhatsApp delivery retry for notif-002', timestamp: '2026-09-06T20:15:00+07:00' },
  { id: 'l4', level: 'info', service: 'AuthService', message: 'User usr-001 logged in', timestamp: '2026-09-06T20:00:00+07:00' },
  { id: 'l5', level: 'error', service: 'WeatherService', message: 'BMKG timeout, falling back to cache', timestamp: '2026-09-06T19:45:00+07:00' },
  { id: 'l6', level: 'info', service: 'RecommendationEngine', message: 'Recommendation calculated for usr-001', timestamp: '2026-09-06T08:05:00+07:00' },
];

export default function AdminDashboard() {
  const [apiHealth, setApiHealth] = useState(MOCK_API_HEALTH);
  const [logs] = useState(MOCK_LOGS);

  useEffect(() => {
    adminAPI.getAPIHealth()
      .then(r => setApiHealth(r.data.data))
      .catch(() => {}); // keep mock
  }, []);

  const logColor = { info: 'text-padi-600', warn: 'text-panen-600', error: 'text-red-600' };
  const logBg = { info: 'bg-padi-50', warn: 'bg-panen-50', error: 'bg-red-50' };

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader title="Admin Sistem" subtitle="Monitoring, manajemen pengguna, dan konfigurasi platform" action={<DemoBadge />} />

      {/* System stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Pengguna', value: '8', icon: <Users size={20} />, color: 'bg-padi-50 text-padi-600' },
          { label: 'Wilayah Demo', value: '8', icon: <MapPin size={20} />, color: 'bg-langit-50 text-langit-600' },
          { label: 'Varietas Tanaman', value: '7', icon: <Leaf size={20} />, color: 'bg-daun-50 text-daun-600' },
          { label: 'Uptime Sistem', value: '99.5%', icon: <Activity size={20} />, color: 'bg-panen-50 text-panen-600' },
        ].map((s, i) => (
          <div key={i} className="card card-body">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${s.color}`}>{s.icon}</div>
            <div className="font-display text-2xl font-bold text-ink">{s.value}</div>
            <div className="text-sm text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* API Health */}
      <div className="card card-body mb-6">
        <h2 className="font-display text-base text-ink mb-4">API Monitoring</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(apiHealth).map(([key, api]) => (
            <div key={key} className={`p-4 rounded-xl border ${api.status === 'healthy' ? 'bg-padi-50 border-padi-200' : 'bg-panen-50 border-panen-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-ink">{api.name}</span>
                <span className={`flex items-center gap-1.5 text-xs font-bold ${api.status === 'healthy' ? 'text-padi-700' : 'text-panen-700'}`}>
                  {api.status === 'healthy'
                    ? <><CheckCircle size={12} /> Sehat</>
                    : <><AlertTriangle size={12} /> Terganggu</>}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-muted">Sinkronisasi Terakhir</div>
                  <div className="font-semibold text-ink">
                    {new Date(api.lastSync).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div>
                  <div className="text-muted">Response Time</div>
                  <div className="font-semibold text-ink">{api.responseMs} ms</div>
                </div>
                <div>
                  <div className="text-muted">Uptime</div>
                  <div className="font-semibold text-ink">{api.uptime}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User management */}
      <div className="card mb-6 overflow-hidden">
        <div className="card-body pb-0">
          <h2 className="font-display text-base text-ink mb-4">Manajemen Pengguna</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Tabel pengguna sistem">
            <thead>
              <tr className="bg-surface border-b border-border">
                {['Nama', 'Email', 'Peran', 'Wilayah', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-muted px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { name: 'Budi Santoso', email: 'farmer@ramaltani.demo', role: 'farmer', region: 'Klaten', active: true },
                { name: 'Wahyudi Pratama', email: 'penyuluh@ramaltani.demo', role: 'extension_officer', region: 'Klaten', active: true },
                { name: 'Admin RamalTani', email: 'admin@ramaltani.demo', role: 'admin', region: '-', active: true },
                { name: 'Siti Rahayu', email: 'siti@demo.ramaltani', role: 'farmer', region: 'Klaten', active: true },
                { name: 'Slamet Riyadi', email: 'slamet@demo.ramaltani', role: 'farmer', region: 'Sleman', active: true },
              ].map((u, i) => (
                <tr key={i} className="hover:bg-surface/50">
                  <td className="px-6 py-3 text-sm font-semibold text-ink">{u.name}</td>
                  <td className="px-6 py-3 text-sm text-muted">{u.email}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      u.role === 'admin' ? 'bg-ink text-white' :
                      u.role === 'extension_officer' ? 'bg-daun-50 text-daun-700 border border-daun-200' :
                      'bg-padi-50 text-padi-700 border border-padi-200'
                    }`}>
                      {u.role === 'farmer' ? 'Petani' : u.role === 'extension_officer' ? 'Penyuluh' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-muted">{u.region}</td>
                  <td className="px-6 py-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-padi-600">
                      <CheckCircle size={12} /> Aktif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System logs */}
      <div className="card card-body">
        <h2 className="font-display text-base text-ink mb-4">System Logs Terbaru</h2>
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className={`flex items-start gap-3 p-3 rounded-lg text-xs ${logBg[log.level]}`}>
              <span className={`font-bold uppercase flex-shrink-0 ${logColor[log.level]}`}>[{log.level}]</span>
              <span className="text-muted flex-shrink-0">{log.service}</span>
              <span className="text-ink flex-1">{log.message}</span>
              <span className="text-muted flex-shrink-0">
                {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

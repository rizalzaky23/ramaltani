import { useState } from 'react';
import { Users, AlertTriangle, BarChart2, CheckCircle, MapPin, Send } from 'lucide-react';
import { SectionHeader, DemoBadge, RiskBadge } from '../../components/ui';
import { DEMO_RISK_DATA } from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const STATS = [
  { label: 'Petani Binaan', value: '184', sub: 'Wilayah Klaten', icon: <Users size={22} />, color: 'padi' },
  { label: 'Wilayah Berisiko', value: '7', sub: 'dari 12 wilayah', icon: <AlertTriangle size={22} />, color: 'panen' },
  { label: 'Potensi Gagal Tanam', value: '12%', sub: '~22 petani', icon: <BarChart2 size={22} />, color: 'tanah' },
  { label: 'Petani Aktif', value: '81%', sub: '149 aktif', icon: <CheckCircle size={22} />, color: 'daun' },
];

const colorMap = { padi: '#6E9F43', panen: '#D8A83E', tanah: '#8A684A', daun: '#3F6B3B' };
const bgMap = { padi: 'bg-padi-50 text-padi-600', panen: 'bg-panen-50 text-panen-600', tanah: 'bg-tanah-50 text-tanah-600', daun: 'bg-daun-50 text-daun-600' };

const CROP_DATA = [
  { name: 'Padi', value: 67, fill: '#6E9F43' },
  { name: 'Jagung', value: 15, fill: '#D8A83E' },
  { name: 'Cabai', value: 10, fill: '#B03A2E' },
  { name: 'Kedelai', value: 4, fill: '#3F6B3B' },
  { name: 'Lainnya', value: 4, fill: '#8A684A' },
];

const MONTHLY_DATA = [
  { month: 'Apr', tanam: 45, panen: 12 },
  { month: 'Mei', tanam: 38, panen: 67 },
  { month: 'Jun', tanam: 12, panen: 89 },
  { month: 'Jul', tanam: 8, panen: 42 },
  { month: 'Agu', tanam: 52, panen: 18 },
  { month: 'Sep', tanam: 91, panen: 5 },
];

export default function ExtensionDashboard() {
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', channels: ['in_app'] });
  const [broadcastSent, setBroadcastSent] = useState(null);

  const handleBroadcast = (e) => {
    e.preventDefault();
    setBroadcastSent({ count: 181, total: 184 });
    setTimeout(() => { setBroadcastSent(null); setShowBroadcast(false); }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        title="Dashboard Penyuluh"
        subtitle="Ringkasan kondisi petani dan wilayah binaan Anda"
        action={<DemoBadge />}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((s, i) => (
          <div key={i} className="card card-body">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${bgMap[s.color]}`}>
              {s.icon}
            </div>
            <div className="font-display text-2xl font-bold text-ink">{s.value}</div>
            <div className="text-sm font-semibold text-ink">{s.label}</div>
            <div className="text-xs text-muted">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Activity chart */}
        <div className="lg:col-span-2 card card-body">
          <h2 className="font-display text-base text-ink mb-4">Aktivitas Tanam & Panen (6 Bulan)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECE9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="tanam" name="Tanam" fill="#6E9F43" radius={[4,4,0,0]} />
              <Bar dataKey="panen" name="Panen" fill="#D8A83E" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crop distribution */}
        <div className="card card-body">
          <h2 className="font-display text-base text-ink mb-4">Distribusi Komoditas</h2>
          <div className="flex justify-center mb-3">
            <PieChart width={160} height={160}>
              <Pie data={CROP_DATA} cx={75} cy={75} innerRadius={45} outerRadius={70} dataKey="value">
                {CROP_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, borderRadius: 8 }} />
            </PieChart>
          </div>
          <div className="space-y-1.5">
            {CROP_DATA.map(c => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: c.fill }} />
                <span className="flex-1 text-muted">{c.name}</span>
                <span className="font-semibold text-ink">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional risk */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card card-body">
          <h2 className="font-display text-base text-ink mb-4">Risiko per Wilayah</h2>
          <div className="space-y-2.5">
            {DEMO_RISK_DATA.slice(0, 5).map(r => (
              <div key={r.regionId} className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-28 flex-shrink-0">
                  <MapPin size={12} className="text-muted" />
                  <span className="text-sm font-semibold text-ink truncate">{r.regionName}</span>
                </div>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.score}%`, backgroundColor: r.color }} />
                </div>
                <RiskBadge badge={r.label} label={r.label} className="flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Farmer list */}
        <div className="card card-body">
          <h2 className="font-display text-base text-ink mb-4">Petani Binaan Terkini</h2>
          <div className="space-y-3">
            {[
              { name: 'Budi Santoso', village: 'Karanglo', crop: 'Padi', status: 'Aktif', risk: 'Aman' },
              { name: 'Siti Rahayu', village: 'Tegalrejo', crop: 'Cabai', status: 'Aktif', risk: 'Perlu Perhatian' },
              { name: 'Joko Widodo', village: 'Karanglo', crop: 'Padi', status: 'Aktif', risk: 'Aman' },
              { name: 'Agus Setiawan', village: 'Bayat', crop: 'Padi', status: 'Aktif', risk: 'Perlu Perhatian' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-padi-100 flex items-center justify-center text-padi-700 font-bold text-sm flex-shrink-0">
                  {f.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink">{f.name}</div>
                  <div className="text-xs text-muted">{f.village} · {f.crop}</div>
                </div>
                <RiskBadge badge={f.risk} label={f.risk} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast */}
      <div className="card card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base text-ink">Broadcast Pesan</h2>
          <button onClick={() => setShowBroadcast(true)} className="btn btn-primary btn-sm">
            <Send size={14} /> Kirim Broadcast
          </button>
        </div>

        {broadcastSent && (
          <div className="alert-success mb-4 animate-fade-in">
            <CheckCircle size={16} />
            <span className="text-sm font-semibold">Broadcast berhasil dikirim ke {broadcastSent.count} petani! (Demo)</span>
          </div>
        )}

        <div className="text-sm text-muted">
          Kirim pesan ke semua petani binaan melalui WhatsApp, SMS, atau notifikasi dalam aplikasi.
        </div>

        {showBroadcast && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="font-display text-lg text-ink">Kirim Broadcast</h3>
                <button onClick={() => setShowBroadcast(false)} className="text-muted hover:text-ink p-1">✕</button>
              </div>
              <form onSubmit={handleBroadcast} className="p-5 space-y-4">
                <div>
                  <label className="form-label">Judul Pesan</label>
                  <input type="text" value={broadcastForm.title} onChange={e => setBroadcastForm(f => ({...f, title: e.target.value}))} className="form-input" placeholder="Peringatan Cuaca" required />
                </div>
                <div>
                  <label className="form-label">Isi Pesan</label>
                  <textarea value={broadcastForm.message} onChange={e => setBroadcastForm(f => ({...f, message: e.target.value}))} className="form-input h-24 resize-none" placeholder="Tulis pesan broadcast..." required />
                </div>
                <div>
                  <div className="form-label">Channel Pengiriman</div>
                  {['in_app', 'whatsapp', 'sms'].map(ch => (
                    <label key={ch} className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                      <input type="checkbox" checked={broadcastForm.channels.includes(ch)} onChange={e => {
                        setBroadcastForm(f => ({...f, channels: e.target.checked ? [...f.channels, ch] : f.channels.filter(c => c !== ch)}));
                      }} className="accent-padi-500" />
                      {ch === 'in_app' ? 'In-App' : ch === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                    </label>
                  ))}
                </div>
                <div className="bg-surface rounded-lg p-3 text-xs text-muted">
                  Preview: Pesan akan dikirim ke <strong>184 petani</strong> di wilayah Klaten.
                </div>
                <button type="submit" className="btn btn-primary w-full justify-center">
                  <Send size={14} /> Kirim ke 184 Petani (Demo)
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

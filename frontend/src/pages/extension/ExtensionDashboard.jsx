import { useState, useEffect } from 'react';
import { Users, AlertTriangle, BarChart2, CheckCircle, MapPin, Send, X, Sparkles } from 'lucide-react';
import { RiskBadge } from '../../components/ui';
import { DEMO_RISK_DATA } from '../../data/mockData';
import { recommendationsAPI } from '../../services/api';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const STATS = [
  { label: 'Petani Binaan', value: '184', sub: 'Wilayah Binaan', icon: <Users size={20} />, color: 'emerald' },
  { label: 'Wilayah Berisiko', value: '3', sub: 'dari 9 wilayah pantauan', icon: <AlertTriangle size={20} />, color: 'amber' },
  { label: 'Potensi Cuaca Ekstrem', value: '8%', sub: 'Peringatan BMKG', icon: <BarChart2 size={20} />, color: 'rose' },
  { label: 'Petani Terhubung', value: '89%', sub: 'Platform live aktif', icon: <CheckCircle size={20} />, color: 'teal' },
];

const bgMap = {
  emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border border-rose-200',
  teal: 'bg-teal-50 text-teal-700 border border-teal-200',
};

const CROP_DATA = [
  { name: 'Padi', value: 67, fill: '#059669' },
  { name: 'Jagung', value: 15, fill: '#d97706' },
  { name: 'Cabai', value: 10, fill: '#e11d48' },
  { name: 'Kedelai', value: 4, fill: '#0d9488' },
  { name: 'Lainnya', value: 4, fill: '#7c3aed' },
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
  const [riskList, setRiskList] = useState(DEMO_RISK_DATA);
  const containerRef = useScrollReveal();

  useEffect(() => {
    const fetchLiveRisk = async () => {
      try {
        const response = await recommendationsAPI.getRiskMap();
        if (response.data && response.data.data && response.data.data.length > 0) {
          setRiskList(response.data.data);
        }
      } catch (e) {
        console.warn('Extension risk fetch notice:', e.message);
      }
    };
    fetchLiveRisk();
  }, []);

  const handleBroadcast = (e) => {
    e.preventDefault();
    setBroadcastSent({ count: 181, total: 184 });
    setTimeout(() => { setBroadcastSent(null); setShowBroadcast(false); }, 3000);
  };

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto text-[#09090b] page-enter">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
            <Sparkles size={12} />
            Command Center Penyuluh (PPL)
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#09090b] tracking-tight">Dashboard Penyuluh Pertanian</h1>
          <p className="text-[#71717a] text-sm mt-1">
            Monitoring dinamika iklim, kesiapan tanam kelompok tani, dan mitigasi risiko wilayah binaan.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          BMKG Live Feed
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 reveal-up">
        {STATS.map((s, i) => (
          <div key={i} className="rounded-2xl bg-white border border-[#e4e4e7] p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bgMap[s.color]}`}>
              {s.icon}
            </div>
            <div className="font-semibold text-2xl text-[#09090b]">{s.value}</div>
            <div className="text-xs font-medium text-[#09090b] mt-1">{s.label}</div>
            <div className="text-[11px] font-mono text-[#71717a] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6 reveal-up">
        {/* Activity chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-sm">
          <h2 className="font-medium text-base text-[#09090b] mb-4">Aktivitas Tanam & Panen Kelompok (6 Bulan)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717a' }} stroke="#e4e4e7" />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} stroke="#e4e4e7" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: 8, color: '#09090b', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              />
              <Bar dataKey="tanam" name="Tanam" fill="#059669" radius={[4,4,0,0]} />
              <Bar dataKey="panen" name="Panen" fill="#d97706" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crop distribution */}
        <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <h2 className="font-medium text-base text-[#09090b] mb-2">Distribusi Komoditas Lahan</h2>
          <div className="flex justify-center my-auto">
            <PieChart width={160} height={150}>
              <Pie data={CROP_DATA} cx={75} cy={70} innerRadius={42} outerRadius={68} dataKey="value">
                {CROP_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: 8, color: '#09090b', fontSize: 11 }} />
            </PieChart>
          </div>
          <div className="space-y-1.5 pt-3 border-t border-[#e4e4e7]">
            {CROP_DATA.map(c => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.fill }} />
                <span className="flex-1 text-[#71717a]">{c.name}</span>
                <span className="font-mono font-semibold text-[#09090b]">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Risk & Farmers List */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6 reveal-up">
        <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-base text-[#09090b]">Risiko per Wilayah (Live BMKG)</h2>
            <span className="text-[11px] font-mono text-emerald-700 font-medium">Sinkronisasi Realtime</span>
          </div>
          <div className="space-y-3">
            {riskList.slice(0, 6).map(r => (
              <div key={r.regionId} className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-32 flex-shrink-0">
                  <MapPin size={13} className="text-[#71717a]" />
                  <span className="text-sm font-medium text-[#09090b] truncate">{r.regionName}</span>
                </div>
                <div className="flex-1 h-2 bg-[#f4f4f5] rounded-full overflow-hidden border border-[#e4e4e7]">
                  <div className="h-full rounded-full transition-all" style={{ width: `${r.score}%`, backgroundColor: r.color }} />
                </div>
                <RiskBadge badge={r.label} label={r.label} className="flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Farmer list */}
        <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-sm">
          <h2 className="font-medium text-base text-[#09090b] mb-4">Petani Binaan Terkini</h2>
          <div className="space-y-3">
            {[
              { name: 'Budi Santoso', village: 'Karanglo', crop: 'Padi', status: 'Aktif', risk: 'Aman' },
              { name: 'Siti Rahayu', village: 'Tegalrejo', crop: 'Cabai', status: 'Aktif', risk: 'Perlu Perhatian' },
              { name: 'Joko Widodo', village: 'Karanglo', crop: 'Padi', status: 'Aktif', risk: 'Aman' },
              { name: 'Agus Setiawan', village: 'Bayat', crop: 'Padi', status: 'Aktif', risk: 'Perlu Perhatian' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fafafa] border border-[#e4e4e7] hover:border-emerald-200 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-semibold text-xs flex-shrink-0">
                  {f.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#09090b]">{f.name}</div>
                  <div className="text-xs text-[#71717a]">{f.village} · {f.crop}</div>
                </div>
                <RiskBadge badge={f.risk} label={f.risk} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Banner */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-sm reveal-up">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="font-medium text-lg text-[#09090b]">Siaran Peringatan & Panduan Musim</h2>
            <p className="text-xs text-[#71717a] mt-0.5">
              Kirim instruksi mitigasi cuaca serentak ke 184 petani binaan via WhatsApp, SMS, dan In-App.
            </p>
          </div>
          <button
            onClick={() => setShowBroadcast(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-all shadow-sm"
          >
            <Send size={14} />
            <span>Kirim Broadcast</span>
          </button>
        </div>

        {broadcastSent && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs animate-fade-in">
            <CheckCircle size={16} className="text-emerald-600" />
            <span className="font-medium">Broadcast berhasil didistribusikan ke {broadcastSent.count} petani!</span>
          </div>
        )}

        {showBroadcast && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white border border-[#e4e4e7] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
              <div className="p-5 border-b border-[#e4e4e7] flex items-center justify-between">
                <h3 className="font-medium text-lg text-[#09090b]">Siaran PPL ke Petani</h3>
                <button onClick={() => setShowBroadcast(false)} className="text-[#71717a] hover:text-[#09090b] p-1 rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleBroadcast} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#71717a] mb-1.5">Judul Siaran</label>
                  <input
                    type="text"
                    value={broadcastForm.title}
                    onChange={e => setBroadcastForm(f => ({...f, title: e.target.value}))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e4e4e7] text-[#09090b] focus:outline-none focus:border-emerald-500 text-sm"
                    placeholder="Peringatan Curah Hujan Dasarian"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#71717a] mb-1.5">Isi Pesan Instruksi</label>
                  <textarea
                    value={broadcastForm.message}
                    onChange={e => setBroadcastForm(f => ({...f, message: e.target.value}))}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e4e4e7] text-[#09090b] focus:outline-none focus:border-emerald-500 text-sm h-24 resize-none"
                    placeholder="Tuliskan arahan lapangan untuk kelompok tani..."
                    required
                  />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#71717a] mb-2">Saluran Penerima</div>
                  <div className="flex gap-4">
                    {['in_app', 'whatsapp', 'sms'].map(ch => (
                      <label key={ch} className="flex items-center gap-2 text-xs font-mono text-[#09090b] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={broadcastForm.channels.includes(ch)}
                          onChange={e => {
                            setBroadcastForm(f => ({...f, channels: e.target.checked ? [...f.channels, ch] : f.channels.filter(c => c !== ch)}));
                          }}
                          className="accent-emerald-600 rounded"
                        />
                        {ch === 'in_app' ? 'In-App' : ch === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bg-[#fafafa] rounded-xl p-3 text-[11px] text-[#71717a] border border-[#e4e4e7]">
                  Target: Pesan akan disiarkan ke <strong className="text-[#09090b]">184 petani</strong> di wilayah Klaten & sekitarnya.
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  <span>Kirim Broadcast Sekarang</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

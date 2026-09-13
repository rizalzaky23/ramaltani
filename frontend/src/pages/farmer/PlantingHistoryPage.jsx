import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { CheckCircle, XCircle, Leaf, Sparkles, TrendingUp } from 'lucide-react';
import { SectionHeader, DemoBadge } from '../../components/ui';
import { DEMO_PLANTING_HISTORY } from '../../data/mockData';

export default function PlantingHistoryPage() {
  const [history] = useState(DEMO_PLANTING_HISTORY);

  const avgYield = (history.reduce((s, h) => s + h.yieldPerHa, 0) / history.length).toFixed(2);
  const bestSeason = history.reduce((best, h) => h.yieldPerHa > best.yieldPerHa ? h : best, history[0]);
  const followedCount = history.filter(h => h.recommendationFollowed).length;
  const followedPct = Math.round((followedCount / history.length) * 100);

  const chartData = [...history].reverse().map(h => ({
    name: `MT ${h.plantingDate.slice(0, 7)}`,
    hasil: h.yieldPerHa,
    season: h.season,
    variety: h.varietyName,
    followed: h.recommendationFollowed,
  }));

  return (
    <div className="max-w-4xl mx-auto text-[#09090b] animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs uppercase tracking-widest mb-2">
            <Sparkles size={12} />
            Agronomic Ledger
          </div>
          <h1 className="font-medium text-2xl sm:text-3xl text-white font-normal">Riwayat Tanam & Hasil Panen</h1>
          <p className="text-[#71717a] text-sm mt-1">
            Catatan historis produktivitas lahan dan korelasi kepatuhan kalender tanam iklim.
          </p>
        </div>
        <DemoBadge />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Rata-rata Hasil', value: `${avgYield} ton/ha`, sub: 'Historis panen', color: 'text-emerald-400' },
          { label: 'Musim Terbaik', value: bestSeason.season, sub: `${bestSeason.yieldPerHa} ton/ha`, color: 'text-amber-400' },
          { label: 'Kepatuhan Rekomendasi', value: `${followedPct}%`, sub: `${followedCount} dari ${history.length} musim`, color: 'text-sky-400' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white border border-[#e4e4e7] p-5 text-center shadow-lg">
            <div className={`font-medium text-2xl sm:text-3xl font-normal ${s.color}`}>{s.value}</div>
            <div className="text-xs font-medium text-white mt-1.5">{s.label}</div>
            {s.sub && <div className="text-[11px] font-mono text-[#71717a] mt-0.5">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Yield chart */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 mb-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-lg text-white font-normal">Hasil Panen per Musim Tanam (ton/ha)</h2>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <TrendingUp size={14} /> Tren Positif
          </span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#717684' }} stroke="rgba(255,255,255,0.1)" />
            <YAxis tick={{ fontSize: 11, fill: '#717684' }} domain={[0, 8]} stroke="rgba(255,255,255,0.1)" />
            <Tooltip
              contentStyle={{ backgroundColor: '#13161C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 12 }}
              formatter={(v) => [`${v} ton/ha`, 'Hasil Panen']}
              labelFormatter={(l) => `Periode: ${l}`}
            />
            <ReferenceLine y={parseFloat(avgYield)} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Rata-rata', position: 'insideTopRight', fontSize: 10, fill: '#f59e0b' }} />
            <Bar dataKey="hasil" fill="url(#yieldGrad)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* History table */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#e4e4e7]">
          <h2 className="font-medium text-lg text-white font-normal">Riwayat Detail Penanaman</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" aria-label="Tabel riwayat tanam">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e4e4e7] text-[#71717a] font-mono text-[11px] uppercase tracking-wider">
                <th className="px-6 py-3.5">Musim</th>
                <th className="px-6 py-3.5">Varietas</th>
                <th className="px-6 py-3.5">Tanam</th>
                <th className="px-6 py-3.5">Panen</th>
                <th className="text-right px-6 py-3.5">Hasil</th>
                <th className="text-center px-6 py-3.5">Rekomendasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-[#fafafa]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">{h.season}</div>
                    <div className={`text-xs font-mono mt-0.5 ${h.weatherCondition === 'Baik' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      Cuaca: {h.weatherCondition}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-[#09090b]">
                      <Leaf size={13} className="text-emerald-400" aria-hidden="true" />
                      {h.varietyName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-[#71717a] whitespace-nowrap">
                    {new Date(h.plantingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-[#71717a] whitespace-nowrap">
                    {new Date(h.harvestDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold font-mono text-emerald-400">{h.yieldPerHa} t/ha</div>
                    <div className="text-xs text-[#71717a]">{h.yieldTon} ton total</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {h.recommendationFollowed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <CheckCircle size={12} /> Diikuti
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-[#f4f4f5] border border-[#e4e4e7] text-[#71717a]">
                        <XCircle size={12} /> Tidak
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

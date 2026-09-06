import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { CheckCircle, XCircle, Leaf } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto">
      <SectionHeader
        title="Riwayat Tanam"
        subtitle="Catatan penanaman dan hasil panen Anda"
        action={<DemoBadge />}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Rata-rata Hasil', value: `${avgYield} ton/ha`, color: 'text-padi-600' },
          { label: 'Musim Terbaik', value: bestSeason.season, sub: `${bestSeason.yieldPerHa} ton/ha`, color: 'text-panen-600' },
          { label: 'Ikuti Rekomendasi', value: `${followedPct}%`, sub: `${followedCount} dari ${history.length}`, color: 'text-langit-600' },
        ].map((s, i) => (
          <div key={i} className="card card-body text-center py-5">
            <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs font-semibold text-ink mt-1">{s.label}</div>
            {s.sub && <div className="text-xs text-muted">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Yield chart */}
      <div className="card card-body mb-6">
        <h2 className="font-display text-base text-ink mb-4">Hasil Panen per Musim Tanam (ton/ha)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6E9F43" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#6E9F43" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECE9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B756D' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6B756D' }} domain={[0, 8]} />
            <Tooltip
              contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, borderRadius: 8, border: '1px solid #D8DED9' }}
              formatter={(v, n, p) => [`${v} ton/ha`, 'Hasil Panen']}
              labelFormatter={(l) => `Periode: ${l}`}
            />
            <ReferenceLine y={parseFloat(avgYield)} stroke="#D8A83E" strokeDasharray="5 5" label={{ value: 'Rata-rata', position: 'insideTopRight', fontSize: 10, fill: '#D8A83E' }} />
            <Bar dataKey="hasil" fill="url(#yieldGrad)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* History table */}
      <div className="card overflow-hidden">
        <div className="card-body pb-0">
          <h2 className="font-display text-base text-ink mb-4">Riwayat Detail</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Tabel riwayat tanam">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left text-xs font-semibold text-muted px-6 py-3">Musim</th>
                <th className="text-left text-xs font-semibold text-muted px-6 py-3">Varietas</th>
                <th className="text-left text-xs font-semibold text-muted px-6 py-3">Tanam</th>
                <th className="text-left text-xs font-semibold text-muted px-6 py-3">Panen</th>
                <th className="text-right text-xs font-semibold text-muted px-6 py-3">Hasil</th>
                <th className="text-center text-xs font-semibold text-muted px-6 py-3">Rekomendasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((h, i) => (
                <tr key={h.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-ink">{h.season}</div>
                    <div className={`text-xs font-medium mt-0.5 ${h.weatherCondition === 'Baik' ? 'text-padi-600' : 'text-panen-600'}`}>
                      Cuaca: {h.weatherCondition}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-ink">
                      <Leaf size={13} className="text-padi-500" aria-hidden="true" />
                      {h.varietyName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                    {new Date(h.plantingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                    {new Date(h.harvestDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-padi-600">{h.yieldPerHa} t/ha</div>
                    <div className="text-xs text-muted">{h.yieldTon} ton total</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {h.recommendationFollowed ? (
                      <span className="flex items-center justify-center gap-1 text-padi-600 text-xs font-semibold">
                        <CheckCircle size={14} aria-hidden="true" /> Diikuti
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1 text-muted text-xs font-semibold">
                        <XCircle size={14} aria-hidden="true" /> Tidak
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

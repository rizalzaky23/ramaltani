import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { DEMO_PLANTING_HISTORY } from '../../data/mockData';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function PlantingHistoryPage() {
  const [history] = useState(DEMO_PLANTING_HISTORY);
  const containerRef = useScrollReveal();

  const avgYield = (history.reduce((s, h) => s + h.yieldPerHa, 0) / history.length).toFixed(2);
  const bestSeason = history.reduce((best, h) => h.yieldPerHa > best.yieldPerHa ? h : best, history[0]);
  const followedCount = history.filter(h => h.recommendationFollowed).length;
  const followedPct = Math.round((followedCount / history.length) * 100);
  const totalYield = history.reduce((s, h) => s + h.yieldTon, 0).toFixed(1);

  const chartData = [...history].reverse().map(h => ({
    name: `MT ${h.plantingDate.slice(0, 7)}`,
    hasil: h.yieldPerHa,
    season: h.season,
    variety: h.varietyName,
    followed: h.recommendationFollowed,
  }));

  return (
    <div ref={containerRef} className="text-[#09090b] page-enter">
      {/* Editorial Page Header — Clean, Evasion-style */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-3">
          Historis Produktivitas · Musim Tanam 2024–2026
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#09090b] leading-[1.08]">
          Riwayat Tanam & Hasil Panen
        </h1>
        <p className="text-base sm:text-lg text-[#71717a] mt-3 max-w-2xl leading-relaxed">
          Evaluasi produktivitas per musim tanam, korelasi dengan dinamika iklim BMKG, serta konsistensi kepatuhan kalender tanam adaptif.
        </p>
      </div>

      {/* Signature Evasion 4-Column Border-Divided Specs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-y border-[#e4e4e7] divide-y md:divide-y-0 md:divide-x divide-[#e4e4e7] my-10 bg-white reveal-up">
        <div className="p-6 sm:p-8 text-center">
          <p className="text-xs uppercase tracking-widest text-[#71717a] mb-2 font-medium">Rata-rata Hasil</p>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#09090b]">
            {avgYield} <span className="text-sm font-normal text-[#71717a]">ton/ha</span>
          </p>
          <p className="text-xs text-emerald-700 font-mono mt-2 font-medium">Di atas standar daerah</p>
        </div>

        <div className="p-6 sm:p-8 text-center">
          <p className="text-xs uppercase tracking-widest text-[#71717a] mb-2 font-medium">Musim Terbaik</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-[#09090b]">
            {bestSeason.season.replace('Musim Tanam ', 'MT ')}
          </p>
          <p className="text-xs text-[#71717a] font-mono mt-2">{bestSeason.yieldPerHa} t/ha ({bestSeason.varietyName})</p>
        </div>

        <div className="p-6 sm:p-8 text-center">
          <p className="text-xs uppercase tracking-widest text-[#71717a] mb-2 font-medium">Kepatuhan Rekomendasi</p>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-emerald-700">
            {followedPct}<span className="text-2xl font-light">%</span>
          </p>
          <p className="text-xs text-[#71717a] font-mono mt-2">{followedCount} dari {history.length} musim diikuti</p>
        </div>

        <div className="p-6 sm:p-8 text-center">
          <p className="text-xs uppercase tracking-widest text-[#71717a] mb-2 font-medium">Total Akumulasi</p>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#09090b]">
            {totalYield} <span className="text-sm font-normal text-[#71717a]">ton</span>
          </p>
          <p className="text-xs text-[#71717a] font-mono mt-2">{history.length} siklus panen tercatat</p>
        </div>
      </div>

      {/* Productivity Chart Section */}
      <div className="my-12 reveal-up">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 border-b border-[#e4e4e7] pb-3 gap-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1">Dinamika Hasil Panen</p>
            <h2 className="text-2xl font-medium tracking-tight text-[#09090b]">Produktivitas per Musim (ton/ha)</h2>
          </div>
          <span className="text-xs font-mono text-emerald-700 font-medium">Garis oranye: Ambang rata-rata historis ({avgYield} t/ha)</span>
        </div>

        <div className="rounded-2xl border border-[#e4e4e7] bg-white p-6 sm:p-8 shadow-xs">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.25} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#71717a' }} stroke="#e4e4e7" axisLine={{ stroke: '#e4e4e7' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#71717a' }} domain={[0, 8]} stroke="#e4e4e7" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: 8, color: '#09090b', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                formatter={(v) => [`${v} ton/ha`, 'Hasil Panen']}
                labelFormatter={(l) => `Siklus: ${l}`}
              />
              <ReferenceLine y={parseFloat(avgYield)} stroke="#d97706" strokeDasharray="4 4" label={{ value: `Rata-rata (${avgYield})`, position: 'insideTopRight', fontSize: 10, fill: '#d97706' }} />
              <Bar dataKey="hasil" fill="url(#yieldGrad)" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Field Ledger Detail Table — Clean Minimalist Evasion Style */}
      <div className="my-12 reveal-up">
        <div className="mb-4 border-b border-[#e4e4e7] pb-3">
          <p className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1">Buku Catatan Lapangan</p>
          <h2 className="text-2xl font-medium tracking-tight text-[#09090b]">Riwayat Detail Penanaman</h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#e4e4e7] bg-white shadow-xs">
          <table className="w-full text-left" aria-label="Tabel detail riwayat tanam">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e4e4e7] text-[#71717a] font-mono text-[11px] uppercase tracking-wider">
                <th className="px-6 py-4">Musim Tanam</th>
                <th className="px-6 py-4">Varietas</th>
                <th className="px-6 py-4">Tanggal Tanam</th>
                <th className="px-6 py-4">Tanggal Panen</th>
                <th className="text-right px-6 py-4">Produktivitas</th>
                <th className="text-center px-6 py-4">Status BMKG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e4e7] text-sm">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#09090b]">{h.season}</div>
                    <div className="text-xs text-[#71717a] mt-0.5">Cuaca: {h.weatherCondition}</div>
                  </td>
                  <td className="px-6 py-4 text-[#09090b] font-medium">
                    {h.varietyName}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-[#71717a] whitespace-nowrap">
                    {new Date(h.plantingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-[#71717a] whitespace-nowrap">
                    {new Date(h.harvestDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-semibold text-emerald-700 font-mono">{h.yieldPerHa} t/ha</div>
                    <div className="text-xs text-[#71717a]">{h.yieldTon} ton total</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {h.recommendationFollowed ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Sesuai Panduan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#71717a] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa]" />
                        Mandiri
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

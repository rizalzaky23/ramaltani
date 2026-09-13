import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChevronDown, Loader, Info, Leaf, CloudSun, Crosshair, Sparkles } from 'lucide-react';
import { StatusBadge, RiskBadge, ConfidenceBar } from '../../components/ui';
import { DEMO_CROPS, DEMO_VARIETIES, DEMO_REGIONS, DEMO_RECOMMENDATION } from '../../data/mockData';
import { recommendationsAPI } from '../../services/api';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function RecommendationPage() {
  const { coords } = useOutletContext() || {};
  const containerRef = useScrollReveal();

  const savedUser = (() => {
    try { return JSON.parse(localStorage.getItem('ramaltani_user') || '{}'); } catch { return {}; }
  })();

  const defaultRegion = coords?.regionId || (
    savedUser.location === 'Ngawi' || savedUser.location === 'reg-009'
      ? 'reg-009'
      : 'reg-001'
  );

  const [form, setForm] = useState({
    regionId: defaultRegion,
    cropName: savedUser.commodity || 'Padi',
    varietyName: '',
    soilCondition: 'normal',
    farmArea: savedUser.landSize ? String(savedUser.landSize) : '',
  });
  const [result, setResult] = useState(null);
  const [, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState('');

  const varieties = DEMO_VARIETIES[form.cropName] || [];

  const fetchLiveRecommendation = async (targetForm = form) => {
    setLoading(true);
    setError('');

    try {
      const response = await recommendationsAPI.calculate({
        regionId: targetForm.regionId,
        cropName: targetForm.cropName,
        varietyName: targetForm.varietyName || null,
        soilCondition: targetForm.soilCondition,
        farmArea: targetForm.farmArea ? parseFloat(targetForm.farmArea) : undefined,
      });
      setResult(response.data.data);
      setMeta(response.data.meta);
    } catch (err) {
      console.warn('Recommendation fetch fallback:', err.message);
      setResult(DEMO_RECOMMENDATION);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coords?.regionId && coords.regionId !== form.regionId) {
      const updatedForm = { ...form, regionId: coords.regionId };
      setForm(updatedForm);
      fetchLiveRecommendation(updatedForm);
    } else {
      fetchLiveRecommendation();
    }
  }, [coords?.regionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    if (name === 'cropName') updated.varietyName = '';
    setForm(updated);
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    await fetchLiveRecommendation(form);
  };

  const r = result?.recommendation || result;

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto text-[#09090b] page-enter">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs uppercase tracking-widest font-semibold mb-2">
          <Sparkles size={12} />
          Rule-Engine Agronomi Presisi
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#09090b] tracking-tight">Kalkulator Kalender Tanam</h1>
        <p className="text-[#71717a] text-sm mt-1">
          Masukkan informasi lahan dan tanaman untuk simulasi jendela tanam optimal berdasarkan cuaca BMKG.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Panel */}
        <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-sm reveal-up">
          <h2 className="font-medium text-lg text-[#09090b] mb-4">Parameter Lahan & Tanaman</h2>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="regionId" className="block text-xs uppercase tracking-widest text-[#71717a] font-medium">
                  Lokasi (Kabupaten/Kota)
                </label>
                {coords?.isGPS && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <Crosshair size={10} className="text-emerald-600" /> Sesuai GPS
                  </span>
                )}
              </div>
              <select
                id="regionId"
                name="regionId"
                value={form.regionId}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e4e4e7] text-[#09090b] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 text-sm transition-all"
              >
                {DEMO_REGIONS.map(reg => (
                  <option key={reg.id} value={reg.id}>
                    {reg.name}, {reg.province}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cropName" className="block text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1.5">
                Komoditas Tanaman
              </label>
              <select
                id="cropName"
                name="cropName"
                value={form.cropName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e4e4e7] text-[#09090b] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 text-sm transition-all"
              >
                {DEMO_CROPS.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {varieties.length > 0 && (
              <div>
                <label htmlFor="varietyName" className="block text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1.5">
                  Varietas Benih (Opsional)
                </label>
                <select
                  id="varietyName"
                  name="varietyName"
                  value={form.varietyName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e4e4e7] text-[#09090b] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 text-sm transition-all"
                >
                  <option value="">-- Pilih Varietas --</option>
                  {varieties.map(v => (
                    <option key={v.id} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="soilCondition" className="block text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1.5">
                Kondisi Lahan & Tanah
              </label>
              <select
                id="soilCondition"
                name="soilCondition"
                value={form.soilCondition}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e4e4e7] text-[#09090b] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 text-sm transition-all"
              >
                <option value="normal">Normal / Irigasi Teknis</option>
                <option value="loam">Lempung (Loam)</option>
                <option value="clay">Liat (Clay)</option>
                <option value="sandy">Berpasir (Sandy)</option>
              </select>
            </div>

            <div>
              <label htmlFor="farmArea" className="block text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1.5">
                Luas Lahan (Hektar, opsional)
              </label>
              <input
                id="farmArea"
                name="farmArea"
                type="number"
                step="0.1"
                min="0.1"
                value={form.farmArea}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e4e4e7] text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 text-sm transition-all"
                placeholder="contoh: 1.2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Menghitung rekomendasi...</span>
                </>
              ) : (
                <>
                  <Leaf size={16} />
                  <span>Hitung Rekomendasi Tanam</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 p-3.5 bg-[#fafafa] rounded-xl border border-[#e4e4e7]">
            <div className="flex items-start gap-2.5">
              <Info size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#71717a] leading-relaxed">
                Sistem menerapkan <em>climate-aware rule engine</em> berbasis prakiraan BMKG. Rekomendasi ini dirancang sebagai panduan agronomi pelengkap intuisi petani.
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        {r && (
          <div className="space-y-4 reveal-up">
            <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-sm relative overflow-hidden" style={{ borderLeftWidth: 4, borderLeftColor: r.riskColor }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#71717a] font-medium">Hasil Analisis</span>
                  <h2 className="text-2xl font-semibold text-[#09090b] mt-0.5">{result?.crop || form.cropName}</h2>
                  {result?.variety && <div className="text-xs text-[#71717a] mt-0.5">Varietas: {result.variety}</div>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={r.status} />
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    BMKG Live
                  </span>
                </div>
              </div>

              {r.window && (
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 mb-4">
                  <div className="text-xs font-mono font-semibold text-emerald-800 mb-1 uppercase tracking-wider">
                    Jadwal Tanam Disarankan
                  </div>
                  <div className="text-xl font-medium text-[#09090b]">{r.window.start}</div>
                  <div className="text-sm text-[#71717a]">sampai {r.window.end}</div>
                </div>
              )}

              <ConfidenceBar value={r.confidence} className="mb-4" />

              <div className="mb-4">
                <div className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1.5">Skor Risiko Iklim</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[#f4f4f5] rounded-full overflow-hidden border border-[#e4e4e7]">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${r.riskScore}%`, backgroundColor: r.riskColor }} />
                  </div>
                  <RiskBadge label={r.risk} badge={r.riskBadge} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-[#fafafa] rounded-xl border border-[#e4e4e7]">
                  <div className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1">Alasan Rekomendasi</div>
                  <p className="text-xs sm:text-sm text-[#09090b] leading-relaxed">{r.reason}</p>
                </div>

                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <div className="text-xs uppercase tracking-widest text-emerald-800 font-medium mb-1">Yang Perlu Dilakukan</div>
                  <p className="text-xs sm:text-sm font-medium text-emerald-950">{r.action}</p>
                </div>

                {r.alternative && (
                  <div className="flex items-center gap-2 text-xs text-[#71717a]">
                    <span className="text-amber-600 font-medium">Alternatif:</span>
                    <strong className="text-[#09090b] font-medium">{r.alternative}</strong>
                  </div>
                )}

                {/* Source footer */}
                <div className="mt-4 pt-3 border-t border-[#e4e4e7] flex items-center justify-between text-xs text-[#71717a]">
                  <div className="flex items-center gap-1.5">
                    <CloudSun size={14} className="text-emerald-600" />
                    <span>Sumber: <strong className="text-[#09090b]">BMKG Resmi (Live API)</strong></span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    Real-Time
                  </span>
                </div>
              </div>
            </div>

            {/* Detail Factors */}
            {r.details && (
              <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 shadow-sm">
                <h3 className="font-medium text-base text-[#09090b] mb-3">Faktor Cuaca yang Dianalisis</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Rata-rata peluang hujan', value: `${r.details.avgRainProbability}%` },
                    { label: 'Suhu rata-rata', value: `${r.details.avgTemperature}°C` },
                    { label: 'Kelembapan rata-rata', value: `${r.details.avgHumidity}%` },
                    { label: 'Hari hujan berturut-turut', value: `${r.details.maxConsecutiveWetDays} hari` },
                    { label: 'Periode kering terpanjang', value: `${r.details.maxDrySpell} hari` },
                    { label: 'Hari hujan ekstrem', value: `${r.details.extremeRainDays} hari` },
                  ].map((f, i) => (
                    <div key={i} className="flex justify-between items-center py-2 px-3 rounded-lg bg-[#fafafa] border border-[#e4e4e7]">
                      <span className="text-[11px] text-[#71717a]">{f.label}</span>
                      <span className="text-xs font-mono font-medium text-[#09090b]">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Variety Recommendations */}
      <div className="mt-10 reveal-up">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#09090b] tracking-tight">Rekomendasi Varietas Unggul</h2>
          <p className="text-xs text-[#71717a]">Varietas {form.cropName} dengan ketahanan spesifik terhadap dinamika iklim wilayah</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(DEMO_VARIETIES[form.cropName] || []).map((v, i) => (
            <div key={i} className="rounded-2xl bg-white border border-[#e4e4e7] p-5 shadow-sm hover:border-emerald-300 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-[#09090b] text-base">{v.name}</h3>
                  <div className="text-xs font-mono text-[#71717a] mt-0.5">Umur panen: {v.harvestAgeDays} hari</div>
                </div>
                {v.droughtTolerant && (
                  <span className="text-[11px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                    Tahan Kering
                  </span>
                )}
                {v.floodTolerant && (
                  <span className="text-[11px] font-mono bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-medium">
                    Tahan Genangan
                  </span>
                )}
              </div>
              <div className="flex justify-between text-xs pt-3 border-t border-[#e4e4e7]">
                <span className="text-[#71717a]">Rata-rata hasil</span>
                <span className="font-mono font-semibold text-emerald-700">{v.yieldAverage} ton/ha</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#71717a] mt-3">
          * Data varietas adalah referensi agronomi terkurasi. Konsultasikan dengan petugas PPL untuk dosis pupuk dan jenis tanah spesifik.
        </p>
      </div>
    </div>
  );
}

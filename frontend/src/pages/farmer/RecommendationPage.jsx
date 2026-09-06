import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, ChevronDown, Loader, Info, Leaf, CloudSun } from 'lucide-react';
import { StatusBadge, RiskBadge, ConfidenceBar, SectionHeader, LiveBMKGBadge } from '../../components/ui';
import { DEMO_CROPS, DEMO_VARIETIES, DEMO_REGIONS, DEMO_RECOMMENDATION } from '../../data/mockData';
import { recommendationsAPI, weatherAPI } from '../../services/api';

export default function RecommendationPage() {
  const savedUser = (() => {
    try { return JSON.parse(localStorage.getItem('ramaltani_user') || '{}'); } catch { return {}; }
  })();

  const defaultRegion = savedUser.location === 'Ngawi' || savedUser.location === 'reg-009'
    ? 'reg-009'
    : 'reg-001';

  const [form, setForm] = useState({
    regionId: defaultRegion,
    cropName: savedUser.commodity || 'Padi',
    varietyName: '',
    soilCondition: 'normal',
    farmArea: savedUser.landSize ? String(savedUser.landSize) : '',
  });
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    fetchLiveRecommendation();
  }, []);

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
    <div className="max-w-4xl mx-auto">
      <SectionHeader
        title="Rekomendasi Tanam"
        subtitle="Masukkan informasi lahan dan tanaman untuk mendapatkan rekomendasi waktu tanam"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card card-body">
          <h2 className="font-display text-lg text-ink mb-4">Data Lahan & Tanaman</h2>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label htmlFor="regionId" className="form-label">Lokasi (Kabupaten/Kota)</label>
              <select id="regionId" name="regionId" value={form.regionId} onChange={handleChange} className="form-select">
                {DEMO_REGIONS.map(r => (
                  <option key={r.id} value={r.id}>{r.name}, {r.province}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="cropName" className="form-label">Tanaman</label>
              <select id="cropName" name="cropName" value={form.cropName} onChange={handleChange} className="form-select">
                {DEMO_CROPS.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {varieties.length > 0 && (
              <div>
                <label htmlFor="varietyName" className="form-label">Varietas (Opsional)</label>
                <select id="varietyName" name="varietyName" value={form.varietyName} onChange={handleChange} className="form-select">
                  <option value="">-- Pilih Varietas --</option>
                  {varieties.map(v => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="soilCondition" className="form-label">Kondisi Lahan</label>
              <select id="soilCondition" name="soilCondition" value={form.soilCondition} onChange={handleChange} className="form-select">
                <option value="normal">Normal / Irigasi Teknis</option>
                <option value="loam">Lempung (Loam)</option>
                <option value="clay">Liat (Clay)</option>
                <option value="sandy">Berpasir (Sandy)</option>
              </select>
            </div>

            <div>
              <label htmlFor="farmArea" className="form-label">Luas Lahan (ha, opsional)</label>
              <input
                id="farmArea" name="farmArea" type="number" step="0.1" min="0.1"
                value={form.farmArea} onChange={handleChange}
                className="form-input" placeholder="contoh: 1.2"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
              {loading ? (
                <><Loader size={16} className="animate-spin" /> Menghitung rekomendasi...</>
              ) : (
                <><Leaf size={16} /> Hitung Rekomendasi</>
              )}
            </button>
          </form>

          <div className="mt-4 p-3 bg-surface rounded-xl border border-border">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-muted flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted leading-relaxed">
                Sistem menggunakan prakiraan cuaca dari BMKG dan menerapkan{' '}
                <em>climate-aware rule engine</em> untuk menghitung risiko. Bukan model AI/ML.
                Rekomendasi ini bersifat panduan, bukan jaminan hasil panen.
              </p>
            </div>
          </div>
        </div>

        {/* Result */}
        {r && (
          <div className="space-y-4 animate-slide-up">
            <div className="card border-l-4" style={{ borderLeftColor: r.riskColor }}>
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-semibold text-muted uppercase tracking-wide">Hasil Rekomendasi</span>
                    <h2 className="font-display text-2xl text-ink mt-0.5">{result.crop}</h2>
                    {result.variety && <div className="text-sm text-muted">Varietas: {result.variety}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={r.status} />
                    <LiveBMKGBadge text="BMKG Resmi (Live)" />
                  </div>
                </div>

                {r.window && (
                  <div className="p-4 bg-padi-50 rounded-xl border border-padi-100 mb-4">
                    <div className="text-xs font-semibold text-padi-600 mb-1 uppercase tracking-wide">Waktu Tanam Disarankan</div>
                    <div className="font-display text-xl text-padi-800">{r.window.start}</div>
                    <div className="font-display text-lg text-padi-600">sampai {r.window.end}</div>
                  </div>
                )}

                <ConfidenceBar value={r.confidence} className="mb-4" />

                <div className="mb-3">
                  <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Skor Risiko</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${r.riskScore}%`, backgroundColor: r.riskColor }} />
                    </div>
                    <RiskBadge label={r.risk} badge={r.riskBadge} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Alasan Rekomendasi</div>
                    <p className="text-sm text-ink leading-relaxed">{r.reason}</p>
                  </div>

                  <div className="p-3 bg-padi-50 rounded-lg border border-padi-100">
                    <div className="text-xs font-semibold text-padi-700 mb-1">Yang Perlu Dilakukan</div>
                    <p className="text-sm font-medium text-ink">{r.action}</p>
                  </div>

                  {r.alternative && (
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <AlertTriangle size={12} className="text-panen-500" />
                      <span>Alternatif: <strong>{r.alternative}</strong></span>
                    </div>
                  )}

                  {/* Live BMKG Source Bar */}
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
                    <div className="flex items-center gap-1.5">
                      <CloudSun size={14} className="text-emerald-600" />
                      <span>Sumber Cuaca: <strong className="text-ink">BMKG Resmi (Live API)</strong></span>
                    </div>
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">Real-Time Aktif</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail factors */}
            {r.details && (
              <div className="card card-body">
                <h3 className="font-display text-base text-ink mb-3">Faktor Cuaca yang Dianalisis</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Rata-rata peluang hujan', value: `${r.details.avgRainProbability}%` },
                    { label: 'Suhu rata-rata', value: `${r.details.avgTemperature}°C` },
                    { label: 'Kelembapan rata-rata', value: `${r.details.avgHumidity}%` },
                    { label: 'Hari hujan berturut-turut', value: `${r.details.maxConsecutiveWetDays} hari` },
                    { label: 'Periode kering terpanjang', value: `${r.details.maxDrySpell} hari` },
                    { label: 'Hari hujan ekstrem', value: `${r.details.extremeRainDays} hari` },
                  ].map((f, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                      <span className="text-xs text-muted">{f.label}</span>
                      <span className="text-xs font-semibold text-ink">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Variety recommendations */}
      <div className="mt-8">
        <SectionHeader
          title="Rekomendasi Varietas"
          subtitle={`Varietas ${form.cropName} yang sesuai dengan kondisi wilayah Anda`}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(DEMO_VARIETIES[form.cropName] || []).map((v, i) => (
            <div key={i} className="card card-body">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-ink">{v.name}</h3>
                  <div className="text-xs text-muted">Umur panen: {v.harvestAgeDays} hari</div>
                </div>
                {v.droughtTolerant && (
                  <span className="text-xs bg-panen-50 text-panen-700 border border-panen-200 px-2 py-0.5 rounded-full font-semibold">
                    Tahan Kering
                  </span>
                )}
                {v.floodTolerant && (
                  <span className="text-xs bg-langit-50 text-langit-700 border border-langit-200 px-2 py-0.5 rounded-full font-semibold">
                    Tahan Genangan
                  </span>
                )}
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Rata-rata hasil</span>
                <span className="font-bold text-padi-600">{v.yieldAverage} ton/ha</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3">
          * Data varietas adalah referensi demo. Konsultasikan dengan penyuluh pertanian untuk rekomendasi yang sesuai kondisi lahan setempat.
        </p>
      </div>
    </div>
  );
}

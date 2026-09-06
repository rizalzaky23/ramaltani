import { useState } from 'react';
import { Navigation, Crosshair, MapPin, CheckCircle2, ShieldCheck, X, AlertCircle, Loader2 } from 'lucide-react';
import { DEMO_REGIONS } from '../data/mockData';

export default function GPSLocationModal({
  isOpen,
  onClose,
  coords,
  onDetectGPS,
  onSelectManual,
  loading,
  error,
}) {
  const [selectedRegionId, setSelectedRegionId] = useState(coords?.regionId || 'reg-009');
  const [isManualMode, setIsManualMode] = useState(false);

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    onSelectManual(selectedRegionId);
    onClose();
  };

  const handleGPSClick = async () => {
    const res = await onDetectGPS();
    if (res) {
      setTimeout(() => {
        onClose();
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide">
              <Navigation size={13} className="animate-pulse" />
              Sistem Penentu Posisi Lahan (GPS)
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup dialog"
            >
              <X size={18} />
            </button>
          </div>

          <h2 className="font-display text-2xl font-bold mt-4 tracking-tight">
            Sinkronkan Lokasi Lahan Anda
          </h2>
          <p className="text-emerald-100 text-sm mt-1.5 leading-relaxed font-body">
            RamalTani membutuhkan koordinat posisi Anda untuk menampilkan data cuaca mikro resmi BMKG dan rekomendasi tanam yang paling presisi.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 font-body">
          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {coords?.isGPS && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  Koordinat GPS Terkunci
                </span>
                <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md text-[11px]">
                  Akurasi: ±{coords.accuracy}m
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[11px]">Lintang (Lat):</span>
                  <span className="font-mono font-medium">{coords.latitude.toFixed(6)}°</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Bujur (Lon):</span>
                  <span className="font-mono font-medium">{coords.longitude.toFixed(6)}°</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-emerald-200/60 text-xs text-emerald-900 flex items-center justify-between">
                <span>Stasiun BMKG Terdekat: <strong>{coords.regionName}</strong></span>
                {coords.distanceKm > 0 && <span className="text-slate-500 text-[11px]">(~{coords.distanceKm} km)</span>}
              </div>
            </div>
          )}

          {!isManualMode ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGPSClick}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Mendeteksi Koordinat Satelit GPS...
                  </>
                ) : (
                  <>
                    <Crosshair size={18} />
                    Izinkan & Deteksi Lokasi Otomatis (GPS)
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setIsManualMode(true)}
                  className="text-xs text-slate-500 hover:text-emerald-700 font-medium transition-colors inline-flex items-center gap-1"
                >
                  <MapPin size={13} />
                  Atau pilih wilayah pertanian manual
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Lewati untuk sekarang
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label htmlFor="manualRegion" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pilih Wilayah Pertanian / Sentra Tani
                </label>
                <select
                  id="manualRegion"
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  className="w-full text-sm py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                >
                  {DEMO_REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}, {r.province}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  Simpan Wilayah Pilihan
                </button>
                <button
                  type="button"
                  onClick={() => setIsManualMode(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Kembali ke GPS
                </button>
              </div>
            </form>
          )}

          {/* Privacy note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
            <span>Koordinat lokasi hanya digunakan secara privat di perangkat untuk kalkulasi cuaca BMKG.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#13161C] text-[#F2F3F5] rounded-3xl shadow-2xl border border-white/15 overflow-hidden">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#161922] to-emerald-900 p-6 border-b border-white/10 text-white">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-mono text-emerald-400">
              <Navigation size={13} className="animate-pulse" />
              Sistem Penentu Posisi Lahan (GPS)
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#A7ABB3] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup dialog"
            >
              <X size={18} />
            </button>
          </div>

          <h2 className="font-display text-2xl font-medium mt-4 tracking-tight text-white">
            Sinkronkan Lokasi Lahan Anda
          </h2>
          <p className="text-[#A7ABB3] text-sm mt-1.5 leading-relaxed font-body">
            RamalTani membutuhkan koordinat posisi Anda untuk menampilkan data cuaca mikro resmi BMKG dan rekomendasi tanam yang paling presisi.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 font-body">
          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
              <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {coords?.isGPS && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  Koordinat GPS Terkunci
                </span>
                <span className="text-emerald-400 font-mono bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[11px]">
                  Akurasi: ±{coords.accuracy}m
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#F2F3F5]">
                <div>
                  <span className="text-[#A7ABB3] block text-[11px] font-mono">Lintang (Lat):</span>
                  <span className="font-mono font-medium">{coords.latitude.toFixed(6)}°</span>
                </div>
                <div>
                  <span className="text-[#A7ABB3] block text-[11px] font-mono">Bujur (Lon):</span>
                  <span className="font-mono font-medium">{coords.longitude.toFixed(6)}°</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between font-mono">
                <span>Stasiun BMKG: <strong>{coords.regionName}</strong></span>
                {coords.distanceKm > 0 && <span className="text-[#A7ABB3] text-[11px]">(~{coords.distanceKm} km)</span>}
              </div>
            </div>
          )}

          {!isManualMode ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGPSClick}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-xl shadow-emerald-950 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
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
                  className="text-xs text-[#A7ABB3] hover:text-emerald-400 font-medium transition-colors inline-flex items-center gap-1 font-mono"
                >
                  <MapPin size={13} />
                  Atau pilih wilayah pertanian manual
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#A7ABB3]/60 hover:text-[#A7ABB3] transition-colors font-mono"
                >
                  Lewati sekarang
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label htmlFor="manualRegion" className="block text-xs font-mono uppercase tracking-wider text-[#A7ABB3] mb-1.5">
                  Pilih Wilayah Pertanian / Sentra Tani
                </label>
                <select
                  id="manualRegion"
                  value={selectedRegionId}
                  onChange={(e) => setSelectedRegionId(e.target.value)}
                  className="w-full text-sm py-2.5 px-3 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500 bg-[#161922] text-white"
                >
                  {DEMO_REGIONS.map((r) => (
                    <option key={r.id} value={r.id} className="bg-[#161922] text-white">
                      {r.name}, {r.province}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-[#ededed] text-black text-xs font-semibold transition-colors shadow-md"
                >
                  Simpan Wilayah Pilihan
                </button>
                <button
                  type="button"
                  onClick={() => setIsManualMode(false)}
                  className="py-2.5 px-4 rounded-xl border border-white/10 text-[#A7ABB3] hover:text-white text-xs font-semibold hover:bg-white/5 transition-colors"
                >
                  Kembali ke GPS
                </button>
              </div>
            </form>
          )}

          {/* Privacy note */}
          <div className="flex items-center gap-2 text-[11px] text-[#A7ABB3] pt-3 border-t border-white/10 font-mono">
            <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0" />
            <span>Koordinat lokasi hanya diproses privat di browser untuk query BMKG.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

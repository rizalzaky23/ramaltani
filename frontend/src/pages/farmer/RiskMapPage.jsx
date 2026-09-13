import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Crosshair, Sparkles } from 'lucide-react';
import { RiskBadge } from '../../components/ui';
import { DEMO_RISK_DATA } from '../../data/mockData';
import { recommendationsAPI } from '../../services/api';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function RiskMapPage() {
  const { coords } = useOutletContext() || {};
  const containerRef = useScrollReveal();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [riskData, setRiskData] = useState(DEMO_RISK_DATA);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveRisk = async () => {
      try {
        const response = await recommendationsAPI.getRiskMap();
        if (response.data && response.data.data && response.data.data.length > 0) {
          setRiskData(response.data.data);
        }
      } catch (err) {
        console.warn('Risk map live fetch fallback:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveRisk();
  }, []);

  // If GPS is active and user hasn't selected a region yet, select the nearest GPS region
  useEffect(() => {
    if (coords?.regionId && !selectedRegion && riskData.length > 0) {
      const match = riskData.find(r => r.regionId === coords.regionId);
      if (match) setSelectedRegion(match);
    }
  }, [coords?.regionId, riskData]);

  const mapCenter = (coords?.latitude && coords?.longitude)
    ? [coords.latitude, coords.longitude]
    : [-7.6, 110.5];

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto text-[#09090b] page-enter">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs uppercase tracking-widest font-semibold mb-2">
            <Sparkles size={12} />
            Radar Geospasial Iklim
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#09090b] tracking-tight">Peta Risiko Wilayah</h1>
          <p className="text-[#71717a] text-sm mt-1">
            Visualisasi risiko hidrometeorologi real-time per wilayah berbasis telemetry satelit dan BMKG.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {coords?.isGPS && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200">
              <Crosshair size={12} className="text-emerald-600 animate-pulse" />
              GPS: {coords.regionName} ({coords.distanceKm} km)
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            BMKG Live
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2 reveal-up">
          <div className="rounded-2xl border border-[#e4e4e7] overflow-hidden shadow-sm relative" style={{ height: '490px' }}>
            <MapContainer
              center={mapCenter}
              zoom={9}
              style={{ height: '100%', width: '100%' }}
              aria-label="Peta risiko wilayah"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* GPS User Marker */}
              {coords?.latitude && coords?.longitude && (
                <CircleMarker
                  center={[coords.latitude, coords.longitude]}
                  radius={10}
                  pathOptions={{
                    color: '#059669',
                    fillColor: '#10B981',
                    fillOpacity: 0.9,
                    weight: 3,
                  }}
                >
                  <Popup>
                    <div className="font-sans text-[#09090b] text-xs p-1" style={{ minWidth: 160 }}>
                      <div className="font-semibold text-emerald-700 mb-0.5">Posisi GPS Anda</div>
                      <div className="text-[#71717a] font-mono text-[11px]">
                        {coords.latitude.toFixed(4)}°, {coords.longitude.toFixed(4)}°
                      </div>
                      <div className="text-[#71717a] mt-1">Wilayah: {coords.regionName}</div>
                    </div>
                  </Popup>
                </CircleMarker>
              )}

              {/* Region Risk Markers */}
              {riskData.map((region) => (
                <CircleMarker
                  key={region.regionId}
                  center={[region.coordinates.lat, region.coordinates.lng]}
                  radius={Math.max(14, Math.min(26, region.score / 3))}
                  pathOptions={{
                    color: region.color,
                    fillColor: region.color,
                    fillOpacity: 0.6,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => setSelectedRegion(region),
                  }}
                >
                  <Popup>
                    <div className="font-sans text-[#09090b] text-xs p-1" style={{ minWidth: 180 }}>
                      <div className="font-semibold text-sm mb-1">{region.regionName}</div>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-[#71717a]">Skor Risiko</span>
                          <span className="font-mono font-semibold" style={{ color: region.color }}>{region.score}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#71717a]">Status</span>
                          <span className="font-semibold">{region.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#71717a]">Peluang Hujan</span>
                          <span className="font-semibold">{region.rainProbability}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#71717a]">Petani Terdampak</span>
                          <span className="font-semibold">{region.affectedFarmers.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-[#e4e4e7] text-[#71717a]">
                          {region.mainRisk}
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-4 items-center px-1">
            <span className="text-xs font-mono text-[#71717a] uppercase">Indikator:</span>
            {[
              { color: '#10b981', label: 'Aman (0-30)' },
              { color: '#f59e0b', label: 'Perlu Perhatian (31-60)' },
              { color: '#f97316', label: 'Berisiko (61-80)' },
              { color: '#ef4444', label: 'Darurat (81-100)' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} aria-hidden="true" />
                <span className="text-xs font-mono text-[#71717a]">{l.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] font-mono text-[#71717a] mt-1 px-1">Peta Dasar: © OpenStreetMap contributors</p>
        </div>

        {/* Region List */}
        <div className="space-y-3 reveal-up">
          <div className="flex items-center justify-between pb-1">
            <h2 className="font-medium text-base text-[#09090b]">Wilayah Pemantauan</h2>
            <span className="text-xs font-mono text-[#71717a]">9 Wilayah Aktif</span>
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {riskData.map((region) => {
              const isSelected = selectedRegion?.regionId === region.regionId;
              return (
                <button
                  key={region.regionId}
                  onClick={() => setSelectedRegion(isSelected ? null : region)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                      : 'bg-white border-[#e4e4e7] hover:border-emerald-200'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`${region.regionName}: skor risiko ${region.score}, status ${region.label}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className={isSelected ? "text-emerald-700" : "text-[#71717a]"} aria-hidden="true" />
                      <span className={`font-medium text-sm ${isSelected ? 'text-emerald-950 font-semibold' : 'text-[#09090b]'}`}>{region.regionName}</span>
                      {coords?.regionId === region.regionId && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                          GPS
                        </span>
                      )}
                    </div>
                    <RiskBadge label={region.label} badge={region.label} />
                  </div>

                  <div className="h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden mb-2 border border-[#e4e4e7]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${region.score}%`, backgroundColor: region.color }}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="flex justify-between text-xs font-mono text-[#71717a]">
                    <span>Skor: {region.score}/100</span>
                    <span>{region.rainProbability}% hujan</span>
                  </div>

                  <p className="text-xs text-[#71717a] mt-1.5 leading-relaxed">{region.mainRisk}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Region Detail */}
      {selectedRegion && (
        <div className="mt-6 rounded-2xl bg-white border border-[#e4e4e7] p-6 shadow-sm reveal-up" style={{ borderLeftWidth: 4, borderLeftColor: selectedRegion.color }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-[#09090b]">{selectedRegion.regionName}</h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  BMKG Terkini
                </span>
              </div>
              <p className="text-sm text-[#71717a] mt-1">{selectedRegion.mainRisk}</p>
            </div>
            <RiskBadge label={selectedRegion.label} badge={selectedRegion.label} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e4e4e7]">
            <div className="p-4 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
              <div className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1">Skor Risiko</div>
              <div className="font-semibold text-2xl" style={{ color: selectedRegion.color }}>
                {selectedRegion.score}
              </div>
              <div className="text-xs text-[#71717a]">dari indeks 100</div>
            </div>
            <div className="p-4 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
              <div className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1">Peluang Hujan</div>
              <div className="font-semibold text-2xl text-[#09090b]">{selectedRegion.rainProbability}%</div>
              <div className="text-xs text-[#71717a]">akumulasi harian</div>
            </div>
            <div className="p-4 rounded-xl bg-[#fafafa] border border-[#e4e4e7]">
              <div className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1">Petani Terdampak</div>
              <div className="font-semibold text-2xl text-[#09090b]">
                {selectedRegion.affectedFarmers.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-[#71717a]">estimasi petani terdaftar</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Info, AlertTriangle, CheckCircle, CloudSun, Loader, Crosshair } from 'lucide-react';
import { RiskBadge, SectionHeader, LiveBMKGBadge } from '../../components/ui';
import { DEMO_RISK_DATA } from '../../data/mockData';
import { recommendationsAPI } from '../../services/api';

export default function RiskMapPage() {
  const { coords } = useOutletContext() || {};
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [riskData, setRiskData] = useState(DEMO_RISK_DATA);
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        title="Peta Risiko Wilayah"
        subtitle="Visualisasi risiko cuaca real-time per wilayah berbasis data prakiraan resmi BMKG."
        action={
          <div className="flex items-center gap-2">
            {coords?.isGPS && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                <Crosshair size={12} className="text-emerald-600 animate-pulse" />
                GPS: {coords.regionName} ({coords.distanceKm} km)
              </span>
            )}
            <LiveBMKGBadge text="BMKG Resmi (Live)" />
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden" style={{ height: '480px' }}>
            <MapContainer
              center={mapCenter}
              zoom={9}
              style={{ height: '100%', width: '100%' }}
              aria-label="Peta risiko wilayah"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* GPS User Marker */}
              {coords?.latitude && coords?.longitude && (
                <CircleMarker
                  center={[coords.latitude, coords.longitude]}
                  radius={10}
                  pathOptions={{
                    color: '#047857',
                    fillColor: '#10B981',
                    fillOpacity: 0.9,
                    weight: 3,
                  }}
                >
                  <Popup>
                    <div className="font-body text-ink text-xs" style={{ minWidth: 150 }}>
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                        <Crosshair size={13} className="text-emerald-600" />
                        <span>Lokasi GPS Anda</span>
                      </div>
                      <p className="text-slate-600 leading-snug">
                        Stasiun Terdekat: <strong>{coords.regionName}</strong> (~{coords.distanceKm} km)
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              )}

              {riskData.map((region) => (
                <CircleMarker
                  key={region.regionId}
                  center={[region.latitude, region.longitude]}
                  radius={20 + region.score / 8}
                  pathOptions={{
                    color: region.color,
                    fillColor: region.color,
                    fillOpacity: 0.6,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => setSelectedRegion(region),
                  }}
                  aria-label={`${region.regionName}: ${region.label}`}
                >
                  <Popup>
                    <div className="font-body text-ink" style={{ minWidth: 160 }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <MapPin size={14} className="text-padi-500" />
                        <strong className="font-display text-base">{region.regionName}</strong>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted">Status Risiko</span>
                          <span className="font-semibold" style={{ color: region.color }}>{region.label}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Peluang Hujan</span>
                          <span className="font-semibold">{region.rainProbability}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Petani Terdampak</span>
                          <span className="font-semibold">{region.affectedFarmers.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100 text-gray-500">
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
          <div className="mt-3 flex flex-wrap gap-3 items-center">
            <span className="text-xs text-muted font-semibold">Legenda:</span>
            {[
              { color: '#6E9F43', label: 'Aman (0-30)' },
              { color: '#D8A83E', label: 'Perlu Perhatian (31-60)' },
              { color: '#C07020', label: 'Berisiko (61-80)' },
              { color: '#B03A2E', label: 'Darurat (81-100)' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} aria-hidden="true" />
                <span className="text-xs text-muted">{l.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-1">Peta: © OpenStreetMap contributors</p>
        </div>

        {/* Region list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base text-ink">Wilayah Pemantauan</h2>
            <span className="text-xs text-muted">9 Wilayah Aktif</span>
          </div>
          {riskData.map((region) => (
            <button
              key={region.regionId}
              onClick={() => setSelectedRegion(selectedRegion?.regionId === region.regionId ? null : region)}
              className={`w-full text-left card card-body transition-all ${
                selectedRegion?.regionId === region.regionId
                  ? 'border-2 shadow-card-hover'
                  : 'hover:shadow-card-hover'
              }`}
              style={selectedRegion?.regionId === region.regionId ? { borderColor: region.color } : {}}
              aria-pressed={selectedRegion?.regionId === region.regionId}
              aria-label={`${region.regionName}: skor risiko ${region.score}, status ${region.label}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-muted" aria-hidden="true" />
                  <span className="font-semibold text-ink text-sm">{region.regionName}</span>
                  {coords?.regionId === region.regionId && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                      <Crosshair size={10} className="text-emerald-600" /> GPS
                    </span>
                  )}
                </div>
                <RiskBadge label={region.label} badge={region.label} />
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${region.score}%`, backgroundColor: region.color }}
                  aria-hidden="true"
                />
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Skor: {region.score}/100</span>
                <span>{region.rainProbability}% hujan</span>
              </div>
              <p className="text-xs text-muted mt-1 leading-relaxed">{region.mainRisk}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected region detail */}
      {selectedRegion && (
        <div className="mt-5 card card-body border-2 animate-slide-up" style={{ borderColor: selectedRegion.color }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg text-ink">{selectedRegion.regionName}</h3>
                <LiveBMKGBadge text="Data BMKG Terkini" />
              </div>
              <p className="text-sm text-muted mt-0.5">{selectedRegion.mainRisk}</p>
            </div>
            <RiskBadge label={selectedRegion.label} badge={selectedRegion.label} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted mb-1">Skor Risiko</div>
              <div className="font-display text-2xl font-bold" style={{ color: selectedRegion.color }}>
                {selectedRegion.score}
              </div>
              <div className="text-xs text-muted">dari 100</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Peluang Hujan</div>
              <div className="font-display text-2xl font-bold text-ink">{selectedRegion.rainProbability}%</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Petani Terdampak</div>
              <div className="font-display text-2xl font-bold text-ink">
                {selectedRegion.affectedFarmers.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-muted">estimasi petani terdaftar</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

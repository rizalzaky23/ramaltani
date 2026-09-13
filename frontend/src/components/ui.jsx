import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

/**
 * Risk badge — accessible, warna fungsional pertanian
 */
export function RiskBadge({ score, label, badge, className = '' }) {
  const levels = {
    'Rendah': { cls: 'risk-aman', icon: <CheckCircle size={11} /> },
    'Waspada': { cls: 'risk-perhatian', icon: <AlertTriangle size={11} /> },
    'Tinggi': { cls: 'risk-berisiko', icon: <AlertTriangle size={11} /> },
    'Sangat Tinggi': { cls: 'risk-darurat', icon: <XCircle size={11} /> },
    'Aman': { cls: 'risk-aman', icon: <CheckCircle size={11} /> },
    'Perlu Perhatian': { cls: 'risk-perhatian', icon: <AlertTriangle size={11} /> },
    'Berisiko': { cls: 'risk-berisiko', icon: <AlertTriangle size={11} /> },
    'Darurat': { cls: 'risk-darurat', icon: <XCircle size={11} /> },
  };

  const displayText = badge || label || 'Tidak Diketahui';
  const config = levels[displayText] || levels[label] || { cls: 'risk-perhatian', icon: <Info size={11} /> };

  return (
    <span className={`${config.cls} ${className}`} role="status">
      {config.icon}
      {displayText}
    </span>
  );
}

/**
 * Status badge untuk status rekomendasi
 */
export function StatusBadge({ status, className = '' }) {
  const map = {
    'LAYAK TANAM': { cls: 'status-layak', icon: <CheckCircle size={12} /> },
    'PERLU PERHATIAN': { cls: 'status-perhatian', icon: <AlertTriangle size={12} /> },
    'TUNDA DULU': { cls: 'status-tunda', icon: <AlertTriangle size={12} /> },
    'TIDAK DISARANKAN': { cls: 'status-tidak', icon: <XCircle size={12} /> },
  };
  const config = map[status] || map['PERLU PERHATIAN'];

  return (
    <span className={`${config.cls} ${className}`} role="status" aria-label={`Status: ${status}`}>
      {config.icon}
      {status}
    </span>
  );
}

/**
 * Source attribution badge
 */
export function SourceBadge({ source, isDemo }) {
  return (
    <span className="source-badge">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      Sumber: {source}
      {isDemo && (
        <span className="ml-1 px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 rounded text-xs font-medium">
          DEMO
        </span>
      )}
    </span>
  );
}

/**
 * Confidence progress bar
 */
export function ConfidenceBar({ value, className = '' }) {
  const color = value >= 70 ? '#10b981' : value >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs uppercase tracking-widest text-[#71717a] font-medium">Tingkat Keyakinan</span>
        <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#f4f4f5] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Tingkat keyakinan ${value}%`}
        />
      </div>
    </div>
  );
}

/**
 * Loading skeleton
 */
export function LoadingSkeleton({ className = 'h-4 w-full', lines = 1 }) {
  return (
    <div aria-busy="true" aria-label="Memuat data..." className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`} />
      ))}
    </div>
  );
}

/**
 * Empty state
 */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl bg-[#fafafa] border border-[#e4e4e7]">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[#09090b] mb-1 tracking-tight">{title}</h3>
      {description && <p className="text-sm text-[#71717a] max-w-sm mb-6 leading-relaxed">{description}</p>}
      {action}
    </div>
  );
}

/**
 * Section header
 */
export function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between mb-6 ${className}`}>
      <div>
        <h2 className="text-xl font-semibold text-[#09090b] tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-[#71717a] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}

/**
 * Live BMKG Badge
 */
export function LiveBMKGBadge({ text = 'BMKG Resmi (Live)' }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      {text}
    </span>
  );
}

/**
 * Demo/live badge
 */
export function DemoBadge({ isLive = false }) {
  if (isLive) return <LiveBMKGBadge />;
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
      Data Terverifikasi
    </span>
  );
}

/**
 * API attribution footer
 */
export function DataAttribution() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#71717a] mt-4 pt-3 border-t border-[#e4e4e7]">
      <span>Sumber: <span className="text-[#09090b] font-medium">BMKG Resmi (Live API)</span></span>
      <span>•</span>
      <span>Data pendukung: <span className="text-[#09090b] font-medium">Open-Meteo Global</span></span>
      <span>•</span>
      <span>Peta: <span className="text-[#09090b] font-medium">OpenStreetMap</span></span>
    </div>
  );
}

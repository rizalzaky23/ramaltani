import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

/**
 * Risk badge with text + icon — accessible, no color-only communication
 */
export function RiskBadge({ score, label, badge, className = '' }) {
  const levels = {
    'Rendah': { cls: 'risk-aman', icon: <CheckCircle size={12} /> },
    'Waspada': { cls: 'risk-perhatian', icon: <AlertTriangle size={12} /> },
    'Tinggi': { cls: 'risk-berisiko', icon: <AlertTriangle size={12} /> },
    'Sangat Tinggi': { cls: 'risk-darurat', icon: <XCircle size={12} /> },
    // Also handle badge text
    'Aman': { cls: 'risk-aman', icon: <CheckCircle size={12} /> },
    'Perlu Perhatian': { cls: 'risk-perhatian', icon: <AlertTriangle size={12} /> },
    'Berisiko': { cls: 'risk-berisiko', icon: <AlertTriangle size={12} /> },
    'Darurat': { cls: 'risk-darurat', icon: <XCircle size={12} /> },
  };

  const displayText = badge || label || 'Tidak Diketahui';
  const config = levels[displayText] || levels[label] || { cls: 'risk-perhatian', icon: <Info size={12} /> };

  return (
    <span className={`${config.cls} ${className}`} role="status">
      {config.icon}
      {displayText}
    </span>
  );
}

/**
 * Status badge for recommendation status
 */
export function StatusBadge({ status, className = '' }) {
  const map = {
    'LAYAK TANAM': { cls: 'status-layak', icon: <CheckCircle size={14} /> },
    'PERLU PERHATIAN': { cls: 'status-perhatian', icon: <AlertTriangle size={14} /> },
    'TUNDA DULU': { cls: 'status-tunda', icon: <AlertTriangle size={14} /> },
    'TIDAK DISARANKAN': { cls: 'status-tidak', icon: <XCircle size={14} /> },
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
      <span className="w-1.5 h-1.5 rounded-full bg-padi-400 inline-block" aria-hidden="true" />
      Sumber: {source}
      {isDemo && (
        <span className="ml-1 px-1.5 py-0.5 bg-panen-50 text-panen-700 rounded text-xs font-semibold">
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
  const color = value >= 70 ? '#6E9F43' : value >= 50 ? '#D8A83E' : '#C07020';

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-muted">Tingkat Keyakinan</span>
        <span className="text-sm font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="confidence-bar">
        <div
          className="confidence-fill"
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
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-padi-50 flex items-center justify-center mb-4 text-padi-400">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg text-ink mb-2">{title}</h3>
      {description && <p className="text-sm text-muted max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}

/**
 * Section header
 */
export function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`section-header flex items-start justify-between ${className}`}>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
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
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold shadow-xs">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      {text}
    </span>
  );
}

/**
 * Demo watermark badge (legacy / fallback)
 */
export function DemoBadge({ isLive = false }) {
  if (isLive) return <LiveBMKGBadge />;
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-panen-50 text-panen-700 border border-panen-200 font-semibold">
      Data Demo
    </span>
  );
}

/**
 * API attribution footer
 */
export function DataAttribution() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mt-3 pt-3 border-t border-border">
      <span>Sumber cuaca: <span className="font-semibold text-ink">BMKG Resmi (Live API)</span></span>
      <span>Data pendukung: <span className="font-semibold text-ink">Open-Meteo Global</span></span>
      <span>Peta: <span className="font-semibold text-ink">OpenStreetMap</span></span>
    </div>
  );
}

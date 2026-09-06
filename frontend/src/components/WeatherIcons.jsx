/**
 * Custom weather icons — agricultural/cartographic style SVG illustrations
 * These feel hand-drawn rather than generic emoji
 */

export function SunnyIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="10" fill="#D8A83E" />
      {[0,45,90,135,180,225,270,315].map((angle, i) => (
        <line
          key={i}
          x1="24" y1="24"
          x2={24 + 16 * Math.cos((angle * Math.PI) / 180)}
          y2={24 + 16 * Math.sin((angle * Math.PI) / 180)}
          stroke="#D8A83E"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function PartlyCloudyIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="7" fill="#D8A83E" opacity="0.9" />
      {[0,60,120,180,240,300].map((angle, i) => (
        <line key={i} x1="20" y1="20"
          x2={20 + 11 * Math.cos((angle * Math.PI) / 180)}
          y2={20 + 11 * Math.sin((angle * Math.PI) / 180)}
          stroke="#D8A83E" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"
        />
      ))}
      <path d="M14 32c0-4 3-6 6-6a6 6 0 0 1 12 0h2a4 4 0 0 1 0 8H16a4 4 0 0 1-2-2z" fill="#9BC7D4" />
    </svg>
  );
}

export function CloudyIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M10 30c0-5 4-8 8-8a8 8 0 0 1 16 0h3a5 5 0 0 1 0 10H13a5 5 0 0 1-3-2z" fill="#9BC7D4" />
      <path d="M8 28c0-4 3-6 6-6 0-3 2-5 5-5" stroke="#6B8FA0" strokeWidth="1" fill="none" strokeDasharray="2 2" opacity="0.5" />
    </svg>
  );
}

export function LightRainIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M8 22c0-5 4-9 9-9a9 9 0 0 1 18 0h3a5 5 0 0 1 0 10H11a5 5 0 0 1-3-1z" fill="#9BC7D4" />
      <line x1="18" y1="36" x2="16" y2="42" stroke="#5BA3B6" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="36" x2="22" y2="42" stroke="#5BA3B6" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="36" x2="28" y2="42" stroke="#5BA3B6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ModerateRainIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M7 20c0-5 4-9 9-9a9 9 0 0 1 18 0h3a5 5 0 0 1 0 10H10a5 5 0 0 1-3-1z" fill="#78B4C5" />
      <line x1="15" y1="33" x2="13" y2="41" stroke="#468695" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="33" x2="20" y2="41" stroke="#468695" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="29" y1="33" x2="27" y2="41" stroke="#468695" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="36" x2="16" y2="44" stroke="#346370" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="25" y1="36" x2="23" y2="44" stroke="#346370" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function HeavyRainIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M6 19c0-5 4-9 9-9a9 9 0 0 1 18 0h3a5 5 0 0 1 0 10H9a5 5 0 0 1-3-1z" fill="#5BA3B6" />
      {[12,18,24,30,36].map((x, i) => (
        <line key={i} x1={x} y1="31" x2={x - 3} y2={i % 2 === 0 ? 43 : 40} stroke="#346370" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      <line x1="10" y1="37" x2="44" y2="33" stroke="#346370" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
    </svg>
  );
}

export function ThunderstormIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M6 18c0-5 4-9 9-9a9 9 0 0 1 18 0h3a5 5 0 0 1 0 10H9a5 5 0 0 1-3-1z" fill="#346370" />
      <path d="M26 26 L20 36 L25 36 L19 46" stroke="#D8A83E" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <line x1="12" y1="32" x2="10" y2="40" stroke="#5BA3B6" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="30" x2="33" y2="38" stroke="#5BA3B6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function FoggyIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <line x1="8" y1="16" x2="40" y2="16" stroke="#9BC7D4" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="24" x2="38" y2="24" stroke="#9BC7D4" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <line x1="12" y1="32" x2="36" y2="32" stroke="#9BC7D4" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function WindyIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M8 18 Q20 12 28 18 Q34 22 34 18 Q34 12 28 12" stroke="#9BC7D4" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M8 26 Q20 20 30 26 Q38 30 38 24 Q38 18 30 18" stroke="#9BC7D4" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M8 34 Q18 28 24 34 Q28 38 28 34 Q28 28 24 28" stroke="#9BC7D4" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/**
 * Map weather code to icon component
 */
export function WeatherIcon({ code, iconUrl, size = 48, className = '' }) {
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={code || 'Cuaca BMKG'}
        style={{ width: size, height: size }}
        className={`object-contain flex-shrink-0 ${className}`}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }

  const icons = {
    sunny: SunnyIcon,
    partly_cloudy: PartlyCloudyIcon,
    cloudy: CloudyIcon,
    thick_cloud: CloudyIcon,
    light_rain: LightRainIcon,
    drizzle: LightRainIcon,
    moderate_rain: ModerateRainIcon,
    heavy_rain: HeavyRainIcon,
    thunderstorm: ThunderstormIcon,
    foggy: FoggyIcon,
    windy: WindyIcon,
  };

  const Icon = icons[code] || PartlyCloudyIcon;
  return <Icon size={size} className={className} />;
}

/**
 * Get weather description in Indonesian
 */
export function getWeatherDescription(code) {
  const map = {
    sunny: 'Cerah',
    partly_cloudy: 'Cerah Berawan',
    cloudy: 'Berawan',
    thick_cloud: 'Berawan Tebal',
    light_rain: 'Hujan Ringan',
    drizzle: 'Gerimis',
    moderate_rain: 'Hujan Sedang',
    heavy_rain: 'Hujan Lebat',
    thunderstorm: 'Hujan Petir',
    foggy: 'Berkabut',
    windy: 'Angin Kencang',
  };
  return map[code] || 'Berawan';
}

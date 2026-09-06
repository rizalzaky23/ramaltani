import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronRight, ArrowRight, MapPin, Leaf, BarChart2,
  Bell, Users, BookOpen, CheckCircle, AlertTriangle, Star, ExternalLink,
  Shield, Zap, TrendingUp, CloudRain
} from 'lucide-react';
import { WeatherIcon } from '../components/WeatherIcons';
import { RiskBadge } from '../components/ui';

// ─── Garis Musim decorative SVG ───────────────────────────────────────────────
function GarisMusim({ className = '' }) {
  return (
    <div className={`absolute inset-x-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full">
        <path d="M0,40 Q180,10 360,40 Q540,70 720,40 Q900,10 1080,40 Q1260,70 1440,40" stroke="#6E9F43" strokeWidth="2" fill="none" opacity="0.15"/>
        <path d="M0,55 Q180,25 360,55 Q540,85 720,55 Q900,25 1080,55 Q1260,85 1440,55" stroke="#3F6B3B" strokeWidth="1" fill="none" opacity="0.1"/>
      </svg>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#tentang', label: 'Tentang' },
    { href: '#fitur', label: 'Fitur' },
    { href: '#cara-kerja', label: 'Cara Kerja' },
    { href: '#wilayah', label: 'Wilayah' },
    { href: '#edukasi', label: 'Edukasi' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-card border-b border-border' : 'bg-transparent'
      }`}
      aria-label="Navigasi utama"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="RamalTani - Beranda">
            <div className="w-9 h-9 rounded-xl bg-padi-500 flex items-center justify-center shadow-sm group-hover:bg-padi-600 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2C8 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-4-8-8-8z" fill="white" opacity="0.9"/>
                <path d="M12 7v7M9 10l3-3 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <span className={`font-display text-xl font-bold leading-none ${scrolled ? 'text-ink' : 'text-ink'}`}>
                Ramal<span className="text-padi-500">Tani</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-semibold text-muted hover:text-ink rounded-lg hover:bg-padi-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm text-ink">Masuk</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Daftar Gratis</Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl text-muted hover:text-ink hover:bg-padi-50 transition-colors"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-border bg-white" role="menu">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-sm font-semibold text-muted hover:text-ink hover:bg-padi-50 rounded-xl transition-colors"
                onClick={() => setMenuOpen(false)}
                role="menuitem"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-2 px-4 pt-3 pb-2 border-t border-border mt-2">
              <Link to="/login" className="btn btn-secondary btn-sm flex-1 justify-center">Masuk</Link>
              <Link to="/register" className="btn btn-primary btn-sm flex-1 justify-center">Daftar</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden" aria-labelledby="hero-heading">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface via-padi-50/40 to-langit-50/30" aria-hidden="true" />
      <GarisMusim className="bottom-0" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-padi-100/40 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-langit-100/50 blur-3xl" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Actual recommendation display */}
          <div className="animate-slide-up">
            {/* Region + crop label */}
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-muted bg-white/80 border border-border px-3 py-1.5 rounded-full shadow-sm">
                <MapPin size={14} className="text-padi-500" />
                Klaten, Jawa Tengah
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-muted bg-white/80 border border-border px-3 py-1.5 rounded-full shadow-sm">
                <Leaf size={14} className="text-padi-500" />
                Padi · Musim Tanam 2026
              </span>
            </div>

            {/* Main heading */}
            <h1 id="hero-heading" className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-ink leading-tight mb-4">
              Baca Cuaca.<br />
              Atur Tanam.<br />
              <span className="text-padi-600">Jaga Panen.</span>
            </h1>

            <p className="text-muted text-lg mb-8 max-w-lg leading-relaxed">
              Data cuaca yang rumit diterjemahkan menjadi keputusan tanam yang sederhana — khusus untuk petani Indonesia.
            </p>

            {/* The actual recommendation card — hero's core message */}
            <div className="card p-5 mb-8 border-l-4 border-l-padi-400 bg-white shadow-card-hover max-w-md" role="region" aria-label="Contoh rekomendasi">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wide">Waktu Tanam Disarankan</span>
                  <h2 className="font-display text-2xl text-ink mt-0.5">12–15 September 2026</h2>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-padi-50 text-padi-700 text-xs font-bold border border-padi-200">
                  <CheckCircle size={13} />
                  LAYAK TANAM
                </span>
              </div>

              <div className="flex items-center gap-4 mb-3 py-2 border-y border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-padi-600">82%</div>
                  <div className="text-xs text-muted">Keyakinan</div>
                </div>
                <div className="flex-1 text-sm text-muted leading-relaxed">
                  Curah hujan diperkirakan stabil. Hindari 8–10 Sep karena peluang hujan ekstrem meningkat.
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-panen-600 flex-shrink-0" />
                <span className="text-xs text-panen-700 font-semibold">Alternatif: 17–19 September</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="btn btn-primary btn-lg shadow-sm"
                aria-label="Coba tentukan waktu tanam Anda"
              >
                Coba Tentukan Waktu Tanam
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary btn-lg"
              >
                Masuk
              </Link>
            </div>

            <p className="text-xs text-muted mt-4">
              Gratis untuk petani · Data dari BMKG & Open-Meteo
            </p>
          </div>

          {/* Right: Visual forecast timeline */}
          <div className="hidden lg:block animate-fade-in">
            <HeroWeatherTimeline />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroWeatherTimeline() {
  const days = [
    { label: 'Sen, 7 Sep', code: 'heavy_rain', desc: 'Hujan lebat', prob: 91, mm: 38.2, temp: 25, highlight: 'danger' },
    { label: 'Sel, 8 Sep', code: 'moderate_rain', desc: 'Hujan sedang', prob: 82, mm: 18.4, temp: 27, highlight: 'warning' },
    { label: 'Rab, 9 Sep', code: 'cloudy', desc: 'Berawan', prob: 45, mm: 3.5, temp: 30, highlight: null },
    { label: 'Kam, 10 Sep', code: 'partly_cloudy', desc: 'Cerah berawan', prob: 25, mm: 0, temp: 31, highlight: null },
    { label: 'Jum, 11 Sep', code: 'partly_cloudy', desc: 'Cerah berawan', prob: 22, mm: 0, temp: 32, highlight: null },
    { label: 'Sab, 12 Sep', code: 'light_rain', desc: 'Hujan ringan', prob: 62, mm: 8.8, temp: 27, highlight: 'best' },
    { label: 'Min, 13 Sep', code: 'cloudy', desc: 'Berawan', prob: 40, mm: 2.1, temp: 29, highlight: 'best' },
  ];

  return (
    <div className="relative">
      <div className="text-sm font-semibold text-muted mb-4 flex items-center gap-2">
        <CloudRain size={16} className="text-langit-500" />
        Prakiraan 7 Hari ke Depan
        <span className="ml-auto text-xs bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live BMKG
        </span>
      </div>

      <div className="space-y-2">
        {days.map((day, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              day.highlight === 'best'
                ? 'bg-padi-50 border-padi-200 shadow-sm'
                : day.highlight === 'danger'
                ? 'bg-red-50 border-red-200'
                : day.highlight === 'warning'
                ? 'bg-panen-50 border-panen-200'
                : 'bg-white border-border'
            }`}
          >
            <WeatherIcon code={day.code} size={36} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">{day.label}</span>
                {day.highlight === 'best' && (
                  <span className="text-xs font-bold text-padi-700 bg-padi-100 px-2 py-0.5 rounded-full">
                    ✓ Disarankan
                  </span>
                )}
                {day.highlight === 'danger' && (
                  <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                    ⚠ Hindari
                  </span>
                )}
              </div>
              <div className="text-xs text-muted">{day.desc}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-bold text-ink">{day.temp}°C</div>
              <div className={`text-xs font-semibold ${day.prob > 70 ? 'text-red-600' : day.prob > 50 ? 'text-panen-600' : 'text-padi-600'}`}>
                {day.prob}% hujan
              </div>
              {day.mm > 0 && <div className="text-xs text-muted">{day.mm}mm</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
        Sumber: BMKG Resmi (Live Open Data API)
      </div>
    </div>
  );
}

// ─── Problem Section ──────────────────────────────────────────────────────────
function ProblemSection() {
  const problems = [
    {
      icon: '📅',
      title: 'Kalender Tanam Tradisional',
      description: 'Petani sering bergantung pada kalender tanam tradisional yang sudah tidak akurat karena perubahan iklim.',
    },
    {
      icon: '🌧️',
      title: 'Pola Hujan yang Berubah',
      description: 'Musim hujan semakin tidak dapat diprediksi. Hujan ekstrem datang tak terduga, merusak tanaman yang sudah ditanam.',
    },
    {
      icon: '📊',
      title: 'Data Terlalu Teknis',
      description: 'Data BMKG akurat, namun sulit dipahami oleh petani biasa. "Curah hujan 42mm" tidak mudah diartikan jadi tindakan.',
    },
  ];

  return (
    <section id="tentang" className="py-20 bg-white" aria-labelledby="problem-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-sm font-semibold text-padi-600 uppercase tracking-wide">Masalah yang Kami Selesaikan</span>
          <h2 id="problem-heading" className="font-display text-3xl sm:text-4xl text-ink mt-2 mb-4">
            Mengapa petani butuh lebih dari sekadar data cuaca?
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            Pertanyaan yang perlu dijawab bukan <em>"Curah hujan 42 mm"</em> — melainkan <strong>"Apa yang sebaiknya saya lakukan sekarang?"</strong>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div key={i} className="p-6 rounded-2xl bg-surface border border-border hover:shadow-card transition-shadow">
              <div className="text-4xl mb-4" aria-hidden="true">{p.icon}</div>
              <h3 className="font-display text-xl text-ink mb-2">{p.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        {/* Solution flow */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-padi-50 to-langit-50 border border-padi-100">
          <h3 className="font-display text-2xl text-ink mb-8 text-center">
            RamalTani menjawab dengan satu alur sederhana
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {[
              { label: 'Data Cuaca BMKG', icon: <CloudRain size={20} /> },
              { label: 'Analisis RamalTani', icon: <Zap size={20} /> },
              { label: 'Rekomendasi Tanam', icon: <CheckCircle size={20} /> },
              { label: 'Petani Bertindak', icon: <Leaf size={20} /> },
            ].map((step, i, arr) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-white border border-padi-200 flex items-center justify-center text-padi-600 shadow-sm">
                    {step.icon}
                  </div>
                  <span className="text-xs font-semibold text-ink mt-2 text-center max-w-20">{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight size={20} className="text-padi-300 flex-shrink-0 mb-4" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: <CheckCircle size={24} />,
      title: 'Rekomendasi Tanam Cerdas',
      description: 'Sistem menganalisis prakiraan cuaca dan menghasilkan rekomendasi waktu tanam yang tepat dengan tingkat keyakinan terukur.',
      color: 'padi',
    },
    {
      icon: <MapPin size={24} />,
      title: 'Peta Risiko Wilayah',
      description: 'Visualisasi risiko cuaca per wilayah dengan peta interaktif berbasis Leaflet + OpenStreetMap.',
      color: 'langit',
    },
    {
      icon: <Bell size={24} />,
      title: 'Peringatan Dini',
      description: 'Notifikasi otomatis ketika ada potensi hujan lebat, kekeringan, atau kondisi berisiko bagi tanaman Anda.',
      color: 'panen',
    },
    {
      icon: <BarChart2 size={24} />,
      title: 'Riwayat & Analitik',
      description: 'Catat riwayat tanam dan lihat analisis performa panen berdasarkan kondisi cuaca historis.',
      color: 'tanah',
    },
    {
      icon: <Leaf size={24} />,
      title: 'Rekomendasi Varietas',
      description: 'Saran pemilihan varietas tanaman yang cocok dengan kondisi cuaca dan karakteristik lahan Anda.',
      color: 'daun',
    },
    {
      icon: <Users size={24} />,
      title: 'Komunitas Petani',
      description: 'Forum diskusi antar petani, berbagi pengalaman, dan mendapat saran dari penyuluh pertanian setempat.',
      color: 'padi',
    },
  ];

  const colorMap = {
    padi: 'bg-padi-50 text-padi-600 border-padi-100',
    langit: 'bg-langit-50 text-langit-600 border-langit-100',
    panen: 'bg-panen-50 text-panen-600 border-panen-100',
    tanah: 'bg-tanah-50 text-tanah-600 border-tanah-100',
    daun: 'bg-daun-50 text-daun-600 border-daun-100',
  };

  return (
    <section id="fitur" className="py-20 bg-surface" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-padi-600 uppercase tracking-wide">Fitur Utama</span>
          <h2 id="features-heading" className="font-display text-3xl sm:text-4xl text-ink mt-2 mb-4">
            Semua yang petani butuhkan dalam satu platform
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="card card-body hover:shadow-card-hover transition-all duration-200 group">
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${colorMap[f.color]}`}>
                {f.icon}
              </div>
              <h3 className="font-display text-lg text-ink mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'Pilih Lokasi', desc: 'Tentukan desa atau kecamatan lahan Anda.' },
    { num: '02', title: 'Pilih Tanaman', desc: 'Pilih jenis tanaman dan varietas yang ingin ditanam.' },
    { num: '03', title: 'Baca Cuaca', desc: 'RamalTani mengambil data prakiraan cuaca dari BMKG.' },
    { num: '04', title: 'Hitung Risiko', desc: 'Sistem menghitung skor risiko berdasarkan kondisi cuaca dan kebutuhan tanaman.' },
    { num: '05', title: 'Dapat Rekomendasi', desc: 'Petani mendapatkan rekomendasi waktu tanam yang jelas dan beralasan.' },
    { num: '06', title: 'Ambil Keputusan', desc: 'Petani bertindak dengan lebih percaya diri berdasarkan data nyata.' },
  ];

  return (
    <section id="cara-kerja" className="py-20 bg-white relative overflow-hidden" aria-labelledby="how-heading">
      <GarisMusim className="top-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-semibold text-padi-600 uppercase tracking-wide">Cara Kerja</span>
          <h2 id="how-heading" className="font-display text-3xl sm:text-4xl text-ink mt-2">
            Dari cuaca ke keputusan tanam dalam 6 langkah
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative p-6 rounded-2xl bg-surface border border-border">
              <div className="font-display text-5xl text-padi-100 font-bold mb-3" aria-hidden="true">
                {step.num}
              </div>
              <h3 className="font-display text-xl text-ink mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Regional Coverage Map ────────────────────────────────────────────────────
function RegionalSection() {
  const regions = [
    { name: 'Klaten', risk: 62, label: 'Berisiko', farmers: 8420 },
    { name: 'Sleman', risk: 38, label: 'Perlu Perhatian', farmers: 6310 },
    { name: 'Bantul', risk: 45, label: 'Perlu Perhatian', farmers: 5920 },
    { name: 'Kulon Progo', risk: 28, label: 'Aman', farmers: 4200 },
    { name: 'Magelang', risk: 71, label: 'Berisiko', farmers: 7180 },
    { name: 'Karanganyar', risk: 52, label: 'Perlu Perhatian', farmers: 5640 },
    { name: 'Sragen', risk: 44, label: 'Perlu Perhatian', farmers: 6870 },
    { name: 'Boyolali', risk: 33, label: 'Perlu Perhatian', farmers: 5210 },
  ];

  return (
    <section id="wilayah" className="py-20 bg-surface" aria-labelledby="regions-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-sm font-semibold text-padi-600 uppercase tracking-wide">Cakupan Wilayah Pertanian</span>
            <h2 id="regions-heading" className="font-display text-3xl sm:text-4xl text-ink mt-2">
              Sentra Pertanian & Pantauan BMKG
            </h2>
            <p className="text-muted mt-2 max-w-lg">
              Platform RamalTani terintegrasi langsung dengan data cuaca BMKG Resmi secara real-time untuk memantau risiko iklim dan kondisi cuaca di sentra pertanian.
            </p>
          </div>
          <span className="flex-shrink-0 text-xs font-bold bg-emerald-50 border border-emerald-300 text-emerald-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live BMKG API Aktif
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((r, i) => (
            <div key={i} className="card card-body">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-padi-500" />
                  <span className="font-semibold text-ink text-sm">{r.name}</span>
                </div>
                <RiskBadge label={r.label} badge={r.label} />
              </div>
              <div className="text-xs text-muted mb-2">{r.farmers.toLocaleString('id-ID')} petani binaan</div>
              {/* Risk bar */}
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${r.risk}%`,
                    backgroundColor: r.risk > 60 ? '#C07020' : r.risk > 30 ? '#D8A83E' : '#6E9F43',
                  }}
                  aria-label={`Skor risiko ${r.risk}%`}
                />
              </div>
              <div className="text-xs text-muted mt-1">Skor risiko: {r.risk}/100</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Budi Santoso',
      location: 'Desa Karanglo, Klaten',
      crop: 'Padi · 1.2 ha',
      quote: 'Dulu saya tanam berdasarkan perkiraan sendiri. Setelah pakai RamalTani, hasil panen saya naik karena tahu kapan waktu yang tepat untuk mulai.',
      rating: 5,
    },
    {
      name: 'Darmi Wati',
      location: 'Desa Sriharjo, Bantul',
      crop: 'Cabai · 0.5 ha',
      quote: 'Peringatan hujan lebatnya sangat membantu. Saya bisa menunda pemupukan tepat waktu, tanaman cabai saya selamat dari kerusakan.',
      rating: 5,
    },
    {
      name: 'Slamet Riyadi',
      location: 'Desa Maguwoharjo, Sleman',
      crop: 'Padi · 0.8 ha',
      quote: 'Rekomendasi varietas Inpari 42 sangat pas dengan kondisi lahan tadah hujan saya. Panen musim ini lebih baik dari biasanya.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-4">
          <span className="text-sm font-semibold text-padi-600 uppercase tracking-wide">Cerita Petani</span>
          <h2 id="testimonials-heading" className="font-display text-3xl sm:text-4xl text-ink mt-2">
            Apa kata petani tentang RamalTani
          </h2>
        </div>
        <p className="text-center text-muted mb-12 text-sm">
          <span className="bg-panen-50 border border-panen-200 text-panen-700 px-3 py-1 rounded-full font-semibold text-xs">
            ⚠ Testimoni Demo — Tokoh fiktif untuk keperluan demonstrasi
          </span>
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="card card-body flex flex-col">
              <div className="flex gap-1 mb-3" aria-label={`Rating: ${t.rating} dari 5 bintang`}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-panen-400 text-panen-400" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="text-sm text-ink leading-relaxed flex-1 mb-4">
                "{t.quote}"
              </blockquote>
              <div className="pt-4 border-t border-border">
                <div className="font-semibold text-ink text-sm">{t.name}</div>
                <div className="text-xs text-muted">{t.location}</div>
                <div className="text-xs text-padi-600 font-semibold mt-0.5">{t.crop}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Education Preview ────────────────────────────────────────────────────────
function EducationSection() {
  const articles = [
    { title: 'Apa Arti Peluang Hujan 70%?', category: 'Cuaca', time: '5 mnt' },
    { title: 'Kapan Waktu Terbaik Menanam Padi?', category: 'Tanam', time: '7 mnt' },
    { title: 'Menghadapi Musim Hujan yang Bergeser', category: 'Iklim', time: '6 mnt' },
    { title: 'Mengenal Varietas Tahan Kekeringan', category: 'Varietas', time: '6 mnt' },
    { title: 'Cara Membaca Prakiraan Cuaca BMKG', category: 'Cuaca', time: '5 mnt' },
  ];

  const catColor = {
    'Cuaca': 'text-langit-700 bg-langit-50 border-langit-200',
    'Tanam': 'text-padi-700 bg-padi-50 border-padi-200',
    'Iklim': 'text-daun-700 bg-daun-50 border-daun-200',
    'Varietas': 'text-tanah-700 bg-tanah-50 border-tanah-200',
  };

  return (
    <section id="edukasi" className="py-20 bg-surface" aria-labelledby="education-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
          <div>
            <span className="text-sm font-semibold text-padi-600 uppercase tracking-wide">Pusat Edukasi</span>
            <h2 id="education-heading" className="font-display text-3xl sm:text-4xl text-ink mt-2">
              Belajar tentang cuaca & pertanian
            </h2>
          </div>
          <Link to="/education" className="btn btn-secondary btn-sm">
            Lihat Semua Artikel
            <ExternalLink size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.slice(0, 3).map((a, i) => (
            <div key={i} className="card-hover card-body flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${catColor[a.category]}`}>
                  {a.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <BookOpen size={12} />
                  {a.time} membaca
                </span>
              </div>
              <h3 className="font-display text-lg text-ink leading-snug">{a.title}</h3>
              <div className="mt-auto flex items-center gap-1 text-padi-600 text-sm font-semibold">
                Baca artikel
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden" aria-labelledby="cta-heading">
      <div className="absolute inset-0 bg-gradient-to-br from-padi-600 to-daun-700" aria-hidden="true" />
      <GarisMusim className="bottom-0 opacity-30" />

      <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6">
        <h2 id="cta-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
          Mulai tentukan waktu tanam yang lebih tepat
        </h2>
        <p className="text-padi-100 text-lg mb-8 max-w-2xl mx-auto">
          Bergabung dengan ribuan petani yang sudah menggunakan data cuaca untuk keputusan tanam yang lebih baik.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="btn bg-white text-padi-700 hover:bg-padi-50 btn-lg shadow-lg font-semibold">
            Coba tentukan waktu tanam Anda
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn border-2 border-padi-300 text-white hover:bg-padi-700 btn-lg">
            Sudah punya akun? Masuk
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-ink text-padi-50 pt-12 pb-8" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-padi-500 flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                Ramal<span className="text-padi-400">Tani</span>
              </span>
            </div>
            <p className="text-padi-200 text-sm leading-relaxed max-w-sm mb-4">
              Platform pengambilan keputusan pertanian berbasis data cuaca untuk petani kecil dan menengah Indonesia.
            </p>
            <div className="space-y-1.5">
              <div className="text-xs text-padi-300">
                Sumber cuaca: <span className="text-padi-100 font-semibold">BMKG Open Data API</span>
              </div>
              <div className="text-xs text-padi-300">
                Data pendukung: <span className="text-padi-100 font-semibold">Open-Meteo (Free API)</span>
              </div>
              <div className="text-xs text-padi-300">
                Peta: <span className="text-padi-100 font-semibold">OpenStreetMap Contributors</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-padi-100">Platform</h3>
            <ul className="space-y-2.5 text-sm text-padi-300">
              <li><Link to="/register" className="hover:text-white transition-colors">Daftar Gratis</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Masuk</Link></li>
              <li><a href="#fitur" className="hover:text-white transition-colors">Fitur</a></li>
              <li><a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a></li>
              <li><a href="#wilayah" className="hover:text-white transition-colors">Wilayah</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-padi-100">Legal & Informasi</h3>
            <ul className="space-y-2.5 text-sm text-padi-300">
              <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tentang Data</a></li>
              <li><a href="https://data.bmkg.go.id" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">BMKG Open Data <ExternalLink size={11} /></a></li>
              <li><a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Open-Meteo API <ExternalLink size={11} /></a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-padi-400">
            © 2026 RamalTani · Membantu petani Indonesia membaca cuaca dan mengambil keputusan tanam yang lebih baik.
          </p>
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-padi-400" aria-hidden="true" />
            <span className="text-xs text-padi-400">
              Rekomendasi adalah interpretasi data cuaca, bukan jaminan hasil panen.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <RegionalSection />
        <TestimonialsSection />
        <EducationSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

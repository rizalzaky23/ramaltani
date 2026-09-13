import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, ArrowRight, MapPin, Bell, Users, BookOpen, BarChart2, CloudRain, CalendarDays } from 'lucide-react';

// ─── Navbar ──────────────────────────────────────────────────────────────────
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
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-[#e4e4e7] shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">RT</span>
          </div>
          <span className={`text-lg font-semibold tracking-tight transition-colors ${scrolled ? 'text-[#09090b]' : 'text-white'}`}>
            RamalTani
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.href} href={link.href}
              className={`text-sm transition-colors ${scrolled ? 'text-[#71717a] hover:text-[#09090b]' : 'text-white/70 hover:text-white'}`}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className={`px-4 py-2 text-sm font-medium transition-colors ${scrolled ? 'text-[#71717a] hover:text-[#09090b]' : 'text-white/70 hover:text-white'}`}>
            Masuk
          </Link>
          <Link to="/register" className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors">
            Daftar Gratis
          </Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-[#09090b]' : 'text-white'}`} aria-label="Menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-[#e4e4e7] px-6 py-4 space-y-4">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block text-base text-[#09090b] hover:text-emerald-700">
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-[#e4e4e7] flex flex-col gap-2">
            <Link to="/login" onClick={() => setMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-medium border border-[#e4e4e7] rounded-full text-[#09090b]">
              Masuk
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-medium bg-emerald-600 text-white rounded-full">
              Daftar Gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen bg-emerald-700 flex flex-col justify-end overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />

      {/* Content pinned to bottom like Evasion */}
      <div className="relative z-10 px-6 pb-16 md:pb-24 lg:px-20 pt-32">
        <p className="text-xs uppercase tracking-widest text-emerald-200/70 mb-6">Platform Pertanian Cerdas Indonesia</p>
        <h1 className="text-[13vw] sm:text-[10vw] md:text-[8vw] font-medium leading-[0.9] tracking-tight text-white max-w-5xl">
          Baca Cuaca.<br />Jaga Panen.
        </h1>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-emerald-800 font-medium text-sm hover:bg-emerald-50 transition-colors">
            Coba Sekarang <ArrowRight size={16} />
          </Link>
          <Link to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white font-medium text-sm hover:border-white/60 transition-colors">
            Masuk ke Dashboard
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-900/40 to-transparent pointer-events-none" />
    </section>
  );
}

// ─── Philosophy / Tagline Section ─────────────────────────────────────────────
function PhilosophySection() {
  return (
    <section className="px-6 py-24 md:py-36 lg:px-20 bg-white">
      <p className="mx-auto max-w-2xl text-center text-2xl md:text-3xl lg:text-4xl leading-relaxed text-[#71717a]">
        Data meteorologi yang rumit,<br />
        diterjemahkan menjadi keputusan tanam<br />
        yang sederhana dan tepat waktu.
      </p>
    </section>
  );
}

// ─── Stats Bar (Evasion-style grid) ──────────────────────────────────────────
function StatsBar() {
  const stats = [
    { label: 'Sentra Pertanian', value: '8+' },
    { label: 'Petani Terhubung', value: '45K+' },
    { label: 'Akurasi BMKG', value: '94%' },
    { label: 'Monitoring', value: '24/7' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-t border-[#e4e4e7]">
      {stats.map((s, i) => (
        <div key={i} className={`p-8 text-center ${i < stats.length - 1 ? 'border-r border-[#e4e4e7]' : ''}`}>
          <p className="text-xs uppercase tracking-widest text-[#71717a] mb-2">{s.label}</p>
          <p className="text-4xl font-medium tracking-tight text-[#09090b]">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Problem Section ──────────────────────────────────────────────────────────
function ProblemSection() {
  const problems = [
    {
      label: 'Kalender Tanam',
      title: 'Kalender Tradisional Sudah Bergeser',
      desc: 'Petani sering bergantung pada pranata mangsa yang kini tidak lagi akurat akibat perubahan iklim.',
    },
    {
      label: 'Pola Hujan',
      title: 'Hujan Makin Sulit Ditebak',
      desc: 'Anomali hujan lebat atau kemarau mendadak meningkatkan risiko gagal tanam hingga 40%.',
    },
    {
      label: 'Data Cuaca',
      title: 'Data BMKG Terlalu Teknis',
      desc: 'Milimeter curah hujan membutuhkan penerjemahan langsung ke tindakan nyata di petak sawah.',
    },
  ];

  return (
    <section id="tentang" className="px-6 py-20 md:py-28 lg:px-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-xl">
          <p className="text-xs uppercase tracking-widest text-[#71717a] mb-4">Masalah yang kami selesaikan</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-[#09090b]">
            Mengapa petani butuh lebih dari sekadar data cuaca?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div key={i} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-emerald-50 mb-6 flex items-center justify-center">
                <div className="text-6xl font-medium text-emerald-200">{String(i + 1).padStart(2, '0')}</div>
              </div>
              <div className="py-4">
                <p className="text-xs uppercase tracking-widest text-[#71717a] mb-2">{p.label}</p>
                <h3 className="text-lg font-semibold text-[#09090b] mb-2">{p.title}</h3>
                <p className="text-sm text-[#71717a] leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      label: 'Rekomendasi',
      title: 'Rekomendasi Tanam Cerdas',
      desc: 'Jendela waktu terbaik untuk tanam berdasarkan analisis probabilitas hujan BMKG 7–14 hari ke depan.',
    },
    {
      label: 'Peta Risiko',
      title: 'Peta Risiko GIS Interaktif',
      desc: 'Visualisasi zona bahaya cuaca dan kekeringan per kecamatan dengan kode warna jelas.',
    },
    {
      label: 'Peringatan Dini',
      title: 'Peringatan Dini Otomatis',
      desc: 'Notifikasi langsung ketika mendeteksi hujan lebat ekstrem, angin kencang, atau potensi banjir.',
    },
    {
      label: 'Riwayat',
      title: 'Riwayat & Analitik Panen',
      desc: 'Evaluasi efektivitas panen terhadap kondisi cuaca historis untuk perencanaan musim berikutnya.',
    },
    {
      label: 'Komunitas',
      title: 'Forum Komunitas Petani',
      desc: 'Berbagi pengalaman dan tips dengan sesama petani di seluruh wilayah Indonesia.',
    },
    {
      label: 'Edukasi',
      title: 'Pusat Edukasi Pertanian',
      desc: 'Konten edukasi pertanian cerdas iklim yang terus diperbarui oleh tim ahli agronomi.',
    },
  ];

  return (
    <section id="fitur" className="px-6 py-20 md:py-28 lg:px-20 bg-[#fafafa] border-t border-[#e4e4e7]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-xl">
          <p className="text-xs uppercase tracking-widest text-[#71717a] mb-4">Fitur & Teknologi</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-[#09090b]">
            Setiap petak lahan punya cerita.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="group bg-white border border-[#e4e4e7] rounded-2xl p-6 hover:border-emerald-200 hover:shadow-sm transition-all duration-300">
              <p className="text-xs uppercase tracking-widest text-emerald-600 mb-4">{f.label}</p>
              <h3 className="text-lg font-semibold text-[#09090b] mb-2 tracking-tight">{f.title}</h3>
              <p className="text-sm text-[#71717a] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works Section ─────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'Deteksi Lokasi GPS', desc: 'Platform mendeteksi koordinat lahan Anda secara otomatis atau pilih manual.' },
    { num: '02', title: 'Ambil Data BMKG', desc: 'Sistem menarik data cuaca real-time dari stasiun BMKG dan Open-Meteo terdekat.' },
    { num: '03', title: 'Analisis Cerdas', desc: 'Algoritma menganalisis pola hujan dan menghitung probabilitas risiko.' },
    { num: '04', title: 'Rekomendasi Aksi', desc: 'Anda menerima saran konkret: kapan tanam, kapan tunda, dan apa yang perlu disiapkan.' },
  ];

  return (
    <section id="cara-kerja" className="px-6 py-20 md:py-28 lg:px-20 bg-white border-t border-[#e4e4e7]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-xl">
          <p className="text-xs uppercase tracking-widest text-[#71717a] mb-4">Cara Kerja</p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#09090b]">
            Dari data ke keputusan dalam hitungan detik.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#e4e4e7] rounded-2xl overflow-hidden">
          {steps.map((s, i) => (
            <div key={i} className={`p-8 ${i < steps.length - 1 ? 'border-b md:border-b-0 md:border-r border-[#e4e4e7]' : ''}`}>
              <p className="text-3xl font-medium text-emerald-200 mb-6">{s.num}</p>
              <h3 className="text-base font-semibold text-[#09090b] mb-2 tracking-tight">{s.title}</h3>
              <p className="text-sm text-[#71717a] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Regional Coverage ────────────────────────────────────────────────────────
function RegionalSection() {
  const regions = [
    { name: 'Klaten', province: 'Jawa Tengah' },
    { name: 'Ngawi', province: 'Jawa Timur' },
    { name: 'Karawang', province: 'Jawa Barat' },
    { name: 'Subang', province: 'Jawa Barat' },
    { name: 'Sragen', province: 'Jawa Tengah' },
    { name: 'Demak', province: 'Jawa Tengah' },
    { name: 'Indramayu', province: 'Jawa Barat' },
    { name: 'Grobogan', province: 'Jawa Tengah' },
  ];

  return (
    <section id="wilayah" className="px-6 py-20 md:py-28 lg:px-20 bg-emerald-700">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-emerald-300/70 mb-4">Cakupan Wilayah</p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white">
            Lumbung padi utama<br />Nusantara.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {regions.map((r, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-white">{r.name}</div>
                <div className="text-xs text-emerald-300/70">{r.province}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-6 text-sm text-emerald-300/70 border-t border-white/10 pt-8">
          <span>Terintegrasi dengan:</span>
          <span>BMKG API</span>
          <span>·</span>
          <span>Open-Meteo</span>
          <span>·</span>
          <span>Satelit Himawari-9</span>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: 'Apakah RamalTani gratis untuk petani?', a: 'Ya, seluruh fitur utama RamalTani tersedia gratis untuk petani. Cukup daftar dan mulai pantau cuaca lahan Anda.' },
    { q: 'Data cuaca dari mana sumbernya?', a: 'Data diambil dari API resmi BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) dan Open-Meteo dengan resolusi tinggi.' },
    { q: 'Apakah perlu GPS aktif?', a: 'GPS disarankan agar rekomendasi lebih presisi. Namun Anda bisa memilih wilayah secara manual jika GPS tidak tersedia.' },
    { q: 'Berapa akurasi prediksi cuacanya?', a: 'Prediksi curah hujan 7 hari memiliki akurasi ~94% berdasarkan validasi terhadap data stasiun BMKG terdekat.' },
    { q: 'Apakah data lahan saya aman?', a: 'Data Anda tersimpan di server cloud aman dan tidak pernah dibagikan kepada pihak ketiga.' },
  ];

  return (
    <section id="faq" className="px-6 py-20 md:py-28 lg:px-20 bg-white border-t border-[#e4e4e7]">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-[#71717a] mb-4">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#09090b]">
            Pertanyaan yang sering ditanyakan.
          </h2>
        </div>

        <div className="space-y-0 border-t border-[#e4e4e7]">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[#e4e4e7]">
              <button
                className="w-full flex items-center justify-between py-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-base font-medium text-[#09090b]">{faq.q}</span>
                <ChevronRight size={16} className={`text-[#71717a] flex-shrink-0 transition-transform ${open === i ? 'rotate-90' : ''}`} />
              </button>
              {open === i && (
                <div className="pb-5 text-sm text-[#71717a] leading-relaxed">
                  {faq.a}
                </div>
              )}
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
    <section className="px-6 py-24 md:py-32 lg:px-20 bg-[#09090b]">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-6">Mulai Sekarang</p>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
          Teknologi cuaca untuk setiap petani Indonesia.
        </h2>
        <p className="text-[#71717a] text-base mb-10 leading-relaxed">
          Gratis. Mudah digunakan. Berbasis data resmi BMKG.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors">
            Daftar Gratis <ArrowRight size={16} />
          </Link>
          <Link to="/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white font-medium hover:border-white/40 transition-colors">
            Masuk ke Akun
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white border-t border-[#e4e4e7]">
      <div className="px-6 py-16 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-md bg-emerald-600 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">RT</span>
              </div>
              <span className="text-base font-semibold text-[#09090b]">RamalTani</span>
            </div>
            <p className="text-sm text-[#71717a] leading-relaxed max-w-xs">
              Platform pertanian cerdas berbasis data cuaca BMKG untuk petani Indonesia.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#09090b] mb-4">Platform</h4>
            <ul className="space-y-3">
              {['Rekomendasi Tanam', 'Peta Risiko', 'Peringatan Dini', 'Komunitas'].map(item => (
                <li key={item}>
                  <a href="#fitur" className="text-sm text-[#71717a] hover:text-[#09090b] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#09090b] mb-4">Wilayah</h4>
            <ul className="space-y-3">
              {['Jawa Tengah', 'Jawa Timur', 'Jawa Barat', 'Lihat Semua'].map(item => (
                <li key={item}>
                  <a href="#wilayah" className="text-sm text-[#71717a] hover:text-[#09090b] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#09090b] mb-4">Lainnya</h4>
            <ul className="space-y-3">
              {['FAQ', 'Tentang Kami', 'Kontak', 'Kebijakan Privasi'].map(item => (
                <li key={item}>
                  <a href="#faq" className="text-sm text-[#71717a] hover:text-[#09090b] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e4e4e7] px-6 py-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#71717a]">© 2026 RamalTani. Seluruh hak dilindungi.</p>
          <div className="flex items-center gap-4 text-xs text-[#71717a]">
            <span>Data: BMKG API</span>
            <span>·</span>
            <span>Open-Meteo</span>
            <span>·</span>
            <span>Postgres Cloud</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <StatsBar />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RegionalSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, ArrowRight } from 'lucide-react';

// ─── Navbar (Evasion: floating pill, transparent → frosted) ───────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { href: '#fitur', label: 'Fitur' },
    { href: '#teknologi', label: 'Teknologi' },
    { href: '#wilayah', label: 'Wilayah' },
    { href: '#cara-kerja', label: 'Cara Kerja' },
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl transition-all duration-300">
      <div className={`flex items-center justify-between transition-all duration-300 px-5 py-2.5 rounded-2xl ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border border-[#e4e4e7]'
          : 'bg-transparent'
      }`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-emerald-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">RT</span>
          </div>
          <span className={`text-sm font-medium tracking-tight transition-colors ${scrolled ? 'text-[#09090b]' : 'text-white'}`}>
            RamalTani
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className={`text-sm transition-colors ${scrolled ? 'text-[#71717a] hover:text-[#09090b]' : 'text-white/70 hover:text-white'}`}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className={`text-sm transition-colors ${scrolled ? 'text-[#71717a] hover:text-[#09090b]' : 'text-white/70 hover:text-white'}`}>
            Masuk
          </Link>
          <Link to="/register"
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
              scrolled
                ? 'bg-[#09090b] text-white hover:bg-[#3f3f46]'
                : 'bg-white text-[#09090b] hover:bg-white/90'
            }`}>
            Mulai Gratis
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden transition-colors ${scrolled ? 'text-[#09090b]' : 'text-white'}`}
          aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-white rounded-2xl border border-[#e4e4e7] shadow-lg p-4 space-y-3">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block text-sm text-[#09090b] py-1">
              {l.label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#e4e4e7] space-y-2">
            <Link to="/login" onClick={() => setMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm border border-[#e4e4e7] rounded-full text-[#09090b]">
              Masuk
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm bg-[#09090b] text-white rounded-full">
              Mulai Gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero (Evasion: full-screen image, brand text at bottom-left) ─────────────
function HeroSection() {
  return (
    <section className="relative bg-[#09090b]">
      {/* Sticky hero container — Evasion pattern */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          {/* Full-screen hero image */}
          <div className="relative w-full h-full flex-shrink-0 overflow-hidden">
            <img
              alt="Sawah padi hijau menjelang panen di Jawa"
              src="https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=2000"
              className="object-cover w-full h-full"
              style={{ position: 'absolute', inset: 0 }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

            {/* Brand text — pinned to bottom like Evasion */}
            <div className="absolute inset-0 flex items-end overflow-hidden pb-16 px-6 lg:px-20">
              <h1 className="w-full text-[18vw] sm:text-[14vw] font-medium leading-[0.85] tracking-tighter text-white">
                RAMAL<br />TANI
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll spacer */}
      <div className="h-[200vh]" />

      {/* Tagline below hero */}
      <div className="px-6 pt-20 pb-24 md:pt-32 md:px-12 md:pb-32 lg:px-20 lg:pt-40 lg:pb-40 bg-[#09090b]">
        <p className="mx-auto max-w-2xl text-center text-2xl leading-relaxed text-white/50 md:text-3xl lg:text-[2rem] lg:leading-snug">
          Baca cuaca.<br />
          Atur tanam.<br />
          Jaga panen.
        </p>
      </div>
    </section>
  );
}

// ─── Featured (Evasion: 2-column large image cards with bottom label badge) ───
function FeaturedSection() {
  return (
    <section id="fitur" className="bg-white">
      {/* Sticky scroll reveal — 2 product cards */}
      <div className="relative" style={{ height: '200vh' }}>
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="relative w-full">
            {/* Background heading */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <h2 className="text-[12vw] font-medium leading-[0.95] tracking-tighter text-[#09090b] md:text-[10vw] lg:text-[8vw] text-center px-6">
                Rekomendasi & Risiko.
              </h2>
            </div>

            {/* 2 feature cards */}
            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-12 lg:px-20">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  alt="Petani memeriksa tanaman padi di sawah"
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000"
                  className="object-cover w-full h-full group-hover:scale-105 transition-all duration-700"
                  style={{ position: 'absolute', inset: 0 }}
                />
                <div className="absolute bottom-6 left-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                    Rekomendasi Tanam
                  </span>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  alt="Peta risiko lahan pertanian dengan data cuaca BMKG"
                  src="https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=1000"
                  className="object-cover w-full h-full group-hover:scale-105 transition-all duration-700"
                  style={{ position: 'absolute', inset: 0 }}
                />
                <div className="absolute bottom-6 left-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                    Peta Risiko GIS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description paragraph */}
      <div className="px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:pb-12">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[#71717a] mb-6">Platform Utama</p>
          <p className="text-2xl text-center leading-relaxed text-[#71717a] md:text-3xl">
            Rekomendasi tanam presisi dan peta risiko real-time dirancang untuk kondisi pertanian Indonesia.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Technology (Evasion: 3-col grid of image cards with label + title) ────────
function TechnologySection() {
  const items = [
    {
      label: 'Cuaca',
      title: 'Data BMKG Real-Time',
      img: 'https://images.unsplash.com/photo-1561553590-267fc716698a?q=80&w=800',
      alt: 'Stasiun cuaca di lahan pertanian',
    },
    {
      label: 'Prediksi',
      title: 'Model Curah Hujan 14 Hari',
      img: 'https://images.unsplash.com/photo-1504608524841-42584120d693?q=80&w=800',
      alt: 'Awan dan cuaca di atas sawah',
    },
    {
      label: 'Risiko',
      title: 'Deteksi Anomali Iklim',
      img: 'https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=800',
      alt: 'Cuaca ekstrem El Niño',
    },
    {
      label: 'Lokasi',
      title: 'GPS Lahan Presisi',
      img: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=800',
      alt: 'Pemetaan sawah dari udara',
    },
    {
      label: 'Peringatan',
      title: 'Early Warning Banjir & Kering',
      img: 'https://images.unsplash.com/photo-1580407196238-dac33f57c410?q=80&w=800',
      alt: 'Banjir di lahan pertanian',
    },
    {
      label: 'Analitik',
      title: 'Riwayat & Evaluasi Musim',
      img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800',
      alt: 'Data analitik pertanian',
    },
  ];

  return (
    <section id="teknologi" className="bg-white">
      <div className="px-6 py-16 text-center md:px-12 md:py-24 lg:px-20 lg:py-28 lg:pb-16">
        <h2 className="text-3xl font-medium tracking-tight text-[#09090b] md:text-4xl lg:text-5xl">
          Teknologi Presisi.<br />Dirancang untuk Sawah.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-[#71717a]">Teknologi</p>
      </div>

      <div className="grid grid-cols-1 gap-4 px-6 pb-16 md:grid-cols-3 md:px-12 lg:px-20">
        {items.map((item, i) => (
          <div key={i} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f4f4f5]">
              <img
                alt={item.alt}
                src={item.img}
                loading="lazy"
                className="object-cover w-full h-full group-hover:scale-105 transition-all duration-700 ease-out"
                style={{ position: 'absolute', inset: 0 }}
              />
            </div>
            <div className="py-5">
              <p className="mb-2 text-xs uppercase tracking-widest text-[#71717a]">{item.label}</p>
              <h3 className="text-[#09090b] text-lg font-semibold tracking-tight">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center px-6 pb-24 md:px-12 lg:px-20">
        <Link to="/register"
          className="px-7 py-3 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
          Mulai Gunakan Platform
        </Link>
      </div>
    </section>
  );
}

// ─── Gallery (Evasion: horizontal scroll of large images) ─────────────────────
function GallerySection() {
  const scrollRef = useRef(null);

  const photos = [
    { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200', alt: 'Sawah hijau saat fajar di Jawa' },
    { src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200', alt: 'Kebun sayuran di pegunungan' },
    { src: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200', alt: 'Petani memanen padi' },
    { src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200', alt: 'Tanaman jagung di lahan luas' },
    { src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200', alt: 'Ladang pertanian saat senja' },
    { src: 'https://images.unsplash.com/photo-1541795083-1b160cf4f3d7?q=80&w=1200', alt: 'Irigasi sawah tradisional' },
  ];

  return (
    <section id="wilayah" className="relative bg-white" style={{ height: '100vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full items-center">
          <div
            ref={scrollRef}
            className="flex gap-5 px-6 overflow-x-auto scrollbar-hide"
            style={{ touchAction: 'pan-y' }}
          >
            {photos.map((photo, i) => (
              <div
                key={i}
                className="relative h-[70vh] w-[85vw] flex-shrink-0 overflow-hidden rounded-2xl md:w-[60vw] lg:w-[45vw]"
              >
                <img
                  alt={photo.alt}
                  src={photo.src}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="object-cover w-full h-full"
                  style={{ position: 'absolute', inset: 0 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works (Evasion accessories style: 2-col / 3-col grid) ────────────
function HowItWorksSection() {
  const steps = [
    {
      label: 'Langkah 01',
      title: 'Deteksi Lokasi GPS',
      desc: 'Platform mendeteksi koordinat lahan Anda secara otomatis via GPS atau pilih wilayah manual dari daftar 8 sentra padi.',
      img: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?q=80&w=800',
    },
    {
      label: 'Langkah 02',
      title: 'Ambil Data BMKG',
      desc: 'Sistem menarik data cuaca real-time dari stasiun BMKG dan Open-Meteo terdekat dengan koordinat lahan Anda.',
      img: 'https://images.unsplash.com/photo-1561553590-267fc716698a?q=80&w=800',
    },
    {
      label: 'Langkah 03',
      title: 'Analisis & Rekomendasi',
      desc: 'Algoritma menganalisis pola hujan dan mengeluarkan saran: tanggal terbaik mulai tanam dan peringatan dini risiko.',
      img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800',
    },
    {
      label: 'Langkah 04',
      title: 'Petani Bertindak',
      desc: 'Anda menerima instruksi konkret via dashboard dan notifikasi: kapan tanam, kapan tunda, apa yang perlu disiapkan.',
      img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800',
    },
    {
      label: 'Langkah 05',
      title: 'Monitor & Evaluasi',
      desc: 'Pantau perkembangan musim tanam dan evaluasi hasil di akhir musim untuk perencanaan yang lebih baik.',
      img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800',
    },
    {
      label: 'Langkah 06',
      title: 'Komunitas & Edukasi',
      desc: 'Berbagi pengalaman di forum komunitas dan pelajari praktik pertanian cerdas iklim terbaru dari para ahli.',
      img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800',
    },
  ];

  return (
    <section id="cara-kerja" className="bg-white border-t border-[#e4e4e7]">
      <div className="px-6 py-16 md:px-12 md:py-20 lg:px-20">
        <h2 className="text-3xl font-medium tracking-tight text-[#09090b] md:text-4xl">
          Cara Kerja Platform
        </h2>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto px-6 pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
        {steps.map((step, i) => (
          <div key={i} className="group flex-shrink-0 w-[75vw] snap-center">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-[#f4f4f5]">
              <img alt={step.title} src={step.img} loading="lazy"
                className="object-cover w-full h-full group-hover:scale-105 transition-all duration-700 ease-out"
                style={{ position: 'absolute', inset: 0 }} />
            </div>
            <div className="py-5">
              <p className="mb-2 text-xs uppercase tracking-widest text-[#71717a]">{step.label}</p>
              <h3 className="text-base font-semibold text-[#09090b] mb-2 leading-snug tracking-tight">{step.title}</h3>
              <p className="text-sm text-[#71717a] leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: 3-col grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-8 md:px-12 lg:px-20 pb-20">
        {steps.map((step, i) => (
          <div key={i} className="group">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-[#f4f4f5]">
              <img alt={step.title} src={step.img} loading="lazy"
                className="object-cover w-full h-full group-hover:scale-105 transition-all duration-700 ease-out"
                style={{ position: 'absolute', inset: 0 }} />
            </div>
            <div className="py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="mb-2 text-xs uppercase tracking-widest text-[#71717a]">{step.label}</p>
                  <h3 className="text-lg font-semibold leading-snug text-[#09090b] tracking-tight mb-2">{step.title}</h3>
                  <p className="text-sm text-[#71717a] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Stats Spec Bar (Evasion: border grid) ────────────────────────────────────
function SpecBar() {
  const specs = [
    { label: 'Sentra Pertanian', value: '8+' },
    { label: 'Petani Terhubung', value: '45K+' },
    { label: 'Akurasi BMKG', value: '94%' },
    { label: 'Waktu Setup', value: '2 mnt' },
  ];

  return (
    <section className="bg-white">
      <div className="flex items-center justify-center gap-6 pb-16 px-6">
        <Link to="/register"
          className="px-7 py-3 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
          Daftar Gratis — Mulai Sekarang
        </Link>
      </div>

      <div className="grid grid-cols-2 border-t border-[#e4e4e7] md:grid-cols-4">
        {specs.map((s, i) => (
          <div key={i} className={`border-b border-r border-[#e4e4e7] p-8 text-center last:border-r-0 md:border-b-0 ${i % 2 === 1 ? 'border-r-0 md:border-r' : ''}`}>
            <p className="mb-2 text-xs uppercase tracking-widest text-[#71717a]">{s.label}</p>
            <p className="font-medium text-[#09090b] text-4xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Video / full-width image */}
      <div className="relative aspect-[16/9] w-full md:aspect-[21/9] overflow-hidden">
        <img
          alt="Pemandangan sawah padi dari udara — lahan pertanian Indonesia"
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000"
          className="object-cover w-full h-full"
          style={{ position: 'absolute', inset: 0 }}
        />
        <div className="absolute inset-0 bg-emerald-900/20" />
      </div>
    </section>
  );
}

// ─── About / Editorial Text (Evasion: large paragraph + image) ────────────────
function AboutSection() {
  return (
    <section className="bg-white">
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36">
        <p className="mx-auto max-w-4xl text-2xl leading-relaxed text-[#09090b] md:text-3xl lg:text-[2.2rem] lg:leading-snug">
          RamalTani menggabungkan data satelit Himawari-9 dengan jaringan stasiun BMKG — dirancang khusus untuk membantu petani Indonesia membuat keputusan tanam yang lebih cerdas, lebih aman, dan lebih menguntungkan di tengah ketidakpastian iklim.
        </p>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          alt="Petani Indonesia di sawah saat panen raya"
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000"
          loading="lazy"
          className="object-cover w-full h-full"
          style={{ position: 'absolute', inset: 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: 'Apakah RamalTani gratis untuk petani?', a: 'Ya, seluruh fitur utama RamalTani tersedia gratis untuk petani. Cukup daftar dan mulai pantau cuaca lahan Anda.' },
    { q: 'Data cuaca dari mana sumbernya?', a: 'Data diambil langsung dari API resmi BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) serta Open-Meteo dengan resolusi tinggi.' },
    { q: 'Apakah GPS wajib aktif?', a: 'GPS disarankan agar rekomendasi lebih presisi ke koordinat lahan. Namun Anda bisa memilih wilayah secara manual.' },
    { q: 'Berapa akurasi prediksi cuacanya?', a: 'Prediksi curah hujan 7 hari memiliki akurasi ~94% berdasarkan validasi terhadap data stasiun BMKG terdekat.' },
    { q: 'Apakah data lahan saya aman?', a: 'Data Anda tersimpan di server cloud aman dan tidak pernah dibagikan kepada pihak ketiga.' },
  ];

  return (
    <section className="bg-white border-t border-[#e4e4e7]">
      <div className="px-6 py-16 md:px-12 md:py-20 lg:px-20 max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-[#71717a] mb-10">FAQ</p>
        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <div key={i} className="border-t border-[#e4e4e7]">
              <button
                className="w-full flex items-center justify-between py-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-base font-medium text-[#09090b]">{faq.q}</span>
                <ChevronRight size={16} className={`text-[#71717a] flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-90' : ''}`} />
              </button>
              {open === i && (
                <p className="pb-5 text-sm text-[#71717a] leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
          <div className="border-t border-[#e4e4e7]" />
        </div>
      </div>
    </section>
  );
}

// ─── Footer (Evasion multi-column) ────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white">
      <div className="border-t border-[#e4e4e7] px-6 py-14 md:px-12 md:py-18 lg:px-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-emerald-600 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">RT</span>
              </div>
              <span className="text-base font-medium text-[#09090b]">RamalTani</span>
            </div>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#71717a]">
              Platform pertanian cerdas berbasis data cuaca BMKG. Rekomendasi tanam, peta risiko, dan peringatan dini untuk petani Indonesia.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-[#09090b]">Platform</h4>
            <ul className="space-y-3">
              {['Rekomendasi Tanam', 'Peta Risiko', 'Peringatan Dini', 'Komunitas'].map(item => (
                <li key={item}>
                  <a href="#fitur" className="text-sm text-[#71717a] transition-colors hover:text-[#09090b]">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-[#09090b]">Wilayah</h4>
            <ul className="space-y-3">
              {['Jawa Tengah', 'Jawa Timur', 'Jawa Barat', 'Lihat Semua'].map(item => (
                <li key={item}>
                  <a href="#wilayah" className="text-sm text-[#71717a] transition-colors hover:text-[#09090b]">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-[#09090b]">Info</h4>
            <ul className="space-y-3">
              {['FAQ', 'Tentang Kami', 'Kontak', 'Kebijakan Privasi'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#71717a] transition-colors hover:text-[#09090b]">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e4e4e7] px-6 py-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-[#71717a]">© 2026 RamalTani. Seluruh hak dilindungi.</p>
          <div className="flex items-center gap-5 text-xs text-[#71717a]">
            <a href="#" className="hover:text-[#09090b] transition-colors">BMKG API</a>
            <a href="#" className="hover:text-[#09090b] transition-colors">Open-Meteo</a>
            <a href="#" className="hover:text-[#09090b] transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="bg-white font-sans antialiased">
      <Navbar />
      <HeroSection />
      <FeaturedSection />
      <TechnologySection />
      <GallerySection />
      <HowItWorksSection />
      <SpecBar />
      <AboutSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

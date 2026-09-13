import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

// ─── Navbar (floating pill, transparent → frosted glass) ─────────────────────
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
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-3xl">
      <div className={`flex items-center justify-between px-5 py-2.5 rounded-2xl transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border border-[#e4e4e7]'
          : 'bg-transparent'
      }`}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">RT</span>
          </div>
          <span className={`text-sm font-medium tracking-tight transition-colors ${scrolled ? 'text-[#09090b]' : 'text-white'}`}>
            RamalTani
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className={`text-sm transition-colors ${scrolled ? 'text-[#71717a] hover:text-[#09090b]' : 'text-white/70 hover:text-white'}`}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className={`text-sm transition-colors ${scrolled ? 'text-[#71717a] hover:text-[#09090b]' : 'text-white/70 hover:text-white'}`}>
            Masuk
          </Link>
          <Link to="/register" className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
            scrolled ? 'bg-[#09090b] text-white hover:bg-[#3f3f46]' : 'bg-white text-[#09090b] hover:bg-white/90'
          }`}>
            Mulai Gratis
          </Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden ${scrolled ? 'text-[#09090b]' : 'text-white'}`} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-2 bg-white rounded-2xl border border-[#e4e4e7] shadow-lg p-4 space-y-3">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="block text-sm text-[#09090b] py-1">{l.label}</a>
          ))}
          <div className="pt-3 border-t border-[#e4e4e7] space-y-2">
            <Link to="/login" onClick={() => setMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm border border-[#e4e4e7] rounded-full text-[#09090b]">Masuk</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm bg-[#09090b] text-white rounded-full">Mulai Gratis</Link>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero (Evasion: sticky full-screen photo, brand text at bottom) ───────────
function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Parallax: foto bergerak lebih lambat dari scroll
  const imgOffset = scrollY * 0.3;

  return (
    <section className="relative bg-[#09090b]" style={{ height: '250vh' }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative w-full h-full">
          {/* Parallax image */}
          <img
            alt="Sawah padi hijau menjelang panen di Jawa"
            src="https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=2000"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{ transform: `translate3d(0, ${imgOffset}px, 0)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

          {/* Brand text — slide-in on load */}
          <div className="absolute inset-0 flex items-end pb-16 px-6 lg:px-20 overflow-hidden">
            <h1 className="w-full font-medium leading-[0.85] tracking-tighter text-white"
              style={{ fontSize: 'clamp(80px, 15vw, 220px)' }}>
              <span className="block overflow-hidden">
                <span style={{ animation: 'heroSlideUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both', display: 'block' }}>
                  RAMAL
                </span>
              </span>
              <span className="block overflow-hidden">
                <span style={{ animation: 'heroSlideUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both', display: 'block' }}>
                  TANI
                </span>
              </span>
            </h1>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 right-8 flex items-center gap-2"
            style={{ animation: 'heroFadeIn 1s ease-out 1.2s both' }}>
            <span className="text-xs text-white/50 uppercase tracking-widest hidden md:block">Scroll</span>
            <div className="w-px h-10 bg-white/30" />
          </div>
        </div>
      </div>

      {/* Tagline below hero */}
      <div className="relative bg-[#09090b] px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <p className="mx-auto max-w-2xl text-center text-2xl leading-relaxed text-white/40 md:text-3xl lg:text-[2rem] lg:leading-relaxed">
          Data meteorologi yang rumit, diterjemahkan menjadi keputusan tanam yang sederhana dan tepat.
        </p>
      </div>
    </section>
  );
}

// ─── Featured: 2-column cards slide dari kiri + kanan ─────────────────────────
function FeaturedSection() {
  const ref = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="fitur" className="bg-white" ref={ref}>
      {/* Heading */}
      <div className="px-6 pt-24 pb-10 md:px-12 lg:px-20">
        <h2 className="reveal-blur text-3xl font-medium tracking-tight text-[#09090b] md:text-4xl lg:text-5xl max-w-lg">
          Dua fitur utama yang mengubah cara bertani.
        </h2>
      </div>

      {/* 2-column image cards — slide in dari kiri dan kanan */}
      <div className="grid grid-cols-1 gap-4 px-6 pb-16 md:grid-cols-2 md:px-12 lg:px-20">
        <div className="reveal-left">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f4f4f5] group">
            <img
              alt="Petani memeriksa tanaman padi di sawah"
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.15)] text-white border border-white/20">
                Rekomendasi Tanam
              </span>
            </div>
          </div>
          <div className="pt-5">
            <p className="text-xs uppercase tracking-widest text-[#71717a] mb-2">Fitur 01</p>
            <h3 className="text-lg font-semibold text-[#09090b] tracking-tight">Jendela waktu terbaik berdasarkan probabilitas hujan BMKG 7–14 hari ke depan.</h3>
          </div>
        </div>

        <div className="reveal-right reveal-delay-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f4f4f5] group">
            <img
              alt="Peta lahan pertanian dari udara"
              src="https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=1000"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.15)] text-white border border-white/20">
                Peta Risiko GIS
              </span>
            </div>
          </div>
          <div className="pt-5">
            <p className="text-xs uppercase tracking-widest text-[#71717a] mb-2">Fitur 02</p>
            <h3 className="text-lg font-semibold text-[#09090b] tracking-tight">Visualisasi zona bahaya per kecamatan dengan kode warna risiko nyata.</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Technology: 6-card grid dengan stagger reveal ───────────────────────────
function TechnologySection() {
  const ref = useScrollReveal({ threshold: 0.05 });

  const items = [
    { label: 'Cuaca', title: 'Data BMKG Real-Time', img: 'https://images.unsplash.com/photo-1561553590-267fc716698a?q=80&w=800', alt: 'Stasiun cuaca' },
    { label: 'Prediksi', title: 'Model Curah Hujan 14 Hari', img: 'https://images.unsplash.com/photo-1504608524841-42584120d693?q=80&w=800', alt: 'Awan cuaca' },
    { label: 'Risiko', title: 'Deteksi Anomali Iklim', img: 'https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=800', alt: 'Cuaca ekstrem' },
    { label: 'Lokasi', title: 'GPS Lahan Presisi', img: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=800', alt: 'Sawah dari udara' },
    { label: 'Peringatan', title: 'Early Warning Banjir & Kering', img: 'https://images.unsplash.com/photo-1580407196238-dac33f57c410?q=80&w=800', alt: 'Banjir lahan' },
    { label: 'Analitik', title: 'Riwayat & Evaluasi Musim', img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800', alt: 'Analitik pertanian' },
  ];

  return (
    <section id="teknologi" className="bg-white border-t border-[#e4e4e7]" ref={ref}>
      <div className="px-6 pt-20 pb-10 md:px-12 md:pt-28 lg:px-20">
        <p className="reveal-blur text-xs uppercase tracking-widest text-[#71717a] mb-4">Teknologi</p>
        <h2 className="reveal-up reveal-delay-1 text-3xl font-medium tracking-tight text-[#09090b] md:text-4xl lg:text-5xl max-w-lg">
          Presisi ilmiah untuk setiap petak sawah.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 px-6 pb-16 md:grid-cols-3 md:px-12 lg:px-20">
        {items.map((item, i) => (
          <div key={i} className={`group reveal-up reveal-delay-${Math.min(i + 1, 6)}`}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f4f4f5]">
              <img
                alt={item.alt}
                src={item.img}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="py-5">
              <p className="mb-2 text-xs uppercase tracking-widest text-[#71717a]">{item.label}</p>
              <h3 className="text-base font-semibold text-[#09090b] tracking-tight">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center px-6 pb-20 md:px-12 lg:px-20">
        <Link to="/register"
          className="reveal-up px-7 py-3 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
          Mulai Gunakan Platform
        </Link>
      </div>
    </section>
  );
}

// ─── Gallery: horizontal scroll tied to page scroll (Evasion signature) ───────
function GallerySection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const photos = [
    { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200', alt: 'Sawah hijau saat fajar' },
    { src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200', alt: 'Kebun sayuran pegunungan' },
    { src: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200', alt: 'Petani memanen padi' },
    { src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200', alt: 'Ladang jagung luas' },
    { src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200', alt: 'Pertanian saat senja' },
    { src: 'https://images.unsplash.com/photo-1541795083-1b160cf4f3d7?q=80&w=1200', alt: 'Irigasi sawah' },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let rafId = null;

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const viewH = window.innerHeight;
        const sectionH = rect.height;

        // Progress: 0 = section masuk bawah, 1 = section keluar atas
        const progress = Math.min(1, Math.max(0, (viewH - rect.top) / (viewH + sectionH)));

        // Gerakkan track ke kiri sesuai progress
        const maxOffset = track.scrollWidth - window.innerWidth;
        const offset = progress * maxOffset * 0.6;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="wilayah" className="bg-white border-t border-[#e4e4e7]" style={{ height: '200vh' }} ref={sectionRef}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-6 mb-8 md:px-12 lg:px-20">
          <p className="text-xs uppercase tracking-widest text-[#71717a]">Lahan Pertanian Indonesia</p>
        </div>
        <div
          ref={trackRef}
          className="flex gap-5 pl-6 will-change-transform"
          style={{ transition: 'transform 0.08s ease-out' }}
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 overflow-hidden rounded-2xl"
              style={{ height: '65vh', width: 'clamp(300px, 50vw, 650px)' }}
            >
              <img
                alt={photo.alt}
                src={photo.src}
                loading={i < 2 ? 'eager' : 'lazy'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works: 3-col grid dengan stagger ─────────────────────────────────
function HowItWorksSection() {
  const ref = useScrollReveal({ threshold: 0.05 });

  const steps = [
    { label: '01', title: 'Deteksi Lokasi GPS', desc: 'Koordinat lahan Anda terdeteksi otomatis atau pilih manual dari 8 sentra pertanian utama.', img: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?q=80&w=800' },
    { label: '02', title: 'Ambil Data BMKG', desc: 'Data cuaca real-time dari stasiun BMKG & Open-Meteo terdekat koordinat lahan Anda.', img: 'https://images.unsplash.com/photo-1561553590-267fc716698a?q=80&w=800' },
    { label: '03', title: 'Analisis Risiko', desc: 'Algoritma menganalisis pola hujan dan menghitung probabilitas risiko gagal tanam.', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800' },
    { label: '04', title: 'Rekomendasi Konkret', desc: 'Saran langsung: tanggal mulai tanam, peringatan dini cuaca ekstrem, & alternatif waktu.', img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800' },
    { label: '05', title: 'Monitor Musim', desc: 'Pantau perkembangan musim tanam dan evaluasi hasil di akhir musim.', img: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=800' },
    { label: '06', title: 'Komunitas & Edukasi', desc: 'Forum komunitas petani dan pusat edukasi pertanian cerdas iklim dari para ahli.', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800' },
  ];

  return (
    <section id="cara-kerja" className="bg-white border-t border-[#e4e4e7]" ref={ref}>
      <div className="px-6 pt-20 pb-10 md:px-12 md:pt-28 lg:px-20">
        <p className="reveal-blur text-xs uppercase tracking-widest text-[#71717a] mb-4">Cara Kerja</p>
        <h2 className="reveal-up reveal-delay-1 text-3xl font-medium tracking-tight text-[#09090b] md:text-4xl max-w-md">
          Dari data ke keputusan dalam hitungan detik.
        </h2>
      </div>

      {/* Mobile horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto px-6 pb-4 md:hidden scrollbar-hide">
        {steps.map((step, i) => (
          <div key={i} className="flex-shrink-0 w-[70vw]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-[#f4f4f5]">
              <img alt={step.title} src={step.img} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="pt-4">
              <p className="text-xs uppercase tracking-widest text-[#71717a] mb-2">{step.label}</p>
              <h3 className="text-base font-semibold text-[#09090b] mb-1 leading-snug">{step.title}</h3>
              <p className="text-sm text-[#71717a] leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop 3-col */}
      <div className="hidden md:grid md:grid-cols-3 gap-8 px-12 pb-20 lg:px-20">
        {steps.map((step, i) => (
          <div key={i} className={`group reveal-up reveal-delay-${Math.min(i + 1, 6)}`}>
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-[#f4f4f5]">
              <img alt={step.title} src={step.img} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            </div>
            <div className="pt-5">
              <p className="mb-2 text-xs uppercase tracking-widest text-[#71717a]">{step.label}</p>
              <h3 className="text-base font-semibold text-[#09090b] tracking-tight mb-2">{step.title}</h3>
              <p className="text-sm text-[#71717a] leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Spec Bar: border-grid + full-width landscape ─────────────────────────────
function SpecBar() {
  const ref = useScrollReveal({ threshold: 0.1 });

  const specs = [
    { label: 'Sentra Pertanian', value: '8+' },
    { label: 'Petani Terhubung', value: '45K+' },
    { label: 'Akurasi BMKG', value: '94%' },
    { label: 'Waktu Setup', value: '2 mnt' },
  ];

  return (
    <section className="bg-white border-t border-[#e4e4e7]" ref={ref}>
      <div className="flex justify-center py-12 px-6">
        <Link to="/register"
          className="reveal-up px-8 py-3.5 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors inline-flex items-center gap-2">
          Daftar Gratis <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 border-t border-[#e4e4e7] md:grid-cols-4">
        {specs.map((s, i) => (
          <div key={i} className={`reveal-up reveal-delay-${i + 1} border-b border-[#e4e4e7] p-8 text-center ${
            i < 3 ? 'border-r' : ''
          } ${i >= 2 ? 'md:border-b-0' : ''}`}>
            <p className="mb-2 text-xs uppercase tracking-widest text-[#71717a]">{s.label}</p>
            <p className="font-medium text-[#09090b] text-4xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Full-width image */}
      <div className="relative aspect-[16/9] w-full md:aspect-[21/9] overflow-hidden">
        <img
          alt="Pemandangan sawah dari udara — lahan pertanian Indonesia"
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-emerald-900/15" />
      </div>
    </section>
  );
}

// ─── About: editorial paragraph ───────────────────────────────────────────────
function AboutSection() {
  const ref = useScrollReveal({ threshold: 0.15 });

  return (
    <section className="bg-white border-t border-[#e4e4e7]" ref={ref}>
      <div className="px-6 py-20 md:px-12 md:py-28 lg:px-20 lg:py-36">
        <p className="reveal-blur mx-auto max-w-4xl text-2xl leading-relaxed text-[#09090b] md:text-3xl lg:text-[2.2rem] lg:leading-snug">
          RamalTani menggabungkan data satelit Himawari-9 dengan jaringan stasiun BMKG — dirancang khusus untuk membantu petani Indonesia membuat keputusan tanam yang lebih cerdas, lebih aman, dan lebih menguntungkan di tengah ketidakpastian iklim.
        </p>
      </div>

      <div className="reveal-scale relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
        <img
          alt="Petani Indonesia di sawah saat panen raya"
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState(null);
  const ref = useScrollReveal({ threshold: 0.1 });

  const faqs = [
    { q: 'Apakah RamalTani gratis untuk petani?', a: 'Ya, seluruh fitur utama tersedia gratis. Cukup daftar dan mulai pantau cuaca lahan Anda.' },
    { q: 'Data cuaca dari mana sumbernya?', a: 'Data diambil langsung dari API resmi BMKG dan Open-Meteo dengan resolusi tinggi per koordinat.' },
    { q: 'Apakah GPS wajib aktif?', a: 'GPS disarankan agar rekomendasi lebih presisi. Namun Anda bisa memilih wilayah secara manual.' },
    { q: 'Berapa akurasi prediksi cuacanya?', a: 'Prediksi curah hujan 7 hari memiliki akurasi ~94% berdasarkan validasi terhadap data stasiun BMKG terdekat.' },
    { q: 'Apakah data lahan saya aman?', a: 'Data tersimpan di server cloud aman dengan enkripsi standar industri dan tidak pernah dibagikan ke pihak ketiga.' },
  ];

  return (
    <section className="bg-white border-t border-[#e4e4e7]" ref={ref}>
      <div className="px-6 py-16 md:px-12 md:py-20 lg:px-20 max-w-2xl mx-auto">
        <p className="reveal-blur text-xs uppercase tracking-widest text-[#71717a] mb-10">FAQ</p>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} className={`reveal-up reveal-delay-${Math.min(i + 1, 5)} border-t border-[#e4e4e7]`}>
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

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white">
      <div className="border-t border-[#e4e4e7] px-6 py-14 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-emerald-600 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">RT</span>
              </div>
              <span className="text-base font-medium text-[#09090b]">RamalTani</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-[#71717a]">
              Platform pertanian cerdas berbasis data cuaca BMKG untuk petani Indonesia.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-medium text-[#09090b]">Platform</h4>
            <ul className="space-y-3">
              {['Rekomendasi Tanam', 'Peta Risiko', 'Peringatan Dini', 'Komunitas'].map(item => (
                <li key={item}><a href="#fitur" className="text-sm text-[#71717a] hover:text-[#09090b] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-medium text-[#09090b]">Wilayah</h4>
            <ul className="space-y-3">
              {['Jawa Tengah', 'Jawa Timur', 'Jawa Barat', 'Lihat Semua'].map(item => (
                <li key={item}><a href="#wilayah" className="text-sm text-[#71717a] hover:text-[#09090b] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-medium text-[#09090b]">Info</h4>
            <ul className="space-y-3">
              {['FAQ', 'Tentang Kami', 'Kontak', 'Kebijakan Privasi'].map(item => (
                <li key={item}><a href="#" className="text-sm text-[#71717a] hover:text-[#09090b] transition-colors">{item}</a></li>
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

// ─── Hero animation keyframes (inline) ───────────────────────────────────────
const heroStyles = `
  @keyframes heroSlideUp {
    from { opacity: 0; transform: translateY(60px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroFadeIn {
    from { opacity: 0; }
    to   { opacity: 0.7; }
  }
`;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="bg-white font-sans antialiased">
      <style>{heroStyles}</style>
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

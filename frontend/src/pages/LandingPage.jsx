import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  CloudSun, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Sparkles,
  ChevronDown,
  Layers,
  Activity,
  Globe2
} from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

// ─── Word Mask helper (Kage-style word-by-word reveal) ────────────────────────
function WordMaskText({ text, className = '' }) {
  const words = text.split(' ');
  return (
    <span className={`word-reveal ${className}`}>
      {words.map((word, idx) => (
        <span key={idx} className="word-mask">
          <span className="word" style={{ '--word-delay': `${idx * 40}ms` }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

// ─── Persistent Three.js Background (SylvaHero living-green) ─────────────────
function ThreeJsLivingBackground({ scrollY }) {
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Sync scroll & mouse to iframe for persistent 3D backdrop
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      setLoaded(true);
      try {
        // Connect all dock navigation items
        doc.querySelectorAll('[data-nav]').forEach((item) => {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-nav');
            if (target === 'login') {
              window.location.href = '/login';
            } else if (target === 'top') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              const el = document.getElementById(target);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });

        // Connect hero liquid button "Mulai Pantau" to /register
        const btn = doc.querySelector('.liquid-button--explore');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/register';
          });
        }
      } catch (_) {
        // cross-origin guard
      }
    };
    iframe.addEventListener('load', onLoad);

    // Listen for navigation messages from iframe
    const handleMessage = (e) => {
      if (e.data?.type === 'navigate') {
        if (e.data.target === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(e.data.target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('message', handleMessage);

    // Forward pointer movement so Three.js lighting & spores track mouse
    const handlePointerMove = (e) => {
      try {
        iframe.contentWindow?.postMessage(
          { type: 'pointermove', clientX: e.clientX, clientY: e.clientY },
          '*'
        );
      } catch (_) {}
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      iframe.removeEventListener('load', onLoad);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  // Forward scroll position to fade out hero text inside iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !loaded) return;
    try {
      iframe.contentWindow?.postMessage(
        { type: 'scroll', scrollY, vh: window.innerHeight },
        '*'
      );
    } catch (_) {}
  }, [scrollY, loaded]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: scrollY < 60 ? 'auto' : 'none',
        overflow: 'hidden',
        background: '#383b34',
      }}
      aria-hidden={scrollY >= 60}
    >
      {/* Loading Skeleton */}
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#4a4d44',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/80 flex items-center justify-center animate-pulse">
              <Leaf size={24} className="text-white" />
            </div>
            <p className="text-xs uppercase tracking-widest text-emerald-200/60 font-mono">
              Memuat Scene 3D...
            </p>
          </div>
        </div>
      )}

      {/* 3D Three.js Living Canvas iframe */}
      <iframe
        ref={iframeRef}
        src="/ramaltani-hero.html"
        title="RamalTani Three.js Background"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        loading="eager"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          border: 'none',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.22,0.61,0.36,1)',
        }}
      />
      {/* Subtle bottom vignette to blend Three.js smoothly with content */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(120% 90% at 50% 10%, transparent 45%, rgba(18,22,17,0.72) 100%)',
        }}
      />
    </div>
  );
}

// ─── Floating Header (Reveals on scroll) ──────────────────────────────────────
function FloatingNav({ isScrolled }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#181e17]/85 backdrop-blur-md border-b border-white/10 shadow-2xl translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-white font-medium group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition-transform">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="tracking-wide font-semibold text-sm">RamalTani</span>
        </button>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wider uppercase text-neutral-300">
          <button onClick={() => scrollTo('apa')} className="hover:text-emerald-400 transition-colors">
            01 / Apa Itu
          </button>
          <button onClick={() => scrollTo('fitur')} className="hover:text-emerald-400 transition-colors">
            02 / Fitur
          </button>
          <button onClick={() => scrollTo('cara-pakai')} className="hover:text-emerald-400 transition-colors">
            03 / Cara Pakai
          </button>
          <button onClick={() => scrollTo('wilayah')} className="hover:text-emerald-400 transition-colors">
            04 / Wilayah
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-neutral-200 hover:text-white transition-colors"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-emerald-600 text-white rounded-full hover:bg-emerald-500 shadow-md shadow-emerald-950/50 hover:shadow-emerald-600/30 transition-all"
          >
            Mulai Pantau
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Main Landing Page Component ──────────────────────────────────────────────
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  useReveal();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-neutral-100 font-sans selection:bg-emerald-600 selection:text-white relative">
      {/* 1. Persistent Three.js Background */}
      <ThreeJsLivingBackground scrollY={scrollY} />

      {/* 2. Top Header (Scroll-revealed) */}
      <FloatingNav isScrolled={scrollY > 260} />

      {/* 3. Hero Section Spacer + Chapter Chips */}
      <section className="relative min-h-[100svh] flex flex-col justify-end px-6 pb-12 z-10 pointer-events-none">
        <div className="max-w-7xl mx-auto w-full pointer-events-auto">
          {/* Scroll Cue */}
          <div className="flex items-center justify-end gap-3 mb-6 text-[10px] tracking-[0.28em] uppercase text-emerald-300/70 font-medium">
            <span>Gulir Untuk Menjelajah</span>
            <div className="w-14 h-[1px] bg-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-400 animate-cue" />
            </div>
          </div>

          {/* Chapter Chips (Kage style) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-white/15 backdrop-blur-sm rounded-xl p-4 bg-black/20">
            {[
              { id: 'apa', num: '01', title: 'Apa Itu', desc: 'Data cuaca BMKG + GPS lahan' },
              { id: 'fitur', num: '02', title: 'Fitur', desc: 'Prakiraan 14 hari & peta risiko' },
              { id: 'cara-pakai', num: '03', title: 'Cara Pakai', desc: '5 langkah mudah bertani presisi' },
              { id: 'wilayah', num: '04', title: 'Wilayah', desc: '8+ Provinsi lumbung pangan' },
              { id: 'mulai', num: '05', title: 'Mulai', desc: 'Akses gratis untuk petani' },
            ].map((ch) => (
              <button
                key={ch.id}
                onClick={() => scrollToSection(ch.id)}
                className="chapter-chip text-left group p-2 rounded-lg hover:bg-white/5 transition-all"
              >
                <span className="text-xl md:text-2xl font-light text-neutral-400 group-hover:text-emerald-400 transition-colors tabular-nums">
                  {ch.num}
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold tracking-widest uppercase text-neutral-200 group-hover:text-emerald-300 transition-colors">
                    {ch.title}
                  </div>
                  <div className="text-[11px] text-neutral-400 leading-snug line-clamp-1 mt-0.5">
                    {ch.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Story Container (Scrolls over Three.js background) */}
      <div className="relative z-10 px-6 space-y-36 md:space-y-48 pb-28">

        {/* ─── CHAPTER 01: APA ITU RAMALTANI? ───────────────────────────────── */}
        <section id="apa" className="max-w-6xl mx-auto pt-20">
          <div data-rv="up" className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            01 / Identitas & Misi
          </div>

          <h2 data-rv="up" className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight max-w-4xl mb-8">
            <WordMaskText text="Data cuaca presisi bertemu kearifan petani nusantara." />
          </h2>

          <p data-rv="up" className="text-lg md:text-xl text-neutral-300 font-light leading-relaxed max-w-3xl mb-14">
            RamalTani mentransformasi data meteorologi resmi BMKG, citra satelit iklim, dan koordinat GPS lahan menjadi panduan aksi konkret. 
            Membantu petani mengantisipasi anomali cuaca, menentukan masa tanam yang tepat, serta menekan risiko gagal panen hingga tingkat minimum.
          </p>

          {/* Stats Bar with Animated Counter */}
          <div data-rv="up" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="story-glass p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-medium">Petani Terdaftar</span>
                <Activity size={18} className="text-emerald-400/80" />
              </div>
              <div
                className="text-4xl md:text-5xl font-light text-white tracking-tight tabular-nums"
                data-counter="45000"
                data-suffix="+"
              >
                0+
              </div>
              <p className="text-xs text-neutral-400 mt-2">Tersebar di berbagai kelompok tani dan gabungan kelompok tani (Gapoktan).</p>
            </div>

            <div className="story-glass p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-medium">Lahan Terpantau</span>
                <Layers size={18} className="text-emerald-400/80" />
              </div>
              <div
                className="text-4xl md:text-5xl font-light text-white tracking-tight tabular-nums"
                data-counter="8200"
                data-suffix=" ha"
              >
                0 ha
              </div>
              <p className="text-xs text-neutral-400 mt-2">Sawah irigasi, tadah hujan, dan perkebunan terpetakan secara geospasial.</p>
            </div>

            <div className="story-glass p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-medium">Akurasi Prediksi</span>
                <ShieldCheck size={18} className="text-emerald-400/80" />
              </div>
              <div
                className="text-4xl md:text-5xl font-light text-white tracking-tight tabular-nums"
                data-counter="94"
                data-suffix="%"
              >
                0%
              </div>
              <p className="text-xs text-neutral-400 mt-2">Divalidasi dengan pengamatan stasiun klimatologi lokal di lapangan.</p>
            </div>
          </div>
        </section>

        {/* ─── CHAPTER 02: FITUR UNGGULAN ───────────────────────────────────── */}
        <section id="fitur" className="max-w-6xl mx-auto">
          <div data-rv="up" className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            02 / Fitur Unggulan
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 data-rv="up" className="text-3xl md:text-5xl font-light text-white tracking-tight">
                <WordMaskText text="Teknologi Modern Untuk Ketahanan Pangan" />
              </h2>
            </div>
            <p data-rv="up" className="text-sm text-neutral-400 max-w-sm">
              Tiga instrumen utama yang memudahkan Anda mengambil keputusan sebelum menabur benih atau menyemprot pupuk.
            </p>
          </div>

          {/* Staggered Pathway Cards (Kage Pathways style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Card 1 */}
            <div data-rv="up" className="story-glass story-glass-hover p-8 rounded-3xl relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <CloudSun size={24} />
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 mb-2">01 / PARAMETER ATMOSFER</div>
              <h3 className="text-2xl font-normal text-white mb-3">Prakiraan Cuaca 14 Hari</h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-light mb-6">
                Prediksi suhu, kelembaban udara, intensitas curah hujan per jam, dan indeks radiasi UV hingga tingkat kecamatan.
              </p>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span>Pembaruan BMKG</span>
                <span className="text-emerald-400 font-medium">Per 3 Jam</span>
              </div>
            </div>

            {/* Card 2 (Staggered down +36px on desktop) */}
            <div data-rv="up" className="story-glass story-glass-hover p-8 rounded-3xl relative overflow-hidden group md:translate-y-8">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all">
                <MapPin size={24} />
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-teal-400 mb-2">02 / GEOSPASIAL GIS</div>
              <h3 className="text-2xl font-normal text-white mb-3">Peta Risiko & Kerentanan</h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-light mb-6">
                Visualisasi interaktif zona potensi banjir genangan, kekeringan kritis, dan sebaran anomali cuaca di sekitar petak sawah.
              </p>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span>Radius Radar</span>
                <span className="text-teal-400 font-medium">Hingga 50 KM</span>
              </div>
            </div>

            {/* Card 3 (Staggered down +72px on desktop) */}
            <div data-rv="up" className="story-glass story-glass-hover p-8 rounded-3xl relative overflow-hidden group md:translate-y-16">
              <div className="w-12 h-12 rounded-2xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400 mb-6 group-hover:scale-110 group-hover:bg-lime-500/20 transition-all">
                <TrendingUp size={24} />
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-lime-400 mb-2">03 / ADVISORY ENGINE</div>
              <h3 className="text-2xl font-normal text-white mb-3">Rekomendasi Kalender Tanam</h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-light mb-6">
                Rekomendasi spesifik komoditas (padi, jagung, cabai) mengenai tanggal semai, pencegahan jamur, dan efisiensi air.
              </p>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span>Saran Adaptif</span>
                <span className="text-lime-400 font-medium">Harian & Mingguan</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CHAPTER 03: CARA MENGGUNAKAN (CURRICULUM FLOW) ───────────────── */}
        <section id="cara-pakai" className="max-w-6xl mx-auto pt-16">
          <div data-rv="up" className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <Compass size={14} />
            03 / Alur Kerja
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14">
            <div className="md:col-span-8">
              <h2 data-rv="up" className="text-3xl md:text-5xl font-light text-white tracking-tight">
                <WordMaskText text="Lima Langkah Menuju Pertanian Presisi" />
              </h2>
            </div>
            <div className="md:col-span-4">
              <p data-rv="up" className="text-sm text-neutral-300 font-light leading-relaxed">
                Antarmuka dirancang seringan mungkin agar dapat diakses lancar melalui ponsel di pelosok pedesaan tanpa memerlukan perangkat mahal.
              </p>
            </div>
          </div>

          {/* Curriculum List (.les from Kage) */}
          <div data-rv="up" className="story-glass rounded-3xl p-6 md:p-10 divide-y divide-white/10">
            {[
              {
                step: '01',
                title: 'Daftar Akun Gratis',
                detail: 'Cukup masukkan nama, email, dan nomor telepon. Tanpa biaya langganan atau ikatan kontrak.',
                tag: '2 MENIT',
              },
              {
                step: '02',
                title: 'Tandai Koordinat Petak Lahan',
                detail: 'Gunakan fitur GPS otomatis pada ponsel Anda atau tentukan pin lokasi sawah pada peta satelit.',
                tag: 'OTOMATIS',
              },
              {
                step: '03',
                title: 'Sinkronisasi Radar Cuaca BMKG',
                detail: 'Sistem langsung menghubungkan lahan Anda ke radar stasiun meteorologi terdekat secara real-time.',
                tag: 'INSTAN',
              },
              {
                step: '04',
                title: 'Dapatkan Rekomendasi Tanam & Pemupukan',
                detail: 'Ketahui jendela hari kering untuk menjemur atau menyemprot, serta prakiraan hujan untuk efisiensi irigasi.',
                tag: 'HARIAN',
              },
              {
                step: '05',
                title: 'Pantau Perkembangan & Catat Panen',
                detail: 'Evaluasi hasil panen musim demi musim dan bandingkan produktivitas dengan musim sebelumnya.',
                tag: 'BERKELANJUTAN',
              },
            ].map((item, idx) => (
              <div key={idx} className="les group">
                <div className="bar" />
                <span className="k font-mono font-semibold">{item.step}</span>
                <div>
                  <h3 className="text-lg md:text-xl font-normal text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-neutral-400 font-light">
                  {item.detail}
                </p>
                <div className="text-right">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 group-hover:border-emerald-500/40 group-hover:text-emerald-300 transition-colors">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CHAPTER 04: WILAYAH CAKUPAN ─────────────────────────────────── */}
        <section id="wilayah" className="max-w-6xl mx-auto">
          <div data-rv="up" className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <Globe2 size={14} />
            04 / Cakupan Wilayah
          </div>

          <h2 data-rv="up" className="text-3xl md:text-5xl font-light text-white tracking-tight mb-6">
            <WordMaskText text="Melindungi Lumbung Pangan Nusantara" />
          </h2>

          <p data-rv="up" className="text-base md:text-lg text-neutral-300 font-light leading-relaxed max-w-3xl mb-12">
            RamalTani aktif mendampingi kelompok tani di sentra-sentra produksi pangan utama Indonesia, 
            menyatukan data topografi lahan dan jaringan stasiun klimatologi daerah.
          </p>

          <div data-rv="up" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                region: 'Jawa & Madura',
                areas: 'Karawang, Subang, Indramayu, Sragen, Banyuwangi',
                stats: '24.500+ Petani',
                tag: 'Sentra Padi Utama',
              },
              {
                region: 'Sumatera',
                areas: 'Deli Serdang, Lampung Selatan, Banyuasin, Solok',
                stats: '11.200+ Petani',
                tag: 'Pangan & Hortikultura',
              },
              {
                region: 'Bali & Nusa Tenggara',
                areas: 'Tabanan, Gianyar, Lombok Tengah, Sumbawa',
                stats: '6.400+ Petani',
                tag: 'Sistem Subak & Palawija',
              },
              {
                region: 'Sulawesi & Sekitarnya',
                areas: 'Sidrap, Bone, Pinrang, Gowa',
                stats: '5.800+ Petani',
                tag: 'Lumbung Timur Nusantara',
              },
            ].map((reg, i) => (
              <div key={i} className="story-glass story-glass-hover p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 mb-2">
                    {reg.tag}
                  </div>
                  <h4 className="text-xl font-normal text-white mb-2">{reg.region}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{reg.areas}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Pengguna</span>
                  <span className="text-xs font-semibold text-emerald-300">{reg.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CHAPTER 05: MULAI SEKARANG (FULLSCREEN CTA + FOOTER) ─────────── */}
        <section id="mulai" className="max-w-6xl mx-auto pt-10">
          <div data-rv="up" className="story-glass p-10 md:p-20 rounded-3xl text-center relative overflow-hidden">
            {/* Ambient emerald background glow */}
            <div
              className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[120px]"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6">
                05 / Gerakan Pertanian Berkelanjutan
              </div>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-tight mb-6">
                Mulai Mengelola Lahan dengan Keyakinan Data
              </h2>

              <p className="text-base md:text-lg text-neutral-300 font-light leading-relaxed mb-10">
                Bergabunglah bersama ribuan petani modern lainnya. Daftar dalam beberapa menit dan nikmati akses prakiraan cuaca 14 hari serta peta risiko gratis.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm tracking-wide shadow-xl shadow-emerald-950/60 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Daftar Sekarang — Gratis</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-neutral-200 hover:text-white font-medium text-sm tracking-wide transition-all"
                >
                  Masuk ke Dashboard
                </Link>
              </div>

              {/* Trust checklist */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Tanpa Biaya Langganan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Data Resmi BMKG Terintegrasi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Dukungan Komunitas Petani</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center">
                <Leaf size={14} className="text-white" />
              </div>
              <span className="font-medium text-neutral-200">RamalTani Indonesia</span>
              <span>— Platform Rekomendasi Pertanian Berbasis Cuaca Presisi</span>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/login" className="hover:text-emerald-400 transition-colors">Masuk</Link>
              <Link to="/register" className="hover:text-emerald-400 transition-colors">Daftar</Link>
              <a 
                href="https://www.bmkg.go.id" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-emerald-400 transition-colors"
              >
                Sumber Data: BMKG
              </a>
            </div>
          </footer>
        </section>

      </div>
    </div>
  );
}

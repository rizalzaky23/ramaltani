import { useState } from 'react';
import { BookOpen, Clock, ChevronRight, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';
import { SectionHeader } from '../../components/ui';
import { DEMO_EDUCATION_ARTICLES } from '../../data/mockData';

const catColor = {
  'Cuaca': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'Tanam': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Iklim': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  'Varietas': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function EducationPage() {
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const categories = ['Semua', ...new Set(DEMO_EDUCATION_ARTICLES.map(a => a.category))];

  const filtered = activeCategory === 'Semua'
    ? DEMO_EDUCATION_ARTICLES
    : DEMO_EDUCATION_ARTICLES.filter(a => a.category === activeCategory);

  const selectedArticle = DEMO_EDUCATION_ARTICLES.find(a => a.slug === selectedSlug);

  if (selectedArticle) {
    return (
      <div className="max-w-3xl mx-auto text-[#09090b] animate-fade-in">
        <button
          onClick={() => setSelectedSlug(null)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#e4e4e7] text-xs font-mono text-[#71717a] hover:text-white hover:border-[#d4d4d8] mb-6 transition-all"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Daftar Artikel</span>
        </button>

        <article className="rounded-2xl bg-white border border-[#e4e4e7] p-6 sm:p-10 shadow-2xl">
          <div className="mb-6 pb-6 border-b border-[#e4e4e7]">
            <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${catColor[selectedArticle.category] || 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]'}`}>
              {selectedArticle.category}
            </span>
            <h1 className="font-medium text-2xl sm:text-3xl lg:text-4xl text-white font-normal mt-4 mb-3 leading-tight">
              {selectedArticle.title}
            </h1>
            <div className="flex items-center gap-3 text-xs font-mono text-[#71717a]">
              <span>Tim Agronomi RamalTani</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {selectedArticle.readingTimeMin} menit baca
              </span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[#09090b] leading-relaxed space-y-4">
            {selectedArticle.summary && (
              <p className="text-sm sm:text-base text-[#71717a] italic border-l-2 border-emerald-500/50 pl-4 py-1 my-4 bg-emerald-500/5 rounded-r-xl">
                {selectedArticle.summary}
              </p>
            )}
            {/* Render markdown-like content */}
            <div className="whitespace-pre-line text-sm text-[#71717a] leading-relaxed space-y-2">
              {selectedArticle.content?.split('\n').map((line, i) => {
                if (line.match(/^[\u2705\u2713\-•*]\s/)) {
                  return (
                    <div key={i} className="flex items-start gap-2.5 text-sm my-2 text-white">
                      <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{line.replace(/^[\u2705\u2713\-•*]\s*/, '')}</span>
                    </div>
                  );
                }
                if (line.startsWith('**')) return <p key={i} className="font-semibold text-white text-base mt-4 mb-1">{line.replace(/\*\*/g, '')}</p>;
                if (line.trim() === '') return <div key={i} className="h-2" />;
                return <p key={i} className="text-sm text-[#71717a] leading-relaxed">{line}</p>;
              })}
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-[#e4e4e7] text-[11px] font-mono text-[#71717a]">
            Diterbitkan: {new Date(selectedArticle.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} ·
            Sumber: BMKG & Balai Pengkajian Teknologi Pertanian (BPTP)
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto text-[#09090b] animate-fade-in">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs uppercase tracking-widest mb-2">
          <Sparkles size={12} />
          Knowledge Base & Panduan Lapangan
        </div>
        <h1 className="font-medium text-2xl sm:text-3xl text-white font-normal">Pusat Edukasi Pertanian Cerdas</h1>
        <p className="text-[#71717a] text-sm mt-1">
          Pelajari dinamika perubahan iklim, interpretasi curah hujan dasarian, dan manajemen risiko lahan.
        </p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs uppercase tracking-widest transition-all ${
              activeCategory === cat
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-white border border-[#e4e4e7] text-[#71717a] hover:text-white hover:border-[#d4d4d8]'
            }`}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(article => (
          <button
            key={article.id}
            onClick={() => setSelectedSlug(article.slug)}
            className="rounded-2xl bg-white border border-[#e4e4e7] p-5 text-left flex flex-col hover:border-emerald-500/30 transition-all group shadow-lg"
            aria-label={`Baca artikel: ${article.title}`}
          >
            <div className="flex items-center justify-between mb-3 w-full">
              <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${catColor[article.category] || 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]'}`}>
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-[#71717a]">
                <Clock size={11} /> {article.readingTimeMin} mnt
              </span>
            </div>
            <h3 className="font-medium text-base text-white font-normal mb-2 leading-snug flex-1 group-hover:text-emerald-400 transition-colors">
              {article.title}
            </h3>
            <p className="text-xs text-[#71717a] leading-relaxed mb-4 line-clamp-3">{article.summary}</p>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium mt-auto group-hover:gap-2 transition-all">
              <span>Pelajari panduan</span>
              <ChevronRight size={14} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

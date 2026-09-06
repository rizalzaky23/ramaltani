import { useState } from 'react';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';
import { SectionHeader } from '../../components/ui';
import { DEMO_EDUCATION_ARTICLES } from '../../data/mockData';

const catColor = {
  'Cuaca': 'bg-langit-50 text-langit-700 border-langit-200',
  'Tanam': 'bg-padi-50 text-padi-700 border-padi-200',
  'Iklim': 'bg-daun-50 text-daun-700 border-daun-200',
  'Varietas': 'bg-tanah-50 text-tanah-700 border-tanah-200',
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
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setSelectedSlug(null)} className="btn btn-ghost btn-sm mb-5 text-muted">
          ← Kembali ke Daftar Artikel
        </button>
        <article>
          <div className="mb-6">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${catColor[selectedArticle.category]}`}>
              {selectedArticle.category}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-ink mt-3 mb-2">{selectedArticle.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted">
              <span>Tim RamalTani</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {selectedArticle.readingTimeMin} menit membaca
              </span>
            </div>
          </div>
          <div className="prose prose-sm max-w-none text-ink leading-relaxed space-y-4">
            {selectedArticle.summary && (
              <p className="text-base text-muted italic border-l-4 border-padi-300 pl-4 py-1">
                {selectedArticle.summary}
              </p>
            )}
            {/* Render markdown-like content */}
            <div className="whitespace-pre-line">
              {selectedArticle.content?.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} className="font-display text-xl text-ink mt-6 mb-2">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="font-semibold text-ink mt-4 mb-1">{line.replace('### ', '')}</h3>;
                if (line.startsWith('✅ ') || line.startsWith('- ')) return <div key={i} className="flex items-start gap-2 text-sm my-1"><span className="text-padi-500 mt-0.5">•</span><span>{line.replace('✅ ', '').replace('- ', '')}</span></div>;
                if (line.startsWith('**')) return <p key={i} className="font-semibold text-ink text-sm">{line.replace(/\*\*/g, '')}</p>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="text-sm leading-relaxed">{line}</p>;
              })}
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-border text-xs text-muted">
            Diterbitkan: {new Date(selectedArticle.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} ·
            Sumber data cuaca: BMKG · Data ini bersifat edukatif, bukan prediksi resmi.
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader title="Pusat Edukasi" subtitle="Belajar tentang cuaca, iklim, dan pertanian cerdas" />

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeCategory === cat
                ? 'bg-padi-500 text-white'
                : 'bg-white border border-border text-muted hover:text-ink'
            }`}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(article => (
          <button
            key={article.id}
            onClick={() => setSelectedSlug(article.slug)}
            className="card card-body text-left flex flex-col hover:shadow-card-hover transition-all group"
            aria-label={`Baca artikel: ${article.title}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${catColor[article.category]}`}>
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock size={11} /> {article.readingTimeMin} mnt
              </span>
            </div>
            <h3 className="font-display text-base text-ink mb-2 leading-snug flex-1">{article.title}</h3>
            <p className="text-xs text-muted leading-relaxed mb-4">{article.summary}</p>
            <div className="flex items-center gap-1 text-padi-600 text-sm font-semibold mt-auto group-hover:gap-2 transition-all">
              Baca artikel <ChevronRight size={14} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

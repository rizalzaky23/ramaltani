import { useState } from 'react';
import { ThumbsUp, MessageCircle, Plus, X, Sparkles } from 'lucide-react';
import { DemoBadge } from '../../components/ui';
import { DEMO_COMMUNITY_POSTS } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const CATEGORIES = ['Semua', 'Padi', 'Jagung', 'Cabai', 'Cuaca', 'Hama', 'Irigasi'];

const catColor = {
  'Padi': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Jagung': 'bg-amber-50 text-amber-700 border-amber-200',
  'Cabai': 'bg-rose-50 text-rose-700 border-rose-200',
  'Cuaca': 'bg-sky-50 text-sky-700 border-sky-200',
  'Hama': 'bg-orange-50 text-orange-700 border-orange-200',
  'Irigasi': 'bg-teal-50 text-teal-700 border-teal-200',
};

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);

  return (
    <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-sm hover:border-emerald-200 transition-all">
      <div className="flex items-start gap-3.5 mb-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
          {post.authorName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[#09090b]">{post.authorName}</span>
            {post.isDemo && <DemoBadge />}
          </div>
          <div className="text-xs text-[#71717a] mt-0.5">{post.authorVillage}</div>
        </div>
        <span className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-full border ${catColor[post.category] || 'bg-[#fafafa] text-[#71717a] border-[#e4e4e7]'}`}>
          {post.category}
        </span>
      </div>

      <h3 className="font-medium text-base sm:text-lg text-[#09090b] mb-2">{post.title}</h3>
      <p className="text-xs sm:text-sm text-[#71717a] leading-relaxed mb-4">{post.content}</p>

      <div className="flex items-center gap-5 pt-3.5 border-t border-[#e4e4e7] font-mono text-xs">
        <button
          onClick={() => { setLiked(!liked); setLikes(l => liked ? l - 1 : l + 1); }}
          className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-emerald-700 font-semibold' : 'text-[#71717a] hover:text-emerald-700'}`}
          aria-label={`${liked ? 'Batalkan suka' : 'Suka'} postingan ini (${likes} suka)`}
          aria-pressed={liked}
        >
          <ThumbsUp size={14} aria-hidden="true" />
          <span>{likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-[#71717a] hover:text-[#09090b] transition-colors" aria-label={`${post.commentsCount} komentar`}>
          <MessageCircle size={14} aria-hidden="true" />
          <span>{post.commentsCount} komentar</span>
        </button>
        <span className="ml-auto text-[#71717a]">
          {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { user } = useAuth();
  const containerRef = useScrollReveal();
  const [posts, setPosts] = useState(DEMO_COMMUNITY_POSTS);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Padi' });

  const filteredPosts = activeCategory === 'Semua'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    const post = {
      id: `post-${Date.now()}`,
      authorName: user?.name || 'Anda',
      authorVillage: user?.village || 'Desa Anda',
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      likes: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      isDemo: true,
    };

    setPosts(p => [post, ...p]);
    setNewPost({ title: '', content: '', category: 'Padi' });
    setShowNewPost(false);
  };

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto text-[#09090b] page-enter">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-3">
            Forum Komunitas Tani
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#09090b] leading-[1.08]">
            Komunitas Petani
          </h1>
          <p className="text-base sm:text-lg text-[#71717a] mt-3 max-w-xl leading-relaxed">
            Ruang bertukar laporan cuaca lapangan, strategi olah tanah, dan mitigasi hama lokal antar sesama petani.
          </p>
        </div>
        <button
          onClick={() => setShowNewPost(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Buat Postingan</span>
        </button>
      </div>

      {/* New post modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Buat postingan baru">
          <div className="bg-white border border-[#e4e4e7] rounded-2xl w-full max-w-md shadow-2xl animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#e4e4e7]">
              <h2 className="font-medium text-lg text-[#09090b]">Buat Diskusi Lapangan</h2>
              <button onClick={() => setShowNewPost(false)} className="text-[#71717a] hover:text-[#09090b] p-1" aria-label="Tutup">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmitPost} className="p-5 space-y-4">
              <div>
                <label htmlFor="postCategory" className="block text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1.5">
                  Topik / Kategori
                </label>
                <select
                  id="postCategory"
                  value={newPost.category}
                  onChange={e => setNewPost(n => ({ ...n, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e4e4e7] text-[#09090b] focus:outline-none focus:border-emerald-500 text-sm"
                >
                  {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="postTitle" className="block text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1.5">
                  Judul Topik
                </label>
                <input
                  id="postTitle"
                  type="text"
                  value={newPost.title}
                  onChange={e => setNewPost(n => ({ ...n, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e4e4e7] text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-emerald-500 text-sm"
                  placeholder="Apa yang terjadi di lahan Anda?"
                  required
                />
              </div>
              <div>
                <label htmlFor="postContent" className="block text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1.5">
                  Detail Pengalaman / Pertanyaan
                </label>
                <textarea
                  id="postContent"
                  value={newPost.content}
                  onChange={e => setNewPost(n => ({ ...n, content: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e4e4e7] text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-emerald-500 text-sm h-28 resize-none"
                  placeholder="Tuliskan pengalaman atau kendala kondisi cuaca lahan..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-sm"
              >
                Kirim ke Komunitas
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-5 reveal-up" role="list" aria-label="Filter kategori">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs uppercase tracking-widest transition-all ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white font-medium shadow-sm'
                : 'bg-white border border-[#e4e4e7] text-[#71717a] hover:text-[#09090b] hover:border-emerald-200'
            }`}
            aria-pressed={activeCategory === cat}
            role="listitem"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4 reveal-up">
        {filteredPosts.map(post => <PostCard key={post.id} post={post} />)}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16 rounded-2xl bg-white border border-[#e4e4e7]">
            <MessageCircle size={32} className="mx-auto mb-3 text-[#71717a]" />
            <p className="text-sm text-[#71717a]">Belum ada postingan untuk kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}

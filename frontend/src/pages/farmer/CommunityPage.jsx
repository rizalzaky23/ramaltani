import { useState } from 'react';
import { ThumbsUp, MessageCircle, AlertCircle, Plus, X } from 'lucide-react';
import { SectionHeader, DemoBadge } from '../../components/ui';
import { DEMO_COMMUNITY_POSTS } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';

const CATEGORIES = ['Semua', 'Padi', 'Jagung', 'Cabai', 'Cuaca', 'Hama', 'Irigasi'];

const catColor = {
  'Padi': 'bg-padi-50 text-padi-700 border-padi-200',
  'Jagung': 'bg-panen-50 text-panen-700 border-panen-200',
  'Cabai': 'bg-red-50 text-red-700 border-red-200',
  'Cuaca': 'bg-langit-50 text-langit-700 border-langit-200',
  'Hama': 'bg-tanah-50 text-tanah-700 border-tanah-200',
  'Irigasi': 'bg-daun-50 text-daun-700 border-daun-200',
};

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);

  return (
    <div className="card card-body">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-padi-100 flex items-center justify-center text-padi-700 font-bold text-sm flex-shrink-0">
          {post.authorName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-ink">{post.authorName}</span>
            {post.isDemo && <DemoBadge />}
          </div>
          <div className="text-xs text-muted">{post.authorVillage}</div>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${catColor[post.category] || 'bg-surface text-muted border-border'}`}>
          {post.category}
        </span>
      </div>

      <h3 className="font-display text-base text-ink mb-2">{post.title}</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">{post.content}</p>

      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <button
          onClick={() => { setLiked(!liked); setLikes(l => liked ? l - 1 : l + 1); }}
          className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-padi-600 font-semibold' : 'text-muted hover:text-padi-600'}`}
          aria-label={`${liked ? 'Batalkan suka' : 'Suka'} postingan ini (${likes} suka)`}
          aria-pressed={liked}
        >
          <ThumbsUp size={15} aria-hidden="true" />
          {likes}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors" aria-label={`${post.commentsCount} komentar`}>
          <MessageCircle size={15} aria-hidden="true" />
          {post.commentsCount} komentar
        </button>
        <span className="ml-auto text-xs text-muted">
          {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { user } = useAuth();
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
    <div className="max-w-2xl mx-auto">
      <SectionHeader
        title="Komunitas Petani"
        subtitle="Diskusi dan berbagi pengalaman dengan petani sekitar"
        action={
          <button onClick={() => setShowNewPost(true)} className="btn btn-primary btn-sm">
            <Plus size={16} /> Buat Postingan
          </button>
        }
      />

      {/* New post modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Buat postingan baru">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display text-lg text-ink">Buat Postingan Baru</h2>
              <button onClick={() => setShowNewPost(false)} className="text-muted hover:text-ink p-1" aria-label="Tutup">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitPost} className="p-5 space-y-4">
              <div>
                <label htmlFor="postCategory" className="form-label">Kategori</label>
                <select id="postCategory" value={newPost.category} onChange={e => setNewPost(n => ({ ...n, category: e.target.value }))} className="form-select">
                  {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="postTitle" className="form-label">Judul</label>
                <input id="postTitle" type="text" value={newPost.title} onChange={e => setNewPost(n => ({ ...n, title: e.target.value }))} className="form-input" placeholder="Apa yang ingin Anda diskusikan?" required />
              </div>
              <div>
                <label htmlFor="postContent" className="form-label">Isi Postingan</label>
                <textarea id="postContent" value={newPost.content} onChange={e => setNewPost(n => ({ ...n, content: e.target.value }))} className="form-input h-28 resize-none" placeholder="Tulis postingan Anda di sini..." required />
              </div>
              <button type="submit" className="btn btn-primary w-full justify-center">Kirim Postingan</button>
            </form>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-5" role="list" aria-label="Filter kategori">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeCategory === cat
                ? 'bg-padi-500 text-white'
                : 'bg-white border border-border text-muted hover:text-ink hover:bg-surface'
            }`}
            aria-pressed={activeCategory === cat}
            role="listitem"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map(post => <PostCard key={post.id} post={post} />)}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-muted">
            <MessageCircle size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Belum ada postingan untuk kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}

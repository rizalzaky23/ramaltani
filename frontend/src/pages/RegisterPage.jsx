import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'farmer' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }

    setLoading(true);
    setError('');

    // Demo: simulate registration by redirecting to login
    setTimeout(() => {
      setLoading(false);
      navigate('/login', { state: { message: 'Pendaftaran berhasil! Silakan masuk dengan akun demo untuk mencoba platform.' } });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-padi-500 flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-ink">Ramal<span className="text-padi-500">Tani</span></span>
          </Link>
          <h1 className="font-display text-3xl text-ink mb-2">Daftar akun baru</h1>
          <p className="text-muted text-sm">Mulai gunakan RamalTani secara gratis</p>
        </div>

        <div className="card card-body mb-4 bg-padi-50 border-padi-200">
          <div className="flex items-start gap-3">
            <CheckCircle size={18} className="text-padi-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-ink mb-1">Demo Platform</div>
              <div className="text-xs text-muted leading-relaxed">
                Ini adalah prototype demo. Gunakan akun demo yang tersedia di halaman login untuk mencoba semua fitur platform.
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert-danger mb-4" role="alert">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="form-label">Nama Lengkap</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} className="form-input" placeholder="Budi Santoso" required />
          </div>
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="nama@contoh.com" required />
          </div>
          <div>
            <label htmlFor="role" className="form-label">Peran</label>
            <select id="role" name="role" value={form.role} onChange={handleChange} className="form-select">
              <option value="farmer">Petani</option>
              <option value="extension_officer">Penyuluh Pertanian</option>
            </select>
          </div>
          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} className="form-input pr-12" placeholder="Min. 8 karakter" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink p-1" aria-label="Toggle password">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center mt-2" aria-busy={loading}>
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Mendaftar...</>
            ) : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-padi-600 font-semibold hover:text-padi-700">Masuk</Link>
        </p>
      </div>
    </div>
  );
}

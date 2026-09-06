import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const DEMO_ACCOUNTS = [
  { email: 'farmer@ramaltani.demo', role: 'Petani', name: 'Budi Santoso' },
  { email: 'penyuluh@ramaltani.demo', role: 'Penyuluh', name: 'Wahyudi Pratama' },
  { email: 'admin@ramaltani.demo', role: 'Admin Sistem', name: 'Admin RamalTani' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);

      // Route based on role
      if (user.role === 'farmer') navigate('/dashboard');
      else if (user.role === 'extension_officer') navigate('/penyuluh');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.error?.message || err?.message || 'Login gagal. Periksa email dan password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword('Demo1234!');
    setError('');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left panel — visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-padi-600 to-daun-700 p-12 flex-col justify-between overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0" aria-hidden="true">
          <svg viewBox="0 0 400 600" className="absolute bottom-0 left-0 w-full h-auto opacity-10" fill="none">
            <path d="M0,400 Q100,300 200,400 Q300,500 400,400" stroke="white" strokeWidth="2" />
            <path d="M0,350 Q100,250 200,350 Q300,450 400,350" stroke="white" strokeWidth="1.5" />
            <path d="M0,300 Q100,200 200,300 Q300,400 400,300" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        <Link to="/" className="flex items-center gap-2.5 relative z-10" aria-label="Kembali ke beranda">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Leaf size={22} className="text-white" />
          </div>
          <span className="font-display text-2xl font-bold text-white">RamalTani</span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-display text-4xl text-white mb-4 leading-tight">
            Baca Cuaca.<br />
            Atur Tanam.<br />
            Jaga Panen.
          </h2>
          <p className="text-padi-100 text-lg">
            Data cuaca yang rumit diterjemahkan menjadi keputusan tanam yang sederhana.
          </p>
        </div>

        <div className="relative z-10 space-y-2.5">
          <div className="text-xs font-semibold text-padi-200 uppercase tracking-wide mb-2">Sumber Data</div>
          {['BMKG Open Data API', 'Open-Meteo (Free)', 'OpenStreetMap'].map(s => (
            <div key={s} className="flex items-center gap-2 text-sm text-padi-100">
              <div className="w-1.5 h-1.5 rounded-full bg-padi-300" aria-hidden="true" />
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-padi-500 flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold text-ink">Ramal<span className="text-padi-500">Tani</span></span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl text-ink mb-2">Selamat datang kembali</h1>
            <p className="text-muted text-sm">Masuk ke akun RamalTani Anda untuk mulai</p>
          </div>

          {/* Demo accounts */}
          <div className="mb-6 p-4 bg-panen-50 border border-panen-200 rounded-xl">
            <div className="text-xs font-semibold text-panen-700 mb-2 uppercase tracking-wide">
              Akun Demo — Klik untuk mengisi otomatis
            </div>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="w-full text-left flex items-center justify-between px-3 py-2 bg-white border border-panen-200 rounded-lg hover:bg-panen-50 transition-colors text-xs group"
                  aria-label={`Gunakan akun demo ${acc.name} sebagai ${acc.role}`}
                >
                  <span className="font-semibold text-ink">{acc.name}</span>
                  <span className="text-muted font-medium">{acc.role} →</span>
                </button>
              ))}
              <p className="text-xs text-panen-600 mt-1">Password semua akun demo: <code className="font-mono font-bold">Demo1234!</code></p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="alert-danger mb-4 animate-fade-in" role="alert" aria-live="assertive">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Google / Kinde OAuth Button */}
          <div className="mb-4">
            <a
              href="http://localhost:5001/login"
              className="btn w-full justify-center bg-white hover:bg-surface-elevated text-ink border border-border shadow-sm py-2.5 font-medium flex items-center gap-3 transition-all hover:border-border-strong hover:shadow"
              id="kinde-google-login-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Lanjutkan dengan Google</span>
            </a>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-muted tracking-wider uppercase">atau dengan email</span>
              <div className="flex-grow border-t border-border"></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input"
                placeholder="nama@contoh.com"
                autoComplete="email"
                required
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input pr-12"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors p-1"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center mt-2"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  Memproses...
                </>
              ) : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-padi-600 font-semibold hover:text-padi-700">
              Daftar gratis
            </Link>
          </p>

          <p className="text-center text-xs text-muted mt-8 leading-relaxed">
            Dengan masuk, Anda menyetujui Syarat & Ketentuan dan Kebijakan Privasi RamalTani.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getBackendBaseUrl } from '../services/api';

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
    if (!email || !password) { setError('Email dan password wajib diisi.'); return; }
    setLoading(true); setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'farmer') navigate('/dashboard');
      else if (user.role === 'extension_officer') navigate('/penyuluh');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error?.message || err?.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = async (account) => {
    setEmail(account.email);
    setPassword('Demo1234!');
    setError('');
    setLoading(true);
    try {
      const user = await login(account.email, 'Demo1234!');
      if (user.role === 'farmer') navigate('/dashboard');
      else if (user.role === 'extension_officer') navigate('/penyuluh');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error?.message || err?.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel — brand hijau */}
      <div className="hidden lg:flex lg:w-[45%] bg-emerald-700 p-12 flex-col justify-between">
        <Link to="/" className="text-xl font-medium tracking-tight text-white">
          RamalTani
        </Link>

        <div className="max-w-sm">
          <p className="text-xs uppercase tracking-widest text-emerald-200/70 mb-6">Platform Pertanian Cerdas</p>
          <h2 className="text-4xl font-medium leading-tight tracking-tight text-white mb-6">
            Baca Cuaca.<br />
            Atur Tanam.<br />
            Jaga Panen.
          </h2>
          <p className="text-emerald-100/70 text-sm leading-relaxed">
            Data meteorologi BMKG dan Open-Meteo diolah otomatis menjadi rekomendasi kalender tanam dan mitigasi risiko gagal panen.
          </p>

          <div className="mt-10 pt-8 border-t border-emerald-600 space-y-3">
            {[
              'Akurasi curah hujan 7–14 hari',
              'Deteksi ancaman El Niño / La Niña',
              'Peta risiko lahan real-time',
            ].map(item => (
              <p key={item} className="text-sm text-emerald-100/80 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 flex-shrink-0" />
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-emerald-300/60">
          <span>BMKG API</span><span>·</span>
          <span>Open-Meteo</span><span>·</span>
          <span>Postgres Cloud</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="text-xl font-medium tracking-tight text-emerald-700">
              RamalTani
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-medium tracking-tight text-[#09090b] mb-2">Selamat Datang Kembali</h1>
            <p className="text-sm text-[#71717a]">Masuk ke dashboard RamalTani Anda</p>
          </div>

          {/* Demo accounts */}
          <div className="mb-6 p-4 border border-emerald-100 rounded-2xl bg-emerald-50/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-emerald-700 font-medium">Akun Demo</span>
              <span className="text-xs text-[#71717a]">Klik untuk isi otomatis</span>
            </div>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email} type="button" onClick={() => fillDemo(acc)}
                  className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-[#e4e4e7] hover:border-emerald-200 transition-all text-sm"
                  aria-label={`Gunakan akun demo ${acc.name}`}
                >
                  <span className="font-medium text-[#09090b]">{acc.name}</span>
                  <span className="text-[#71717a] text-xs">{acc.role}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#71717a]">
              <span>Password demo:</span>
              <code className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Demo1234!</code>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-sm" role="alert">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google OAuth */}
          <div className="mb-5">
            <a
              href={`${getBackendBaseUrl()}/login`}
              id="kinde-google-login-btn"
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-white hover:bg-[#f4f4f5] border border-[#e4e4e7] hover:border-[#d4d4d8] text-[#09090b] font-medium text-sm transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Lanjutkan dengan Google</span>
            </a>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-[#e4e4e7]" />
              <span className="mx-4 text-xs text-[#71717a]">atau dengan email</span>
              <div className="flex-grow border-t border-[#e4e4e7]" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest text-[#71717a] mb-1.5 font-medium">
                Alamat Email
              </label>
              <input
                id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e4e4e7] bg-white text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 text-sm transition-colors"
                placeholder="nama@contoh.com" autoComplete="email" required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-widest text-[#71717a] mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password" type={showPassword ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-[#e4e4e7] bg-white text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 text-sm transition-colors"
                  placeholder="••••••••" autoComplete="current-password" required
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-emerald-700 transition-colors p-1"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full mt-2 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Memverifikasi...</>
              ) : 'Masuk ke Dashboard'}
            </button>
          </form>

          <p className="text-center text-sm text-[#71717a] mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="text-emerald-700 font-medium hover:underline">
              Daftar akun gratis
            </Link>
          </p>

          <p className="text-center text-xs text-[#a1a1aa] mt-8 leading-relaxed">
            Data dilindungi enkripsi standar industri.
          </p>
        </div>
      </div>
    </div>
  );
}

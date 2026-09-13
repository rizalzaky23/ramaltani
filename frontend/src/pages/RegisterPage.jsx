import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getBackendBaseUrl } from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'farmer', phone: '', location: 'Ngawi, Jawa Timur',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Nama, email, dan password wajib diisi.'); return; }
    if (form.password.length < 8) { setError('Password minimal 8 karakter.'); return; }
    setLoading(true); setError('');
    try {
      const user = await register(form);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'extension_officer') navigate('/extension');
      else navigate('/app');
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Pendaftaran gagal');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel — hijau pertanian */}
      <div className="hidden lg:flex lg:w-[40%] bg-emerald-700 p-12 flex-col justify-between">
        <Link to="/" className="text-xl font-medium tracking-tight text-white">RamalTani</Link>

        <div className="max-w-xs">
          <p className="text-xs uppercase tracking-widest text-emerald-200/60 mb-6">Daftar Akun Baru</p>
          <h2 className="text-3xl font-medium leading-tight tracking-tight text-white mb-5">
            Mulai Pantau<br />Lahan Anda<br />Hari Ini.
          </h2>
          <p className="text-emerald-100/70 text-sm leading-relaxed">
            Daftar untuk akses ramalan cuaca spesifik koordinat dan kalender tanam adaptif berbasis data BMKG.
          </p>

          <div className="mt-10 pt-8 border-t border-emerald-600 space-y-3">
            {[
              'Akun langsung aktif & tersimpan',
              'Akses dashboard petani penuh',
              'Data lahan tersimpan permanen',
            ].map(item => (
              <p key={item} className="text-sm text-emerald-100/80 flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 flex-shrink-0" />
                {item}
              </p>
            ))}
          </div>
        </div>

        <p className="text-xs text-emerald-300/50">Terhubung ke postgre.rizalzaky.cloud</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md my-6">
          <div className="lg:hidden mb-8">
            <Link to="/" className="text-xl font-medium tracking-tight text-emerald-700">RamalTani</Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-medium tracking-tight text-[#09090b] mb-2">Buat Akun Baru</h1>
            <p className="text-sm text-[#71717a]">Daftar gratis dan mulai pantau cuaca lahan Anda</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-sm" role="alert">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google OAuth */}
          <div className="mb-5">
            <a
              href={`${getBackendBaseUrl()}/register`}
              id="kinde-google-register-btn"
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-white hover:bg-[#f4f4f5] border border-[#e4e4e7] hover:border-[#d4d4d8] text-[#09090b] font-medium text-sm transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Daftar Cepat dengan Google</span>
            </a>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-[#e4e4e7]" />
              <span className="mx-4 text-xs text-[#71717a]">atau formulir akun</span>
              <div className="flex-grow border-t border-[#e4e4e7]" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-widest text-[#71717a] mb-1.5 font-medium">Nama Lengkap</label>
              <input
                id="name" name="name" type="text" value={form.name} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e4e4e7] bg-white text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 text-sm transition-colors"
                placeholder="Bpk. Joko Santoso" required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest text-[#71717a] mb-1.5 font-medium">Alamat Email</label>
              <input
                id="email" name="email" type="email" value={form.email} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e4e4e7] bg-white text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 text-sm transition-colors"
                placeholder="joko@petani.id" required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-[#71717a] mb-1.5 font-medium">
                Nomor WA / HP <span className="text-[#a1a1aa] lowercase normal-case">(opsional)</span>
              </label>
              <input
                id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e4e4e7] bg-white text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 text-sm transition-colors"
                placeholder="+6281234567890"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-xs uppercase tracking-widest text-[#71717a] mb-1.5 font-medium">Peran</label>
                <select
                  id="role" name="role" value={form.role} onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e4e4e7] bg-white text-[#09090b] focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 text-sm transition-colors"
                >
                  <option value="farmer">Petani</option>
                  <option value="extension_officer">Penyuluh (PPL)</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-xs uppercase tracking-widest text-[#71717a] mb-1.5 font-medium">Wilayah</label>
                <input
                  id="location" name="location" type="text" value={form.location} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e4e4e7] bg-white text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 text-sm transition-colors"
                  placeholder="Ngawi, Jatim"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-widest text-[#71717a] mb-1.5 font-medium">
                Password <span className="text-[#a1a1aa] lowercase normal-case">(min. 8 karakter)</span>
              </label>
              <div className="relative">
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-[#e4e4e7] bg-white text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 text-sm transition-colors"
                  placeholder="Min. 8 karakter" required
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
              className="w-full mt-3 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan...</>
              ) : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-sm text-[#71717a] mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-emerald-700 font-medium hover:underline">Masuk ke akun</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

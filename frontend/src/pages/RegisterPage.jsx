import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    phone: '',
    location: 'Ngawi, Jawa Timur',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Nama, email, dan password wajib diisi.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await register(form);
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'extension_officer') {
        navigate('/extension');
      } else {
        navigate('/app');
      }
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Pendaftaran gagal';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-padi-500 flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-ink">Ramal<span className="text-padi-500">Tani</span></span>
          </Link>
          <h1 className="font-display text-3xl text-ink mb-2">Daftar Akun Baru</h1>
          <p className="text-muted text-sm">Akun Anda akan tersimpan langsung di database server PostgreSQL</p>
        </div>

        <div className="card card-body mb-4 bg-padi-50/70 border-padi-200">
          <div className="flex items-start gap-3">
            <Database size={18} className="text-padi-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-ink mb-0.5">Database Aktif & Terhubung</div>
              <div className="text-xs text-muted leading-relaxed">
                Terhubung ke <code>postgre.rizalzaky.cloud</code>. Akun yang Anda buat langsung tersimpan dan bisa digunakan untuk login kapan saja.
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
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} className="form-input" placeholder="Bpk. Joko Santoso" required />
          </div>
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="joko@petani.id" required />
          </div>
          <div>
            <label htmlFor="phone" className="form-label">Nomor WhatsApp / HP (Opsional)</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="form-input" placeholder="+6281234567890" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="role" className="form-label">Peran</label>
              <select id="role" name="role" value={form.role} onChange={handleChange} className="form-select">
                <option value="farmer">Petani</option>
                <option value="extension_officer">Penyuluh (PPL)</option>
              </select>
            </div>
            <div>
              <label htmlFor="location" className="form-label">Wilayah</label>
              <input id="location" name="location" type="text" value={form.location} onChange={handleChange} className="form-input" placeholder="Ngawi, Jatim" />
            </div>
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
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan ke Database...</>
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

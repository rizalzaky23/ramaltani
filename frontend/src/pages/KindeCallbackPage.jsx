import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Leaf, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function KindeCallbackPage() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const errParam = searchParams.get('error');

    if (errParam) {
      setError(decodeURIComponent(errParam));
      return;
    }

    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('ramaltani_token', token);
        localStorage.setItem('ramaltani_user', JSON.stringify(userData));

        // Short timeout for seamless visual transition
        setTimeout(() => {
          if (userData.role === 'admin') {
            window.location.href = '/admin';
          } else if (userData.role === 'extension_officer') {
            window.location.href = '/extension';
          } else {
            window.location.href = '/app';
          }
        }, 800);
      } catch (e) {
        setError('Gagal membaca data profil autentikasi: ' + e.message);
      }
    } else {
      setError('Data token atau sesi autentikasi tidak ditemukan.');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-white text-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md text-center relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
          <Leaf size={28} />
        </div>

        {error ? (
          <div className="rounded-2xl bg-white border border-red-500/20 p-6 text-left shadow-2xl">
            <div className="flex items-start gap-3 text-red-400 mb-3">
              <AlertCircle size={22} className="flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-medium text-white text-base">Gagal Autentikasi Google / Kinde</h2>
                <p className="text-xs text-[#71717a] mt-1 leading-relaxed">{error}</p>
              </div>
            </div>
            <a
              href="/login"
              className="w-full mt-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all flex items-center justify-center"
            >
              Kembali ke Halaman Masuk
            </a>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-[#e4e4e7] p-8 shadow-2xl">
            <div className="flex flex-col items-center py-2">
              <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mb-4" />
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1.5">
                <Sparkles size={12} />
                Sesi Terverifikasi
              </div>
              <h2 className="font-medium text-xl text-white font-normal mb-2">
                Menghubungkan Akun...
              </h2>
              <p className="text-[#71717a] text-xs max-w-xs leading-relaxed">
                Sedang memuat profil petani Anda dan mengarahkan ke dashboard cuaca lahan.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

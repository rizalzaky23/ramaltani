import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Leaf, AlertCircle, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-padi-500 text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-padi-500/20">
          <Leaf size={28} />
        </div>

        {error ? (
          <div className="card card-body text-left">
            <div className="flex items-start gap-3 text-bahaya mb-3">
              <AlertCircle size={22} className="flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-ink text-base">Gagal Autentikasi Google / Kinde</h2>
                <p className="text-sm text-muted mt-1">{error}</p>
              </div>
            </div>
            <a href="/login" className="btn btn-primary w-full justify-center mt-4">
              Kembali ke Halaman Masuk
            </a>
          </div>
        ) : (
          <div className="card card-body">
            <div className="flex flex-col items-center py-4">
              <div className="w-10 h-10 border-3 border-padi-500/30 border-t-padi-500 rounded-full animate-spin mb-4" />
              <h2 className="font-display text-xl font-bold text-ink mb-1">
                Autentikasi Berhasil
              </h2>
              <p className="text-muted text-sm max-w-xs">
                Sedang menghubungkan profil Anda ke database server dan memuat data pertanian...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

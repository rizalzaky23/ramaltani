import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Bell, Crosshair, Menu, X, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGPSLocation } from '../hooks/useGPSLocation';
import GPSLocationModal from '../components/GPSLocationModal';

const navItems = [
  { to: '/dashboard', label: 'Beranda', exact: true },
  { to: '/dashboard/rekomendasi', label: 'Rekomendasi Tanam' },
  { to: '/dashboard/peta-risiko', label: 'Peta Risiko' },
  { to: '/dashboard/riwayat', label: 'Riwayat Tanam' },
  { to: '/dashboard/peringatan', label: 'Peringatan' },
  { to: '/dashboard/komunitas', label: 'Komunitas' },
  { to: '/dashboard/edukasi', label: 'Edukasi' },
];

export default function FarmerLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    coords, nearestRegion, loading: gpsLoading, error: gpsError,
    permissionPrompted, requestGPS, setManualRegion, dismissPrompt,
  } = useGPSLocation();

  const [showGPSModal, setShowGPSModal] = useState(!permissionPrompted && !coords);

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to) && to !== '/dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-[#09090b] flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* GPS Modal */}
      <GPSLocationModal
        isOpen={showGPSModal}
        onClose={() => { setShowGPSModal(false); dismissPrompt(); }}
        coords={coords}
        onDetectGPS={requestGPS}
        onSelectManual={setManualRegion}
        loading={gpsLoading}
        error={gpsError}
      />

      {/* Evasion Floating Pill Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl transition-all duration-300">
        <div className="bg-white/85 backdrop-blur-md border border-[#e4e4e7] rounded-full px-5 py-2.5 flex items-center justify-between shadow-sm">
          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 font-medium tracking-tight text-base text-[#09090b] hover:opacity-80 transition-opacity">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-semibold">RamalTani</span>
            <span className="hidden sm:inline text-xs text-[#71717a] font-normal border-l border-[#e4e4e7] pl-2 ml-0.5">Petani</span>
          </Link>

          {/* Center Navigation Links (Desktop/Tablet) */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Menu navigasi utama">
            {navItems.map(item => {
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                      : 'text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* GPS Location Pill */}
            <button
              onClick={() => setShowGPSModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e4e4e7] hover:border-emerald-300 text-xs text-[#09090b] transition-all bg-white hover:bg-emerald-50/50 shadow-xs"
              title="Klik untuk ubah koordinat lahan"
            >
              <Crosshair size={12} className={coords?.isGPS ? 'text-emerald-600' : 'text-[#71717a]'} />
              <span className="truncate max-w-[90px] sm:max-w-[130px] font-medium">
                {coords?.regionName || nearestRegion?.name || 'Klaten'}
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded font-mono">
                {coords?.isGPS ? 'GPS' : 'Manual'}
              </span>
            </button>

            {/* Notifications link */}
            <Link
              to="/dashboard/peringatan"
              className="relative p-1.5 text-[#71717a] hover:text-[#09090b] transition-colors rounded-full hover:bg-[#f4f4f5]"
              aria-label="Peringatan dini"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </Link>

            {/* Profile Avatar / Link */}
            <Link
              to="/dashboard/profil"
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-[#f4f4f5] text-xs font-medium text-[#09090b] transition-colors border border-transparent hover:border-[#e4e4e7]"
              aria-label="Profil petani"
            >
              <span className="hidden sm:inline truncate max-w-[80px]">
                {user?.name || 'Petani'}
              </span>
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center text-[10px]">
                {(user?.name || 'P')[0]}
              </div>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#71717a] hover:text-[#09090b] rounded-full hover:bg-[#f4f4f5] transition-colors"
              aria-label={mobileMenuOpen ? "Tutup navigasi" : "Buka navigasi"}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Evasion-style overlay) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white/95 backdrop-blur-md border border-[#e4e4e7] rounded-3xl p-4 shadow-xl animate-slide-up">
            <div className="space-y-1 pb-3 border-b border-[#e4e4e7]">
              {navItems.map(item => {
                const active = isActive(item.to, item.exact);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={14} className={active ? 'text-emerald-600' : 'text-[#d4d4d8]'} />
                  </Link>
                );
              })}
            </div>
            <div className="pt-3 flex items-center justify-between px-2">
              <div className="text-xs text-[#71717a]">
                <div className="font-medium text-[#09090b]">{user?.name}</div>
                <div>{user?.location || 'Klaten, Jawa Tengah'}</div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors"
              >
                <LogOut size={13} />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area — Expansive, Minimalist, Full-width flow */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24" id="main-content">
        <Outlet context={{ coords, nearestRegion, requestGPS, openGPSModal: () => setShowGPSModal(true) }} />
      </main>

      {/* Mobile Bottom Navigation Bar (Quick Access for Farmers) */}
      <nav aria-label="Navigasi cepat mobile" className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm bg-white/90 backdrop-blur-md border border-[#e4e4e7] rounded-full py-2 px-3 shadow-lg flex items-center justify-around">
        <Link
          to="/dashboard"
          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
            location.pathname === '/dashboard' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-[#71717a]'
          }`}
        >
          Beranda
        </Link>
        <Link
          to="/dashboard/rekomendasi"
          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
            location.pathname.includes('/rekomendasi') ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-[#71717a]'
          }`}
        >
          Rekomendasi
        </Link>
        <Link
          to="/dashboard/peta-risiko"
          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
            location.pathname.includes('/peta') ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-[#71717a]'
          }`}
        >
          Peta Risiko
        </Link>
        <Link
          to="/dashboard/riwayat"
          className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
            location.pathname.includes('/riwayat') ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-[#71717a]'
          }`}
        >
          Riwayat
        </Link>
      </nav>

      {/* Clean Minimalist Evasion Footer */}
      <footer className="border-t border-[#e4e4e7] bg-white py-10 text-xs text-[#71717a] mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-medium text-[#09090b]">RamalTani</span>
            <span>— Platform Iklim & Pertanian Cerdas</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/dashboard" className="hover:text-[#09090b] transition-colors">Beranda</Link>
            <Link to="/dashboard/rekomendasi" className="hover:text-[#09090b] transition-colors">Rekomendasi</Link>
            <Link to="/dashboard/peta-risiko" className="hover:text-[#09090b] transition-colors">Peta Risiko</Link>
            <Link to="/dashboard/riwayat" className="hover:text-[#09090b] transition-colors">Riwayat</Link>
            <Link to="/dashboard/edukasi" className="hover:text-[#09090b] transition-colors">Edukasi</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

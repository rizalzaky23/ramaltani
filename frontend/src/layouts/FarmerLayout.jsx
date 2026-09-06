import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Home, MapPin, Calendar, Bell, Users, BookOpen, Settings,
  User, ChevronRight, LogOut, Leaf, X, Menu, BarChart2,
  Crosshair, Navigation
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGPSLocation } from '../hooks/useGPSLocation';
import GPSLocationModal from '../components/GPSLocationModal';

const navItems = [
  { to: '/dashboard', icon: <Home size={20} />, label: 'Beranda', exact: true },
  { to: '/dashboard/rekomendasi', icon: <Calendar size={20} />, label: 'Rekomendasi' },
  { to: '/dashboard/peta-risiko', icon: <MapPin size={20} />, label: 'Peta Risiko' },
  { to: '/dashboard/riwayat', icon: <BarChart2 size={20} />, label: 'Riwayat Tanam' },
  { to: '/dashboard/peringatan', icon: <Bell size={20} />, label: 'Peringatan' },
  { to: '/dashboard/komunitas', icon: <Users size={20} />, label: 'Komunitas' },
  { to: '/dashboard/edukasi', icon: <BookOpen size={20} />, label: 'Pusat Edukasi' },
  { to: '/dashboard/pengaturan', icon: <Settings size={20} />, label: 'Pengaturan' },
];

function SidebarNav({ onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to) && to !== '/dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-white font-body">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="RamalTani Beranda">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            <Leaf size={20} className="text-white" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-slate-900 block leading-tight">
              Ramal<span className="text-emerald-700">Tani</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide block uppercase">
              Smart Climate Agro
            </span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors" aria-label="Tutup menu">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto" aria-label="Menu navigasi petani">
        <div className="space-y-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(item.to, item.exact)
                  ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-2xs border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              aria-current={isActive(item.to, item.exact) ? 'page' : undefined}
            >
              <span className={isActive(item.to, item.exact) ? 'text-emerald-700' : 'text-slate-400'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* User profile & logout */}
      <div className="p-3 border-t border-slate-100">
        <Link to="/dashboard/profil" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors mb-1">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'Petani'}</div>
            <div className="text-xs text-slate-400 truncate">{user?.location || user?.email}</div>
          </div>
          <ChevronRight size={16} className="text-slate-300 flex-shrink-0" aria-hidden="true" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors text-xs font-semibold"
          aria-label="Keluar dari akun"
        >
          <LogOut size={16} aria-hidden="true" />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}

export default function FarmerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const {
    coords,
    nearestRegion,
    loading: gpsLoading,
    error: gpsError,
    permissionPrompted,
    requestGPS,
    setManualRegion,
    dismissPrompt,
  } = useGPSLocation();

  const [showGPSModal, setShowGPSModal] = useState(!permissionPrompted && !coords);

  // Get page title from current route
  const currentPage = navItems.find(n => {
    if (n.exact) return location.pathname === n.to;
    return location.pathname.startsWith(n.to) && n.to !== '/dashboard';
  }) || navItems[0];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* GPS Location Prompt Dialog */}
      <GPSLocationModal
        isOpen={showGPSModal}
        onClose={() => {
          setShowGPSModal(false);
          dismissPrompt();
        }}
        coords={coords}
        onDetectGPS={requestGPS}
        onSelectManual={setManualRegion}
        loading={gpsLoading}
        error={gpsError}
      />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-screen bg-white border-r border-slate-100 z-40" aria-label="Sidebar navigasi">
        <SidebarNav />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-white h-full shadow-2xl animate-slide-up">
            <SidebarNav onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Unified Top Navigation Header (Desktop & Tablet) */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              aria-label="Buka menu navigasi"
              aria-expanded={sidebarOpen}
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-slate-900 leading-tight">
                {currentPage?.label || 'Dashboard'}
              </h1>
              <span className="hidden sm:block text-[11px] text-slate-400">
                Prakiraan mikro & rekomendasi cerdas iklim
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* GPS Location Status Pill */}
            <button
              onClick={() => setShowGPSModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xs"
              title="Klik untuk mengubah atau memperbarui koordinat GPS lokasi Anda"
            >
              <Crosshair size={13} className={coords?.isGPS ? "text-emerald-600 animate-pulse" : "text-slate-400"} />
              <span className="truncate max-w-[130px] sm:max-w-[180px]">
                {coords?.regionName || nearestRegion?.name || 'Pilih Lokasi GPS'}
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                coords?.isGPS
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {coords?.isGPS ? 'GPS' : 'Manual'}
              </span>
            </button>

            <Link
              to="/dashboard/peringatan"
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Notifikasi & Peringatan"
            >
              <Bell size={19} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </Link>

            <Link
              to="/dashboard/profil"
              className="hidden sm:flex items-center gap-2 p-1.5 pl-2 rounded-full hover:bg-slate-50 transition-colors border border-slate-100"
              aria-label="Profil pengguna"
            >
              <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                {user?.name?.split(' ')[0] || 'Petani'}
              </span>
              <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
                {user?.name?.charAt(0) || 'P'}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8" id="main-content">
          <Outlet context={{ coords, nearestRegion, requestGPS, openGPSModal: () => setShowGPSModal(true) }} />
        </main>

        {/* Mobile bottom navigation */}
        <nav className="mobile-nav lg:hidden" aria-label="Navigasi bawah mobile">
          {navItems.slice(0, 5).map(item => {
            const active = location.pathname === item.to || (location.pathname.startsWith(item.to) && item.to !== '/dashboard');
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`mobile-nav-item ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}


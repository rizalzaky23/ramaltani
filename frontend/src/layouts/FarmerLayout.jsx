import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Home, MapPin, Calendar, Bell, Users, BookOpen, Settings,
  User, ChevronRight, LogOut, X, Menu, BarChart2, Crosshair
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGPSLocation } from '../hooks/useGPSLocation';
import GPSLocationModal from '../components/GPSLocationModal';

const navItems = [
  { to: '/dashboard', icon: <Home size={18} />, label: 'Beranda', exact: true },
  { to: '/dashboard/rekomendasi', icon: <Calendar size={18} />, label: 'Rekomendasi' },
  { to: '/dashboard/peta-risiko', icon: <MapPin size={18} />, label: 'Peta Risiko' },
  { to: '/dashboard/riwayat', icon: <BarChart2 size={18} />, label: 'Riwayat Tanam' },
  { to: '/dashboard/peringatan', icon: <Bell size={18} />, label: 'Peringatan' },
  { to: '/dashboard/komunitas', icon: <Users size={18} />, label: 'Komunitas' },
  { to: '/dashboard/edukasi', icon: <BookOpen size={18} />, label: 'Pusat Edukasi' },
  { to: '/dashboard/pengaturan', icon: <Settings size={18} />, label: 'Pengaturan' },
];

function SidebarNav({ onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to) && to !== '/dashboard';
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#e4e4e7]">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e4e7]">
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="RamalTani Beranda">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
            <span className="text-white text-xs font-bold">RT</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-[#09090b]">RamalTani</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors" aria-label="Tutup menu">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto" aria-label="Menu navigasi petani">
        <div className="space-y-0.5">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(item.to, item.exact)
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5]'
              }`}
              aria-current={isActive(item.to, item.exact) ? 'page' : undefined}
            >
              <span className={isActive(item.to, item.exact) ? 'text-emerald-600' : 'text-[#a1a1aa]'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* User profile & logout */}
      <div className="p-3 border-t border-[#e4e4e7]">
        <Link to="/dashboard/profil" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f4f4f5] transition-colors mb-1">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-[#09090b] truncate">{user?.name || 'Petani'}</div>
            <div className="text-xs text-[#71717a] truncate">{user?.location || user?.email}</div>
          </div>
          <ChevronRight size={14} className="text-[#d4d4d8] flex-shrink-0" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#71717a] hover:text-rose-600 hover:bg-rose-50 transition-colors text-sm"
          aria-label="Keluar dari akun"
        >
          <LogOut size={15} />
          Keluar
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
    coords, nearestRegion, loading: gpsLoading, error: gpsError,
    permissionPrompted, requestGPS, setManualRegion, dismissPrompt,
  } = useGPSLocation();

  const [showGPSModal, setShowGPSModal] = useState(!permissionPrompted && !coords);

  const currentPage = navItems.find(n => {
    if (n.exact) return location.pathname === n.to;
    return location.pathname.startsWith(n.to) && n.to !== '/dashboard';
  }) || navItems[0];

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#09090b] flex">
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

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 fixed top-0 left-0 h-screen z-40" aria-label="Sidebar navigasi">
        <SidebarNav />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-64 max-w-[85vw] h-full shadow-xl">
            <SidebarNav onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#e4e4e7] px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors"
              aria-label="Buka menu navigasi"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base font-semibold text-[#09090b] leading-tight tracking-tight">
                {currentPage?.label || 'Dashboard'}
              </h1>
              <span className="hidden sm:block text-xs text-[#71717a]">
                Prakiraan cuaca & rekomendasi tanam
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* GPS pill */}
            <button
              onClick={() => setShowGPSModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e4e4e7] hover:border-emerald-200 hover:bg-emerald-50 text-xs font-medium text-[#09090b] transition-all"
              title="Klik untuk mengubah koordinat GPS"
            >
              <Crosshair size={12} className={coords?.isGPS ? 'text-emerald-600' : 'text-[#71717a]'} />
              <span className="truncate max-w-[120px] sm:max-w-[160px]">
                {coords?.regionName || nearestRegion?.name || 'Pilih Lokasi'}
              </span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                coords?.isGPS ? 'bg-emerald-100 text-emerald-700' : 'bg-[#f4f4f5] text-[#71717a]'
              }`}>
                {coords?.isGPS ? 'GPS' : 'Manual'}
              </span>
            </button>

            <Link
              to="/dashboard/peringatan"
              className="relative p-2 rounded-lg text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors"
              aria-label="Notifikasi"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
            </Link>

            <Link
              to="/dashboard/profil"
              className="hidden sm:flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-[#f4f4f5] transition-colors border border-[#e4e4e7]"
              aria-label="Profil pengguna"
            >
              <span className="text-xs font-medium text-[#09090b] max-w-[80px] truncate">
                {user?.name?.split(' ')[0] || 'Petani'}
              </span>
              <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                {user?.name?.charAt(0) || 'P'}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8" id="main-content">
          <Outlet context={{ coords, nearestRegion, requestGPS, openGPSModal: () => setShowGPSModal(true) }} />
        </main>

        {/* Mobile bottom nav */}
        <nav className="mobile-nav lg:hidden" aria-label="Navigasi bawah mobile">
          {navItems.slice(0, 5).map(item => {
            const active = location.pathname === item.to || (location.pathname.startsWith(item.to) && item.to !== '/dashboard');
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`mobile-nav-item ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <span className={active ? 'text-emerald-600' : 'text-[#a1a1aa]'}>{item.icon}</span>
                <span>{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

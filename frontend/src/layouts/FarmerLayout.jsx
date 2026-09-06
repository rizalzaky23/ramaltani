import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Home, MapPin, Calendar, Bell, Users, BookOpen, Settings,
  User, ChevronRight, LogOut, Leaf, X, Menu, BarChart2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <Link to="/" className="flex items-center gap-2.5" aria-label="RamalTani Beranda">
          <div className="w-9 h-9 rounded-xl bg-padi-500 flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold text-ink">
            Ramal<span className="text-padi-500">Tani</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors" aria-label="Tutup menu">
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
              className={isActive(item.to, item.exact) ? 'nav-link-active' : 'nav-link'}
              aria-current={isActive(item.to, item.exact) ? 'page' : undefined}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* User profile & logout */}
      <div className="p-3 border-t border-border">
        <Link to="/dashboard/profil" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface transition-colors mb-1">
          <div className="w-9 h-9 rounded-full bg-padi-100 flex items-center justify-center text-padi-700 font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-ink truncate">{user?.name || 'Petani'}</div>
            <div className="text-xs text-muted truncate">{user?.village || user?.email}</div>
          </div>
          <ChevronRight size={16} className="text-muted flex-shrink-0" aria-hidden="true" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold"
          aria-label="Keluar dari akun"
        >
          <LogOut size={18} aria-hidden="true" />
          Keluar
        </button>
      </div>
    </div>
  );
}

export default function FarmerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Get page title from current route
  const currentPage = navItems.find(n => {
    if (n.exact) return location.pathname === n.to;
    return location.pathname.startsWith(n.to) && n.to !== '/dashboard';
  }) || navItems[0];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-screen bg-white border-r border-border z-40" aria-label="Sidebar navigasi">
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
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-white h-full shadow-xl animate-slide-up">
            <SidebarNav onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-muted hover:text-ink hover:bg-surface transition-colors"
            aria-label="Buka menu navigasi"
            aria-expanded={sidebarOpen}
          >
            <Menu size={22} />
          </button>
          <span className="font-display text-lg text-ink">{currentPage?.label || 'Dashboard'}</span>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/dashboard/peringatan" className="relative p-2 rounded-xl text-muted hover:text-ink hover:bg-surface transition-colors" aria-label="Notifikasi">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" aria-label="Ada notifikasi baru" />
            </Link>
            <Link to="/dashboard/profil" className="w-8 h-8 rounded-full bg-padi-100 flex items-center justify-center text-padi-700 font-bold text-sm" aria-label="Profil pengguna">
              B
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6" id="main-content">
          <Outlet />
        </main>

        {/* Mobile bottom navigation */}
        <nav className="mobile-nav" aria-label="Navigasi bawah mobile">
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

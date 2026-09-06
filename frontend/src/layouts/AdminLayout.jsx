import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Settings, Users, MapPin, Leaf, LogOut, Menu, X, Activity, Database, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/admin', icon: <Activity size={20} />, label: 'Dashboard', exact: true },
  { to: '/admin/users', icon: <Users size={20} />, label: 'Pengguna' },
  { to: '/admin/regions', icon: <MapPin size={20} />, label: 'Wilayah' },
  { to: '/admin/varieties', icon: <Leaf size={20} />, label: 'Varietas' },
  { to: '/admin/api', icon: <Activity size={20} />, label: 'API Monitor' },
  { to: '/admin/logs', icon: <Database size={20} />, label: 'System Logs' },
  { to: '/admin/settings', icon: <Settings size={20} />, label: 'Pengaturan' },
];

function SidebarNav({ onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to) && to !== '/admin';

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center">
            <Leaf size={18} className="text-padi-400" />
          </div>
          <div>
            <span className="font-display text-lg font-bold text-ink">RamalTani</span>
            <div className="text-xs text-ink/60 font-semibold">Admin Sistem</div>
          </div>
        </div>
        {onClose && <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-muted hover:text-ink" aria-label="Tutup menu"><X size={20} /></button>}
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={isActive(item.to, item.exact) ? 'nav-link bg-ink text-white hover:bg-ink' : 'nav-link'}
            aria-current={isActive(item.to, item.exact) ? 'page' : undefined}
          >
            {item.icon}{item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="px-3 py-3 mb-1">
          <div className="text-sm font-semibold text-ink">{user?.name}</div>
          <div className="text-xs text-muted">{user?.email}</div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted hover:text-red-600 hover:bg-red-50 text-sm font-semibold">
          <LogOut size={18} /> Keluar
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-screen bg-white border-r border-border z-40">
        <SidebarNav />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-white h-full shadow-xl">
            <SidebarNav onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="p-2 rounded-xl text-muted" aria-label="Menu"><Menu size={22} /></button>
          <span className="font-display text-lg text-ink">Admin Sistem</span>
        </header>
        <main className="flex-1 p-4 sm:p-6" id="main-content"><Outlet /></main>
      </div>
    </div>
  );
}

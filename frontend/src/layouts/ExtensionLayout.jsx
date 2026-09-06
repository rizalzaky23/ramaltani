import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Home, MapPin, Users, BarChart2, Megaphone, LogOut, Menu, X, Leaf, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/penyuluh', icon: <Home size={20} />, label: 'Beranda', exact: true },
  { to: '/penyuluh/petani', icon: <Users size={20} />, label: 'Data Petani' },
  { to: '/penyuluh/peta', icon: <MapPin size={20} />, label: 'Peta Risiko' },
  { to: '/penyuluh/analitik', icon: <BarChart2 size={20} />, label: 'Analitik' },
  { to: '/penyuluh/broadcast', icon: <Megaphone size={20} />, label: 'Broadcast' },
];

function SidebarNav({ onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to) && to !== '/penyuluh';

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-daun-600 flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <span className="font-display text-lg font-bold text-ink">RamalTani</span>
            <div className="text-xs text-daun-600 font-semibold">Penyuluh</div>
          </div>
        </Link>
        {onClose && <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-muted hover:text-ink" aria-label="Tutup menu"><X size={20} /></button>}
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={isActive(item.to, item.exact)
              ? 'nav-link bg-daun-50 text-daun-700'
              : 'nav-link hover:bg-daun-50 hover:text-daun-700'}
            aria-current={isActive(item.to, item.exact) ? 'page' : undefined}
          >
            {item.icon}{item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1">
          <div className="w-9 h-9 rounded-full bg-daun-100 flex items-center justify-center text-daun-700 font-bold text-sm">
            {user?.name?.charAt(0) || 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-ink truncate">{user?.name}</div>
            <div className="text-xs text-daun-600 font-medium">Penyuluh Pertanian</div>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold">
          <LogOut size={18} /> Keluar
        </button>
      </div>
    </div>
  );
}

export default function ExtensionLayout() {
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
          <button onClick={() => setOpen(true)} className="p-2 rounded-xl text-muted" aria-label="Buka menu"><Menu size={22} /></button>
          <span className="font-display text-lg text-ink">Dashboard Penyuluh</span>
        </header>
        <main className="flex-1 p-4 sm:p-6" id="main-content"><Outlet /></main>
      </div>
    </div>
  );
}

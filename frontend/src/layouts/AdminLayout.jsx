import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Settings, Users, MapPin, LogOut, Menu, X, Activity, Database } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/admin', icon: <Activity size={18} />, label: 'Dashboard', exact: true },
  { to: '/admin/users', icon: <Users size={18} />, label: 'Pengguna' },
  { to: '/admin/regions', icon: <MapPin size={18} />, label: 'Wilayah' },
  { to: '/admin/varieties', icon: <Settings size={18} />, label: 'Varietas' },
  { to: '/admin/api', icon: <Activity size={18} />, label: 'API Monitor' },
  { to: '/admin/logs', icon: <Database size={18} />, label: 'System Logs' },
  { to: '/admin/settings', icon: <Settings size={18} />, label: 'Pengaturan' },
];

function SidebarNav({ onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to) && to !== '/admin';

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#e4e4e7]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e4e7]">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#09090b] flex items-center justify-center">
            <span className="text-white text-xs font-bold">RT</span>
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-[#09090b]">RamalTani</span>
            <div className="text-[10px] text-[#71717a] uppercase tracking-wider">Admin Sistem</div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-[#71717a] hover:bg-[#f4f4f5]" aria-label="Tutup menu">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map(item => (
            <Link
              key={item.to} to={item.to} onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(item.to, item.exact)
                  ? 'bg-[#f4f4f5] text-[#09090b] font-semibold'
                  : 'text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5]'
              }`}
              aria-current={isActive(item.to, item.exact) ? 'page' : undefined}
            >
              <span className={isActive(item.to, item.exact) ? 'text-[#09090b]' : 'text-[#a1a1aa]'}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-[#e4e4e7]">
        <div className="px-3 py-3 mb-1 bg-[#fafafa] border border-[#e4e4e7] rounded-lg">
          <div className="text-sm font-medium text-[#09090b]">{user?.name || 'Administrator'}</div>
          <div className="text-xs text-[#71717a]">{user?.email}</div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#71717a] hover:text-rose-600 hover:bg-rose-50 transition-colors text-sm"
        >
          <LogOut size={15} /> Keluar
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#09090b] flex">
      <aside className="hidden lg:flex flex-col w-60 fixed top-0 left-0 h-screen z-40">
        <SidebarNav />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative flex flex-col w-64 max-w-[85vw] h-full shadow-xl">
            <SidebarNav onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-60 flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b border-[#e4e4e7] px-4 py-3 flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg text-[#71717a] hover:bg-[#f4f4f5]" aria-label="Menu">
            <Menu size={20} />
          </button>
          <span className="text-base font-semibold tracking-tight text-[#09090b]">Admin Sistem</span>
        </header>
        <main className="flex-1 p-4 sm:p-6" id="main-content"><Outlet /></main>
      </div>
    </div>
  );
}

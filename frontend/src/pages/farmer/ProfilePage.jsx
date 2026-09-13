import { useState } from 'react';
import { User, Phone, MapPin, Leaf, Edit3, Save, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { SectionHeader, DemoBadge } from '../../components/ui';

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || 'Budi Santoso',
    phone: user?.phone || '+6281234567890',
    village: user?.village || 'Desa Karanglo',
    region: 'Klaten, Jawa Tengah',
    mainCrop: 'Padi',
    farmArea: '2.0',
  });

  return (
    <div className="max-w-2xl mx-auto text-[#09090b] animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs uppercase tracking-widest mb-2">
            <Sparkles size={12} />
            Identitas Pengguna
          </div>
          <h1 className="font-medium text-2xl sm:text-3xl text-white font-normal">Profil Petani</h1>
          <p className="text-[#71717a] text-sm mt-1">Informasi identitas akun dan parameter hamparan lahan Anda.</p>
        </div>
        <DemoBadge />
      </div>

      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-7 mb-6 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-2xl font-medium flex-shrink-0 shadow-inner">
            {form.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-medium text-xl text-white font-normal">{form.name}</h2>
            <p className="text-xs text-[#71717a] mt-0.5">{form.village}, {form.region}</p>
            <p className="text-xs font-mono text-emerald-400 mt-1">{user?.email}</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`ml-auto px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              editing
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-[#fafafa] hover:bg-[#f4f4f5] border border-[#e4e4e7] text-white'
            }`}
            aria-label={editing ? 'Simpan perubahan' : 'Edit profil'}
          >
            {editing ? <><Save size={14} /> Simpan</> : <><Edit3 size={14} /> Edit</>}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Nama Lengkap', key: 'name', icon: <User size={14} /> },
            { label: 'Nomor WhatsApp / HP', key: 'phone', icon: <Phone size={14} /> },
            { label: 'Desa / Dusun', key: 'village', icon: <MapPin size={14} /> },
            { label: 'Komoditas Utama', key: 'mainCrop', icon: <Leaf size={14} /> },
            { label: 'Total Luas Lahan (ha)', key: 'farmArea', icon: null },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs uppercase tracking-widest text-[#71717a] mb-1.5 flex items-center gap-1.5">
                {f.icon && <span className="text-emerald-400">{f.icon}</span>}
                {f.label}
              </label>
              {editing ? (
                <input
                  type="text"
                  value={form[f.key]}
                  onChange={e => setForm(fm => ({...fm, [f.key]: e.target.value}))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-white focus:outline-none focus:border-emerald-500/50 text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-white py-2.5 px-4 bg-[#fafafa] rounded-xl border border-[#e4e4e7]">
                  {form[f.key]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={18} className="text-emerald-400" />
          <h3 className="font-medium text-base text-white font-normal">Status Akun Terdaftar</h3>
        </div>
        <div className="space-y-2 text-xs font-mono divide-y divide-white/5">
          <div className="flex justify-between py-2 first:pt-0">
            <span className="text-[#71717a]">Alamat Email</span>
            <span className="text-white">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[#71717a]">Peran Akses</span>
            <span className="text-emerald-400 capitalize">{user?.role === 'farmer' ? 'Petani' : user?.role}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[#71717a]">Status Sesi</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Aktif & Terverifikasi
            </span>
          </div>
        </div>
        <p className="text-[11px] text-[#71717a] mt-4 p-3 bg-[#fafafa] rounded-xl border border-[#e4e4e7]">
          Data tersimpan di server database PostgreSQL. Pengaturan ini mempengaruhi rekomendasi otomatis yang disajikan di dashboard Anda.
        </p>
      </div>
    </div>
  );
}

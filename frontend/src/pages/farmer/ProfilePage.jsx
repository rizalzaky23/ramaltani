import { useState } from 'react';
import { User, Phone, MapPin, Leaf, Edit3, Save, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { DemoBadge } from '../../components/ui';

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
    <div className="max-w-2xl mx-auto text-[#09090b] page-enter">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs uppercase tracking-widest font-semibold mb-2">
            <Sparkles size={12} />
            Identitas Pengguna
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#09090b] tracking-tight">Profil Petani</h1>
          <p className="text-[#71717a] text-sm mt-1">Informasi identitas akun dan parameter hamparan lahan Anda.</p>
        </div>
        <DemoBadge />
      </div>

      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-7 mb-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-semibold text-2xl flex-shrink-0">
            {form.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#09090b]">{form.name}</h2>
            <p className="text-xs text-[#71717a] mt-0.5">{form.village}, {form.region}</p>
            <p className="text-xs font-mono text-emerald-700 mt-1">{user?.email}</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`ml-auto px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              editing
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-white hover:bg-emerald-50 border border-[#e4e4e7] hover:border-emerald-300 text-[#09090b]'
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
              <label className="block text-xs uppercase tracking-widest text-[#71717a] font-medium mb-1.5 flex items-center gap-1.5">
                {f.icon && <span className="text-emerald-600">{f.icon}</span>}
                {f.label}
              </label>
              {editing ? (
                <input
                  type="text"
                  value={form[f.key]}
                  onChange={e => setForm(fm => ({...fm, [f.key]: e.target.value}))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e4e4e7] text-[#09090b] focus:outline-none focus:border-emerald-500 text-sm"
                />
              ) : (
                <p className="text-sm font-medium text-[#09090b] py-2.5 px-4 bg-[#fafafa] rounded-xl border border-[#e4e4e7]">
                  {form[f.key]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={18} className="text-emerald-600" />
          <h3 className="font-semibold text-base text-[#09090b]">Status Akun Terdaftar</h3>
        </div>
        <div className="space-y-2 text-xs font-mono divide-y divide-[#e4e4e7]">
          <div className="flex justify-between py-2 first:pt-0">
            <span className="text-[#71717a]">Alamat Email</span>
            <span className="text-[#09090b] font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[#71717a]">Peran Akses</span>
            <span className="text-emerald-700 font-medium capitalize">{user?.role === 'farmer' ? 'Petani' : user?.role}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[#71717a]">Status Sesi</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
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

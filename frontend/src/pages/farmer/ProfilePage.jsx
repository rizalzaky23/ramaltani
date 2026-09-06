import { useState } from 'react';
import { User, Phone, MapPin, Leaf, Edit3, Save } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto">
      <SectionHeader title="Profil Petani" subtitle="Informasi akun dan data lahan Anda" action={<DemoBadge />} />

      <div className="card card-body mb-5">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-padi-100 flex items-center justify-center text-padi-700 font-bold text-2xl font-display">
            {form.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-display text-xl text-ink">{form.name}</h2>
            <p className="text-sm text-muted">{form.village}, {form.region}</p>
            <p className="text-xs text-padi-600 font-semibold mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`ml-auto btn btn-sm ${editing ? 'btn-primary' : 'btn-secondary'}`}
            aria-label={editing ? 'Simpan perubahan' : 'Edit profil'}
          >
            {editing ? <><Save size={14} /> Simpan</> : <><Edit3 size={14} /> Edit</>}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Nama Lengkap', key: 'name', icon: <User size={15} /> },
            { label: 'Nomor HP', key: 'phone', icon: <Phone size={15} /> },
            { label: 'Desa', key: 'village', icon: <MapPin size={15} /> },
            { label: 'Tanaman Utama', key: 'mainCrop', icon: <Leaf size={15} /> },
            { label: 'Total Luas Lahan (ha)', key: 'farmArea', icon: null },
          ].map(f => (
            <div key={f.key}>
              <label className="form-label flex items-center gap-1.5">
                {f.icon && <span className="text-muted">{f.icon}</span>}
                {f.label}
              </label>
              {editing ? (
                <input
                  type="text"
                  value={form[f.key]}
                  onChange={e => setForm(fm => ({...fm, [f.key]: e.target.value}))}
                  className="form-input"
                />
              ) : (
                <p className="text-sm font-semibold text-ink py-2.5 px-4 bg-surface rounded-xl border border-border">
                  {form[f.key]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card card-body">
        <h3 className="font-display text-base text-ink mb-3">Akun Demo</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted">Email</span>
            <span className="font-semibold text-ink">{user?.email}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted">Peran</span>
            <span className="font-semibold text-padi-600 capitalize">{user?.role === 'farmer' ? 'Petani' : user?.role}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted">Status</span>
            <span className="font-semibold text-padi-600">Aktif</span>
          </div>
        </div>
        <p className="text-xs text-muted mt-4 p-3 bg-surface rounded-lg">
          Ini adalah akun demo untuk demonstrasi platform RamalTani. Perubahan profil tidak tersimpan permanen.
        </p>
      </div>
    </div>
  );
}

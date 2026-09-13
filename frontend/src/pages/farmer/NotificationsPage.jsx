import { useState } from 'react';
import { Bell, MessageSquare, Smartphone, Mail, AlertTriangle, CheckCircle, Info, Check, Sparkles } from 'lucide-react';
import { SectionHeader, DemoBadge } from '../../components/ui';
import { DEMO_NOTIFICATIONS, DEMO_ALERTS } from '../../data/mockData';

const channelIcon = {
  in_app: <Bell size={14} />,
  whatsapp: <MessageSquare size={14} />,
  sms: <Smartphone size={14} />,
  email: <Mail size={14} />,
};

const channelLabel = {
  in_app: 'In-App',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  email: 'Email',
};

function NotificationItem({ notif }) {
  const [read, setRead] = useState(notif.isRead);

  return (
    <div
      className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
        read
          ? 'bg-white border-[#e4e4e7] hover:border-[#d4d4d8]'
          : 'bg-[#161B24] border-emerald-500/30 shadow-lg shadow-emerald-500/5'
      }`}
      onClick={() => setRead(true)}
      aria-label={`Notifikasi: ${notif.title}${!read ? ' (Belum dibaca)' : ''}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        notif.type === 'weather_alert' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
        notif.type === 'recommendation' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
        'bg-sky-500/10 text-sky-400 border border-sky-500/20'
      }`} aria-hidden="true">
        {notif.type === 'weather_alert' ? <AlertTriangle size={16} /> :
         notif.type === 'recommendation' ? <CheckCircle size={16} /> :
         <Info size={16} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-white">{notif.title}</span>
          {!read && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" aria-label="Belum dibaca" />}
        </div>
        <p className="text-xs text-[#71717a] leading-relaxed mb-2.5">{notif.message}</p>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className={`flex items-center gap-1 font-semibold ${
            notif.channel === 'whatsapp' ? 'text-emerald-400' : 'text-[#71717a]'
          }`}>
            {channelIcon[notif.channel]}
            {channelLabel[notif.channel]}
          </span>
          {notif.deliveryStatus === 'delivered' && (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <Check size={12} strokeWidth={2.5} /> Terkirim
            </span>
          )}
          <span className="text-[#71717a]">
            {new Date(notif.sentAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [notifications] = useState(DEMO_NOTIFICATIONS);
  const [alerts] = useState(DEMO_ALERTS);
  const [prefs, setPrefs] = useState({ whatsapp: true, sms: false, email: true, in_app: true });

  return (
    <div className="max-w-3xl mx-auto text-[#09090b] animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs uppercase tracking-widest mb-2">
            <Sparkles size={12} />
            Pusat Notifikasi & Telemetri
          </div>
          <h1 className="font-medium text-2xl sm:text-3xl text-white font-normal">Peringatan & Notifikasi</h1>
          <p className="text-[#71717a] text-sm mt-1">
            Pantau siaran cuaca ekstrem BMKG dan panduan mitigasi dari balai penyuluh pertanian.
          </p>
        </div>
        <DemoBadge />
      </div>

      {/* Active alerts */}
      {alerts.length > 0 && (
        <div className="mb-6">
          <h2 className="font-medium text-base text-white font-normal mb-3">Peringatan Iklim Kritis</h2>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl flex items-start gap-3 border shadow-lg ${
                  alert.level === 'danger'
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-200'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                }`}
                role="alert"
              >
                <AlertTriangle size={18} className={`flex-shrink-0 mt-0.5 ${alert.level === 'danger' ? 'text-rose-400' : 'text-amber-400'}`} aria-hidden="true" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">{alert.label}</span>
                    <span className="text-xs opacity-75">· {alert.source}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{alert.title}</p>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification list */}
      <div className="mb-6">
        <h2 className="font-medium text-base text-white font-normal mb-3">Semua Notifikasi</h2>
        <div className="space-y-3">
          {notifications.map(n => <NotificationItem key={n.id} notif={n} />)}
        </div>
      </div>

      {/* Notification preferences */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-xl">
        <h2 className="font-medium text-base text-white font-normal mb-1">Kanal & Saluran Siaran</h2>
        <p className="text-xs text-[#71717a] mb-4 leading-relaxed">
          Pilih saluran penerimaan peringatan dini dan saran tanam mingguan dari sistem.
        </p>
        <div className="space-y-3 divide-y divide-white/5">
          {[
            { key: 'in_app', label: 'Notifikasi dalam aplikasi', icon: <Bell size={16} />, alwaysOn: true },
            { key: 'whatsapp', label: 'WhatsApp Bot (Paling Cepat)', icon: <MessageSquare size={16} /> },
            { key: 'sms', label: 'SMS Broadcast (Area Terpencil)', icon: <Smartphone size={16} /> },
            { key: 'email', label: 'Email Ringkasan Mingguan', icon: <Mail size={16} /> },
          ].map(ch => (
            <div key={ch.key} className="flex items-center justify-between pt-3 first:pt-0">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400" aria-hidden="true">{ch.icon}</span>
                <span className="text-sm font-medium text-white">{ch.label}</span>
                {ch.alwaysOn && <span className="text-xs font-mono text-[#71717a]">(selalu aktif)</span>}
              </div>
              <button
                onClick={() => !ch.alwaysOn && setPrefs(p => ({ ...p, [ch.key]: !p[ch.key] }))}
                disabled={ch.alwaysOn}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  prefs[ch.key] ? 'bg-emerald-500' : 'bg-[#1E222D]'
                } ${ch.alwaysOn ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label={`${ch.label}: ${prefs[ch.key] ? 'aktif' : 'nonaktif'}`}
                aria-pressed={prefs[ch.key]}
                role="switch"
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${prefs[ch.key] ? 'translate-x-5' : 'translate-x-0'}`} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

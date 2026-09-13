import { useState } from 'react';
import { Bell, MessageSquare, Smartphone, Mail, AlertTriangle, CheckCircle, Info, Check, Sparkles } from 'lucide-react';
import { DemoBadge } from '../../components/ui';
import { DEMO_NOTIFICATIONS, DEMO_ALERTS } from '../../data/mockData';
import { useScrollReveal } from '../../hooks/useScrollReveal';

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
          ? 'bg-white border-[#e4e4e7] hover:border-emerald-200'
          : 'bg-emerald-50/50 border-emerald-200/80 shadow-sm'
      }`}
      onClick={() => setRead(true)}
      aria-label={`Notifikasi: ${notif.title}${!read ? ' (Belum dibaca)' : ''}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        notif.type === 'weather_alert' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
        notif.type === 'recommendation' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
        'bg-sky-100 text-sky-700 border border-sky-200'
      }`} aria-hidden="true">
        {notif.type === 'weather_alert' ? <AlertTriangle size={16} /> :
         notif.type === 'recommendation' ? <CheckCircle size={16} /> :
         <Info size={16} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-[#09090b]">{notif.title}</span>
          {!read && <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse flex-shrink-0" aria-label="Belum dibaca" />}
        </div>
        <p className="text-xs text-[#71717a] leading-relaxed mb-2.5">{notif.message}</p>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className={`flex items-center gap-1 font-medium ${
            notif.channel === 'whatsapp' ? 'text-emerald-700' : 'text-[#71717a]'
          }`}>
            {channelIcon[notif.channel]}
            {channelLabel[notif.channel]}
          </span>
          {notif.deliveryStatus === 'delivered' && (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
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
  const containerRef = useScrollReveal();

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto text-[#09090b] page-enter">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-[#71717a] font-medium mb-3">
          Pusat Notifikasi & Telemetri
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#09090b] leading-[1.08]">
          Peringatan & Notifikasi
        </h1>
        <p className="text-base sm:text-lg text-[#71717a] mt-3 max-w-2xl leading-relaxed">
          Siaran cuaca ekstrem BMKG, panduan mitigasi lapangan, dan preferensi saluran pesan pertanian.
        </p>
      </div>

      {/* Active alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 reveal-up">
          <h2 className="font-medium text-base text-[#09090b] mb-3">Peringatan Iklim Kritis</h2>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl flex items-start gap-3 border shadow-sm ${
                  alert.level === 'danger'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
                role="alert"
              >
                <AlertTriangle size={18} className={`flex-shrink-0 mt-0.5 ${alert.level === 'danger' ? 'text-rose-600' : 'text-amber-600'}`} aria-hidden="true" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">{alert.label}</span>
                    <span className="text-xs opacity-75">· {alert.source}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#09090b]">{alert.title}</p>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification list */}
      <div className="mb-6 reveal-up">
        <h2 className="font-medium text-base text-[#09090b] mb-3">Semua Notifikasi</h2>
        <div className="space-y-3">
          {notifications.map(n => <NotificationItem key={n.id} notif={n} />)}
        </div>
      </div>

      {/* Notification preferences */}
      <div className="rounded-2xl bg-white border border-[#e4e4e7] p-5 sm:p-6 shadow-sm reveal-up">
        <h2 className="font-medium text-base text-[#09090b] mb-1">Kanal & Saluran Siaran</h2>
        <p className="text-xs text-[#71717a] mb-4 leading-relaxed">
          Pilih saluran penerimaan peringatan dini dan saran tanam mingguan dari sistem.
        </p>
        <div className="space-y-3 divide-y divide-[#e4e4e7]">
          {[
            { key: 'in_app', label: 'Notifikasi dalam aplikasi', icon: <Bell size={16} />, alwaysOn: true },
            { key: 'whatsapp', label: 'WhatsApp Bot (Paling Cepat)', icon: <MessageSquare size={16} /> },
            { key: 'sms', label: 'SMS Broadcast (Area Terpencil)', icon: <Smartphone size={16} /> },
            { key: 'email', label: 'Email Ringkasan Mingguan', icon: <Mail size={16} /> },
          ].map(ch => (
            <div key={ch.key} className="flex items-center justify-between pt-3 first:pt-0">
              <div className="flex items-center gap-3">
                <span className="text-emerald-600" aria-hidden="true">{ch.icon}</span>
                <span className="text-sm font-medium text-[#09090b]">{ch.label}</span>
                {ch.alwaysOn && <span className="text-xs font-mono text-[#71717a]">(selalu aktif)</span>}
              </div>
              <button
                onClick={() => !ch.alwaysOn && setPrefs(p => ({ ...p, [ch.key]: !p[ch.key] }))}
                disabled={ch.alwaysOn}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  prefs[ch.key] ? 'bg-emerald-600' : 'bg-[#e4e4e7]'
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

import { useState } from 'react';
import { Bell, MessageSquare, Smartphone, Mail, AlertTriangle, CheckCircle, Info } from 'lucide-react';
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
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer hover:shadow-sm ${
        read ? 'bg-white border-border' : 'bg-padi-50 border-padi-200'
      }`}
      onClick={() => setRead(true)}
      aria-label={`Notifikasi: ${notif.title}${!read ? ' (Belum dibaca)' : ''}`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
        notif.type === 'weather_alert' ? 'bg-panen-100 text-panen-600' :
        notif.type === 'recommendation' ? 'bg-padi-100 text-padi-600' :
        'bg-langit-100 text-langit-600'
      }`} aria-hidden="true">
        {notif.type === 'weather_alert' ? <AlertTriangle size={16} /> :
         notif.type === 'recommendation' ? <CheckCircle size={16} /> :
         <Info size={16} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-ink">{notif.title}</span>
          {!read && <span className="w-2 h-2 rounded-full bg-padi-500 flex-shrink-0" aria-label="Belum dibaca" />}
        </div>
        <p className="text-xs text-muted leading-relaxed mb-2">{notif.message}</p>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 text-xs font-semibold ${
            notif.channel === 'whatsapp' ? 'text-green-600' : 'text-muted'
          }`}>
            {channelIcon[notif.channel]}
            {channelLabel[notif.channel]}
            {notif.deliveryStatus === 'delivered' && ' ✓ Terkirim'}
          </span>
          <span className="text-xs text-muted">
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
    <div className="max-w-2xl mx-auto">
      <SectionHeader
        title="Peringatan & Notifikasi"
        subtitle="Peringatan cuaca dan informasi terbaru dari penyuluh"
        action={<DemoBadge />}
      />

      {/* Active alerts */}
      {alerts.length > 0 && (
        <div className="mb-6">
          <h2 className="font-display text-base text-ink mb-3">Peringatan Aktif</h2>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`alert-${alert.level === 'danger' ? 'danger' : 'warning'}`} role="alert">
                <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wide">{alert.label}</span>
                    <span className="text-xs text-muted">· {alert.source}</span>
                  </div>
                  <p className="text-sm font-semibold">{alert.title}</p>
                  <p className="text-xs mt-0.5 leading-relaxed opacity-90">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification list */}
      <div className="mb-6">
        <h2 className="font-display text-base text-ink mb-3">Semua Notifikasi</h2>
        <div className="space-y-3">
          {notifications.map(n => <NotificationItem key={n.id} notif={n} />)}
        </div>
      </div>

      {/* Notification preferences */}
      <div className="card card-body">
        <h2 className="font-display text-base text-ink mb-4">Preferensi Notifikasi</h2>
        <p className="text-xs text-muted mb-4 leading-relaxed">
          Simulasi pengaturan notifikasi. Dalam produksi, ini akan terhubung ke provider notifikasi nyata (WhatsApp, SMS via Twilio, dll).
        </p>
        <div className="space-y-3">
          {[
            { key: 'in_app', label: 'Notifikasi dalam aplikasi', icon: <Bell size={16} />, alwaysOn: true },
            { key: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare size={16} /> },
            { key: 'sms', label: 'SMS', icon: <Smartphone size={16} /> },
            { key: 'email', label: 'Email', icon: <Mail size={16} /> },
          ].map(ch => (
            <div key={ch.key} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-padi-500" aria-hidden="true">{ch.icon}</span>
                <span className="text-sm font-medium text-ink">{ch.label}</span>
                {ch.alwaysOn && <span className="text-xs text-muted">(selalu aktif)</span>}
              </div>
              <button
                onClick={() => !ch.alwaysOn && setPrefs(p => ({ ...p, [ch.key]: !p[ch.key] }))}
                disabled={ch.alwaysOn}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  prefs[ch.key] ? 'bg-padi-500' : 'bg-border'
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

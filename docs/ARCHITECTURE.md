# 🏛️ Arsitektur Sistem — RamalTani

Dokumen ini menjelaskan arsitektur tingkat tinggi (*high-level architecture*), komponen infrastruktur, pola komunikasi data, dan keputusan teknis di balik platform RamalTani.

---

## 1. Diagram Arsitektur Tingkat Tinggi

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + Vite)                      │
│                    Running at http://localhost:5173                    │
│                                                                        │
│   ┌────────────────────┐   ┌────────────────────┐   ┌──────────────┐   │
│   │ Dashboard Petani   │   │  Rekomendasi Tanam │   │ Peta Risiko  │   │
│   │ (Cuaca BMKG Live)  │   │   (Rule Engine)    │   │  (Leaflet)   │   │
│   └─────────┬──────────┘   └─────────┬──────────┘   └───────┬──────┘   │
└─────────────┼────────────────────────┼──────────────────────┼──────────┘
              │                        │                      │
       HTTP REST Requests (Bearer JWT Token)                  │
              ▼                        ▼                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     BACKEND API (Node.js + Express 5)                  │
│                    Running at http://localhost:5001                    │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Middleware Layer: CORS, Helmet, RateLimiter, JWT Auth          │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │                                   │
│   ┌────────────────────────────────┴───────────────────────────────┐   │
│   │ Routes: /api/weather, /api/recommendations, /api/auth, /api    │   │
│   └──────┬─────────────────────────┬───────────────────────┬───────┘   │
│          │                         │                       │           │
│          ▼                         ▼                       ▼           │
│   ┌──────────────┐         ┌──────────────┐        ┌───────────────┐   │
│   │WeatherService│         │Recommendation│        │  AuthService  │   │
│   │ (Cache 30m)  │         │    Engine    │        │  (JWT/Bcrypt) │   │
│   └──────┬───────┘         └──────────────┘        └───────┬───────┘   │
└──────────┼─────────────────────────────────────────────────┼───────────┘
           │                                                 │
           ├────────────────────────┐                        │
           ▼                        ▼                        ▼
┌──────────────────────┐  ┌──────────────────┐   ┌──────────────────────┐
│  BMKG Open Data API  │  │  Open-Meteo API  │   │  Kinde Google OAuth  │
│  (api.bmkg.go.id)    │  │  (7-Day Extended)│   │  (OAuth Callback:    │
│  Prakiraan 3 Harian  │  │  Global Weather  │   │   http://localhost:  │
│  per kode ADM4       │  │  Data Pelengkap  │   │   3000/callback)     │
└──────────────────────┘  └──────────────────┘   └──────────────────────┘
                                                             │
                                                             ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   PERSISTENCE LAYER (PostgreSQL 16)                    │
│                Remote Server: postgre.rizalzaky.cloud                  │
│                                                                        │
│        Tunnel: cloudflared access tcp -> localhost:5433 -> 5432        │
│          Database: ramaltani_db | 11 Tables (Users, History, dll)      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Komponen & Alur Komunikasi

### A. Frontend Layer (`frontend/`)
- Dibangun dengan **React 18** berbasis bundler **Vite** untuk build time yang cepat dan reaktivitas instan.
- **Styling**: Tailwind CSS dengan custom agricultural color palette (tema warna hijau `padi`, emas `panen`, cokelat `tanah`).
- **Peta Interaktif**: `react-leaflet` dan `leaflet` menggunakan base map OpenStreetMap untuk memvisualisasikan zonasi risiko cuaca regional.
- **State Management & Auth**: Context API (`AuthContext`) mengelola sesi login pengguna, data token JWT di `localStorage`, serta profil petani.

### B. Backend Layer (`backend/`)
- Menggunakan **Express 5** dengan modular routing.
- **Service Layer**:
  - `bmkgService.js`: Bertanggung jawab berkomunikasi dengan API BMKG, mengelola in-memory cache menggunakan `node-cache` (TTL 30 menit) guna meminimalkan latensi dan mencegah rate-limiting BMKG.
  - `weatherService.js`: Mengorkestrasi data primer BMKG dan data sekunder satelit Open-Meteo.
  - `weatherNormalizer.js`: Menstandarkan payload BMKG dan Open-Meteo ke format model cuaca terpadu (*unified schema*).
  - `recommendationEngine.js`: Menerjemahkan deret waktu parameter cuaca ke dalam status kelayakan tanam, jendela tanam (*planting window*), dan skor risiko (0-100).
  - `authService.js`: Registrasi dan login email/password dengan enkripsi bcrypt dan penerbitan JSON Web Token (JWT).

### C. Mekanisme Dual-Port Server & Kinde OAuth Bridge
Karena Kinde Console pengguna didaftarkan dengan Redirect Callback URL `http://localhost:3000/callback`, sedangkan API backend berjalan di port `5001` (menghindari konflik AirPlay Receiver macOS di port 5000):
- Server backend menginisiasi **dua listener HTTP sekaligus**:
  1. **Port 5001**: Listener utama melayani seluruh request REST API (`/api/*`), rate limiter, CORS, dan sinkronisasi data.
  2. **Port 3000 (Bridge Listener)**: Listener sekunder yang khusus menangkap callback OAuth `http://localhost:3000/callback` dari Kinde, lalu meneruskan sesi otentikasi ke `/kinde-success` di backend port 5001 secara mulus tanpa error redirect URI mismatch.

### D. Jembatan Cloudflare Tunnel ke Server Database
- Database PostgreSQL berjalan di server privat pengguna (`Ubuntu 24.04`, PostgreSQL 16) yang diekspos melalui **Cloudflare Tunnel** dengan domain `postgre.rizalzaky.cloud`.
- Modul `backend/src/db/tunnel.js` secara otomatis memeriksa ketersediaan jembatan TCP lokal (`cloudflared access tcp --hostname postgre.rizalzaky.cloud --url 127.0.0.1:5433`).
- Pool koneksi `pg.Pool` menghubungkan backend ke `127.0.0.1:5433` yang secara transparan terenkripsi end-to-end menuju database server `ramaltani_db`.

---

## 3. Struktur Direktori Proyek

```text
ramaltani/
├── backend/
│   ├── scripts/
│   │   └── patch-kinde.js       # Otomasi patch bundler Kinde untuk Node v26
│   ├── src/
│   │   ├── app.js               # Entry point Express, route mounts, dual-port listener
│   │   ├── config/              # Konfigurasi env, BMKG baseUrl, JWT, CORS
│   │   ├── controllers/         # Handler logic terisolasi
│   │   ├── data/
│   │   │   └── mockData.js      # Metadata wilayah (ADM4), varietas, & fallback
│   │   ├── db/
│   │   │   ├── index.js         # Pool PostgreSQL pg
│   │   │   ├── schema.sql       # DDL 11 tabel database
│   │   │   ├── migrate.js       # Script migrasi & seeding otomatis
│   │   │   └── tunnel.js        # Helper auto-start Cloudflare tunnel bridge
│   │   ├── middleware/          # JWT auth, role guard, error handler, rate limit
│   │   ├── routes/              # api.js, auth.js, weather.js, recommendations.js
│   │   ├── services/            # bmkgService, weatherService, authService, openMeteo
│   │   └── utils/               # recommendationEngine, weatherNormalizer, apiResponse
├── frontend/
│   ├── src/
│   │   ├── components/          # UI primitives, Navbar, WeatherIcons, Badges
│   │   ├── data/                # Metadata wilayah & data komoditas
│   │   ├── hooks/               # useAuth, custom state hooks
│   │   ├── layouts/             # FarmerLayout, ExtensionLayout, AdminLayout
│   │   ├── pages/               # DashboardHome, RecommendationPage, RiskMapPage, dll
│   │   ├── services/            # Axios API client & interceptors
│   │   ├── App.jsx              # Routing React Router DOM v6
│   │   └── main.jsx             # React DOM root render
├── docs/                        # Dokumentasi teknis sistem
└── README.md                    # Ringkasan proyek & panduan cepat
```

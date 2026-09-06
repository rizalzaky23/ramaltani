# 🌾 RamalTani — Dokumentasi Sistem & Panduan Teknis

Selamat datang di direktori dokumentasi resmi **RamalTani** (*Climate-Smart Farming Decision Platform*). Dokumen ini disusun untuk memberikan gambaran arsitektur, integrasi API cuaca BMKG, skema basis data PostgreSQL, alur otentikasi Google via Kinde, dan panduan instalasi/deployment.

---

## 📑 Daftar Isi Dokumentasi

| Dokumen | Deskripsi |
| :--- | :--- |
| **[1. Arsitektur Sistem (`ARCHITECTURE.md`)](./ARCHITECTURE.md)** | Arsitektur full-stack, diagram komponen, data flow, dan dual-port server bridge. |
| **[2. Integrasi Data Real-Time BMKG (`BMKG_INTEGRATION.md`)](./BMKG_INTEGRATION.md)** | Detail endpoint API BMKG Open Data, daftar kode ADM4 wilayah, algoritma normalisasi cuaca, dan hybrid forecast 7 hari dengan Open-Meteo. |
| **[3. Basis Data & Skema PostgreSQL (`DATABASE.md`)](./DATABASE.md)** | Struktur 11 tabel database, ERD, relasi, migrasi, dan konfigurasi remote server melalui Cloudflare Tunnel. |
| **[4. Referensi Lengkap REST API (`API_DOCUMENTATION.md`)](./API_DOCUMENTATION.md)** | Spesifikasi semua endpoint backend (Auth, Weather, Recommendations, Risk Map, Crops, History, Community, Admin, dll). |
| **[5. Sistem Otentikasi & Kinde OAuth (`AUTHENTICATION.md`)](./AUTHENTICATION.md)** | Alur login email/password (JWT) dan Single Sign-On (SSO) Google menggunakan Kinde Node Express SDK. |
| **[6. Panduan Instalasi & Deployment (`DEPLOYMENT_AND_SETUP.md`)](./DEPLOYMENT_AND_SETUP.md)** | Cara menjalankan backend, frontend, konfigurasi file `.env`, dependensi, dan perintah deploy. |

---

## 🚀 Ringkasan Singkat Platform

- **Nama Produk**: RamalTani
- **Tagline**: *Baca Cuaca. Atur Tanam. Jaga Panen.*
- **Tujuan Utama**: Membantu petani padi dan komoditas pangan di Indonesia mengambil keputusan waktu tanam yang presisi di tengah ketidakpastian perubahan iklim dengan menerjemahkan data cuaca resmi BMKG ke dalam rekomendasi yang praktis dan mudah dipahami.
- **Teknologi Utama**:
  - **Backend**: Node.js, Express 5, PostgreSQL 16 (Remote Server via Cloudflare Tunnel), Axios, Zod, JWT, NodeCache.
  - **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Leaflet / React-Leaflet (Peta Interaktif), Recharts.
  - **Otentikasi**: Kinde Express SDK (`@kinde-oss/kinde-node-express`) untuk Google Auth + Bcrypt JWT untuk akun email.
  - **Sumber Data Cuaca**: API Resmi BMKG Open Data (`api.bmkg.go.id`) sebagai sumber primer + Open-Meteo untuk prakiraan lanjutan 7 hari.

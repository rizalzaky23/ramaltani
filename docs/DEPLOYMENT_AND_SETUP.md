# 🚀 Panduan Instalasi, Konfigurasi & Deployment — RamalTani

Dokumen ini memandu Anda dalam menyiapkan lingkungan pengembangan lokal (*local development*) maupun instalasi server produksi untuk platform RamalTani.

---

## 1. Prasyarat Sistem (*Prerequisites*)

- **Node.js**: Versi 18.x, 20.x, 22.x, atau 26.x.
- **NPM**: Versi 9.x atau lebih baru.
- **PostgreSQL**: Versi 14, 15, atau 16.
- **Cloudflare Tunnel (`cloudflared`)**: Diperlukan jika mengakses database melalui remote bridge `postgre.rizalzaky.cloud`.

---

## 2. Konfigurasi Variabel Lingkungan (*Environment Variables*)

### A. Backend (`backend/.env`)
Salin file `.env.example` ke `backend/.env` atau gunakan konfigurasi berikut:
```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Konfigurasi PostgreSQL Remote
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=ramaltani_db
DB_USER=ramaltani_user
DB_PASSWORD=rizal2302.

# Keamanan JWT
JWT_SECRET=ramaltani_super_secret_jwt_key_2026_climate_smart
JWT_EXPIRES_IN=7d

# Kinde Google OAuth
KINDE_CLIENT_ID=a00410884d8e4a6db60f78c7784477d3
KINDE_ISSUER_BASE_URL=https://rizalzaky.kinde.com
KINDE_SITE_URL=http://localhost:5001/kinde-success
KINDE_CLIENT_SECRET=WRidKLM6K6ngUX3YJEYwHukS0tcOyVCjw6R3cdkCtqfWnVYfWW
KINDE_REDIRECT_URL=http://localhost:3000/callback

# BMKG API
BMKG_BASE_URL=https://api.bmkg.go.id
BMKG_CACHE_TTL_SECONDS=1800
```

### B. Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 3. Langkah Menjalankan Aplikasi Secara Lokal

### Langkah 1: Kloning Repositori
```bash
git clone https://github.com/rizalzaky23/ramaltani.git
cd ramaltani
```

### Langkah 2: Setup Database & Backend
```bash
cd backend
npm install
npm run db:migrate # Inisialisasi tabel dan seed data awal
node src/app.js
```
*Backend akan berjalan di port `5001` dengan jembatan Kinde callback aktif di port `3000`.*

### Langkah 3: Menjalankan Frontend
Buka tab terminal baru:
```bash
cd frontend
npm install
npm run dev
```
*Frontend akan aktif di `http://localhost:5173`.*

---

## 4. Akun Percobaan Bawaan (*Default Accounts*)

Jika tidak ingin login menggunakan akun Google, tersedia akun demo berikut:

| Peran (*Role*) | Email | Password |
| :--- | :--- | :--- |
| **Petani (Farmer)** | `petani@ramaltani.id` | `Demo1234!` |
| **Penyuluh (Extension Officer)** | `penyuluh@ramaltani.id` | `Demo1234!` |
| **Admin Sistem** | `admin@ramaltani.id` | `Demo1234!` |

---

## 5. Build Produksi Frontend

Untuk menghasilkan bundle produksi yang siap dideploy ke web server (Nginx, Vercel, Netlify):
```bash
cd frontend
npm run build
```
File statis hasil kompilasi akan berada di folder `frontend/dist/`.

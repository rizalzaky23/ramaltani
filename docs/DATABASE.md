# 🗄️ Dokumentasi Basis Data & Skema PostgreSQL — RamalTani

Dokumen ini mendokumentasikan skema basis data **PostgreSQL 16**, relasi antar tabel, konfigurasi remote server melalui Cloudflare Tunnel, serta mekanisme migrasi data.

---

## 1. Konfigurasi Koneksi & Remote Server

Database berjalan pada server Ubuntu milik pengguna dan dihubungkan ke aplikasi melalui **Cloudflare Tunnel**:

- **Host Remote**: `postgre.rizalzaky.cloud`
- **Port Asli PostgreSQL**: `5432`
- **Jembatan Lokal TCP (Cloudflare Tunnel)**: `127.0.0.1:5433`
- **Nama Database**: `ramaltani_db`
- **Nama Pengguna**: `ramaltani_user`
- **Konektor Node.js**: `pg` (`pg.Pool`)

### Mekanisme Jembatan Otomatis (`backend/src/db/tunnel.js`)
Saat server Node.js dimulai, modul `tunnel.js` secara otomatis memeriksa apakah port TCP `127.0.0.1:5433` sudah aktif. Jika belum, modul akan meluncurkan proses latar belakang:
```bash
cloudflared access tcp --hostname postgre.rizalzaky.cloud --url 127.0.0.1:5433
```
Hal ini memastikan aplikasi dapat mengakses database di server tanpa perlu membuka port firewall publik yang rentan serangan.

---

## 2. Struktur Skema 11 Tabel

### 1. Tabel `users` (Pengguna & Petani)
Menyimpan profil akun petani, penyuluh, dan admin. Kolom `password_hash` dibuat opsional (`NULLABLE`) untuk mendukung pengguna yang login menggunakan Google via Kinde.
```sql
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password_hash VARCHAR(255), -- Nullable untuk pengguna OAuth Google
  role VARCHAR(50) NOT NULL DEFAULT 'farmer', -- 'farmer', 'extension_officer', 'admin'
  location VARCHAR(150),
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  commodity VARCHAR(100),
  land_size_ha NUMERIC(6, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Tabel `regions` (Wilayah Administrasi Pertanian)
Menyimpan metadata daerah pemantauan serta kode ADM4 BMKG.
```sql
CREATE TABLE IF NOT EXISTS regions (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  adm4_code VARCHAR(50),
  area_label VARCHAR(100),
  main_crops TEXT[],
  total_farmers INT DEFAULT 0,
  total_area_ha NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Tabel `crops` (Komoditas Pertanian)
Data karakteristik tanaman dan ambang batas optimal cuaca.
```sql
CREATE TABLE IF NOT EXISTS crops (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  scientific_name VARCHAR(150),
  category VARCHAR(50),
  optimal_rainfall_mm_min INT,
  optimal_rainfall_mm_max INT,
  optimal_temp_c_min NUMERIC(4, 1),
  optimal_temp_c_max NUMERIC(4, 1),
  growing_period_days INT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Tabel `varieties` (Varietas Benih)
Daftar varietas benih per komoditas beserta daya tahan cekaman iklim (kekeringan / genangan air).
```sql
CREATE TABLE IF NOT EXISTS varieties (
  id VARCHAR(50) PRIMARY KEY,
  crop_id VARCHAR(50) REFERENCES crops(id) ON DELETE CASCADE,
  crop_name VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  duration_days INT,
  potential_yield_ton_ha NUMERIC(4, 2),
  resistance TEXT[],
  description TEXT,
  recommended_season VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Tabel `planting_history` (Riwayat Tanam Petani)
Pencatatan realisasi masa tanam, penggunaan varietas, dan hasil panen aktual.
```sql
CREATE TABLE IF NOT EXISTS planting_history (
  id VARCHAR(50) PRIMARY KEY,
  farmer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  crop_name VARCHAR(100) NOT NULL,
  variety VARCHAR(100),
  planting_date DATE NOT NULL,
  harvest_date DATE,
  area_ha NUMERIC(6, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'planning', 'active', 'harvested', 'failed'
  yield_target_ton NUMERIC(6, 2),
  yield_actual_ton NUMERIC(6, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Tabel `notifications` (Notifikasi Pengguna)
Pemberitahuan perubahan cuaca, rekomendasi baru, dan pengumuman penyuluh.
```sql
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- 'alert', 'warning', 'info', 'recommendation'
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. Tabel `risk_alerts` (Peringatan Dini Cuaca Ekstrem)
Peringatan cuaca ekstrem (hujan lebat, angin kencang) per wilayah.
```sql
CREATE TABLE IF NOT EXISTS risk_alerts (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  level VARCHAR(50) NOT NULL, -- 'rendah', 'waspada', 'bahaya'
  region_name VARCHAR(100) NOT NULL,
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  action_advice TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. Tabel `community_posts` (Forum Komunitas Petani)
Diskusi dan pertukaran informasi antar petani dan penyuluh.
```sql
CREATE TABLE IF NOT EXISTS community_posts (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(150) NOT NULL,
  author_role VARCHAR(50) DEFAULT 'Petani',
  location VARCHAR(150),
  category VARCHAR(100) DEFAULT 'Tanya Jawab',
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 9. Tabel `community_comments` (Komentar Diskusi)
Komentar dan tanggapan pada postingan komunitas.
```sql
CREATE TABLE IF NOT EXISTS community_comments (
  id VARCHAR(50) PRIMARY KEY,
  post_id VARCHAR(50) REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(150) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10. Tabel `education_articles` (Artikel Edukasi Pertanian)
Panduan bertani cerdas iklim dan literasi membaca prakiraan cuaca.
```sql
CREATE TABLE IF NOT EXISTS education_articles (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  reading_time VARCHAR(50) NOT NULL,
  author VARCHAR(100) NOT NULL,
  published_date VARCHAR(50) NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 11. Tabel `system_logs` (Audit & Log Operasional)
Audit jejak log sistem backend dan sinkronisasi cuaca.
```sql
CREATE TABLE IF NOT EXISTS system_logs (
  id SERIAL PRIMARY KEY,
  level VARCHAR(20) DEFAULT 'info',
  category VARCHAR(50),
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 3. Eksekusi Migrasi & Seeding

Untuk menjalankan inisialisasi tabel dan mengisi data awal (*seed data*):
```bash
cd backend
npm run db:migrate
```
Script tersebut akan:
1. Membaca file `backend/src/db/schema.sql` dan mengeksekusi DDL `CREATE TABLE IF NOT EXISTS`.
2. Mengisi akun pengguna default, 9 wilayah pertanian dengan kode ADM4 BMKG, komoditas padi, varietas benih unggul, dan artikel edukasi.

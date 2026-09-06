# 🌱 RamalTani — Climate-Smart Farming Decision Platform

> **"Baca Cuaca. Atur Tanam. Jaga Panen."**  
> *Data cuaca yang rumit diterjemahkan menjadi keputusan tanam yang sederhana.*

RamalTani adalah platform pertanian cerdas iklim (Climate-Smart Agriculture) berbasis web yang dirancang khusus untuk petani kecil dan menengah di Indonesia. Platform ini menerjemahkan data cuaca teknis dan variabilitas iklim menjadi rekomendasi kalender tanam praktis, peringatan dini risiko ekstrem, mitigasi hama/penyakit, dan koordinasi lapangan dengan petugas penyuluh pertanian.

---

## 🌾 Fitur Utama

1. **Dashboard Petani Ramah Budaya Lokal**:
   - Ringkasan cuaca hari ini & prakiraan 7-14 hari ke depan (Open-Meteo & BMKG).
   - Indikator kesesuaian tanam berbasis algoritma agronomi cerdas (hijau/kuning/merah).
   - Kalender tanam dinamis yang menyesuaikan pola musim hujan/kemarau terkini.
   - Peringatan dini cuaca ekstrem (banjir, kekeringan, angin kencang).

2. **Mesin Rekomendasi Tanam (Planting Decision Engine)**:
   - Analisis kecocokan varietas komoditas (Padi Ciherang/Inpari, Jagung Hibrida, Cabai Merah, Kedelai, Bawang Merah).
   - Rekomendasi tanggal optimal tanam, kebutuhan air harian, serta estimasi panen.
   - Peringatan hama & penyakit terkait kelembapan tinggi / cuaca basah/kering.

3. **Peta Risiko Spasial Interaktif**:
   - Pemetaan wilayah sentra pertanian di Jawa Timur & Jawa Tengah dengan visualisasi Leaflet.
   - Pemantauan status risiko wilayah (Aman, Waspada, Bahaya).

4. **Kanal Edukasi & Komunitas Petani**:
   - Artikel panduan praktik pertanian adaptif iklim.
   - Forum diskusi komunitas petani antar-daerah.

5. **Portal Petugas Penyuluh Lapangan (PPL)**:
   - Pantauan agregat risiko petani binaan di tingkat kecamatan/kabupaten.
   - Fitur broadcast peringatan dini dan rekomendasi massal.

6. **Portal Admin & Pemantauan Sistem**:
   - Manajemen pengguna & peran (Petani, Penyuluh, Admin).
   - Monitoring kesehatan integrasi API BMKG & Open-Meteo.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Leaflet / React-Leaflet
- **Backend**: Node.js, Express.js, CORS, Axios
- **Integrasi Cuaca**: Open-Meteo Weather API & BMKG Data Normalizer
- **Arsitektur**: RESTful API + Role-Based Access Control (Farmer, Extension Officer, Admin)

---

## 🚀 Panduan Menjalankan Aplikasi Secara Lokal

### 1. Prasyarat
- Node.js versi 18 atau lebih baru
- npm / yarn / pnpm

### 2. Clone Repositori
```bash
git clone https://github.com/rizalzaky23/ramaltani.git
cd ramaltani
```

### 3. Setup Backend
```bash
cd backend
npm install
cp ../.env.example .env
npm run dev # Berjalan di http://localhost:5000
```

### 4. Setup Frontend
Buka terminal baru di direktori root:
```bash
cd frontend
npm install
npm run dev # Berjalan di http://localhost:5173
```

Akses browser di `http://localhost:5173`.

---

## 🔑 Akun Demo Cepat

Di halaman Login (`/login`), tersedia tombol **Login Demo Cepat** untuk mencoba masing-masing peran:
- **Petani (Farmer)**: Bpk. Joko Santoso (Ngawi, Jawa Timur)
- **Penyuluh (Extension Officer)**: Ibu Sri Wahyuni, S.P. (Kab. Ngawi)
- **Admin**: Administrator RamalTani

---

## 📄 Lisensi
Distributed under the MIT License. Lihat file `LICENSE` untuk detail lebih lanjut.

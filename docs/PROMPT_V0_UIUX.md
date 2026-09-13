# PROMPT UNTUK v0.app — Redesign UI/UX RamalTani (Versi Ringkas)

Salin teks di bawah ini ke v0.app setelah memilih template. Cukup daftar nama page + penjelasan singkat, tanpa spesifikasi detail agar desainnya tidak mengikuti web lama.

---

**PROMPT MULAI DI SINI**

Buatkan ulang UI/UX aplikasi **RamalTani** — platform pertanian cerdas iklim untuk petani Indonesia (data cuaca BMKG → rekomendasi waktu tanam, peringatan dini, koordinasi penyuluh). Semua teks UI pakai **Bahasa Indonesia**. Pakai template yang sudah saya pilih sebagai gaya dasar, lalu buat desain yang **segar dan berbeda** dari web lama. Tanaman/tema agrikultur, nuansa hijau alami, warnanya hangat dan bersahabat.

Saya butuh 21+ screen berikut:

**Publik**
1. Landing Page — halaman beranda promosi (hero + rekomendasi cuaca/tanam, fitur, cara kerja, cakupan wilayah, testimoni, CTA, footer)
2. Login — form masuk pakai email atau Google, plus tombol isi-otomatis 3 akun demo (Petani, Penyuluh, Admin)
3. Register — form daftar akun (nama, email, HP, peran, wilayah, password) atau Google
4. Callback Autentikasi — halaman loading sukses / gagal setelah login Google
5. 404 — halaman tidak ditemukan

**Petani** (sidebar + topbar, di mobile pakai bottom nav)
6. Beranda — sambutan, cuaca hari ini + prakiraan 7 hari (grafik hujan), kartu rekomendasi waktu tanam, tindakan lapangan hari ini, notifikasi cuaca, statistik ringkas
7. Rekomendasi Tanam — form input lahan/tanaman → hasil rekomendasi waktu tanam + faktor cuaca + saran varietas
8. Peta Risiko — peta interaktif (Leaflet/OSM) dengan marker risiko 9 wilayah, daftar wilayah, legenda, detail wilayah terpilih
9. Riwayat Tanam — statistik hasil, grafik hasil per musim, tabel riwayat tanam
10. Peringatan & Notifikasi — peringatan cuaca aktif, daftar notifikasi, preferensi channel (WhatsApp/SMS/Email)
11. Komunitas — forum petani: filter kategori, kartu postingan, tombol like, modal buat postingan
12. Pusat Edukasi — daftar artikel + halaman baca artikel
13. Profil — info akun petani + data lahan, mode edit
14. Pengaturan — halaman pengaturan akun

**Penyuluh** (sidebar)
15. Dashboard Penyuluh — statistik binaan, grafik aktivitas tanam/panen, distribusi komoditas, risiko per wilayah, daftar petani, modal broadcast pesan
16. Data Petani — tabel daftar petani binaan
17. Peta Risiko — peta risiko (sama dengan punya petani)
18. Analitik — ringkasan statistik wilayah
19. Broadcast — riwayat & pengiriman pesan massal

**Admin** (sidebar)
20. Dashboard Admin — statistik sistem, monitoring API (BMKG/Open-Meteo), tabel pengguna, log sistem
21. Manajemen (Pengguna, Wilayah, Varietas, API Monitor, System Logs, Pengaturan) — halaman-halaman kelola data & sistem

Buat konsisten: badge status cuaca/risiko (Aman/Perlu Perhatian/Berisiko/Darurat) dengan ikon + warna, badge "Live BMKG", progress bar tingkat keyakinan, dan data contoh saja (mock). Responsif penuh untuk HP, tablet, dan desktop.

SELESAI
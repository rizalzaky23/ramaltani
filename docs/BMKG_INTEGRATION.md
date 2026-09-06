# 🌦️ Panduan Integrasi BMKG Open Data API — RamalTani

Dokumen ini menjelaskan secara menyeluruh integrasi data cuaca nyata (*live data*) dari **Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) Republik Indonesia** pada platform RamalTani.

---

## 1. Sumber Data & Endpoint API BMKG

BMKG menyediakan layanan API publik berbasis kode wilayah administrasi tingkat 4 (Kelurahan/Desa) tanpa memerlukan API key rahasia:

- **Base URL**: `https://api.bmkg.go.id`
- **Endpoint Utama**: `/publik/prakiraan-cuaca?adm4={KODE_ADM4}`
- **Metode**: `GET`
- **Format**: JSON
- **Headers yang Diperlukan**:
  ```http
  Accept: application/json
  User-Agent: RamalTani/1.0 (climate-smart-farming-platform)
  ```

---

## 2. Pemetaan Kode Wilayah ADM4 BMKG

RamalTani memetakan sentra pertanian utama ke kode ADM4 resmi BMKG. Kode dipilih pada **kecamatan pusat kota / sentra pertanian representatif** agar data cuaca yang ditampilkan cocok dengan apa yang dilihat masyarakat pada portal resmi BMKG:

| ID Wilayah | Nama Kabupaten/Kota | Provinsi | Kecamatan Representatif | Desa/Kelurahan | Kode ADM4 BMKG | Koordinat (Lat, Lon) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `reg-001` | **Klaten** | Jawa Tengah | Klaten Utara | Sekarsuli | `33.10.24.2001` | `-7.693996, 110.597314` |
| `reg-002` | **Sleman** | DI Yogyakarta | Kalasan | Tamanmartani | `34.04.10.2003` | `-7.742715, 110.482215` |
| `reg-003` | **Bantul** | DI Yogyakarta | Bambanglipuro | Sidomulyo | `34.02.05.2001` | `-7.957629, 110.300479` |
| `reg-004` | **Kulon Progo** | DI Yogyakarta | Kokap | Hargorejo | `34.01.08.2002` | `-7.854200, 110.124500` |
| `reg-005` | **Magelang** | Jawa Tengah | Srumbung | Kamongan | `33.08.05.2001` | `-7.589100, 110.312400` |
| `reg-006` | **Karanganyar** | Jawa Tengah | Jumantono | Tunggulrejo | `33.13.04.2001` | `-7.671200, 110.963400` |
| `reg-007` | **Sragen** | Jawa Tengah | Gondang | Glonggong | `33.14.06.2001` | `-7.401200, 111.112300` |
| `reg-008` | **Boyolali** | Jawa Tengah | Teras | Kopen | `33.09.07.2001` | `-7.521300, 110.634200` |
| `reg-009` | **Ngawi** | Jawa Timur | Ngawi (Kota) | Mangunharjo | `35.21.09.2001` | `-7.461413, 111.480637` |

> [!NOTE]
> **Catatan Penting Pemilihan ADM4 Ngawi:**
> Sebelumnya kode `35.21.01.2001` mengarah ke Kecamatan Sine (lereng Gunung Lawu dengan suhu dingin 16°C dan kabut pegunungan). Kini diperbarui ke `35.21.09.2001` (Kecamatan Ngawi Kota) sehingga suhu dan cuaca cocok persis dengan observasi sentra persawahan dataran rendah Ngawi (24°C – 33°C).

---

## 3. Struktur JSON Response BMKG & Algoritma Parsing

### A. Struktur Payload Mentah
API BMKG mengembalikan struktur objek sebagai berikut:
```json
{
  "lokasi": {
    "adm1": "35",
    "adm2": "35.21",
    "adm3": "35.21.09",
    "adm4": "35.21.09.2001",
    "provinsi": "Jawa Timur",
    "kotkab": "Ngawi",
    "kecamatan": "Ngawi",
    "desa": "Mangunharjo",
    "lon": 111.480636605,
    "lat": -7.4614131318,
    "timezone": "Asia/Jakarta"
  },
  "data": [
    {
      "lokasi": { ... },
      "cuaca": [
        [
          {
            "datetime": "2026-09-06T17:00:00Z",
            "t": 24,
            "tp": 0,
            "weather": 0,
            "weather_desc": "Cerah",
            "hu": 75,
            "ws": 15.1,
            "wd": "S",
            "image": "https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah-pm.svg",
            "local_datetime": "2026-09-07 00:00:00"
          },
          ...
        ]
      ]
    }
  ]
}
```

### B. Algoritma Penentuan Cuaca Saat Ini (*Current Weather*)
Dalam modul `backend/src/utils/weatherNormalizer.js`:
1. Seluruh array titik waktu (`cuaca`) diratakan (*flattened*) dengan `cuaca.flat(2)`.
2. Sistem mencari titik waktu yang **paling mendekati waktu saat ini (`new Date()`)**:
   ```javascript
   const now = new Date();
   let closestPoint = flatPoints[0];
   let minDiff = Infinity;
   for (const p of flatPoints) {
     const pTime = new Date(p.datetime || p.utc_datetime).getTime();
     const diff = Math.abs(pTime - now.getTime());
     if (diff < minDiff) {
       minDiff = diff;
       closestPoint = p;
     }
   }
   ```
3. Suhu terkini (`temperature`), deskripsi cuaca (`weatherDesc`), kelembapan, kecepatan angin, dan URL SVG ikon BMKG diambil langsung dari `closestPoint`.

### C. Agregasi Prakiraan Harian (*Daily Forecast*)
Untuk setiap hari:
- **Suhu Min & Maks**: Dihitung dari `Math.min(...temps)` dan `Math.max(...temps)`.
- **Rata-rata Suhu & Kelembapan**: Diakumulasikan secara proporsional.
- **Total Curah Hujan**: Akumulasi presipitasi (`tp` dalam mm).
- **Peluang Hujan (% Rain Probability)**: Dihitung secara objektif dari indikator curah hujan BMKG dan status cuaca hujan.

---

## 4. Strategi Hybrid: BMKG + Open-Meteo (7 Hari)

BMKG Open Data API menyediakan prakiraan 3 hari ke depan dengan akurasi terverifikasi per kelurahan. Untuk kebutuhan perencanaan kalender tanam petani (7 hari ke depan):
1. **Hari 1 s/d Hari 3**: 100% menggunakan data resmi BMKG.
2. **Hari 4 s/d Hari 7**: Secara otomatis disambung (*seamlessly extended*) menggunakan data model satelit cuaca Open-Meteo pada koordinat lintang/bujur yang persis sama.
3. Seluruh payload tetap terstandarisasi dalam satu format konsisten sehingga UI frontend tidak mengalami diskontinuitas data.

---

## 5. Strategi Caching & Kinerja

Untuk menjaga kecepatan respon server di bawah 5 milidetik dan mematuhi etika konsumsi API publik BMKG:
- Menggunakan **`NodeCache`** di file `backend/src/services/bmkgService.js`.
- **Cache TTL**: 1800 detik (30 Menit).
- Setiap request kedua untuk wilayah yang sama akan langsung dilayani dari memori cache lokal server.
- Indikator `fromCache: true/false` disertakan dalam meta response API.

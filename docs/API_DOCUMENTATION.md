# 📡 Dokumentasi Spesifikasi REST API — RamalTani

Semua endpoint REST API RamalTani beroperasi di bawah Base URL `http://localhost:5001/api`.

---

## 1. Format Standar Respons (*Response Envelope*)

Semua respons API menggunakan struktur JSON konsisten:

### Respons Sukses (`200 OK` / `201 Created`)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-09-06T16:25:00.000Z",
    "source": "BMKG Resmi",
    "isLive": true,
    "isDemo": false
  }
}
```

### Respons Error (`4xx` / `5xx`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Deskripsi pesan error dalam Bahasa Indonesia"
  }
}
```

---

## 2. Otentikasi (`/api/auth`)

### `POST /api/auth/register`
Mendaftarkan akun petani atau penyuluh baru.
- **Request Body**:
  ```json
  {
    "name": "Budi Santoso",
    "email": "budi@tani.id",
    "password": "Password123!",
    "phone": "081234567890",
    "role": "farmer",
    "location": "Ngawi",
    "commodity": "Padi",
    "landSize": 1.5
  }
  ```
- **Response**: Mengembalikan objek user dan JWT token.

### `POST /api/auth/login`
Autentikasi akun email & password.
- **Request Body**:
  ```json
  {
    "email": "budi@tani.id",
    "password": "Password123!"
  }
  ```
- **Response**: Objek user dan token akses JWT.

### `GET /api/auth/me`
Mengambil profil akun yang sedang login.
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`

### `GET /login` (Kinde Google OAuth)
Membuka antarmuka login Single Sign-On (SSO) Google resmi via Kinde.

---

## 3. Layanan Cuaca Real-Time BMKG (`/api/weather`)

### `GET /api/weather/:regionId`
Mengambil cuaca saat ini (*current hour*) dan prakiraan 7 hari ke depan untuk wilayah tertentu.
- **Parameter URL**: `regionId` (contoh: `reg-001` untuk Klaten, `reg-009` untuk Ngawi).
- **Contoh Respons**:
  ```json
  {
    "success": true,
    "data": {
      "location": {
        "name": "Ngawi",
        "city": "Ngawi",
        "subdistrict": "Ngawi",
        "village": "Mangunharjo",
        "province": "Jawa Timur",
        "adm4": "35.21.09.2001"
      },
      "current": {
        "date": "2026-09-07",
        "time": "00:00",
        "temperature": 24,
        "temperatureMin": 23,
        "temperatureMax": 33,
        "description": "Cerah",
        "humidity": 75,
        "windSpeed": 15.1,
        "iconUrl": "https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah-pm.svg"
      },
      "forecast": [
        {
          "date": "2026-09-07",
          "dateLabel": "Sen, 7 Sep",
          "temperature": 27,
          "temperatureMin": 23,
          "temperatureMax": 33,
          "description": "Cerah",
          "rainProbability": 20,
          "rainfallMm": 0,
          "humidity": 65,
          "iconUrl": "https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah-am.svg"
        }
      ],
      "source": "BMKG Resmi",
      "isLive": true,
      "isDemo": false
    }
  }
  ```

### `GET /api/weather/alerts`
Mengambil daftar peringatan dini cuaca aktif yang dihitung secara dinamis dari prakiraan cuaca BMKG.
- **Response**: Array alert dengan level `warning` atau `info` jika peluang hujan >65% atau curah hujan >20mm.

### `GET /api/weather/regions`
Mendapatkan daftar seluruh 9 wilayah pemantauan beserta kode ADM4 BMKG.

---

## 4. Rekomendasi Tanam & Peta Risiko (`/api/recommendations` & `/api/risk-map`)

### `POST /api/recommendations/calculate`
Menghitung rekomendasi jendela tanam dan skor risiko iklim menggunakan *climate-aware rule engine* terhadap data cuaca nyata BMKG.
- **Request Body**:
  ```json
  {
    "regionId": "reg-009",
    "cropName": "Padi",
    "varietyName": "Ciherang",
    "soilCondition": "normal",
    "farmArea": 1.2
  }
  ```
- **Contoh Respons**:
  ```json
  {
    "success": true,
    "data": {
      "crop": "Padi",
      "variety": "Ciherang",
      "recommendation": {
        "status": "LAYAK TANAM",
        "window": {
          "start": "7 September 2026",
          "end": "10 September 2026",
          "startDate": "2026-09-07",
          "endDate": "2026-09-10"
        },
        "confidence": 82,
        "risk": "Rendah",
        "riskBadge": "Aman",
        "riskScore": 15,
        "riskColor": "#6E9F43",
        "reason": "Kondisi cuaca BMKG mendukung penanaman.",
        "action": "Mulai persiapan lahan dan benih."
      }
    },
    "meta": {
      "source": "BMKG Resmi",
      "isLive": true,
      "isDemo": false
    }
  }
  ```

### `GET /api/risk-map`
Mengambil data pemetaan risiko cuaca real-time untuk seluruh 9 wilayah berbasis prakiraan BMKG. Digunakan pada halaman peta Leaflet.
- **Contoh Objek Item**:
  ```json
  {
    "regionId": "reg-009",
    "regionName": "Ngawi",
    "province": "Jawa Timur",
    "latitude": -7.461413,
    "longitude": 111.480637,
    "score": 15,
    "level": "low",
    "label": "Aman",
    "color": "#6E9F43",
    "currentTemp": 24,
    "currentWeather": "Cerah",
    "rainProbability": 20,
    "source": "BMKG Resmi",
    "isLive": true,
    "isDemo": false
  }
  ```

---

## 5. Komoditas, Riwayat & Komunitas

- `GET /api/crops`: Daftar seluruh komoditas pangan.
- `GET /api/varieties?cropName=Padi`: Daftar varietas benih padi beserta sifat ketahanannya.
- `GET /api/planting-history`: Riwayat tanam petani yang tersimpan di PostgreSQL.
- `POST /api/planting-history`: Menyimpan catatan masa tanam baru.
- `GET /api/community/posts`: Mengambil daftar postingan diskusi forum petani.
- `POST /api/community/posts`: Membuat postingan baru di forum.
- `POST /api/broadcast`: Mengirim pesan himbauan iklim dari penyuluh ke kelompok tani.

---

## 6. Monitoring & Status Sistem (`/api/health` & `/api/admin`)

- `GET /api/health`: Status kesehatan umum server Express dan koneksi PostgreSQL.
- `GET /api/admin/api-health`: Status latency & ketersediaan koneksi ke BMKG Open Data API dan Open-Meteo.
- `GET /api/admin/users`: Daftar pengguna sistem (khusus admin).

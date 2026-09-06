# 🔐 Sistem Otentikasi & Integrasi Kinde OAuth — RamalTani

RamalTani mendukung dua metode otentikasi yang saling terintegrasi ke dalam basis data PostgreSQL:
1. **Otentikasi Tradisional**: Email & Password (menggunakan Bcrypt dan JSON Web Token).
2. **Social Login Google (SSO)**: Menggunakan SDK resmi **Kinde** (`@kinde-oss/kinde-node-express`).

---

## 1. Alur Otentikasi Google via Kinde

```
[Pengguna] ── Klik "Masuk dengan Google" di Frontend
    │
    ▼
Redirect ke: http://localhost:5001/login (Kinde SDK)
    │
    ▼
Halaman Login Google Resmi (https://rizalzaky.kinde.com)
    │
    ▼ (Setelah pengguna setuju)
Kinde Redirect ke Callback: http://localhost:3000/callback
    │
    ▼ (Ditangkap oleh Port 3000 Bridge Listener)
Redirect ke Handler: http://localhost:5001/kinde-success
    │
    ▼ (Proses di Backend Express)
1. Ekstraksi profil user dari Kinde (id, email, given_name, family_name, picture)
2. Query ke PostgreSQL: SELECT * FROM users WHERE email = $1
   - Jika sudah ada: Perbarui data profil
   - Jika belum ada: INSERT akun baru (role: 'farmer', location: 'Ngawi', password_hash: NULL)
3. Generate JWT Token RamalTani dengan masa aktif 7 hari
    │
    ▼
Redirect ke Frontend:
http://localhost:5173/auth/kinde-callback?token={JWT}&user={JSON_USER}
    │
    ▼ (KindeCallbackPage.jsx)
Simpan token ke localStorage('ramaltani_token') & arahkan ke /dashboard
```

---

## 2. Konfigurasi Kinde di Backend

Diinisialisasi di `backend/src/app.js`:
```javascript
const { setupKinde } = require('@kinde-oss/kinde-node-express');

const kindeConfig = {
  clientId: process.env.KINDE_CLIENT_ID || 'a00410884d8e4a6db60f78c7784477d3',
  issuerBaseUrl: process.env.KINDE_ISSUER_BASE_URL || 'https://rizalzaky.kinde.com',
  siteUrl: process.env.KINDE_SITE_URL || 'http://localhost:5001/kinde-success',
  secret: process.env.KINDE_CLIENT_SECRET || 'WRidKLM6K6ngUX3YJEYwHukS0tcOyVCjw6R3cdkCtqfWnVYfWW',
  redirectUrl: process.env.KINDE_REDIRECT_URL || 'http://localhost:3000/callback',
};

setupKinde(kindeConfig, app);
```

---

## 3. Arsitektur Dual-Port Bridge

Kinde App Console didaftarkan dengan Redirect Callback URL: `http://localhost:3000/callback`. Sementara itu, backend RamalTani berjalan di port `5001` (menghindari bentrok macOS AirPlay Receiver di port 5000).

Untuk mengatasi hal ini tanpa mengubah konfigurasi di Kinde Cloud:
- Backend membuat instance HTTP server kedua di port `3000`:
```javascript
const bridgeApp = express();
bridgeApp.get('/callback', (req, res) => {
  const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  res.redirect(`http://localhost:5001/callback${query}`);
});
bridgeApp.listen(3000);
```
Dengan demikian, alur OAuth Kinde tetap valid 100% dan tidak pernah mengalami error `redirect_uri_mismatch`.

---

## 4. Kompatibilitas Node.js v26 (Automated Patch)

Pada Node.js versi 26, bundler CommonJS `@kinde-oss/kinde-node-express` memiliki bug di mana ia memanggil `createRequire({}.url)` yang menyebabkan `TypeError: ERR_INVALID_ARG_VALUE`.

RamalTani menyertakan solusi otomatis di `backend/scripts/patch-kinde.js`:
- Script ini mengganti `createRequire({}.url)` menjadi `createRequire(__filename)`.
- Didaftarkan pada script `"postinstall"` di `package.json`, sehingga setiap kali `npm install` dijalankan, patch langsung diterapkan secara otomatis.

---

## 5. Token JWT & Middleware Autentikasi

- **Signing**: Menggunakan `jsonwebtoken` dengan algoritma `HS256`.
- **Masa Berlaku**: 7 hari (`7d`).
- **Payload**: `{ userId, email, role, name }`.
- **Middleware Pengaman**:
  - `authenticate`: Memeriksa header `Authorization: Bearer <token>`. Menolak request jika token tidak valid.
  - `requireRole('extension_officer', 'admin')`: Membatasi hak akses berdasarkan peran pengguna.
  - `optionalAuth`: Mengurai token jika ada, namun tetap mengizinkan akses tamu jika token tidak dilampirkan.

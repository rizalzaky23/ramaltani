# Design System — Evasion Light (RamalTani v2)

> Dokumentasi resmi design system RamalTani versi 2.0, diadopsi dari template Evasion dengan identitas hijau pertanian.

---

## Filosofi Desain

Template Evasion menggunakan pendekatan **Clean Minimalist Premium** — konten adalah bintang utama, bukan dekorasi. Untuk RamalTani, pendekatan ini dikombinasikan dengan **identitas hijau pertanian** yang kuat: emerald green sebagai warna aksen fungsional yang mewakili alam, tanah, dan ketahanan pangan.

### Prinsip Utama
1. **Putih sebagai dasar** — background bersih `#ffffff`, surface `#fafafa`
2. **Hijau sebagai aksen** — emerald untuk CTA, active state, badge fungsional
3. **Typography bersih** — Inter, `tracking-tight`, tanpa font dekoratif berlebihan
4. **Minimal dekorasi** — tidak ada glassmorphism, glow, atau icon ornamental
5. **Spacing longgar** — section padding besar, breathing room untuk konten

---

## Color Palette

| Token | Nilai | Penggunaan |
|:------|:------|:-----------|
| `background` | `#ffffff` | Background utama semua halaman |
| `foreground` | `#09090b` | Teks utama, judul, heading |
| `muted` | `#71717a` | Teks sekunder, label, caption |
| `border-light` | `#e4e4e7` | Border card, divider, input |
| `secondary` | `#f4f4f5` | Surface card kedua, hover state |
| **Aksen Hijau** | | |
| Emerald 600 | `#059669` | CTA button utama |
| Emerald 700 | `#047857` | CTA hover, panel brand (Login/Register) |
| Emerald 50 | `#ecfdf5` | Background badge/status aktif |
| Emerald 100 | `#d1fae5` | Background highlight ringan |
| Emerald 200 | `#a7f3d0` | Border badge aktif |

---

## Typography

**Font**: `Inter` (Google Fonts — wght 300, 400, 500, 600)

| Elemen | Class Tailwind | Ukuran |
|:-------|:--------------|:-------|
| Hero heading | `text-[12vw] font-medium tracking-tight` | Fluid |
| Section heading | `text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight` | ~30–48px |
| Card heading | `text-lg font-semibold tracking-tight` | 18px |
| Body text | `text-sm text-[#71717a] leading-relaxed` | 14px |
| Label uppercase | `text-xs uppercase tracking-widest text-[#71717a] font-medium` | 12px |

---

## Components

### Buttons

```jsx
// CTA Utama — Hijau Emerald
<button className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm">
  Daftar Gratis
</button>

// Sekunder — Outline
<button className="px-5 py-2.5 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50">
  Lihat Detail
</button>

// Dark — Aksi Netral
<button className="px-5 py-2.5 rounded-full bg-[#09090b] hover:bg-[#3f3f46] text-white">
  Simpan
</button>
```

### Cards

```jsx
// Card standar
<div className="bg-white border border-[#e4e4e7] rounded-2xl p-6 hover:border-emerald-200 hover:shadow-sm transition-all">
  ...
</div>

// Card muted surface
<div className="bg-[#fafafa] border border-[#e4e4e7] rounded-2xl p-6">
  ...
</div>
```

### Form Inputs

```jsx
<label className="text-xs uppercase tracking-widest text-[#71717a] font-medium">
  Label
</label>
<input className="w-full px-4 py-2.5 rounded-xl border border-[#e4e4e7] bg-white text-[#09090b]
                  focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100" />
```

### Badges Status Pertanian

```jsx
// Layak Tanam
<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
  Layak Tanam
</span>

// Perlu Perhatian
<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
  Perlu Perhatian
</span>

// Tidak Disarankan
<span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
  Tidak Disarankan
</span>
```

---

## Layout System

### Sidebar Navigation
```
Lebar: w-60 (240px) — desktop fixed
Background: bg-white border-r border-[#e4e4e7]
Nav aktif: bg-emerald-50 text-emerald-700
Nav hover: hover:bg-[#f4f4f5] hover:text-[#09090b]
```

### Page Header
```
Background: bg-white border-b border-[#e4e4e7]
Shadow: none (flat, clean)
```

### Section Spacing (Evasion-style)
```
Mobile:  px-6 py-20
Tablet:  md:px-12 md:py-28
Desktop: lg:px-20 lg:py-36
```

---

## Halaman & Layoutnya

| Halaman | Layout | Warna Dominan |
|:--------|:-------|:-------------|
| Landing | Standalone | Hero hijau emerald, section putih |
| Login | Standalone split | Panel kiri hijau, form putih |
| Register | Standalone split | Panel kiri hijau, form putih |
| Dashboard Petani | FarmerLayout | Putih + sidebar putih + aksen emerald |
| Rekomendasi | FarmerLayout | Putih + badge emerald |
| Peta Risiko | FarmerLayout | Putih + Leaflet map |
| Riwayat Tanam | FarmerLayout | Putih + grafik emerald |
| Peringatan | FarmerLayout | Putih + badge amber/rose |
| Komunitas | FarmerLayout | Putih |
| Edukasi | FarmerLayout | Putih |
| Profil | FarmerLayout | Putih |
| Dashboard Penyuluh | ExtensionLayout | Putih + sidebar putih |
| Admin Dashboard | AdminLayout | Putih + sidebar putih |

---

## Aturan "Tidak Boleh"

- ❌ `glassmorphism` (backdrop-blur pada card/panel konten)
- ❌ Icon Lucide dekoratif (`<Sparkles>`, `<Leaf>` sebagai ornamen)
- ❌ Glow/shimmer efek di luar loading skeleton
- ❌ Font `font-mono` untuk heading atau teks panjang
- ❌ `uppercase tracking-wider` berlebihan pada konten panjang
- ❌ Warna latar gelap (`#0B0C0F`, `#13161C`) di luar komponen fungsional
- ❌ `shadow-2xl shadow-black/80` (terlalu dramatis)
- ❌ Pill badge dengan icon `<Sparkles>` sebagai label bagian

---

## Referensi

- Template: https://v0-evasion-website.vercel.app
- Font: https://fonts.google.com/specimen/Inter
- Data API: BMKG Open Data API + Open-Meteo Global

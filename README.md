# Tewiwi House — frontend React

Frontend untuk prototipe pemesanan Tewiwi House, dibangun dengan React, Vite, React Router, dan Material UI.

## Menjalankan proyek

Pastikan Node.js versi yang sesuai dengan Vite pada `package.json` sudah terpasang. Dari folder proyek:

```bash
npm install
npm run dev
```

Perintah pemeriksaan:

```bash
npm run lint
npm run build
```

## Struktur kode

```text
src/
├── assets/                 # Gambar dan aset statis
├── components/common/      # Komponen bersama, misalnya BrandHeader
├── config/                 # Konfigurasi tema dan informasi pembayaran demo
├── data/                   # Data produk dan daftar status pesanan
├── pages/
│   ├── customer/           # Form pemesanan dan halaman sukses
│   └── admin/              # Dashboard admin
├── services/               # Penyimpanan demo dan perhitungan slot pengiriman
├── utils/                  # Fungsi utilitas, misalnya format rupiah
├── App.jsx                 # Routing dan state aplikasi
├── App.css                 # Styling aplikasi yang saat ini masih global
└── main.jsx                # Entry point React
```

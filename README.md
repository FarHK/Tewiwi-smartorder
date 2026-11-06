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

## Rute frontend

- `/` — formulir pemesanan customer
- `/sukses/:code` — ringkasan pesanan
- `/admin/login` — login admin dengan email dan password
- `/admin/lupa-password` — meminta tautan reset password melalui email
- `/admin/reset-password` — mengatur password baru dari tautan email
- `/admin` — dashboard pesanan, kapasitas, dan produksi (memerlukan sesi admin)

## Batasan penting — prototipe, belum siap produksi

- Data pesanan masih disimpan pada `localStorage` browser melalui `services/demoOrderStorage.js`. Data tidak dibagikan antarperangkat atau antarbrowser dan dapat diubah oleh pemilik browser.
- Login admin dan reset password menggunakan Supabase Auth. Salin `.env.example` menjadi `.env.local`, lalu isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari proyek Supabase. Variabel `VITE_*` tersedia di browser; jangan pernah menaruh service-role key atau secret di frontend.
- Untuk demo UI lokal tanpa Supabase, jalankan `npm run dev`; mode demo aktif otomatis selama kredensial Supabase belum dikonfigurasi. Login demo: `demo@tewiwi.local` / `TewiwiDemo123!`. Anda dapat mematikannya dengan `VITE_ADMIN_DEMO_MODE=false` di `.env.local`. Mode demo hanya aktif pada server development, memakai session storage, dan tidak aman untuk melindungi dashboard atau data nyata. Jangan gunakan mode ini untuk produksi.
- Buat akun admin melalui Supabase Auth (pendaftaran publik tidak disediakan oleh aplikasi), aktifkan penyedia email, atur pengiriman email/SMTP untuk produksi, dan tambahkan URL `/admin/reset-password` ke daftar Redirect URLs Supabase.
- Route `/admin` mengharuskan sesi Supabase, tetapi pemeriksaan frontend bukan pengganti otorisasi backend. Batasi akses data dengan Row Level Security (RLS) dan kebijakan yang hanya mengizinkan admin. Data pesanan saat ini tetap berada di `localStorage` dan belum dilindungi server.
- Kapasitas pengiriman dihitung di frontend. Untuk aplikasi nyata, backend/database harus menjadi sumber kebenaran dan memvalidasi kuota saat pesanan dibuat agar tidak terjadi pemesanan melebihi kapasitas.
- Informasi nomor rekening dan WhatsApp admin saat ini masih kosong pada `src/config/appConfig.js`. Isi hanya dengan detail bisnis yang benar sebelum demo pembayaran.
- Belum ada database pesanan atau backend dalam paket frontend ini. Integrasikan penyimpanan pesanan terpusat, validasi server, dan RLS sebelum produksi.

## Catatan pengembangan

Halaman customer dan admin sekarang sudah dipisahkan ke file yang berbeda, sementara aplikasi tetap memakai satu proyek frontend React. Ini mempermudah pengembangan tanpa membuat dua aplikasi frontend yang harus dirawat terpisah.

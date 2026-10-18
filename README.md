# Awang OfficiaL Portfolio

Website portofolio React + Vite dengan dashboard admin, data proyek, dan sistem komentar.

## Struktur utama

- `src/supabase.js` — satu client Supabase bersama untuk seluruh komponen frontend.
- `database/comment-setup.sql` — konfigurasi tabel komentar dan penyimpanan foto komentar.
- `PORTOFOLIO_AUTO_UPDATE_TERMUX.sh` — sinkronisasi folder sumber Android ke folder kerja Termux dan menjalankan Vite.
- `public/` — aset gambar, animasi, ikon, dan file publik.

## Menjalankan proyek

Prasyarat: Node.js 18 atau lebih baru dan npm.

```bash
npm install --legacy-peer-deps
npm run dev
```

## Environment

Simpan nilai sebenarnya di `.env` pada folder utama proyek. Jangan masukkan file `.env` ke arsip ZIP atau repositori publik.

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
VITE_CONTACT_EMAIL=your-email@example.com
```

Formulir kontak menerima `VITE_CONTACT_EMAIL` sebagai nama utama. Untuk kompatibilitas, konfigurasi juga membaca `VITE_CONTACT_RECEIVER_EMAIL`, `VITE_PUBLIC_CONTACT_EMAIL`, `VITE_EMAIL_TO`, `VITE_EMAIL`, `CONTACT_EMAIL`, `CONTACT_RECEIVER_EMAIL`, `EMAIL_CONTACT`, `EMAIL_TO`, `PORTFOLIO_CONTACT_EMAIL`, `SUPABASE_CONTACT_EMAIL`, `SUPABASE_EMAIL`, `PUBLIC_CONTACT_EMAIL`, `PORTFOLIO_EMAIL`, atau `EMAIL` jika nama utama belum diisi. Hanya nilai email pilihan yang diteruskan ke bundle frontend; variabel lingkungan lain tidak diekspos oleh konfigurasi ini.

Jika `.env` berubah ketika memakai Termux, launcher otomatis akan mendeteksi perubahan dan memulai ulang Vite. Pastikan `.env` diperbarui pada folder sumber `/storage/emulated/0/PORTOFOLIO/`.

## Database dan keamanan

Proyek ini dapat memakai project Supabase yang sama dengan aplikasi lain. Jangan jalankan skrip SQL umum dari versi lama yang membuat atau mengubah tabel bernama `projects`, `profiles`, atau bucket umum jika sumber daya tersebut digunakan aplikasi lain.

Untuk menyiapkan sistem komentar portofolio, buka Supabase Dashboard → SQL Editor dan jalankan `database/comment-setup.sql` satu kali. Skrip ini hanya mengatur sumber daya komentar dan bucket yang diawali dengan nama khusus portofolio. Tabel proyek, autentikasi, dan kebijakan lain yang sudah ada tidak perlu dihapus atau dibuat ulang untuk menjalankan file ini.

Pastikan tabel `portfolio_admins` sudah berisi UUID admin portofolio dan memiliki kebijakan SELECT yang membolehkan pengguna terautentikasi membaca barisnya sendiri. Jangan pernah menaruh secret key atau service-role key di frontend.

## Fitur

- Home, About, Portfolio, Contact, dan halaman detail proyek.
- Dashboard admin untuk proyek dan komentar, serta modul yang sudah ada dalam source.
- Tautan media sosial personal Awang OfficiaL.
- Formulir kontak melalui FormSubmit.

## Build produksi

```bash
npm run build
```

Hasil build tersedia dalam folder `dist/`.

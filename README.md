# EduLoLos

EduLoLos menggunakan MySQL lokal sebagai database utama. Supabase sudah tidak dipakai untuk autentikasi maupun data belajar.

## Menjalankan secara lokal

Prasyarat: Node.js dan MySQL Server.

1. Install dependency: `npm install`
2. Buat database dan tabel dari file yang bisa kamu edit langsung di GitHub:
   `mysql -u root -p < database/schema.sql`
3. Salin `.env.example` menjadi `.env` lalu isi `MYSQL_PASSWORD` jika diperlukan.
4. Jalankan API di terminal pertama: `npm run api`
5. Jalankan frontend di terminal kedua: `npm run dev`
6. Buka `http://localhost:3000`.

API MySQL berjalan di `http://localhost:4000`. Password disimpan sebagai bcrypt hash dan session memakai cookie HTTP-only. Untuk mengubah struktur database, edit `database/schema.sql`, lalu import ulang pada database development.

Catatan: MySQL yang hanya berjalan di laptop tidak dapat diakses deployment Vercel. Untuk online, gunakan MySQL yang dapat diakses publik atau self-host backend/API ini.

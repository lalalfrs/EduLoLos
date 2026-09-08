# EduLoLos

EduLoLos menggunakan Neon PostgreSQL sebagai database utama. Supabase dan MySQL lokal tidak dipakai lagi untuk autentikasi maupun data belajar.

## Menjalankan secara lokal

Prasyarat: Node.js dan koneksi Neon aktif.

1. Install dependency: `npm install`
2. Schema Neon sudah dibuat dari `database/schema.sql`; file tersebut tetap menjadi referensi schema yang bisa diedit di GitHub.
3. Pastikan environment project menyediakan `DATABASE_URL` dari integrasi Neon.
4. Jalankan API di terminal pertama: `npm run api`
5. Jalankan frontend di terminal kedua: `npm run dev`
6. Buka `http://localhost:3000`.

API Neon berjalan di `http://localhost:4000` saat lokal. Pada production, frontend memakai route same-origin `/api/*` melalui Vercel Function di `api/[...path].ts`, jadi jangan isi `VITE_API_URL` dengan `http://localhost:4000` saat deployment. Pastikan environment production memiliki `NEON_POSTGRES_URL` atau `DATABASE_URL`. Password disimpan sebagai bcrypt hash dan session memakai cookie HTTP-only. Backend memakai PostgreSQL parameterized queries dan semua data pengguna dibatasi dengan `user_id`.

# Checklist Plan

Ringkasan singkat pekerjaan (untuk reviewer): status saat ini ditandai di sebelah setiap item.

- [x] Inisialisasi Next.js App Router + Tailwind — project scaffold dibuat dan dependency terpasang.
- [x] Buat project Supabase dan simpan URL + anon key — Supabase project sudah siap; keys disimpan lokal dan TIDAK akan dipush.
- [x] Definisikan PostgreSQL schema `tasks` + RLS policies — schema berhasil dijalankan di Supabase.
- [x] Implement Supabase Auth (email & password) — UI dan flow dasar selesai; submit lewat 'Enter' sudah aktif.
- [x] Implement Task CRUD (description, due date, priority, notes, completed) — selesai dan terhubung, data persisten setelah refresh.
- [x] Implement sorting (due date, description, priority) — Search, filter status, dan sorting due_date & priority selesai.
- [x] Implement due-today alert (toast/notification) — toast peringatan jatuh tempo selesai.
- [ ] Bangun UI adaptif terpisah untuk mobile/tablet/desktop — kerangka layout awal tersedia; perlu komponen per breakpoint.
- [ ] Tambah loading, empty, dan error states — state loading/error bawaan form sudah ada, masih perlu untuk UI final.
- [ ] Capture screenshots UI dan simpan di repo (bonus) — direncanakan hari terakhir.
- [ ] Update README (setup, env, run instructions) — tambahkan instruksi deploy & env untuk reviewer.
- [x] Buat commits harian dengan pesan yang jelas — sudah dilakukan
- [ ] Final QA & polish sebelum kirim link — target selesai pada May 21, 2026.


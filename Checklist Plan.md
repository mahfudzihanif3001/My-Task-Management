# Checklist Plan

Ringkasan singkat pekerjaan (untuk reviewer): status saat ini ditandai di sebelah setiap item.

- [x] Inisialisasi Next.js App Router + Tailwind — project scaffold dibuat dan dependency terpasang.
- [~] Buat project Supabase dan simpan URL + anon key — Supabase project sedang dibuat; keys disimpan lokal dan TIDAK akan dipush.
- [ ] Definisikan PostgreSQL schema `tasks` + RLS policies — belum dibuat di repo.
- [ ] Implement Supabase Auth (email & password) — belum dimulai.
- [ ] Implement Task CRUD (description, due date, priority, notes, completed) — belum dimulai.
- [ ] Implement sorting (due date, description, priority) — belum dimulai.
- [ ] Implement due-today alert (toast/notification) — belum dimulai.
- [ ] Bangun UI adaptif terpisah untuk mobile/tablet/desktop — kerangka layout awal tersedia; perlu komponen per breakpoint.
- [ ] Tambah loading, empty, dan error states — belum dimulai.
- [ ] Capture screenshots UI dan simpan di repo (bonus) — direncanakan hari terakhir.
- [ ] Update README (setup, env, run instructions) — tambahkan instruksi deploy & env untuk reviewer.
- [ ] Buat commits harian (day1/day2/day3) dengan pesan jelas — rencanakan commit sekarang (day1) lalu lanjut daily.
- [ ] Final QA & polish sebelum kirim link — target selesai pada May 21, 2026.

Catatan keamanan: jangan commit file yang berisi secrets (mis. `.env` atau Supabase keys). Saya sudah menambahkan `notes/` ke `.gitignore` untuk catatan lokal.

Jika reviewer ingin melihat progres harian terpisah, saya bisa push branch `day1` sekarang, atau langsung push ke `main` — beri tahu preferensi.

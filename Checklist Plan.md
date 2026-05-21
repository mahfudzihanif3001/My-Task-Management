# Checklist Plan

Ringkasan singkat pekerjaan (untuk reviewer): status saat ini ditandai di sebelah setiap item.

- [x] Inisialisasi Next.js App Router + Tailwind — project scaffold dibuat dan dependency terpasang.
- [x] Buat project Supabase dan simpan URL + anon key — Supabase project sudah siap; keys disimpan lokal dan TIDAK akan dipush.
- [x] Definisikan PostgreSQL schema `tasks` + RLS policies — schema berhasil dijalankan di Supabase.
- [x] Implement Supabase Auth (email & password) — UI dan flow dasar selesai; submit lewat 'Enter' sudah aktif.
- [x] Implement Task CRUD (description, due date, priority, notes, completed) — selesai dan terhubung, data persisten setelah refresh.
- [x] Implement sorting (due date, description, priority) — Search, filter status, dan sorting due_date & priority selesai.
- [x] Implement due-today alert (toast/notification) — toast peringatan jatuh tempo diganti ke react-hot-toast profesional.
- [x] Bangun UI adaptif terpisah untuk mobile/tablet/desktop — sidebar, header, form diset profesional ala korporat dengan #2D5E41 dan Lucide icons.
- [x] Overdue task protection — task yang sudah lewat deadline tidak bisa di-check/complete, hanya bisa delete; lock icon merah; warning icon orange untuk deadline hari ini.
- [x] Real-time date & time navbar — menampilkan tanggal dan jam real-time di navbar.
- [x] Custom notification close button — notif due today punya close button (×) yang user bisa klik untuk dismiss.
- [x] Tambah loading, empty, dan error states — spin state, empty folder icons sudah diatur rapi.
- [ ] Capture screenshots UI dan simpan di repo (bonus) — tangkapan layar sudah siap untuk didokumentasikan.
- [x] Update README (setup, env, run instructions) — README sangat lengkap dan mencakup arsitektur sistem, data flow, skema database, referensi API, dan panduan setup.
- [x] Buat commits harian dengan pesan yang jelas — sudah dilakukan
- [x] Final QA & polish sebelum kirim link — Selesai pada May 21, 2026. Audit kode selesai (Clean Code & mudah dimaintenance oleh Junior Dev), perbaikan rute DELETE selesai, sorting description ditambahkan, dan pembersihan file SVG bawaan Next.js yang tidak terpakai selesai dilakukan.


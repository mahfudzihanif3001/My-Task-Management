-- Supabase/Postgres schema for tasks
-- Jalankan file ini di Supabase SQL editor (jangan commit secrets).

-- Aktifkan pgcrypto agar bisa membuat UUID otomatis.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabel utama untuk menyimpan task pengguna.
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  description text NOT NULL, -- judul/isi task
  due_date date, -- tanggal jatuh tempo
  priority smallint NOT NULL DEFAULT 2, -- 1=tinggi, 2=sedang, 3=rendah
  notes text, -- catatan tambahan
  completed boolean NOT NULL DEFAULT false, -- status selesai atau belum
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index untuk mempercepat sorting berdasarkan due_date.
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks (due_date);

-- Aktifkan RLS agar user hanya bisa akses data miliknya sendiri.
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Baca task milik sendiri.
CREATE POLICY allow_select_own ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Tambah task dengan user_id sendiri.
CREATE POLICY allow_insert_own ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Edit task milik sendiri.
CREATE POLICY allow_update_own ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Hapus task milik sendiri.
CREATE POLICY allow_delete_own ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger untuk otomatis update kolom updated_at saat data berubah.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at ON public.tasks;
CREATE TRIGGER trg_set_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

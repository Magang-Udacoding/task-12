-- Skema Database Supabase untuk Aplikasi "Papan Bantuan Warga"
-- Tabel: help_requests

-- 1. Buat tabel help_requests
CREATE TABLE IF NOT EXISTS public.help_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Medis & Darurat',
    'Sembako',
    'Peminjaman Alat',
    'Tenaga Relawan'
  )),
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Menunggu' CHECK (status IN ('Menunggu', 'Selesai')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Buat Index untuk Performa Query Feed dan Filter
CREATE INDEX IF NOT EXISTS help_requests_created_at_idx ON public.help_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS help_requests_user_id_idx ON public.help_requests (user_id);
CREATE INDEX IF NOT EXISTS help_requests_category_idx ON public.help_requests (category);
CREATE INDEX IF NOT EXISTS help_requests_status_idx ON public.help_requests (status);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;

-- 4. Definisi Kebijakan Keamanan RLS (Row Level Security Policies)

-- Policy 1: Pembaca Publik (Semua orang baik anonim maupun terotentikasi dapat melihat seluruh postingan bantuan)
CREATE POLICY "Public can view help requests"
  ON public.help_requests
  FOR SELECT
  USING (true);

-- Policy 2: Pembuatan Permintaan Bantuan (Hanya pengguna login yang dapat membuat permohonan dengan user_id miliknya sendiri)
CREATE POLICY "Authenticated users can create help requests"
  ON public.help_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'Menunggu'
  );

-- Policy 3: Pemilik dapat Mengubah Permohonan Miliknya Sendiri
CREATE POLICY "Owners can update their own help requests"
  ON public.help_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Relawan dapat Mengubah Status dari 'Menunggu' Menjadi 'Selesai'
CREATE POLICY "Volunteers can mark pending requests as completed"
  ON public.help_requests
  FOR UPDATE
  TO authenticated
  USING (status = 'Menunggu')
  WITH CHECK (status = 'Selesai');

-- Policy 5: Hanya Pemilik yang dapat Menghapus Permohonan Bantuan Miliknya
CREATE POLICY "Owners can delete their own help requests"
  ON public.help_requests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

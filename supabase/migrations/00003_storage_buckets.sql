-- APE Connect Storage Buckets
-- Third migration

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('absence-justifications', 'absence-justifications', false, 5242880, ARRAY['image/jpeg', 'image/png', 'application/pdf']),
  ('ad-photos', 'ad-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Storage policies for absence-justifications bucket
CREATE POLICY "Users can upload absence justifications"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'absence-justifications' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own absence justifications"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'absence-justifications' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Staff can view absence justifications"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'absence-justifications' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('censeur', 'admin', 'super_admin')
    )
  );

-- Storage policies for ad-photos bucket
CREATE POLICY "Anyone can view ad photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ad-photos');

CREATE POLICY "Users can upload ad photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'ad-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own ad photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'ad-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

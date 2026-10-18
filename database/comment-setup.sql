-- AWANG OFFICIAL PORTFOLIO: COMMENT SYSTEM SETUP
-- Run this once in Supabase Dashboard > SQL Editor.
-- This script only creates/configures resources named for the portfolio.
-- It does not alter other websites' tables or storage buckets.

BEGIN;

CREATE TABLE IF NOT EXISTS public.portfolio_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL CHECK (char_length(btrim(content)) BETWEEN 1 AND 200),
  user_name text NOT NULL CHECK (char_length(btrim(user_name)) BETWEEN 1 AND 15),
  profile_image text,
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add missing portfolio columns if this table already existed in a partial setup.
ALTER TABLE public.portfolio_comments
  ADD COLUMN IF NOT EXISTS content text,
  ADD COLUMN IF NOT EXISTS user_name text,
  ADD COLUMN IF NOT EXISTS profile_image text,
  ADD COLUMN IF NOT EXISTS is_pinned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.portfolio_comments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON TABLE public.portfolio_comments TO anon, authenticated;
GRANT UPDATE, DELETE ON TABLE public.portfolio_comments TO authenticated;
GRANT SELECT ON TABLE public.portfolio_admins TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'portfolio_comments'
      AND policyname = 'portfolio_comments_public_read_v1'
  ) THEN
    CREATE POLICY portfolio_comments_public_read_v1
      ON public.portfolio_comments
      FOR SELECT TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'portfolio_comments'
      AND policyname = 'portfolio_comments_public_insert_v1'
  ) THEN
    CREATE POLICY portfolio_comments_public_insert_v1
      ON public.portfolio_comments
      FOR INSERT TO anon, authenticated
      WITH CHECK (
        is_pinned = false
        AND char_length(btrim(user_name)) BETWEEN 1 AND 15
        AND char_length(btrim(content)) BETWEEN 1 AND 200
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'portfolio_comments'
      AND policyname = 'portfolio_comments_admin_update_v1'
  ) THEN
    CREATE POLICY portfolio_comments_admin_update_v1
      ON public.portfolio_comments
      FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.portfolio_admins AS pa
          WHERE pa.user_id = (SELECT auth.uid()) AND pa.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.portfolio_admins AS pa
          WHERE pa.user_id = (SELECT auth.uid()) AND pa.role = 'admin'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'portfolio_comments'
      AND policyname = 'portfolio_comments_admin_delete_v1'
  ) THEN
    CREATE POLICY portfolio_comments_admin_delete_v1
      ON public.portfolio_comments
      FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.portfolio_admins AS pa
          WHERE pa.user_id = (SELECT auth.uid()) AND pa.role = 'admin'
        )
      );
  END IF;
END
$$;

-- Dedicated public bucket for portfolio comment avatars (up to 5 MB).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-profile-images',
  'portfolio-profile-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'portfolio_profile_images_public_read_v1'
  ) THEN
    CREATE POLICY portfolio_profile_images_public_read_v1
      ON storage.objects
      FOR SELECT TO public
      USING (bucket_id = 'portfolio-profile-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'portfolio_profile_images_public_upload_v1'
  ) THEN
    CREATE POLICY portfolio_profile_images_public_upload_v1
      ON storage.objects
      FOR INSERT TO anon, authenticated
      WITH CHECK (
        bucket_id = 'portfolio-profile-images'
        AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
      );
  END IF;
END
$$;

-- Enable Realtime for the portfolio comments table when it is not already enabled.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime'
         AND schemaname = 'public'
         AND tablename = 'portfolio_comments'
     ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_comments';
  END IF;
END
$$;

COMMIT;

-- After running, test comments on the portfolio site.
-- If a previous partial setup created an older, incomplete portfolio_comments table,
-- check its columns in Table Editor; the standard columns above are required by the app.

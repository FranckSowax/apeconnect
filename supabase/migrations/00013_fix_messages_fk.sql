-- APE Connect - Fix Foreign Key for messages_discussion
-- Migration 00013 - Add FK to public.users for auteur_id

-- The auteur_id column references auth.users but we need to also
-- reference public.users for PostgREST to auto-detect the relationship

-- First, ensure public.users has the same IDs as auth.users (already synced via trigger)
-- Then add the foreign key constraint to public.users

-- Add foreign key constraint for auteur_id to public.users
-- This allows PostgREST to auto-detect the relationship for joins
ALTER TABLE messages_discussion
DROP CONSTRAINT IF EXISTS messages_discussion_auteur_id_fkey;

-- Add new FK pointing to public.users (which mirrors auth.users)
ALTER TABLE messages_discussion
ADD CONSTRAINT messages_discussion_auteur_id_users_fkey
FOREIGN KEY (auteur_id) REFERENCES public.users(id) ON DELETE SET NULL;

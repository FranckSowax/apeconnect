-- Fix infinite recursion in RLS policies
-- Remove the problematic policies that reference users table from within users RLS

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view establishment users" ON public.users;
DROP POLICY IF EXISTS "Super admins can view all users" ON public.users;

-- The basic policies (Users can view own profile, etc.) remain and are sufficient
-- Admin access to all users should be handled via:
-- 1. Service role key in server-side operations
-- 2. Or security definer functions

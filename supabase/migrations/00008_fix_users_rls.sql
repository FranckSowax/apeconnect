-- Fix RLS policies for users table
-- Users should be able to read their own profile

-- First, ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Service role has full access to users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view establishment users" ON public.users;
DROP POLICY IF EXISTS "Super admins can view all users" ON public.users;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow new users to insert their own profile (for self-healing)
CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Note: Admin policies that reference users table removed to avoid infinite recursion
-- Admins can access all users through service role key via server-side operations

-- Fix RLS for establishments table
ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their establishment" ON public.establishments;
DROP POLICY IF EXISTS "Anyone can view establishments" ON public.establishments;

-- Allow all authenticated users to view establishments
CREATE POLICY "Authenticated users can view establishments"
ON public.establishments
FOR SELECT
TO authenticated
USING (true);

-- Also allow anon to view establishments (for registration)
CREATE POLICY "Anon can view establishments"
ON public.establishments
FOR SELECT
TO anon
USING (true);

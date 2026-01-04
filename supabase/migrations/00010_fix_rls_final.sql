-- Final fix for RLS policies to prevent infinite spinner
-- This migration ensures all policies are correctly set up

-- ==========================================
-- USERS TABLE
-- ==========================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Service role has full access to users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view establishment users" ON public.users;
DROP POLICY IF EXISTS "Super admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.users;

-- Simple policy: Users can view their own profile (no subqueries)
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for self-healing when trigger fails)
CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ==========================================
-- ESTABLISHMENTS TABLE
-- ==========================================

-- Enable RLS
ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their establishment" ON public.establishments;
DROP POLICY IF EXISTS "Anyone can view establishments" ON public.establishments;
DROP POLICY IF EXISTS "Authenticated users can view establishments" ON public.establishments;
DROP POLICY IF EXISTS "Anon can view establishments" ON public.establishments;

-- Allow all authenticated users to view all establishments
CREATE POLICY "Authenticated users can view establishments"
ON public.establishments
FOR SELECT
TO authenticated
USING (true);

-- Allow anon to view establishments (for registration form)
CREATE POLICY "Anon can view establishments"
ON public.establishments
FOR SELECT
TO anon
USING (true);

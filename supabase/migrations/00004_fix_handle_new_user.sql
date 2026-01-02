-- Fix for handle_new_user trigger
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved function that handles errors gracefully
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  est_id UUID;
  user_role_val user_role;
BEGIN
  -- Safely extract establishment_id (can be null)
  BEGIN
    est_id := (NEW.raw_user_meta_data->>'establishment_id')::UUID;
  EXCEPTION WHEN OTHERS THEN
    est_id := NULL;
  END;

  -- Safely extract role (default to 'parent')
  BEGIN
    user_role_val := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'parent');
  EXCEPTION WHEN OTHERS THEN
    user_role_val := 'parent';
  END;

  -- Insert user profile
  INSERT INTO public.users (id, email, full_name, phone, establishment_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    est_id,
    user_role_val
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    establishment_id = EXCLUDED.establishment_id,
    role = EXCLUDED.role,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't fail the auth signup
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.users TO supabase_auth_admin;

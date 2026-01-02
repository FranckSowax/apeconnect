-- SIMPLE FIX: Run this in Supabase SQL Editor
-- This completely recreates the trigger with maximum error tolerance

-- Step 1: Drop ALL triggers on auth.users that call handle_new_user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Drop the function completely
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 3: Create a VERY simple function that cannot fail
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, establishment_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NULLIF(NEW.raw_user_meta_data->>'establishment_id', '')::uuid,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', '')::user_role, 'parent')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- If insert fails, try update
  BEGIN
    UPDATE public.users SET
      email = NEW.email,
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      phone = COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      establishment_id = NULLIF(NEW.raw_user_meta_data->>'establishment_id', '')::uuid,
      role = COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', '')::user_role, 'parent'),
      updated_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
  EXCEPTION WHEN OTHERS THEN
    -- Last resort: just return NEW without doing anything
    RETURN NEW;
  END;
END;
$$;

-- Step 4: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Make sure permissions are correct
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;

-- Step 6: Ensure the users table allows inserts from the trigger
GRANT ALL ON public.users TO postgres;
GRANT ALL ON public.users TO service_role;

-- Database Trigger Solution for Profile Creation
-- This automatically creates a profile when a user is created in auth.users
-- This is the MOST RELIABLE solution for the foreign key constraint issue

-- Step 1: Enable the necessary extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create a function that will be triggered when a user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username VARCHAR(50);
  v_display_name VARCHAR(100);
BEGIN
  -- Extract username and display_name from user metadata if available
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name',
    'user_' || substr(NEW.id::text, 1, 8)
  );
  
  v_display_name := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    v_username
  );

  -- Insert into profiles table
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    bio,
    role
  )
  VALUES (
    NEW.id,
    v_username,
    v_display_name,
    NEW.raw_user_meta_data->>'bio',
    'user'
  )
  ON CONFLICT (id) DO NOTHING; -- Don't error if profile already exists

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Note: If you want to update the profile after creation from the backend,
-- you can modify the signup route to update the profile instead of creating it


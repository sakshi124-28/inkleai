-- ============================================
-- CREATE TEST ADMIN ACCOUNTS
-- ============================================
-- Run this in Supabase SQL Editor
-- Then use the credentials below to login

-- ============================================
-- OPTION 1: Create New Test Users
-- ============================================
-- Note: You'll need to sign up these users first through the frontend
-- Then run the UPDATE queries below to make them admin/owner

-- ============================================
-- OPTION 2: Make Existing Users Admin/Owner
-- ============================================

-- Make user 'testadmin' an admin (if exists)
UPDATE profiles 
SET role = 'admin' 
WHERE username = 'testadmin';

-- Make user 'testowner' an owner (if exists)
UPDATE profiles 
SET role = 'owner' 
WHERE username = 'testowner';

-- Make user 'admin' an owner (if exists)
UPDATE profiles 
SET role = 'owner' 
WHERE username = 'admin';

-- ============================================
-- OPTION 3: Create Test Users Directly
-- ============================================
-- This requires auth.users to exist first
-- Better to sign up through frontend, then update role

-- ============================================
-- Check Current Users
-- ============================================
SELECT 
  username,
  role,
  is_deleted,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- ============================================
-- Verify Admin/Owner Users
-- ============================================
SELECT 
  username,
  role,
  display_name
FROM profiles
WHERE role IN ('admin', 'owner')
  AND is_deleted = false;


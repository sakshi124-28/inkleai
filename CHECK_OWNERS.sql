-- Check all users with owner role
SELECT 
  id,
  username,
  display_name,
  email,
  role,
  is_deleted,
  created_at
FROM profiles
WHERE role = 'owner'
ORDER BY created_at DESC;

-- Check all users with admin role
SELECT 
  id,
  username,
  display_name,
  email,
  role,
  is_deleted,
  created_at
FROM profiles
WHERE role = 'admin'
ORDER BY created_at DESC;

-- Check all users (all roles)
SELECT 
  id,
  username,
  display_name,
  role,
  is_deleted,
  created_at
FROM profiles
ORDER BY role, created_at DESC;

-- Count users by role
SELECT 
  role,
  COUNT(*) as count
FROM profiles
WHERE is_deleted = false
GROUP BY role;


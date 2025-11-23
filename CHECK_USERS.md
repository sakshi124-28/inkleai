# Check Users and Roles

## Quick SQL Queries for Supabase

### 1. Check All Owner Users

Run this in **Supabase SQL Editor**:

```sql
SELECT 
  id,
  username,
  display_name,
  role,
  is_deleted,
  created_at
FROM profiles
WHERE role = 'owner'
ORDER BY created_at DESC;
```

---

### 2. Check All Admin Users

```sql
SELECT 
  id,
  username,
  display_name,
  role,
  is_deleted,
  created_at
FROM profiles
WHERE role = 'admin'
ORDER BY created_at DESC;
```

---

### 3. Check All Users (All Roles)

```sql
SELECT 
  id,
  username,
  display_name,
  role,
  is_deleted,
  created_at
FROM profiles
ORDER BY role, created_at DESC;
```

---

### 4. Count Users by Role

```sql
SELECT 
  role,
  COUNT(*) as count
FROM profiles
WHERE is_deleted = false
GROUP BY role;
```

---

### 5. Find Specific User

```sql
SELECT 
  id,
  username,
  display_name,
  role,
  is_deleted,
  created_at
FROM profiles
WHERE username = 'your_username';
```

---

## Using Supabase Dashboard

### Method 1: Table Editor
1. Go to **Supabase Dashboard**
2. Click **Table Editor** in left sidebar
3. Click on **profiles** table
4. Look at the **role** column
5. Filter by role if needed

### Method 2: SQL Editor (Recommended)
1. Go to **Supabase Dashboard**
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Paste one of the SQL queries above
5. Click **Run** (or press F5)

---

## Quick Actions

### Make a User Owner
```sql
UPDATE profiles 
SET role = 'owner' 
WHERE username = 'your_username';
```

### Make a User Admin
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE username = 'your_username';
```

### Reset to Regular User
```sql
UPDATE profiles 
SET role = 'user' 
WHERE username = 'your_username';
```

---

## Expected Results

### If No Owners Exist:
```
(0 rows)
```

**Solution:** Create one:
```sql
UPDATE profiles 
SET role = 'owner' 
WHERE username = 'your_username';
```

### If Owners Exist:
You'll see rows like:
```
id                | username | display_name | role  | is_deleted | created_at
------------------|----------|--------------|-------|------------|------------
uuid-here         | admin    | Admin User   | owner | false      | 2024-01-01
```

---

## Troubleshooting

### No Users Showing?
- Check if table exists: `SELECT * FROM profiles LIMIT 1;`
- Check if users are deleted: `SELECT * FROM profiles WHERE is_deleted = true;`

### Role is NULL?
```sql
-- Check for NULL roles
SELECT * FROM profiles WHERE role IS NULL;

-- Set default role
UPDATE profiles 
SET role = 'user' 
WHERE role IS NULL;
```

---

## Complete User List with Details

```sql
SELECT 
  id,
  username,
  display_name,
  role,
  is_deleted,
  deleted_at,
  created_at,
  CASE 
    WHEN role = 'owner' THEN '👑 Owner'
    WHEN role = 'admin' THEN '🛡️ Admin'
    ELSE '👤 User'
  END as role_display
FROM profiles
ORDER BY 
  CASE role
    WHEN 'owner' THEN 1
    WHEN 'admin' THEN 2
    ELSE 3
  END,
  created_at DESC;
```

This will show all users with a visual indicator of their role!


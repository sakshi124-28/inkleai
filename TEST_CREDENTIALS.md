# Test Admin Credentials

## 🚀 Quick Setup Guide

### Step 1: Create Test Accounts

**Sign up these accounts through the frontend:**

1. Go to `http://localhost:5173/signup`
2. Create accounts with these credentials:

---

## 📋 Test Account Credentials

### Test Owner Account
```
Email: owner@test.com
Password: owner123
Username: testowner
Display Name: Test Owner
```

### Test Admin Account
```
Email: admin@test.com
Password: admin123
Username: testadmin
Display Name: Test Admin
```

### Regular User Account (for testing)
```
Email: user@test.com
Password: user123
Username: testuser
Display Name: Test User
```

---

## 🔧 Step 2: Make Them Admin/Owner

After signing up, go to **Supabase SQL Editor** and run:

```sql
-- Make testowner an owner
UPDATE profiles 
SET role = 'owner' 
WHERE username = 'testowner';

-- Make testadmin an admin
UPDATE profiles 
SET role = 'admin' 
WHERE username = 'testadmin';

-- Verify
SELECT username, role FROM profiles 
WHERE username IN ('testowner', 'testadmin', 'testuser');
```

---

## ✅ Step 3: Login and Test

1. **Logout** if already logged in
2. **Login** with one of the test accounts:
   - Owner: `owner@test.com` / `owner123`
   - Admin: `admin@test.com` / `admin123`
3. You should see **"Admin"** link in navbar
4. Click it to access admin panel

---

## 🎯 Test Scenarios

### Test Owner Account
- ✅ Can access all admin pages
- ✅ Can create/remove admins
- ✅ Can delete any user/post/like
- ✅ Can see admin management page

### Test Admin Account
- ✅ Can access admin dashboard
- ✅ Can delete users (except owner/admin)
- ✅ Can delete any post/like
- ✅ Cannot create/remove admins

### Test User Account
- ✅ Regular user features
- ❌ Cannot access admin panel
- ✅ Can create posts, like, follow

---

## 🔄 Alternative: Quick SQL Setup

If you want to create users directly (requires auth setup):

```sql
-- First check existing users
SELECT id, username, role FROM profiles;

-- Then update their roles
UPDATE profiles SET role = 'owner' WHERE username = 'your_username';
UPDATE profiles SET role = 'admin' WHERE username = 'another_username';
```

---

## 📝 Complete Test User List

| Username | Email | Password | Role | Purpose |
|----------|-------|----------|------|---------|
| testowner | owner@test.com | owner123 | owner | Full admin access |
| testadmin | admin@test.com | admin123 | admin | Admin access |
| testuser | user@test.com | user123 | user | Regular user |

---

## 🛠️ Setup Script

**Copy and paste this entire script:**

```sql
-- Step 1: Check existing users
SELECT username, role, is_deleted 
FROM profiles 
ORDER BY created_at DESC;

-- Step 2: Update roles (replace usernames with your actual usernames)
UPDATE profiles SET role = 'owner' WHERE username = 'testowner';
UPDATE profiles SET role = 'admin' WHERE username = 'testadmin';

-- Step 3: Verify
SELECT username, role, is_deleted 
FROM profiles 
WHERE username IN ('testowner', 'testadmin', 'testuser')
ORDER BY role;
```

---

## ⚠️ Important Notes

1. **Sign up first** through frontend before updating roles
2. **Logout and login again** after changing roles
3. **Use the refresh button (🔄)** in navbar if admin link doesn't show
4. **Check browser console** (F12) for debug logs

---

## 🧪 Testing Checklist

After setup, test:

- [ ] Owner can login
- [ ] Owner sees "Admin" link
- [ ] Owner can access all admin pages
- [ ] Owner can create/remove admins
- [ ] Admin can login
- [ ] Admin sees "Admin" link
- [ ] Admin can delete users/posts/likes
- [ ] Admin cannot access admin management
- [ ] User cannot see "Admin" link

---

## 🔍 Verify Setup

Run this in Supabase SQL Editor:

```sql
SELECT 
  username,
  role,
  is_deleted,
  created_at
FROM profiles
WHERE username IN ('testowner', 'testadmin', 'testuser')
ORDER BY 
  CASE role
    WHEN 'owner' THEN 1
    WHEN 'admin' THEN 2
    ELSE 3
  END;
```

**Expected Result:**
- testowner → role: `owner`
- testadmin → role: `admin`
- testuser → role: `user`

---

## 🚨 Troubleshooting

### "User not found" when updating role?
- Make sure you signed up first through frontend
- Check username spelling (case-sensitive)
- Run: `SELECT username FROM profiles;` to see all usernames

### Admin link still not showing?
1. Logout completely
2. Clear browser localStorage: `localStorage.clear()` in console
3. Login again
4. Click refresh button (🔄) in navbar

---

**Ready to test!** Use the credentials above to login and test admin features.


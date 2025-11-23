# How to Login to Admin Panel

## Quick Steps

1. **Create/Login with an Admin or Owner Account**
2. **Click "Admin" link in the navbar** (only visible to admin/owner users)
3. **You'll be redirected to the Admin Dashboard**

---

## Method 1: Create Owner Account (Recommended for Testing)

### Step 1: Sign Up a Regular User
1. Go to `http://localhost:5173/signup`
2. Create a new account with:
   - Email: `owner@example.com`
   - Password: `password123`
   - Username: `owner`

### Step 2: Make User an Owner
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Run this SQL (replace `owner` with your username):
   ```sql
   UPDATE profiles 
   SET role = 'owner' 
   WHERE username = 'owner';
   ```
4. **Log out and log back in** from the frontend
5. You should now see the "Admin" link in the navbar!

---

## Method 2: Create Admin Account

### Step 1: Sign Up a Regular User
1. Go to `http://localhost:5173/signup`
2. Create a new account

### Step 2: Make User an Admin (Requires Owner Account)
If you already have an owner account:
1. Login as owner
2. Go to `/admin/admins` page
3. Click "Promote User to Admin"
4. Select the user you want to promote
5. Click "Promote to Admin"

**OR** use SQL (if you have database access):
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE username = 'your_username';
```

---

## Method 3: Direct SQL (Fastest for Development)

### Create Owner Account Directly in Database

1. **Sign up normally** through the frontend
2. **Go to Supabase Dashboard** → SQL Editor
3. **Run this SQL**:
   ```sql
   -- Make user an owner (replace 'your_username' with actual username)
   UPDATE profiles 
   SET role = 'owner' 
   WHERE username = 'your_username';
   ```
4. **Log out and log back in**
5. The "Admin" link will appear in navbar!

---

## Step-by-Step: First Time Setup

### 1. Start Your Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Create Your First Account
- Go to `http://localhost:5173/signup`
- Fill in:
  - Email: `admin@test.com`
  - Password: `admin123`
  - Username: `admin`
  - Display Name: `Admin User`

### 3. Make It Owner (Using Supabase)
- Open Supabase Dashboard
- Go to **SQL Editor**
- Run:
  ```sql
  UPDATE profiles 
  SET role = 'owner' 
  WHERE username = 'admin';
  ```

### 4. Logout and Login Again
- Click "Logout" in navbar
- Login again with same credentials
- You should now see **"Admin"** link in navbar!

### 5. Access Admin Panel
- Click **"Admin"** link
- You'll see the Admin Dashboard
- Navigate to different sections:
  - Dashboard
  - Users
  - Posts
  - Likes
  - Admins (owner only)

---

## Admin Panel Routes

Once logged in as admin/owner, you can access:

- **Dashboard**: `http://localhost:5173/admin/dashboard`
- **Users**: `http://localhost:5173/admin/users`
- **Posts**: `http://localhost:5173/admin/posts`
- **Likes**: `http://localhost:5173/admin/likes`
- **Admins** (owner only): `http://localhost:5173/admin/admins`

---

## Troubleshooting

### "Admin" link not showing?

**Check:**
1. ✅ Are you logged in?
2. ✅ Is your role set to `admin` or `owner`?
3. ✅ Did you logout and login again after changing role?

**Verify your role:**
1. Go to Supabase Dashboard → Table Editor → `profiles`
2. Find your user
3. Check the `role` column - should be `admin` or `owner`

**Fix:**
```sql
-- Check current role
SELECT id, username, role FROM profiles WHERE username = 'your_username';

-- Set to owner
UPDATE profiles SET role = 'owner' WHERE username = 'your_username';

-- Set to admin
UPDATE profiles SET role = 'admin' WHERE username = 'your_username';
```

### Can't access admin pages?

**Error: "Insufficient permissions" or redirect to feed**

**Solution:**
1. Make sure your role is `admin` or `owner` in database
2. Logout completely
3. Clear browser localStorage (F12 → Console → `localStorage.clear()`)
4. Login again

### Admin pages show "Loading..." forever?

**Check:**
1. Is backend server running? (`http://localhost:3000/api/v1/health`)
2. Check browser console (F12) for errors
3. Check backend terminal for errors
4. Verify your token is valid

---

## Quick Test Script

Run this in Supabase SQL Editor to create a test owner:

```sql
-- First, sign up through frontend, then run this:
-- Replace 'testuser' with your actual username

UPDATE profiles 
SET role = 'owner' 
WHERE username = 'testuser';

-- Verify it worked
SELECT id, username, role, is_deleted 
FROM profiles 
WHERE username = 'testuser';
```

---

## Roles Explained

### User (Default)
- Can create posts, like, follow, block
- Cannot access admin panel
- Can delete own posts

### Admin
- All user permissions
- Can access admin panel
- Can delete any user/post/like (except owner/admin)
- Cannot create/remove admins

### Owner
- All admin permissions
- Can access admin panel
- Can delete any user/post/like (except other owners)
- Can create/remove admins
- Can see admin management page

---

## Visual Guide

### Step 1: Sign Up
```
Frontend → /signup → Fill form → Submit
```

### Step 2: Make Owner (SQL)
```
Supabase → SQL Editor → Run SQL → Update role
```

### Step 3: Login
```
Frontend → /login → Enter credentials → Login
```

### Step 4: Access Admin
```
Navbar → Click "Admin" → Admin Dashboard
```

---

## Need Help?

1. **Check browser console** (F12) for errors
2. **Check backend terminal** for errors
3. **Verify database** - Check `profiles` table for your role
4. **Test API directly** - Use Postman to test `/api/v1/admin/stats`

---

## Quick Commands

```bash
# Check if user exists and role
# In Supabase SQL Editor:
SELECT username, role, is_deleted FROM profiles;

# Make user owner
UPDATE profiles SET role = 'owner' WHERE username = 'your_username';

# Make user admin
UPDATE profiles SET role = 'admin' WHERE username = 'your_username';

# Reset to user
UPDATE profiles SET role = 'user' WHERE username = 'your_username';
```

---

**That's it!** Once you have an admin/owner account, the "Admin" link will appear in the navbar, and you can access all admin panel features.


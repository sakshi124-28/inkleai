# ⚡ Quick Setup: Test Admins in 2 Minutes

## 🎯 Fastest Method

### 1. Sign Up Test Accounts (1 minute)

Go to `http://localhost:5173/signup` and create:

**Account 1 - Owner:**
- Email: `owner@test.com`
- Password: `owner123`
- Username: `testowner`

**Account 2 - Admin:**
- Email: `admin@test.com`
- Password: `admin123`
- Username: `testadmin`

---

### 2. Make Them Admin/Owner (30 seconds)

Go to **Supabase SQL Editor** and run:

```sql
UPDATE profiles SET role = 'owner' WHERE username = 'testowner';
UPDATE profiles SET role = 'admin' WHERE username = 'testadmin';
```

---

### 3. Login and Test (30 seconds)

1. Logout
2. Login with `owner@test.com` / `owner123`
3. See "Admin" link → Click it!

---

## ✅ Credentials Summary

| Account | Email | Password | Username | Role |
|---------|-------|----------|----------|------|
| **Owner** | owner@test.com | owner123 | testowner | owner |
| **Admin** | admin@test.com | admin123 | testadmin | admin |

---

## 🔍 Verify It Worked

Run in Supabase SQL:
```sql
SELECT username, role FROM profiles 
WHERE username IN ('testowner', 'testadmin');
```

Should show:
- testowner → owner
- testadmin → admin

---

**Done!** Now you can test admin features! 🎉


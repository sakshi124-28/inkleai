# ⚡ QUICK FIX: Admin Link Not Showing

## 🚀 FASTEST FIX (30 seconds)

### Step 1: Update Role in Database
Run this in **Supabase SQL Editor**:
```sql
UPDATE profiles 
SET role = 'owner' 
WHERE username = 'YOUR_USERNAME_HERE';
```

### Step 2: Click Refresh Button
1. Look for the **🔄** button in navbar (next to your username)
2. Click it to refresh your profile
3. Admin link should appear!

### Step 3: If Still Not Working
1. Click **Logout**
2. **Login again**
3. Admin link will appear!

---

## 🔍 Check Console (F12)

After clicking refresh, check browser console. You should see:
```
✅ Fetched profile: { role: "owner", ... }
✅ Profile role: owner
✅ Is Admin/Owner: true
🔍 Navbar Debug: { role: "owner", isAdmin: true, ... }
```

If you see `role: "user"` → Your role isn't set in database!

---

## 🎯 Direct Test

Open browser console (F12) and run:
```javascript
// Check current role
fetch('/api/v1/profiles/me', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
})
.then(r => r.json())
.then(d => {
  console.log('Current Role:', d.role)
  if (d.role !== 'admin' && d.role !== 'owner') {
    console.error('❌ Role is not admin/owner! Update in database!')
  } else {
    console.log('✅ Role is correct! Refresh page or click 🔄 button')
  }
})
```

---

## ✅ Verification

After fix, you should see:
- ✅ "Admin" link in navbar
- ✅ Console shows `role: "owner"` or `role: "admin"`
- ✅ Can click Admin link to go to dashboard

---

**That's it!** The refresh button (🔄) will force reload your profile from the server.


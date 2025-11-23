# Fix: Admin Link Not Visible in Navbar

## Quick Fix Steps

### Step 1: Check Your Role in Database

1. Go to **Supabase Dashboard** → **Table Editor** → `profiles`
2. Find your user row
3. Check the `role` column - it should be `admin` or `owner`
4. If it's `user` or `null`, update it:

```sql
-- Check current role
SELECT id, username, role, is_deleted 
FROM profiles 
WHERE username = 'your_username';

-- Set to owner
UPDATE profiles 
SET role = 'owner' 
WHERE username = 'your_username';

-- OR set to admin
UPDATE profiles 
SET role = 'admin' 
WHERE username = 'your_username';
```

### Step 2: Refresh Your Profile

**Option A: Logout and Login Again (Recommended)**
1. Click "Logout" in navbar
2. Login again with same credentials
3. Admin link should appear

**Option B: Clear Browser Storage**
1. Open browser console (F12)
2. Run: `localStorage.clear()`
3. Refresh page
4. Login again

**Option C: Hard Refresh**
1. Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. This clears cache and reloads

### Step 3: Check Browser Console

1. Open browser console (F12 → Console tab)
2. Look for debug logs:
   - `Navbar - Profile:` - Should show your profile
   - `Navbar - Role:` - Should show `admin` or `owner`
   - `Navbar - Is Admin/Owner:` - Should show `true`

If you see `role: "user"` or `role: null`, the profile isn't updated.

---

## Debugging Steps

### 1. Verify Role in Database

Run in Supabase SQL Editor:
```sql
SELECT username, role, is_deleted 
FROM profiles 
WHERE username = 'your_username';
```

**Expected:**
- `role` should be `admin` or `owner`
- `is_deleted` should be `false`

### 2. Check API Response

Test the profile endpoint directly:

**Using Browser:**
1. Open browser console (F12)
2. Run:
```javascript
fetch('/api/v1/profiles/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.log('Profile:', data))
```

**Using Postman/curl:**
```bash
curl -X GET http://localhost:3000/api/v1/profiles/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Check the response:**
- Does it have `role` field?
- Is `role` set to `admin` or `owner`?

### 3. Check Frontend Profile State

In browser console:
```javascript
// Check if profile is loaded
// This will only work if you have React DevTools
// Or check the console logs from Navbar component
```

---

## Common Issues & Solutions

### Issue 1: Role is `user` in Database

**Solution:**
```sql
UPDATE profiles 
SET role = 'owner' 
WHERE username = 'your_username';
```

Then logout and login again.

---

### Issue 2: Role is Correct in Database, But Not in Frontend

**Possible Causes:**
- Profile cached in frontend
- Token expired
- API not returning role

**Solutions:**

1. **Logout and Login:**
   - This fetches fresh profile

2. **Clear localStorage:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

3. **Check API Response:**
   - Make sure `/api/v1/profiles/me` returns role

4. **Hard Refresh:**
   - `Ctrl + Shift + R` or `Cmd + Shift + R`

---

### Issue 3: Profile is Null/Undefined

**Check:**
1. Are you logged in? (Check if token exists)
2. Is backend running?
3. Check browser console for errors

**Solution:**
- Make sure backend is running
- Check network tab for failed requests
- Try logging in again

---

### Issue 4: Role is `null` or Missing

**Check Database:**
```sql
-- Check if role column exists and has value
SELECT username, role 
FROM profiles 
WHERE username = 'your_username';
```

**If role is NULL:**
```sql
-- Set default role first
UPDATE profiles 
SET role = 'user' 
WHERE role IS NULL;

-- Then set to owner/admin
UPDATE profiles 
SET role = 'owner' 
WHERE username = 'your_username';
```

---

## Step-by-Step Fix

### Complete Reset (If Nothing Works)

1. **Update Role in Database:**
   ```sql
   UPDATE profiles 
   SET role = 'owner' 
   WHERE username = 'your_username';
   ```

2. **Clear Browser Storage:**
   - Open console (F12)
   - Run: `localStorage.clear()`
   - Close browser tab

3. **Restart Backend:**
   ```bash
   # Stop backend (Ctrl+C)
   cd backend
   npm run dev
   ```

4. **Login Again:**
   - Go to login page
   - Enter credentials
   - Login

5. **Check Console:**
   - Open console (F12)
   - Look for: `Navbar - Role: owner` or `admin`
   - Admin link should appear

---

## Verification Checklist

- [ ] Role is `admin` or `owner` in database
- [ ] `is_deleted` is `false` in database
- [ ] Backend is running
- [ ] Frontend is running
- [ ] Logged in successfully
- [ ] Browser console shows correct role
- [ ] No errors in console
- [ ] API `/api/v1/profiles/me` returns correct role

---

## Quick Test Script

Run this in browser console after logging in:

```javascript
// Check token
console.log('Token:', localStorage.getItem('token') ? 'Exists' : 'Missing')

// Fetch profile
fetch('/api/v1/profiles/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => {
  console.log('Profile from API:', data)
  console.log('Role:', data.role)
  console.log('Is Admin/Owner:', data.role === 'admin' || data.role === 'owner')
})
.catch(err => console.error('Error:', err))
```

**Expected Output:**
```
Profile from API: { id: "...", username: "...", role: "owner", ... }
Role: owner
Is Admin/Owner: true
```

If role is not `admin` or `owner`, update it in database and try again.

---

## Still Not Working?

1. **Check Backend Logs:**
   - Look at backend terminal
   - Check for errors when fetching profile

2. **Check Network Tab:**
   - Open browser DevTools → Network tab
   - Look for `/api/v1/profiles/me` request
   - Check response - does it have `role`?

3. **Verify Database:**
   - Double-check role in Supabase
   - Make sure you're updating the correct user

4. **Try Different Browser:**
   - Sometimes cache issues
   - Try incognito/private mode

---

## Expected Behavior

Once fixed, you should see:
- ✅ "Admin" link in navbar (between "Feed" and your username)
- ✅ Can click "Admin" to go to dashboard
- ✅ Console shows: `Navbar - Role: owner` or `admin`
- ✅ Console shows: `Navbar - Is Admin/Owner: true`

If you see all of these, the admin link should be visible!


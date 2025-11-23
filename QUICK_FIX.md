# Quick Fix for White Screen

## Immediate Steps to Diagnose

### 1. Open Browser Console
- Press **F12** (or Right-click → Inspect)
- Click the **Console** tab
- **What errors do you see?** (Take a screenshot)

### 2. Check if Backend is Running
Open a new terminal and run:
```bash
curl http://localhost:3000/api/v1/health
```

Or open in browser: `http://localhost:3000/api/v1/health`

**Expected**: Should show `{"status":"ok","message":"Server is running"}`

**If it fails**: Backend is not running. Start it:
```bash
cd backend
npm run dev
```

### 3. Check Frontend Terminal
Look at the terminal where you ran `npm run dev` in the frontend folder.

**What do you see?**
- ✅ `Local: http://localhost:5173` = Good
- ❌ Any red errors? = Problem

### 4. Try Direct Access
Instead of going to `/`, try these URLs directly:
- `http://localhost:5173/login` - Should show login page
- `http://localhost:5173/signup` - Should show signup page

### 5. Clear Browser Cache
- Press **Ctrl + Shift + Delete**
- Select "Cached images and files"
- Click "Clear data"
- Refresh page with **Ctrl + Shift + R**

## Most Common Issues

### Issue 1: Backend Not Running
**Symptom**: White screen, console shows "Failed to fetch"

**Fix**:
```bash
cd backend
npm run dev
```
Wait for: `Server running on port 3000`

### Issue 2: Missing Dependencies
**Symptom**: Console shows "Module not found"

**Fix**:
```bash
cd frontend
npm install
npm run dev
```

### Issue 3: Port Already in Use
**Symptom**: Error about port 3000 or 5173

**Fix**: 
- Close other programs using those ports
- Or change port in `.env` file

### Issue 4: Environment Variables Missing
**Symptom**: Backend errors about Supabase

**Fix**: 
- Check `backend/.env` file exists
- Make sure all three variables are set:
  ```
  SUPABASE_URL=...
  SUPABASE_ANON_KEY=...
  SUPABASE_SERVICE_ROLE_KEY=...
  ```

## Still Not Working?

1. **Check the browser console** - What's the exact error message?
2. **Check backend terminal** - Any errors there?
3. **Check frontend terminal** - Any errors there?
4. **Try a different browser** - Chrome, Firefox, or Edge

## Expected Result

When working correctly:
- ✅ You see the login page (if not logged in)
- ✅ You see the feed page (if logged in)
- ✅ No errors in browser console
- ✅ Backend shows "Server running on port 3000"
- ✅ Frontend shows "Local: http://localhost:5173"

If you're still seeing a white screen after trying these steps, please share:
1. Browser console errors (screenshot)
2. Backend terminal output
3. Frontend terminal output


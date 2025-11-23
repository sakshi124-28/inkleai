# Troubleshooting White Screen Issue

If you're seeing a white/blank screen, follow these steps:

## Step 1: Check Browser Console

1. Open your browser's Developer Tools (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Look for any red error messages
4. Take a screenshot or copy the error message

## Step 2: Common Issues and Fixes

### Issue: "Failed to fetch" or Network Errors

**Problem**: Backend server is not running or not accessible

**Solution**:
1. Make sure backend is running:
   ```bash
   cd backend
   npm run dev
   ```
2. Check that you see: `Server running on port 3000`
3. Test backend directly: Open `http://localhost:3000/api/v1/health` in browser
4. Should show: `{"status":"ok","message":"Server is running"}`

### Issue: "Cannot read property of undefined"

**Problem**: Missing environment variables or configuration

**Solution**:
1. Check `backend/.env` file exists
2. Verify all three variables are set:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Make sure no extra spaces or quotes around values

### Issue: React/JavaScript Errors

**Problem**: Code error preventing React from rendering

**Solution**:
1. Check the browser console for specific error
2. Look at the error stack trace
3. Common fixes:
   - Clear browser cache (Ctrl+Shift+Delete)
   - Hard refresh (Ctrl+Shift+R or Ctrl+F5)
   - Restart both frontend and backend servers

### Issue: "Module not found" or Import Errors

**Problem**: Dependencies not installed

**Solution**:
```bash
cd frontend
rm -rf node_modules
npm install
```

Then restart:
```bash
npm run dev
```

### Issue: CORS Errors

**Problem**: Backend not allowing frontend requests

**Solution**:
1. Check `backend/src/index.js` has `app.use(cors())`
2. Make sure backend is running on port 3000
3. Check `frontend/vite.config.js` has proxy configured

### Issue: Authentication Loop

**Problem**: Redirecting between pages infinitely

**Solution**:
1. Clear localStorage:
   - Open browser console (F12)
   - Type: `localStorage.clear()`
   - Refresh page
2. Try accessing `/login` directly: `http://localhost:5173/login`

## Step 3: Verify Setup

Run through this checklist:

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Frontend server is running (`npm run dev` in frontend folder)
- [ ] Backend shows "Server running on port 3000"
- [ ] Frontend shows "Local: http://localhost:5173"
- [ ] Can access `http://localhost:3000/api/v1/health` and see JSON response
- [ ] Browser console has no red errors
- [ ] Network tab shows requests (not all failed)

## Step 4: Debug Steps

1. **Check if React is loading**:
   - Right-click page → View Page Source
   - Look for `<div id="root"></div>`
   - If you see it, React should be mounting there

2. **Check Network Requests**:
   - Open DevTools → Network tab
   - Refresh page
   - Look for failed requests (red)
   - Check if `/api/v1/health` or other API calls are failing

3. **Check React DevTools**:
   - Install React DevTools browser extension
   - Open it and see if components are rendering
   - Check component tree

4. **Add Console Logs**:
   - Open `frontend/src/main.jsx`
   - Add at the top: `console.log('Main.jsx loaded')`
   - Add in App.jsx: `console.log('App.jsx rendering')`
   - Check console to see where it stops

## Step 5: Quick Fixes to Try

1. **Clear Everything and Restart**:
   ```bash
   # Stop both servers (Ctrl+C)
   
   # Backend
   cd backend
   rm -rf node_modules
   npm install
   npm run dev
   
   # Frontend (new terminal)
   cd frontend
   rm -rf node_modules
   npm install
   npm run dev
   ```

2. **Try Different Browser**:
   - Test in Chrome, Firefox, or Edge
   - Some browsers cache differently

3. **Check Port Conflicts**:
   - Make sure nothing else is using port 3000 or 5173
   - Change ports if needed

4. **Verify File Structure**:
   - Make sure all files exist
   - Check that `frontend/src/main.jsx` exists
   - Check that `frontend/index.html` exists

## Step 6: Get Help

If nothing works, provide:

1. **Browser Console Errors** (screenshot or copy text)
2. **Backend Terminal Output** (what you see when running `npm run dev`)
3. **Frontend Terminal Output** (what you see when running `npm run dev`)
4. **Network Tab** (screenshot of failed requests)
5. **What you've tried** (list of steps you've completed)

## Expected Behavior

When everything works correctly:

1. You open `http://localhost:5173`
2. If not logged in → Redirects to `/login` (you see login form)
3. If logged in → Shows `/feed` page with activity feed
4. No errors in console
5. Network requests succeed (status 200)

If you're not seeing this, follow the steps above!


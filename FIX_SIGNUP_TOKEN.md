# Fix: "No token received" During Signup

This issue occurs because Supabase requires email confirmation by default. Here are two solutions:

## Solution 1: Disable Email Confirmation (Recommended for Development)

This is the easiest fix for development:

1. **Go to Supabase Dashboard**
   - Open your project
   - Go to **Authentication** → **Settings** (or **Auth** → **Configuration**)

2. **Disable Email Confirmation**
   - Find **"Enable email confirmations"** or **"Confirm email"**
   - **Turn it OFF** (uncheck the box)
   - Click **Save**

3. **Test Signup Again**
   - Try signing up again
   - You should now receive a token immediately

## Solution 2: Use the Updated Code (Already Applied)

The code has been updated to automatically sign in users after signup. However, you still need to:

1. **Make sure you have `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file**
   - This allows the backend to bypass email confirmation
   - Get it from: Supabase Dashboard → Settings → API → `service_role` key

2. **The backend will now:**
   - Try to create a session using the admin client
   - If that fails, try to sign in automatically
   - If still no session, return a helpful error message

## Solution 3: Confirm Email Manually

If email confirmation is enabled:

1. **Check your email** (including spam folder)
2. **Click the confirmation link**
3. **Then try logging in** with your credentials

## Verify Your Setup

1. **Check `.env` file** in `backend/` folder:
   ```
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...  ← Make sure this is set!
   ```

2. **Restart your backend server:**
   ```bash
   cd backend
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Try signing up again**

## Expected Behavior After Fix

✅ **With email confirmation disabled:**
- Signup → Immediately logged in → Redirected to feed

✅ **With email confirmation enabled (and service role key set):**
- Signup → Auto-logged in → Redirected to feed

❌ **If service role key is missing:**
- Signup → Error: "Please check your email to confirm your account"

## Still Having Issues?

1. **Check backend terminal** - Look for any error messages
2. **Check browser console** (F12) - Look for error messages
3. **Verify service role key** - Make sure it's correct in `.env`
4. **Try Solution 1** - Disable email confirmation (easiest)

The code has been updated to handle this automatically, but disabling email confirmation is the simplest solution for development!


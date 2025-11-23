# Fix: "duplicate key value violates unique constraint profiles_pkey"

This error occurs when trying to sign up with an email/account that already has a profile in the database.

## What Causes This?

1. **User already signed up** - The most common case
2. **Previous signup attempt** - Profile was created but signup appeared to fail
3. **Race condition** - Multiple signup requests at the same time

## Solution Applied

The signup endpoint now:

1. ✅ **Checks if username is taken** before creating account
2. ✅ **Checks if profile already exists** before inserting
3. ✅ **Handles duplicate key errors** gracefully
4. ✅ **Provides clear error messages** to guide users

## What to Do

### If You See "User already exists"

**This means the account was already created successfully.**

**Solution**: Just log in instead of signing up:
- Go to the login page
- Use the same email and password you tried to sign up with
- You should be able to log in successfully

### If You See "Username is already taken"

**This means someone else (or you) already has that username.**

**Solution**: Choose a different username:
- Try adding numbers or variations
- Example: `john` → `john123` or `john_doe`

### If Error Persists

1. **Check if you can log in:**
   - Try logging in with the email/password you used
   - If login works, the account exists and signup isn't needed

2. **Check Supabase Database:**
   - Go to Supabase Dashboard → Table Editor → `profiles`
   - Look for your email or username
   - If found, the account exists

3. **Clean up if needed:**
   - If you want to start fresh, you can delete the profile from Supabase
   - Or use a different email/username

## Code Changes

The signup flow now:
- Checks username availability first
- Checks if profile exists before inserting
- Handles race conditions
- Returns helpful error messages

## Testing

After the fix:
1. ✅ First signup with new email → Should work
2. ✅ Try signing up again with same email → Should say "User already exists"
3. ✅ Try signing up with taken username → Should say "Username is already taken"
4. ✅ Login with existing account → Should work

The duplicate key error should no longer appear - instead you'll get clear messages about what to do!


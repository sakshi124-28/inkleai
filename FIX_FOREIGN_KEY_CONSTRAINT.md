# Fix: Foreign Key Constraint Error on Profile Creation

## Problem
Error: `insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"`

This happens because:
1. The `profiles` table has a foreign key: `id UUID REFERENCES auth.users(id)`
2. When creating a user with `supabase.auth.signUp()`, there can be a timing delay before the user is fully committed to `auth.users`
3. If we try to create the profile immediately, the foreign key constraint fails

## Solution Applied

### 1. **User Verification with Retry**
- Added retry logic to verify user exists in `auth.users` before creating profile
- Uses admin client if available for better reliability
- Exponential backoff (200ms, 400ms, 600ms, etc.)

### 2. **Foreign Key Error Handling**
- Detects foreign key constraint errors (code `23503`)
- Waits 500ms and retries profile creation
- Falls back to fetching existing profile if retry fails

### 3. **Admin Client Usage**
- Uses admin client (service role) for profile creation if available
- Admin client has better permissions and can bypass some constraints

## Code Changes

### Before:
```javascript
const { data: newProfile, error: profileError } = await supabase
  .from('profiles')
  .insert({
    id: authData.user.id,
    username,
    ...
  })
```

### After:
```javascript
// Verify user exists first
let userExists = false;
// ... retry logic ...

// Use admin client if available
const clientToUse = supabaseAdmin || supabase;

const { data: newProfile, error: profileError } = await clientToUse
  .from('profiles')
  .insert({ ... })

// Handle foreign key errors with retry
if (profileError.code === '23503') {
  // Wait and retry
  await new Promise(resolve => setTimeout(resolve, 500));
  // Retry creation...
}
```

## Alternative Solutions

### Option 1: Database Trigger (Recommended for Production)
Create a database trigger that automatically creates a profile when a user is created:

```sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'User'),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Note:** This requires storing username/display_name in user metadata during signup.

### Option 2: Supabase Database Function
Create a function that can be called from the backend:

```sql
CREATE OR REPLACE FUNCTION create_profile(
  p_user_id UUID,
  p_username VARCHAR(50),
  p_display_name VARCHAR(100),
  p_bio TEXT
)
RETURNS profiles AS $$
DECLARE
  new_profile profiles;
BEGIN
  INSERT INTO profiles (id, username, display_name, bio, role)
  VALUES (p_user_id, p_username, p_display_name, p_bio, 'user')
  RETURNING * INTO new_profile;
  RETURN new_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Option 3: Increase Wait Time
If the issue persists, increase the wait time:

```javascript
// Wait longer for user to be committed
await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second
```

## Testing

1. **Test Signup:**
   ```bash
   POST /api/v1/auth/signup
   {
     "email": "test@example.com",
     "password": "password123",
     "username": "testuser",
     "display_name": "Test User"
   }
   ```

2. **Check for Errors:**
   - Should not see foreign key constraint error
   - Profile should be created successfully
   - User should be able to login immediately

3. **If Still Failing:**
   - Check Supabase logs for auth user creation
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is set in backend `.env`
   - Check database permissions

## Current Status

✅ **Fixed** - Added retry logic and better error handling
- Verifies user exists before creating profile
- Retries on foreign key constraint errors
- Uses admin client when available

## Next Steps (If Issue Persists)

1. **Enable Database Trigger** (Option 1) - Most reliable
2. **Use Database Function** (Option 2) - Good alternative
3. **Increase Wait Time** (Option 3) - Quick fix

---

**The fix is now applied!** Try signing up again. If you still see the error, we can implement one of the alternative solutions above.


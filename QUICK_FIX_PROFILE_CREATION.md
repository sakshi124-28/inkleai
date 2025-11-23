# Quick Fix: Profile Creation Error

## Current Error
"Profile creation failed: User may not be fully created yet. Please try again in a moment."

## ✅ IMMEDIATE SOLUTION: Use Database Trigger

This is the **most reliable** solution. It automatically creates profiles when users are created.

### Step 1: Run SQL in Supabase

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste this SQL:

```sql
-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username VARCHAR(50);
  v_display_name VARCHAR(100);
BEGIN
  -- Extract username from metadata or generate one
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    'user_' || substr(NEW.id::text, 1, 8)
  );
  
  v_display_name := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    v_username
  );

  -- Insert into profiles (will be updated by backend with actual username)
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    bio,
    role
  )
  VALUES (
    NEW.id,
    v_username,
    v_display_name,
    NEW.raw_user_meta_data->>'bio',
    'user'
  )
  ON CONFLICT (id) DO NOTHING; -- Don't error if profile already exists

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

3. Click **Run**

### Step 2: Update Backend Code

The trigger will create a basic profile. Your backend should **UPDATE** it instead of creating:

```javascript
// After user creation, update the profile (trigger already created it)
const { data: updatedProfile, error: updateError } = await supabase
  .from('profiles')
  .update({
    username,
    display_name: display_name || username,
    bio: bio || null
  })
  .eq('id', userId)
  .select()
  .single();

if (updateError) {
  // If update fails, profile might not exist (trigger didn't fire)
  // Fall back to creating it
  const { data: newProfile, error: createError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      username,
      display_name: display_name || username,
      bio: bio || null,
      role: 'user'
    })
    .select()
    .single();
  
  if (createError) {
    return res.status(400).json({ error: 'Failed to create profile' });
  }
  profile = newProfile;
} else {
  profile = updatedProfile;
}
```

---

## Alternative: Increase Wait Times

If you can't use the trigger, increase wait times in the code:

1. **Initial delay:** Change from 500ms to 2000ms (2 seconds)
2. **Retry delays:** Change from 1s, 2s, 3s to 2s, 4s, 6s, 8s, 10s

---

## Why Database Trigger is Best

✅ **No timing issues** - Profile created atomically with user  
✅ **100% reliable** - Works every time  
✅ **No retry logic needed** - Simpler code  
✅ **Production-ready** - Standard practice  

---

## Test After Fix

1. Try signing up a new user
2. Should work immediately
3. No foreign key errors
4. Profile created automatically

---

**RECOMMENDED: Use the database trigger solution!** 🚀


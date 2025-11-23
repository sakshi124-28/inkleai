import express from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';
import { createActivity } from '../services/activityService.js';

const router = express.Router();

// POST /api/v1/auth/signup
router.post('/signup', async (req, res) => {
  try {
    // Comprehensive debugging
    console.log('=== SIGNUP REQUEST DEBUG ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Content-Type (raw):', req.headers['content-type']);
    console.log('Raw body:', req.body);
    console.log('Raw body string:', JSON.stringify(req.body));
    console.log('Body type:', typeof req.body);
    console.log('Body keys:', req.body ? Object.keys(req.body) : 'no body');
    console.log('Body length:', req.body ? Object.keys(req.body).length : 0);
    if (req.rawBody) {
      console.log('Raw body received:', req.rawBody);
      console.log('Raw body length:', req.rawBody.length);
    }
    if (req.rawBodyBuffer) {
      console.log('Body buffer:', req.rawBodyBuffer.toString());
    }
    console.log('===========================');

    const { email, password, username, display_name, bio } = req.body;

    // Check if body is empty or not parsed
    if (!req.body || Object.keys(req.body).length === 0) {
      // Additional debugging
      const contentType = req.get('Content-Type');
      const contentTypeRaw = req.headers['content-type'];
      const isJsonContentType = contentType && (
        contentType.includes('application/json') || 
        contentTypeRaw?.includes('application/json')
      );
      
      // Try to parse raw body if available
      let parsedRawBody = null;
      if (req.rawBody && req.rawBody.length > 0) {
        try {
          parsedRawBody = JSON.parse(req.rawBody);
          console.log('Successfully parsed raw body:', parsedRawBody);
        } catch (e) {
          console.log('Failed to parse raw body:', e.message);
        }
      }
      
      return res.status(400).json({ 
        error: 'Request body is empty or not in JSON format',
        hint: 'Make sure to: 1) Set Content-Type: application/json header, 2) Use raw JSON body in Postman, 3) Body should be in JSON format, 4) Check that Body tab is set to "raw" and "JSON"',
        troubleshooting: {
          contentType: contentType || 'missing',
          contentTypeRaw: contentTypeRaw || 'missing',
          isJsonContentType: isJsonContentType,
          bodyExists: !!req.body,
          bodyKeys: req.body ? Object.keys(req.body) : [],
          bodyType: typeof req.body,
          method: req.method,
          url: req.url,
          rawBodyLength: req.rawBody ? req.rawBody.length : 0,
          rawBodyPreview: req.rawBody ? req.rawBody.substring(0, 100) : 'no raw body',
          parsedRawBody: parsedRawBody
        },
        stepByStep: [
          '1. In Postman, click the "Body" tab',
          '2. Select "raw" (not form-data or x-www-form-urlencoded)',
          '3. In the dropdown next to "raw", select "JSON" (not Text)',
          '4. Paste your JSON: {"email":"test@gmail.com","password":"pass123","username":"testuser"}',
          '5. In Headers tab, add: Content-Type: application/json (make sure no backticks or quotes)',
          '6. Make sure method is POST (not GET)',
          '7. Check backend console logs for "Raw body received" to see what was actually sent'
        ]
      });
    }

    if (!email || !password || !username) {
      return res.status(400).json({ 
        error: 'Email, password, and username are required',
        received: {
          email: email || 'missing',
          password: password ? '***' : 'missing',
          username: username || 'missing',
          allFields: Object.keys(req.body)
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format',
        hint: 'Email must be in format: user@domain.com'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long'
      });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        error: 'Invalid username format',
        hint: 'Username must be 3-20 characters, letters, numbers, and underscores only'
      });
    }

    // Check if username is already taken
    const { data: usernameCheck, error: usernameError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .eq('is_deleted', false)
      .single();

    if (usernameCheck) {
      return res.status(400).json({ error: 'Username is already taken. Please choose another.' });
    }

    // Sign up user with Supabase Auth
    // Normalize email (lowercase and trim)
    const normalizedEmail = email.toLowerCase().trim();
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });

    if (authError) {
      // Provide more helpful error messages
      let errorMessage = authError.message;
      
      if (authError.message.includes('invalid') && authError.message.includes('email')) {
        errorMessage = 'Invalid email address. Please use a valid email format (e.g., user@domain.com). Note: Some test domains like "example.com" may be rejected by Supabase. Try using a real email domain like gmail.com, yahoo.com, etc.';
      } else if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        errorMessage = 'This email is already registered. Please try logging in instead.';
      } else if (authError.message.includes('password')) {
        errorMessage = 'Password does not meet requirements. Password must be at least 6 characters.';
      }
      
      return res.status(400).json({ 
        error: errorMessage,
        originalError: process.env.NODE_ENV === 'development' ? authError.message : undefined
      });
    }

    if (!authData.user) {
      return res.status(400).json({ error: 'Failed to create user' });
    }

    const userId = authData.user.id;

    // Wait a bit to ensure user is committed to auth.users
    // Supabase sometimes needs a moment to fully commit the user
    await new Promise(resolve => setTimeout(resolve, 500));

    // If we have admin client, use it to ensure user is fully created
    if (supabaseAdmin) {
      try {
        // Verify user exists and is accessible
        const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (adminError || !adminUser?.user) {
          // Wait a bit more and try again
          await new Promise(resolve => setTimeout(resolve, 500));
          const { data: retryUser, error: retryError } = await supabaseAdmin.auth.admin.getUserById(userId);
          if (retryError || !retryUser?.user) {
            console.error('User not accessible even after retry:', userId);
          }
        }
      } catch (err) {
        console.error('Error verifying user with admin client:', err);
      }
    }

    // Check if profile already exists (user might have signed up before)
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id, username, is_deleted')
      .eq('id', userId)
      .single();

    let profile;
    
    if (existingProfile) {
      // Profile already exists
      if (existingProfile.is_deleted) {
        // Profile was deleted, restore it
        const { data: restoredProfile, error: restoreError } = await supabase
          .from('profiles')
          .update({
            username,
            display_name: display_name || username,
            bio: bio || null,
            is_deleted: false,
            deleted_by: null,
            deleted_at: null
          })
          .eq('id', authData.user.id)
          .select()
          .single();
        
        if (restoreError) {
          return res.status(400).json({ error: `Failed to restore profile: ${restoreError.message}` });
        }
        profile = restoredProfile;
      } else {
        // Profile exists and is active - user already signed up
        return res.status(400).json({ 
          error: 'User already exists. Please try logging in instead.' 
        });
      }
    } else {
      // Profile doesn't exist, create it
      // Use admin client if available - it has better permissions
      const clientToUse = supabaseAdmin || supabase;
      
      // Try creating profile with retries
      let newProfile = null;
      let profileError = null;
      let retryCount = 0;
      const maxRetries = 5; // Increased from 3 to 5
      
      while (retryCount < maxRetries && !newProfile) {
        const { data: profileData, error: errorData } = await clientToUse
          .from('profiles')
          .insert({
            id: userId,
            username,
            display_name: display_name || username,
            bio: bio || null,
            role: 'user' // Default role
          })
          .select()
          .single();

        if (!errorData && profileData) {
          newProfile = profileData;
          break;
        }

        profileError = errorData;

        // Check if it's a foreign key constraint error
        if (errorData && (
          errorData.code === '23503' || 
          errorData.message.includes('foreign key constraint') || 
          errorData.message.includes('profiles_id_fkey')
        )) {
          // User doesn't exist in auth.users yet - wait and retry
          console.log(`Foreign key constraint error (attempt ${retryCount + 1}/${maxRetries}), waiting...`);
          retryCount++;
          
          if (retryCount < maxRetries) {
            // Exponential backoff: 1s, 2s, 3s, 4s, 5s
            const waitTime = 1000 * retryCount;
            console.log(`Waiting ${waitTime}ms before retry ${retryCount + 1}/${maxRetries}...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            
            // Verify user exists before retrying
            if (supabaseAdmin) {
              try {
                const { data: verifyUser, error: verifyError } = await supabaseAdmin.auth.admin.getUserById(userId);
                if (verifyError || !verifyUser?.user) {
                  console.log('User still not accessible, waiting more...');
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              } catch (err) {
                console.error('Error verifying user:', err);
              }
            }
          }
        } else {
          // Not a foreign key error, break and handle below
          break;
        }
      }

      if (newProfile) {
        profile = newProfile;
      } else if (profileError) {
        // Check if it's a duplicate key error (race condition)
        if (profileError.code === '23505' || profileError.message.includes('duplicate key')) {
          if (profileError.message.includes('profiles_pkey')) {
            // Profile ID already exists - user already signed up
            const { data: fetchedProfile, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
            
            if (fetchError || !fetchedProfile) {
              return res.status(400).json({ error: 'User already exists. Please try logging in instead.' });
            }
            profile = fetchedProfile;
          } else if (profileError.message.includes('profiles_username_key') || profileError.message.includes('username')) {
            // Username already taken (race condition)
            return res.status(400).json({ error: 'Username is already taken. Please choose another.' });
          } else {
            // Other duplicate key error
            return res.status(400).json({ error: 'User already exists. Please try logging in instead.' });
          }
        } else if (profileError.code === '23503' || profileError.message.includes('foreign key constraint')) {
          // Still getting foreign key error after retries
          // Check if profile was created by another process (trigger, etc.)
          const { data: fetchedProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (!fetchError && fetchedProfile) {
            profile = fetchedProfile;
          } else {
            return res.status(400).json({ 
              error: 'Profile creation failed: Please wait a moment and try logging in. If the issue persists, contact support.' 
            });
          }
        } else {
          return res.status(400).json({ error: `Profile creation failed: ${profileError.message}` });
        }
      }
    }

    // Log activity
    await createActivity(authData.user.id, 'created', 'profile', authData.user.id);

    // If session is null (email confirmation required), try to create one
    let session = authData.session;
    if (!session) {
      // If we have admin client, confirm the user's email and sign them in
      if (supabaseAdmin) {
        try {
        // Update user to confirmed status (bypass email confirmation)
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(authData.user.id, {
          email_confirm: true
        });
        
        if (updateError) {
          console.error('Error updating user:', updateError);
        }
          
          // Now sign in with regular client (should work since email is confirmed)
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (!signInError && signInData.session) {
            session = signInData.session;
          }
        } catch (err) {
          console.error('Error auto-confirming user:', err);
          // Fallback: try to sign in anyway (might work if email confirmation is disabled)
          try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (!signInError && signInData.session) {
              session = signInData.session;
            }
          } catch (signInErr) {
            console.error('Error signing in after signup:', signInErr);
          }
        }
      } else {
        // No admin client, try regular sign in (works if email confirmation is disabled)
        try {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (!signInError && signInData.session) {
            session = signInData.session;
          }
        } catch (err) {
          console.error('Error signing in after signup:', err);
        }
      }
    }

    res.status(201).json({
      user: authData.user,
      profile,
      session: session,
      requiresEmailConfirmation: !session
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .eq('is_deleted', false)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ error: 'User profile not found' });
    }

    res.json({
      user: data.user,
      profile: {
        ...profile,
        role: profile.role || 'user'
      },
      session: data.session
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


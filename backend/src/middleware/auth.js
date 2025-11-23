import { supabase } from '../config/supabase.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth check:', {
        hasHeader: !!authHeader,
        headerValue: authHeader ? `${authHeader.substring(0, 20)}...` : 'none',
        startsWithBearer: authHeader?.startsWith('Bearer '),
        allHeaders: Object.keys(req.headers)
      });
    }
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided',
        hint: 'Add Authorization header: "Bearer YOUR_TOKEN_HERE"',
        received: authHeader ? 'Header exists but format is incorrect' : 'No Authorization header found'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .eq('is_deleted', false)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ error: 'User profile not found' });
    }

    req.user = user;
    req.userProfile = {
      ...profile,
      role: profile.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userProfile) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userRole = req.userProfile.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};


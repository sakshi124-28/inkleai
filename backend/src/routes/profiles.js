import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { createActivity } from '../services/activityService.js';

const router = express.Router();

// GET /api/v1/profiles/me - Get current user's profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('is_deleted', false)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      ...profile,
      role: profile.role || 'user'
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/profiles/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const viewerId = req.user.id;

    // Get profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, bio, avatar_url, created_at, role')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Check if viewer is blocked
    const { data: blockCheck } = await supabase
      .from('blocks')
      .select('id')
      .eq('blocker_id', id)
      .eq('blocked_id', viewerId)
      .single();

    if (blockCheck) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      ...profile,
      role: profile.role || 'user'
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/v1/profiles/:id
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Users can only update their own profile
    if (id !== userId) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    const { display_name, bio, avatar_url } = req.body;
    const updates = {};

    if (display_name !== undefined) updates.display_name = display_name;
    if (bio !== undefined) updates.bio = bio;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';
import { createActivity } from '../services/activityService.js';

const router = express.Router();

// POST /api/v1/profiles/:id/follow
router.post('/:id/follow', authenticate, async (req, res) => {
  try {
    const { id: followeeId } = req.params;
    const followerId = req.user.id;

    if (followeeId === followerId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if followee exists and is not deleted
    const { data: followee, error: followeeError } = await supabase
      .from('profiles')
      .select('id, is_deleted')
      .eq('id', followeeId)
      .single();

    if (followeeError || !followee || followee.is_deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    const { data: existingFollow, error: followCheckError } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('followee_id', followeeId)
      .single();

    if (existingFollow) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Create follow
    const { data: follow, error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        followee_id: followeeId
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    await createActivity(followerId, 'followed', 'profile', followeeId);

    res.status(201).json(follow);
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/profiles/:id/follow
router.delete('/:id/follow', authenticate, async (req, res) => {
  try {
    const { id: followeeId } = req.params;
    const followerId = req.user.id;

    // Check if follow exists
    const { data: follow, error: followError } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('followee_id', followeeId)
      .single();

    if (followError || !follow) {
      return res.status(404).json({ error: 'Follow not found' });
    }

    // Delete follow
    const { error: deleteError } = await supabase
      .from('follows')
      .delete()
      .eq('id', follow.id);

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message });
    }

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


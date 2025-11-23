import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';
import { createActivity } from '../services/activityService.js';

const router = express.Router();

// POST /api/v1/posts/:id/like
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;

    // Check if post exists and is not deleted
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, author_id, is_deleted')
      .eq('id', postId)
      .single();

    if (postError || !post || post.is_deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if already liked
    const { data: existingLike, error: likeCheckError } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (existingLike) {
      return res.status(400).json({ error: 'Post already liked' });
    }

    // Create like
    const { data: like, error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        post_id: postId
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    await createActivity(userId, 'liked', 'post', postId, post.author_id);

    res.status(201).json(like);
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/posts/:id/like
router.delete('/:id/like', authenticate, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;
    const userRole = req.userProfile.role;

    // Check if like exists
    const { data: like, error: likeError } = await supabase
      .from('likes')
      .select('id, user_id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (likeError || !like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    // Check permissions: user can delete own likes, admin/owner can delete any
    if (like.user_id !== userId && userRole !== 'admin' && userRole !== 'owner') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Delete like
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('id', like.id);

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message });
    }

    res.json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { createActivity } from '../services/activityService.js';
import { getBlockedByUsers } from '../services/blockService.js';

const router = express.Router();

// POST /api/v1/posts
router.post('/', authenticate, async (req, res) => {
  try {
    const { content, media_url } = req.body;
    const authorId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        author_id: authorId,
        content: content.trim(),
        media_url: media_url || null
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    await createActivity(authorId, 'created', 'post', post.id);

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/posts - List posts (for feed)
router.get('/', authenticate, async (req, res) => {
  try {
    const viewerId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    // Get list of users who have blocked the viewer
    const blockedByUsers = await getBlockedByUsers(viewerId);

    // Build query
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url, is_deleted)
      `)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Exclude posts from users who blocked the viewer
    if (blockedByUsers.length > 0) {
      query = query.not('author_id', 'in', `(${blockedByUsers.join(',')})`);
    }

    const { data: posts, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Filter out posts from deleted users
    const filteredPosts = posts.filter(post => {
      return post.author && !post.author.is_deleted;
    });

    // Get like counts and check if viewer liked each post
    const postsWithLikes = await Promise.all(
      filteredPosts.map(async (post) => {
        // Get like count
        const { count: likeCount } = await supabase
          .from('likes')
          .select('id', { count: 'exact' })
          .eq('post_id', post.id);

        // Check if viewer liked this post
        const { data: userLike } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', post.id)
          .eq('user_id', viewerId)
          .single();

        return {
          ...post,
          like_count: likeCount || 0,
          is_liked: !!userLike
        };
      })
    );

    res.json({
      posts: postsWithLikes,
      count: postsWithLikes.length
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/posts/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const viewerId = req.user.id;

    // Get post with author info
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url)
      `)
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (error || !post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if author is deleted
    if (post.author?.is_deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if viewer is blocked by author
    const { data: blockCheck } = await supabase
      .from('blocks')
      .select('id')
      .eq('blocker_id', post.author_id)
      .eq('blocked_id', viewerId)
      .single();

    if (blockCheck) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get like count and check if viewer liked
    const { count: likeCount } = await supabase
      .from('likes')
      .select('id', { count: 'exact' })
      .eq('post_id', id);

    const { data: userLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', viewerId)
      .single();

    res.json({
      ...post,
      like_count: likeCount || 0,
      is_liked: !!userLike
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/posts/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.userProfile.role;

    // Get post
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('author_id, is_deleted')
      .eq('id', id)
      .single();

    if (fetchError || !post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.is_deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check permissions: user can delete own posts, admin/owner can delete any
    if (post.author_id !== userId && userRole !== 'admin' && userRole !== 'owner') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Soft delete
    const { data: deletedPost, error } = await supabase
      .from('posts')
      .update({
        is_deleted: true,
        deleted_by: userId,
        deleted_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    const verb = userRole === 'admin' || userRole === 'owner' ? 'deleted' : 'deleted';
    await createActivity(userId, verb, 'post', id, post.author_id, {
      deleted_by_role: userRole
    });

    res.json({ message: 'Post deleted successfully', post: deletedPost });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


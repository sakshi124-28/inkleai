import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { createActivity } from '../services/activityService.js';

const router = express.Router();

// ==================== ADMIN ROUTES ====================

// GET /api/v1/admin/users - List all users
router.get('/admin/users', authenticate, requireRole('admin', 'owner'), async (req, res) => {
  try {
    const { limit = 50, offset = 0, search = '' } = req.query;
    const adminRole = req.userProfile.role;

    let query = supabase
      .from('profiles')
      .select('id, username, display_name, bio, avatar_url, role, is_deleted, created_at, deleted_at')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Search filter
    if (search) {
      query = query.or(`username.ilike.%${search}%,display_name.ilike.%${search}%`);
    }

    // Admins can't see other admins/owners in list (optional - can be changed)
    if (adminRole === 'admin') {
      query = query.in('role', ['user']);
    }

    const { data: users, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [postsCount, likesCount, followersCount] = await Promise.all([
          supabase.from('posts').select('id', { count: 'exact' }).eq('author_id', user.id).eq('is_deleted', false),
          supabase.from('likes').select('id', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('follows').select('id', { count: 'exact' }).eq('followee_id', user.id)
        ]);

        return {
          ...user,
          stats: {
            posts: postsCount.count || 0,
            likes: likesCount.count || 0,
            followers: followersCount.count || 0
          }
        };
      })
    );

    res.json({ users: usersWithStats, count: usersWithStats.length });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/admin/users/:id - Get user details
router.get('/admin/users/:id', authenticate, requireRole('admin', 'owner'), async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user stats
    const [posts, likes, followers, following] = await Promise.all([
      supabase.from('posts').select('*').eq('author_id', id).eq('is_deleted', false),
      supabase.from('likes').select('*').eq('user_id', id),
      supabase.from('follows').select('*').eq('followee_id', id),
      supabase.from('follows').select('*').eq('follower_id', id)
    ]);

    res.json({
      ...user,
      stats: {
        posts: posts.data?.length || 0,
        likes: likes.data?.length || 0,
        followers: followers.data?.length || 0,
        following: following.data?.length || 0
      },
      recentPosts: posts.data?.slice(0, 5) || []
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/admin/posts - List all posts
router.get('/admin/posts', authenticate, requireRole('admin', 'owner'), async (req, res) => {
  try {
    const { limit = 50, offset = 0, search = '' } = req.query;

    let query = supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Search filter
    if (search) {
      query = query.ilike('content', `%${search}%`);
    }

    const { data: posts, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get like counts for each post
    const postsWithStats = await Promise.all(
      posts.map(async (post) => {
        const { count } = await supabase
          .from('likes')
          .select('id', { count: 'exact' })
          .eq('post_id', post.id);

        return {
          ...post,
          like_count: count || 0
        };
      })
    );

    res.json({ posts: postsWithStats, count: postsWithStats.length });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/admin/posts/:id/likers - Get users who liked a post (admin/owner only)
router.get('/admin/posts/:id/likers', authenticate, requireRole('admin', 'owner'), async (req, res) => {
  try {
    const { id: postId } = req.params;

    // Get all likes for this post with user info
    const { data: likes, error } = await supabase
      .from('likes')
      .select(`
        id,
        created_at,
        user:profiles!likes_user_id_fkey(id, username, display_name, avatar_url, role, is_deleted)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Filter out deleted users
    const validLikes = likes?.filter(like => like.user && !like.user.is_deleted) || [];

    res.json({
      likers: validLikes.map(like => ({
        id: like.id,
        user: like.user,
        liked_at: like.created_at
      })),
      count: validLikes.length
    });
  } catch (error) {
    console.error('Get post likers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/admin/posts/:id - Get post details
router.get('/admin/posts/:id', authenticate, requireRole('admin', 'owner'), async (req, res) => {
  try {
    const { id } = req.params;

    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles!posts_author_id_fkey(id, username, display_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error || !post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get likes
    const { data: likes, error: likesError } = await supabase
      .from('likes')
      .select(`
        *,
        user:profiles!likes_user_id_fkey(id, username, display_name)
      `)
      .eq('post_id', id);

    res.json({
      ...post,
      likes: likes || [],
      like_count: likes?.length || 0
    });
  } catch (error) {
    console.error('Get post details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/admin/likes - List all likes
router.get('/admin/likes', authenticate, requireRole('admin', 'owner'), async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const { data: likes, error } = await supabase
      .from('likes')
      .select(`
        *,
        user:profiles!likes_user_id_fkey(id, username, display_name, avatar_url),
        post:posts!likes_post_id_fkey(id, content, author_id)
      `)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ likes: likes || [], count: likes?.length || 0 });
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/admin/likes/:id - Get like details
router.get('/admin/likes/:id', authenticate, requireRole('admin', 'owner'), async (req, res) => {
  try {
    const { id } = req.params;

    const { data: like, error } = await supabase
      .from('likes')
      .select(`
        *,
        user:profiles!likes_user_id_fkey(id, username, display_name, avatar_url),
        post:posts!likes_post_id_fkey(id, content, author_id, created_at)
      `)
      .eq('id', id)
      .single();

    if (error || !like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    res.json(like);
  } catch (error) {
    console.error('Get like details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/admin/likes/:id - Delete like (admin/owner only)
router.delete('/admin/likes/:id', authenticate, requireRole('admin', 'owner'), async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const adminRole = req.userProfile.role;

    // Get like details
    const { data: like, error: likeError } = await supabase
      .from('likes')
      .select('*')
      .eq('id', id)
      .single();

    if (likeError || !like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    // Delete like
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message });
    }

    // Log activity
    await createActivity(adminId, 'deleted', 'like', id, like.user_id, {
      deleted_by_role: adminRole,
      post_id: like.post_id
    });

    res.json({ message: 'Like deleted successfully' });
  } catch (error) {
    console.error('Delete like error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/admin/stats - Get admin dashboard stats
router.get('/admin/stats', authenticate, requireRole('admin', 'owner'), async (req, res) => {
  try {
    const [usersCount, postsCount, likesCount, activitiesCount] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }).eq('is_deleted', false),
      supabase.from('posts').select('id', { count: 'exact' }).eq('is_deleted', false),
      supabase.from('likes').select('id', { count: 'exact' }),
      supabase.from('activities').select('id', { count: 'exact' })
    ]);

    // Get recent activities
    const { data: recentActivities } = await supabase
      .from('activities')
      .select(`
        *,
        actor:profiles!activities_actor_id_fkey(id, username, display_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    res.json({
      stats: {
        total_users: usersCount.count || 0,
        total_posts: postsCount.count || 0,
        total_likes: likesCount.count || 0,
        total_activities: activitiesCount.count || 0
      },
      recent_activities: recentActivities || []
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/admin/users/:id
router.delete('/admin/users/:id', authenticate, requireRole('admin', 'owner'), async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const adminRole = req.userProfile.role;

    if (id === adminId) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    // Get user to delete
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, username, is_deleted, role')
      .eq('id', id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.is_deleted) {
      return res.status(404).json({ error: 'User already deleted' });
    }

    // Owner can delete anyone, admin cannot delete owner/admin
    const userRole = user.role || 'user';
    if (adminRole === 'admin' && (userRole === 'owner' || userRole === 'admin')) {
      return res.status(403).json({ error: 'Admins cannot delete owners or other admins' });
    }

    // Soft delete user
    const { data: deletedUser, error } = await supabase
      .from('profiles')
      .update({
        is_deleted: true,
        deleted_by: adminId,
        deleted_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    await createActivity(adminId, 'deleted', 'profile', id, null, {
      deleted_by_role: adminRole
    });

    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/owner/admins - List all admins
router.get('/owner/admins', authenticate, requireRole('owner'), async (req, res) => {
  try {
    const { data: admins, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, bio, avatar_url, role, created_at')
      .in('role', ['admin', 'owner'])
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ admins: admins || [], count: admins?.length || 0 });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/owner/stats - Get owner dashboard stats
router.get('/owner/stats', authenticate, requireRole('owner'), async (req, res) => {
  try {
    const [usersCount, postsCount, likesCount, adminsCount, activitiesCount] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }).eq('is_deleted', false),
      supabase.from('posts').select('id', { count: 'exact' }).eq('is_deleted', false),
      supabase.from('likes').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }).in('role', ['admin', 'owner']).eq('is_deleted', false),
      supabase.from('activities').select('id', { count: 'exact' })
    ]);

    res.json({
      stats: {
        total_users: usersCount.count || 0,
        total_posts: postsCount.count || 0,
        total_likes: likesCount.count || 0,
        total_admins: adminsCount.count || 0,
        total_activities: activitiesCount.count || 0
      }
    });
  } catch (error) {
    console.error('Get owner stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/owner/admins
router.post('/owner/admins', authenticate, requireRole('owner'), async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, username, role, is_deleted')
      .eq('id', user_id)
      .single();

    if (userError || !user || user.is_deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRole = user.role || 'user';
    if (userRole === 'admin' || userRole === 'owner') {
      return res.status(400).json({ error: 'User is already an admin or owner' });
    }

    // Update role to admin
    const { data: updatedUser, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    await createActivity(req.user.id, 'promoted', 'profile', user_id, null, {
      new_role: 'admin'
    });

    res.json({ message: 'User promoted to admin', user: updatedUser });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/owner/admins/:id
router.delete('/owner/admins/:id', authenticate, requireRole('owner'), async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;

    if (id === ownerId) {
      return res.status(400).json({ error: 'Cannot demote yourself' });
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, username, role, is_deleted')
      .eq('id', id)
      .single();

    if (userError || !user || user.is_deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRole = user.role || 'user';
    if (userRole !== 'admin') {
      return res.status(400).json({ error: 'User is not an admin' });
    }

    // Demote to user
    const { data: updatedUser, error } = await supabase
      .from('profiles')
      .update({ role: 'user' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    await createActivity(ownerId, 'demoted', 'profile', id, null, {
      new_role: 'user'
    });

    res.json({ message: 'Admin demoted to user', user: updatedUser });
  } catch (error) {
    console.error('Remove admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';
import { getBlockedByUsers } from '../services/blockService.js';

const router = express.Router();

// GET /api/v1/activities
router.get('/', authenticate, async (req, res) => {
  try {
    const viewerId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    // Get list of users who have blocked the viewer
    const blockedByUsers = await getBlockedByUsers(viewerId);

    // Get viewer's role to filter admin activities
    const { data: viewerProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', viewerId)
      .single();

    const viewerRole = viewerProfile?.role || 'user';

    // Build query for activities
    let query = supabase
      .from('activities')
      .select(`
        *,
        actor:profiles!activities_actor_id_fkey(id, username, display_name, avatar_url, is_deleted, role)
      `)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Exclude activities from users who blocked the viewer
    if (blockedByUsers.length > 0) {
      query = query.not('actor_id', 'in', `(${blockedByUsers.join(',')})`);
    }

    const { data: activities, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Filter out activities from deleted users and admin activities for regular users
    const filteredActivities = activities.filter(activity => {
      if (!activity.actor || activity.actor.is_deleted) {
        return false;
      }

      // Hide admin/owner activities from regular users
      // Only show admin activities (promoted, demoted, admin deletions) to admins/owners
      if (viewerRole !== 'admin' && viewerRole !== 'owner') {
        const actorRole = activity.actor?.role || 'user';
        // Hide activities from admin/owner users (unless it's a regular post/like/follow)
        if (actorRole === 'admin' || actorRole === 'owner') {
          // Only hide admin-specific activities, not their regular posts/likes
          if (activity.verb === 'promoted' || activity.verb === 'demoted' || 
              (activity.verb === 'deleted' && activity.metadata?.deleted_by_role === 'admin')) {
            return false;
          }
        }
      }

      // For post-related activities, check if post is deleted
      if (activity.object_type === 'post' && activity.object_id) {
        return true;
      }

      return true;
    });

    // Fetch post deletion status for post-related activities
    const postIds = filteredActivities
      .filter(a => a.object_type === 'post' && a.object_id)
      .map(a => a.object_id);

    let deletedPosts = [];
    if (postIds.length > 0) {
      const { data: posts } = await supabase
        .from('posts')
        .select('id, is_deleted')
        .in('id', postIds);

      deletedPosts = posts?.filter(p => p.is_deleted).map(p => p.id) || [];
    }

    // Final filter: remove activities for deleted posts
    const finalActivities = filteredActivities.filter(activity => {
      if (activity.object_type === 'post' && activity.object_id) {
        return !deletedPosts.includes(activity.object_id);
      }
      return true;
    });

    res.json({
      activities: finalActivities,
      count: finalActivities.length
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


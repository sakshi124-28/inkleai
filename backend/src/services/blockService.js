import { supabase } from '../config/supabase.js';

/**
 * Get list of user IDs who have blocked the given user
 */
export const getBlockedByUsers = async (userId) => {
  const { data, error } = await supabase
    .from('blocks')
    .select('blocker_id')
    .eq('blocked_id', userId);

  if (error) {
    console.error('Error getting blocked by users:', error);
    return [];
  }

  return data.map(block => block.blocker_id);
};

/**
 * Get list of user IDs that the given user has blocked
 */
export const getBlockedUsers = async (userId) => {
  const { data, error } = await supabase
    .from('blocks')
    .select('blocked_id')
    .eq('blocker_id', userId);

  if (error) {
    console.error('Error getting blocked users:', error);
    return [];
  }

  return data.map(block => block.blocked_id);
};

/**
 * Check if viewer is blocked from seeing content from contentOwner
 */
export const isBlocked = async (viewerId, contentOwnerId) => {
  const { data, error } = await supabase
    .from('blocks')
    .select('id')
    .eq('blocker_id', contentOwnerId)
    .eq('blocked_id', viewerId)
    .single();

  return !error && data !== null;
};


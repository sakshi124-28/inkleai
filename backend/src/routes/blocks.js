import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';
import { createActivity } from '../services/activityService.js';

const router = express.Router();

// POST /api/v1/profiles/:id/block
router.post('/:id/block', authenticate, async (req, res) => {
  try {
    const { id: blockedId } = req.params;
    const blockerId = req.user.id;

    if (blockedId === blockerId) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    // Check if user to block exists and is not deleted
    const { data: blockedUser, error: userError } = await supabase
      .from('profiles')
      .select('id, is_deleted')
      .eq('id', blockedId)
      .single();

    if (userError || !blockedUser || blockedUser.is_deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already blocked
    const { data: existingBlock, error: blockCheckError } = await supabase
      .from('blocks')
      .select('id')
      .eq('blocker_id', blockerId)
      .eq('blocked_id', blockedId)
      .single();

    if (existingBlock) {
      return res.status(400).json({ error: 'User already blocked' });
    }

    // Create block
    const { data: block, error } = await supabase
      .from('blocks')
      .insert({
        blocker_id: blockerId,
        blocked_id: blockedId
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Log activity
    await createActivity(blockerId, 'blocked', 'profile', blockedId);

    res.status(201).json(block);
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/v1/profiles/:id/block
router.delete('/:id/block', authenticate, async (req, res) => {
  try {
    const { id: blockedId } = req.params;
    const blockerId = req.user.id;

    // Check if block exists
    const { data: block, error: blockError } = await supabase
      .from('blocks')
      .select('id')
      .eq('blocker_id', blockerId)
      .eq('blocked_id', blockedId)
      .single();

    if (blockError || !block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    // Delete block
    const { error: deleteError } = await supabase
      .from('blocks')
      .delete()
      .eq('id', block.id);

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message });
    }

    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


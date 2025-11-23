import { supabase } from '../config/supabase.js';

export const createActivity = async (actorId, verb, objectType, objectId = null, targetId = null, metadata = {}) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        actor_id: actorId,
        verb,
        object_type: objectType,
        object_id: objectId,
        target_id: targetId,
        metadata
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating activity:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception creating activity:', error);
    return null;
  }
};


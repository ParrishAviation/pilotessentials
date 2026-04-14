/**
 * Lightweight analytics event tracker.
 * Fire-and-forget — never blocks UI.
 */
import { supabase } from './supabase';

export async function track(eventType, payload = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return; // not logged in, skip

    const { lesson_id, module_id, course_id, quiz_id, ...rest } = payload;
    await supabase.from('analytics_events').insert({
      user_id: userId,
      event_type: eventType,
      lesson_id: lesson_id || null,
      module_id: module_id || null,
      course_id: course_id || null,
      quiz_id: quiz_id || null,
      metadata: rest,
    });
  } catch (_) {
    // Tracking is non-fatal — silently swallow all errors
  }
}

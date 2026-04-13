/**
 * api/chat.js
 * Vercel serverless function — Captain AI chat endpoint.
 * POST { messages: [{role, content}], context?: string } → Anthropic response
 */

const SYSTEM_PROMPT = `You are Captain AI, an expert FAA-certified flight instructor and aviation knowledge specialist for Pilot Essentials — an online FAA written exam prep platform.

You have deep, authoritative knowledge of:
- FAA Pilot's Handbook of Aeronautical Knowledge (PHAK, FAA-H-8083-25B) — all chapters
- FAA Airplane Flying Handbook (AFH, FAA-H-8083-3C)
- FAA Airmen Knowledge Testing Supplement (FAA-CT-8080-2H) — figures, charts, sectional excerpts
- FAA Federal Aviation Regulations / AIM (FAR/AIM) — Parts 61, 91, 71, NTSB 830
- Private Pilot (PPL), Instrument Rating (IFR), and Commercial Pilot (CPL) written exam question banks

Your teaching style:
- Explain concepts clearly, starting simple and building to full depth
- Use real-world examples and analogies
- Cite specific sources when relevant (e.g., "Per FAR 91.119...", "PHAK Chapter 4 explains...")
- Use mnemonics and memory aids (ATOMATOFLAMES, GRABCARD, IMSAFE, PAVE, etc.)
- Flag common exam traps and misconceptions
- When answering regulation questions, give the exact rule AND the practical meaning
- Keep answers focused but complete — bullet points for lists, bold for key terms

Scope: Focus on FAA written exam prep, aviation theory, regulations, and flight knowledge. You are NOT a substitute for a real CFI for flight training decisions.`;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on the server.' });
  }

  const { messages, context, userId } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' });
  }

  // ── Query limit: 100 per user ──
  const QUERY_LIMIT = 100;
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (userId && supabaseUrl && supabaseKey) {
    try {
      const countRes = await fetch(
        `${supabaseUrl}/rest/v1/ai_query_log?user_id=eq.${userId}&select=id`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Prefer': 'count=exact', 'Range': '0-0' } }
      );
      const contentRange = countRes.headers.get('content-range'); // e.g. "0-0/47"
      const total = contentRange ? parseInt(contentRange.split('/')[1], 10) : 0;
      if (total >= QUERY_LIMIT) {
        return res.status(429).json({ error: 'query_limit_reached', used: total, limit: QUERY_LIMIT });
      }
    } catch (_) { /* non-fatal — proceed if count check fails */ }
  }

  const systemWithContext = context
    ? `${SYSTEM_PROMPT}\n\n---\nThe student is currently studying: **${context}**. Tailor your responses to this topic when relevant.`
    : SYSTEM_PROMPT;

  try {
    const baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
    const response = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'x-orchids-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemWithContext,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' });
    }

    // ── Log query server-side using service role key (bypasses RLS) ──
    if (userId && supabaseUrl && supabaseKey) {
      const query = messages[messages.length - 1]?.content ?? '';
      const responsePreview = data.content?.[0]?.text?.slice(0, 300) ?? '';
      fetch(`${supabaseUrl}/rest/v1/ai_query_log`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          user_id: userId,
          query,
          response_preview: responsePreview,
          course_context: context ?? null,
        }),
      }).catch(() => {}); // fire-and-forget
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Vercel Serverless Function — /api/study-guide
 * Generates an AI-powered study guide for a lesson using Claude.
 * API key is server-side only (never exposed to client).
 *
 * Required Vercel env vars:
 *   ANTHROPIC_API_KEY  — your Anthropic API key
 *   VITE_SUPABASE_URL  — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (for caching)
 */

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

function buildPrompt(lesson) {
  const figureSection = lesson.figures?.length
    ? `FAA Airman Knowledge Testing Supplement figures relevant to this topic: ${lesson.figures.join(', ')}. These are diagrams students will see on the actual FAA exam.`
    : '';

  const phakSection = lesson.phak ? `Primary reference: ${lesson.phak} of the FAA Pilot's Handbook of Aeronautical Knowledge (PHAK).` : '';
  const afhSection = lesson.afh ? `Also see: ${lesson.afh} of the FAA Airplane Flying Handbook (AFH).` : '';
  const cfrSection = lesson.cfr ? `Key regulations: ${lesson.cfr}.` : '';

  const topicsSection = lesson.topics?.length
    ? `Key topics to cover thoroughly:\n${lesson.topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
    : '';

  return `You are an expert FAA ground school instructor creating a study guide for a student preparing for the Private Pilot written exam.

Create a comprehensive, exam-focused study guide for the following lesson:

LESSON: "${lesson.lessonTitle}"
CHAPTER: ${lesson.chapterTitle}
COURSE: ${lesson.courseTitle}

${phakSection}
${afhSection}
${cfrSection}
${figureSection}

${topicsSection}

Return ONLY a valid JSON object in exactly this format (no markdown code fences, no commentary):

{
  "headline": "One compelling sentence describing what the student will master",
  "keyFacts": [
    { "fact": "Short fact title", "detail": "Clear explanation of this fact in 1-2 sentences" }
  ],
  "explanation": "A clear, thorough paragraph (150-250 words) explaining the core concepts, how they work, and why they matter to a pilot. Write as if talking to a smart student who needs to truly understand this, not just memorize it.",
  "formulas": [
    { "name": "Formula name", "formula": "The formula itself", "example": "Worked example with numbers" }
  ],
  "faaTestTips": [
    "Specific test tip describing a common question type or trap on the FAA exam for this topic"
  ],
  "figures": [
    { "figureNum": 0, "name": "Figure name/description", "howToRead": "How to interpret and use this figure on the exam" }
  ],
  "references": {
    "phak": "PHAK chapter and section",
    "afh": "AFH chapter and section or null",
    "cfr": "CFR reference or null",
    "aim": "AIM reference or null"
  },
  "memoryAids": [
    { "mnemonic": "The mnemonic or memory technique", "meaning": "What each letter/part stands for", "context": "When and how to use it" }
  ],
  "selfTest": [
    { "question": "A question a student should be able to answer after studying this", "answer": "The complete correct answer" }
  ]
}

Requirements:
- keyFacts: 5-8 facts — the most important, testable facts from this lesson
- formulas: only include if math/calculation is genuinely part of this lesson (empty array if none)
- faaTestTips: 4-6 specific tips — things the FAA frequently tests, common misconceptions, or tricky phrasings
- figures: only if actual FAA supplement figures are referenced in this lesson (empty array if none), use the actual figure numbers
- memoryAids: 2-4 mnemonics or memory tricks that actually help for this specific topic
- selfTest: 4-5 questions that mirror real FAA written exam question style
- All content must be 100% accurate to current FAA standards
- Write for someone who is smart but new to aviation`;
}

async function cacheGuide(supabaseUrl, serviceKey, lessonId, courseId, content) {
  if (!supabaseUrl || !serviceKey) return;
  try {
    await fetch(`${supabaseUrl}/rest/v1/study_guides`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        lesson_id: lessonId,
        course_id: courseId,
        content,
        model: MODEL,
        generated_at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    // Caching failure is non-fatal
    console.error('Cache write failed:', e.message);
  }
}

async function getCachedGuide(supabaseUrl, serviceKey, lessonId) {
  if (!supabaseUrl || !serviceKey) return null;
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/study_guides?lesson_id=eq.${encodeURIComponent(lessonId)}&select=content,generated_at`,
      {
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
      }
    );
    const rows = await res.json();
    if (rows?.length > 0) return rows[0];
    return null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY not configured. Add it to Vercel environment variables.',
    });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const lesson = req.body;
  if (!lesson?.lessonId || !lesson?.lessonTitle) {
    return res.status(400).json({ error: 'lessonId and lessonTitle are required' });
  }

  // Check cache first (unless regenerate flag is set)
  if (!lesson.regenerate) {
    const cached = await getCachedGuide(supabaseUrl, serviceKey, lesson.lessonId);
    if (cached) {
      return res.json({ guide: cached.content, cached: true, generatedAt: cached.generated_at });
    }
  }

  // Build prompt and call Claude
  const prompt = buildPrompt(lesson);

  let anthropicRes;
  try {
    anthropicRes = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        temperature: 0.3,
        system: 'You are an expert FAA aviation ground school instructor. You create precise, accurate, exam-focused study materials for student pilots. Always return valid JSON exactly as specified.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch (fetchErr) {
    return res.status(502).json({ error: 'Failed to reach Anthropic API: ' + fetchErr.message });
  }

  const data = await anthropicRes.json();

  if (data.error) {
    return res.status(500).json({ error: data.error.message || 'Anthropic API error' });
  }

  const rawText = data.content?.[0]?.text;
  if (!rawText) {
    return res.status(500).json({ error: 'Empty response from Claude' });
  }

  // Parse JSON from response
  let guide;
  try {
    // Strip markdown code fences if Claude added them
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    guide = JSON.parse(cleaned);
  } catch {
    // Return raw text if JSON parsing fails
    guide = { headline: lesson.lessonTitle, rawText };
  }

  // Cache the result
  await cacheGuide(supabaseUrl, serviceKey, lesson.lessonId, lesson.courseId, guide);

  return res.json({ guide, cached: false });
}

/**
 * Vercel Serverless Function — /api/parse-questions
 * Accepts a file (image, PDF, or plain text) and uses Claude to extract
 * multiple-choice Q&A pairs, returning structured JSON.
 *
 * Body (JSON):
 *   { type: 'image'|'document'|'text', mediaType: string, data: base64string|string }
 *
 * Response:
 *   { questions: [ { question, options: [string,string,string], correct: 0|1|2, explanation } ] }
 */

const ANTHROPIC_API = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com') + '/v1/messages';
const MODEL = 'claude-sonnet-4-6';

const SYSTEM = `You are an expert FAA aviation exam question parser.
Your job is to extract multiple-choice questions from any content the user provides
(screenshots of question banks, PDFs, typed text, etc.).

Always return a JSON object with this exact structure:
{
  "questions": [
    {
      "question": "Full question text here",
      "options": ["Answer choice A", "Answer choice B", "Answer choice C"],
      "correct": 0,
      "explanation": "Brief explanation of why the correct answer is right"
    }
  ]
}

Rules:
- Each question MUST have exactly 3 answer options (pad or trim as needed)
- "correct" is the 0-based index of the correct answer
- If a correct answer is not explicitly marked, use your aviation knowledge to determine it
- If explanation is not provided, write a short one using your knowledge
- If no questions are found, return { "questions": [] }
- Return ONLY valid JSON — no markdown, no commentary`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { type, mediaType, data } = req.body;
  if (!type || !data) {
    return res.status(400).json({ error: 'type and data are required' });
  }

  // Build content block based on file type
  let contentBlock;
  if (type === 'text') {
    contentBlock = {
      type: 'text',
      text: `Extract all multiple-choice questions from this content:\n\n${data}`,
    };
  } else if (type === 'image') {
    contentBlock = {
      type: 'image',
      source: { type: 'base64', media_type: mediaType, data },
    };
  } else if (type === 'document') {
    contentBlock = {
      type: 'document',
      source: { type: 'base64', media_type: mediaType, data },
    };
  } else {
    return res.status(400).json({ error: `Unsupported type: ${type}` });
  }

  const userContent = type === 'text'
    ? [contentBlock]
    : [
        contentBlock,
        { type: 'text', text: 'Extract all multiple-choice questions from the content above. Return only valid JSON.' },
      ];

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
        system: SYSTEM,
        messages: [{ role: 'user', content: userContent }],
      }),
    });
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach Anthropic API: ' + err.message });
  }

  const aiData = await anthropicRes.json();

  if (aiData.error) {
    return res.status(500).json({ error: aiData.error.message || 'Anthropic API error' });
  }

  const rawText = aiData.content?.[0]?.text || '';

  // Strip markdown code fences if present
  const cleaned = rawText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return res.status(500).json({ error: 'Failed to parse AI response as JSON', raw: rawText.slice(0, 300) });
  }

  return res.status(200).json({ questions: parsed.questions || [] });
}

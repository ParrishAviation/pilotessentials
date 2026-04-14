/**
 * Bulk study guide generator — run with: node generate-study-guides.mjs
 * Hits the PRODUCTION /api/study-guide endpoint for every lesson.
 * The API checks Supabase cache first and skips already-generated guides.
 * Rate limit: ~5 req/min on Anthropic free tier → 15s delay between generations.
 */

import { readFileSync } from 'fs';

const API = 'https://pilotessentials.vercel.app/api/study-guide';
const DELAY_MS = 15000;      // 15s between generated (not cached) requests
const RETRY_DELAY_MS = 70000; // 70s cooldown on rate limit
const MAX_RETRIES = 3;
const CONCURRENCY = 1;        // one at a time to avoid rate limits

// ─── Load lesson IDs ───────────────────────────────────────────────────────
const topicsRaw = readFileSync('./src/data/lessonTopics.js', 'utf8');
const coursesRaw = readFileSync('./src/data/courses.js', 'utf8');

const lessonIdMatches = [...topicsRaw.matchAll(/^\s+'(ppl-ch\d+-l\d+)':/gm)];
const allLessonIds = lessonIdMatches.map(m => m[1]);
console.log(`Found ${allLessonIds.length} lesson IDs in lessonTopics.js`);

// Build lessonId → title map
const lessonTitleMap = {};
const lessonMatches = [...coursesRaw.matchAll(/\{\s*id:\s*'(ppl-ch\d+-l\d+)',\s*title:\s*'([^']+)'/g)];
lessonMatches.forEach(m => { lessonTitleMap[m[1]] = m[2]; });

const chapterTitleMap = {};
const chapterMatches = [...coursesRaw.matchAll(/\{\s*id:\s*'(ppl-ch\d+)',[\s\S]*?title:\s*'([^']+)'/g)];
chapterMatches.forEach(m => { chapterTitleMap[m[1]] = m[2]; });

function extractTopicData(lessonId) {
  const escaped = lessonId.replace(/-/g, '\\-');
  const blockRe = new RegExp(`'${escaped}':\\s*\\{([\\s\\S]*?)\\n  \\}`, 'm');
  const match = topicsRaw.match(blockRe);
  if (!match) return {};
  const block = match[1];
  const phak = (block.match(/phak:\s*'([^']+)'/) || [])[1] || null;
  const afh  = (block.match(/afh:\s*'([^']+)'/)  || [])[1] || null;
  const cfr  = (block.match(/cfr:\s*'([^']+)'/)  || [])[1] || null;
  const figuresMatch = block.match(/figures:\s*\[([^\]]*)\]/);
  const figures = figuresMatch ? figuresMatch[1].match(/\d+/g)?.map(Number) || [] : [];
  const topicsMatch = block.match(/topics:\s*\[([\s\S]*?)\]/);
  const topics = topicsMatch ? [...topicsMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
  return { phak, afh, cfr, figures, topics };
}

async function generateOne(lessonId) {
  const chapterId = lessonId.replace(/-l\d+$/, '');
  const lessonTitle = lessonTitleMap[lessonId] || lessonId;
  const chapterTitle = chapterTitleMap[chapterId] || '';
  const topicData = extractTopicData(lessonId);

  const payload = {
    lessonId,
    lessonTitle,
    chapterTitle,
    courseTitle: 'Private Pilot (PPL)',
    courseId: 'private-pilot',
    ...topicData,
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        const isRateLimit = txt.includes('rate') || res.status === 429;
        if (isRateLimit && attempt < MAX_RETRIES) {
          console.log(`  ⏳ ${lessonId} — rate limited, waiting ${RETRY_DELAY_MS/1000}s (attempt ${attempt}/${MAX_RETRIES})...`);
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        return { lessonId, status: 'error', message: `HTTP ${res.status}: ${txt.slice(0, 100)}` };
      }
      const data = await res.json();
      if (data.error) {
        const isRateLimit = data.error.toLowerCase().includes('rate');
        if (isRateLimit && attempt < MAX_RETRIES) {
          console.log(`  ⏳ ${lessonId} — rate limited, waiting ${RETRY_DELAY_MS/1000}s...`);
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        return { lessonId, status: 'error', message: data.error.slice(0, 100) };
      }
      return { lessonId, status: data.cached ? 'cached' : 'generated' };
    } catch (e) {
      return { lessonId, status: 'error', message: e.message };
    }
  }
  return { lessonId, status: 'error', message: 'max retries exceeded' };
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runAll() {
  console.log(`\nGenerating study guides for ${allLessonIds.length} lessons via production API...\n`);
  console.log(`API: ${API}`);
  console.log(`Delay between generations: ${DELAY_MS/1000}s\n`);

  const results = { cached: [], generated: [], error: [] };
  let lastWasGenerated = false;

  for (let i = 0; i < allLessonIds.length; i++) {
    const lessonId = allLessonIds[i];

    // Only throttle after a real generation (not after cached hits)
    if (lastWasGenerated) {
      process.stdout.write(`  ⏱  waiting ${DELAY_MS/1000}s before next request...\r`);
      await sleep(DELAY_MS);
    }

    const r = await generateOne(lessonId);
    const bucket = ['cached','generated','error'].includes(r.status) ? r.status : 'error';
    results[bucket].push(r.lessonId);
    lastWasGenerated = r.status === 'generated';

    const icon = r.status === 'generated' ? '✅' : r.status === 'cached' ? '⏭️ ' : '❌';
    const suffix = r.status === 'error' ? ` — ${r.message}` : '';
    const progress = `[${i+1}/${allLessonIds.length}]`;
    console.log(`  ${icon} ${progress} ${r.lessonId}${suffix}`);
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`✅ Generated: ${results.generated.length}`);
  console.log(`⏭️  Already cached: ${results.cached.length}`);
  console.log(`❌ Errors: ${results.error.length}`);
  if (results.error.length > 0) {
    console.log('\nFailed lessons:');
    results.error.forEach(id => console.log(`  - ${id}`));
  }
  console.log(`─────────────────────────────────\n`);
}

runAll().catch(console.error);

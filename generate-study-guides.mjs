/**
 * Bulk study guide generator — run with: node generate-study-guides.mjs
 * Hits the local /api/study-guide endpoint for every lesson in lessonTopics.js
 * The API checks Supabase cache first and skips already-generated guides.
 */

import { readFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// ─── Load course data ──────────────────────────────────────────────────────
// We need to parse the JS files without the ES module syntax
// Use a simple regex approach to extract what we need

const topicsRaw = readFileSync('./src/data/lessonTopics.js', 'utf8');
const coursesRaw = readFileSync('./src/data/courses.js', 'utf8');

// Extract lesson IDs from lessonTopics.js
const lessonIdMatches = [...topicsRaw.matchAll(/^\s+'(ppl-ch\d+-l\d+)':/gm)];
const allLessonIds = lessonIdMatches.map(m => m[1]);
console.log(`Found ${allLessonIds.length} lesson IDs in lessonTopics.js`);

// Build a map of lessonId → { title, chapterTitle } from courses.js
// Extract lesson entries: { id: 'ppl-ch1-l1', title: '1 — Forces of Flight' }
const lessonTitleMap = {};
const lessonMatches = [...coursesRaw.matchAll(/\{\s*id:\s*'(ppl-ch\d+-l\d+)',\s*title:\s*'([^']+)'/g)];
lessonMatches.forEach(m => { lessonTitleMap[m[1]] = m[2]; });

// Extract chapter titles: { id: 'ppl-ch1', title: 'Aerodynamics' }
const chapterTitleMap = {};
const chapterMatches = [...coursesRaw.matchAll(/\{\s*id:\s*'(ppl-ch\d+)',[\s\S]*?title:\s*'([^']+)'/g)];
chapterMatches.forEach(m => { chapterTitleMap[m[1]] = m[2]; });

// Extract topics/phak/figures from lessonTopics
// We'll do a per-lesson extraction via regex
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
  const figures = figuresMatch
    ? figuresMatch[1].match(/\d+/g)?.map(Number) || []
    : [];

  const topicsMatch = block.match(/topics:\s*\[([^\]]*)\]/s);
  const topics = topicsMatch
    ? [...topicsMatch[1].matchAll(/'([^']+)'/g)].map(m => m[1])
    : [];

  return { phak, afh, cfr, figures, topics };
}

const API = 'https://pilotessentials.vercel.app/api/study-guide';
const CONCURRENCY = 1;       // one at a time — rate limit is 5 req/min
const DELAY_MS = 15000;      // 15 sec between requests = 4/min, safely under limit
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 65000; // 65 sec cooldown on rate limit error

async function generateOne(lessonId) {
  const chId = lessonId.replace(/-l\d+$/, '');
  const lessonTitle = lessonTitleMap[lessonId] || lessonId;
  const chapterTitle = chapterTitleMap[chId] || chId;
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
        return { lessonId, status: 'error', message: txt.slice(0, 120) };
      }
      const data = await res.json();
      if (data.error) {
        const isRateLimit = data.error.includes('rate limit');
        if (isRateLimit && attempt < MAX_RETRIES) {
          console.log(`  ⏳ ${lessonId} — rate limited, waiting ${RETRY_DELAY_MS/1000}s (attempt ${attempt}/${MAX_RETRIES})...`);
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
  console.log(`\nGenerating study guides for ${allLessonIds.length} lessons...\n`);

  const results = { cached: [], generated: [], error: [] };

  for (let i = 0; i < allLessonIds.length; i += CONCURRENCY) {
    const batch = allLessonIds.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(generateOne));

    batchResults.forEach(r => {
      const bucket = results[r.status] ? r.status : 'error';
      results[bucket].push(r.lessonId);
      const icon = r.status === 'generated' ? '✅' : r.status === 'cached' ? '⏭️ ' : '❌';
      const suffix = r.status === 'error' ? ` — ${r.message}` : '';
      const progress = `[${Math.min(i + CONCURRENCY, allLessonIds.length)}/${allLessonIds.length}]`;
      console.log(`  ${icon} ${progress} ${r.lessonId}${suffix}`);
    });

    if (i + CONCURRENCY < allLessonIds.length) {
      process.stdout.write(`  ... waiting ${DELAY_MS/1000}s\r`);
      await sleep(DELAY_MS);
    }
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

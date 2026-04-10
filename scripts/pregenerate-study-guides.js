/**
 * scripts/pregenerate-study-guides.js
 * Pre-generates and caches study guides for all video lessons.
 * Run once: node scripts/pregenerate-study-guides.js
 *
 * Requires the API server to be running on port 3001 (npm run api).
 */

import { readFileSync } from 'fs';
import { createRequire } from 'module';

// Load .env manually
try {
  const env = readFileSync('.env', 'utf8');
  for (const line of env.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {}

// Inline the lesson topics and courses data
const { COURSES } = await import('../src/data/courses.js');
const { getLessonTopics } = await import('../src/data/lessonTopics.js');

const API_URL = 'http://localhost:3001/api/study-guide';
const DELAY_MS = 3000; // 3s between requests to avoid rate limits

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function generateGuide(lesson, module, course) {
  const topicMeta = getLessonTopics(lesson.id);
  const payload = {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    chapterTitle: module.title,
    courseTitle: course.title,
    courseId: course.id,
    phak: topicMeta?.phak || null,
    afh: topicMeta?.afh || null,
    cfr: topicMeta?.cfr || null,
    aim: topicMeta?.aim || null,
    figures: topicMeta?.figures || [],
    topics: topicMeta?.topics || [],
    regenerate: false,
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
  return data.cached;
}

async function main() {
  // Collect all video lessons from the private pilot course only
  const videoLessons = [];
  for (const course of COURSES) {
    if (course.underConstruction) continue;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.type === 'video') {
          videoLessons.push({ lesson, module: mod, course });
        }
      }
    }
  }

  console.log(`\n✈️  Pre-generating study guides for ${videoLessons.length} video lessons...\n`);

  let generated = 0;
  let cached = 0;
  let failed = 0;

  for (let i = 0; i < videoLessons.length; i++) {
    const { lesson, module, course } = videoLessons[i];
    const progress = `[${i + 1}/${videoLessons.length}]`;

    try {
      const wasCached = await generateGuide(lesson, module, course);
      if (wasCached) {
        console.log(`${progress} ✓ (already cached) ${lesson.title}`);
        cached++;
      } else {
        console.log(`${progress} ✅ Generated: ${lesson.title}`);
        generated++;
        // Delay only after actual generation to avoid API rate limits
        if (i < videoLessons.length - 1) await sleep(DELAY_MS);
      }
    } catch (err) {
      console.error(`${progress} ❌ Failed: ${lesson.title} — ${err.message}`);
      failed++;
      await sleep(1000);
    }
  }

  console.log(`\n─────────────────────────────────`);
  console.log(`✅ Generated: ${generated}`);
  console.log(`📦 Already cached: ${cached}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`─────────────────────────────────\n`);
}

main().catch(console.error);

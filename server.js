/**
 * server.js — local dev API server (mirrors Vercel serverless functions)
 * Run with: node server.js  (or via npm run api)
 */
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { createRequire } from 'module';

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Load .env manually for local dev
try {
  const envFile = readFileSync('.env', 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!process.env[key] || process.env[key] === '') process.env[key] = val;
  }
} catch {}

// Dynamically load API handlers (ESM)
async function loadHandler(path) {
  const mod = await import(path);
  return mod.default;
}

// Route: POST /api/stripe-payment
app.post('/api/stripe-payment', async (req, res) => {
  try {
    const handler = await loadHandler('./api/stripe-payment.js');
    await handler(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route: POST /api/parse-questions
app.post('/api/parse-questions', async (req, res) => {
  try {
    const handler = await loadHandler('./api/parse-questions.js');
    await handler(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route: POST /api/study-guide (existing)
app.post('/api/study-guide', async (req, res) => {
  try {
    const handler = await loadHandler('./api/study-guide.js');
    await handler(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✈️  API server running on http://localhost:${PORT}`));

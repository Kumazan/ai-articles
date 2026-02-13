#!/usr/bin/env node
/**
 * xAI/Grok Image Generation + Editing
 *
 * Usage:
 *   node image.js --prompt "..." [--model grok-imagine-image] [--aspect_ratio 1:1] [--out out.jpg]
 *   node image.js --prompt "..." --image /path/to/input.webp [--out out.jpg]
 *
 * Reads API key from:
 *   - env XAI_API_KEY
 *   - ~/.clawdbot/clawdbot.json skills.entries.xai.apiKey
 *   - workspace .secrets/xai.env (XAI_API_KEY=...)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE = 'api.x.ai';
const DEFAULT_MODEL = 'grok-imagine-image';

function loadDotEnvFile(envPath) {
  try {
    if (!fs.existsSync(envPath)) return;
    const text = fs.readFileSync(envPath, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      // strip quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch (_) {
    // ignore
  }
}

function getApiKey() {
  if (process.env.XAI_API_KEY) return process.env.XAI_API_KEY;

  // Try workspace secrets
  const workspace = process.env.WORKSPACE_DIR || '/root/.openclaw/workspace';
  loadDotEnvFile(path.join(workspace, '.secrets', 'xai.env'));
  if (process.env.XAI_API_KEY) return process.env.XAI_API_KEY;

  // Try clawdbot config
  const configPath = path.join(process.env.HOME || '', '.clawdbot', 'clawdbot.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const key = config?.skills?.entries?.xai?.apiKey;
      if (key) return key;
    } catch (_) {}
  }

  return null;
}

function parseArgs(args) {
  const out = {
    model: DEFAULT_MODEL,
    prompt: null,
    image: null,
    aspect_ratio: null,
    image_format: 'base64',
    outPath: null,
    json: false,
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--model' || a === '-m') out.model = args[++i];
    else if (a === '--prompt' || a === '-p') out.prompt = args[++i];
    else if (a === '--image' || a === '-i') out.image = args[++i];
    else if (a === '--aspect_ratio' || a === '-r') out.aspect_ratio = args[++i];
    else if (a === '--format') out.image_format = args[++i];
    else if (a === '--out' || a === '-o') out.outPath = args[++i];
    else if (a === '--json' || a === '-j') out.json = true;
    else if (!a.startsWith('-') && !out.prompt) out.prompt = a;
  }

  return out;
}

function imageToDataUri(imagePath) {
  const abs = path.resolve(imagePath);
  if (!fs.existsSync(abs)) throw new Error(`Image not found: ${abs}`);
  const buf = fs.readFileSync(abs);
  const b64 = buf.toString('base64');
  const ext = path.extname(abs).toLowerCase();
  const mime = ({
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  })[ext] || 'image/jpeg';
  return `data:${mime};base64,${b64}`;
}

function postJson(pathname, apiKey, body) {
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: API_BASE,
      path: pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        if (res.statusCode !== 200) {
          const err = new Error(`API Error (${res.statusCode})`);
          err.body = data;
          return reject(err);
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          e.raw = data;
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function extractBase64Image(resp) {
  // Try xAI docs style: response.image (base64 bytes)
  if (resp && typeof resp.image === 'string') return resp.image;
  // Try OpenAI style
  const b64 = resp?.data?.[0]?.b64_json;
  if (typeof b64 === 'string') return b64;
  return null;
}

function extractUrl(resp) {
  if (resp && typeof resp.url === 'string') return resp.url;
  const url = resp?.data?.[0]?.url;
  if (typeof url === 'string') return url;
  return null;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.prompt) {
    console.error('❌ Missing --prompt');
    process.exit(1);
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('❌ No API key found. Set XAI_API_KEY or configure secrets.');
    process.exit(1);
  }

  const isEdit = Boolean(opts.image);
  const endpoint = isEdit ? '/v1/images/edits' : '/v1/images/generations';

  const body = {
    model: opts.model,
    prompt: opts.prompt,
    image_format: opts.image_format,
  };
  if (opts.aspect_ratio) body.aspect_ratio = opts.aspect_ratio;
  if (isEdit) body.image_url = imageToDataUri(opts.image);

  const resp = await postJson(endpoint, apiKey, body);
  if (opts.json) {
    console.log(JSON.stringify(resp, null, 2));
  }

  const url = extractUrl(resp);
  const b64 = extractBase64Image(resp);

  if (opts.outPath && b64) {
    const outAbs = path.resolve(opts.outPath);
    fs.mkdirSync(path.dirname(outAbs), { recursive: true });
    fs.writeFileSync(outAbs, Buffer.from(b64, 'base64'));
    console.log(outAbs);
    if (url) console.error(`URL: ${url}`);
    return;
  }

  if (url) {
    console.log(url);
    return;
  }

  console.error('❌ No url or base64 image found in response');
  process.exit(2);
}

main().catch((e) => {
  console.error('❌ Failed:', e.message);
  if (e.body) console.error(e.body);
  process.exit(1);
});

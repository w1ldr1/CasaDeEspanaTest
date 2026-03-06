import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mjs': 'application/javascript',
};

const CACHE_PATH = join(__dirname, 'news-cache.json');
const CACHE_TTL  = 30 * 60 * 1000; // 30 minutes
const FEED_URL   = 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/espana/portada';

function extract(block, tag) {
  const m = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
  return m ? m[1].trim() : '';
}
function stripHtml(str) { return str.replace(/<[^>]+>/g, '').trim(); }

async function refreshNewsCache() {
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const title = extract(block, 'title');
    const link = extract(block, 'link') || extract(block, 'guid') || '#';
    const desc = stripHtml(extract(block, 'description'));
    const date = extract(block, 'pubDate');
    const imgUrl =
      block.match(/media:content[^>]+url="([^"]+)"/)?.[1] ||
      block.match(/media:thumbnail[^>]+url="([^"]+)"/)?.[1] ||
      null;
    if (title) items.push({ title, link, desc, date, imgUrl });
  }
  if (items.length === 0) throw new Error('Empty feed');
  const cache = { items, fetchedAt: Date.now() };
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
  console.log(`[news-cache] Refreshed — ${items.length} items`);
  return Buffer.from(JSON.stringify(cache));
}

async function serveNewsCache() {
  try {
    const raw = await readFile(CACHE_PATH);
    const { fetchedAt } = JSON.parse(raw);
    if (Date.now() - fetchedAt < CACHE_TTL) return raw; // fresh — serve as-is
    console.log('[news-cache] Stale — refreshing...');
    return await refreshNewsCache();
  } catch {
    console.log('[news-cache] Missing — fetching...');
    return await refreshNewsCache();
  }
}

const server = createServer(async (req, res) => {
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const cleanPath = urlPath.split('?')[0];

  // Special handler: auto-refresh news cache when stale
  if (cleanPath === '/news-cache.json') {
    try {
      const content = await serveNewsCache();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(content);
    } catch (err) {
      console.error('[news-cache] Refresh failed:', err.message);
      res.writeHead(502);
      res.end('News cache unavailable');
    }
    return;
  }

  const filePath = join(__dirname, cleanPath);
  try {
    const content = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (err) {
    if (err.code === 'ENOENT') {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(500);
      res.end('Server error');
    }
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

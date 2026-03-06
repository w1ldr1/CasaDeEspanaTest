// Fetches El País RSS feed and writes news-cache.json
// Runs in GitHub Actions (Node 20, no CORS restriction, no extra deps)
import { writeFile } from 'fs/promises';

const FEED_URL = 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/espana/portada';

const res = await fetch(FEED_URL);
if (!res.ok) throw new Error(`RSS fetch failed: HTTP ${res.status}`);
const xml = await res.text();

// Extract text content of a tag, handles CDATA
function extract(block, tag) {
  const m = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
  return m ? m[1].trim() : '';
}

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '').trim();
}

function getItems(xml) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];

    const title = extract(block, 'title');
    // <link> in El País RSS is often a bare text node after a self-closing tag;
    // guid reliably contains the article URL
    const link = extract(block, 'link') || extract(block, 'guid') || '#';
    const desc = stripHtml(extract(block, 'description'));
    const date = extract(block, 'pubDate');
    const imgUrl =
      block.match(/media:content[^>]+url="([^"]+)"/)?.[1] ||
      block.match(/media:thumbnail[^>]+url="([^"]+)"/)?.[1] ||
      block.match(/<enclosure[^>]+url="([^"]+)"[^>]*type="image/)?.[1] ||
      null;

    if (title) items.push({ title, link, desc, date, imgUrl });
  }
  return items;
}

const items = getItems(xml);
if (items.length === 0) throw new Error('No items parsed — aborting to preserve existing cache');

const cache = { items, fetchedAt: Date.now() };
await writeFile('news-cache.json', JSON.stringify(cache, null, 2));
console.log(`Wrote ${items.length} items to news-cache.json`);

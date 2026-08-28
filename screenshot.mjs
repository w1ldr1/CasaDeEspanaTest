import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const screenshotDir = join(__dirname, 'temporary screenshots');
if (!existsSync(screenshotDir)) {
  mkdirSync(screenshotDir, { recursive: true });
}

const existing = existsSync(screenshotDir) ? readdirSync(screenshotDir).filter(f => f.endsWith('.png')) : [];
const nums = existing.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n) && n > 0);
const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;

const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const filepath = join(screenshotDir, filename);

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/wildr/.cache/puppeteer/chrome/win64-148.0.7778.97/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await page.screenshot({ path: filepath, fullPage: false });
await browser.close();

console.log(`Screenshot saved: ${filepath}`);

// Checks events.json for how many days remain before the current event
// lineup runs dry, and signals (via $GITHUB_OUTPUT) whether a reminder
// email should go out. State is tracked in .github/events-reminder-state.json
// so each distinct "lineup end date" only triggers one email, no matter how
// many days pass while the condition holds.
import { readFile, writeFile, appendFile } from 'fs/promises';

const EVENTS_FILE = 'events.json';
const STATE_FILE = '.github/events-reminder-state.json';
const REMINDER_WINDOW_DAYS = 7;
const REPO_EVENTS_URL = 'https://github.com/w1ldr1/CasaDeEspanaTest/blob/main/events.json';

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return fallback;
  }
}

const { events = [] } = await readJson(EVENTS_FILE, { events: [] });
const state = await readJson(STATE_FILE, { lastNotifiedFor: null });

const today = new Date();
today.setUTCHours(0, 0, 0, 0);

const endOf = (ev) => new Date(`${ev.dateEnd || ev.date}T00:00:00Z`);

const upcoming = events.filter((ev) => endOf(ev) >= today);

let shouldSend = false;
let notifiedFor = state.lastNotifiedFor;
let subject = '';
let body = '';

if (upcoming.length === 0) {
  if (state.lastNotifiedFor !== 'EMPTY') {
    shouldSend = true;
    notifiedFor = 'EMPTY';
    subject = 'Casa de España — the homepage events section is empty';
    body = [
      'Every event in events.json has already passed, so the homepage "What\'s Happening This Season" section is currently showing the empty state.',
      '',
      'Add new events to events.json (and the matching JSON-LD block near the top of index.html) to bring it back.',
      '',
      REPO_EVENTS_URL,
    ].join('\n');
  }
} else {
  const latest = upcoming.reduce((max, ev) => {
    const end = endOf(ev);
    return end > max.end ? { end, ev } : max;
  }, { end: new Date(0), ev: null });

  const latestKey = latest.ev.dateEnd || latest.ev.date;
  const daysLeft = Math.round((latest.end - today) / 86400000);

  if (daysLeft <= REMINDER_WINDOW_DAYS && state.lastNotifiedFor !== latestKey) {
    shouldSend = true;
    notifiedFor = latestKey;
    subject = `Casa de España — events run out in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;
    body = [
      `The last event currently in events.json ("${latest.ev.title}") ends ${latestKey} — ${daysLeft} day${daysLeft === 1 ? '' : 's'} from now.`,
      '',
      'Add more events to events.json (and the matching JSON-LD block near the top of index.html) before the homepage events section goes empty.',
      '',
      REPO_EVENTS_URL,
    ].join('\n');
  }
}

if (shouldSend) {
  await writeFile(STATE_FILE, `${JSON.stringify({ lastNotifiedFor: notifiedFor }, null, 2)}\n`);
}

const out = process.env.GITHUB_OUTPUT;
if (out) {
  await appendFile(out, `should_send=${shouldSend}\n`);
  if (shouldSend) {
    await appendFile(out, `subject=${subject}\n`);
    await appendFile(out, `body<<EOF\n${body}\nEOF\n`);
  }
}

console.log(shouldSend ? `Reminder due: ${subject}` : 'No reminder due today.');

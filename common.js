// Logika bersama untuk popup dan background
const DEFAULT_SETTINGS = {
  enabled: true,
  interval: 30,       // menit
  target: 2100,       // ml per hari
  glass: 250,         // ml per gelas
  wake: "06:00",
  sleep: "22:00",
  theme: "auto",      // auto | light | dark
  lang: "en"          // en | id
};

// Pilihan interval yang membagi 60 menit dengan rata,
// supaya pengingat selalu jatuh di menit yang "bulat" (00, 30, dst.)
const INTERVALS = [15, 20, 30, 60];

// Waktu pengingat berikutnya yang selaras jam dinding.
// Contoh interval 30: 10:07 -> 10:30, 10:30 -> 11:00.
function nextBoundary(interval, from = new Date()) {
  const base = new Date(from.getTime() + 30 * 1000); // toleransi jika alarm terbangun sedikit lebih awal
  const next = new Date(base);
  next.setSeconds(0, 0);
  const minutes = next.getHours() * 60 + next.getMinutes();
  const target = (Math.floor(minutes / interval) + 1) * interval;
  next.setHours(0, target, 0, 0); // setHours menangani lewat tengah malam otomatis
  return next;
}

function dateKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

async function getState() {
  const { settings, log } = await chrome.storage.local.get(["settings", "log"]);
  const merged = { ...DEFAULT_SETTINGS, ...(settings || {}) };
  if (!INTERVALS.includes(Number(merged.interval))) merged.interval = 30;
  return { settings: merged, log: log || {} };
}

async function saveSettings(partial) {
  const { settings } = await getState();
  const next = { ...settings, ...partial };
  await chrome.storage.local.set({ settings: next });
  return next;
}

function totalFor(log, key = dateKey()) {
  return (log[key] || []).reduce((sum, e) => sum + e.ml, 0);
}

async function addDrink(ml) {
  const { log } = await getState();
  const key = dateKey();
  log[key] = [...(log[key] || []), { t: Date.now(), ml }];
  // simpan riwayat 60 hari terakhir saja
  const keys = Object.keys(log).sort();
  while (keys.length > 60) delete log[keys.shift()];
  await chrome.storage.local.set({ log });
  return totalFor(log, key);
}

async function undoDrink() {
  const { log } = await getState();
  const key = dateKey();
  if (log[key]?.length) log[key].pop();
  await chrome.storage.local.set({ log });
  return totalFor(log, key);
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function isActiveHours(settings, d = new Date()) {
  const now = d.getHours() * 60 + d.getMinutes();
  const wake = toMinutes(settings.wake);
  const sleep = toMinutes(settings.sleep);
  return wake <= sleep ? now >= wake && now < sleep : now >= wake || now < sleep;
}

importScripts("common.js", "i18n.js", "locales/id.js", "locales/en.js");

const ALARM = "drink-reminder";
const SNOOZE = "drink-snooze";

async function schedule() {
  const { settings } = await getState();
  await chrome.alarms.clear(ALARM);
  if (settings.enabled) {
    // Alarm sekali jalan di menit bulat berikutnya; dijadwalkan ulang tiap kali berbunyi.
    // Mencatat minum tidak memengaruhi jadwal ini.
    chrome.alarms.create(ALARM, { when: nextBoundary(settings.interval).getTime() });
  }
  updateBadge();
}

async function updateBadge() {
  const { settings, log } = await getState();
  DWI18n.setLang(settings.lang);
  const pct = Math.min(100, Math.round((totalFor(log) / settings.target) * 100));
  chrome.action.setBadgeBackgroundColor({ color: pct >= 100 ? "#4FA987" : "#5B9BD5" });
  chrome.action.setBadgeText({ text: settings.enabled ? `${pct}%` : DWI18n.t("badge.off") });
}

async function remind(force = false) {
  const { settings, log } = await getState();
  if (!force && (!settings.enabled || !isActiveHours(settings))) return;
  DWI18n.setLang(settings.lang);

  const total = totalFor(log);
  const glasses = Math.round(total / settings.glass);
  const message = total < settings.target
    ? DWI18n.t("notify.message", { glasses, total })
    : DWI18n.t("notify.done");

  chrome.notifications.create(`drink-${Date.now()}`, {
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: DWI18n.t("notify.title"),
    message,
    buttons: [
      { title: DWI18n.t("notify.drank") },
      { title: DWI18n.t("notify.snooze") }
    ],
    priority: 2,
    requireInteraction: true
  });
}

chrome.runtime.onInstalled.addListener(schedule);
chrome.runtime.onStartup.addListener(schedule);

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM) {
    await chrome.alarms.clear(SNOOZE); // hindari dua notifikasi berdekatan
    await remind();
    await schedule();
  } else if (alarm.name === SNOOZE) {
    remind();
  }
});

chrome.notifications.onButtonClicked.addListener(async (id, index) => {
  chrome.notifications.clear(id);
  if (index === 0) {
    const { settings } = await getState();
    await addDrink(settings.glass);
  } else {
    chrome.alarms.create(SNOOZE, { delayInMinutes: 10 });
  }
  updateBadge();
});

chrome.notifications.onClicked.addListener((id) => chrome.notifications.clear(id));

// Pesan dari popup
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "reschedule") schedule().then(() => sendResponse(true));
  if (msg.type === "badge") updateBadge().then(() => sendResponse(true));
  if (msg.type === "test") remind(true).then(() => sendResponse(true));
  return true;
});

// Perbarui badge saat ganti hari / data berubah
chrome.storage.onChanged.addListener(updateBadge);

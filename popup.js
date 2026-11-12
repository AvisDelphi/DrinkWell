const $ = (id) => document.getElementById(id);
const { t } = DWI18n;
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
const RING = 2 * Math.PI * 52; // keliling cincin progres

// Terapkan bahasa awal secara sinkron (pakai petunjuk localStorage),
// sebelum data pengaturan selesai dibaca.
DWI18n.applyI18n();
$("lang-label").textContent = DWI18n.getLang().toUpperCase();

/* ---------- Tema ---------- */
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light" || theme === "dark") root.dataset.theme = theme;
  else delete root.dataset.theme;
  try { localStorage.setItem("dw-theme", theme); } catch (e) {}
}

function effectiveTheme() {
  const th = document.documentElement.dataset.theme;
  return th || (darkQuery.matches ? "dark" : "light");
}

$("theme-toggle").addEventListener("click", async () => {
  const next = effectiveTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  $("s-theme").value = next;
  await saveSettings({ theme: next });
});

/* ---------- Bahasa ---------- */
function applyLanguage(lang) {
  DWI18n.setLang(lang);
  DWI18n.applyI18n();
  $("lang-label").textContent = DWI18n.getLang().toUpperCase();
  try { localStorage.setItem("dw-lang", DWI18n.getLang()); } catch (e) {}
}

$("lang-toggle").addEventListener("click", async () => {
  const { settings } = await getState();
  const lang = settings.lang === "en" ? "id" : "en";
  await saveSettings({ lang });
  render();
});

/* ---------- Navigasi tampilan ---------- */
function showView(name) {
  const settings = name === "settings";
  $("view-home").hidden = settings;
  $("view-settings").hidden = !settings;
  (settings ? $("close-settings") : $("open-settings")).focus();
}

$("open-settings").addEventListener("click", () => showView("settings"));
$("close-settings").addEventListener("click", () => showView("home"));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("view-settings").hidden) {
    e.preventDefault();
    showView("home");
  }
});

/* ---------- Tampilan utama ---------- */
async function render() {
  const { settings, log } = await getState();
  const total = totalFor(log);
  const glasses = Math.round(total / settings.glass);
  const goalGlasses = Math.max(1, Math.round(settings.target / settings.glass));
  const ratio = Math.min(1, total / settings.target);

  applyTheme(settings.theme);
  applyLanguage(settings.lang);

  $("enabled").checked = settings.enabled;
  $("glasses").textContent = glasses;
  $("goal").textContent = t("glass.of", { goal: goalGlasses });
  $("approx").textContent = t("glass.approx", { total, target: settings.target });
  $("ring").style.strokeDashoffset = RING * (1 - ratio);
  $("glass").classList.toggle("complete", ratio >= 1);
  $("glass").setAttribute("aria-label", t("glass.summary", {
    glasses, total, target: settings.target
  }));
  $("drink-ml").textContent = t("drink.amount", { glass: settings.glass });
  $("undo").disabled = total === 0;

  renderWeek(log, settings.target);
  renderNext(settings);
  fillSettings(settings);
}

function renderWeek(log, target) {
  const today = new Date();
  const todayKey = dateKey(today);
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const days = t("week.days");
  let met = 0;

  $("week").innerHTML = "";
  days.forEach((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = dateKey(d);
    const dayTotal = totalFor(log, key);
    const ratio = Math.min(1, dayTotal / target);
    if (ratio >= 1) met++;

    const li = document.createElement("li");
    if (key === todayKey) li.classList.add("today");
    if (key > todayKey) li.classList.add("future");

    const col = document.createElement("span");
    col.className = "bar-col" + (ratio >= 1 ? " met" : "");
    col.title = t("week.dot", { total: dayTotal });
    if (ratio > 0) {
      const fill = document.createElement("i");
      fill.style.height = `${Math.max(8, ratio * 100)}%`;
      col.appendChild(fill);
    }
    li.append(col, name);
    $("week").appendChild(li);
  });

  $("week-summary").textContent = t("week.summary", { met });
}

async function renderNext(settings) {
  if (!settings.enabled) {
    $("next").textContent = t("next.off");
    return;
  }
  let alarm = await chrome.alarms.get("drink-reminder");
  if (!alarm) {
    await chrome.runtime.sendMessage({ type: "reschedule" });
    alarm = await chrome.alarms.get("drink-reminder");
    if (!alarm) {
      $("next").textContent = t("next.pending");
      return;
    }
  }
  const at = new Date(alarm.scheduledTime);
  const locale = DWI18n.getLang() === "id" ? "id-ID" : "en-US";
  const time = at.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  $("next").textContent = isActiveHours(settings, at)
    ? t("next.at", { time })
    : t("next.outside", { wake: settings.wake });
}

function fillSettings(s) {
  const view = $("view-settings");
  if (view.dataset.filled) return;
  $("s-target").value = s.target;
  $("s-glass").value = s.glass;
  $("s-interval").value = String(s.interval);
  $("s-theme").value = s.theme;
  $("s-wake").value = s.wake;
  $("s-sleep").value = s.sleep;
  view.dataset.filled = "1";
}

/* ---------- Aksi ---------- */
$("drink").addEventListener("click", async () => {
  const { settings } = await getState();
  await addDrink(settings.glass); // tidak mengubah jadwal pengingat
  render();
});

$("undo").addEventListener("click", async () => {
  await undoDrink();
  render();
});

$("enabled").addEventListener("change", async (e) => {
  await saveSettings({ enabled: e.target.checked });
  await chrome.runtime.sendMessage({ type: "reschedule" });
  render();
});

/* ---------- Pengaturan: simpan otomatis ---------- */
let savedTimer;
function flashSaved() {
  const el = $("saved");
  el.textContent = t("settings.saved");
  el.classList.add("show");
  clearTimeout(savedTimer);
  savedTimer = setTimeout(() => el.classList.remove("show"), 1400);
}

async function saveField() {
  const before = (await getState()).settings;
  const next = await saveSettings({
    target: Math.min(6000, Math.max(500, Number($("s-target").value) || before.target)),
    glass: Math.min(1000, Math.max(50, Number($("s-glass").value) || before.glass)),
    interval: Number($("s-interval").value),
    theme: $("s-theme").value,
    wake: $("s-wake").value || before.wake,
    sleep: $("s-sleep").value || before.sleep
  });
  // Tampilkan nilai yang sudah dibatasi
  $("s-target").value = next.target;
  $("s-glass").value = next.glass;
  if (next.interval !== before.interval) {
    await chrome.runtime.sendMessage({ type: "reschedule" });
  }
  flashSaved();
  render();
}

["s-target", "s-glass", "s-interval", "s-theme", "s-wake", "s-sleep"].forEach((id) =>
  $(id).addEventListener("change", saveField)
);
$("s-theme").addEventListener("input", (e) => applyTheme(e.target.value));

$("test").addEventListener("click", () => chrome.runtime.sendMessage({ type: "test" }));

darkQuery.addEventListener("change", render);

render();

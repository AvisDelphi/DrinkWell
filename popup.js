const $ = (id) => document.getElementById(id);
const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

/* ---------- Tema ---------- */
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light" || theme === "dark") root.dataset.theme = theme;
  else delete root.dataset.theme;
  try { localStorage.setItem("dw-theme", theme); } catch (e) {}
}

function effectiveTheme() {
  const t = document.documentElement.dataset.theme;
  return t || (darkQuery.matches ? "dark" : "light");
}

$("theme-toggle").addEventListener("click", async () => {
  const next = effectiveTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  $("s-theme").value = next;
  await saveSettings({ theme: next });
});

/* ---------- Tampilan utama ---------- */
async function render() {
  const { settings, log } = await getState();
  const total = totalFor(log);
  const glasses = Math.round(total / settings.glass);
  const pct = Math.min(100, (total / settings.target) * 100);

  applyTheme(settings.theme);
  $("enabled").checked = settings.enabled;
  $("glasses").textContent = glasses;
  $("approx").textContent = `±${total} dari ${settings.target} ml`;
  $("water").style.height = `${pct}%`;
  $("glass").setAttribute("aria-label", `Sekitar ${glasses} gelas, kira-kira ${total} dari ${settings.target} ml hari ini`);
  $("drink-ml").textContent = `±${settings.glass} ml`;
  $("undo").disabled = total === 0;
  $("undo").style.visibility = total === 0 ? "hidden" : "visible";

  renderWeek(log, settings.target);
  renderNext(settings);
  fillSettings(settings);
}

function renderWeek(log, target) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  $("week").innerHTML = "";
  DAYS.forEach((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = dateKey(d);
    const ratio = Math.min(1, totalFor(log, key) / target);

    const li = document.createElement("li");
    if (key === dateKey(today)) li.className = "today";
    const dot = document.createElement("span");
    dot.className = "dot" + (ratio >= 1 ? " done" : "");
    dot.title = `±${totalFor(log, key)} ml`;
    if (ratio > 0 && ratio < 1) {
      const fill = document.createElement("i");
      fill.style.height = `${ratio * 100}%`;
      dot.appendChild(fill);
    }
    li.append(dot, name);
    $("week").appendChild(li);
  });
}

async function renderNext(settings) {
  if (!settings.enabled) {
    $("next").textContent = "Pengingat sedang dimatikan";
    return;
  }
  let alarm = await chrome.alarms.get("drink-reminder");
  if (!alarm) {
    await chrome.runtime.sendMessage({ type: "reschedule" });
    alarm = await chrome.alarms.get("drink-reminder");
    if (!alarm) return;
  }
  const at = new Date(alarm.scheduledTime);
  const time = at.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  $("next").textContent = isActiveHours(settings, at)
    ? `Pengingat berikutnya pukul ${time}`
    : `Di luar jam aktif, lanjut pukul ${settings.wake}`;
}

function fillSettings(s) {
  const box = document.querySelector(".settings");
  if (box.dataset.filled) return;
  $("s-target").value = s.target;
  $("s-glass").value = s.glass;
  $("s-interval").value = String(s.interval);
  $("s-theme").value = s.theme;
  $("s-wake").value = s.wake;
  $("s-sleep").value = s.sleep;
  box.dataset.filled = "1";
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

$("s-theme").addEventListener("change", (e) => applyTheme(e.target.value));

$("save").addEventListener("click", async () => {
  const before = (await getState()).settings;
  const next = await saveSettings({
    target: Math.max(500, Number($("s-target").value) || before.target),
    glass: Math.max(50, Number($("s-glass").value) || before.glass),
    interval: Number($("s-interval").value),
    theme: $("s-theme").value,
    wake: $("s-wake").value || before.wake,
    sleep: $("s-sleep").value || before.sleep
  });
  if (next.interval !== before.interval) {
    await chrome.runtime.sendMessage({ type: "reschedule" });
  }
  $("saved").hidden = false;
  setTimeout(() => ($("saved").hidden = true), 1500);
  render();
});

$("test").addEventListener("click", () => chrome.runtime.sendMessage({ type: "test" }));

darkQuery.addEventListener("change", render);

render();

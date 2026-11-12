// Loaded in <head> so the theme applies immediately without flicker.
// A quick copy is kept in the extension page's localStorage; the source of truth is chrome.storage.
(function () {
  try {
    const t = localStorage.getItem("dw-theme");
    if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
  } catch (e) {}
})();

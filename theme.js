// Dipasang di <head> agar tema langsung terpakai tanpa kedipan.
// Salinan cepat disimpan di localStorage halaman extension; sumber utamanya chrome.storage.
(function () {
  try {
    const t = localStorage.getItem("dw-theme");
    if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
  } catch (e) {}
})();

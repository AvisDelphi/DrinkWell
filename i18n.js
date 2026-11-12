// Helper bahasa bersama untuk popup dan background.
// Semua teks disimpan terpisah di locales/id.js dan locales/en.js.
(function (global) {
  const LANGS = ["en", "id"];
  const DEFAULT_LANG = "en";
  let current = DEFAULT_LANG;

  // Petunjuk awal dari localStorage supaya teks tidak berkedip saat popup dibuka.
  // Sumber utamanya tetap chrome.storage (settings.lang).
  try {
    const saved = global.localStorage.getItem("dw-lang");
    if (saved) current = normalize(saved);
  } catch (e) {}

  function normalize(lang) {
    return LANGS.includes(lang) ? lang : DEFAULT_LANG;
  }

  function dict(lang) {
    return ((global.DW_LOCALES || {})[lang]) || {};
  }

  function setLang(lang) {
    current = normalize(lang);
    if (typeof document !== "undefined") document.documentElement.lang = current;
    return current;
  }

  function getLang() {
    return current;
  }

  function nextLang() {
    return LANGS[(LANGS.indexOf(current) + 1) % LANGS.length];
  }

  // Ambil teks berdasarkan kunci, dengan fallback ke bahasa default.
  // Nilai non-string (mis. array hari) dikembalikan apa adanya.
  function t(key, vars) {
    const value = key in dict(current) ? dict(current)[key] : dict(DEFAULT_LANG)[key];
    if (value === undefined) return key;
    if (typeof value !== "string") return value;
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, name) =>
      name in vars ? String(vars[name]) : match
    );
  }

  // Terapkan kamus ke elemen ber-atribut data-i18n*.
  function applyI18n(root) {
    if (typeof document === "undefined") return;
    const scope = root || document;

    scope.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    scope.querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.title = t(el.dataset.i18nTitle);
    });
    scope.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.i18nAria));
    });

    document.documentElement.lang = current;
  }

  global.DWI18n = { LANGS, DEFAULT_LANG, t, setLang, getLang, nextLang, applyI18n };
})(typeof self !== "undefined" ? self : this);

// Shared language helper for the popup and background.
// All strings are stored separately in locales/en.js and locales/id.js.
(function (global) {
  const LANGS = ["en", "id"];
  const DEFAULT_LANG = "en";
  let current = DEFAULT_LANG;

  // Initial hint from localStorage so text doesn't flicker when the popup opens.
  // The source of truth is still chrome.storage (settings.lang).
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

  // Get a string by key, falling back to the default language.
  // Non-string values (e.g. the days array) are returned as is.
  function t(key, vars) {
    const value = key in dict(current) ? dict(current)[key] : dict(DEFAULT_LANG)[key];
    if (value === undefined) return key;
    if (typeof value !== "string") return value;
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, name) =>
      name in vars ? String(vars[name]) : match
    );
  }

  // Apply the dictionary to elements with data-i18n* attributes.
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

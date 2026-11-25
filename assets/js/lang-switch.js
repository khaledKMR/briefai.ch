// Echter Sprachwechsler + Browser-Spracherkennung fuer alle sieben
// Sprachseiten. Jede Seite ist eine eigenstaendige, uebersetzte HTML-Datei
// (siehe docs/I18N_PLAN_SWISS_MINIATURE_WORLDS.md) - dieses Skript
// navigiert deshalb zu einer echten URL, es tauscht keinen Text auf
// derselben Seite mehr aus. Deckt in dieser Phase nur die Startseite ab
// (siehe Bericht); andere Seiten verlinken weiterhin nur auf Deutsch.
const SITE_LANGS = [
  { code: "de", native: "Deutsch", path: "/" },
  { code: "en", native: "English", path: "/en/" },
  { code: "fr", native: "Français", path: "/fr/" },
  { code: "it", native: "Italiano", path: "/it/" },
  { code: "ar", native: "العربية", path: "/ar/" },
  { code: "tr", native: "Türkçe", path: "/tr/" },
  { code: "sq", native: "Shqip", path: "/sq/" },
];

const LANG_STORAGE_KEY = "briefai_lang";
const LANG_BANNER_DISMISSED_KEY = "briefai_lang_banner_dismissed";

function buildLangSwitcher() {
  const mount = document.getElementById("langSwitch");
  if (!mount) return;
  const currentLang = document.documentElement.lang || "de";
  const current = SITE_LANGS.find((l) => l.code === currentLang) || SITE_LANGS[0];

  mount.innerHTML = `
    <button class="lang-switch-btn" id="langSwitchBtn" aria-haspopup="true" aria-expanded="false">
      <span id="langSwitchLabel" class="lang-switch-label-full">${current.native}</span><span class="lang-switch-label-short">${current.code.toUpperCase()}</span><span class="chev">▾</span>
    </button>
    <div class="lang-menu" id="langMenu" role="menu"></div>`;

  const menu = mount.querySelector("#langMenu");
  SITE_LANGS.forEach((l) => {
    const btn = document.createElement("a");
    btn.className = "lang-option";
    btn.href = l.path;
    btn.setAttribute("role", "menuitemradio");
    btn.setAttribute("aria-current", String(l.code === currentLang));
    btn.innerHTML = `<span class="native">${l.native}</span><span class="code">${l.code}</span>`;
    btn.addEventListener("click", () => {
      try { localStorage.setItem(LANG_STORAGE_KEY, l.code); } catch (e) {}
    });
    menu.appendChild(btn);
  });

  const switchBtn = mount.querySelector("#langSwitchBtn");
  function closeMenu() { mount.dataset.open = "false"; switchBtn.setAttribute("aria-expanded", "false"); }
  function toggleMenu() {
    const open = mount.dataset.open === "true";
    mount.dataset.open = String(!open);
    switchBtn.setAttribute("aria-expanded", String(!open));
  }
  switchBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleMenu(); });
  document.addEventListener("click", (e) => { if (!mount.contains(e.target)) closeMenu(); });
}

// Erkennt die bevorzugte Browsersprache beim ersten Besuch und schlaegt sie
// NUR vor (dezentes, schliessbares Banner) - nie automatische Umleitung,
// nie ein Pflicht-Dialog. Erscheint hoechstens einmal: entweder der
// Besucher waehlt aktiv eine Sprache (dann steht LANG_STORAGE_KEY), oder er
// schliesst das Banner (dann steht LANG_BANNER_DISMISSED_KEY) - danach nie
// wieder.
function detectPreferredLang(supportedCodes) {
  const prefs = navigator.languages || [navigator.language || ""];
  for (const p of prefs) {
    const code = (p || "").slice(0, 2).toLowerCase();
    if (supportedCodes.includes(code)) return code;
  }
  return null;
}

function maybeShowLangBanner() {
  const currentLang = document.documentElement.lang || "de";
  let alreadyChosen = null;
  let alreadyDismissed = false;
  try {
    alreadyChosen = localStorage.getItem(LANG_STORAGE_KEY);
    alreadyDismissed = localStorage.getItem(LANG_BANNER_DISMISSED_KEY) === "true";
  } catch (e) { /* localStorage kann in privaten Fenstern fehlschlagen - dann einfach kein Banner */ return; }

  if (alreadyChosen || alreadyDismissed) return;

  const supported = SITE_LANGS.map((l) => l.code);
  const preferred = detectPreferredLang(supported);
  if (!preferred || preferred === currentLang) return;

  const target = SITE_LANGS.find((l) => l.code === preferred);
  if (!target) return;

  const bannerTextByLang = {
    de: `Diese Seite gibt es auch auf ${target.native}.`,
    en: `This page is also available in ${target.native}.`,
    fr: `Cette page est aussi disponible en ${target.native}.`,
    it: `Questa pagina è disponibile anche in ${target.native}.`,
    ar: `هذه الصفحة متوفرة أيضًا باللغة ${target.native}.`,
    tr: `Bu sayfa ${target.native} dilinde de mevcuttur.`,
    sq: `Kjo faqe është gjithashtu e disponueshme në ${target.native}.`,
  };
  const switchLabelByLang = { de: "Wechseln", en: "Switch", fr: "Changer", it: "Cambia", ar: "تبديل", tr: "Değiştir", sq: "Ndrysho" };
  const dismissLabelByLang = { de: "Nicht jetzt", en: "Not now", fr: "Pas maintenant", it: "Non ora", ar: "ليس الآن", tr: "Şimdi değil", sq: "Jo tani" };

  const banner = document.createElement("div");
  banner.className = "lang-suggest-banner";
  banner.setAttribute("role", "status");
  banner.innerHTML = `
    <span>${bannerTextByLang[currentLang] || bannerTextByLang.de}</span>
    <a href="${target.path}" class="lang-suggest-switch">${switchLabelByLang[currentLang] || switchLabelByLang.de}</a>
    <button type="button" class="lang-suggest-dismiss">${dismissLabelByLang[currentLang] || dismissLabelByLang.de}</button>
  `;
  document.body.appendChild(banner);
  banner.querySelector(".lang-suggest-dismiss").addEventListener("click", () => {
    try { localStorage.setItem(LANG_BANNER_DISMISSED_KEY, "true"); } catch (e) {}
    banner.remove();
  });
  banner.querySelector(".lang-suggest-switch").addEventListener("click", () => {
    try { localStorage.setItem(LANG_STORAGE_KEY, target.code); } catch (e) {}
  });
}

buildLangSwitcher();
maybeShowLangBanner();

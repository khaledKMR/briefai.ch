// ============================================================
// EIN Schalter fuer den Launch-Tag — eine gemeinsame Datei fuer ALLE
// sieben Sprachversionen (/ /en/ /fr/ /it/ /ar/ /tr/ /sq/), damit eine
// einzige Aenderung hier alle sieben gleichzeitig umschaltet, statt den
// Schalter sieben Mal pflegen zu muessen.
//
// Seit der Umstellung auf echte, eigenstaendige Sprachseiten (Phase A,
// siehe docs/I18N_PLAN_SWISS_MINIATURE_WORLDS.md) ist jede Seite einsprachig
// - der froehere data-de/data-en-Attributwechsel auf DERSELBEN Seite
// entfaellt dafuer. Was bleibt, ist dieser zweite, unabhaengige Schalter:
// "ist die App schon live". Jedes .play-cta-/.status-badge-Element traegt
// dafuer data-launched-text (und optional data-launched-href) in der
// SPRACHE DIESER Seite.
//
// Auf true setzen, SOBALD BriefAI in Production live ist — dann springen
// alle .play-cta-Elemente (Nav, Hero, alle drei Preis-Buttons, Footer) auf
// den echten Play-Store-Link und ihren echten Text, der Status-Badge zeigt
// "Neu auf Google Play" (bzw. die uebersetzte Entsprechung) statt "Bald",
// und das Warteliste-Formular wird entfernt. Nichts davon muss sonst
// irgendwo im Code geaendert werden.
const LAUNCHED = false;

const WAITLIST_ENDPOINT = "https://waitlist.briefai.ch/subscribe";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.briefai.app";

function wendeLaunchStatusAn() {
  // WICHTIG: Das HTML selbst steht standardmaessig schon auf "noch nicht
  // live" (href="#waitlist", Text "Jetzt vormerken" / "Bald auf Google
  // Play" bzw. die jeweilige Uebersetzung) — so bleibt jede Sprachseite
  // auch OHNE JavaScript ehrlich. Diese Funktion aendert nur etwas, wenn
  // LAUNCHED auf true steht.
  if (!LAUNCHED) return;
  document.querySelectorAll(".play-cta").forEach((el) => {
    const text = el.getAttribute("data-launched-text");
    if (text) el.textContent = text;
    el.setAttribute("href", el.getAttribute("data-launched-href") || PLAY_STORE_URL);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
  document.querySelectorAll(".status-badge").forEach((el) => {
    const text = el.getAttribute("data-launched-text");
    if (text) el.textContent = text;
  });
  const waitlistSection = document.getElementById("waitlist");
  if (waitlistSection) waitlistSection.remove();
}

wendeLaunchStatusAn();

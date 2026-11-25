# I18N-Umsetzungsplan — BriefAI Swiss Miniature Worlds

> Status: **Plan zur Prüfung, nichts davon ist gebaut oder veröffentlicht.**
> Umgesetzt wurde bisher nur eine lokale Sprachauswahl-Komponente (Demo) in
> `design-exploration/variant-b-final.html` — sie schaltet nur die Navigation,
> die Kategorie-Titel und die Kategorie-Kurzbeschreibungen um, nicht die ganze
> Website. Alles Weitere unten ist ein Vorschlag, kein Baustand.

## 1. URL-Struktur (GitHub Pages, statisch, kein Server-Routing)

Vorschlag: **Präfix-Verzeichnisse**, Deutsch bleibt ohne Präfix als Default.

```
/                     -> Deutsch (heutiger Stand, unveraendert)
/en/                  -> Englisch
/fr/                  -> Franzoesisch
/it/                  -> Italienisch
/ar/                  -> Arabisch
/tr/                  -> Tuerkisch
/sq/                  -> Albanisch
```

Begruendung: GitHub Pages kann keine Sprache serverseitig erkennen und umleiten
(kein Server-Code moeglich). Ein Default ohne Praefix bedeutet: jeder
bestehende Link (SEO, Social, Lesezeichen) bleibt gueltig. Die Alternative
(z. B. `/de/` fuer alle Sprachen gleich behandeln) wuerde jede bestehende
URL brechen - nicht noetig und nicht empfohlen.

Jede Sprachversion spiegelt den bestehenden Seitenbaum 1:1, z. B.
`/en/ratgeber/ahv-brief-verstehen.html` entspricht
`/ratgeber/ahv-brief-verstehen.html`.

## 2. hreflang + Canonical (Beispiel fuer `ratgeber/ahv-brief-verstehen.html`)

```html
<link rel="canonical" href="https://briefai.ch/ratgeber/ahv-brief-verstehen.html">
<link rel="alternate" hreflang="de"      href="https://briefai.ch/ratgeber/ahv-brief-verstehen.html">
<link rel="alternate" hreflang="en"      href="https://briefai.ch/en/ratgeber/ahv-brief-verstehen.html">
<link rel="alternate" hreflang="fr"      href="https://briefai.ch/fr/ratgeber/ahv-brief-verstehen.html">
<link rel="alternate" hreflang="it"      href="https://briefai.ch/it/ratgeber/ahv-brief-verstehen.html">
<link rel="alternate" hreflang="ar"      href="https://briefai.ch/ar/ratgeber/ahv-brief-verstehen.html">
<link rel="alternate" hreflang="tr"      href="https://briefai.ch/tr/ratgeber/ahv-brief-verstehen.html">
<link rel="alternate" hreflang="sq"      href="https://briefai.ch/sq/ratgeber/ahv-brief-verstehen.html">
<link rel="alternate" hreflang="x-default" href="https://briefai.ch/ratgeber/ahv-brief-verstehen.html">
```

Jede Sprachseite braucht ihr **eigenes** `<title>` und `<meta name="description">`
(nicht nur den Fliesstext uebersetzen) - sonst entsteht in Google Search Console
Duplicate-Content-Verwirrung trotz korrektem hreflang.

## 3. Sitemap

Ein `sitemap.xml` fuer alle Sprachen zusammen, mit `xhtml:link`-Alternates pro
URL (Standard-Schema fuer mehrsprachige Sitemaps):

```xml
<url>
  <loc>https://briefai.ch/ratgeber/ahv-brief-verstehen.html</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://briefai.ch/en/ratgeber/ahv-brief-verstehen.html"/>
  <xhtml:link rel="alternate" hreflang="fr" href="https://briefai.ch/fr/ratgeber/ahv-brief-verstehen.html"/>
  <!-- ... restliche Sprachen ... -->
</url>
```

`sitemap.ts`/die bestehende Sitemap-Logik muesste pro Basis-URL einmal diese
Alternates generieren, statt 7x dieselbe Liste von URLs ohne Verknuepfung.

## 4. RTL (Arabisch)

- `<html dir="rtl" lang="ar">` auf jeder arabischen Seite.
- **Logische statt physische Eigenschaften** verwenden, wo neu geschrieben wird:
  `margin-inline-start/-end` statt `margin-left/-right`, `text-align: start/end`
  statt `left/right`. Das ist in modernen Browsern (inkl. der auf GitHub Pages
  relevanten Zielgruppen-Browser) ausreichend unterstuetzt.
- Bestehender Code, der bereits physische Eigenschaften benutzt, braucht
  gezielte `html[dir="rtl"] ...`-Overrides statt eines kompletten Rewrites -
  kleiner, nachvollziehbarer Diff pro Datei.
- **Geprueft an Variante B selbst:** Das Grid, die Karten, der Modal-Dialog und
  der Sprachwechsler sind bereits mit `html[dir="rtl"]`-Regeln versehen und
  live mit Arabisch getestet (siehe `final-mobile-375-rtl-arabic.jpg`) - Grid
  spiegelt sich korrekt, Schliessen-Button und Pending-Pill wandern auf die
  richtige Seite, kein horizontaler Overflow (375px exakt).
- **Variante C** (nicht gewaehlt, aber zur Vollstaendigkeit): hat einen linken
  Akzentbalken (`border-left`/`::before` mit `left`), der bei RTL gespiegelt
  werden muesste. Betrifft die aktuelle Wahl (Variante B) nicht.

## 5. Spracherkennung beim ersten Besuch

```js
function detectPreferredLang(supported) {
  const prefs = navigator.languages || [navigator.language];
  for (const p of prefs) {
    const code = p.slice(0, 2).toLowerCase();
    if (supported.includes(code)) return code;
  }
  return null; // kein Treffer -> Standard (Deutsch) bleibt, keine Umleitung
}
```

- Niemals automatisch umleiten oder die URL ohne Klick wechseln.
- Nur ein dezentes, schliessbares Banner anzeigen ("Diese Seite gibt es auch auf
  Englisch - wechseln?"), **einmal**, dann nie wieder fragen.
- Manuelle Wahl in `localStorage` speichern (Schluessel z. B. `briefai_lang`,
  bereits so im Prototyp implementiert) - der Banner erscheint dann nicht mehr.
- Kein Pflicht-Dialog, kein Overlay, das die Seite blockiert.

## 6. Phasen-Empfehlung

**Phase A - risikoarm, kann relativ zuegig uebersetzt werden:**
- Navigation, Footer, Buttons, Formular-Labels, Fehlermeldungen
- Kategorie-Titel und Kurzbeschreibungen (im Prototyp bereits fuer 8/10
  Kategorien in allen 7 Sprachen entworfen, siehe Hinweis in Abschnitt 7)
- Allgemeine Marketing-Texte (Hero, Feature-Beschreibungen)
- `security.html` (rein technische Beschreibung, kein Rechtstext)

**Phase B - braucht explizite rechtliche/muttersprachliche Pruefung vor
Veroeffentlichung, bevor irgendetwas live geht:**
- `impressum.html` (Pflichtangaben - eine falsche Uebersetzung der UID-Aussage
  waere ein Rechtsrisiko, nicht nur ein Uebersetzungsfehler)
- `privacy.html` / Datenschutzerklaerung (verweist auf Anthropic Commercial
  Terms, AI-Verarbeitung, Aufbewahrungsfristen - Praezision zaehlt hier mehr
  als Fluessigkeit)
- `terms.html` / AGB
- Alle 10 `ratgeber/*.html`-Seiten, weil sie konkrete Fristen und Gesetzesstellen
  nennen (ATSG Art. 52, SchKG, DBG Art. 132 usw.) - eine Fehluebersetzung einer
  Frist ("30 Tage" falsch uebertragen) waere der genaue Fehler, den dieses
  Projekt mehrfach explizit vermeiden wollte (siehe CLAUDE.md-Lehren zu
  Preis-/Fristen-Vertrauen).
- Preistexte/Pricing-Seite (Betraege, Abo-Bedingungen)

Empfehlung: Phase A zuerst mit maschineller Uebersetzung plus einer kurzen
Stichprobenpruefung ausliefern; Phase B erst nach einer Runde mit einer
muttersprachlichen Person pro Sprache (oder einem bezahlten, aber einmaligen
Pruefauftrag - nicht abonnementbasiert) freigeben. Arabisch, Tuerkisch und
Albanisch zuerst, weil das die Sprachen des bestehenden VFR-Zielpublikums sind.

## 7. Uebersetzungsqualitaet - ehrlicher Stand

Im Prototyp wurden die **Kategorie-Kurzbeschreibungen** (nicht die ganze Seite)
fuer 8 von 10 Kategorien in DE/EN direkt vom Modell verfasst (gegen die
jeweilige `ratgeber/*.html`-Seite gegengelesen) und zusaetzlich nach FR/IT/AR/TR/SQ
uebersetzt. Diese 5 Sprachen sind **im Code selbst** mit dem Kommentar
`MASCHINELL UEBERSETZT - braucht muttersprachliche Pruefung vor
Veroeffentlichung, besonders AR/TR/SQ` markiert und sollten nicht ungeprueft
uebernommen werden. Am wenigsten Vertrauen verdienen aus Modell-Sicht die
albanischen Texte (kleinster Trainingsanteil der sieben Sprachen).

## 8. Keine neuen Kosten/Abhaengigkeiten

- Keine bezahlte Uebersetzungs-API (DeepL, Google Translate API etc.) -
  Uebersetzungen werden einmalig erstellt und als statischer Text eingecheckt,
  nicht zur Laufzeit abgerufen.
- Keine neuen JS-Frameworks oder Build-Schritte. Die Sprachauswahl-Komponente
  im Prototyp ist Vanilla-JS, genau wie der Rest der Seite.
- Vorlesefunktion nutzt ausschliesslich die kostenlose browsereigene
  `SpeechSynthesis`-API - siehe Befund zur tatsaechlichen Stimmen-Verfuegbarkeit
  im Bericht an den Gruender (auf dem Testsystem waren nur Deutsch und
  Franzoesisch tatsaechlich vorhanden; das ist geraeteabhaengig und wird in der
  UI bereits ehrlich als "nicht verfuegbar auf diesem Geraet" ausgewiesen statt
  stillschweigend zu versagen).

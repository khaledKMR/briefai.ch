# Warteliste-Worker — Freigabe- und Deploy-Schritte

Dieser Worker ist lokal fertig, aber **nicht deployed**. Nichts davon kostet
etwas, solange diese Schritte nicht ausgefuehrt sind — Cloudflare Workers
und KV haben ein kostenloses Kontingent (100 000 Requests/Tag,
1000 KV-Schreibvorgaenge/Tag), das fuer eine Warteliste bei Weitem reicht.

## 1. KV-Namespace anlegen (einmalig, im Cloudflare-Dashboard oder per CLI)

```bash
npx wrangler kv namespace create WAITLIST_KV
```

Gibt eine `id` zurueck. Diese in `wrangler.toml` eintragen (auskommentierter
Block ist schon vorbereitet).

## 2. Lokal testen, bevor irgendetwas live geht

```bash
cd waitlist-worker
npx wrangler dev
```

Startet den Worker lokal auf `localhost:8787`. Mit `curl` oder dem
Test-Formular (siehe `scripts/test-lokal.sh`) gegenpruefen.

## 3. Deployen (erst nach deiner Freigabe)

```bash
npx wrangler deploy
```

## 4. Route einrichten

Im Cloudflare-Dashboard fuer die Zone `briefai.ch`: Worker-Route
`waitlist.briefai.ch/*` → `briefai-waitlist` anlegen (Block steht
auskommentiert in `wrangler.toml`). Dafuer muss `waitlist` als DNS-Eintrag
(Proxied, kein Inhalt noetig) existieren — im DNS-Tab der Zone anlegen.

## 5. Formular auf index.html scharf schalten

In `index.html` steht die Formular-Aktion fest auf
`https://waitlist.briefai.ch/subscribe` (siehe `<script>`-Block am Ende der
Datei). Nichts weiter noetig, sobald die Route aus Schritt 4 steht.

## Was danach regelmaessig zu pruefen ist

- `npx wrangler kv key list --binding=WAITLIST_KV` zeigt alle Schluessel
  (nur lokal mit eigenem Cloudflare-Login moeglich — kein oeffentlicher
  Endpunkt dafuer, bewusst).
- Export aller Adressen zum Versand der Launch-Mail:
  `npx wrangler kv key list --binding=WAITLIST_KV --prefix="sub:"` und dann
  je Schluessel `wrangler kv key get`. Fuer mehr als eine Handvoll Adressen
  lohnt sich ein kurzes Skript statt Handarbeit — sag Bescheid, dann baue
  ich eines, sobald die Liste eine relevante Groesse hat.

## Bewusst nicht gebaut (siehe Abschlussbericht fuer Details)

- Kein automatischer Bestaetigungs-E-Mail-Versand (Double-Opt-in) — dafuer
  braeuchte es einen E-Mail-Versanddienst (z. B. Resend, Postmark), also
  einen neuen externen Dienst. Nicht ohne deine Freigabe eingebaut.
- Keine Launch-E-Mail-Automatisierung — der Versand "BriefAI ist jetzt da"
  bleibt vorerst manuell (Adressen exportieren, in Schweizer
  E-Mail-Programm oder BCC-Versand einfuegen).

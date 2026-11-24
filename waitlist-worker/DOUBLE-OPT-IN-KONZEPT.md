# Double-Opt-in für die Warteliste — Konzept (noch nicht aktiviert)

**Status: Entwurf. Kein Dienst aktiviert, kein Code aus diesem Dokument läuft.**
Dient nur als Entscheidungsgrundlage für dich — aktiviert wird erst nach deiner
ausdrücklichen Freigabe eines konkreten Anbieters.

## Warum aktuell kein Double-Opt-in läuft

Der Worker (`src/worker.js`) speichert eine Anmeldung sofort nach Absenden
(Single-Opt-in): Checkbox + Klick genügt. Ein echtes Double-Opt-in (E-Mail mit
Bestätigungslink, erst danach gespeichert) braucht zwingend einen
**E-Mail-Versanddienst** — Cloudflare Workers können selbst keine E-Mails
verschicken, nur HTTP-Aufrufe an einen externen Dienst machen.

## Warum Double-Opt-in trotzdem sinnvoll wäre

- Bestätigt, dass die E-Mail-Adresse wirklich existiert und der Person gehört
  (verhindert, dass fremde Adressen ungefragt eingetragen werden).
- Ist in der Schweiz/EU zwar nicht zwingend vorgeschrieben (Art. 6 Abs. 1 lit. a
  DSGVO verlangt "eindeutige bestätigende Handlung", die auch ein einzelner
  Klick mit Checkbox sein kann), gilt aber als Best Practice und schützt vor
  dem Vorwurf, fremde Adressen angeschrieben zu haben.

## Architektur-Vorschlag (bei Freigabe)

```
1. Formular-Absenden (wie heute)
   → Worker legt Eintrag an, aber mit status: "pending" statt "confirmed"
   → Worker ruft E-Mail-API auf: "Sende Bestätigungsmail an {email}
     mit Link https://waitlist.briefai.ch/confirm?token=XYZ"

2. Nutzer klickt Link in der Mail
   → Worker setzt status: "confirmed", sendet Bestätigungsseite

3. Pending-Eintraege ohne Bestaetigung nach 48h automatisch loeschen
   (geplanter Cron-Trigger im selben Worker, kostet nichts extra)
```

Technisch minimal: ein neuer Endpunkt `/confirm`, ein neues Feld `status` im
KV-Datensatz, ein Cron Trigger. Der bestehende Code ist bereits so aufgebaut,
dass sich das ohne grossen Umbau ergänzen liesse.

## Anbieter-Optionen für den E-Mail-Versand — Vergleich, keine Empfehlung ohne dein Go

| Anbieter | Kostenlos-Kontingent | Bemerkung |
|---|---|---|
| **Resend** | 100 Mails/Tag, 3'000/Monat gratis | Einfachste API, gute Doku, von Entwicklern für genau diesen Fall gebaut |
| **Postmark** | Kein Dauer-Gratisplan, aber günstig (~1 Rp./Mail) | Sehr zuverlässige Zustellung, Fokus auf Transaktionsmails |
| **MailChannels** (Cloudflare-Partnerschaft) | War lange gratis für Workers, Konditionen haben sich 2025 geändert — vor Nutzung aktuelle Preise direkt prüfen | Enge Cloudflare-Integration, aber Status aktuell unklar — nicht blind verlassen |
| **Eigener SMTP** (z. B. via Hostpoint, falls vorhanden) | Je nach bestehendem Hosting-Vertrag | Keine neue Kontoeröffnung nötig, falls du schon SMTP-Zugang hast |

**Alle vier brauchen ein neues Konto bei einem Drittanbieter** — genau das, was
du bisher nicht freigegeben hast. Für eine Warteliste mit voraussichtlich
niedrigem Volumen ist **Resend** der naheliegendste erste Kandidat (reines
Gratiskontingent reicht sehr wahrscheinlich aus), aber die Entscheidung liegt
bei dir.

## Was ich bis zu deiner Freigabe NICHT mache

- Kein Konto bei Resend/Postmark/sonst wem anlegen
- Keinen `/confirm`-Endpunkt im Worker live schalten
- Keine E-Mail-Adresse aus der aktuellen Warteliste anschreiben

## Nächster Schritt

Sag mir, welchen Anbieter du bevorzugst (oder ob Single-Opt-in erstmal reicht,
was rechtlich zulässig ist) — dann baue ich den `/confirm`-Endpunkt und die
Konto-Einrichtung gemeinsam mit dir durch.

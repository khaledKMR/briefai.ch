# BriefAI Voice — Anbietervergleich und Empfehlung

> Stand 25.11.2026. Alle Angaben unten mit Quelle; nichts aus dem Gedächtnis
> übernommen, wo ein Lizenztext direkt geprüft werden konnte. Noch keine
> Audiodatei aus dieser Prüfung veröffentlicht — lokal, zur Entscheidung.

## 1. VoiceStudio (bereits auf diesem Rechner installiert)

- **Hersteller/Version:** VoiceStudio 0.5.8, Open-Source-Projekt von
  debpalash (GitHub: `debpalash/VoiceStudio`, 118k Stars — ein sehr aktives,
  bekanntes Projekt, keine Nischensoftware).
- **Programm-Lizenz:** AGPL-3.0 für den Code selbst. Das Nutzen der
  Software lokal, um eigene Audiodateien zu erzeugen, löst keine
  AGPL-Pflichten aus (die greifen erst, wenn man den — ggf. veränderten —
  Code selbst weiterverbreitet oder als Dienst anbietet). Eine
  "VoiceStudio Pro"-Lizenz existiert (bezahlt, Konto nötig) — **nicht
  angelegt**, wie gewünscht, und laut eigener Dokumentation ohnehin nur für
  die Software-Nutzung, nicht für die Stimmmodelle selbst relevant.
- **Standard-Stimme (OmniVoice):** **ausdrücklich nicht-kommerziell
  (CC-BY-NC)** — das steht so direkt in VoiceStudios eigener, mitgelieferter
  Lizenzprüfdatei (`backend/config/model_licenses.json`): *"the default
  OmniVoice weights are non-commercial (CC-BY-NC)"*. Für BriefAI **nicht
  nutzbar**.
- **Alternative Engines im "Model Manager":** VoiceStudio bündelt u. a.
  dieselbe Piper-Lessac-Stimme, die wir schon kennen (gleiches Lizenzproblem,
  siehe unten), und eine mehrsprachige Kokoro-Variante — die deckt laut
  VoiceStudios eigener Prüfnotiz aber nur **Englisch und Mandarin** ab, nicht
  unsere Zielsprachen.
- **Export:** WAV/weitere Formate lokal möglich, keine Cloud-Übertragung
  nötig für die Grundfunktion.
- **Fazit:** Gutes, seriöses Programm — aber löst unser Lizenzproblem nicht.
  Es hat dieselbe Einschränkung wie die direkte Piper-Nutzung, nur in einer
  Oberfläche verpackt.

## 2. Piper (bereits lokal installiert, 60 Dateien erzeugt)

Jede der 6 verwendeten Stimmen einzeln anhand ihrer MODEL_CARD auf
huggingface.co/rhasspy/piper-voices geprüft (nicht nur die allgemeine
"MIT"-Angabe des Gesamtprojekts, die nur den Software-Code betrifft):

| Sprache | Stimme | Eigene Daten | Basis-Modell | Status |
|---|---|---|---|---|
| FR | siwis (medium) | CC-BY 4.0 | Hi-Fi TTS, CC-BY 4.0 | ✅ sauber |
| IT | paola (medium) | CC0 | Hi-Fi TTS, CC-BY 4.0 | ✅ sauber |
| DE | thorsten (high) | CC0 | Lessac — "Research Purposes Only" | ⚠️ ungeklärt |
| EN | lessac (medium) | Lessac — "Research Purposes Only" | — | ⚠️ ungeklärt |
| SQ | edon (medium) | CC0 | Lessac — "Research Purposes Only" | ⚠️ ungeklärt |
| TR | dfki (medium) | **CC-BY-NC-SA 4.0** | Lessac | ❌ problematisch |

Quelle Lessac-Einschränkung:
cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html,
Abschnitt (b): *"The User wishes to make use of the Materials for Research
Purposes only."* Für Türkisch ist zusätzlich die eigene Trainingsdatenbasis
(dfki-ot-data) direkt mit CC-BY-NC-SA lizenziert — unabhängig von der
Lessac-Frage.

**Geprüfte, aber nicht brauchbare Alternative für Deutsch:** andere
Piper-Stimmen wie `karlsson` oder `eva_k` umgehen zwar Lessac, haben aber
nur "low"/"x_low"-Qualität (16 kHz) — ein klarer Qualitätsverlust gegenüber
Thorsten (22 kHz, "high").

## 3. SILMA TTS (Arabisch)

- Modell `silma-ai/silma-tts`: **Apache-2.0**, ausdrücklich für kommerzielle
  Nutzung freigegeben, eigens für modernes Hocharabisch (Fusha/MSA) gebaut.
- Läuft bisher nur über die öffentliche, kostenlose Hugging-Space-Demo — ein
  Clip (Krankenkasse) bereits erzeugt und von dir gehört ("nicht schlecht").
  Geteiltes Gratis-GPU-Kontingent, daher langsam (ein Clip alle paar
  Stunden/Tage, abhängig von anderen Nutzern).
- Lokale Installation bewusst **nicht verfolgt** (hättest du so entschieden
  — Visual C++ Build Tools wären ein grösserer Systemeingriff gewesen).

## 4. Cloud-Anbieter — Vergleichstabelle

| Anbieter | Sprachen (DE/FR/IT/EN/AR/TR/SQ) | Stimmqualität | Kommerzielle Nutzungsrechte | Lizenzquelle | Einmalig für 70 Clips (~20'000 Zeichen) | Laufende Kosten | Technische Voraussetzung | Empfehlung |
|---|---|---|---|---|---|---|---|---|
| **Azure AI Speech** | ✅ alle 7 — **einzig geprüfter Anbieter mit echter Albanisch-Neural-Stimme** (AnilaNeural, IlirNeural) | Hoch (Neural) | Ja, Standard-Microsoft-AGB | azure.microsoft.com/pricing/details/speech | **≈ CHF 0.30–0.50** (bei ca. 16 CHF/1 Mio. Zeichen) | Keine, wenn kein Abo | Microsoft-/Azure-Konto + hinterlegte Zahlungsmethode nötig | **Empfehlung Nr. 1** |
| **Google Cloud TTS** | DE/FR/IT/EN/AR/TR bestätigt, **Albanisch nicht gefunden** | Hoch (Neural2/WaveNet) | Ja, Standard-Google-AGB | cloud.google.com/text-to-speech/pricing | ≈ CHF 0.30–0.50 | Keine, wenn kein Abo | Google-Cloud-Konto + Zahlungsmethode nötig | Lückenhaft (kein SQ) |
| **Amazon Polly** | DE/FR/IT/EN/AR/TR bestätigt, **Albanisch nicht gefunden** | Hoch (Neural) | Ja, Standard-AWS-AGB | aws.amazon.com/polly/pricing | ≈ CHF 0.30–0.50 | Keine, wenn kein Abo | AWS-Konto + Zahlungsmethode, seit Juli 2025 Plan-Wahl bei Neuanmeldung | Lückenhaft (kein SQ) |
| **OpenAI TTS** | AR/TR ja, **Albanisch nicht in der offiziellen Sprachliste**, Stimmen laut eigener Doku "optimized for English" | Mittel-hoch | Nicht ausdrücklich geprüft; Pflicht zur KI-Kennzeichnung laut Nutzungsrichtlinien | platform.openai.com/docs/guides/text-to-speech | ≈ CHF 0.30 (tts-1) | Keine, wenn kein Abo | OpenAI-Konto + Zahlungsmethode | ⚠️ **tts-1/tts-1-hd werden laut OpenAI am 6. Januar 2027 abgeschaltet** — ungeeignet für eine dauerhafte Lösung |
| **ElevenLabs** | vermutlich alle 7 (nicht einzeln für SQ bestätigt) | Sehr hoch | **Gratis-Tarif schliesst kommerzielle Nutzung aus** — jede nutzbare Stufe ist ein Abo | elevenlabs.io/pricing | ab ca. CHF 5–6/Monat (kein reiner Einmalkauf) | **Laufend**, kein Einmaltarif gefunden | Konto + Abo | Verstösst gegen "keine laufenden Kosten" |
| **Piper (lokal)** | FR/IT sauber, DE/EN/SQ ungeklärt, TR problematisch | FR/IT/DE gut, EN/SQ/TR mittel (nur 1 Stimme) | Teilweise (siehe oben) | huggingface.co/rhasspy/piper-voices | CHF 0 | CHF 0 | Bereits installiert | Für FR/IT bereits genutzt |
| **SILMA (Demo)** | nur AR | Mittel | Ja (Apache-2.0) | huggingface.co/silma-ai/silma-tts | CHF 0 | CHF 0 | Browser, geteiltes Gratis-Kontingent (langsam) | Für AR bereits im Einsatz |

## 5. Wirtschaftlichkeit — die eigentliche Rechnung

70 kurze Kategorie-Texte ≈ 20'000 Zeichen insgesamt. Bei allen drei grossen
Cloud-Anbietern liegt der Neural-Tarif bei ca. 14–16 CHF pro **1 Million**
Zeichen — für unsere Menge also **weniger als 50 Rappen, einmalig**. Das ist
kein Abo, sondern eine einmalige Pay-as-you-go-Abrechnung, die nach der
Erzeugung der 70 Dateien nicht weiterläuft (die Dateien werden ja danach
statisch auf GitHub Pages gehostet, keine Laufzeit-Anfragen mehr).

**Einzige Hürde:** Jeder dieser Anbieter verlangt ein Konto mit hinterlegter
Zahlungsmethode, um überhaupt eine einzige Anfrage zu stellen — das kann und
will ich nicht in deinem Namen einrichten.

## 6. Empfehlung

**Priorität 1 (rechtliche Sicherheit) zuerst:** Für FR/IT bleibt es bei
Piper (bereits sauber, bereits erzeugt). Für AR bleibt SILMA (sauber, schon
im Gange). Für **DE/EN/TR/SQ** rate ich **von einer weiteren Nutzung der
ungeklärten/problematischen Piper-Stimmen ab** — das Risiko steht in keinem
Verhältnis zu den Kosten einer sauberen Alternative.

**Konkreter Vorschlag:** **Azure AI Speech** für genau diese vier Sprachen
(und optional auch DE/EN/FR/IT/AR zur einheitlichen Qualität neu, falls
gewünscht) — einziger geprüfter Anbieter mit einer echten, professionell
trainierten Albanisch-Stimme, deckt alle 7 Sprachen ab, Standard-Microsoft-
Geschäftsbedingungen erlauben kommerzielle Nutzung, Gesamtkosten für alle 70
Clips unter 1 CHF, keine laufenden Kosten danach.

**Wie es weitergeht, falls du zustimmst:** Du legst (nur falls du möchtest)
selbst ein Azure-Konto mit Zahlungsmethode an und gibst mir einen
API-Schlüssel — ich lese niemals deine Zahlungsdaten, nur den Schlüssel, den
ich für die einmalige Erzeugung der Dateien verwende und danach aus dem
Code wieder entferne. Alternativ bleibt es bei der jetzigen Mischung
(Piper FR/IT + SILMA AR + eine noch zu klärende Lösung für DE/EN/TR/SQ).

Nichts davon ist bereits umgesetzt — das hier ist die Entscheidungsgrundlage.

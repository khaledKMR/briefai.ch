# BriefAI Voice — Produktionsstand (lokal, nicht veröffentlicht)

## Ordnerstruktur

- `originals/` — alle 60 WAV-Rohaufnahmen (Piper, 22kHz), für alle 10 Kategorien
  in DE/EN/FR/IT/TR/SQ. Nichts gelöscht, unabhängig vom Lizenzstatus.
- `unclear-license/` — optimierte MP3s für DE/EN/TR/SQ (40 Dateien). **Nicht in
  `assets/audio/`, damit sie nicht versehentlich ausgeliefert werden.** Grund:
  siehe Lizenztabelle unten.
- `../assets/audio/` — nur FR und IT (20 Dateien). Einzige bisher
  lizenzrechtlich bestätigt saubere Piper-Stimmen, servierfähig.

## Warum DE/EN/TR/SQ zurückgehalten wurden

Geprüft wurden nicht nur die Piper-Engine-Lizenz (MIT, gilt nur für den Code),
sondern die MODEL_CARD jeder einzelnen Stimme auf huggingface.co/rhasspy/piper-voices:

| Sprache | Stimme | Eigene Trainingsdaten | Basis-Modell | Status |
|---|---|---|---|---|
| FR | siwis (medium) | CC-BY 4.0 | Hi-Fi TTS (CC-BY 4.0) | ✅ sauber |
| IT | paola (medium) | CC0 | Hi-Fi TTS (CC-BY 4.0) | ✅ sauber |
| DE | thorsten (high) | CC0 | Lessac — "Research Purposes Only" | ⚠️ ungeklärt |
| EN | lessac (medium) | Lessac — "Research Purposes Only" direkt | — | ⚠️ ungeklärt |
| SQ | edon (medium) | CC0 | Lessac — "Research Purposes Only" | ⚠️ ungeklärt |
| TR | dfki (medium) | **CC-BY-NC-SA 4.0 (nicht-kommerziell)** | Lessac | ❌ problematisch |

Quelle für "Lessac = Research Purposes Only":
https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html
— Abschnitt (b): "The User wishes to make use of the Materials for Research
Purposes only."

Rechtlich ungeklärt heisst: Es ist nicht erwiesen, dass ein per Fine-Tuning
abgeleitetes Stimmmodell die Einschränkung der Original-Trainingsdaten erbt —
aber auch nicht erwiesen, dass es das NICHT tut. Für Türkisch ist die Lage klar:
Die dfki-Trainingsdaten selbst sind CC-BY-NC-SA, unabhängig von der
Lessac-Frage.

**Stand:** Freigabe/Ersatz für DE/EN/SQ/TR steht noch aus (siehe
`docs/BRIEFAI_VOICE_ANBIETERVERGLEICH.md`).

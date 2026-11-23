// BriefAI Warteliste — eigener Cloudflare Worker, getrennt vom App-Proxy.
//
// WAS DIESER WORKER IST
// Nimmt E-Mail-Anmeldungen fuer die "Bald auf Google Play"-Warteliste auf
// briefai.ch entgegen und speichert sie in einem eigenen KV-Namespace.
// Ruehrt den bestehenden Worker fuer die App-Analyse (briefai-proxy) nicht an
// und teilt mit ihm weder Code noch Speicher noch API-Schluessel.
//
// WAS ER BEWUSST NICHT HAT
// Keinen Lese-/Verwaltungsendpunkt. Wer die Liste sehen will, nutzt
// `wrangler kv key list` oder das Cloudflare-Dashboard mit dem eigenen
// Account-Login — nie eine oeffentliche URL. Ein Endpunkt, der Adressen
// zurueckgibt, waere ein offener Verwaltungsendpunkt genau der Art, die
// ausdruecklich verboten wurde.
//
// EINWILLIGUNG UND LOESCHUNG
// Jede Anmeldung verlangt consent=true (das Formular erzwingt das Haekchen).
// Jede erfolgreiche Anmeldung bekommt sofort einen Abmelde-Link zurueck
// (Token-basiert, keine E-Mail-Zustellung noetig, weil kein Mailversand
// eingerichtet ist — siehe Bericht). Der Abmelde-Link loescht den Eintrag
// ohne weitere Rueckfrage.
//
// WAS GESPEICHERT WIRD — UND WAS NICHT
// Gespeichert: E-Mail (klein geschrieben), Sprache der Seite, Zeitpunkt der
// Einwilligung, ein zufaelliger Abmelde-Token.
// NICHT gespeichert: IP-Adresse (nur transient fuer die Rate-Limit-Zaehlung,
// mit eigenem, kurzlebigem KV-Key, nie mit dem Anmelde-Datensatz verknuepft),
// User-Agent, Standort, irgendetwas aus dem Brieftext — diese Seite hat damit
// ohnehin nichts zu tun.

const MAX_BODY_BYTES = 2 * 1024; // eine E-Mail-Anmeldung ist winzig
const RATE_LIMIT_FENSTER_S = 3600; // 1 Stunde
const RATE_LIMIT_MAX_PRO_IP = 5; // 5 Anmeldeversuche/Stunde/IP reichen jedem echten Menschen

const ERLAUBTE_SPRACHEN = ["de", "en", "fr", "it", "ar", "tr", "sq"];

// Bewusst einfach — keine vollstaendige RFC-5322-Implementierung, die ist
// fuer ein Anmeldeformular Overkill und erzeugt nur falsche Ablehnungen.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function cors(origin) {
  const erlaubt = origin === "https://briefai.ch" ? origin : "https://briefai.ch";
  return {
    "Access-Control-Allow-Origin": erlaubt,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Vary": "Origin",
  };
}

function json(objekt, status, origin) {
  return new Response(JSON.stringify(objekt), {
    status,
    headers: { "content-type": "application/json", ...cors(origin) },
  });
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function zufallsToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, (c) =>
    ({ "+": "-", "/": "_", "=": "" }[c])
  );
}

async function rateLimitOk(env, ip) {
  const key = "rl:" + ip;
  const bisher = await env.WAITLIST_KV.get(key);
  const anzahl = bisher ? parseInt(bisher, 10) : 0;
  if (anzahl >= RATE_LIMIT_MAX_PRO_IP) return false;
  await env.WAITLIST_KV.put(key, String(anzahl + 1), {
    expirationTtl: RATE_LIMIT_FENSTER_S,
  });
  return true;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    // Abmeldung: Token-basiert, ohne dass die E-Mail nochmal eingegeben
    // werden muss. Funktioniert ohne Mailversand, weil der Link direkt nach
    // der Anmeldung im Browser gezeigt wird (siehe Formular-Antwort unten).
    if (request.method === "GET" && url.pathname === "/unsubscribe") {
      const token = url.searchParams.get("token") || "";
      if (!token) return html(abmeldeSeite(false), 400);

      const email = await env.WAITLIST_KV.get("unsub:" + token);
      if (!email) return html(abmeldeSeite(false), 404);

      await env.WAITLIST_KV.delete("sub:" + email);
      await env.WAITLIST_KV.delete("unsub:" + token);
      return html(abmeldeSeite(true), 200);
    }

    if (request.method !== "POST" || url.pathname !== "/subscribe") {
      return json({ error: "Nicht gefunden." }, 404, origin);
    }

    const laenge = Number(request.headers.get("content-length") || 0);
    if (laenge > MAX_BODY_BYTES) {
      return json({ error: "Anfrage zu gross." }, 413, origin);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unbekannt";
    if (!(await rateLimitOk(env, ip))) {
      return json(
        { error: "Zu viele Versuche. Bitte spaeter erneut versuchen." },
        429,
        origin
      );
    }

    let eingang;
    try {
      const roh = await request.text();
      if (roh.length > MAX_BODY_BYTES) {
        return json({ error: "Anfrage zu gross." }, 413, origin);
      }
      eingang = JSON.parse(roh);
    } catch {
      return json({ error: "Ungueltige Anfrage." }, 400, origin);
    }

    // Honeypot: ein verstecktes Feld, das kein Mensch ausfuellt. Bots fuellen
    // automatisiert JEDES Feld eines Formulars aus. Steht hier etwas drin,
    // wird NICHT gespeichert — aber wir antworten trotzdem mit "Erfolg", damit
    // ein Bot nicht lernt, dass das Feld geprueft wird.
    if (eingang && typeof eingang.webseite === "string" && eingang.webseite.trim() !== "") {
      return json({ ok: true }, 200, origin);
    }

    const email = typeof eingang?.email === "string" ? eingang.email.trim().toLowerCase() : "";
    const sprache = ERLAUBTE_SPRACHEN.includes(eingang?.lang) ? eingang.lang : "de";
    const consent = eingang?.consent === true;

    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      return json({ error: "Bitte eine gueltige E-Mail-Adresse angeben." }, 400, origin);
    }
    if (!consent) {
      return json(
        { error: "Die Einwilligung ist fuer die Anmeldung erforderlich." },
        400,
        origin
      );
    }

    const schluessel = "sub:" + email;
    const bestehend = await env.WAITLIST_KV.get(schluessel, { type: "json" });

    // Erneute Anmeldung derselben Adresse: vorhandenen Abmelde-Link erneut
    // zurueckgeben statt einen zweiten, verwaisten Token anzulegen.
    if (bestehend?.unsubToken) {
      return json(
        {
          ok: true,
          unsubscribeUrl: `${url.origin}/unsubscribe?token=${bestehend.unsubToken}`,
        },
        200,
        origin
      );
    }

    const unsubToken = zufallsToken();
    const datensatz = {
      email,
      lang: sprache,
      consentAt: new Date().toISOString(),
      unsubToken,
    };

    await env.WAITLIST_KV.put(schluessel, JSON.stringify(datensatz));
    await env.WAITLIST_KV.put("unsub:" + unsubToken, email);

    return json(
      { ok: true, unsubscribeUrl: `${url.origin}/unsubscribe?token=${unsubToken}` },
      200,
      origin
    );
  },
};

function abmeldeSeite(erfolg) {
  const titel = erfolg ? "Abgemeldet" : "Link ungueltig";
  const text = erfolg
    ? "Deine E-Mail-Adresse wurde aus der BriefAI-Warteliste geloescht."
    : "Dieser Abmelde-Link ist ungueltig oder wurde bereits verwendet.";
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${titel} - BriefAI</title>
<style>body{font-family:-apple-system,sans-serif;background:#0F1729;color:#fff;
display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:2rem;text-align:center}
.box{max-width:420px}h1{margin-bottom:1rem}a{color:#FF6B6B}</style></head>
<body><div class="box"><h1>${titel}</h1><p>${text}</p>
<p style="margin-top:2rem"><a href="https://briefai.ch/">Zurueck zu briefai.ch</a></p></div></body></html>`;
}

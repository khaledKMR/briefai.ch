// Warteliste-Formular, sprachunabhaengig — liest document.documentElement.lang
// und nutzt WAITLIST_I18N fuer die Melde-/Fehlertexte. Ersetzt die fruehere
// sprache === 'en' ? X : Y - Verzweigung, die nur Deutsch/Englisch kannte.
const WAITLIST_I18N = {
  de: {
    invalidEmail: "Bitte eine gültige E-Mail-Adresse angeben.",
    needConsent: "Bitte die Einwilligung bestätigen.",
    sending: "Senden…",
    success: "Danke! Wir melden uns, sobald BriefAI verfügbar ist.",
    genericError: "Etwas ist schiefgelaufen. Bitte später erneut versuchen.",
    unreachable: "Die Warteliste ist gerade nicht erreichbar. Bitte später erneut versuchen.",
  },
  en: {
    invalidEmail: "Please enter a valid email address.",
    needConsent: "Please accept to continue.",
    sending: "Sending…",
    success: "Thanks! We'll email you when BriefAI launches.",
    genericError: "Something went wrong. Please try again later.",
    unreachable: "The waitlist is currently not reachable. Please try again later.",
  },
  fr: {
    invalidEmail: "Veuillez saisir une adresse e-mail valide.",
    needConsent: "Veuillez accepter pour continuer.",
    sending: "Envoi…",
    success: "Merci ! Nous vous contacterons dès que BriefAI sera disponible.",
    genericError: "Une erreur s'est produite. Veuillez réessayer plus tard.",
    unreachable: "La liste d'attente n'est actuellement pas disponible. Veuillez réessayer plus tard.",
  },
  it: {
    invalidEmail: "Inserisci un indirizzo e-mail valido.",
    needConsent: "Conferma il consenso per continuare.",
    sending: "Invio…",
    success: "Grazie! Ti contatteremo non appena BriefAI sarà disponibile.",
    genericError: "Qualcosa è andato storto. Riprova più tardi.",
    unreachable: "La lista d'attesa non è al momento raggiungibile. Riprova più tardi.",
  },
  ar: {
    invalidEmail: "يرجى إدخال عنوان بريد إلكتروني صالح.",
    needConsent: "يرجى تأكيد الموافقة للمتابعة.",
    sending: "جارٍ الإرسال…",
    success: "شكرًا! سنتواصل معك بمجرد توفر BriefAI.",
    genericError: "حدث خطأ ما. يرجى المحاولة لاحقًا.",
    unreachable: "قائمة الانتظار غير متاحة حاليًا. يرجى المحاولة لاحقًا.",
  },
  tr: {
    invalidEmail: "Lütfen geçerli bir e-posta adresi girin.",
    needConsent: "Devam etmek için lütfen onaylayın.",
    sending: "Gönderiliyor…",
    success: "Teşekkürler! BriefAI kullanıma sunulduğunda size e-posta göndereceğiz.",
    genericError: "Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin.",
    unreachable: "Bekleme listesine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.",
  },
  sq: {
    invalidEmail: "Ju lutemi shkruani një adresë email të vlefshme.",
    needConsent: "Ju lutemi konfirmoni pëlqimin për të vazhduar.",
    sending: "Duke dërguar…",
    success: "Faleminderit! Do t'ju njoftojmë sapo BriefAI të jetë gati.",
    genericError: "Diçka shkoi keq. Ju lutemi provoni përsëri më vonë.",
    unreachable: "Lista e pritjes nuk është e arritshme për momentin. Ju lutemi provoni përsëri më vonë.",
  },
};

function waitlistText(key) {
  const lang = document.documentElement.lang || "de";
  return (WAITLIST_I18N[lang] && WAITLIST_I18N[lang][key]) || WAITLIST_I18N.de[key];
}

function initWaitlistForm() {
  const form = document.getElementById("waitlist-form");
  if (!form) return;
  if (typeof LAUNCHED !== "undefined" && LAUNCHED) {
    // Nach dem Launch braucht es kein Formular mehr - launch-toggle.js
    // entfernt die ganze Sektion bereits selbst.
    return;
  }

  const button = document.getElementById("wl-submit");
  const message = document.getElementById("wl-message");
  const emailInput = document.getElementById("wl-email");
  const consentInput = document.getElementById("wl-consent");
  const hpInput = document.getElementById("wl-hp");

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    message.className = "wl-message";
    message.textContent = "";

    const email = emailInput.value.trim();
    const lang = document.documentElement.lang || "de";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      message.className = "wl-message err";
      message.textContent = waitlistText("invalidEmail");
      emailInput.focus();
      return;
    }
    if (!consentInput.checked) {
      message.className = "wl-message err";
      message.textContent = waitlistText("needConsent");
      return;
    }

    button.disabled = true;
    const urspruenglicherText = button.textContent;
    button.textContent = waitlistText("sending");

    try {
      const antwort = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          lang,
          consent: consentInput.checked,
          webseite: hpInput.value, // Honeypot - bleibt fuer Menschen immer leer
        }),
      });
      const daten = await antwort.json().catch(() => ({}));

      if (antwort.ok && daten.ok) {
        message.className = "wl-message ok";
        message.textContent = waitlistText("success");
        form.reset();
      } else {
        message.className = "wl-message err";
        message.textContent = daten.error || waitlistText("genericError");
      }
    } catch {
      message.className = "wl-message err";
      message.textContent = waitlistText("unreachable");
    } finally {
      button.disabled = false;
      button.textContent = urspruenglicherText;
    }
  });
}

initWaitlistForm();

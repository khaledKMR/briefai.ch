// Geteilte Kategorie-Modal-Logik fuer alle sieben Sprachseiten.
// Die zehn Kategorie-Karten selbst (Titel + Kurzbeschreibung) stehen als
// echter, uebersetzter Text direkt im HTML jeder Sprachseite (gut fuer SEO
// und fuer Besucher ohne JavaScript). Dieses Skript macht sie klickbar und
// fuellt beim Oeffnen den Dialog mit der laengeren Beschreibung, einem
// fiktiven Beispiel, der Vorlesefunktion und dem passenden CTA - in der
// Sprache der aktuellen Seite (document.documentElement.lang).
//
// HERKUNFT: identische Daten wie in design-exploration/variant-b-final.html
// (dort als interaktive Demo mit Sprachumschalter auf einer Seite). Hier
// nur als reine Datenquelle fuer den Dialog wiederverwendet, nicht fuer das
// Grid selbst - das uebernimmt jede Sprachseite als eigenes, indexierbares
// HTML.
//
// UEBERSETZUNGSHINWEIS (siehe auch Bericht an den Gruender):
// - de/en sind direkt gegen die jeweilige /ratgeber/*.html-Seite verfasst
//   und damit massgeblich.
// - fr/it/ar/tr/sq sind maschinell uebersetzt, NICHT von einer
//   muttersprachlichen Person geprueft. Vor Veroeffentlichung pruefen,
//   besonders AR/TR/SQ (Albanisch am wenigsten zuverlaessig).
// - Die fiktiven Beispielbriefe existieren bewusst nur auf de/en.

const CATEGORY_I18N = {
  de: { "tag.example": "Beispiel — frei erfunden", "cta.learnMore": "Mehr erfahren", "cta.waitlist": "Zur Warteliste", "voice.unavailable": "nicht verfügbar auf diesem Gerät", "note.comingSoon": "Eine ausführliche Erklärung für diese Kategorie bereiten wir gerade vor.", "modal.close": "Schliessen" },
  en: { "tag.example": "Example — fictional", "cta.learnMore": "Learn more", "cta.waitlist": "Join the waitlist", "voice.unavailable": "not available on this device", "note.comingSoon": "We're still preparing a detailed explanation for this category.", "modal.close": "Close" },
  fr: { "tag.example": "Exemple — fictif", "cta.learnMore": "En savoir plus", "cta.waitlist": "Rejoindre la liste d'attente", "voice.unavailable": "non disponible sur cet appareil", "note.comingSoon": "Nous préparons actuellement une explication détaillée pour cette catégorie.", "modal.close": "Fermer" },
  it: { "tag.example": "Esempio — fittizio", "cta.learnMore": "Scopri di più", "cta.waitlist": "Iscriviti alla lista d'attesa", "voice.unavailable": "non disponibile su questo dispositivo", "note.comingSoon": "Stiamo preparando una spiegazione dettagliata per questa categoria.", "modal.close": "Chiudi" },
  ar: { "tag.example": "مثال — خيالي", "cta.learnMore": "اعرف المزيد", "cta.waitlist": "انضم إلى قائمة الانتظار", "voice.unavailable": "غير متوفر على هذا الجهاز", "note.comingSoon": "نحن نُعدّ حاليًا شرحًا مفصلاً لهذه الفئة.", "modal.close": "إغلاق" },
  tr: { "tag.example": "Örnek — kurgusal", "cta.learnMore": "Daha fazla bilgi", "cta.waitlist": "Bekleme listesine katıl", "voice.unavailable": "bu cihazda kullanılamıyor", "note.comingSoon": "Bu kategori için ayrıntılı bir açıklama hazırlıyoruz.", "modal.close": "Kapat" },
  sq: { "tag.example": "Shembull — fiktiv", "cta.learnMore": "Mëso më shumë", "cta.waitlist": "Bashkohu me listën e pritjes", "voice.unavailable": "nuk ofrohet në këtë pajisje", "note.comingSoon": "Jemi duke përgatitur një shpjegim të detajuar për këtë kategori.", "modal.close": "Mbyll" },
};

const SPEECH_LANGS = [
  { code: "de", native: "Deutsch" },
  { code: "en", native: "English" },
  { code: "fr", native: "Français" },
  { code: "it", native: "Italiano" },
  { code: "ar", native: "العربية" },
  { code: "tr", native: "Türkçe" },
  { code: "sq", native: "Shqip" },
];

const CATEGORIES = {
  ahv: { tier: "full", img: "/assets/images/categories/ahv-rente.webp",
    desc: {
      de: "Ein Brief der Ausgleichskasse ist entweder eine Information (z. B. ein IK-Auszug) oder eine Verfügung über Ihre Rente. Nur bei einer Verfügung läuft eine Frist von 30 Tagen, um Einsprache zu erheben.",
      en: "A letter from your compensation fund is either general information (like an account statement) or a formal decision about your pension. Only a formal decision starts a 30-day window to file an objection.",
      fr: "Un courrier de la caisse de compensation est soit une information (p. ex. un extrait de compte), soit une décision formelle concernant votre rente. Seule une décision formelle ouvre un délai de 30 jours pour faire opposition.",
      it: "Una lettera della cassa di compensazione è un'informazione (ad es. un estratto conto) oppure una decisione formale sulla vostra rendita. Solo una decisione formale avvia un termine di 30 giorni per fare opposizione.",
      ar: "رسالة من صندوق التعويضات هي إما معلومة عامة (مثل كشف حساب) أو قرار رسمي بشأن معاشك التقاعدي. فقط القرار الرسمي يبدأ مهلة 30 يومًا لتقديم اعتراض.",
      tr: "Denkleştirme kasasından gelen bir mektup ya genel bir bilgidir (örneğin hesap özeti) ya da emekliliğinizle ilgili resmi bir karardır. Sadece resmi karar, itiraz için 30 günlük süreyi başlatır.",
      sq: "Një letër nga fondi i kompensimit është ose informacion i përgjithshëm (p.sh. një ekstrakt llogarie) ose një vendim zyrtar për pensionin tuaj. Vetëm vendimi zyrtar fillon afatin prej 30 ditësh për ankesë." },
    example: { de: "Ausgleichskasse Musterkanton: Ab 01.04.2027 monatliche Altersrente von CHF 1'980.–. Einsprache innert 30 Tagen möglich.",
               en: "Compensation fund, sample canton: Starting 1 April 2027, monthly old-age pension of CHF 1,980. Objection possible within 30 days." },
    cta: "/ratgeber/ahv-brief-verstehen.html" },

  iv: { tier: "full", img: "/assets/images/categories/iv-behinderung.webp",
    desc: {
      de: "Die IV-Stelle schickt zuerst meist einen Vorbescheid — einen Entwurf, zu dem Sie Stellung nehmen können — und erst danach die endgültige Verfügung. Nur die Verfügung löst die 30-Tage-Frist für eine Einsprache aus.",
      en: "The disability insurance office usually first sends a draft decision you can respond to, and only afterward the final ruling. Only the final ruling starts the 30-day objection period.",
      fr: "L'office AI envoie généralement d'abord un préavis — un projet auquel vous pouvez réagir — puis seulement ensuite la décision définitive. Seule la décision définitive déclenche le délai d'opposition de 30 jours.",
      it: "L'ufficio AI invia di solito prima un preavviso — una bozza a cui potete rispondere — e solo dopo la decisione definitiva. Solo la decisione definitiva avvia il termine di opposizione di 30 giorni.",
      ar: "عادة ما يرسل مكتب التأمين ضد العجز أولاً إشعارًا مبدئيًا يمكنكم الرد عليه، ثم القرار النهائي لاحقًا. القرار النهائي فقط هو الذي يبدأ مهلة الاعتراض البالغة 30 يومًا.",
      tr: "Engellilik sigortası dairesi genellikle önce yanıt verebileceğiniz bir ön bildirim, ardından kesin kararı gönderir. Sadece kesin karar, 30 günlük itiraz süresini başlatır.",
      sq: "Zyra e sigurimit të aftësisë së kufizuar zakonisht dërgon fillimisht një njoftim paraprak, të cilit mund t'i përgjigjeni, dhe më pas vendimin përfundimtar. Vetëm vendimi përfundimtar fillon afatin prej 30 ditësh për ankesë." },
    example: { de: "IV-Stelle Musterkanton, Vorbescheid: Geplante IV-Rente 50%. Stellungnahme innert 30 Tagen möglich, bevor die definitive Verfügung ergeht.",
               en: "Disability office, sample canton, draft decision: Planned disability pension 50%. Response possible within 30 days before the final ruling is issued." },
    cta: "/ratgeber/iv-verfuegung-verstehen.html" },

  krankenkasse: { tier: "full", img: "/assets/images/categories/krankenkasse.webp",
    desc: {
      de: "Die Krankenkasse schickt zwei unterschiedliche Briefarten: die Prämienrechnung für Ihre Versicherung und die Leistungsabrechnung für eine konkrete Behandlung. Nur Letztere kann eine förmliche Verfügung mit 30-Tage-Frist sein.",
      en: "Your health insurer sends two very different letters: the premium invoice and the benefits statement for a specific treatment. Only the latter can be a formal ruling with a 30-day deadline.",
      fr: "Votre caisse-maladie envoie deux types de courriers très différents : la facture de prime et le décompte de prestations pour un traitement précis. Seul ce dernier peut être une décision formelle avec un délai de 30 jours.",
      it: "La cassa malati invia due tipi di lettere molto diverse: la fattura del premio e il conteggio delle prestazioni per un trattamento specifico. Solo quest'ultimo può essere una decisione formale con un termine di 30 giorni.",
      ar: "ترسل شركة التأمين الصحي نوعين مختلفين من الرسائل: فاتورة القسط وكشف حساب الخدمات لعلاج معين. فقط الأخير يمكن أن يكون قرارًا رسميًا بمهلة 30 يومًا.",
      tr: "Sağlık sigortanız iki farklı mektup gönderir: prim faturası ve belirli bir tedavi için hizmet dökümü. Sadece ikincisi, 30 günlük süreli resmi bir karar olabilir.",
      sq: "Sigurimi juaj shëndetësor dërgon dy lloje letrash krejt të ndryshme: faturën e primit dhe llogaritjen e shërbimeve për një trajtim specifik. Vetëm kjo e fundit mund të jetë një vendim zyrtar me afat 30-ditor." },
    example: { de: "Leistungsabrechnung: Rechnung Dr. Muster CHF 240.– teilweise abgelehnt. Einsprache innert 30 Tagen möglich.",
               en: "Benefits statement: Dr. Example invoice CHF 240 partially rejected. Objection possible within 30 days." },
    cta: "/ratgeber/krankenkasse-praemie-leistungsabrechnung.html" },

  steueramt: { tier: "full", img: "/assets/images/categories/steueramt.webp",
    desc: {
      de: "Eine Veranlagungsverfügung legt fest, wie viel Steuern Sie gemäss der Steuerverwaltung schulden. Sind Sie nicht einverstanden, können Sie innerhalb von 30 Tagen schriftlich Einsprache erheben.",
      en: "A tax assessment states how much tax the tax office believes you owe. If you disagree, you can file a written objection within 30 days.",
      fr: "Une décision de taxation indique le montant d'impôt que l'administration fiscale estime que vous devez. Si vous n'êtes pas d'accord, vous pouvez faire opposition par écrit dans un délai de 30 jours.",
      it: "Una decisione di tassazione stabilisce quante tasse dovete secondo l'amministrazione fiscale. Se non siete d'accordo, potete fare opposizione per iscritto entro 30 giorni.",
      ar: "يحدد قرار التقييم الضريبي المبلغ الذي تعتقد السلطة الضريبية أنكم مدينون به. إذا لم توافقوا، يمكنكم تقديم اعتراض كتابي خلال 30 يومًا.",
      tr: "Vergi tarhiyatı kararı, vergi dairesine göre ne kadar vergi borcunuz olduğunu belirtir. Katılmıyorsanız, 30 gün içinde yazılı itiraz edebilirsiniz.",
      sq: "Një vendim tatimor përcakton sa taksa, sipas administratës tatimore, i detyroheni. Nëse nuk jeni dakord, mund të bëni ankesë me shkrim brenda 30 ditësh." },
    example: { de: "Veranlagungsverfügung 2026: Steuerbetrag CHF 3'450.–. Einsprache innert 30 Tagen schriftlich bei der Steuerverwaltung.",
               en: "Tax assessment 2026: Tax amount CHF 3,450. Written objection possible within 30 days at the tax administration." },
    cta: "/ratgeber/steuerrechnung-veranlagung.html" },

  gemeinde: { tier: "full", img: "/assets/images/categories/gemeinde.webp",
    desc: {
      de: "Briefe von der Gemeinde folgen dem Verwaltungsrecht Ihres Kantons, nicht einem einzelnen Bundesgesetz. Eine einheitliche Schweizer Frist gibt es hier nicht — die geltende Frist steht auf Ihrem eigenen Brief.",
      en: "Letters from your municipality follow your canton's own administrative law, not a single federal statute. There's no uniform Swiss deadline — the deadline that applies is stated on your own letter.",
      fr: "Les courriers de votre commune suivent le droit administratif de votre canton, pas une loi fédérale unique. Il n'existe pas de délai suisse uniforme — le délai applicable figure sur votre propre courrier.",
      it: "Le lettere del vostro comune seguono il diritto amministrativo del vostro cantone, non un'unica legge federale. Non esiste un termine svizzero uniforme: il termine applicabile è indicato sulla vostra lettera.",
      ar: "تتبع رسائل بلديتكم القانون الإداري لكانتونكم، وليس قانونًا فدراليًا واحدًا. لا توجد مهلة موحدة في سويسرا — المهلة المعمول بها مذكورة في رسالتكم نفسها.",
      tr: "Belediyenizden gelen mektuplar, tek bir federal yasayı değil, kantonunuzun idare hukukunu takip eder. Tek tip bir İsviçre süresi yoktur — geçerli süre kendi mektubunuzda belirtilir.",
      sq: "Letrat nga komuna juaj ndjekin të drejtën administrative të kantonit tuaj, jo një ligj të vetëm federal. Nuk ka afat të njëtrajtshëm zviceran — afati i zbatueshëm shënohet në letrën tuaj." },
    example: { de: "Einwohnergemeinde Musterdorf, Gebührenverfügung: Abfallgrundgebühr 2026 CHF 180.–. Rechtsmittelfrist gemäss kantonalem Recht.",
               en: "Sample municipality, fee ruling: 2026 basic waste fee CHF 180. Appeal deadline per cantonal law." },
    cta: "/ratgeber/gemeindebrief-verstehen.html" },

  rav: { tier: "full", img: "/assets/images/categories/rav-arbeit.webp",
    desc: {
      de: "Das RAV schickt drei unterschiedliche Briefarten: eine Einladung zum Gespräch, eine Verfügung über Ihren Taggeld-Anspruch, oder eine Einstellungsverfügung wegen Einstelltagen. Nur die beiden Letzteren lösen eine 30-Tage-Frist aus.",
      en: "Your regional employment office sends three different kinds of letters: a meeting invitation, a ruling on your daily allowance, or a penalty-days ruling. Only the latter two start a 30-day objection period.",
      fr: "L'ORP envoie trois types de courriers différents : une convocation à un entretien, une décision sur votre droit aux indemnités, ou une décision de suspension. Seules les deux dernières déclenchent un délai d'opposition de 30 jours.",
      it: "L'URC invia tre tipi di lettere diverse: una convocazione a un colloquio, una decisione sul vostro diritto all'indennità, o una decisione di sospensione. Solo le ultime due avviano un termine di opposizione di 30 giorni.",
      ar: "يرسل مكتب التشغيل الإقليمي ثلاثة أنواع من الرسائل: دعوة لمقابلة، أو قرار بشأن حقكم في البدل اليومي، أو قرار بإيقاف مؤقت. فقط النوعان الأخيران يبدآن مهلة اعتراض مدتها 30 يومًا.",
      tr: "Bölgesel iş bulma ofisi üç farklı mektup gönderir: bir görüşme daveti, günlük ödenek hakkınıza ilişkin bir karar veya bir kesinti kararı. Sadece son ikisi 30 günlük itiraz süresini başlatır.",
      sq: "Zyra rajonale e punësimit dërgon tri lloje letrash: një ftesë për bisedë, një vendim për të drejtën tuaj për pagesë ditore, ose një vendim ndëshkimi. Vetëm dy të fundit fillojnë afatin prej 30 ditësh për ankesë." },
    example: { de: "RAV Musterstadt, Einstellungsverfügung: 5 Einstelltage wegen verspäteter Anmeldung. Einsprache innert 30 Tagen möglich.",
               en: "Sample employment office, penalty ruling: 5 penalty days for late registration. Objection possible within 30 days." },
    cta: "/ratgeber/rav-brief-einstelltage.html" },

  schule: { tier: "contentOnly", img: null,
    desc: {
      de: "Briefe der Schule reichen von Elternabend-Einladungen über Zeugnisse bis zu schulrechtlichen Entscheiden wie einer Rückstufung oder einem Schulausschluss. Das Schulwesen ist in der Schweiz kantonal geregelt — eine einheitliche Frist gibt es nicht, die geltende Frist steht auf Ihrem eigenen Brief.",
      en: "School letters range from parent-evening invitations to report cards to formal school decisions like being held back a grade or a school exclusion. Schooling in Switzerland is regulated cantonally — there's no uniform deadline, the deadline that applies is stated on your own letter.",
      fr: "Les courriers de l'école vont de l'invitation à une réunion de parents au bulletin scolaire, jusqu'aux décisions scolaires formelles comme un redoublement ou une exclusion. L'école est réglée au niveau cantonal en Suisse — il n'existe pas de délai uniforme, le délai applicable figure sur votre propre courrier.",
      it: "Le lettere della scuola vanno dagli inviti alle serate dei genitori alle pagelle, fino alle decisioni scolastiche formali come una bocciatura o un'esclusione. La scuola è regolata a livello cantonale in Svizzera — non esiste un termine uniforme, il termine applicabile è indicato sulla vostra lettera.",
      ar: "تتراوح رسائل المدرسة من دعوات اجتماعات أولياء الأمور إلى الشهادات المدرسية وصولاً إلى القرارات المدرسية الرسمية مثل الإعادة أو الفصل. يخضع التعليم في سويسرا لتنظيم كانتوني — لا توجد مهلة موحدة، والمهلة المعمول بها مذكورة في رسالتكم نفسها.",
      tr: "Okul mektupları, veli toplantısı davetiyelerinden karne notlarına, sınıf tekrarı veya okuldan uzaklaştırma gibi resmi okul kararlarına kadar uzanır. İsviçre'de okul sistemi kanton bazında düzenlenir — tek tip bir süre yoktur, geçerli süre kendi mektubunuzda belirtilir.",
      sq: "Letrat e shkollës variojnë nga ftesat për mbledhjet e prindërve te dëftesat, deri te vendimet zyrtare shkollore si mbetja në klasë ose përjashtimi. Arsimi në Zvicër rregullohet në nivel kantonal — nuk ka afat të njëtrajtshëm, afati i zbatueshëm shënohet në letrën tuaj." },
    example: { de: "Schulleitung Musterschule: Einladung zum Gespräch wegen provisorischer Rückstufung. Stellungnahme-Frist gemäss kantonalem Schulrecht.",
               en: "Sample school administration: Invitation to a meeting regarding a provisional grade repetition. Response deadline per cantonal school law." },
    cta: null },

  vermieter: { tier: "contentOnly", img: null,
    desc: {
      de: "Als Mieterin oder Mieter haben Sie das Recht, die Belege hinter einer Nebenkostenabrechnung einzusehen. Eine feste gesetzliche Frist, um die Abrechnung zu bestreiten, schreibt das Bundesrecht allerdings nicht vor.",
      en: "As a tenant, you have the right to inspect the receipts behind a utility-cost statement. Federal law doesn't set a fixed deadline for disputing the statement.",
      fr: "En tant que locataire, vous avez le droit de consulter les justificatifs d'un décompte de charges. Le droit fédéral ne fixe toutefois pas de délai précis pour le contester.",
      it: "In qualità di inquilino avete il diritto di consultare i giustificativi di un conteggio delle spese accessorie. Il diritto federale non prevede tuttavia un termine fisso per contestarlo.",
      ar: "بصفتكم مستأجرين، لكم الحق في الاطلاع على المستندات الداعمة لتسوية التكاليف الإضافية. لكن القانون الفدرالي لا يحدد مهلة ثابتة للاعتراض عليها.",
      tr: "Kiracı olarak, yan gider hesabının dayanağı olan belgeleri inceleme hakkınız vardır. Ancak federal hukuk, buna itiraz için kesin bir süre öngörmez.",
      sq: "Si qiramarrës, keni të drejtë të shikoni dëshmitë pas një llogarie të kostove shtesë. Megjithatë, e drejta federale nuk parashikon një afat fiks për ta kundërshtuar." },
    example: { de: "Nebenkostenabrechnung 2026: Nachzahlung CHF 320.–. Belegeinsicht beim Vermieter jederzeit möglich.",
               en: "Utility-cost statement 2026: Additional payment CHF 320. Receipt inspection with the landlord possible at any time." },
    cta: "/ratgeber/nebenkostenabrechnung-pruefen.html" },

  gericht: { tier: "contentOnly", img: null,
    desc: {
      de: "Schreiben im Zusammenhang mit einem Gerichtsverfahren reichen von einer Vorladung über einen Strafbefehl der Staatsanwaltschaft bis zur Zivilklage. Ein Strafbefehl kann innert 10 Tagen schriftlich bei der Staatsanwaltschaft angefochten werden — bei anderen Schreiben hängt die Frist von der Verfahrensart ab und steht im Dokument selbst.",
      en: "Letters related to legal proceedings range from a summons to a penalty order from the public prosecutor to a civil lawsuit. A penalty order can be contested in writing with the public prosecutor's office within 10 days — for other letters, the deadline depends on the type of proceeding and is stated in the document itself.",
      fr: "Les courriers liés à une procédure judiciaire vont de la convocation à une ordonnance pénale du ministère public jusqu'à l'action civile. Une ordonnance pénale peut faire l'objet d'une opposition écrite auprès du ministère public dans un délai de 10 jours — pour les autres courriers, le délai dépend du type de procédure et figure dans le document lui-même.",
      it: "Le lettere legate a un procedimento giudiziario vanno da una citazione a un decreto d'accusa del pubblico ministero fino a un'azione civile. Un decreto d'accusa può essere opposto per iscritto al pubblico ministero entro 10 giorni — per le altre lettere, il termine dipende dal tipo di procedimento ed è indicato nel documento stesso.",
      ar: "تتراوح الرسائل المتعلقة بإجراء قضائي من استدعاء إلى أمر عقوبة صادر عن النيابة العامة وصولاً إلى دعوى مدنية. يمكن الاعتراض كتابيًا على أمر العقوبة لدى النيابة العامة خلال 10 أيام — أما بالنسبة للرسائل الأخرى، فتعتمد المهلة على نوع الإجراء وتكون مذكورة في المستند نفسه.",
      tr: "Bir yargı süreciyle ilgili mektuplar, bir celpten savcılığın ceza emrine, oradan da hukuk davasına kadar uzanır. Bir ceza emrine, savcılık nezdinde 10 gün içinde yazılı olarak itiraz edilebilir — diğer mektuplarda süre, sürecin türüne bağlıdır ve belgenin kendisinde belirtilir.",
      sq: "Letrat e lidhura me një procedurë gjyqësore variojnë nga një thirrje gjyqësore te një urdhër ndëshkimi i prokurorisë, deri te një padi civile. Një urdhër ndëshkimi mund të kundërshtohet me shkrim pranë prokurorisë brenda 10 ditësh — për letrat e tjera, afati varet nga lloji i procedurës dhe shënohet në vetë dokumentin." },
    example: { de: "Staatsanwaltschaft Musterkanton, Strafbefehl: Busse CHF 300.– wegen Ordnungswidrigkeit im Strassenverkehr. Einsprache innert 10 Tagen möglich.",
               en: "Sample canton public prosecutor, penalty order: Fine CHF 300 for a traffic violation. Objection possible within 10 days." },
    cta: null },

  andere: { tier: "contentOnly", img: null,
    desc: {
      de: "Eine Mahnung kommt von einem privaten Gläubiger, nicht von einer Behörde. Sie setzt Sie rechtlich in Verzug — mit der Folge, dass ab diesem Zeitpunkt Verzugszins anfällt. Ein festes Antwort-Datum schreibt das Gesetz dafür nicht vor.",
      en: "A dunning letter comes from a private creditor, not a public authority. It legally puts you in default, meaning default interest starts accruing — but the law doesn't set a fixed date by which you must respond.",
      fr: "Un rappel provient d'un créancier privé, pas d'une autorité. Il vous met juridiquement en demeure, ce qui déclenche des intérêts moratoires — mais la loi ne fixe pas de date de réponse précise.",
      it: "Un sollecito proviene da un creditore privato, non da un'autorità. Vi mette legalmente in mora, con interessi di mora a partire da quel momento — ma la legge non fissa una data di risposta precisa.",
      ar: "رسالة التذكير بالدفع تأتي من دائن خاص وليس من جهة حكومية. وهي تضعكم قانونيًا في حالة تأخير يترتب عليها فوائد تأخير — لكن القانون لا يحدد موعدًا ثابتًا للرد.",
      tr: "Bir ödeme hatırlatması resmi bir kurumdan değil, özel bir alacaklıdan gelir. Sizi hukuken temerrüde düşürür ve gecikme faizi işlemeye başlar — ancak yasa kesin bir yanıt tarihi belirlemez.",
      sq: "Një kujtesë pagese vjen nga një kreditor privat, jo nga një autoritet. Ju vendos ligjërisht në vonesë, duke filluar interesin e vonesës — por ligji nuk përcakton një datë fikse përgjigjeje." },
    example: { de: "Mahnung Musterfirma AG: Offener Betrag CHF 95.–, zzgl. Verzugszins seit Mahndatum.",
               en: "Dunning letter, sample company: Outstanding amount CHF 95, plus default interest since the dunning date." },
    cta: "/ratgeber/mahnung-erhalten-was-tun.html" },
};

let lastFocusedCard = null;
const voicesByLang = {};

function ct(key) {
  const lang = document.documentElement.lang || "de";
  return (CATEGORY_I18N[lang] && CATEGORY_I18N[lang][key]) || CATEGORY_I18N.de[key];
}

function buildModalShell() {
  if (document.getElementById("modalBackdrop")) return;
  const wrap = document.createElement("div");
  wrap.innerHTML = `
<div class="modal-backdrop" id="modalBackdrop">
  <div class="modal-box" id="modalBox" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <button class="modal-close" id="modalClose" type="button"></button>
    <div class="modal-stage" id="modalStage"></div>
    <h3 class="modal-title" id="modalTitle"></h3>
    <p class="modal-desc" id="modalDesc"></p>
    <div class="modal-example" id="modalExample" hidden>
      <span class="tag" id="modalExampleTag"></span>
      <p id="modalExampleText"></p>
    </div>
    <p class="modal-note" id="modalNote" hidden></p>
    <div class="speak-row" id="speakRow" hidden></div>
    <a class="modal-cta" id="modalCta" href="#waitlist"></a>
  </div>
</div>`;
  document.body.appendChild(wrap.firstElementChild);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "modalBackdrop") closeModal();
  });
}

function openModal(catId, triggerEl) {
  const cat = CATEGORIES[catId];
  if (!cat) return;
  const lang = document.documentElement.lang || "de";
  lastFocusedCard = triggerEl;

  document.getElementById("modalClose").setAttribute("aria-label", ct("modal.close"));
  document.getElementById("modalClose").textContent = "✕";

  const stage = document.getElementById("modalStage");
  stage.className = "modal-stage" + (cat.img ? "" : " placeholder");
  stage.innerHTML = cat.img ? `<img src="${cat.img}" alt="">` : "";

  document.getElementById("modalTitle").textContent = triggerEl.querySelector(".cat-title")?.textContent || catId;
  document.getElementById("modalDesc").textContent = (cat.desc && (cat.desc[lang] || cat.desc.de)) || "";

  const exampleBox = document.getElementById("modalExample");
  const exampleText = cat.example ? (cat.example[lang] || cat.example.de) : null;
  if (exampleText) {
    exampleBox.hidden = false;
    document.getElementById("modalExampleTag").textContent = ct("tag.example");
    document.getElementById("modalExampleText").textContent = exampleText;
  } else {
    exampleBox.hidden = true;
  }

  const note = document.getElementById("modalNote");
  if (cat.tier === "minimal") { note.hidden = false; note.textContent = ct("note.comingSoon"); }
  else { note.hidden = true; }

  const speakRow = document.getElementById("speakRow");
  speakRow.innerHTML = "";
  speakRow.hidden = cat.tier === "minimal" || !cat.desc;
  if (!speakRow.hidden) buildSpeakRow(speakRow, cat);

  const cta = document.getElementById("modalCta");
  if (cat.cta) { cta.href = cat.cta; cta.textContent = ct("cta.learnMore"); }
  else { cta.href = "#waitlist"; cta.textContent = ct("cta.waitlist"); }

  document.getElementById("modalBackdrop").dataset.open = "true";
  document.getElementById("modalClose").focus();
  document.addEventListener("keydown", onModalKeydown);
}

function closeModal() {
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  const backdrop = document.getElementById("modalBackdrop");
  backdrop.dataset.open = "false";
  document.removeEventListener("keydown", onModalKeydown);
  if (lastFocusedCard) lastFocusedCard.focus();
}

function onModalKeydown(e) {
  if (e.key === "Escape") { closeModal(); return; }
  if (e.key === "Tab") {
    const modalBox = document.getElementById("modalBox");
    const focusables = modalBox.querySelectorAll("button, a[href]");
    const list = Array.from(focusables).filter((el) => el.offsetParent !== null);
    if (!list.length) return;
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}

function loadVoices() {
  if (typeof speechSynthesis === "undefined") return;
  const voices = speechSynthesis.getVoices();
  SPEECH_LANGS.forEach((l) => {
    const match = voices.find((v) => v.lang.toLowerCase().startsWith(l.code));
    voicesByLang[l.code] = match || null;
  });
}
loadVoices();
if (typeof speechSynthesis !== "undefined") {
  speechSynthesis.addEventListener("voiceschanged", loadVoices);
}

function buildSpeakRow(row, cat) {
  let speakingCode = null;
  const chips = {};
  SPEECH_LANGS.forEach((l) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "lang-chip";
    chip.textContent = l.native;
    chip.dataset.lang = l.code;
    const available = !!voicesByLang[l.code] && !!(cat.desc && cat.desc[l.code]);
    chip.disabled = !available;
    if (!available) chip.title = ct("voice.unavailable");
    chip.addEventListener("click", () => {
      if (speakingCode === l.code) { speechSynthesis.cancel(); return; }
      speechSynthesis.cancel();
      const text = cat.desc[l.code] || cat.desc.de;
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = voicesByLang[l.code];
      utter.lang = voicesByLang[l.code] ? voicesByLang[l.code].lang : l.code;
      utter.onstart = () => { speakingCode = l.code; Object.values(chips).forEach((c) => c.setAttribute("aria-pressed", "false")); chip.setAttribute("aria-pressed", "true"); };
      utter.onend = utter.onerror = () => { speakingCode = null; chip.setAttribute("aria-pressed", "false"); };
      speechSynthesis.speak(utter);
    });
    chips[l.code] = chip;
    row.appendChild(chip);
  });
}

function initCategorySection() {
  buildModalShell();
  document.querySelectorAll(".cat-card[data-cat]").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.cat, card));
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCategorySection);
} else {
  initCategorySection();
}

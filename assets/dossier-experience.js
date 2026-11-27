(() => {
  const langIndex = { fr: 0, en: 1, ar: 2, ary: 3 };
  const lang = () => window.moncapSiteLanguage?.() || "fr";
  const tr = (fr, en, ar, ary = ar) => [fr, en, ar, ary];
  const tx = (value) => Array.isArray(value) ? value[langIndex[lang()] ?? 0] || value[0] : window.moncapTranslate?.(value) ?? value;
  const esc = (value = "") => String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  const title = {
    cover: tr("Couverture du dossier", "Dossier cover", "غلاف الملف", "غلاف الملف"),
    cv: tr("CV", "CV", "السيرة الذاتية", "السيفي"),
    stage: tr("Demande de stage", "Internship application", "طلب تدريب", "طلب ستاج"),
    job: tr("Demande d’emploi", "Employment application", "طلب عمل", "طلب خدمة"),
    spontaneous: tr("Candidature spontanée", "Speculative application", "ترشيح تلقائي", "ترشيح تلقائي"),
    internship: tr("Demande de stage", "Internship application", "طلب تدريب", "طلب ستاج"),
    expression: tr("Expression d’intérêt", "Expression of interest", "رسالة إبداء الاهتمام", "رسالة إبداء الاهتمام"),
    lebenslauf: tr("Lebenslauf", "Lebenslauf", "السيرة الذاتية", "السيفي"),
    anschreiben: tr("Anschreiben", "Anschreiben", "رسالة التقديم", "رسالة التقديم"),
    praktikum: tr("Bewerbung um ein Praktikum", "Internship application", "طلب تدريب", "طلب ستاج"),
    initiativ: tr("Initiativbewerbung", "Unsolicited application", "ترشيح تلقائي", "ترشيح تلقائي"),
  };
  const groups = [
    { id: "maroc", flag: "🇲🇦", name: tr("CAP MAROC", "CAP MOROCCO", "CAP المغرب", "CAP المغرب"), country: tr("Maroc · Français", "Morocco · French", "المغرب · الفرنسية", "المغرب · الفرنسية"), service: "CAP MAROC — Dossier de candidature", language: "fr", role: "Assistante administrative", first: 1, titles: ["cover", "cv", "stage", "job"] },
    { id: "canada-fr", flag: "🇨🇦", name: tr("CAP CANADA · FR", "CAP CANADA · FR", "CAP كندا · فرنسي", "CAP كندا · فرنسي"), country: tr("Canada · Français", "Canada · French", "كندا · الفرنسية", "كندا · الفرنسية"), service: "CAP CANADA — Dossier de candidature en français", language: "fr", role: "Adjointe administrative", first: 5, titles: ["cover", "cv", "stage", "spontaneous"] },
    { id: "canada-en", flag: "🇨🇦", name: tr("CAP CANADA · EN", "CAP CANADA · EN", "CAP كندا · إنجليزي", "CAP كندا · إنجليزي"), country: tr("Canada · English", "Canada · English", "كندا · الإنجليزية", "كندا · الإنجليزية"), service: "CAP CANADA — Application dossier in English", language: "en", role: "Administrative Assistant", first: 9, titles: ["cover", "cv", "internship", "expression"] },
    { id: "deutschland", flag: "🇩🇪", name: tr("CAP DEUTSCHLAND", "CAP GERMANY", "CAP ألمانيا", "CAP ألمانيا"), country: tr("Allemagne · Deutsch", "Germany · German", "ألمانيا · الألمانية", "ألمانيا · الألمانية"), service: "CAP DEUTSCHLAND — Dossier Bewerbung", language: "de", role: "Büroassistentin", first: 13, titles: ["cover", "lebenslauf", "praktikum", "initiativ"] },
    { id: "europe", flag: "🇪🇺", name: tr("CAP EUROPE", "CAP EUROPE", "CAP أوروبا", "CAP أوروبا"), country: tr("Europe · English", "Europe · English", "أوروبا · الإنجليزية", "أوروبا · الإنجليزية"), service: "CAP EUROPE — Dossier de candidature", language: "en", role: "Administrative Assistant", first: 17, titles: ["cover", "cv", "internship", "spontaneous"] },
    { id: "france", flag: "🇫🇷", name: tr("CAP FRANCE", "CAP FRANCE", "CAP فرنسا", "CAP فرنسا"), country: tr("France · Français", "France · French", "فرنسا · الفرنسية", "فرنسا · الفرنسية"), service: "CAP FRANCE — Dossier de candidature", language: "fr", role: "Assistante administrative", first: 21, titles: ["cover", "cv", "stage", "spontaneous"] },
  ];
  const ui = {
    discover: tr("Découvrir le dossier", "Explore this dossier", "اكتشف الملف", "شوف الملف"),
    dossier: tr("DOSSIER", "DOSSIER", "ملف الترشيح", "ملف الترشيح"),
    order: tr("Commander ce dossier", "Request this dossier", "اطلب هذا الملف", "طلب هاد الملف"),
    documents: tr("Pages du dossier", "Dossier pages", "صفحات الملف", "صفحات الملف"),
    previous: tr("Précédent", "Previous", "السابق", "اللي قبل"),
    next: tr("Suivant", "Next", "التالي", "اللي من بعد"),
    reader: tr("Dossier de démonstration MON CAP", "MON CAP dossier preview", "معاينة ملف MON CAP", "معاينة ملف MON CAP"),
    close: tr("Fermer et revenir aux dossiers", "Close and return to dossiers", "أغلق وارجع للملفات", "سد ورجع للملفات"),
    full: tr("Plein écran", "Full screen", "ملء الشاشة", "شاشة كاملة"),
    endTitle: tr("Et si le prochain dossier était le vôtre ?", "What if the next dossier were yours?", "وماذا لو كان الملف القادم ديالك؟", "واش الملف الجاي يكون ديالك؟"),
    endBody: tr("Ne vous contentez pas de postuler. Construisez une candidature qui vous ressemble.", "Go beyond applying. Build an application that reflects who you are.", "ما تكتفيش بالتقديم. حضّر ملف ترشيح كيعبر عليك.", "ما توقفش غير عند التقديم. وجد ملف ترشيح كيشبه ليك."),
    cta: tr("Je veux mon dossier personnalisé", "I want my personalized dossier", "أريد ملف الترشيح الخاص بي", "بغيت ملف الترشيح ديالي"),
    page: tr("Page", "Page", "الصفحة", "الصفحة"),
    sampleContents: tr("Contenu de l’exemple fourni", "Contents of the supplied example", "محتوى المثال المرفق", "شنو كاين فالمثال اللي عطيتينا"),
  };
  const library = document.querySelector("#dossier-library"), viewer = document.querySelector("#dossier-viewer"), bookPage = document.querySelector("#book-page"), stage = document.querySelector("#book-stage"), progress = document.querySelector("#page-progress"), count = document.querySelector("#page-count"), prev = document.querySelector("#page-prev"), next = document.querySelector("#page-next"), finalCta = document.querySelector("#dossier-final-cta"), zoom = document.querySelector("#book-zoom"), zoomOutput = document.querySelector("#book-zoom-output");
  let active = null, index = 0, timer = 0, pointerStart = null;
  const pagesFor = (d) => d.titles.map((key, i) => ({ key, src: `assets/dossier-source-page-${String(d.first + i).padStart(2, "0")}.png` }));
  const countryName = (d) => d.id.startsWith("canada") ? "Canada" : d.id === "maroc" ? "Maroc" : d.id === "deutschland" ? "Allemagne" : d.id === "europe" ? "Europe" : "France";

  function renderLibrary() {
    library.innerHTML = groups.map(d => `<div class="folder-card-wrap"><button class="folder-card" type="button" data-open-folder="${d.id}" aria-label="${esc(tx(ui.discover))} ${esc(tx(d.name))}"><span class="folder-paper folder-paper-back"></span><span class="folder-paper folder-paper-mid"></span><span class="folder-front"><span class="folder-logo">MON CAP</span><span class="folder-flag" aria-hidden="true">${d.flag}</span><strong>${esc(tx(d.name))}</strong><small>${esc(tx(d.country))}</small><span class="folder-tab">${esc(tx(ui.dossier))}</span></span><span class="folder-title">${esc(tx(d.name))}</span><span class="folder-cta">${esc(tx(ui.discover))} <b aria-hidden="true">↗</b></span></button><div class="folder-sample-list"><strong>${esc(tx(ui.sampleContents))}</strong><ul>${d.titles.map(key => `<li>${esc(tx(title[key]))}</li>`).join("")}</ul></div><button class="button button-outline folder-order-button" type="button" data-order-dossier="${d.id}">${esc(tx(ui.order))}<span aria-hidden="true">↗</span></button></div>`).join("");
    library.querySelectorAll("[data-open-folder]").forEach(b => b.addEventListener("click", () => openDossier(b.dataset.openFolder)));
    library.querySelectorAll("[data-order-dossier]").forEach(b => b.addEventListener("click", () => { const d = groups.find(x => x.id === b.dataset.orderDossier); if (d && window.moncapOpenContact) window.moncapOpenContact(d.service, d.language, null, { country: countryName(d), goal: d.role }); }));
  }
  function update() {
    if (!active) return;
    const pages = pagesFor(active), page = pages[index];
    bookPage.innerHTML = `<img class="source-document-page" src="${page.src}" alt="${esc(tx(title[page.key]))} — ${esc(tx(active.name))}" draggable="false">`;
    count.textContent = `${tx(ui.page)} ${index + 1} / ${pages.length}`;
    progress.style.width = `${((index + 1) / pages.length) * 100}%`;
    prev.disabled = index === 0; next.disabled = index === pages.length - 1;
    document.querySelector("#page-prev span").textContent = tx(ui.previous); document.querySelector("#page-next span").textContent = tx(ui.next);
    finalCta.hidden = index !== pages.length - 1;
    bookPage.setAttribute("aria-label", `${tx(title[page.key])} · ${index + 1} / ${pages.length}`);
    bookPage.scrollTop = 0;
  }
  function goToPage(target, direction = null) {
    if (!active) return; target = Math.max(0, Math.min(pagesFor(active).length - 1, target)); if (target === index) return;
    clearTimeout(timer);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !direction) { index = target; bookPage.classList.remove("turn-next", "turn-prev"); update(); return; }
    bookPage.classList.remove("turn-next", "turn-prev"); void bookPage.offsetWidth; bookPage.classList.add(direction === "next" ? "turn-next" : "turn-prev");
    timer = setTimeout(() => { index = target; update(); bookPage.classList.remove("turn-next", "turn-prev"); }, 380);
  }
  function openDossier(id) {
    active = groups.find(d => d.id === id); if (!active) return; index = 0;
    document.querySelector("#viewer-title").textContent = tx(active.name); document.querySelector("#viewer-subtitle").textContent = `${tx(ui.documents)} · ${pagesFor(active).length}`; document.querySelector("#viewer-eyebrow").textContent = tx(ui.reader);
    library.hidden = true; viewer.hidden = false; finalCta.hidden = true; update();
    viewer.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); setTimeout(() => stage.focus({ preventScroll: true }), 120);
  }
  function closeDossier() { active = null; viewer.hidden = true; library.hidden = false; finalCta.hidden = true; document.querySelector("#dossier-experience").scrollIntoView({ behavior: "smooth", block: "start" }); }
  prev.addEventListener("click", () => goToPage(index - 1, "prev")); next.addEventListener("click", () => goToPage(index + 1, "next"));
  document.querySelector("#page-hotspot-prev").addEventListener("click", () => goToPage(index - 1, "prev")); document.querySelector("#page-hotspot-next").addEventListener("click", () => goToPage(index + 1, "next")); document.querySelector("#viewer-close").addEventListener("click", closeDossier);
  document.querySelector("#viewer-fullscreen").addEventListener("click", async () => { try { if (!document.fullscreenElement) await viewer.requestFullscreen?.(); else await document.exitFullscreen?.(); } catch { viewer.classList.toggle("fullscreen-fallback"); } });
  zoom.addEventListener("input", () => { const z = Number(zoom.value); bookPage.style.setProperty("--page-zoom", z / 100); zoomOutput.value = `${z} %`; zoomOutput.textContent = `${z} %`; });
  stage.addEventListener("pointerdown", e => { if (!e.target.closest("button,a,input,label")) pointerStart = { x: e.clientX, y: e.clientY }; });
  stage.addEventListener("pointerup", e => { if (!pointerStart) return; const dx = e.clientX - pointerStart.x, dy = e.clientY - pointerStart.y; pointerStart = null; if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? goToPage(index + 1, "next") : goToPage(index - 1, "prev"); });
  stage.addEventListener("click", e => { if (e.target.closest("button,a,input,label") || !bookPage.contains(e.target)) return; const r = bookPage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width; if (x < .22) goToPage(index - 1, "prev"); else if (x > .78) goToPage(index + 1, "next"); });
  document.addEventListener("keydown", e => { if (viewer.hidden || !active || e.target.matches("input,textarea,select,button,a")) return; if (e.key === "ArrowRight") { e.preventDefault(); goToPage(index + 1, "next"); } if (e.key === "ArrowLeft") { e.preventDefault(); goToPage(index - 1, "prev"); } if (e.key === "Home") goToPage(0); if (e.key === "End") goToPage(pagesFor(active).length - 1); if (e.key.toLowerCase() === "f") document.querySelector("#viewer-fullscreen").click(); if (e.key === "Escape" && !document.fullscreenElement) closeDossier(); });
  document.querySelector("#dossier-order-button").addEventListener("click", () => { if (active && window.moncapOpenContact) window.moncapOpenContact(active.service, active.language, null, { country: countryName(active), goal: active.role }); });
  function refreshLanguage() { if (active) { document.querySelector("#viewer-title").textContent = tx(active.name); document.querySelector("#viewer-eyebrow").textContent = tx(ui.reader); document.querySelector("#viewer-subtitle").textContent = `${tx(ui.documents)} · ${pagesFor(active).length}`; update(); } renderLibrary(); }
  const guideCopy = {
    fr: "Choisissez un dossier puis feuilletez ses pages pour découvrir concrètement les documents et la présentation de votre future candidature.",
    en: "Choose a dossier and browse its pages to see the documents and presentation your application could include.",
    ar: "اختار ملف وقلّب الصفحات باش تكتاشف الوثائق والشكل اللي يقدر يكون عليه ملف الترشيح ديالك.",
    ary: "اختار ملف وقلّب الصفحات باش تكتاشف الوثائق والشكل اللي يقدر يكون عليه ملف الترشيح ديالك."
  };
  const noticeCopy = {
    fr: "Exemples de démonstration issus du dossier fourni. Les pages sont présentées telles quelles.",
    en: "Demonstration examples from the supplied dossier. The pages are shown as provided.",
    ar: "أمثلة توضيحية من الملف اللي تزودنا به. الصفحات معروضة كما هي.",
    ary: "أمثلة توضيحية من الملف اللي تزودنا به. الصفحات معروضة كما هي."
  };
  const updateGuide = () => {
    document.querySelector("#dossier-guide-text").textContent = guideCopy[lang()] || guideCopy.fr;
    document.querySelector("#dossier-source-notice").textContent = noticeCopy[lang()] || noticeCopy.fr;
  };
  updateGuide();
  window.addEventListener("moncap:languagechange", updateGuide);
  window.addEventListener("moncap:languagechange", refreshLanguage); renderLibrary();
})();

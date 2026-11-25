const languagePicker = document.querySelector("#site-language");
const arabicLanguageMark = document.querySelector("#arabic-language-mark");
const languageColumns = { en: 0, ar: 1, ary: 2 };
let siteLanguage = "fr";

function translate(source) {
  return translations[source]?.[languageColumns[siteLanguage]] ?? source;
}

const pageText = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const node = walker.currentNode;
  const source = node.textContent.trim();
  if (translations[source] && !node.parentElement.closest("script, style, [data-no-translate]")) {
    pageText.push({ node, source, original: node.textContent });
  }
}
const pageAttributes = [];
document.querySelectorAll("[aria-label], [alt], [placeholder]").forEach((node) => {
  for (const attr of ["aria-label", "alt", "placeholder"]) {
    const source = node.getAttribute(attr);
    if (translations[source]) pageAttributes.push({ node, attr, source });
  }
});
const frenchTitle = document.title;

function setLanguage(value) {
  siteLanguage = ["fr", "en", "ar", "ary"].includes(value) ? value : "fr";
  languagePicker.value = siteLanguage;
  arabicLanguageMark.hidden = siteLanguage !== "ar";
  document.documentElement.lang = siteLanguage === "ary" ? "ary-MA" : siteLanguage;
  document.documentElement.dir = ["ar", "ary"].includes(siteLanguage) ? "rtl" : "ltr";
  document.title = translate(frenchTitle);
  pageText.forEach(({ node, source, original }) => {
    node.textContent = original.replace(source, () => translate(source));
  });
  pageAttributes.forEach(({ node, attr, source }) => node.setAttribute(attr, translate(source)));
  try { localStorage.setItem("moncap-site-language", siteLanguage); } catch {}
}

let savedLanguage;
try { savedLanguage = localStorage.getItem("moncap-site-language"); } catch {}
setLanguage(savedLanguage);
languagePicker.addEventListener("change", () => setLanguage(languagePicker.value));

const diagnosticModal = document.querySelector("#diagnostic-modal");
const diagnosticContent = document.querySelector("#diagnostic-content");
const diagnosticResult = document.querySelector("#diagnostic-result");
const diagnosticTitle = document.querySelector("#diagnostic-modal-title");
const diagnosticOptions = document.querySelector("#diagnostic-options");
const nextButton = document.querySelector("#diagnostic-next");
const progress = document.querySelector("#diagnostic-progress");
const stepLabel = document.querySelector("#diagnostic-step");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const contactAssessmentNote = document.querySelector("#contact-assessment-note");
const assessmentSummaryField = contactForm.elements.assessmentSummary;

document.querySelector("#year").textContent = new Date().getFullYear();

const questions = [
  { title: "Où en êtes-vous dans votre recherche ?", options: ["Je prépare mon premier CV", "Je cherche un emploi ou un stage", "Je prépare une reconversion", "J’ai déjà un CV à améliorer"] },
  { title: "Qu’aimeriez-vous faire en priorité ?", options: ["Créer un CV à partir de zéro", "Mieux présenter mes expériences", "Adapter mon CV à un poste précis", "Je ne suis pas encore sûr(e)"] },
  { title: "Avez-vous une offre ou un métier en tête ?", options: ["Oui, j’ai une offre précise", "Oui, je connais le métier visé", "Pas encore, je cherche mon objectif"] }
];
let diagnosticStep = 0;
let diagnosticAnswers = [];
let selectedOption = "";
let selectedService = "";

function renderQuestion() {
  const question = questions[diagnosticStep];
  diagnosticTitle.textContent = translate(question.title);
  stepLabel.textContent = translate("Question {n} sur 3").replace("{n}", diagnosticStep + 1);
  if (siteLanguage === "fr") stepLabel.textContent = `Question ${diagnosticStep + 1} sur ${questions.length}`;
  progress.style.width = `${((diagnosticStep + 1) / questions.length) * 100}%`;
  nextButton.disabled = true;
  selectedOption = "";
  diagnosticOptions.replaceChildren();
  question.options.forEach((label) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "diagnostic-option";
    option.setAttribute("aria-pressed", "false");
    const dot = document.createElement("span");
    dot.className = "radio-dot";
    const text = document.createElement("span");
    text.textContent = translate(label);
    option.append(dot, text);
    option.addEventListener("click", () => {
      diagnosticOptions.querySelectorAll(".diagnostic-option").forEach((item) => item.setAttribute("aria-pressed", "false"));
      option.setAttribute("aria-pressed", "true");
      selectedOption = label;
      nextButton.disabled = false;
    });
    diagnosticOptions.append(option);
  });
  nextButton.textContent = translate(diagnosticStep === questions.length - 1 ? "Voir ma piste" : "Continuer");
}

function recommendService() {
  const answers = diagnosticAnswers.join(" ").toLowerCase();
  if (answers.includes("offre précise") || answers.includes("poste précis") || answers.includes("métier visé")) {
    return { service: "CV Ciblé", copy: "Vous avez déjà une offre ou un métier en tête. Le CV Ciblé peut vous aider à relier les compétences de votre parcours aux besoins de cet objectif." };
  }
  if (answers.includes("premier cv") || answers.includes("zéro")) {
    return { service: "CV Starter", copy: "Vous souhaitez partir de zéro. Le CV Starter peut vous aider à organiser votre formation, vos projets et les compétences qui correspondent à votre situation." };
  }
  return { service: "CV Plus", copy: "Vous avez un CV ou un parcours à clarifier. Le CV Plus peut vous aider à mieux organiser les informations et à mettre en valeur vos atouts." };
}

function openDiagnostic() {
  diagnosticStep = 0;
  diagnosticAnswers = [];
  diagnosticContent.hidden = false;
  diagnosticResult.hidden = true;
  renderQuestion();
  diagnosticModal.showModal();
}

document.querySelectorAll("[data-open-diagnostic]").forEach((button) => button.addEventListener("click", openDiagnostic));
nextButton.addEventListener("click", () => {
  if (!selectedOption) return;
  diagnosticAnswers[diagnosticStep] = selectedOption;
  if (diagnosticStep < questions.length - 1) {
    diagnosticStep += 1;
    renderQuestion();
    return;
  }
  const recommendation = recommendService();
  selectedService = recommendation.service;
  document.querySelector("#result-title").textContent = `${translate("Votre piste")} : ${translate(recommendation.service)}`;
  document.querySelector("#result-copy").textContent = translate(recommendation.copy);
  diagnosticContent.hidden = true;
  diagnosticResult.hidden = false;
});
document.querySelector("#restart-diagnostic").addEventListener("click", () => {
  diagnosticStep = 0;
  diagnosticAnswers = [];
  diagnosticResult.hidden = true;
  diagnosticContent.hidden = false;
  renderQuestion();
});
document.querySelector("#result-contact").addEventListener("click", () => {
  diagnosticModal.close();
  openContact(selectedService);
});

const cvLanguage = contactForm.elements.cvLanguage;
const otherLanguage = contactForm.elements.otherLanguage;
const otherLanguageLabel = document.querySelector("#other-cv-language");

function updateOtherLanguage() {
  const isOther = cvLanguage.value === "other";
  otherLanguageLabel.hidden = !isOther;
  otherLanguage.disabled = !isOther;
  otherLanguage.required = isOther;
}
cvLanguage.addEventListener("change", updateOtherLanguage);
otherLanguage.addEventListener("input", () => otherLanguage.setCustomValidity(""));

const whatsappNumber = "212723701697";

function openWhatsApp(message) {
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const popup = window.open(url, "_blank");
  if (popup) popup.opener = null;
  else window.location.assign(url);
}

function openContact(service = "", language = "", assessment = null) {
  selectedService = service || "";
  const serviceField = contactForm.elements.service;
  const formService = service || "Je ne sais pas encore";
  if ([...serviceField.options].some((option) => option.value === formService)) serviceField.value = formService;
  cvLanguage.value = language || "";
  otherLanguage.setCustomValidity("");
  updateOtherLanguage();
  assessmentSummaryField.value = assessment
    ? `Score : ${assessment.score} % | ${assessment.result} | Pack recommandé : ${assessment.pack}`
    : "";
  contactAssessmentNote.hidden = !assessment;
  if (assessment) {
    contactAssessmentNote.textContent = translate("Votre résultat Bewerbung Ready sera ajouté : {score} % — pack recommandé : {pack}.")
      .replace("{score}", assessment.score)
      .replace("{pack}", translate(assessment.pack));
  }
  document.querySelector("#contact").scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => contactForm.elements.name.focus({ preventScroll: true }), 250);
}

document.querySelectorAll("[data-open-contact]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openContact(button.dataset.openContact || "", button.dataset.cvLanguage || "");
  });
});
document.querySelectorAll("[data-select-profile]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-select-profile]").forEach((card) => card.classList.remove("selected"));
    button.classList.add("selected");
    const profile = button.dataset.selectProfile;
    openContact(profile === "Premier CV" ? "CV Starter" : profile === "CV existant" ? "CV Plus" : "");
  });
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const requestedLanguage = cvLanguage.value === "other"
    ? otherLanguage.value.trim()
    : new Intl.DisplayNames(["fr"], { type: "language" }).of(cvLanguage.value);
  if (!requestedLanguage) {
    otherLanguage.setCustomValidity(translate("Précisez la langue du CV"));
    otherLanguage.reportValidity();
    return;
  }
  const country = data.get("country").trim();
  const message = [
    "Bonjour MON CAP, voici le résumé de ma demande :",
    `Service : ${data.get("service")}`,
    `Prénom : ${data.get("name")}`,
    `Contact : ${data.get("contact")}`,
    `Langue du document : ${requestedLanguage}`,
    ...(country ? [`Pays visé : ${country}`] : []),
    `Objectif : ${data.get("goal")}`,
    ...(assessmentSummaryField.value ? [`Auto-évaluation : ${assessmentSummaryField.value}`] : [])
  ].join("\n");
  formStatus.textContent = translate("Un brouillon s’ouvre dans WhatsApp. Vérifiez le résumé puis appuyez sur Envoyer.");
  formStatus.classList.add("show");
  openWhatsApp(message);
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", translate(isOpen ? "Ouvrir le menu" : "Fermer le menu"));
  nav.classList.toggle("open", !isOpen);
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", translate("Ouvrir le menu"));
}));

document.addEventListener("click", (event) => {
  if (event.target.matches("dialog.modal")) event.target.close();
});

const bewerbungModal = document.querySelector("#bewerbung-modal");
const bewerbungQuizView = document.querySelector("#bewerbung-quiz-view");
const bewerbungResultView = document.querySelector("#bewerbung-result");
const bewerbungQuestionCount = document.querySelector("#bewerbung-question-count");
const bewerbungProgressPercent = document.querySelector("#bewerbung-progress-percent");
const bewerbungProgressBar = document.querySelector("#bewerbung-progress-bar");
const bewerbungQuestionTitle = document.querySelector("#bewerbung-question-title");
const bewerbungAnswers = document.querySelector("#bewerbung-answers");
const bewerbungBack = document.querySelector("#bewerbung-back");
const bewerbungNext = document.querySelector("#bewerbung-next");
const bewerbungScoreRing = document.querySelector("#bewerbung-score-ring");
const bewerbungScore = document.querySelector("#bewerbung-score");
const bewerbungScoreBand = document.querySelector("#bewerbung-score-band");
const bewerbungResultLevel = document.querySelector("#bewerbung-result-level");
const bewerbungResultIntro = document.querySelector("#bewerbung-result-intro");
const bewerbungStrengths = document.querySelector("#bewerbung-strengths");
const bewerbungMissing = document.querySelector("#bewerbung-missing");
const bewerbungChecks = document.querySelector("#bewerbung-checks");
const bewerbungRecommendationList = document.querySelector("#bewerbung-recommendation-list");
const bewerbungPackName = document.querySelector("#bewerbung-pack-name");
const bewerbungPackReason = document.querySelector("#bewerbung-pack-reason");
const bewerbungPackButton = document.querySelector("#bewerbung-pack-button");
const bewerbungShareConsent = document.querySelector("#bewerbung-share-consent");
const bewerbungShareButton = document.querySelector("#bewerbung-share-results");
let bewerbungStep = 0;
let bewerbungResponses = [];
let bewerbungRecommendedService = "CAP Deutschland — Dossier Bewerbung";
let bewerbungLastScore = 0;
let bewerbungLastLevel = "";

const bewerbungQuestions = [
  "Disposez-vous d’un CV en allemand ?",
  "Votre CV est-il adapté au poste ou à la formation visée ?",
  "Disposez-vous du niveau de langue demandé ?",
  "Vos diplômes et pièces justificatives sont-ils disponibles ?",
  "Avez-vous un Anschreiben personnalisé ?",
  "Êtes-vous capable de présenter votre parcours en allemand ?",
  "Avez-vous vérifié les exigences de l’offre ciblée ?"
];

const bewerbungAdvice = [
  [
    "Préparez un CV en allemand, clair et fidèle à votre parcours.",
    "Vérifiez que votre CV est bien rédigé en allemand et que ses dates et informations sont cohérentes."
  ],
  [
    "Adaptez le CV aux missions et compétences clés de l’offre ou de la formation visée.",
    "Relisez le CV avec l’offre à côté pour confirmer que les compétences pertinentes ressortent."
  ],
  [
    "Comparez votre niveau actuel au niveau exigé et préparez le justificatif demandé.",
    "Vérifiez le niveau de langue demandé, le justificatif accepté et son éventuelle date de validité."
  ],
  [
    "Rassemblez les diplômes et justificatifs mentionnés dans l’offre, puis vérifiez les traductions nécessaires.",
    "Vérifiez les pièces exigées et si des traductions certifiées ou des copies spécifiques sont requises."
  ],
  [
    "Préparez un Anschreiben personnalisé qui explique votre motivation et votre adéquation avec cette opportunité.",
    "Confirmez que l’Anschreiben est adressé à cette offre et explique clairement votre motivation."
  ],
  [
    "Entraînez une présentation brève de votre parcours, de vos compétences et de votre motivation en allemand.",
    "Préparez-vous à décrire votre parcours et vos objectifs en allemand, à l’oral."
  ],
  [
    "Relisez l’offre point par point et comparez chaque exigence aux pièces de votre dossier.",
    "Confirmez les critères, délais et documents demandés dans l’annonce ou par l’organisme."
  ]
];

function renderBewerbungQuestion() {
  const questionIndex = bewerbungStep;
  const percent = Math.round(((questionIndex + 1) / bewerbungQuestions.length) * 100);
  bewerbungQuestionCount.textContent = translate("Question {n} sur 7").replace("{n}", questionIndex + 1);
  bewerbungProgressPercent.textContent = `${percent} %`;
  bewerbungProgressBar.style.width = `${percent}%`;
  bewerbungQuestionTitle.textContent = translate(bewerbungQuestions[questionIndex]);
  bewerbungBack.disabled = questionIndex === 0;
  bewerbungNext.disabled = !bewerbungResponses[questionIndex];
  const arrowIcon = '<span class="bewerbung-arrow" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15 15 5M6 5h9v9"/></svg></span>';
  bewerbungNext.innerHTML = questionIndex === bewerbungQuestions.length - 1
    ? `${translate("Voir mes résultats")} ${arrowIcon}`
    : `${translate("Question suivante")} ${arrowIcon}`;
  bewerbungAnswers.replaceChildren();

  ["Oui", "Non", "À vérifier"].forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bewerbung-answer";
    button.setAttribute("aria-pressed", String(bewerbungResponses[questionIndex] === answer));
    button.innerHTML = `<span class="bewerbung-answer-mark" aria-hidden="true"></span><span>${translate(answer)}</span>`;
    button.addEventListener("click", () => {
      bewerbungResponses[questionIndex] = answer;
      bewerbungAnswers.querySelectorAll(".bewerbung-answer").forEach((choice) => choice.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      bewerbungNext.disabled = false;
    });
    bewerbungAnswers.append(button);
  });
  bewerbungQuestionTitle.focus?.({ preventScroll: true });
}

function resetBewerbungQuiz() {
  bewerbungStep = 0;
  bewerbungResponses = Array(bewerbungQuestions.length).fill("");
  bewerbungQuizView.hidden = false;
  bewerbungResultView.hidden = true;
  bewerbungModal.scrollTop = 0;
  bewerbungScore.textContent = "0";
  bewerbungScoreRing.style.setProperty("--score-angle", "0deg");
  bewerbungShareConsent.checked = false;
  bewerbungShareButton.disabled = true;
  renderBewerbungQuestion();
}

function fillBewerbungList(list, items, emptyText) {
  list.replaceChildren();
  const visibleItems = items.length ? items : [emptyText];
  visibleItems.forEach((item) => {
    const entry = document.createElement("li");
    entry.textContent = translate(item);
    list.append(entry);
  });
}

function chooseBewerbungPack() {
  const [cv, targeted, language, documents, letter] = bewerbungResponses;
  if (letter !== "Oui" && cv === "Oui" && targeted === "Oui" && documents === "Oui") {
    return {
      service: "Lettre de motivation",
      reason: "Votre CV et vos pièces sont prêts selon vos réponses ; l’Anschreiben est le principal élément à finaliser."
    };
  }
  if (targeted !== "Oui" && cv === "Oui" && documents === "Oui" && letter === "Oui") {
    return {
      service: "CV Ciblé",
      reason: "Votre priorité est d’adapter le CV à l’offre ou à la formation ciblée."
    };
  }
  if (bewerbungResponses.every((answer) => answer === "Oui")) {
    return {
      service: "CAP Deutschland — Dossier Bewerbung",
      reason: "Vos réponses sont toutes positives. Le pack CAP Deutschland peut aider à relire et assembler les éléments avant l’envoi."
    };
  }
  return {
    service: "CAP Deutschland — Dossier Bewerbung",
    reason: "Le pack CAP Deutschland réunit un CV allemand, une lettre ciblée et une check-list des pièces du dossier."
  };
}

function showBewerbungResults() {
  const score = Math.round(bewerbungResponses.reduce((total, answer) => total + (answer === "Oui" ? 1 : answer === "À vérifier" ? 0.5 : 0), 0) / bewerbungQuestions.length * 100);
  const strengths = [];
  const missing = [];
  const checks = [];
  const recommendations = [];

  bewerbungResponses.forEach((answer, index) => {
    if (answer === "Oui") strengths.push(bewerbungQuestions[index]);
    else if (answer === "Non") {
      missing.push(bewerbungQuestions[index]);
      recommendations.push(bewerbungAdvice[index][0]);
    } else {
      checks.push(bewerbungQuestions[index]);
      recommendations.push(bewerbungAdvice[index][1]);
    }
  });

  let level;
  let scoreBand;
  if (score <= 39) {
    level = "Votre dossier nécessite une préparation approfondie.";
    scoreBand = "0 à 39 %";
  } else if (score <= 69) {
    level = "Votre dossier présente des éléments à optimiser.";
    scoreBand = "40 à 69 %";
  } else if (score < 100) {
    level = "Vous êtes sur la bonne voie.";
    scoreBand = "70 à 99 %";
  } else {
    level = "Votre dossier semble prêt selon vos réponses.";
    scoreBand = "100 %";
  }

  if (recommendations.length === 0) {
    recommendations.push("Vos réponses sont positives. Faites relire le dossier final pour vérifier sa cohérence avant l’envoi.");
  }

  const pack = chooseBewerbungPack();
  bewerbungRecommendedService = pack.service;
  bewerbungLastScore = score;
  bewerbungLastLevel = level;
  bewerbungResultLevel.textContent = translate(level);
  bewerbungScoreBand.textContent = translate(scoreBand);
  bewerbungResultIntro.textContent = translate("Votre score de préparation") + " : " + score + " %";
  fillBewerbungList(bewerbungStrengths, strengths, "Aucun point fort confirmé dans vos réponses.");
  fillBewerbungList(bewerbungMissing, missing, "Aucun élément signalé comme manquant.");
  fillBewerbungList(bewerbungChecks, checks, "Aucun élément marqué à vérifier.");
  bewerbungRecommendationList.replaceChildren();
  recommendations.forEach((recommendation) => {
    const entry = document.createElement("li");
    entry.textContent = translate(recommendation);
    bewerbungRecommendationList.append(entry);
  });
  bewerbungPackName.textContent = translate(pack.service);
  bewerbungPackReason.textContent = translate(pack.reason);
  bewerbungPackButton.innerHTML = `${translate("Découvrir mon pack recommandé")} <span class="bewerbung-arrow" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15 15 5M6 5h9v9"/></svg></span>`;
  bewerbungQuizView.hidden = true;
  bewerbungResultView.hidden = false;
  bewerbungModal.scrollTop = 0;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    bewerbungScore.textContent = String(score);
    bewerbungScoreRing.style.setProperty("--score-angle", `${score * 3.6}deg`);
    return;
  }
  bewerbungScore.textContent = "0";
  bewerbungScoreRing.style.setProperty("--score-angle", "0deg");
  requestAnimationFrame(() => bewerbungScoreRing.style.setProperty("--score-angle", `${score * 3.6}deg`));
  const duration = 850;
  const started = performance.now();
  const animateScore = (now) => {
    const progress = Math.min((now - started) / duration, 1);
    bewerbungScore.textContent = String(Math.round(score * progress));
    if (progress < 1) requestAnimationFrame(animateScore);
  };
  requestAnimationFrame(animateScore);
}

document.querySelectorAll("[data-open-bewerbung-quiz]").forEach((button) => {
  button.addEventListener("click", () => {
    resetBewerbungQuiz();
    bewerbungModal.showModal();
  });
});

bewerbungBack.addEventListener("click", () => {
  if (bewerbungStep === 0) return;
  bewerbungStep -= 1;
  renderBewerbungQuestion();
});

bewerbungNext.addEventListener("click", () => {
  if (!bewerbungResponses[bewerbungStep]) return;
  if (bewerbungStep < bewerbungQuestions.length - 1) {
    bewerbungStep += 1;
    renderBewerbungQuestion();
  } else {
    showBewerbungResults();
  }
});

document.querySelector("#bewerbung-restart").addEventListener("click", resetBewerbungQuiz);
document.querySelector("#bewerbung-pack-button").addEventListener("click", () => {
  const service = bewerbungRecommendedService;
  bewerbungModal.close();
  openContact(service, "de");
});
document.querySelector("#bewerbung-custom-button").addEventListener("click", () => {
  bewerbungModal.close();
  openContact("CAP Deutschland — Dossier Bewerbung", "de");
});

bewerbungShareConsent.addEventListener("change", () => {
  bewerbungShareButton.disabled = !bewerbungShareConsent.checked;
});
bewerbungShareButton.addEventListener("click", () => {
  if (!bewerbungShareConsent.checked) return;
  bewerbungModal.close();
  openContact("CAP Deutschland — Dossier Bewerbung", "de", {
    score: bewerbungLastScore,
    result: bewerbungLastLevel,
    pack: bewerbungRecommendedService
  });
});

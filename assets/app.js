const diagnosticModal = document.querySelector("#diagnostic-modal");
const diagnosticContent = document.querySelector("#diagnostic-content");
const diagnosticResult = document.querySelector("#diagnostic-result");
const diagnosticTitle = document.querySelector("#diagnostic-modal-title");
const diagnosticOptions = document.querySelector("#diagnostic-options");
const nextButton = document.querySelector("#diagnostic-next");
const progress = document.querySelector("#diagnostic-progress");
const stepLabel = document.querySelector("#diagnostic-step");
const contactModal = document.querySelector("#contact-modal");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const toast = document.querySelector("#toast");

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

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderQuestion() {
  const question = questions[diagnosticStep];
  diagnosticTitle.textContent = question.title;
  stepLabel.textContent = `Question ${diagnosticStep + 1} sur ${questions.length}`;
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
    text.textContent = label;
    option.append(dot, text);
    option.addEventListener("click", () => {
      diagnosticOptions.querySelectorAll(".diagnostic-option").forEach((item) => item.setAttribute("aria-pressed", "false"));
      option.setAttribute("aria-pressed", "true");
      selectedOption = label;
      nextButton.disabled = false;
    });
    diagnosticOptions.append(option);
  });
  nextButton.innerHTML = diagnosticStep === questions.length - 1 ? "Voir ma piste <span>↗</span>" : "Continuer <span>↗</span>";
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
  document.querySelector("#result-title").textContent = `Votre piste : ${recommendation.service}`;
  document.querySelector("#result-copy").textContent = recommendation.copy;
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

function openContact(service = "") {
  selectedService = service || "";
  contactForm.reset();
  formStatus.classList.remove("show");
  formStatus.textContent = "";
  const serviceField = contactForm.elements.service;
  if (service && [...serviceField.options].some((option) => option.value === service)) serviceField.value = service;
  contactModal.showModal();
}

document.querySelectorAll("[data-open-contact]").forEach((button) => {
  button.addEventListener("click", () => openContact(button.dataset.openContact || ""));
});
document.querySelectorAll("[data-select-profile]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-select-profile]").forEach((card) => card.classList.remove("selected"));
    button.classList.add("selected");
    const profile = button.dataset.selectProfile;
    showToast(`${profile} : dites-nous ce que vous recherchez.`);
    window.setTimeout(() => openContact(profile === "Premier CV" ? "CV Starter" : profile === "CV existant" ? "CV Plus" : ""), 450);
  });
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const message = [
    "Bonjour MON CAP, je souhaite en savoir plus sur votre accompagnement CV.",
    `Prénom : ${data.get("name")}`,
    `E-mail ou téléphone : ${data.get("contact")}`,
    `Formule : ${data.get("service")}`,
    `Mon objectif : ${data.get("goal")}`
  ].join("\n");
  try {
    await navigator.clipboard.writeText(message);
    formStatus.textContent = "Votre demande a été copiée. Collez-la dans un message pour la transmettre à MON CAP. Les informations ne sont pas envoyées ni conservées par ce site.";
  } catch {
    formStatus.textContent = "Votre demande est prête ci-dessous. Copiez-la pour la transmettre à MON CAP. Les informations ne sont pas envoyées ni conservées par ce site.";
    const copyArea = document.createElement("textarea");
    copyArea.className = "copy-fallback";
    copyArea.readOnly = true;
    copyArea.value = message;
    formStatus.append(copyArea);
    copyArea.focus();
    copyArea.select();
  }
  formStatus.classList.add("show");
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
  nav.classList.toggle("open", !isOpen);
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Ouvrir le menu");
}));

document.addEventListener("click", (event) => {
  if (event.target.matches("dialog.modal")) event.target.close();
});

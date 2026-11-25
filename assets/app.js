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

let assessment = null;
const formLanguage = contactForm.elements.cvLanguage;
const otherLanguage = contactForm.elements.otherLanguage;
function updateOther(){const yes=formLanguage.value==='other';document.querySelector('#other-language').hidden=!yes;otherLanguage.disabled=!yes;otherLanguage.required=yes;}
formLanguage.addEventListener('change',updateOther);
function openContact(service='',language='',result=null){
  if(service) contactForm.elements.service.value=service;
  if(language || service.startsWith('CAP Deutschland')) formLanguage.value=language||'de';
  assessment=result;document.querySelector('#share-wrap').hidden=!result;contactForm.elements.share.checked=false;updateOther();
  document.querySelector('#contact').scrollIntoView({behavior:'smooth'});
  contactForm.elements.name.focus({preventScroll:true});
}
document.querySelectorAll('[data-open-contact]').forEach(b=>b.addEventListener('click',()=>openContact(b.dataset.openContact,b.dataset.language)));
function buildMessage(d,result){const language=d.get('cvLanguage')==='other'?d.get('otherLanguage'):new Intl.DisplayNames(['fr'],{type:'language'}).of(d.get('cvLanguage'));return ['Bonjour MON CAP, je souhaite demander un accompagnement.','Prénom : '+d.get('name').trim(),'Contact : '+d.get('contact').trim(),'Service : '+d.get('service'),'Langue du document : '+language,...(d.get('country').trim()?['Pays : '+d.get('country').trim()]:[]),'Objectif : '+d.get('goal').trim(),...(result&&d.get('share')?['Score Bewerbung : '+result.score+' %','Pack recommandé : '+result.pack]:[])].join('\n');}
contactForm.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(contactForm);if(!contactForm.reportValidity())return;const message=buildMessage(d,assessment);window.location.href='https://wa.me/212723701697?text='+encodeURIComponent(message);});
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
const readyQuestions=[['Disposez-vous d’un CV en allemand ?','CV en allemand','Préparez un Lebenslauf en allemand.'],['Votre CV est-il adapté au poste ou à la formation visée ?','CV adapté à l’objectif','Adaptez le CV à l’offre ciblée.'],['Disposez-vous du niveau de langue demandé ?','Niveau linguistique demandé','Vérifiez le niveau de langue et les justificatifs exigés.'],['Vos diplômes et pièces justificatives sont-ils disponibles ?','Diplômes et justificatifs','Rassemblez les pièces et vérifiez les éventuelles exigences de traduction.'],['Avez-vous un Anschreiben personnalisé ?','Anschreiben personnalisé','Rédigez une lettre adaptée au poste.'],['Êtes-vous capable de présenter votre parcours en allemand ?','Présentation du parcours en allemand','Entraînez-vous à présenter votre parcours en allemand.'],['Avez-vous vérifié les exigences de l’offre ciblée ?','Exigences de l’offre vérifiées','Relisez l’offre et identifiez les conditions et pièces demandées.']];
const readyModal=document.querySelector('#ready-modal'), readyBody=document.querySelector('#ready-body');let readyAnswers=[],ri=0;
function readyScore(a){return Math.round(a.reduce((x,y)=>x+y,0)/14*100)}
function renderReady(){const q=readyQuestions[ri];readyBody.innerHTML=`<p>Question ${ri+1} sur 7</p><div class="ready-meter" role="progressbar" aria-valuenow="${ri+1}" aria-valuemin="0" aria-valuemax="7"><span style="width:${(ri+1)/7*100}%"></span></div><h2>${q[0]}</h2><div class="ready-answers">${['Oui','Non','À vérifier'].map((a,i)=>`<button type="button" class="button button-outline" data-answer="${[2,0,1][i]}" aria-pressed="${readyAnswers[ri]===[2,0,1][i]}">${a}</button>`).join('')}</div><div class="ready-actions"><button class="button button-outline" id="ready-back" ${ri===0?'disabled':''}>Précédent</button><button class="button" id="ready-next" ${readyAnswers[ri]===undefined?'disabled':''}>${ri===6?'Voir mon résultat':'Continuer'}</button></div>`;readyBody.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{readyAnswers[ri]=Number(b.dataset.answer);renderReady()});document.querySelector('#ready-back').onclick=()=>{if(ri>0){ri--;renderReady()}};document.querySelector('#ready-next').onclick=()=>{if(readyAnswers[ri]===undefined)return;if(ri<6){ri++;renderReady()}else renderReadyResult()};localizeDynamic(readyBody);}
function renderReadyResult(){const score=readyScore(readyAnswers);const status=score<40?'Votre dossier nécessite une préparation approfondie.':score<70?'Votre dossier présente des éléments à optimiser.':score<100?'Vous êtes sur la bonne voie.':'Votre dossier semble prêt selon vos réponses.';const missing=readyAnswers.map((a,i)=>a!==2?i:-1).filter(i=>i>=0);let pack='CAP Deutschland — Dossier Bewerbung';if(missing.length===1&&missing[0]===4)pack='Lettre de motivation';if(missing.length===1&&missing[0]===1)pack='CV Ciblé';if(missing.length===1&&missing[0]===0)pack='CV Starter';const list=(indices,col)=>indices.length?indices.map(i=>`<li>${readyQuestions[i][col]}</li>`).join(''):'<li>Aucun</li>';readyBody.innerHTML=`<div class="ready-score" style="--angle:${score*3.6}deg"><b>${score}%</b></div><h2>${status}</h2><h3>Points forts</h3><ul>${list(readyAnswers.map((a,i)=>a===2?i:-1).filter(i=>i>=0),1)}</ul><h3>Éléments manquants ou à vérifier</h3><ul>${list(missing,1)}</ul><h3>Recommandations personnalisées</h3><ul>${list(missing,2)}</ul><h3>Pack recommandé</h3><p>${pack}</p><div class="ready-actions"><button class="button" id="ready-pack">Découvrir mon pack recommandé</button><button class="button button-outline" id="ready-help">Demander un accompagnement personnalisé</button><button class="text-button" id="ready-restart">Recommencer</button></div>`;const result={score,pack};document.querySelector('#ready-pack').onclick=()=>{readyModal.close();openContact(pack,'de',result)};document.querySelector('#ready-help').onclick=()=>{readyModal.close();openContact('CAP Deutschland — Dossier Bewerbung','de',result)};document.querySelector('#ready-restart').onclick=()=>{readyAnswers=[];ri=0;renderReady()};localizeDynamic(readyBody)}
document.querySelector('#start-ready').onclick=()=>{readyAnswers=[];ri=0;renderReady();readyModal.showModal()};

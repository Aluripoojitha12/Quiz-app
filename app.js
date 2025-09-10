/* ===== Questions ===== */
const QUESTIONS = [
  {
    text: "Which planet in the Solar System is the smallest?",
    options: ["Pluto", "Earth", "Mercury", "Mars"],
    correctIndex: 2
  },
  {
    text: "What is 12 ÷ 3 + 2 × 4?",
    options: ["10", "14", "20", "28"],
    correctIndex: 1
  },
  {
    text: "Solve: 3x − 9 = 0",
    options: ["x = 0", "x = 3", "x = 9", "x = −3"],
    correctIndex: 1
  }
];

const QUESTION_TIME = 40; // seconds (set 0 to disable)

/* ===== State ===== */
let current = 0, score = 0, selected = null;
let timerId = null, timeLeft = QUESTION_TIME;

/* ===== Elements ===== */
const screens = {
  splash: document.getElementById("screen-splash"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
};
const btnStart  = document.getElementById("btnStart");
const btnHome   = document.getElementById("btnHome");
const qBadge    = document.getElementById("qBadge");
const qTextEl   = document.getElementById("qText");
const optionsEl = document.getElementById("options");
const btnCheck  = document.getElementById("btnCheck");
const qIndexEl  = document.getElementById("qIndex");
const timerEl   = document.getElementById("timer");
const progressBar = document.getElementById("progressBar");
const finalScore  = document.getElementById("finalScore");
const resultMsg   = document.getElementById("result-msg");

/* ===== Nav ===== */
btnStart.addEventListener("click", gotoQuiz);
btnHome?.addEventListener("click", () => { show("splash"); reset(); });

function show(name){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}
function reset(){
  current=0; score=0; selected=null;
  clearInterval(timerId); timerId=null; timeLeft=QUESTION_TIME;
}

/* ===== Quiz Flow ===== */
function gotoQuiz(){ reset(); show("quiz"); renderQuestion(); startTimer(); }

function renderQuestion(){
  const q = QUESTIONS[current], total = QUESTIONS.length;

  qBadge.textContent = String(current + 1).padStart(2, "0");
  qTextEl.textContent = q.text;
  qIndexEl.textContent = `Question ${current + 1} of ${total}`;

  optionsEl.innerHTML = "";
  q.options.forEach((label, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = label;
    btn.dataset.label = String.fromCharCode(65 + i); // A/B/C/D
    btn.addEventListener("click", () => selectOption(i, btn));
    optionsEl.appendChild(btn);
  });

  btnCheck.disabled = true;
  btnCheck.onclick = checkAnswer;

  updateProgress();
  resetTimer();
}

function selectOption(i, el){
  [...optionsEl.children].forEach(c=>c.setAttribute("aria-selected","false"));
  el.setAttribute("aria-selected","true");
  selected = i;
  btnCheck.disabled = false;
}

function checkAnswer(){
  const q = QUESTIONS[current];
  if (selected == null) return;

  [...optionsEl.children].forEach(c => c.disabled = true);

  const chosenEl  = optionsEl.children[selected];
  const correctEl = optionsEl.children[q.correctIndex];

  if (selected === q.correctIndex) { chosenEl.classList.add("correct"); score++; }
  else { chosenEl.classList.add("wrong"); correctEl.classList.add("correct"); }

  setTimeout(next, 650);
}

function next(){
  clearInterval(timerId); timerId=null;
  current++;
  if (current < QUESTIONS.length){ renderQuestion(); startTimer(); }
  else { showResult(); }
}

function updateProgress(){
  progressBar.style.width = `${(current / QUESTIONS.length) * 100}%`;
}

/* ===== Timer ===== */
function startTimer(){
  if (!QUESTION_TIME){ timerEl.textContent = "—"; return; }
  timeLeft = QUESTION_TIME;
  timerEl.textContent = fmt(timeLeft);
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = fmt(timeLeft);
    if (timeLeft <= 0){ selected = null; checkAnswer(); }
  }, 1000);
}
function resetTimer(){
  if (!QUESTION_TIME) return;
  clearInterval(timerId); timerId=null;
  timeLeft = QUESTION_TIME; timerEl.textContent = fmt(timeLeft);
}
function fmt(s){
  const m = String(Math.floor(s/60)).padStart(2,"0");
  const ss = String(s%60).padStart(2,"0");
  return `${m}:${ss}`;
}

/* ===== Result ===== */
function showResult(){
  show("result");
  progressBar.style.width = "100%";
  const pct = Math.round((score / QUESTIONS.length) * 100);
  finalScore.textContent = `${pct}%`;
  resultMsg.textContent =
    pct >= 80 ? "You earned the gold badge! 🥇" :
    pct >= 60 ? "Great job — silver badge! 🥈" :
    pct >= 40 ? "Nice try — bronze badge! 🥉" :
                "Keep practicing, you’ll ace it next time!";
}

const formulas = [
  "V = I × R", "I = V ÷ R", "R = V ÷ I", "P = V × I",
  "V = P ÷ I", "I = P ÷ V", "R = V² ÷ P", "P = I² × R",
  "V = I ÷ R", "R = I ÷ V", "P = V ÷ I", "I = V × R"
];

const questions = [
  { tag: "FIND VOLTAGE", text: "A circuit has 3 A of current and 4 Ω of resistance. Which formula finds the voltage?", correct: "V = I × R" },
  { tag: "FIND CURRENT", text: "A 12 V supply pushes through a 6 Ω load. Which formula finds the current?", correct: "I = V ÷ R" },
  { tag: "FIND RESISTANCE", text: "A device draws 2 A from a 10 V source. Which formula finds its resistance?", correct: "R = V ÷ I" },
  { tag: "FIND POWER", text: "A gadget runs at 9 V and draws 2 A. Which formula finds the power?", correct: "P = V × I" },
  { tag: "FIND VOLTAGE", text: "A 60 W lamp draws 5 A. Which formula finds its voltage?", correct: "V = P ÷ I" },
  { tag: "FIND CURRENT", text: "A 24 W gizmo runs from 12 V. Which formula finds its current?", correct: "I = P ÷ V" },
  { tag: "FIND RESISTANCE", text: "A 12 V heater uses 24 W. Which formula finds its resistance?", correct: "R = V² ÷ P" },
  { tag: "FIND POWER", text: "A 3 A current flows through a 4 Ω resistor. Which formula finds the power?", correct: "P = I² × R" }
];

const prizes = [
  { icon: "📟", title: "You won a multimeter!", old: "$189.99", price: "$0.00", copy: "CAT ratings include Kitten, Tabby and Lion. Probes, display and electrical accuracy sold separately.", delivery: "$450 delivery • arrives sometime before 2029" },
  { image: "vemu-insulated-screwdriver-set.png?v=20261019.2", title: "12-piece insulated screwdriver set!", old: "$149.00", price: "$0.07", copy: "Laboratory tested and certified safe for voltages up to an impressive 0 V.", delivery: "Only 3,904 sets left — almost gone!" },
  { icon: "🥫", title: "Premium can of smoke!", old: "$79.95", price: "$0.01", copy: "Factory-original replacement smoke for electronics. Simply pour it back in after a component blows.", delivery: "Smoke may escape package during transit" },
  { icon: "🪣", title: "Trade-size bucket of volts!", old: "$119.95", price: "$0.00", copy: "Contains 240 genuine Australian volts. Keep upright to prevent dangerous voltage drop.", delivery: "Free pickup from an undisclosed substation" },
  { icon: "↔️", title: "Heavy-duty wire stretcher!", old: "$229.00", price: "$1.08", copy: "Adds up to 3 metres whenever the apprentice cuts the cable 50 mm too short.", delivery: "Your local courier has pulled it too tight" },
  { icon: "💪", title: "Industrial elbow grease!", old: "$399.00", price: "$0.53", copy: "One 10 mL tin. Specially formulated for stiff conduit and first-year apprentices.", delivery: "Danger: may cause sudden productivity" },
  { image: "vemu-insulated-screwdriver-set.png?v=20261019.2", title: "Left-handed insulated screwdriver set!", old: "$160.00", price: "$0.79", copy: "Ergonomically useless for lefties, righties and anyone attempting to turn a screw.", delivery: "Also available in metric Phillips" },
  { icon: "〰️", title: "Cordless electrical cable!", old: "$999.00", price: "$2.49", copy: "100% wireless wire. Zero copper, zero insulation, zero awkward reels to carry.", delivery: "Already delivered — you just can't see it" },
  { icon: "✨", title: "Bucket of grinder sparks!", old: "$84.00", price: "$0.04", copy: "Pre-owned sparks, hand collected on site. Bucket lid sold separately.", delivery: "Flammable delivery surcharge: $612" }
];

const wheel = document.querySelector("#wheel");
const wheelStage = document.querySelector("#wheelStage");
const spinButton = document.querySelector("#spinButton");
const keepButton = document.querySelector("#keepButton");
const selectedFormula = document.querySelector("#selectedFormula");
const resultChip = document.querySelector("#resultChip");
const attemptsEl = document.querySelector("#attempts");
let question, outcomes, spinCount = 0, rotation = 0, spinning = false, soundOn = true;
let drag = null;

function buildWheel() {
  const colors = ["#f04a00", "#ffb300", "#2f80ed", "#7c4dff", "#12a66a", "#f06292"];
  const step = 360 / formulas.length;
  wheel.style.background = `conic-gradient(${formulas.map((_, i) => `${colors[i % colors.length]} ${i * step}deg ${(i + 1) * step}deg`).join(",")})`;
  formulas.forEach((formula, i) => {
    const label = document.createElement("span");
    label.className = "segment-label";
    label.textContent = formula;
    const angle = i * step + step / 2;
    const radians = angle * Math.PI / 180;
    label.style.left = `${50 + Math.sin(radians) * 34}%`;
    label.style.top = `${50 - Math.cos(radians) * 34}%`;
    const spokeAngle = angle - 90;
    label.style.transform = `translate(-50%, -50%) rotate(${spokeAngle}deg)`;
    wheel.appendChild(label);
  });
}

function shuffle(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
function newRound() {
  question = questions[Math.floor(Math.random() * questions.length)];
  const wrong = shuffle(formulas.filter(f => f !== question.correct)).slice(0, 2);
  outcomes = shuffle([question.correct, ...wrong]);
  spinCount = 0;
  selectedFormula.textContent = "Spin the wheel!";
  document.querySelector("#questionTag").textContent = question.tag;
  document.querySelector("#questionText").textContent = question.text;
  keepButton.disabled = true;
  spinButton.disabled = false;
  renderAttempts();
  renderSpinButton();
}

function renderAttempts() {
  attemptsEl.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const el = document.createElement("span");
    el.className = `attempt ${i < spinCount ? "used" : i === spinCount ? "current" : ""}`;
    el.textContent = `SPIN ${i + 1}`;
    attemptsEl.appendChild(el);
  }
}

function renderSpinButton() {
  if (spinCount >= 3) {
    spinButton.innerHTML = "<span>NO SPINS LEFT</span><small>Keep it or weep</small>";
    spinButton.disabled = true;
  } else {
    spinButton.innerHTML = `<span>${spinCount ? "RISK IT — SPIN AGAIN" : `SPIN ${spinCount + 1} OF 3`}</span><small>${spinCount ? `${3 - spinCount} spin${3 - spinCount === 1 ? "" : "s"} remaining` : "Correct answer guaranteed!*"}</small>`;
  }
}

function beep(freq = 440, duration = .06) {
  if (!soundOn) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = freq; gain.gain.value = .035;
  osc.connect(gain); gain.connect(ctx.destination); osc.start();
  gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);
}

function spin(swipeVelocity = 0) {
  if (spinning || spinCount >= 3) return;
  spinning = true; spinButton.disabled = true; keepButton.disabled = true;
  const formula = outcomes[spinCount];
  const index = formulas.indexOf(formula);
  const step = 360 / formulas.length;
  const target = -(index * step + step / 2);
  const normalized = ((rotation % 360) + 360) % 360;
  const targetNorm = ((target % 360) + 360) % 360;
  const delta = (targetNorm - normalized + 360) % 360;
  const force = Math.min(1, Math.max(0, (swipeVelocity - .12) / .75));
  const fullTurns = 4 + Math.round(force * 3);
  const spinDuration = 3650 + Math.round(force * 1350);
  rotation += fullTurns * 360 + delta;
  wheel.style.transition = `transform ${spinDuration}ms cubic-bezier(.12,.7,.08,1)`;
  wheel.style.transform = `rotate(${rotation}deg)`;
  let ticks = 0;
  const maxTicks = Math.floor(spinDuration / 115);
  const ticker = setInterval(() => { if (ticks++ < maxTicks) beep(260 + ticks * 6, .035); else clearInterval(ticker); }, 105);
  setTimeout(() => {
    clearInterval(ticker); beep(740, .18);
    spinCount++;
    selectedFormula.textContent = formula;
    resultChip.animate([{ transform: "scale(.9)" }, { transform: "scale(1.05)" }, { transform: "scale(1)" }], { duration: 360 });
    spinning = false; keepButton.disabled = false;
    renderAttempts(); renderSpinButton();
    if (spinCount < 3) spinButton.disabled = false;
  }, spinDuration + 50);
}

function pointerAngle(event) {
  const rect = wheel.getBoundingClientRect();
  return Math.atan2(event.clientY - (rect.top + rect.height / 2), event.clientX - (rect.left + rect.width / 2)) * 180 / Math.PI;
}

wheelStage.addEventListener("pointerdown", event => {
  if (spinning || spinCount >= 3 || event.button !== 0) return;
  drag = {
    id: event.pointerId,
    angle: pointerAngle(event),
    startRotation: rotation,
    lastX: event.clientX,
    lastY: event.clientY,
    distance: 0,
    angleTravel: 0,
    startedAt: performance.now()
  };
  wheelStage.setPointerCapture(event.pointerId);
  wheelStage.classList.add("dragging");
  wheel.style.transition = "none";
  spinButton.disabled = true;
});

wheelStage.addEventListener("pointermove", event => {
  if (!drag || drag.id !== event.pointerId) return;
  event.preventDefault();
  const angle = pointerAngle(event);
  let delta = angle - drag.angle;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  const dx = event.clientX - drag.lastX;
  const dy = event.clientY - drag.lastY;
  drag.distance += Math.hypot(dx, dy);
  drag.angleTravel += Math.abs(delta);
  rotation += delta;
  drag.angle = angle;
  drag.lastX = event.clientX;
  drag.lastY = event.clientY;
  wheel.style.transform = `rotate(${rotation}deg)`;
});

function finishDrag(event, cancelled = false) {
  if (!drag || drag.id !== event.pointerId) return;
  const shouldSpin = !cancelled && drag.distance >= 60 && drag.angleTravel >= 30;
  const swipeVelocity = drag.angleTravel / Math.max(performance.now() - drag.startedAt, 1);
  wheelStage.classList.remove("dragging");
  if (wheelStage.hasPointerCapture(event.pointerId)) wheelStage.releasePointerCapture(event.pointerId);
  if (!shouldSpin) {
    rotation = drag.startRotation;
    wheel.style.transition = "transform .25s ease-out";
    wheel.style.transform = `rotate(${rotation}deg)`;
    spinButton.disabled = spinCount >= 3;
  }
  drag = null;
  if (shouldSpin) spin(swipeVelocity);
}

wheelStage.addEventListener("pointerup", event => finishDrag(event));
wheelStage.addEventListener("pointercancel", event => finishDrag(event, true));

function showOutcome() {
  const won = selectedFormula.textContent === question.correct;
  const prize = prizes[Math.floor(Math.random() * prizes.length)];
  const prizeCard = document.querySelector(".prize-card");
  const prizeVisual = document.querySelector("#prizeVisual");
  prizeCard.classList.toggle("failure", !won);
  prizeVisual.classList.toggle("product-photo", won && Boolean(prize.image));
  if (won && prize.image) {
    const image = document.createElement("img");
    image.src = prize.image;
    image.alt = "";
    prizeVisual.replaceChildren(image);
  } else {
    prizeVisual.textContent = won ? prize.icon : "⛔";
  }
  document.querySelector("#outcomeKicker").textContent = won ? "VEMU EXCLUSIVE DEAL" : "FORMULA REJECTED";
  document.querySelector("#outcomeTitle").textContent = won ? prize.title : "Wrong answer. No bargain for you.";
  document.querySelector("#oldPrice").textContent = won ? prize.old : "";
  document.querySelector("#newPrice").textContent = won ? prize.price : "NO DEAL";
  document.querySelector("#prizeCopy").textContent = won ? prize.copy : `You kept ${selectedFormula.textContent}. The circuit needed ${question.correct}. Your suspiciously cheap prize has been repossessed.`;
  document.querySelector("#deliveryText").textContent = won ? prize.delivery : "Correct formula required — no substitutions";
  document.querySelector("#playAgainButton").textContent = won ? "CLAIM DEAL & PLAY AGAIN" : "TRY ANOTHER FORMULA";
  document.querySelector("#outcomeModal").classList.remove("hidden");
  if (won) makeConfetti();
  beep(won ? 880 : 160, .35);
}

function makeConfetti() {
  const box = document.querySelector("#confetti"); box.innerHTML = "";
  for (let i = 0; i < 45; i++) {
    const bit = document.createElement("i");
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.background = ["#ff4d00", "#ffd43b", "#2f80ed", "#12b76a", "#fff"][i % 5];
    bit.style.animationDelay = `${Math.random() * 1.5}s`;
    bit.style.animationDuration = `${1.8 + Math.random() * 2}s`;
    box.appendChild(bit);
  }
}

spinButton.addEventListener("click", () => spin());
keepButton.addEventListener("click", showOutcome);
document.querySelector("#playAgainButton").addEventListener("click", () => { document.querySelector("#outcomeModal").classList.add("hidden"); newRound(); });
document.querySelector("#helpButton").addEventListener("click", () => document.querySelector("#helpModal").classList.remove("hidden"));
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => document.querySelector(`#${button.dataset.close}`).classList.add("hidden")));
document.querySelector("#soundButton").addEventListener("click", event => { soundOn = !soundOn; event.currentTarget.textContent = soundOn ? "♪" : "×"; event.currentTarget.setAttribute("aria-label", soundOn ? "Mute sound" : "Enable sound"); });

let seconds = 299;
setInterval(() => { seconds = seconds > 0 ? seconds - 1 : 299; document.querySelector("#countdown").textContent = `${String(Math.floor(seconds / 60)).padStart(2,"0")}:${String(seconds % 60).padStart(2,"0")}`; }, 1000);
buildWheel(); newRound();

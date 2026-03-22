// app.js

// This file controls animations and other UI elements for the birthday experience.

const wishCarousel = document.querySelector('.wish-carousel');
const wishJar = document.querySelector('.wish-jar');
const toggleButton = document.querySelector('.theme-toggle');
const endButton = document.querySelector('.finale-mode');
const secretVaultCode = '2703';

// Function for animating elements
function animateElements() {
    // Add unique animations for the birthday experience
    wishCarousel.classList.add('active');
    wishJar.classList.add('active');
}

// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('neon-theme');
}

// Finale mode functionality
function finaleMode() {
    console.log('Finale mode activated!');
}

toggleButton.addEventListener('click', toggleTheme);
endButton.addEventListener('click', finaleMode);

window.onload = animateElements;
// Cute Romantic (parent-safe) Birthday Experience
// - no external libs
// - theme toggle (day/night)
// - envelope typewriter
// - wishes carousel
// - wish jar
// - vault unlock (2703)
// - confetti canvas burst
// - optional tiny sound

// ---------- Settings ----------
const DISPLAY_NAME = "Nira";
const BIRTHDAY_ISO = "2008-03-27";
const VAULT_CODE = "2703"; // DDMM for 27 March

const LETTER_TEXT =
  "Happy birthday! ✨ " +
  "May today feel extra special — calm, bright, and full of smiles. " +
  "You’re smart, capable, and genuinely impressive. " +
  "Keep going — your best days are being built.";

const wishes = [
  { title: "Wish #1", text: "May your year bring confidence, focus, and cheerful surprises." },
  { title: "Wish #2", text: "May your days feel lighter, your goals clearer, and your smile easier." },
  { title: "Wish #3", text: "May your discipline grow so your dreams feel closer every month." },
  { title: "Wish #4", text: "May you feel proud of yourself more often — you deserve that feeling." },
  { title: "Wish #5", text: "May you always have people around you who respect you and support you." },
  { title: "Wish #6", text: "May your birthday be calm, cute, and truly memorable." }
];

const jarNotes = [
  "A small wish: more peace, less pressure — and more reasons to smile.",
  "Reminder: your effort is visible. Keep going steady.",
  "Today is a good day to celebrate you — your growth, your journey.",
  "Wishing you good health, confidence, and many proud moments.",
  "May your year feel bright, organized, and full of happy energy."
];

// ---------- DOM ----------
const nameEl = document.getElementById("name");
const toNameEl = document.getElementById("toName");
const footerName = document.getElementById("footerName");

const bdayLabel = document.getElementById("bdayLabel");
const footerBday = document.getElementById("footerBday");

const modeLabel = document.getElementById("modeLabel");
const toggleThemeBtn = document.getElementById("toggleTheme");
const burstBtn = document.getElementById("burst");

const envelope = document.getElementById("envelope");
const typeTarget = document.getElementById("typeTarget");

const wishTitle = document.getElementById("wishTitle");
const wishText = document.getElementById("wishText");
const prevWish = document.getElementById("prevWish");
const nextWish = document.getElementById("nextWish");

const jarNote = document.getElementById("jarNote");
const dropNote = document.getElementById("dropNote");
const clearNote = document.getElementById("clearNote");

const codeInput = document.getElementById("code");
const unlockBtn = document.getElementById("unlock");
const secretBox = document.getElementById("secret");

const finaleBtn = document.getElementById("finale");
const muteBtn = document.getElementById("mute");

// ---------- Init content ----------
nameEl.textContent = DISPLAY_NAME;
toNameEl.textContent = DISPLAY_NAME;
footerName.textContent = DISPLAY_NAME;

bdayLabel.textContent = BIRTHDAY_ISO;
footerBday.textContent = BIRTHDAY_ISO;

// ---------- Theme (persist) ----------
const THEME_KEY = "nira_theme_v2";
const savedTheme = localStorage.getItem(THEME_KEY);
setTheme(savedTheme === "day" ? "day" : "night");

function setTheme(t){
  if (t === "day"){
    document.body.setAttribute("data-theme", "day");
    modeLabel.textContent = "Day";
  } else {
    document.body.setAttribute("data-theme", "night");
    modeLabel.textContent = "Night";
  }
  localStorage.setItem(THEME_KEY, t);
}

toggleThemeBtn.addEventListener("click", () => {
  const isDay = document.body.getAttribute("data-theme") === "day";
  setTheme(isDay ? "night" : "day");
  gentlePulse();
});

// ---------- Envelope open + typewriter ----------
let typed = false;

function openEnvelope(){
  envelope.classList.add("opened");
  if (!typed){
    typed = true;
    typewriter(LETTER_TEXT, typeTarget, 18);
    confettiBurst(120);
  }
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openEnvelope();
});

// ---------- Wishes carousel ----------
let wi = 0;

function renderWish(){
  wishTitle.textContent = wishes[wi].title;
  wishText.textContent = wishes[wi].text;
}
renderWish();

nextWish.addEventListener("click", () => { wi = (wi + 1) % wishes.length; renderWish(); });
prevWish.addEventListener("click", () => { wi = (wi - 1 + wishes.length) % wishes.length; renderWish(); });

window.addEventListener("keydown", (e) => {
  // prevent interfering when typing in code input
  if (document.activeElement === codeInput) return;

  if (e.key === "ArrowRight") nextWish.click();
  if (e.key === "ArrowLeft") prevWish.click();
});

// ---------- Wish jar ----------
function showJarNote(){
  const n = jarNotes[Math.floor(Math.random() * jarNotes.length)];
  jarNote.textContent = n;
  jarNote.classList.remove("show");
  void jarNote.offsetWidth; // reflow
  jarNote.classList.add("show");
}
dropNote.addEventListener("click", () => { showJarNote(); sparkle(); });
clearNote.addEventListener("click", () => { jarNote.classList.remove("show"); });

// ---------- Vault ----------
unlockBtn.addEventListener("click", () => {
  const v = (codeInput.value || "").trim();
  if (v === VAULT_CODE){
    secretBox.classList.add("show");
    confettiBurst(160);
    codeInput.blur();
  } else {
    secretBox.classList.remove("show");
    shake(unlockBtn);
  }
});

// ---------- Confetti manual ----------
burstBtn.addEventListener("click", () => confettiBurst(180));

// ---------- Finale + optional sound ----------
let soundOn = false;
muteBtn.textContent = "Sound: Off";

muteBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  muteBtn.textContent = soundOn ? "Sound: On" : "Sound: Off";
  gentlePulse();
});

finaleBtn.addEventListener("click", () => {
  openEnvelope();
  confettiBurst(260);
  sparkle(18);
  if (soundOn) beepMelody();
});

// ---------- Anim helpers ----------
function typewriter(text, el, speedMs){
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i] || "";
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speedMs);
}

function shake(el){
  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(0)" }
    ],
    { duration: 360, easing: "ease-out" }
  );
}

function gentlePulse(){
  const panel = document.querySelector(".panel");
  if (!panel) return;
  panel.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.007)" },
      { transform: "scale(1)" }
    ],
    { duration: 420, easing: "ease-in-out" }
  );
}

function sparkle(times=10){
  for (let i=0; i<times; i++){
    const s = document.createElement("div");
    s.style.position = "fixed";
    s.style.left = (Math.random()*100) + "vw";
    s.style.top  = (Math.random()*100) + "vh";
    s.style.width = "6px";
    s.style.height = "6px";
    s.style.borderRadius = "50%";
    s.style.background = "radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,0))";
    s.style.pointerEvents = "none";
    s.style.zIndex = 998;
    document.body.appendChild(s);

    s.animate(
      [
        { transform: "scale(0)", opacity: 0 },
        { transform: "scale(1.6)", opacity: 1 },
        { transform: "scale(0.2)", opacity: 0 }
      ],
      { duration: 700 + Math.random()*400, easing: "ease-out" }
    ).onfinish = () => s.remove();
  }
}

// ---------- Confetti canvas ----------
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let confetti = [];
let animating = false;

function resize(){
  // keep it crisp on high DPI
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width  = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

function confettiBurst(count=150){
  const colors = ["#ff4fd8", "#22c1ff", "#ffd166", "#ffffff"];
  for(let i=0; i<count; i++){
    confetti.push({
      x: Math.random() * window.innerWidth,
      y: -20,
      r: 2 + Math.random() * 4,
      vx: (Math.random() - 0.5) * 5,
      vy: 2 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      c: colors[Math.floor(Math.random() * colors.length)],
      life: 70 + Math.random() * 60
    });
  }
  if (!animating) animate();
}

function animate(){
  animating = true;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confetti = confetti.filter(p => p.life > 0);

  for(const p of confetti){
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06; // gravity
    p.rot += p.vr;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.r, -p.r, p.r*2.2, p.r*1.3);
    ctx.restore();
  }

  if (confetti.length > 0) requestAnimationFrame(animate);
  else {
    animating = false;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

// ---------- Simple beep melody (WebAudio) ----------
function beepMelody(){
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if(!AudioContext) return;

  const ac = new AudioContext();
  const notes = [523.25, 659.25, 783.99, 659.25, 698.46, 659.25, 523.25];
  const now = ac.currentTime;

  notes.forEach((f, idx) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.value = f;

    // tiny fade in/out so it’s not harsh
    g.gain.value = 0.0001;

    o.connect(g);
    g.connect(ac.destination);

    const t0 = now + idx * 0.18;
    const t1 = t0 + 0.14;

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.06, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t1);

    o.start(t0);
    o.stop(t1 + 0.02);
  });

  setTimeout(() => ac.close(), 2000);
}

// ---------- Small start hint ----------
setTimeout(() => { renderWish(); }, 300);// Cute Romantic (parent-safe) Birthday Experience
// - no external libs
// - theme toggle (day/night)
// - envelope typewriter
// - wishes carousel
// - wish jar
// - vault unlock (2703)
// - confetti canvas burst
// - optional tiny sound

// ---------- Settings ----------
const DISPLAY_NAME = "Nira";
const BIRTHDAY_ISO = "2008-03-27";
const VAULT_CODE = "2703"; // DDMM for 27 March

const LETTER_TEXT =
  "Happy birthday! ✨ " +
  "May today feel extra special — calm, bright, and full of smiles. " +
  "You’re smart, capable, and genuinely impressive. " +
  "Keep going — your best days are being built.";

const wishes = [
  { title: "Wish #1", text: "May your year bring confidence, focus, and cheerful surprises." },
  { title: "Wish #2", text: "May your days feel lighter, your goals clearer, and your smile easier." },
  { title: "Wish #3", text: "May your discipline grow so your dreams feel closer every month." },
  { title: "Wish #4", text: "May you feel proud of yourself more often — you deserve that feeling." },
  { title: "Wish #5", text: "May you always have people around you who respect you and support you." },
  { title: "Wish #6", text: "May your birthday be calm, cute, and truly memorable." }
];

const jarNotes = [
  "A small wish: more peace, less pressure — and more reasons to smile.",
  "Reminder: your effort is visible. Keep going steady.",
  "Today is a good day to celebrate you — your growth, your journey.",
  "Wishing you good health, confidence, and many proud moments.",
  "May your year feel bright, organized, and full of happy energy."
];

// ---------- DOM ----------
const nameEl = document.getElementById("name");
const toNameEl = document.getElementById("toName");
const footerName = document.getElementById("footerName");

const bdayLabel = document.getElementById("bdayLabel");
const footerBday = document.getElementById("footerBday");

const modeLabel = document.getElementById("modeLabel");
const toggleThemeBtn = document.getElementById("toggleTheme");
const burstBtn = document.getElementById("burst");

const envelope = document.getElementById("envelope");
const typeTarget = document.getElementById("typeTarget");

const wishTitle = document.getElementById("wishTitle");
const wishText = document.getElementById("wishText");
const prevWish = document.getElementById("prevWish");
const nextWish = document.getElementById("nextWish");

const jarNote = document.getElementById("jarNote");
const dropNote = document.getElementById("dropNote");
const clearNote = document.getElementById("clearNote");

const codeInput = document.getElementById("code");
const unlockBtn = document.getElementById("unlock");
const secretBox = document.getElementById("secret");

const finaleBtn = document.getElementById("finale");
const muteBtn = document.getElementById("mute");

// ---------- Init content ----------
nameEl.textContent = DISPLAY_NAME;
toNameEl.textContent = DISPLAY_NAME;
footerName.textContent = DISPLAY_NAME;

bdayLabel.textContent = BIRTHDAY_ISO;
footerBday.textContent = BIRTHDAY_ISO;

// ---------- Theme (persist) ----------
const THEME_KEY = "nira_theme_v2";
const savedTheme = localStorage.getItem(THEME_KEY);
setTheme(savedTheme === "day" ? "day" : "night");

function setTheme(t){
  if (t === "day"){
    document.body.setAttribute("data-theme", "day");
    modeLabel.textContent = "Day";
  } else {
    document.body.setAttribute("data-theme", "night");
    modeLabel.textContent = "Night";
  }
  localStorage.setItem(THEME_KEY, t);
}

toggleThemeBtn.addEventListener("click", () => {
  const isDay = document.body.getAttribute("data-theme") === "day";
  setTheme(isDay ? "night" : "day");
  gentlePulse();
});

// ---------- Envelope open + typewriter ----------
let typed = false;

function openEnvelope(){
  envelope.classList.add("opened");
  if (!typed){
    typed = true;
    typewriter(LETTER_TEXT, typeTarget, 18);
    confettiBurst(120);
  }
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openEnvelope();
});

// ---------- Wishes carousel ----------
let wi = 0;

function renderWish(){
  wishTitle.textContent = wishes[wi].title;
  wishText.textContent = wishes[wi].text;
}
renderWish();

nextWish.addEventListener("click", () => { wi = (wi + 1) % wishes.length; renderWish(); });
prevWish.addEventListener("click", () => { wi = (wi - 1 + wishes.length) % wishes.length; renderWish(); });

window.addEventListener("keydown", (e) => {
  // prevent interfering when typing in code input
  if (document.activeElement === codeInput) return;

  if (e.key === "ArrowRight") nextWish.click();
  if (e.key === "ArrowLeft") prevWish.click();
});

// ---------- Wish jar ----------
function showJarNote(){
  const n = jarNotes[Math.floor(Math.random() * jarNotes.length)];
  jarNote.textContent = n;
  jarNote.classList.remove("show");
  void jarNote.offsetWidth; // reflow
  jarNote.classList.add("show");
}
dropNote.addEventListener("click", () => { showJarNote(); sparkle(); });
clearNote.addEventListener("click", () => { jarNote.classList.remove("show"); });

// ---------- Vault ----------
unlockBtn.addEventListener("click", () => {
  const v = (codeInput.value || "").trim();
  if (v === VAULT_CODE){
    secretBox.classList.add("show");
    confettiBurst(160);
    codeInput.blur();
  } else {
    secretBox.classList.remove("show");
    shake(unlockBtn);
  }
});

// ---------- Confetti manual ----------
burstBtn.addEventListener("click", () => confettiBurst(180));

// ---------- Finale + optional sound ----------
let soundOn = false;
muteBtn.textContent = "Sound: Off";

muteBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  muteBtn.textContent = soundOn ? "Sound: On" : "Sound: Off";
  gentlePulse();
});

finaleBtn.addEventListener("click", () => {
  openEnvelope();
  confettiBurst(260);
  sparkle(18);
  if (soundOn) beepMelody();
});

// ---------- Anim helpers ----------
function typewriter(text, el, speedMs){
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i] || "";
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speedMs);
}

function shake(el){
  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(0)" }
    ],
    { duration: 360, easing: "ease-out" }
  );
}

function gentlePulse(){
  const panel = document.querySelector(".panel");
  if (!panel) return;
  panel.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.007)" },
      { transform: "scale(1)" }
    ],
    { duration: 420, easing: "ease-in-out" }
  );
}

function sparkle(times=10){
  for (let i=0; i<times; i++){
    const s = document.createElement("div");
    s.style.position = "fixed";
    s.style.left = (Math.random()*100) + "vw";
    s.style.top  = (Math.random()*100) + "vh";
    s.style.width = "6px";
    s.style.height = "6px";
    s.style.borderRadius = "50%";
    s.style.background = "radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,0))";
    s.style.pointerEvents = "none";
    s.style.zIndex = 998;
    document.body.appendChild(s);

    s.animate(
      [
        { transform: "scale(0)", opacity: 0 },
        { transform: "scale(1.6)", opacity: 1 },
        { transform: "scale(0.2)", opacity: 0 }
      ],
      { duration: 700 + Math.random()*400, easing: "ease-out" }
    ).onfinish = () => s.remove();
  }
}

// ---------- Confetti canvas ----------
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let confetti = [];
let animating = false;

function resize(){
  // keep it crisp on high DPI
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width  = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

function confettiBurst(count=150){
  const colors = ["#ff4fd8", "#22c1ff", "#ffd166", "#ffffff"];
  for(let i=0; i<count; i++){
    confetti.push({
      x: Math.random() * window.innerWidth,
      y: -20,
      r: 2 + Math.random() * 4,
      vx: (Math.random() - 0.5) * 5,
      vy: 2 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      c: colors[Math.floor(Math.random() * colors.length)],
      life: 70 + Math.random() * 60
    });
  }
  if (!animating) animate();
}

function animate(){
  animating = true;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confetti = confetti.filter(p => p.life > 0);

  for(const p of confetti){
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06; // gravity
    p.rot += p.vr;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.r, -p.r, p.r*2.2, p.r*1.3);
    ctx.restore();
  }

  if (confetti.length > 0) requestAnimationFrame(animate);
  else {
    animating = false;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

// ---------- Simple beep melody (WebAudio) ----------
function beepMelody(){
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if(!AudioContext) return;

  const ac = new AudioContext();
  const notes = [523.25, 659.25, 783.99, 659.25, 698.46, 659.25, 523.25];
  const now = ac.currentTime;

  notes.forEach((f, idx) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = "sine";
    o.frequency.value = f;

    // tiny fade in/out so it’s not harsh
    g.gain.value = 0.0001;

    o.connect(g);
    g.connect(ac.destination);

    const t0 = now + idx * 0.18;
    const t1 = t0 + 0.14;

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.06, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t1);

    o.start(t0);
    o.stop(t1 + 0.02);
  });

  setTimeout(() => ac.close(), 2000);
}

// ---------- Small start hint ----------
setTimeout(() => { renderWish(); }, 300);

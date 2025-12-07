const output = document.getElementById('output');
const curtain = document.getElementById('curtain');
const btnSave = document.getElementById('btnSave');
const btnKill = document.getElementById('btnKill');

const lines = {
  save: [
    "You reach out...",
    "Threads of reality slip through your fingers.",
    "You tried to save Frost, yet the illusion consumed the moment."
  ],
  kill: [
    "You steel your resolve...",
    "The blade meets nothing; only echoes answer.",
    "You chose the end, yet the illusion consumed the moment."
  ],
  reveal: [
    "",
    "Frost was never real.",
    "The genjutsu tricked your mind.",
    "Choice is an illusion."
  ]
};

// --- Glitch sound effect ---
function playGlitchSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(100 + Math.random() * 400, ctx.currentTime);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

function typeLines(sequence, done) {
  output.textContent = "";
  let i = 0;
  function next() {
    if (i >= sequence.length) return done && done();
    typeLine(sequence[i], () => { i++; setTimeout(next, 400); });
  }
  next();
}

function typeLine(text, cb) {
  const speed = 22 + Math.random() * 18;
  let idx = 0;
  const base = output.textContent;
  const interval = setInterval(() => {
    output.textContent = base + (idx ? "\n" : "") + text.slice(0, idx + 1);
    idx++;
    if (idx >= text.length) {
      clearInterval(interval);
      cb && cb();
    }
  }, speed);
}

function distort() {
  document.body.style.filter = "contrast(1.08) hue-rotate(12deg)";
  playGlitchSound(); // 🔊 play sound when distortion happens
  setTimeout(() => { document.body.style.filter = "none"; }, 900);
}

function endFade() { curtain.classList.add('on'); }

function disableChoices() {
  btnSave.disabled = true;
  btnKill.disabled = true;
}

function play(choice) {
  disableChoices();
  distort();
  const seq = choice === 'save' ? lines.save : lines.kill;
  typeLines(seq, () => {
    distort();
    typeLines(lines.reveal, () => {
      setTimeout(endFade, 1000);
    });
  });
}

btnSave.addEventListener('click', () => play('save'));
btnKill.addEventListener('click', () => play('kill'));

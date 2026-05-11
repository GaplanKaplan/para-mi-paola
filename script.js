const canvas = document.querySelector("#petals");
const ctx = canvas.getContext("2d");
const breathText = document.querySelector("#breathText");
const breathButton = document.querySelector("#breathButton");
const heartButton = document.querySelector("#heartButton");
const hiddenMessage = document.querySelector("#hiddenMessage");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let petals = [];
let running = true;
let breathRunning = true;
let breathIndex = 0;

const breathSteps = ["Inhala suave.", "Quédate aquí.", "Suelta despacio.", "Todo puede hablarse con calma."];

function resize() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  petals = Array.from({ length: window.innerWidth < 700 ? 18 : 34 }, createPetal);
}

function createPetal() {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: 5 + Math.random() * 9,
    speed: 0.35 + Math.random() * 0.75,
    drift: -0.35 + Math.random() * 0.7,
    turn: Math.random() * Math.PI * 2,
    alpha: 0.22 + Math.random() * 0.34,
    color: Math.random() > 0.48 ? "186, 86, 112" : "244, 191, 114",
  };
}

function drawPetals() {
  if (!running || reduceMotion) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const petal of petals) {
    petal.y += petal.speed;
    petal.x += petal.drift + Math.sin(petal.turn) * 0.22;
    petal.turn += 0.018;

    if (petal.y > window.innerHeight + 20) {
      Object.assign(petal, createPetal(), { y: -20 });
    }

    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate(petal.turn);
    ctx.fillStyle = `rgba(${petal.color}, ${petal.alpha})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, petal.size * 0.58, petal.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  requestAnimationFrame(drawPetals);
}

function tickBreath() {
  if (!breathRunning) return;
  breathIndex = (breathIndex + 1) % breathSteps.length;
  breathText.textContent = breathSteps[breathIndex];
}

breathButton.addEventListener("click", () => {
  breathRunning = !breathRunning;
  breathButton.textContent = breathRunning ? "Pausar" : "Continuar";
});

heartButton.addEventListener("click", () => {
  hiddenMessage.textContent = "Te quiero cuidar mejor, Paola. Sin prisa, pero de verdad.";
  heartButton.textContent = "Abrazo guardado";
});

window.addEventListener("resize", resize);
document.addEventListener("visibilitychange", () => {
  running = !document.hidden;
  if (running) drawPetals();
});

resize();
drawPetals();
setInterval(tickBreath, 4000);

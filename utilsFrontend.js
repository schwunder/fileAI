export const isPromise = (val) => val && typeof val.then === "function";
export const pipe = (initialValue, fns) => {
  if (!Array.isArray(fns)) {
    throw new TypeError("fns must be an array of functions");
  }
  return fns.reduce((acc, fn) => {
    return isPromise(acc) ? acc.then(fn) : fn(acc);
  }, initialValue);
};

export function triggerConfetti() {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";

  const confettiCount = 100;
  const confetti = [];

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createConfetti() {
    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: randomRange(0, canvas.width),
        y: randomRange(0, canvas.height),
        r: randomRange(2, 6),
        d: randomRange(1, 5),
        color: `rgba(${Math.floor(randomRange(0, 255))}, ${Math.floor(
          randomRange(0, 255)
        )}, ${Math.floor(randomRange(0, 255))}, 0.8)`,
        tilt: randomRange(-10, 10),
        tiltAngleIncremental: randomRange(0.05, 0.12),
        tiltAngle: 0,
      });
    }
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach((confetto, index) => {
      ctx.beginPath();
      ctx.lineWidth = confetto.r;
      ctx.strokeStyle = confetto.color;
      ctx.moveTo(confetto.x + confetto.tilt + confetto.r, confetto.y);
      ctx.lineTo(
        confetto.x + confetto.tilt,
        confetto.y + confetto.tilt + confetto.r
      );
      ctx.stroke();
    });
    updateConfetti();
  }

  function updateConfetti() {
    confetti.forEach((confetto, index) => {
      confetto.tiltAngle += confetto.tiltAngleIncremental;
      confetto.y += (Math.cos(confetto.d) + 1 + confetto.r / 2) / 2;
      confetto.x += Math.sin(confetto.d);
      confetto.tilt = Math.sin(confetto.tiltAngle - index / 3) * 15;

      if (confetto.y > canvas.height) {
        confetti[index] = {
          x: randomRange(0, canvas.width),
          y: -10,
          r: confetto.r,
          d: confetto.d,
          color: confetto.color,
          tilt: confetto.tilt,
          tiltAngleIncremental: confetto.tiltAngleIncremental,
          tiltAngle: confetto.tiltAngle,
        };
      }
    });
  }

  let animationFrameId;

  function animateConfetti() {
    drawConfetti();
    animationFrameId = requestAnimationFrame(animateConfetti);
  }

  createConfetti();
  animateConfetti();

  setTimeout(() => {
    cancelAnimationFrame(animationFrameId);
    document.body.removeChild(canvas);
  }, 5000); // Stop after 5 seconds
}

export function playFOffSound() {
  const audio = new Audio("/fOff.mp3");
  audio
    .play()
    .then(() => {
      console.log("Audio playback started");
    })
    .catch((error) => {
      console.error("Error playing audio:", error);
    });
}

export function playSirenSound() {
  const audio = new Audio("/siren.mp3");
  audio
    .play()
    .then(() => {
      console.log("Audio playback started");
    })
    .catch((error) => {
      console.error("Error playing audio:", error);
    });
}

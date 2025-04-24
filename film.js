/**
 * Created by Antonio De Nuevo
 * All rights reserved
 * 2025
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 * This script powers a generative film that overlays a series of transparent cutout images onto a canvas.
 * Cutouts are loaded sequentially from a pre-generated `cutouts.json` file.
 * The images are layered with a blend mode (e.g. "lighten") to create visual buildup.
 * Audio starts with the first image and everything resets once the soundtrack ends.
 * Originally this relied on a Python server to serve images, but now it runs entirely client-side.
 */


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const button = document.getElementById("startButton");
const audio = document.getElementById("soundtrack");
let running = false;
let cutoutList = [];
let currentIndex = 0;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const height = window.innerHeight;
  const aspectRatio = 1448 / 1080;
  const width = height * aspectRatio;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(1, 0, 0, 1, 0, 0.01);
  ctx.scale(dpr, dpr);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

async function loadCutoutList() {
  try {
    const response = await fetch("cutouts.json");
    if (!response.ok) throw new Error("Failed to load cutout list");
    const data = await response.json();
    cutoutList = data;
  } catch (error) {
    console.error("Error loading cutout list:", error);
  }
}

async function addCutout() {
  if (currentIndex >= cutoutList.length) return;
  const cutoutUrl = cutoutList[currentIndex];
  currentIndex++;

  const img = new Image();
  img.onload = () => {
    const canvasWidth = canvas.width / window.devicePixelRatio;
    const canvasHeight = canvas.height / window.devicePixelRatio;

    const scale = canvasHeight / img.height;
    const imgWidth = img.width * scale;
    const imgHeight = canvasHeight;

    //const imgWidth = img.width;
    //const imgHeight = img.height;

    const offsetX = (canvasWidth - imgWidth) / 2;
    const offsetY = 0;

    // Apply screen blend mode
    ctx.globalCompositeOperation = "lighten"; // hard-light / difference / exclusion / lighten (blending modes variations)
    //ctx.filter = "blur(24px)"; // ← Apply blur effect, I kept it off for this first iteration
    ctx.drawImage(img, offsetX, offsetY, imgWidth, imgHeight);
    ctx.filter = "none"; // ← Reset blur filter
    ctx.globalCompositeOperation = "source-over"; // reset to default if needed
  };
  img.src = cutoutUrl;
}

async function createCollage() {
  running = true;
  while (running && currentIndex < cutoutList.length) {
    // Draw semi-transparent black rectangle to gradually fade older images
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0,0,0,0.002)";
    //ctx.fillStyle = "rgba(0,0,0,0.003)"; // this is the one I tested on my TV, feels a bit grey

    ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

    // Then draw a new cutout with screen blending
    await addCutout();
    await new Promise(resolve => setTimeout(resolve, 250));
  }
}

// Start on click
button.addEventListener("click", async () => {
  overlay.style.display = "none";
  audio.play();
  await loadCutoutList();
  createCollage();
});

// Reset when audio ends
audio.addEventListener("ended", () => {
  running = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  overlay.style.display = "flex";
  currentIndex = 0;
});

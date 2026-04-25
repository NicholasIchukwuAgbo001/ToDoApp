const fs = require("fs");
const path = require("path");

// Minimal PNG encoder (no dependencies needed)
function createPNG(width, height, drawFn) {
  const { createCanvas } = require("canvas");
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  drawFn(ctx, width, height);
  return canvas.toBuffer("image/png");
}

// Check if canvas is available
try {
  require("canvas");
} catch (e) {
  console.log("'canvas' package not found. Generating SVG-based placeholder PNGs using pure Node...");
  generateWithPureNode();
  process.exit(0);
}

function drawIcon(ctx, w, h) {
  const r = w / 2;

  // Background circle
  ctx.fillStyle = "#2196F3";
  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.fill();

  // White checkmark / task lines
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = w * 0.07;
  ctx.lineCap = "round";

  const pad = w * 0.22;
  const lineH = h * 0.18;
  const startX = w * 0.38;
  const checkX = w * 0.25;

  // Three task lines
  [0, 1, 2].forEach((i) => {
    const y = h * 0.32 + i * lineH;
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(w - pad, y);
    ctx.stroke();
  });

  // Checkmark on the left
  ctx.lineWidth = w * 0.065;
  ctx.beginPath();
  ctx.moveTo(w * 0.18, h * 0.5);
  ctx.lineTo(w * 0.27, h * 0.61);
  ctx.lineTo(w * 0.36, h * 0.38);
  ctx.stroke();
}

const sizes = [
  { name: "icon.png", size: 1024 },
  { name: "adaptive-icon.png", size: 1024 },
  { name: "splash.png", size: 1284 },
  { name: "favicon.png", size: 48 },
];

const assetsDir = path.join(__dirname, "../assets");
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

sizes.forEach(({ name, size }) => {
  const buf = createPNG(size, size, (ctx, w, h) => {
    if (name === "splash.png") {
      ctx.fillStyle = "#2196F3";
      ctx.fillRect(0, 0, w, h);
      drawIcon(ctx, w * 0.4, h * 0.4);
    } else {
      drawIcon(ctx, w, h);
    }
  });
  fs.writeFileSync(path.join(assetsDir, name), buf);
  console.log(`✓ Generated ${name} (${size}x${size})`);
});

function generateWithPureNode() {
  // Fallback: write minimal valid 1x1 transparent PNGs as placeholders
  // Real icons should be replaced before store submission
  const placeholder = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );
  const assetsDir = path.join(__dirname, "../assets");
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);
  ["icon.png", "adaptive-icon.png", "splash.png", "favicon.png"].forEach((name) => {
    fs.writeFileSync(path.join(assetsDir, name), placeholder);
    console.log(`✓ Placeholder written: ${name}`);
  });
  console.log("\nNote: Install 'canvas' (npm install canvas) and re-run for real icons.");
}

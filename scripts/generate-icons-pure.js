/**
 * Pure Node.js PNG icon generator — no external dependencies.
 * Generates all required Expo asset PNGs with a proper Taskly icon.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// --- Minimal PNG encoder ---
function encodePNG(width, height, pixels) {
  // pixels: Uint8Array of RGBA, row by row
  function crc32(buf) {
    let c = 0xffffffff;
    const table = crc32.table || (crc32.table = (() => {
      const t = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let v = i;
        for (let j = 0; j < 8; j++) v = v & 1 ? 0xedb88320 ^ (v >>> 1) : v >>> 1;
        t[i] = v;
      }
      return t;
    })());
    for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const t = Buffer.from(type);
    const crcBuf = Buffer.concat([t, data]);
    const crcVal = Buffer.alloc(4); crcVal.writeUInt32BE(crc32(crcBuf));
    return Buffer.concat([len, t, data, crcVal]);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB (we'll use RGBA=6 below)
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Raw image data with filter byte per row
  const rowSize = width * 4;
  const raw = Buffer.alloc((rowSize + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (rowSize + 1)] = 0; // filter type None
    pixels.copy(raw, y * (rowSize + 1) + 1, y * rowSize, (y + 1) * rowSize);
  }
  const compressed = zlib.deflateSync(raw, { level: 6 });

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", compressed), chunk("IEND", Buffer.alloc(0))]);
}

// --- Drawing helpers ---
function createCanvas(w, h) {
  const pixels = Buffer.alloc(w * h * 4, 0);

  function setPixel(x, y, r, g, b, a) {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const i = (y * w + x) * 4;
    // Alpha blend over existing
    const sa = a / 255, da = pixels[i + 3] / 255;
    const oa = sa + da * (1 - sa);
    if (oa === 0) return;
    pixels[i]     = Math.round((r * sa + pixels[i]     * da * (1 - sa)) / oa);
    pixels[i + 1] = Math.round((g * sa + pixels[i + 1] * da * (1 - sa)) / oa);
    pixels[i + 2] = Math.round((b * sa + pixels[i + 2] * da * (1 - sa)) / oa);
    pixels[i + 3] = Math.round(oa * 255);
  }

  function fillCircle(cx, cy, radius, r, g, b, a = 255) {
    const x0 = Math.max(0, Math.floor(cx - radius - 1));
    const x1 = Math.min(w - 1, Math.ceil(cx + radius + 1));
    const y0 = Math.max(0, Math.floor(cy - radius - 1));
    const y1 = Math.min(h - 1, Math.ceil(cy + radius + 1));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx, dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Anti-alias
        const alpha = Math.max(0, Math.min(1, radius + 0.5 - dist));
        if (alpha > 0) setPixel(x, y, r, g, b, Math.round(alpha * a));
      }
    }
  }

  function fillRect(x, y, rw, rh, r, g, b, a = 255) {
    for (let py = y; py < y + rh; py++)
      for (let px = x; px < x + rw; px++)
        setPixel(px, py, r, g, b, a);
  }

  function drawLine(x1, y1, x2, y2, thickness, r, g, b, a = 255) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(len * 2);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = x1 + dx * t, py = y1 + dy * t;
      fillCircle(px, py, thickness / 2, r, g, b, a);
    }
  }

  function fillRoundRect(x, y, rw, rh, radius, r, g, b, a = 255) {
    fillRect(x + radius, y, rw - radius * 2, rh, r, g, b, a);
    fillRect(x, y + radius, rw, rh - radius * 2, r, g, b, a);
    fillCircle(x + radius, y + radius, radius, r, g, b, a);
    fillCircle(x + rw - radius, y + radius, radius, r, g, b, a);
    fillCircle(x + radius, y + rh - radius, radius, r, g, b, a);
    fillCircle(x + rw - radius, y + rh - radius, radius, r, g, b, a);
  }

  return { pixels, fillCircle, fillRect, fillRoundRect, drawLine, w, h };
}

// --- Icon drawing ---
function drawTasklyIcon(canvas, scale = 1) {
  const { w, h, fillCircle, fillRoundRect, drawLine } = canvas;
  const cx = w / 2, cy = h / 2;

  // Blue background circle
  fillCircle(cx, cy, w * 0.48, 33, 150, 243, 255); // #2196F3

  // White rounded card
  const cardX = w * 0.18, cardY = h * 0.22;
  const cardW = w * 0.64, cardH = h * 0.56;
  const cardR = w * 0.06;
  fillRoundRect(cardX, cardY, cardW, cardH, cardR, 255, 255, 255, 240);

  // Three task rows
  const lineThick = w * 0.04;
  const dotR = w * 0.045;
  const rows = [0.38, 0.50, 0.62];
  rows.forEach((yFrac, i) => {
    const y = h * yFrac;
    const dotX = w * 0.30;
    // Dot
    fillCircle(dotX, y, dotR, 33, 150, 243, 255);
    // Line
    drawLine(w * 0.42, y, w * 0.74, y, lineThick, 180, 180, 190, 220);
  });

  // Checkmark on first row (blue dot replaced with check)
  const ckY = h * rows[0];
  // Already drawn dot above; draw white check inside
  const ckX = w * 0.30;
  drawLine(ckX - dotR * 0.5, ckY, ckX - dotR * 0.1, ckY + dotR * 0.5, dotR * 0.6, 255, 255, 255, 255);
  drawLine(ckX - dotR * 0.1, ckY + dotR * 0.5, ckX + dotR * 0.6, ckY - dotR * 0.5, dotR * 0.6, 255, 255, 255, 255);
}

function drawSplash(canvas) {
  const { w, h, fillRect, fillCircle, fillRoundRect, drawLine } = canvas;
  // Blue background
  fillRect(0, 0, w, h, 33, 150, 243, 255);
  // Center icon at 40% size
  const iconSize = w * 0.38;
  const iconCanvas = createCanvas(Math.round(iconSize), Math.round(iconSize));
  drawTasklyIcon(iconCanvas);
  // Blit icon onto splash center
  const offX = Math.round((w - iconSize) / 2);
  const offY = Math.round((h - iconSize) / 2);
  for (let y = 0; y < iconCanvas.h; y++) {
    for (let x = 0; x < iconCanvas.w; x++) {
      const si = (y * iconCanvas.w + x) * 4;
      const tx = offX + x, ty = offY + y;
      if (tx >= 0 && tx < w && ty >= 0 && ty < h) {
        const di = (ty * w + tx) * 4;
        const sa = iconCanvas.pixels[si + 3] / 255;
        if (sa > 0) {
          canvas.pixels[di]     = Math.round(iconCanvas.pixels[si]     * sa + canvas.pixels[di]     * (1 - sa));
          canvas.pixels[di + 1] = Math.round(iconCanvas.pixels[si + 1] * sa + canvas.pixels[di + 1] * (1 - sa));
          canvas.pixels[di + 2] = Math.round(iconCanvas.pixels[si + 2] * sa + canvas.pixels[di + 2] * (1 - sa));
          canvas.pixels[di + 3] = Math.min(255, canvas.pixels[di + 3] + Math.round(sa * 255));
        }
      }
    }
  }
}

// --- Generate all assets ---
const assetsDir = path.join(__dirname, "../assets");

const configs = [
  { name: "icon.png",          w: 1024, h: 1024, type: "icon" },
  { name: "adaptive-icon.png", w: 1024, h: 1024, type: "icon" },
  { name: "splash.png",        w: 1284, h: 2778, type: "splash" },
  { name: "favicon.png",       w: 48,   h: 48,   type: "icon" },
];

configs.forEach(({ name, w, h, type }) => {
  const canvas = createCanvas(w, h);
  if (type === "splash") drawSplash(canvas);
  else drawTasklyIcon(canvas);
  const png = encodePNG(w, h, canvas.pixels);
  fs.writeFileSync(path.join(assetsDir, name), png);
  console.log(`✓ ${name} (${w}x${h}, ${(png.length / 1024).toFixed(1)} KB)`);
});

console.log("\nAll assets generated successfully.");

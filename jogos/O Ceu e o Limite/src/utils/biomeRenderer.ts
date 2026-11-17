import { BiomeType, Character, DifficultySettings, Platform } from "../types";

export interface BiomeBannerData {
  phase: number;
  title: string;
  welcome: string;
  subtitle: string;
  icon: string;
  color: string;
  timer: number;
  maxTimer: number;
}

export function drawBiomeBackground(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  camY: number,
  diff: DifficultySettings
) {
  const time = Date.now() * 0.001;

  if (diff.biome === "forest") {
    // 1. FLORESTA ENCANTADA (0 - 160m)
    // Morning Sky Gradient: Crisp sky blue into fresh emerald-tinted horizon
    const skyGrad = ctx.createLinearGradient(0, 0, 0, ch);
    skyGrad.addColorStop(0, "#0284c7");
    skyGrad.addColorStop(0.65, "#38bdf8");
    skyGrad.addColorStop(1, "#bbf7d0");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Warm Sun disc
    ctx.save();
    const sunGrad = ctx.createRadialGradient(cw * 0.82, 90, 8, cw * 0.82, 90, 60);
    sunGrad.addColorStop(0, "rgba(254, 240, 138, 0.95)");
    sunGrad.addColorStop(0.4, "rgba(253, 224, 71, 0.45)");
    sunGrad.addColorStop(1, "rgba(253, 224, 71, 0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(cw * 0.82, 90, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Distant Green Mountains (Parallax 1)
    ctx.fillStyle = "rgba(74, 222, 128, 0.35)";
    ctx.beginPath();
    ctx.moveTo(0, ch);
    for (let x = 0; x <= cw; x += 40) {
      const peakY = ch - 160 + Math.sin(x * 0.012 + camY * 0.0003) * 45;
      ctx.lineTo(x, peakY);
    }
    ctx.lineTo(cw, ch);
    ctx.fill();

    // Forest Tree Canopy Silhouettes (Parallax 2)
    ctx.fillStyle = "rgba(22, 101, 52, 0.45)";
    ctx.beginPath();
    ctx.moveTo(0, ch);
    for (let x = 0; x <= cw; x += 30) {
      const treeY = ch - 90 + Math.cos(x * 0.022 + camY * 0.0007) * 35;
      ctx.lineTo(x, treeY);
    }
    ctx.lineTo(cw, ch);
    ctx.fill();

    // Ambient floating green leaves
    for (let i = 0; i < 7; i++) {
      const leafX = (i * 70 + Math.sin(time + i) * 30 + (camY * 0.03)) % (cw + 40) - 20;
      const leafY = (i * 120 + time * 25) % (ch + 60) - 20;
      drawLeaf(ctx, leafX, leafY, i);
    }
  } else if (diff.biome === "desert") {
    // 2. DESERTO DOURADO (160 - 390m)
    // Fiery Sunset Gradient: Deep orange into golden amber horizon
    const skyGrad = ctx.createLinearGradient(0, 0, 0, ch);
    skyGrad.addColorStop(0, "#9a3412");
    skyGrad.addColorStop(0.4, "#ea580c");
    skyGrad.addColorStop(0.8, "#f59e0b");
    skyGrad.addColorStop(1, "#fef08a");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Giant Sunset Sun
    ctx.save();
    const sunGrad = ctx.createRadialGradient(cw * 0.5, ch * 0.38, 15, cw * 0.5, ch * 0.38, 90);
    sunGrad.addColorStop(0, "rgba(254, 240, 138, 0.95)");
    sunGrad.addColorStop(0.4, "rgba(249, 115, 22, 0.6)");
    sunGrad.addColorStop(1, "rgba(234, 88, 12, 0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(cw * 0.5, ch * 0.38, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Distant Ancient Pyramids & Dunes
    ctx.fillStyle = "rgba(120, 53, 15, 0.4)";
    ctx.beginPath();
    ctx.moveTo(0, ch);
    ctx.lineTo(cw * 0.15, ch - 160);
    ctx.lineTo(cw * 0.35, ch - 60);
    ctx.lineTo(cw * 0.7, ch - 190);
    ctx.lineTo(cw * 0.95, ch - 80);
    ctx.lineTo(cw, ch);
    ctx.fill();

    // Rolling Golden Dunes (Parallax 2)
    ctx.fillStyle = "rgba(180, 83, 9, 0.55)";
    ctx.beginPath();
    ctx.moveTo(0, ch);
    for (let x = 0; x <= cw; x += 30) {
      const duneY = ch - 110 + Math.sin(x * 0.015 + camY * 0.0006) * 40;
      ctx.lineTo(x, duneY);
    }
    ctx.lineTo(cw, ch);
    ctx.fill();

    // Shimmering Golden Sand Dust
    ctx.fillStyle = "rgba(254, 240, 138, 0.75)";
    for (let i = 0; i < 18; i++) {
      const sandX = (i * 29 + Math.cos(time * 2 + i) * 20) % cw;
      const sandY = (i * 45 + time * 35) % ch;
      ctx.fillRect(sandX, sandY, 2, 2);
    }
  } else if (diff.biome === "sky") {
    // 3. REINO DOS CÉUS (390 - 690m)
    // Heavenly Sky Gradient: Vivid cyan-blue into luminous cloud twilight
    const skyGrad = ctx.createLinearGradient(0, 0, 0, ch);
    skyGrad.addColorStop(0, "#0369a1");
    skyGrad.addColorStop(0.5, "#0ea5e9");
    skyGrad.addColorStop(0.85, "#7dd3fc");
    skyGrad.addColorStop(1, "#bae6fd");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Ethereal Rainbow Arch in Background
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 10;
    const rainbowColors = ["#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6"];
    rainbowColors.forEach((col, idx) => {
      ctx.strokeStyle = col;
      ctx.beginPath();
      ctx.arc(cw * 0.5, ch + 80, 260 + idx * 8, Math.PI, 0);
      ctx.stroke();
    });
    ctx.restore();

    // Floating Background Clouds
    for (let i = 0; i < 6; i++) {
      const cloudSpeed = 0.12 + (i % 3) * 0.04;
      const cloudY = (i * 190 - camY * cloudSpeed) % (ch + 120);
      const cloudX = ((i * 130 + time * 20 * cloudSpeed) % (cw + 160)) - 80;
      drawFluffyCloud(ctx, cloudX, cloudY, 80 + (i % 3) * 28, "rgba(255, 255, 255, 0.45)");
    }
  } else if (diff.biome === "space") {
    // 4. ESPAÇO SIDERAL CÓSMICO (690m+)
    // Deep Space Void with Purple/Cyan Nebula
    const skyGrad = ctx.createLinearGradient(0, 0, 0, ch);
    skyGrad.addColorStop(0, "#030712");
    skyGrad.addColorStop(0.5, "#1e1b4b");
    skyGrad.addColorStop(1, "#2e1065");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Glowing Nebula Clouds
    ctx.save();
    const neb1 = ctx.createRadialGradient(cw * 0.3, ch * 0.3, 10, cw * 0.3, ch * 0.3, 160);
    neb1.addColorStop(0, "rgba(168, 85, 247, 0.25)");
    neb1.addColorStop(0.6, "rgba(59, 130, 246, 0.12)");
    neb1.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = neb1;
    ctx.fillRect(0, 0, cw, ch);

    const neb2 = ctx.createRadialGradient(cw * 0.75, ch * 0.7, 10, cw * 0.75, ch * 0.7, 140);
    neb2.addColorStop(0, "rgba(236, 72, 153, 0.2)");
    neb2.addColorStop(0.6, "rgba(99, 102, 241, 0.1)");
    neb2.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = neb2;
    ctx.fillRect(0, 0, cw, ch);
    ctx.restore();

    // Giant Saturn-like Ringed Planet in Background
    ctx.save();
    const planetX = cw * 0.8;
    const planetY = ((ch * 0.25 - camY * 0.02) % (ch + 100)) + 40;
    const planetR = 34;

    const planetGrad = ctx.createRadialGradient(planetX - 10, planetY - 10, 4, planetX, planetY, planetR);
    planetGrad.addColorStop(0, "#c084fc");
    planetGrad.addColorStop(0.5, "#7c3aed");
    planetGrad.addColorStop(1, "#4338ca");
    ctx.fillStyle = planetGrad;
    ctx.beginPath();
    ctx.arc(planetX, planetY, planetR, 0, Math.PI * 2);
    ctx.fill();

    // Planet Rings
    ctx.strokeStyle = "rgba(233, 213, 255, 0.65)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(planetX, planetY, planetR * 2.1, planetR * 0.55, -Math.PI / 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Twinkling Multi-colored Stars
    for (let i = 0; i < 48; i++) {
      const starX = (i * 83 + (camY * 0.04)) % cw;
      const starY = (i * 59 + (camY * 0.015)) % ch;
      const size = i % 4 === 0 ? 3 : (i % 2 === 0 ? 2 : 1.2);
      const alpha = 0.35 + 0.65 * Math.sin(time * 3 + i * 1.7);
      ctx.fillStyle = i % 3 === 0 ? `rgba(165, 243, 252, ${alpha})` : i % 5 === 0 ? `rgba(254, 240, 138, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(starX, starY, size, size);
    }

    // Shooting Star
    const shootTime = (time * 0.4) % 4;
    if (shootTime < 0.6) {
      const prog = shootTime / 0.6;
      const sx = cw * 0.1 + prog * cw * 0.8;
      const sy = ch * 0.1 + prog * ch * 0.4;
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - prog})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx - 35, sy - 18);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    }
  } else if (diff.biome === "cyber") {
    // 5. DIMENSÃO TECNOLÓGICA (CYBER MATRIX)
    // Synthwave / Cyberpunk Deep Neon Void
    const skyGrad = ctx.createLinearGradient(0, 0, 0, ch);
    skyGrad.addColorStop(0, "#030014");
    skyGrad.addColorStop(0.5, "#0b0728");
    skyGrad.addColorStop(1, "#18093c");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Neon Cyber Grid (Moving Perspective Floor / Backdrop)
    ctx.save();
    ctx.strokeStyle = "rgba(6, 182, 212, 0.22)";
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    const gridOffsetY = (camY * 0.25) % gridSpacing;

    // Horizontal grid lines
    for (let y = gridOffsetY; y <= ch; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cw, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let x = 0; x <= cw; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ch);
      ctx.stroke();
    }

    // Magenta Perspective Converging Beams
    ctx.strokeStyle = "rgba(236, 72, 153, 0.18)";
    ctx.lineWidth = 1.5;
    const vanishingX = cw / 2;
    const vanishingY = ch * 0.4;
    for (let vx = 0; vx <= cw; vx += 60) {
      ctx.beginPath();
      ctx.moveTo(vanishingX, vanishingY);
      ctx.lineTo(vx, ch);
      ctx.stroke();
    }
    ctx.restore();

    // Floating Holographic Wireframe Cubes
    for (let i = 0; i < 5; i++) {
      const cubeSpeed = 0.1 + (i % 3) * 0.05;
      const cubeY = ((i * 170 - camY * cubeSpeed) % (ch + 100)) + 20;
      const cubeX = ((i * 110 + time * 18 * cubeSpeed) % (cw + 120)) - 40;
      drawHoloCube(ctx, cubeX, cubeY, 24 + (i % 3) * 8, time + i);
    }

    // Falling Matrix Digital Glyphs Rain
    ctx.font = "bold 11px monospace";
    ctx.fillStyle = "rgba(6, 182, 212, 0.45)";
    const glyphs = ["0", "1", "A", "F", "X", "⚡", "◆", "7", "§"];
    for (let i = 0; i < 14; i++) {
      const glyphX = (i * 37 + 10) % cw;
      const glyphY = ((i * 85 + time * 70) % (ch + 60)) - 20;
      const char = glyphs[(i + Math.floor(time * 3)) % glyphs.length];
      ctx.fillText(char, glyphX, glyphY);
    }

    // Sweeping Horizontal Laser Scanline
    const scanY = (time * 120) % ch;
    ctx.save();
    ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#06b6d4";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, scanY);
    ctx.lineTo(cw, scanY);
    ctx.stroke();
    ctx.restore();
  }
}

function drawHoloCube(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  t: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t * 0.4);
  ctx.strokeStyle = "rgba(236, 72, 153, 0.55)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-size / 2, -size / 2, size, size);

  ctx.strokeStyle = "rgba(6, 182, 212, 0.65)";
  ctx.strokeRect(-size * 0.35, -size * 0.35, size * 0.7, size * 0.7);
  ctx.restore();
}

function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, seed: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(seed + Date.now() * 0.002);
  ctx.fillStyle = seed % 2 === 0 ? "rgba(34, 197, 94, 0.65)" : "rgba(234, 179, 8, 0.6)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFluffyCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color = "rgba(255, 255, 255, 0.4)"
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
  ctx.arc(x + size * 0.25, y - size * 0.15, size * 0.35, 0, Math.PI * 2);
  ctx.arc(x + size * 0.55, y, size * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// THEMED PLATFORM RENDERING
export function drawBiomePlatform(
  ctx: CanvasRenderingContext2D,
  plat: Platform,
  screenY: number,
  diff: DifficultySettings
) {
  ctx.save();

  const w = plat.width;
  const h = plat.height;
  const x = plat.x;
  const y = screenY;
  const biome = plat.biome || diff.biome;

  if (biome === "forest") {
    // 1. FLORESTA: BLOCOS DE TERRA COM GRAMA VIVA
    drawForestPlatform(ctx, plat, x, y, w, h);
  } else if (biome === "desert") {
    // 2. DESERTO: BLOCOS DE ARENITO & AREIA DOURADA
    drawDesertPlatform(ctx, plat, x, y, w, h);
  } else if (biome === "space") {
    // 4. ESPAÇO: ESTRELAS CÓSMICAS & FRAGMENTOS ESTELARES
    drawSpacePlatform(ctx, plat, x, y, w, h);
  } else if (biome === "cyber") {
    // 5. DIMENSÃO TECNOLÓGICA: CIRCUITOS QUÂNTICOS & MATRIZ NEON
    drawCyberPlatform(ctx, plat, x, y, w, h);
  } else {
    // 3. CÉU: NUVENS FLUTUANTES CELESTIAIS
    drawSkyCloudPlatform(ctx, plat, x, y, w, h);
  }

  // Draw Dimensional Portal Gate if platform is a Dimensional Portal
  if (plat.portal) {
    drawDimensionalPortal(ctx, plat, x, y, w, h);
  }

  ctx.restore();
}

// 1. FOREST DIRT & GRASS PLATFORM
function drawForestPlatform(
  ctx: CanvasRenderingContext2D,
  plat: Platform,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const shakeX = plat.type === "fragile" && plat.steppedOn ? (Math.random() - 0.5) * 4 : 0;
  ctx.translate(shakeX, 0);

  // A. Earth Base Block (Dark Rich Soil)
  const dirtGrad = ctx.createLinearGradient(x, y + 6, x, y + h);
  dirtGrad.addColorStop(0, "#78350f");
  dirtGrad.addColorStop(0.7, "#451a03");
  dirtGrad.addColorStop(1, "#271003");
  ctx.fillStyle = dirtGrad;

  ctx.beginPath();
  ctx.roundRect(x, y + 4, w, h - 4, [0, 0, 8, 8]);
  ctx.fill();

  // Soil pebble specks
  ctx.fillStyle = "#a16207";
  ctx.fillRect(x + w * 0.2, y + h * 0.55, 4, 3);
  ctx.fillRect(x + w * 0.65, y + h * 0.65, 5, 3);
  ctx.fillRect(x + w * 0.82, y + h * 0.45, 3, 2);

  // B. Lush Green Grass Cap
  const grassGrad = ctx.createLinearGradient(x, y, x, y + 10);
  grassGrad.addColorStop(0, "#4ade80");
  grassGrad.addColorStop(0.6, "#22c55e");
  grassGrad.addColorStop(1, "#15803d");
  ctx.fillStyle = grassGrad;

  ctx.beginPath();
  ctx.roundRect(x - 2, y, w + 4, 10, [6, 6, 4, 4]);
  ctx.fill();

  // Grass Hanging Blades Underside
  ctx.fillStyle = "#15803d";
  for (let gx = x + 4; gx < x + w - 4; gx += 12) {
    ctx.beginPath();
    ctx.moveTo(gx, y + 10);
    ctx.lineTo(gx + 4, y + 15);
    ctx.lineTo(gx + 8, y + 10);
    ctx.fill();
  }

  // C. Tiny Forest Flowers
  drawFlower(ctx, x + w * 0.25, y + 2, "#fde047", "#ffffff");
  if (w > 80) {
    drawFlower(ctx, x + w * 0.75, y + 2, "#f43f5e", "#fef08a");
  }

  // Type Specific Extras
  if (plat.type === "booster") {
    // Bouncy Red Forest Mushroom
    const bounceScale = 1 - (plat.springAnimation || 0) * 0.4;
    const mx = x + w / 2;
    const my = y - 10 * bounceScale;

    // Stem
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(mx - 5, y - 6 * bounceScale, 10, 8 * bounceScale);

    // Red Cap
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(mx, my, 14, Math.PI, 0);
    ctx.fill();

    // White polka dots
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(mx, my - 6, 3, 0, Math.PI * 2);
    ctx.arc(mx - 7, my - 2, 2.5, 0, Math.PI * 2);
    ctx.arc(mx + 7, my - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (plat.type === "moving") {
    // Vine indicators
    ctx.fillStyle = "#166534";
    ctx.fillRect(x + w / 2 - 8, y + h / 2, 16, 4);
    ctx.fillStyle = "#86efac";
    const dir = plat.velocityX > 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x + w / 2 + 5 * dir, y + h / 2 + 2);
    ctx.lineTo(x + w / 2 - 4 * dir, y + h / 2 - 2);
    ctx.lineTo(x + w / 2 - 4 * dir, y + h / 2 + 6);
    ctx.fill();
  } else if (plat.type === "fragile" && plat.steppedOn) {
    // Cracking roots
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.3, y + 2);
    ctx.lineTo(x + w * 0.5, y + h * 0.7);
    ctx.lineTo(x + w * 0.75, y + 4);
    ctx.stroke();
  } else if (plat.type === "rare" && !plat.collected) {
    // Emerald Star
    drawRareGem(ctx, x + w / 2, y - 10, "#10b981", "#34d399", "★ +1500");
  }
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, centerColor: string, petalColor: string) {
  ctx.fillStyle = petalColor;
  ctx.beginPath();
  ctx.arc(x - 3, y, 2.5, 0, Math.PI * 2);
  ctx.arc(x + 3, y, 2.5, 0, Math.PI * 2);
  ctx.arc(x, y - 3, 2.5, 0, Math.PI * 2);
  ctx.arc(x, y + 3, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

// 2. DESERT SANDSTONE PLATFORM
function drawDesertPlatform(
  ctx: CanvasRenderingContext2D,
  plat: Platform,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const shakeX = plat.type === "fragile" && plat.steppedOn ? (Math.random() - 0.5) * 4 : 0;
  ctx.translate(shakeX, 0);

  // A. Sandstone Carved Block
  const stoneGrad = ctx.createLinearGradient(x, y, x, y + h);
  stoneGrad.addColorStop(0, "#f59e0b");
  stoneGrad.addColorStop(0.5, "#d97706");
  stoneGrad.addColorStop(1, "#92400e");
  ctx.fillStyle = stoneGrad;

  ctx.beginPath();
  ctx.roundRect(x, y + 3, w, h - 3, 6);
  ctx.fill();

  // Hieroglyphic Inset Lines
  ctx.strokeStyle = "rgba(120, 53, 15, 0.45)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 10);
  ctx.lineTo(x + w - 8, y + 10);
  ctx.moveTo(x + w * 0.3, y + 10);
  ctx.lineTo(x + w * 0.3, y + h - 4);
  ctx.moveTo(x + w * 0.7, y + 10);
  ctx.lineTo(x + w * 0.7, y + h - 4);
  ctx.stroke();

  // B. Wavy Golden Sand Ripple on Top
  const sandGrad = ctx.createLinearGradient(x, y, x, y + 6);
  sandGrad.addColorStop(0, "#fef08a");
  sandGrad.addColorStop(0.7, "#fde047");
  sandGrad.addColorStop(1, "#f59e0b");
  ctx.fillStyle = sandGrad;

  ctx.beginPath();
  ctx.roundRect(x - 1, y, w + 2, 7, [5, 5, 3, 3]);
  ctx.fill();

  // Corner Amber Jewels
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(x + 3, y + h - 7, 4, 4);
  ctx.fillRect(x + w - 7, y + h - 7, 4, 4);

  // Type Specific Extras
  if (plat.type === "booster") {
    // Golden Sand Geyser Spring
    const springH = 15 * (1 - (plat.springAnimation || 0) * 0.6);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + w / 2 - 10, y);
    ctx.lineTo(x + w / 2 + 10, y - springH * 0.5);
    ctx.lineTo(x + w / 2 - 10, y - springH);
    ctx.lineTo(x + w / 2 + 10, y - springH * 1.5);
    ctx.stroke();

    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y - springH * 1.9);
    ctx.lineTo(x + w / 2 - 8, y - springH * 1.4);
    ctx.lineTo(x + w / 2 + 8, y - springH * 1.4);
    ctx.fill();
  } else if (plat.type === "moving") {
    // Desert wind arrows
    ctx.fillStyle = "#78350f";
    const dir = plat.velocityX > 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x + w / 2 + 6 * dir, y + h / 2 + 2);
    ctx.lineTo(x + w / 2 - 5 * dir, y + h / 2 - 3);
    ctx.lineTo(x + w / 2 - 5 * dir, y + h / 2 + 7);
    ctx.fill();
  } else if (plat.type === "fragile" && plat.steppedOn) {
    // Sand fractures
    ctx.strokeStyle = "#451a03";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.2, y + 2);
    ctx.lineTo(x + w * 0.45, y + h - 3);
    ctx.lineTo(x + w * 0.8, y + 2);
    ctx.stroke();
  } else if (plat.type === "rare" && !plat.collected) {
    // Golden Scarab Gem
    drawRareGem(ctx, x + w / 2, y - 10, "#fbbf24", "#fef08a", "★ +1500");
  }
}

// 3. SKY FLUFFY CLOUD PLATFORM
function drawSkyCloudPlatform(
  ctx: CanvasRenderingContext2D,
  plat: Platform,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const shakeX = plat.type === "fragile" && plat.steppedOn ? (Math.random() - 0.5) * 4 : 0;
  ctx.translate(shakeX, 0);

  if (plat.type === "fragile") {
    // Dark Storm Cloud
    ctx.fillStyle = plat.steppedOn ? "#64748b" : "#94a3b8";
    fillCloudPuffShape(ctx, x, y, w, h);

    if (plat.steppedOn) {
      // Crackling mini lightning inside
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.35, y + 4);
      ctx.lineTo(x + w * 0.48, y + h * 0.6);
      ctx.lineTo(x + w * 0.42, y + h * 0.75);
      ctx.lineTo(x + w * 0.65, y + h * 0.9);
      ctx.stroke();
    }
  } else if (plat.type === "booster") {
    // Rainbow Booster Cloud
    ctx.fillStyle = "#f0f9ff";
    fillCloudPuffShape(ctx, x, y, w, h);

    // Glowing Spring coil on top
    const springH = 14 * (1 - (plat.springAnimation || 0) * 0.6);
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + w / 2 - 12, y);
    ctx.lineTo(x + w / 2 + 12, y - springH * 0.5);
    ctx.lineTo(x + w / 2 - 12, y - springH);
    ctx.lineTo(x + w / 2 + 12, y - springH * 1.5);
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y - springH * 1.8);
    ctx.lineTo(x + w / 2 - 8, y - springH * 1.3);
    ctx.lineTo(x + w / 2 + 8, y - springH * 1.3);
    ctx.fill();
  } else if (plat.type === "rare") {
    // Solar Radiant Cloud
    const goldGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    goldGrad.addColorStop(0, "#fde047");
    goldGrad.addColorStop(0.5, "#fbbf24");
    goldGrad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = goldGrad;
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 14;
    fillCloudPuffShape(ctx, x, y, w, h);
    ctx.shadowBlur = 0;

    if (!plat.collected) {
      drawRareGem(ctx, x + w / 2, y - 10, "#fbbf24", "#ffffff", "★ +1500");
    }
  } else if (plat.type === "moving") {
    // Moving Cloud with wind arrows
    ctx.fillStyle = "#e0f2fe";
    fillCloudPuffShape(ctx, x, y, w, h);

    ctx.fillStyle = "#0284c7";
    const arrowDir = plat.velocityX > 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x + w / 2 + 6 * arrowDir, y + h / 2);
    ctx.lineTo(x + w / 2 - 4 * arrowDir, y + h / 2 - 5);
    ctx.lineTo(x + w / 2 - 4 * arrowDir, y + h / 2 + 5);
    ctx.fill();
  } else {
    // Pure White Fluffy Cloud
    ctx.fillStyle = "#ffffff";
    fillCloudPuffShape(ctx, x, y, w, h);
  }
}

function fillCloudPuffShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const r = h / 2;
  ctx.beginPath();
  ctx.arc(x + r, y + r, r, Math.PI / 2, (3 * Math.PI) / 2);
  ctx.arc(x + w - r, y + r, r, (3 * Math.PI) / 2, Math.PI / 2);
  ctx.closePath();
  ctx.fill();

  // Top cloud volume puffs
  ctx.beginPath();
  ctx.arc(x + w * 0.28, y + 2, r * 0.85, 0, Math.PI * 2);
  ctx.arc(x + w * 0.52, y - 2, r * 1.15, 0, Math.PI * 2);
  ctx.arc(x + w * 0.74, y + 2, r * 0.85, 0, Math.PI * 2);
  ctx.fill();
}

// 4. SPACE COSMIC STAR PLATFORM
function drawSpacePlatform(
  ctx: CanvasRenderingContext2D,
  plat: Platform,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const shakeX = plat.type === "fragile" && plat.steppedOn ? (Math.random() - 0.5) * 4 : 0;
  ctx.translate(shakeX, 0);

  const time = Date.now() * 0.003;

  // A. Cosmic Crystalline Star Slab
  const starGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  starGrad.addColorStop(0, "#581c87");
  starGrad.addColorStop(0.5, "#7c3aed");
  starGrad.addColorStop(1, "#3b82f6");
  ctx.fillStyle = starGrad;
  ctx.shadowColor = "#a855f7";
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.roundRect(x, y + 2, w, h - 2, 8);
  ctx.fill();
  ctx.shadowBlur = 0;

  // B. Glowing Starlight Crystal Edge
  ctx.strokeStyle = "rgba(233, 213, 255, 0.85)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 3, w - 4, h - 6, 6);
  ctx.stroke();

  // C. Pulsing Cosmic Core in Center
  const pulse = 0.5 + 0.5 * Math.sin(time * 2);
  ctx.fillStyle = `rgba(192, 132, 252, ${0.4 + pulse * 0.5})`;
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2, 5 + pulse * 2, 0, Math.PI * 2);
  ctx.fill();

  // Star Constellation Spikes
  draw4PointStar(ctx, x + 12, y + h / 2, 4, "#67e8f9");
  draw4PointStar(ctx, x + w - 12, y + h / 2, 4, "#67e8f9");

  // Type Specific Extras
  if (plat.type === "booster") {
    // Supernova Pulsar
    const springH = 16 * (1 - (plat.springAnimation || 0) * 0.6);
    draw4PointStar(ctx, x + w / 2, y - springH, 12, "#c084fc");

    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + w / 2, y - springH, 14, 0, Math.PI * 2);
    ctx.stroke();
  } else if (plat.type === "moving") {
    // Orbital Comet Trail
    ctx.fillStyle = "#c084fc";
    const dir = plat.velocityX > 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x + w / 2 + 7 * dir, y + h / 2);
    ctx.lineTo(x + w / 2 - 5 * dir, y + h / 2 - 4);
    ctx.lineTo(x + w / 2 - 5 * dir, y + h / 2 + 4);
    ctx.fill();
  } else if (plat.type === "fragile" && plat.steppedOn) {
    // Dark Meteor Fractures
    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.25, y + 3);
    ctx.lineTo(x + w * 0.5, y + h - 3);
    ctx.lineTo(x + w * 0.75, y + 3);
    ctx.stroke();
  } else if (plat.type === "rare" && !plat.collected) {
    // Prismatic Cosmic Star
    drawRareGem(ctx, x + w / 2, y - 10, "#c084fc", "#38bdf8", "★ +1500");
  }
}

function draw4PointStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.lineTo(cx + Math.cos(angle + Math.PI / 4) * (radius * 0.35), cy + Math.sin(angle + Math.PI / 4) * (radius * 0.35));
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawRareGem(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  glowColor: string,
  label: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 12;

  // Star Diamond
  ctx.beginPath();
  ctx.moveTo(x, y - 7);
  ctx.lineTo(x + 7, y);
  ctx.lineTo(x, y + 7);
  ctx.lineTo(x - 7, y);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  // Score Badge
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "#000000";
  ctx.shadowBlur = 4;
  ctx.fillText(label, x, y - 10);

  ctx.restore();
}

// 5. CYBER TECHNOLOGICAL PLATFORM
function drawCyberPlatform(
  ctx: CanvasRenderingContext2D,
  plat: Platform,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const shakeX = plat.type === "fragile" && plat.steppedOn ? (Math.random() - 0.5) * 5 : 0;
  ctx.translate(shakeX, 0);

  const time = Date.now() * 0.003;

  // A. High-Tech Matrix Motherboard Slab
  const cyberGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  cyberGrad.addColorStop(0, "#083344");
  cyberGrad.addColorStop(0.5, "#0e7490");
  cyberGrad.addColorStop(1, "#164e63");
  ctx.fillStyle = cyberGrad;
  ctx.shadowColor = "#06b6d4";
  ctx.shadowBlur = 12;

  ctx.beginPath();
  ctx.roundRect(x, y + 2, w, h - 2, 4);
  ctx.fill();
  ctx.shadowBlur = 0;

  // B. Glowing Neon Cyan Circuit Tracks
  ctx.strokeStyle = "rgba(103, 232, 249, 0.9)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 3, w - 4, h - 6, 3);
  ctx.stroke();

  // Internal PCB trace tracks
  ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + h / 2);
  ctx.lineTo(x + w * 0.35, y + h / 2);
  ctx.lineTo(x + w * 0.45, y + 5);
  ctx.moveTo(x + w * 0.55, y + h - 5);
  ctx.lineTo(x + w * 0.65, y + h / 2);
  ctx.lineTo(x + w - 8, y + h / 2);
  ctx.stroke();

  // Microchips & Solder Nodes
  ctx.fillStyle = "#ec4899";
  ctx.fillRect(x + 10, y + h / 2 - 2, 4, 4);
  ctx.fillRect(x + w - 14, y + h / 2 - 2, 4, 4);

  // C. Central Pulsing Quantum Core Cell
  const pulse = 0.5 + 0.5 * Math.sin(time * 3);
  ctx.fillStyle = `rgba(6, 182, 212, ${0.4 + pulse * 0.6})`;
  ctx.shadowColor = "#06b6d4";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2, 4 + pulse * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Type Specific Extras
  if (plat.type === "booster") {
    // Quantum Energy Jump Pad
    const springH = 16 * (1 - (plat.springAnimation || 0) * 0.6);
    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x + w / 2, y - springH, 12, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#67e8f9";
    ctx.beginPath();
    ctx.arc(x + w / 2, y - springH, 6, 0, Math.PI * 2);
    ctx.fill();

    // Energy rings
    ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y - springH * 0.5, 14, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (plat.type === "moving") {
    // Laser Guidance Arrow
    ctx.fillStyle = "#67e8f9";
    const dir = plat.velocityX > 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x + w / 2 + 7 * dir, y + h / 2);
    ctx.lineTo(x + w / 2 - 6 * dir, y + h / 2 - 4);
    ctx.lineTo(x + w / 2 - 6 * dir, y + h / 2 + 4);
    ctx.fill();
  } else if (plat.type === "fragile" && plat.steppedOn) {
    // Glitch Scanlines & Deletion Warning
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 4);
    ctx.lineTo(x + w - 4, y + h - 4);
    ctx.moveTo(x + 4, y + h - 4);
    ctx.lineTo(x + w - 4, y + 4);
    ctx.stroke();
  } else if (plat.type === "rare" && !plat.collected) {
    // Holographic Quantum Cube
    drawRareGem(ctx, x + w / 2, y - 10, "#06b6d4", "#ec4899", "★ +1500");
  }
}

// 6. DIMENSIONAL PORTAL RENDERING
export function drawDimensionalPortal(
  ctx: CanvasRenderingContext2D,
  plat: Platform,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const time = Date.now() * 0.002;
  const isToCyber = plat.portal === "to_cyber";

  const primaryColor = isToCyber ? "#06b6d4" : "#a855f7";
  const secondaryColor = isToCyber ? "#ec4899" : "#38bdf8";
  const portalTitle = isToCyber ? "🌌 PORTAL DIMENSIONAL" : "✨ PORTAL CÓSMICO";
  const portalSubtitle = isToCyber ? "ENTRADA PARA DIMENSÃO TECNOLÓGICA" : "RETORNO AO ESPAÇO SIDERAL";

  const portalCenterX = x + w / 2;
  const portalCenterY = y - 48;

  ctx.save();

  // 1. Vertical Upward Light Beacon Beam
  const beamGrad = ctx.createLinearGradient(0, portalCenterY, 0, portalCenterY - 140);
  beamGrad.addColorStop(0, isToCyber ? "rgba(6, 182, 212, 0.45)" : "rgba(168, 85, 247, 0.45)");
  beamGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = beamGrad;
  ctx.fillRect(portalCenterX - 28, portalCenterY - 140, 56, 140);

  // 2. Outer Rotating Particle Vortex
  ctx.save();
  ctx.translate(portalCenterX, portalCenterY);

  for (let i = 0; i < 6; i++) {
    const angle = time * (isToCyber ? 2.5 : -2.5) + (i * Math.PI) / 3;
    const r = 32 + Math.sin(time * 4 + i) * 4;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * (r * 0.6);
    ctx.fillStyle = i % 2 === 0 ? primaryColor : secondaryColor;
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Glowing Dimensional Event Horizon (Outer Ring)
  ctx.save();
  ctx.translate(portalCenterX, portalCenterY);
  ctx.rotate(time * 0.8);
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3.5;
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.ellipse(0, 0, 36, 26, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Spinning Ring
  ctx.rotate(-time * 1.6);
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = secondaryColor;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 18, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Core Singularity
  const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
  coreGrad.addColorStop(0, "#ffffff");
  coreGrad.addColorStop(0.5, primaryColor);
  coreGrad.addColorStop(1, "rgba(15, 23, 42, 0.95)");
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Floating Holographic Portal Title Pill
  ctx.shadowBlur = 0;
  const pillW = 200;
  const pillH = 34;
  const pillY = portalCenterY - 58;

  ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = 12;

  ctx.beginPath();
  ctx.roundRect(portalCenterX - pillW / 2, pillY, pillW, pillH, 10);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Title text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#000000";
  ctx.shadowBlur = 4;
  ctx.fillText(portalTitle, portalCenterX, pillY + 11);

  // Subtitle
  ctx.fillStyle = primaryColor;
  ctx.font = "bold 9px system-ui, sans-serif";
  ctx.fillText(portalSubtitle, portalCenterX, pillY + 24);

  // 5. Pulsing Altar Platform Base Glow
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = 10;
  ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);

  ctx.restore();
}

// 5. STAGE WELCOME BANNER DISPLAY ("BEM-VINDO A TAL LUGAR")
export function drawStageWelcomeBanner(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  banner: BiomeBannerData
) {
  const timeProgress = banner.timer / banner.maxTimer; // 1 -> 0
  let alpha = 1;
  let scale = 1;

  // Fade and scale in at start (first 0.4s)
  const enterDuration = 0.4;
  const elapsed = banner.maxTimer - banner.timer;
  if (elapsed < enterDuration) {
    const p = elapsed / enterDuration;
    alpha = p;
    scale = 0.85 + 0.15 * p;
  } else if (banner.timer < 0.6) {
    // Fade out at end
    const p = banner.timer / 0.6;
    alpha = p;
    scale = 0.95 + 0.05 * p;
  }

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.translate(cw / 2, 140);
  ctx.scale(scale, scale);

  const bannerW = Math.min(cw - 36, 420);
  const bannerH = 92;

  // Drop shadow
  ctx.shadowColor = banner.color;
  ctx.shadowBlur = 24;

  // Outer Glowing Container
  ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
  ctx.strokeStyle = banner.color;
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.roundRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH, 20);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Stage Badge Pill (Top Center)
  ctx.fillStyle = banner.color;
  ctx.beginPath();
  ctx.roundRect(-55, -bannerH / 2 - 11, 110, 22, 11);
  ctx.fill();

  ctx.fillStyle = "#0f172a";
  ctx.font = "black 10px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`★ FASE ${banner.phase} ★`, 0, -bannerH / 2);

  // Main Welcome Headline
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#000000";
  ctx.shadowBlur = 6;
  ctx.fillText(banner.welcome, 0, -6);

  // Subtitle / Platform instructions
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "600 12px system-ui, sans-serif";
  ctx.fillText(banner.subtitle, 0, 20);

  ctx.restore();
}

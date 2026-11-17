import React, { useEffect, useRef } from "react";
import { BiomeType, Character, GameState, Obstacle, Particle, Platform, PlayerState } from "../types";
import { sound } from "../utils/audio";
import {
  BASE_ACCELERATION,
  BASE_AIR_CONTROL,
  BASE_APEX_GRAVITY_MULT,
  BASE_FALL_GRAVITY_MULT,
  BASE_FRICTION,
  BASE_GRAVITY,
  BASE_JUMP_FORCE,
  BASE_MOVE_SPEED,
  COYOTE_TIME_WINDOW,
  JUMP_BUFFER_WINDOW,
  TERMINAL_VELOCITY,
  calculateDifficulty,
  calculateHorizontalReach,
  calculateMaxJumpHeight,
} from "../utils/physics";
import {
  BiomeBannerData,
  drawBiomeBackground,
  drawBiomePlatform,
  drawStageWelcomeBanner,
} from "../utils/biomeRenderer";

interface GameCanvasProps {
  character: Character;
  gameState: GameState;
  onGameOver: (finalScore: number, finalHeight: number, finalLevel: number, character: Character) => void;
  onScoreUpdate: (score: number, height: number, level: number, combo: number, lavaDistance: number) => void;
  onAbilityStateChange: (active: boolean, timer: number, cooldownTimer: number, fenixAvailable: boolean) => void;
  onNewHighScoreAchieved: (score: number) => void;
  highScore: number;
  mobileInputs: {
    left: boolean;
    right: boolean;
    jump: boolean;
    ability: boolean;
  };
  triggerAbilityTrigger: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  character,
  gameState,
  onGameOver,
  onScoreUpdate,
  onAbilityStateChange,
  onNewHighScoreAchieved,
  highScore,
  mobileInputs,
  triggerAbilityTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References to keep game loop running without React state lag
  const stateRef = useRef<{
    gameState: GameState;
    character: Character;
    player: PlayerState;
    cameraY: number;
    targetCameraY: number;
    lavaY: number;
    highestY: number;
    score: number;
    combo: number;
    lastLandPlatformId: string | null;
    platforms: Platform[];
    obstacles: Obstacle[];
    particles: Particle[];
    highestGeneratedY: number;
    keys: { [key: string]: boolean };
    lastTime: number;
    level: number;
    hasPassedHighScore: boolean;
    fenixAvailable: boolean;
    rockyShockwaves: { x: number; y: number; radius: number; maxRadius: number; alpha: number }[];
    rareCollectedCount: number;
    dangerLevel: number; // 0 to 1
    coyoteTimer: number;
    jumpBufferTimer: number;
    lastTriggeredPhase: number;
    biomeAnnouncement: BiomeBannerData | null;
    dimension: "earth_space" | "cyber";
    portalSpawned: boolean;
    portalCooldown: number;
    dimensionalFlashTimer: number;
    dimensionStartY: number;
    dimensionPlatformCount: number;
  }>({
    gameState,
    character,
    player: {
      x: 240,
      y: 600,
      width: 38,
      height: 48,
      vx: 0,
      vy: 0,
      isGrounded: true,
      facing: "right",
      squashX: 1,
      squashY: 1,
      landStreak: 0,
      jumpsDone: 0,
      abilityActive: false,
      abilityTimer: 0,
      abilityCooldownTimer: 0,
      fenixRevived: false,
      invulnerableTimer: 0,
      floating: false,
      dashTimer: 0,
      dashDir: 1,
      trail: [],
    },
    cameraY: 0,
    targetCameraY: 0,
    lavaY: 1100, // Starts below first platform
    highestY: 600,
    score: 0,
    combo: 0,
    lastLandPlatformId: null,
    platforms: [],
    obstacles: [],
    particles: [],
    highestGeneratedY: 600,
    keys: {},
    lastTime: 0,
    level: 1,
    hasPassedHighScore: false,
    fenixAvailable: character.id === "fenix",
    rockyShockwaves: [],
    rareCollectedCount: 0,
    dangerLevel: 0,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    lastTriggeredPhase: 0,
    biomeAnnouncement: null,
    dimension: "earth_space",
    portalSpawned: false,
    portalCooldown: 0,
    dimensionalFlashTimer: 0,
    dimensionStartY: 600,
    dimensionPlatformCount: 0,
  });

  // Keep latest mobileInputs and highScore references so requestAnimationFrame loop never uses stale props
  const mobileInputsRef = useRef(mobileInputs);
  mobileInputsRef.current = mobileInputs;

  const highScoreRef = useRef(highScore);
  highScoreRef.current = highScore;

  // Synchronize character change
  useEffect(() => {
    stateRef.current.character = character;
    stateRef.current.fenixAvailable = character.id === "fenix";
  }, [character]);

  // Synchronize gameState change
  useEffect(() => {
    const prevState = stateRef.current.gameState;
    stateRef.current.gameState = gameState;

    if (gameState === "playing" && prevState !== "playing" && prevState !== "paused") {
      resetGame();
    }
  }, [gameState]);

  // Trigger ability from mobile or props
  useEffect(() => {
    if (triggerAbilityTrigger > 0 && stateRef.current.gameState === "playing") {
      triggerAbility();
    }
  }, [triggerAbilityTrigger]);

  const triggerAbility = () => {
    const s = stateRef.current;
    const p = s.player;
    const c = s.character;

    if (p.abilityActive || p.abilityCooldownTimer > 0) return;

    if (c.ability === "dash") {
      p.abilityActive = true;
      p.abilityTimer = c.duration;
      p.abilityCooldownTimer = c.cooldown;
      const mInputs = mobileInputsRef.current;
      const steer = (s.keys["ArrowLeft"] || s.keys["KeyA"] || mInputs.left) ? -1 : (s.keys["ArrowRight"] || s.keys["KeyD"] || mInputs.right) ? 1 : 0;
      p.dashDir = steer;
      p.dashTimer = 0.35;
      p.vy = -1150; // Super Dash Vertical para cima!
      p.vx = steer * 360;
      p.isGrounded = false;
      p.squashX = 0.52;
      p.squashY = 1.75;
      sound.playDash();
      createBurstParticles(p.x + p.width / 2, p.y + p.height, "#f59e0b", 35, "spark");
      createBurstParticles(p.x + p.width / 2, p.y + p.height, "#ef4444", 20, "spark");
      createBurstParticles(p.x + p.width / 2, p.y + p.height / 2, "#fef08a", 25, "spark");
    } else if (c.ability === "superSalto") {
      p.abilityActive = true;
      p.abilityTimer = c.duration;
      p.abilityCooldownTimer = c.cooldown;
      p.vy = -BASE_JUMP_FORCE * c.jump * 1.65;
      p.isGrounded = false;
      p.squashX = 0.65;
      p.squashY = 1.45;
      sound.playJump(true);
      createBurstParticles(p.x + p.width / 2, p.y + p.height, "#6ee7b7", 30, "feather");
    } else if (c.ability === "impacto") {
      p.abilityActive = true;
      p.abilityTimer = c.duration;
      p.abilityCooldownTimer = c.cooldown;
      p.vy = 800; // slam down
      sound.playImpact();
      s.rockyShockwaves.push({
        x: p.x + p.width / 2,
        y: p.y + p.height,
        radius: 10,
        maxRadius: 280,
        alpha: 1,
      });
      // push lava down slightly
      s.lavaY += 120;
      createBurstParticles(p.x + p.width / 2, p.y + p.height, "#ec4899", 35, "spark");
    } else if (c.ability === "flutuar") {
      p.abilityActive = true;
      p.abilityTimer = c.duration;
      p.abilityCooldownTimer = c.cooldown;
      p.floating = true;
      p.vy = Math.min(p.vy, 40);
      sound.playFloat();
      createBurstParticles(p.x + p.width / 2, p.y, "#a5f3fc", 25, "cloud");
    } else if (c.ability === "impulso") {
      p.abilityActive = true;
      p.abilityTimer = c.duration;
      p.abilityCooldownTimer = c.cooldown;
      sound.playBooster();
      createBurstParticles(p.x + p.width / 2, p.y + p.height / 2, "#facc15", 25, "spark");
    }
  };

  const createBurstParticles = (
    x: number,
    y: number,
    color: string,
    count: number,
    shape: "circle" | "spark" | "cloud" | "feather" | "star" = "circle",
    speedFactor = 1
  ) => {
    const s = stateRef.current;
    for (let i = 0; i < count; i++) {
      if (s.particles.length > 250) s.particles.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 260 + 60) * speedFactor;
      s.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        size: Math.random() * 6 + 3,
        color,
        alpha: 1,
        decay: Math.random() * 1.5 + 1.2,
        gravity: shape === "cloud" ? -20 : 150,
        shape,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 6,
      });
    }
  };

  const resetGame = () => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    const cw = canvas ? canvas.width : 480;

    s.cameraY = 0;
    s.targetCameraY = 0;
    s.highestY = 560;
    s.score = 0;
    s.combo = 0;
    s.lastLandPlatformId = null;
    s.hasPassedHighScore = false;
    s.level = 1;
    s.dimension = "earth_space";
    s.portalSpawned = false;
    s.portalCooldown = 0;
    s.dimensionalFlashTimer = 0;
    s.dimensionStartY = 540;
    s.dimensionPlatformCount = 0;
    s.fenixAvailable = s.character.id === "fenix";
    s.rockyShockwaves = [];
    s.particles = [];
    s.obstacles = [];
    s.dangerLevel = 0;
    s.coyoteTimer = 0;
    s.jumpBufferTimer = 0;
    s.lastTriggeredPhase = 1;
    s.biomeAnnouncement = {
      phase: 1,
      title: "FLORESTA ENCANTADA",
      welcome: "🌲 BEM-VINDO À FLORESTA ENCANTADA!",
      subtitle: "Pule nos blocos de terra e grama viva!",
      icon: "🌲",
      color: "#22c55e",
      timer: 3.5,
      maxTimer: 3.5,
    };

    const startX = cw / 2 - 20;
    const startY = 540;

    s.player = {
      x: startX,
      y: startY,
      width: 40,
      height: 48,
      vx: 0,
      vy: 0,
      isGrounded: true,
      facing: "right",
      squashX: 1,
      squashY: 1,
      landStreak: 0,
      jumpsDone: 0,
      abilityActive: false,
      abilityTimer: 0,
      abilityCooldownTimer: 0,
      fenixRevived: false,
      invulnerableTimer: 0,
      floating: false,
      dashTimer: 0,
      dashDir: 1,
      trail: [],
    };

    s.lavaY = startY + 540; // Safe and forgiving distance at start

    // Generate initial platforms
    s.platforms = [];
    // Solid base starter earth block
    s.platforms.push({
      id: "plat-start",
      x: startX - 50,
      y: startY + 48,
      width: 140,
      height: 28,
      type: "normal",
      biome: "forest",
      velocityX: 0,
    });

    s.highestGeneratedY = startY + 48;

    // Generate first 16 platforms upward
    for (let i = 0; i < 16; i++) {
      generateNextPlatform(cw);
    }
  };

  const warpToDimension = (targetDimension: "earth_space" | "cyber") => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    const cw = canvas ? canvas.width : 480;

    s.dimension = targetDimension;
    s.portalSpawned = false;
    s.portalCooldown = 3.5; // Immunity/cooldown to prevent accidental immediate re-trigger
    s.dimensionalFlashTimer = 1.0;
    s.dimensionStartY = s.player.y;
    s.dimensionPlatformCount = 0;

    if (targetDimension === "cyber") {
      sound.playPortalWarp(false);
      s.score += 3000;
      s.lastTriggeredPhase = 5;
      s.biomeAnnouncement = {
        phase: 5,
        title: "DIMENSÃO TECNOLÓGICA",
        welcome: "⚡ BEM-VINDO À DIMENSÃO TECNOLÓGICA!",
        subtitle: "Pule nos circuitos quânticos e matriz de neon!",
        icon: "⚡",
        color: "#06b6d4",
        timer: 4.0,
        maxTimer: 4.0,
      };
      sound.playBiomeWelcome(5);
      createBurstParticles(s.player.x + s.player.width / 2, s.player.y, "#06b6d4", 60, "spark");
      createBurstParticles(s.player.x + s.player.width / 2, s.player.y, "#ec4899", 40, "spark");
    } else {
      sound.playPortalWarp(true);
      s.score += 5000;
      s.lastTriggeredPhase = 4;
      s.biomeAnnouncement = {
        phase: 4,
        title: "ESPAÇO SIDERAL CÓSMICO",
        welcome: "✨ BEM-VINDO DE VOLTA AO ESPAÇO!",
        subtitle: "Você dominou o portal tecnológico! Continue subindo!",
        icon: "✨",
        color: "#a855f7",
        timer: 4.0,
        maxTimer: 4.0,
      };
      sound.playBiomeWelcome(4);
      createBurstParticles(s.player.x + s.player.width / 2, s.player.y, "#a855f7", 60, "star");
      createBurstParticles(s.player.x + s.player.width / 2, s.player.y, "#38bdf8", 40, "star");
    }

    // Launch player upward into the new realm with an exhilarating warp leap
    s.player.vy = -BASE_JUMP_FORCE * 1.35;
    s.player.isGrounded = false;
    s.player.squashX = 0.65;
    s.player.squashY = 1.45;

    // Reset base platform under player in the new dimension
    const basePlatY = s.player.y + s.player.height + 15;
    s.platforms = [
      {
        id: "plat-dim-entry-" + Date.now(),
        x: Math.max(20, Math.min(cw - 160, s.player.x - 50)),
        y: basePlatY,
        width: 140,
        height: 26,
        type: "normal",
        biome: targetDimension === "cyber" ? "cyber" : "space",
        velocityX: 0,
      },
    ];

    s.highestGeneratedY = basePlatY;
    s.lavaY = s.player.y + 580; // Safe distance below
    s.obstacles = [];

    // Pre-generate 16 platforms upward in the new dimension
    for (let i = 0; i < 16; i++) {
      generateNextPlatform(cw);
    }
  };

  const generateNextPlatform = (canvasWidth: number) => {
    const s = stateRef.current;
    s.dimensionPlatformCount++;

    let heightInMeters = 0;
    let diff: ReturnType<typeof calculateDifficulty>;

    if (s.dimension === "cyber") {
      // In Cyber Dimension, measure altitude relative to dimension entry point
      const cyberClimb = Math.max(0, Math.floor((s.dimensionStartY - s.highestGeneratedY) / 10));
      heightInMeters = cyberClimb;
      diff = calculateDifficulty(cyberClimb, "cyber");
    } else {
      // In Earth/Space Dimension, measure total height
      const earthAlt = Math.max(0, Math.floor((560 - s.highestGeneratedY) / 10));
      heightInMeters = earthAlt;
      diff = calculateDifficulty(earthAlt, "earth_space");
    }

    const prevPlat = s.platforms[s.platforms.length - 1];

    // Gap calculation
    const maxH = calculateMaxJumpHeight(s.character);
    const maxReach = calculateHorizontalReach(s.character);

    const gapY = Math.random() * (diff.platformMaxGap - diff.platformMinGap) + diff.platformMinGap;
    const newY = prevPlat.y - Math.min(gapY, maxH * 0.88);

    // Check if we should spawn the Dimensional Portal:
    // 1. In Space biome (when dimension is earth_space and altitude >= 850m or 28+ platforms in Space)
    // 2. In Cyber dimension (after climbing 320m / 24+ platforms inside Cyber Matrix)
    const shouldSpawnSpaceToCyberPortal =
      s.dimension === "earth_space" &&
      (heightInMeters >= 850 || s.dimensionPlatformCount >= 28) &&
      !s.portalSpawned;

    const shouldSpawnCyberToSpacePortal =
      s.dimension === "cyber" &&
      (heightInMeters >= 320 || s.dimensionPlatformCount >= 24) &&
      !s.portalSpawned;

    if (shouldSpawnSpaceToCyberPortal || shouldSpawnCyberToSpacePortal) {
      s.portalSpawned = true;
      const portalType = shouldSpawnSpaceToCyberPortal ? "to_cyber" : "to_space";
      const portalWidth = 150;
      const portalX = (canvasWidth - portalWidth) / 2;

      const portalPlatform: Platform = {
        id: "plat-portal-" + Math.random().toString(36).substring(2, 9),
        x: portalX,
        y: newY,
        width: portalWidth,
        height: 28,
        type: "normal",
        biome: s.dimension === "cyber" ? "cyber" : "space",
        portal: portalType,
        velocityX: 0,
      };

      s.platforms.push(portalPlatform);
      s.highestGeneratedY = newY;
      return;
    }

    // Platform Type distribution based on difficulty
    const rand = Math.random();
    let type: Platform["type"] = "normal";
    let width = 110;

    if (rand < diff.rarePlatformChance) {
      type = "rare";
      width = 95;
    } else if (rand < diff.rarePlatformChance + diff.boosterPlatformChance) {
      type = "booster";
      width = 90;
    } else if (rand < diff.rarePlatformChance + diff.boosterPlatformChance + diff.fragilePlatformChance) {
      type = "fragile";
      width = 85;
    } else if (rand < diff.rarePlatformChance + diff.boosterPlatformChance + diff.fragilePlatformChance + diff.movingPlatformChance) {
      type = "moving";
      width = 95;
    } else if (rand < diff.rarePlatformChance + diff.boosterPlatformChance + diff.fragilePlatformChance + diff.movingPlatformChance + diff.smallPlatformChance) {
      type = "small";
      width = 65;
    } else {
      type = "normal";
      width = 110;
    }

    // Determine horizontal X position ensuring reachability from previous
    const minX = 20;
    const maxX = canvasWidth - width - 20;

    const prevCenterX = prevPlat.x + prevPlat.width / 2;
    const allowedSpan = Math.min(maxReach * 0.82, canvasWidth * 0.65);

    const targetMinX = Math.max(minX, prevCenterX - allowedSpan - width / 2);
    const targetMaxX = Math.min(maxX, prevCenterX + allowedSpan - width / 2);

    let newX = Math.random() * (targetMaxX - targetMinX) + targetMinX;
    newX = Math.max(minX, Math.min(maxX, newX));

    let velX = 0;
    if (type === "moving") {
      velX = (Math.random() > 0.5 ? 1 : -1) * (50 + Math.min(100, diff.level * 12));
    }

    const newPlatform: Platform = {
      id: "plat-" + Math.random().toString(36).substring(2, 9),
      x: newX,
      y: newY,
      width,
      height: 24,
      type,
      biome: diff.biome,
      velocityX: velX,
      minX: 15,
      maxX: canvasWidth - width - 15,
      breakTimer: type === "fragile" ? 0.65 : undefined,
    };

    s.platforms.push(newPlatform);
    s.highestGeneratedY = newY;

    // Obstacle generation
    if (diff.obstacleChance > 0 && Math.random() < diff.obstacleChance && s.obstacles.length < 6) {
      const obsType = Math.random() > 0.4 ? "fireball" : "rock";
      s.obstacles.push({
        id: "obs-" + Math.random().toString(36).substring(2, 9),
        x: Math.random() * (canvasWidth - 60) + 30,
        y: newY - Math.random() * 80 - 40,
        radius: obsType === "fireball" ? 14 : 16,
        type: obsType,
        velocityX: (Math.random() - 0.5) * 80,
        velocityY: obsType === "fireball" ? (Math.random() * 40 - 20) : (Math.random() * 30 + 10),
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 4,
        alive: true,
      });
    }
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      sound.init();
      stateRef.current.keys[e.code] = true;

      if (e.code === "KeyP") {
        // Toggle pause handled in parent
      } else if (e.code === "KeyE" || e.code === "ShiftLeft" || e.code === "ShiftRight") {
        triggerAbility();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Main Game Loop
  useEffect(() => {
    let animationFrameId: number;

    const loop = (timestamp: number) => {
      const s = stateRef.current;
      if (!s.lastTime) s.lastTime = timestamp;
      const deltaTime = Math.min((timestamp - s.lastTime) / 1000, 0.1); // clamp delta
      s.lastTime = timestamp;

      if (s.gameState === "playing") {
        updateGame(deltaTime);
      }

      renderGame();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const updateGame = (dt: number) => {
    const s = stateRef.current;
    const p = s.player;
    const c = s.character;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasWidth = canvas.width;
    const currentHeightMeters = Math.max(0, Math.floor((560 - s.highestY) / 10));
    const diff = calculateDifficulty(currentHeightMeters, s.dimension);
    s.level = diff.level;

    if (s.dimensionalFlashTimer > 0) {
      s.dimensionalFlashTimer = Math.max(0, s.dimensionalFlashTimer - dt);
    }

    if (s.portalCooldown > 0) {
      s.portalCooldown = Math.max(0, s.portalCooldown - dt);
    }

    // Ability timer updates
    if (p.abilityCooldownTimer > 0) {
      p.abilityCooldownTimer = Math.max(0, p.abilityCooldownTimer - dt);
    }
    if (p.abilityActive) {
      p.abilityTimer -= dt;
      if (p.abilityTimer <= 0) {
        p.abilityActive = false;
        p.floating = false;
      }
    }
    if (p.invulnerableTimer > 0) {
      p.invulnerableTimer = Math.max(0, p.invulnerableTimer - dt);
    }

    onAbilityStateChange(
      p.abilityActive,
      p.abilityTimer,
      p.abilityCooldownTimer,
      s.fenixAvailable
    );

    const mInputs = mobileInputsRef.current;

    // Horizontal Input
    let moveInput = 0;
    if (s.keys["ArrowLeft"] || s.keys["KeyA"] || mInputs.left) {
      moveInput -= 1;
      p.facing = "left";
    }
    if (s.keys["ArrowRight"] || s.keys["KeyD"] || mInputs.right) {
      moveInput += 1;
      p.facing = "right";
    }

    // Ability triggers via mobile button
    if (mInputs.ability) {
      triggerAbility();
    }

    // Leo's passive impulso boost
    let effectiveSpeedMult = c.speed;
    if (c.ability === "impulso" && p.abilityActive) {
      effectiveSpeedMult *= 1.45;
    }

    // Movement Physics
    if (p.dashTimer > 0) {
      p.dashTimer -= dt;
      p.vy = Math.min(p.vy, -950); // Continua impulsionando para cima com força máxima
      if (p.dashDir !== 0) {
        p.vx = p.dashDir * 420;
      }
      if (Math.random() < 0.75) {
        createBurstParticles(p.x + p.width / 2, p.y + p.height, "#f59e0b", 2, "spark");
      }
    } else {
      const airMult = p.isGrounded ? 1 : c.airControl * BASE_AIR_CONTROL;
      const targetSpeed = moveInput * BASE_MOVE_SPEED * effectiveSpeedMult;
      p.vx += (targetSpeed - p.vx) * (BASE_ACCELERATION / 1000) * dt * airMult * 6;
      p.vx *= Math.pow(BASE_FRICTION, dt * 60);
    }

    p.x += p.vx * dt;

    // Screen wrapping / walls
    if (p.x + p.width < 0) {
      p.x = canvasWidth;
    } else if (p.x > canvasWidth) {
      p.x = -p.width;
    }

    // Jump Input Buffering & Coyote Time Management
    const wantsJump = s.keys["Space"] || s.keys["ArrowUp"] || s.keys["KeyW"] || mInputs.jump;
    
    if (wantsJump) {
      s.jumpBufferTimer = JUMP_BUFFER_WINDOW;
    } else {
      s.jumpBufferTimer = Math.max(0, s.jumpBufferTimer - dt);
    }

    if (p.isGrounded) {
      s.coyoteTimer = COYOTE_TIME_WINDOW;
    } else {
      s.coyoteTimer = Math.max(0, s.coyoteTimer - dt);
    }

    // Trigger Jump from buffer or coyote time (100% full force)
    if ((s.jumpBufferTimer > 0 || wantsJump) && (p.isGrounded || s.coyoteTimer > 0)) {
      let jumpForce = BASE_JUMP_FORCE * c.jump;
      if (c.ability === "impulso" && p.abilityActive) jumpForce *= 1.25;

      p.vy = -jumpForce;
      p.isGrounded = false;
      s.coyoteTimer = 0;
      s.jumpBufferTimer = 0;
      p.squashX = 0.64;
      p.squashY = 1.44;
      sound.playJump(false);
      createBurstParticles(p.x + p.width / 2, p.y + p.height, diff.biomeColor, 12, "cloud");
    }

    // Variable Jump Cut (Gentle damping only at high vertical speed so short taps still reach 85%+ height)
    if (p.vy < -340 && !wantsJump && !p.floating && !(c.ability === "flutuar" && p.abilityActive)) {
      p.vy += BASE_GRAVITY * 0.35 * dt;
    }

    // Gravity calculation with Apex Float & Fast Fall
    let effectiveGravity = BASE_GRAVITY * c.gravity;

    if (p.floating || (c.ability === "flutuar" && p.abilityActive)) {
      effectiveGravity *= 0.2;
      if (p.vy > 110) p.vy = 110; // Suave deslizamento no ar
    } else {
      // 1. Apex Float (Hang-Time no topo do pulo)
      if (Math.abs(p.vy) < 95) {
        effectiveGravity *= BASE_APEX_GRAVITY_MULT;
      }
      // 2. Fast Fall (Gravidade firme e não-flutuante na descida)
      else if (p.vy > 0) {
        effectiveGravity *= BASE_FALL_GRAVITY_MULT;
      }
    }

    p.vy += effectiveGravity * dt;

    // Terminal velocity clamp
    if (p.vy > TERMINAL_VELOCITY && !p.floating) {
      p.vy = TERMINAL_VELOCITY;
    }

    p.y += p.vy * dt;

    // Squash & stretch recovery
    p.squashX += (1 - p.squashX) * dt * 8;
    p.squashY += (1 - p.squashY) * dt * 8;

    // Character trail
    if (p.abilityActive || Math.abs(p.vx) > 300 || p.vy < -500) {
      p.trail.push({
        x: p.x,
        y: p.y,
        alpha: 0.6,
        color: c.color,
      });
      if (p.trail.length > 8) p.trail.shift();
    }
    p.trail.forEach((t) => {
      t.alpha -= dt * 3;
    });
    p.trail = p.trail.filter((t) => t.alpha > 0);

    // Update Platforms
    p.isGrounded = false;
    s.platforms.forEach((plat) => {
      // Move moving platforms
      if (plat.type === "moving") {
        plat.x += plat.velocityX * dt;
        if (plat.minX !== undefined && plat.x < plat.minX) {
          plat.x = plat.minX;
          plat.velocityX *= -1;
        } else if (plat.maxX !== undefined && plat.x > plat.maxX) {
          plat.x = plat.maxX;
          plat.velocityX *= -1;
        }
      }

      // Fragile platform countdown
      if (plat.steppedOn && plat.breakTimer !== undefined && !plat.isBroken) {
        plat.breakTimer -= dt;
        if (plat.breakTimer <= 0) {
          plat.isBroken = true;
          sound.playBreak();
          createBurstParticles(plat.x + plat.width / 2, plat.y + plat.height / 2, "#94a3b8", 22, "cloud");
        }
      }

      // Spring booster animation recovery
      if (plat.springAnimation && plat.springAnimation > 0) {
        plat.springAnimation = Math.max(0, plat.springAnimation - dt * 3);
      }

      // Dimensional Portal Proximity / Vortex interaction
      if (plat.portal && s.portalCooldown <= 0) {
        const portalCenterX = plat.x + plat.width / 2;
        const portalCenterY = plat.y - 36;
        const dist = Math.hypot(p.x + p.width / 2 - portalCenterX, p.y + p.height / 2 - portalCenterY);
        if (dist < 58) {
          if (plat.portal === "to_cyber") {
            warpToDimension("cyber");
            return;
          } else if (plat.portal === "to_space") {
            warpToDimension("earth_space");
            return;
          }
        }
      }

      // Platform Collision (One-way top landing when falling)
      if (!plat.isBroken && p.vy > 0) {
        const playerBottom = p.y + p.height;
        const prevBottom = playerBottom - p.vy * dt;
        const platTop = plat.y;

        if (
          prevBottom <= platTop + 8 &&
          playerBottom >= platTop &&
          p.x + p.width * 0.75 >= plat.x &&
          p.x + p.width * 0.25 <= plat.x + plat.width
        ) {
          // Check for dimensional portal landing!
          if (plat.portal && s.portalCooldown <= 0) {
            if (plat.portal === "to_cyber") {
              warpToDimension("cyber");
              return;
            } else if (plat.portal === "to_space") {
              warpToDimension("earth_space");
              return;
            }
          }

          // Landed!
          p.y = platTop - p.height;
          p.vy = 0;
          p.isGrounded = true;
          p.squashX = 1.35;
          p.squashY = 0.72;

          // If jump is pressed or buffered on landing, launch immediately with full force!
          if (wantsJump || s.jumpBufferTimer > 0) {
            let jumpForce = BASE_JUMP_FORCE * c.jump;
            if (c.ability === "impulso" && p.abilityActive) jumpForce *= 1.25;
            p.vy = -jumpForce;
            p.isGrounded = false;
            s.coyoteTimer = 0;
            s.jumpBufferTimer = 0;
            p.squashX = 0.64;
            p.squashY = 1.44;
            sound.playJump(false);
            createBurstParticles(p.x + p.width / 2, platTop, diff.biomeColor, 10, "cloud");
          }

          if (s.lastLandPlatformId !== plat.id) {
            s.lastLandPlatformId = plat.id;
            p.landStreak++;
            sound.playLand();
            createBurstParticles(p.x + p.width / 2, platTop, "#ffffff", 12, "cloud");

            // Rare bonus collectible
            if (plat.type === "rare" && !plat.collected) {
              plat.collected = true;
              s.score += 1500;
              s.rareCollectedCount++;
              sound.playRareCollect();
              createBurstParticles(plat.x + plat.width / 2, platTop, "#fbbf24", 30, "star");
            }

            // Booster platform
            if (plat.type === "booster") {
              plat.springAnimation = 1;
              p.vy = -BASE_JUMP_FORCE * c.jump * 1.85;
              p.isGrounded = false;
              p.squashX = 0.65;
              p.squashY = 1.45;
              sound.playBooster();
              createBurstParticles(plat.x + plat.width / 2, platTop, "#38bdf8", 25, "feather");
            }

            // Fragile trigger
            if (plat.type === "fragile") {
              plat.steppedOn = true;
            }

            // Leo passive boost after streak
            if (c.ability === "impulso" && p.landStreak % 3 === 0 && !p.abilityActive) {
              p.abilityActive = true;
              p.abilityTimer = 3.5;
              sound.playBooster();
              createBurstParticles(p.x + p.width / 2, p.y + p.height / 2, "#facc15", 20, "spark");
            }
          }
        }
      }
    });

    // Biome Phase Progression & Announcement Trigger
    if (diff.biomePhase !== s.lastTriggeredPhase) {
      s.lastTriggeredPhase = diff.biomePhase;
      s.biomeAnnouncement = {
        phase: diff.biomePhase,
        title: diff.biomeTitle,
        welcome: diff.biomeWelcome,
        subtitle: diff.biomeSubtitle,
        icon: diff.biomeIcon,
        color: diff.biomeColor,
        timer: 3.8,
        maxTimer: 3.8,
      };
      sound.playBiomeWelcome(diff.biomePhase);
      createBurstParticles(
        canvasWidth / 2,
        p.y - 120,
        diff.biomeColor,
        40,
        diff.biomePhase === 4 ? "star" : diff.biomePhase === 1 ? "cloud" : "spark"
      );
    }

    if (s.biomeAnnouncement) {
      s.biomeAnnouncement.timer -= dt;
      if (s.biomeAnnouncement.timer <= 0) {
        s.biomeAnnouncement = null;
      }
    }

    // Update Shockwaves (Rocky ability)
    s.rockyShockwaves.forEach((sw) => {
      sw.radius += dt * 500;
      sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);
      // Destroy obstacles hit by shockwave
      s.obstacles.forEach((obs) => {
        const dist = Math.hypot(obs.x - sw.x, obs.y - sw.y);
        if (dist <= sw.radius + obs.radius && obs.alive) {
          obs.alive = false;
          createBurstParticles(obs.x, obs.y, "#f97316", 20, "spark");
        }
      });
    });
    s.rockyShockwaves = s.rockyShockwaves.filter((sw) => sw.alpha > 0);

    // Update Obstacles
    s.obstacles.forEach((obs) => {
      if (!obs.alive) return;
      obs.x += obs.velocityX * dt;
      obs.y += obs.velocityY * dt;
      obs.rotation += obs.rotationSpeed * dt;

      // Obstacle bounds
      if (obs.x < obs.radius || obs.x > canvasWidth - obs.radius) {
        obs.velocityX *= -1;
      }

      // Check collision with player
      if (p.invulnerableTimer <= 0) {
        const playerCenterX = p.x + p.width / 2;
        const playerCenterY = p.y + p.height / 2;
        const dist = Math.hypot(playerCenterX - obs.x, playerCenterY - obs.y);

        if (dist < obs.radius + p.width * 0.4) {
          // Hit by obstacle! Knockback and penalty
          p.vy = 280;
          p.vx = (playerCenterX - obs.x > 0 ? 1 : -1) * 350;
          p.invulnerableTimer = 1.5;
          sound.playImpact();
          createBurstParticles(playerCenterX, playerCenterY, "#ef4444", 25, "spark");
        }
      }
    });

    // Track highest Y reached and update score
    if (p.y < s.highestY) {
      const deltaClimb = s.highestY - p.y;
      s.highestY = p.y;
      s.score += Math.floor(deltaClimb * 1.5);

      const curRecord = highScoreRef.current;
      if (!s.hasPassedHighScore && curRecord > 0 && s.score > curRecord) {
        s.hasPassedHighScore = true;
        sound.playHighScore();
        onNewHighScoreAchieved(s.score);
        createBurstParticles(p.x + p.width / 2, p.y, "#facc15", 40, "star");
      }
    }

    // Camera follow (Smooth Lerp)
    s.targetCameraY = p.y - 360;
    s.cameraY += (s.targetCameraY - s.cameraY) * dt * 5.5;

    // Slower, forgiving rising lava system:
    const heightBonus = Math.min(8, currentHeightMeters * 0.012);
    const lavaRiseRate = diff.lavaSpeed + heightBonus;
    s.lavaY -= lavaRiseRate * dt;

    // Relaxed Altitude Catch-Up: Gives the player generous breathing room (540px - 680px)
    const maxAllowedLag = Math.max(520, 680 - Math.min(100, currentHeightMeters * 0.15));
    const targetLavaUpperLimit = p.y + maxAllowedLag;
    if (s.lavaY > targetLavaUpperLimit) {
      s.lavaY += (targetLavaUpperLimit - s.lavaY) * dt * 0.6;
    }

    // Lava Proximity calculation & Danger level
    const playerFeet = p.y + p.height;
    const distanceToLava = Math.max(0, s.lavaY - playerFeet);
    const dangerDist = 280;
    s.dangerLevel = Math.max(0, Math.min(1, (dangerDist - distanceToLava) / dangerDist));

    if (s.dangerLevel > 0.75 && Math.random() < 0.04) {
      sound.playLavaWarning();
    }

    // Check Lava Touch (Game Over or Phoenix Rebirth)
    if (playerFeet >= s.lavaY - 8) {
      if (c.ability === "segundaChance" && s.fenixAvailable && !p.fenixRevived) {
        // PHOENIX SECOND CHANCE TRIGGER!
        p.fenixRevived = true;
        s.fenixAvailable = false;
        p.y = s.lavaY - 340; // teleport upwards safe
        p.vy = -BASE_JUMP_FORCE * 1.5;
        p.invulnerableTimer = 3.0;
        sound.playFenixRebirth();
        createBurstParticles(p.x + p.width / 2, p.y, "#fbbf24", 50, "feather");
        createBurstParticles(p.x + p.width / 2, p.y, "#ef4444", 40, "spark");
      } else {
        // GAME OVER
        sound.playGameOver();
        createBurstParticles(p.x + p.width / 2, p.y + p.height / 2, "#f97316", 50, "spark");
        onGameOver(s.score, currentHeightMeters, s.level, c);
        return;
      }
    }

    // Infinite Procedural Generation ahead of camera
    while (s.highestGeneratedY > s.cameraY - 700) {
      generateNextPlatform(canvasWidth);
    }

    // Cleanup objects far below camera
    const cleanupY = s.cameraY + 950;
    s.platforms = s.platforms.filter((plat) => plat.y < cleanupY);
    s.obstacles = s.obstacles.filter((obs) => obs.y < cleanupY && obs.alive);

    // Update Particles
    s.particles.forEach((pt) => {
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      if (pt.gravity) pt.vy += pt.gravity * dt;
      if (pt.rotation !== undefined && pt.rotSpeed) pt.rotation += pt.rotSpeed * dt;
      pt.alpha -= pt.decay * dt;
    });
    s.particles = s.particles.filter((pt) => pt.alpha > 0);

    // Emit Ambient Lava Embers
    if (Math.random() < 0.6) {
      const emberX = Math.random() * canvasWidth;
      s.particles.push({
        x: emberX,
        y: s.lavaY + Math.random() * 20,
        vx: (Math.random() - 0.5) * 60,
        vy: -(Math.random() * 90 + 50),
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.4 ? "#f97316" : "#fef08a",
        alpha: 1,
        decay: Math.random() * 0.8 + 0.5,
        shape: "spark",
      });
    }

    // Inform parent HUD
    onScoreUpdate(s.score, currentHeightMeters, s.level, p.landStreak, distanceToLava);
  };

  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;
    const c = s.character;
    const cw = canvas.width;
    const ch = canvas.height;
    const camY = s.cameraY;
    const heightInMeters = Math.max(0, Math.floor((560 - s.highestY) / 10));
    const diff = calculateDifficulty(heightInMeters, s.dimension);

    ctx.clearRect(0, 0, cw, ch);

    // 1. BIOME THEMED BACKGROUND (Forest -> Desert -> Sky -> Space -> Cyber)
    drawBiomeBackground(ctx, cw, ch, camY, diff);

    // 2. BIOME THEMED PLATFORMS
    s.platforms.forEach((plat) => {
      const screenY = plat.y - camY;
      if (screenY > -50 && screenY < ch + 50) {
        drawBiomePlatform(ctx, plat, screenY, diff);
      }
    });

    // 3. SHOCKWAVES
    s.rockyShockwaves.forEach((sw) => {
      const screenY = sw.y - camY;
      ctx.save();
      ctx.strokeStyle = `rgba(236, 72, 153, ${sw.alpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(sw.x, screenY, sw.radius, sw.radius * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // 4. OBSTACLES
    s.obstacles.forEach((obs) => {
      if (!obs.alive) return;
      const screenY = obs.y - camY;
      if (screenY > -50 && screenY < ch + 50) {
        drawObstacle(ctx, obs, screenY);
      }
    });

    // 5. PARTICLES
    s.particles.forEach((pt) => {
      const screenY = pt.y - camY;
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.alpha);
      ctx.fillStyle = pt.color;

      if (pt.shape === "spark") {
        ctx.beginPath();
        ctx.arc(pt.x, screenY, pt.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else if (pt.shape === "cloud") {
        ctx.beginPath();
        ctx.arc(pt.x, screenY, pt.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (pt.shape === "feather" || pt.shape === "star") {
        ctx.translate(pt.x, screenY);
        if (pt.rotation) ctx.rotate(pt.rotation);
        ctx.fillRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size);
      } else {
        ctx.beginPath();
        ctx.arc(pt.x, screenY, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // 6. PLAYER
    const playerScreenY = s.player.y - camY;
    drawPlayer(ctx, s.player, c, playerScreenY);

    // 7. LAVA / PLASMA RENDERING
    const rawLavaScreenY = s.lavaY - camY;
    const lavaScreenY = Math.min(rawLavaScreenY, ch - 26);
    drawLava(ctx, cw, ch, lavaScreenY, s.dangerLevel, diff.biome);

    // 8. ON-SCREEN STAGE WELCOME BANNER ("BEM-VINDO A TAL LUGAR")
    if (s.biomeAnnouncement) {
      drawStageWelcomeBanner(ctx, cw, ch, s.biomeAnnouncement);
    }

    // 9. DIMENSIONAL WARP FLASH OVERLAY
    if (s.dimensionalFlashTimer > 0) {
      const flashAlpha = s.dimensionalFlashTimer;
      ctx.save();
      const flashGrad = ctx.createRadialGradient(
        cw / 2,
        ch / 2,
        10,
        cw / 2,
        ch / 2,
        cw * 0.9
      );
      if (s.dimension === "cyber") {
        flashGrad.addColorStop(0, `rgba(103, 232, 249, ${flashAlpha * 0.85})`);
        flashGrad.addColorStop(0.5, `rgba(6, 182, 212, ${flashAlpha * 0.5})`);
        flashGrad.addColorStop(1, `rgba(236, 72, 153, ${flashAlpha * 0.3})`);
      } else {
        flashGrad.addColorStop(0, `rgba(233, 213, 255, ${flashAlpha * 0.85})`);
        flashGrad.addColorStop(0.5, `rgba(168, 85, 247, ${flashAlpha * 0.5})`);
        flashGrad.addColorStop(1, `rgba(59, 130, 246, ${flashAlpha * 0.3})`);
      }
      ctx.fillStyle = flashGrad;
      ctx.fillRect(0, 0, cw, ch);
      ctx.restore();
    }

    // 10. DANGER VIGNETTE & WARNING ALARM (When lava is dangerously close)
    if (s.dangerLevel > 0.2) {
      const vigGrad = ctx.createRadialGradient(
        cw / 2,
        ch / 2,
        cw * 0.15,
        cw / 2,
        ch / 2,
        cw * 0.85
      );
      const pulse = 0.6 + 0.4 * Math.sin(Date.now() * 0.012);
      vigGrad.addColorStop(0, "rgba(239, 68, 68, 0)");
      vigGrad.addColorStop(0.7, `rgba(249, 115, 22, ${0.3 * s.dangerLevel * pulse})`);
      vigGrad.addColorStop(1, `rgba(220, 38, 38, ${0.65 * s.dangerLevel * pulse})`);
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, cw, ch);

      // Warning text badge if critically close
      if (s.dangerLevel > 0.65) {
        ctx.save();
        const bannerPulse = Math.sin(Date.now() * 0.015) > 0;
        ctx.fillStyle = bannerPulse ? "rgba(220, 38, 38, 0.9)" : "rgba(245, 158, 11, 0.9)";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cw / 2 - 120, 95, 240, 32, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 4;
        ctx.fillText("🔥 LAVA SUBINDO! SUBA RÁPIDO! 🔥", cw / 2, 111);
        ctx.restore();
      }
    }
  };

  const drawBackgroundCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
    ctx.beginPath();
    ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
    ctx.arc(x + size * 0.25, y - size * 0.15, size * 0.35, 0, Math.PI * 2);
    ctx.arc(x + size * 0.55, y, size * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawPlatform = (ctx: CanvasRenderingContext2D, plat: Platform, screenY: number) => {
    ctx.save();

    const w = plat.width;
    const h = plat.height;
    const x = plat.x;
    const y = screenY;

    if (plat.type === "fragile") {
      // Fragile Cloud (Cracks and darker tone)
      const shakeX = plat.steppedOn ? (Math.random() - 0.5) * 4 : 0;
      ctx.translate(shakeX, 0);

      ctx.fillStyle = "#cbd5e1";
      fillCloudShape(ctx, x, y, w, h);

      // Cracks
      if (plat.steppedOn) {
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + w * 0.3, y + 4);
        ctx.lineTo(x + w * 0.5, y + h * 0.6);
        ctx.lineTo(x + w * 0.7, y + 2);
        ctx.stroke();
      }
    } else if (plat.type === "booster") {
      // Booster Cloud with bouncy glowing spring
      ctx.fillStyle = "#e0f2fe";
      fillCloudShape(ctx, x, y, w, h);

      // Spring coil on top
      const springH = 14 * (1 - (plat.springAnimation || 0) * 0.6);
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + w / 2 - 12, y);
      ctx.lineTo(x + w / 2 + 12, y - springH * 0.5);
      ctx.lineTo(x + w / 2 - 12, y - springH);
      ctx.lineTo(x + w / 2 + 12, y - springH * 1.5);
      ctx.stroke();

      // Top arrow
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y - springH * 1.8);
      ctx.lineTo(x + w / 2 - 8, y - springH * 1.3);
      ctx.lineTo(x + w / 2 + 8, y - springH * 1.3);
      ctx.fill();
    } else if (plat.type === "rare") {
      // Golden Rare Cloud with rotating sparkle halo
      const goldGrad = ctx.createLinearGradient(x, y, x + w, y + h);
      goldGrad.addColorStop(0, "#fde047");
      goldGrad.addColorStop(0.5, "#fbbf24");
      goldGrad.addColorStop(1, "#f59e0b");
      ctx.fillStyle = goldGrad;
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 14;
      fillCloudShape(ctx, x, y, w, h);
      ctx.shadowBlur = 0;

      // Gem / Star icon
      if (!plat.collected) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("★ +1500", x + w / 2, y - 6);
      }
    } else if (plat.type === "moving") {
      // Moving Cloud (Cyan with subtle directional arrows)
      ctx.fillStyle = "#e0f2fe";
      fillCloudShape(ctx, x, y, w, h);

      ctx.fillStyle = "#0284c7";
      const arrowDir = plat.velocityX > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(x + w / 2 + 6 * arrowDir, y + h / 2);
      ctx.lineTo(x + w / 2 - 4 * arrowDir, y + h / 2 - 5);
      ctx.lineTo(x + w / 2 - 4 * arrowDir, y + h / 2 + 5);
      ctx.fill();
    } else if (plat.type === "small") {
      // Small Compact Cloud
      ctx.fillStyle = "#ffffff";
      fillCloudShape(ctx, x, y, w, h);
    } else {
      // Normal Cloud
      ctx.fillStyle = "#ffffff";
      fillCloudShape(ctx, x, y, w, h);
    }

    ctx.restore();
  };

  const fillCloudShape = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.beginPath();
    const r = h / 2;
    // Rounded base pill
    ctx.arc(x + r, y + r, r, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.arc(x + w - r, y + r, r, (3 * Math.PI) / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    // Top cloud puffs
    ctx.beginPath();
    ctx.arc(x + w * 0.28, y + 2, r * 0.85, 0, Math.PI * 2);
    ctx.arc(x + w * 0.52, y - 2, r * 1.15, 0, Math.PI * 2);
    ctx.arc(x + w * 0.74, y + 2, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawObstacle = (ctx: CanvasRenderingContext2D, obs: Obstacle, screenY: number) => {
    ctx.save();
    ctx.translate(obs.x, screenY);
    ctx.rotate(obs.rotation);

    if (obs.type === "fireball") {
      // Fiery spinning meteor
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, obs.radius);
      grad.addColorStop(0, "#fef08a");
      grad.addColorStop(0.5, "#f97316");
      grad.addColorStop(1, "#ef4444");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
      ctx.fill();

      // Fire spikes
      ctx.fillStyle = "#f97316";
      for (let i = 0; i < 4; i++) {
        ctx.rotate((Math.PI * 2) / 4);
        ctx.beginPath();
        ctx.moveTo(obs.radius * 0.8, -obs.radius * 0.3);
        ctx.lineTo(obs.radius * 1.5, 0);
        ctx.lineTo(obs.radius * 0.8, obs.radius * 0.3);
        ctx.fill();
      }
    } else {
      // Jagged volcanic rock
      ctx.fillStyle = "#374151";
      ctx.beginPath();
      const sides = 6;
      for (let i = 0; i < sides; i++) {
        const angle = (i * Math.PI * 2) / sides;
        const rad = obs.radius * (0.8 + 0.3 * Math.sin(i * 2.3));
        const px = Math.cos(angle) * rad;
        const py = Math.sin(angle) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Glowing magma fissures
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-obs.radius * 0.5, -obs.radius * 0.3);
      ctx.lineTo(obs.radius * 0.3, obs.radius * 0.4);
      ctx.stroke();
    }

    ctx.restore();
  };

  const drawPlayer = (
    ctx: CanvasRenderingContext2D,
    p: PlayerState,
    c: Character,
    screenY: number
  ) => {
    ctx.save();

    // Draw dash/speed trails
    p.trail.forEach((tr) => {
      const trScreenY = tr.y - stateRef.current.cameraY;
      ctx.save();
      ctx.globalAlpha = tr.alpha * 0.4;
      ctx.fillStyle = tr.color;
      ctx.fillRect(tr.x, trScreenY, p.width, p.height);
      ctx.restore();
    });

    // Invulnerability blink
    if (p.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    const centerX = p.x + p.width / 2;
    const centerY = screenY + p.height / 2;

    ctx.translate(centerX, centerY);

    // Dynamic tilt based on horizontal velocity
    const tilt = (p.vx / 800) * 0.25;
    ctx.rotate(tilt);

    // Apply squash and stretch
    ctx.scale(p.squashX, p.squashY);

    const halfW = p.width / 2;
    const halfH = p.height / 2;

    // Active ability glow aura
    if (p.abilityActive) {
      ctx.shadowColor = c.accentColor;
      ctx.shadowBlur = 18;
    }

    // 1. Character Body (Rounded avatar with character's primary & secondary theme)
    const bodyGrad = ctx.createLinearGradient(0, -halfH, 0, halfH);
    bodyGrad.addColorStop(0, c.color);
    bodyGrad.addColorStop(1, c.secondaryColor);
    ctx.fillStyle = bodyGrad;

    ctx.beginPath();
    ctx.roundRect(-halfW, -halfH, p.width, p.height, 10);
    ctx.fill();

    // 2. Headband / Mask / Accent details
    ctx.fillStyle = c.accentColor;
    ctx.fillRect(-halfW, -halfH + 8, p.width, 6);

    // 3. Eyes with directional tracking
    ctx.fillStyle = "#ffffff";
    const eyeOffset = p.facing === "right" ? 4 : -4;
    ctx.beginPath();
    ctx.ellipse(-halfW + 12 + eyeOffset, -halfH + 18, 5, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(halfW - 12 + eyeOffset, -halfH + 18, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(-halfW + 12 + eyeOffset * 1.4, -halfH + 18, 3, 0, Math.PI * 2);
    ctx.arc(halfW - 12 + eyeOffset * 1.4, -halfH + 18, 3, 0, Math.PI * 2);
    ctx.fill();

    // 4. Character Specific Accessories
    if (c.id === "fenix") {
      // Flaming Wings
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.moveTo(-halfW, 0);
      ctx.lineTo(-halfW - 14, -8);
      ctx.lineTo(-halfW - 10, 14);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(halfW, 0);
      ctx.lineTo(halfW + 14, -8);
      ctx.lineTo(halfW + 10, 14);
      ctx.fill();
    } else if (c.id === "flash") {
      // Lightning bolt on chest
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(2, -2);
      ctx.lineTo(-4, 6);
      ctx.lineTo(1, 6);
      ctx.lineTo(-2, 14);
      ctx.lineTo(4, 4);
      ctx.lineTo(-1, 4);
      ctx.fill();
    } else if (c.id === "pulo") {
      // Spring boots indicator
      ctx.fillStyle = "#6ee7b7";
      ctx.fillRect(-halfW + 4, halfH - 4, p.width - 8, 4);
    } else if (c.id === "rocky") {
      // Crystal shoulder armor
      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.arc(-halfW, -halfH + 8, 4, 0, Math.PI * 2);
      ctx.arc(halfW, -halfH + 8, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (c.id === "nuvem") {
      // Floating cloud scarf / wings
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.beginPath();
      ctx.arc(0, -halfH - 4, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const drawLava = (
    ctx: CanvasRenderingContext2D,
    cw: number,
    ch: number,
    lavaScreenY: number,
    dangerLevel: number,
    biome: BiomeType = "forest"
  ) => {
    ctx.save();

    const time = Date.now() * 0.003;
    const isCyber = biome === "cyber";

    if (isCyber) {
      // Quantum Plasma Firewall in Cyber Dimension
      const glowHeight = 110 + dangerLevel * 60;
      const glowGrad = ctx.createLinearGradient(0, lavaScreenY - glowHeight, 0, lavaScreenY);
      glowGrad.addColorStop(0, "rgba(6, 182, 212, 0)");
      glowGrad.addColorStop(0.5, `rgba(6, 182, 212, ${0.25 + dangerLevel * 0.3})`);
      glowGrad.addColorStop(1, `rgba(236, 72, 153, ${0.6 + dangerLevel * 0.3})`);
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, lavaScreenY - glowHeight, cw, glowHeight);

      // Deep Cyber Plasma Sub-layer
      ctx.beginPath();
      ctx.moveTo(0, ch);
      ctx.lineTo(0, lavaScreenY + 12);
      for (let x = 0; x <= cw; x += 20) {
        const wave = Math.sin(x * 0.02 - time * 2.5) * 10 + Math.cos(x * 0.04 + time * 1.5) * 6;
        ctx.lineTo(x, lavaScreenY + 12 + wave);
      }
      ctx.lineTo(cw, ch);
      ctx.closePath();
      ctx.fillStyle = "#1e1b4b";
      ctx.fill();

      // Cyber Plasma Wave
      ctx.beginPath();
      ctx.moveTo(0, ch);
      ctx.lineTo(0, lavaScreenY);
      for (let x = 0; x <= cw; x += 12) {
        const wave1 = Math.sin(x * 0.035 + time * 3.0) * 10;
        const wave2 = Math.cos(x * 0.018 - time * 2.0) * 6;
        ctx.lineTo(x, lavaScreenY + wave1 + wave2);
      }
      ctx.lineTo(cw, ch);
      ctx.closePath();

      const plasmaGrad = ctx.createLinearGradient(0, lavaScreenY - 10, 0, ch);
      plasmaGrad.addColorStop(0, "#ffffff");
      plasmaGrad.addColorStop(0.08, "#67e8f9"); // Bright Cyan
      plasmaGrad.addColorStop(0.3, "#06b6d4"); // Electric Cyan
      plasmaGrad.addColorStop(0.6, "#ec4899"); // Neon Magenta
      plasmaGrad.addColorStop(1, "#0f172a");
      ctx.fillStyle = plasmaGrad;
      ctx.fill();

      // Laser Crest Line
      ctx.strokeStyle = "rgba(103, 232, 249, 0.95)";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#06b6d4";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      for (let x = 0; x <= cw; x += 12) {
        const wave1 = Math.sin(x * 0.035 + time * 3.0) * 10;
        const wave2 = Math.cos(x * 0.018 - time * 2.0) * 6;
        if (x === 0) ctx.moveTo(x, lavaScreenY + wave1 + wave2);
        else ctx.lineTo(x, lavaScreenY + wave1 + wave2);
      }
      ctx.stroke();

      // Digital energy nodes
      for (let i = 0; i < 7; i++) {
        const sparkX = (i * 70 + Math.sin(time * 2 + i * 2) * 35) % cw;
        const waveOffset = Math.sin(sparkX * 0.035 + time * 3.0) * 10;
        const sparkY = lavaScreenY + waveOffset + 4 + Math.sin(time * 4 + i) * 3;
        ctx.fillStyle = i % 2 === 0 ? "#67e8f9" : "#f472b6";
        ctx.fillRect(sparkX - 3, sparkY - 3, 6, 6);
      }

      ctx.restore();
      return;
    }

    // 1. Massive Lava Heat Distortion Glow
    const glowHeight = 100 + dangerLevel * 60;
    const glowGrad = ctx.createLinearGradient(0, lavaScreenY - glowHeight, 0, lavaScreenY);
    glowGrad.addColorStop(0, "rgba(249, 115, 22, 0)");
    glowGrad.addColorStop(0.5, `rgba(249, 115, 22, ${0.25 + dangerLevel * 0.3})`);
    glowGrad.addColorStop(1, `rgba(239, 68, 68, ${0.6 + dangerLevel * 0.3})`);
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, lavaScreenY - glowHeight, cw, glowHeight);

    // 2. Deep Sub-Surface Molten Layer
    ctx.beginPath();
    ctx.moveTo(0, ch);
    ctx.lineTo(0, lavaScreenY + 12);
    for (let x = 0; x <= cw; x += 20) {
      const wave = Math.sin(x * 0.02 - time * 1.8) * 10 + Math.cos(x * 0.04 + time) * 6;
      ctx.lineTo(x, lavaScreenY + 12 + wave);
    }
    ctx.lineTo(cw, ch);
    ctx.closePath();
    ctx.fillStyle = "#991b1b";
    ctx.fill();

    // 3. Animated Foreground Molten Lava Wave
    ctx.beginPath();
    ctx.moveTo(0, ch);
    ctx.lineTo(0, lavaScreenY);

    for (let x = 0; x <= cw; x += 12) {
      const wave1 = Math.sin(x * 0.035 + time * 2.2) * 10;
      const wave2 = Math.cos(x * 0.018 - time * 1.5) * 6;
      ctx.lineTo(x, lavaScreenY + wave1 + wave2);
    }

    ctx.lineTo(cw, ch);
    ctx.closePath();

    // Multi-stop blazing gradient
    const lavaGrad = ctx.createLinearGradient(0, lavaScreenY - 10, 0, ch);
    lavaGrad.addColorStop(0, "#ffffff"); // White-hot incandescent crest
    lavaGrad.addColorStop(0.04, "#fef08a"); // Bright yellow
    lavaGrad.addColorStop(0.16, "#f97316"); // Burning orange
    lavaGrad.addColorStop(0.45, "#dc2626"); // Crimson magma
    lavaGrad.addColorStop(1, "#450a0a"); // Deep volcanic dark floor
    ctx.fillStyle = lavaGrad;
    ctx.fill();

    // 4. White-Hot Magma Wave Crest Line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= cw; x += 12) {
      const wave1 = Math.sin(x * 0.035 + time * 2.2) * 10;
      const wave2 = Math.cos(x * 0.018 - time * 1.5) * 6;
      if (x === 0) ctx.moveTo(x, lavaScreenY + wave1 + wave2);
      else ctx.lineTo(x, lavaScreenY + wave1 + wave2);
    }
    ctx.stroke();

    // 5. Popping Boiling Lava Bubbles & Geysers
    for (let i = 0; i < 8; i++) {
      const bubbleX = (i * 65 + Math.sin(time * 1.5 + i * 2) * 35) % cw;
      const waveOffset = Math.sin(bubbleX * 0.035 + time * 2.2) * 10;
      const bubbleY = lavaScreenY + waveOffset + 4 + Math.sin(time * 3 + i) * 3;
      const bubbleSize = 5 + (i % 4) * 3;

      // Glow around bubble
      ctx.fillStyle = "rgba(254, 240, 138, 0.9)";
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
      ctx.fill();

      // Core white sparkle
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY - 1, bubbleSize * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950">
      <canvas
        ref={canvasRef}
        width={480}
        height={760}
        className="w-full max-w-[480px] h-full max-h-[760px] object-contain shadow-2xl rounded-none md:rounded-2xl border-0 md:border md:border-sky-900/30"
      />
    </div>
  );
};

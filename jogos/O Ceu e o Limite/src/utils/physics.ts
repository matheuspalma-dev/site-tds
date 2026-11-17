import { Character, DifficultySettings, Platform } from "../types";

export const BASE_GRAVITY = 1450; // px / s^2 - Balanced responsive fall
export const BASE_FALL_GRAVITY_MULT = 1.16; // Snappy crisp falling
export const BASE_APEX_GRAVITY_MULT = 0.44; // Celeste-style hang time at apex of jump for easy platform landing
export const BASE_JUMP_FORCE = 780; // px / s - Strong, satisfying, reliable jump height
export const BASE_MOVE_SPEED = 400; // px / s
export const BASE_ACCELERATION = 3400; // px / s^2
export const BASE_FRICTION = 0.88; // horizontal dampening per frame
export const BASE_AIR_CONTROL = 0.94;
export const COYOTE_TIME_WINDOW = 0.15; // 150ms grace window after leaving a platform
export const JUMP_BUFFER_WINDOW = 0.16; // 160ms pre-landing jump buffer
export const TERMINAL_VELOCITY = 1000; // Max downward velocity to prevent uncontrollable falls

export function calculateMaxJumpHeight(character: Character): number {
  const jumpSpeed = BASE_JUMP_FORCE * character.jump;
  const gravity = BASE_GRAVITY * character.gravity;
  // h = v^2 / (2g)
  return (jumpSpeed * jumpSpeed) / (2 * gravity);
}

export function calculateHorizontalReach(character: Character): number {
  const jumpSpeed = BASE_JUMP_FORCE * character.jump;
  const gravity = BASE_GRAVITY * character.gravity;
  // air time = 2 * (v / g)
  const airTime = (2 * jumpSpeed) / gravity;
  const moveSpeed = BASE_MOVE_SPEED * character.speed * character.airControl;
  return moveSpeed * (airTime * 0.75); // 75% safety margin for comfortable control
}

export function isPlatformReachable(
  prev: Platform,
  next: Platform,
  character: Character
): boolean {
  const maxJumpH = calculateMaxJumpHeight(character);
  const maxReachX = calculateHorizontalReach(character);

  const deltaY = prev.y - next.y; // positive when going UP
  const deltaX = Math.abs(next.x + next.width / 2 - (prev.x + prev.width / 2));

  // If next is booster or previous was booster, reach can be up to 1.8x
  const jumpBoost = prev.type === "booster" ? 1.7 : 1.0;

  if (deltaY > maxJumpH * 0.95 * jumpBoost) return false;
  if (deltaX > maxReachX * 0.95 * jumpBoost) return false;

  return true;
}

export function calculateDifficulty(
  heightInMeters: number,
  currentDimension: "earth_space" | "cyber" = "earth_space"
): DifficultySettings {
  if (currentDimension === "cyber") {
    const cyberLevel = Math.min(10, Math.floor(heightInMeters / 300));
    return {
      level: 5 + cyberLevel,
      levelName: cyberLevel === 0 ? "Fase 5: Dimensão Tecnológica" : `Fase 5.${cyberLevel + 1}: Cyber Matrix`,
      skyTheme: "space",
      biome: "cyber",
      biomePhase: 5,
      biomeTitle: "DIMENSÃO TECNOLÓGICA",
      biomeWelcome: "⚡ BEM-VINDO À DIMENSÃO TECNOLÓGICA!",
      biomeSubtitle: "Pule nas placas de circuito quântico e neon!",
      biomeColor: "#06b6d4",
      biomeIcon: "⚡",
      lavaSpeed: Math.min(34, 25 + cyberLevel * 1.5),
      platformMinGap: 75,
      platformMaxGap: Math.min(138, 125 + cyberLevel * 2),
      smallPlatformChance: 0.22,
      movingPlatformChance: 0.3,
      fragilePlatformChance: 0.12,
      boosterPlatformChance: 0.14,
      rarePlatformChance: 0.07,
      obstacleChance: Math.min(0.12, 0.04 + cyberLevel * 0.02),
    };
  }

  // 4 Main Earth/Space Biomes:
  // Phase 1: Floresta Encantada (0m - 160m)
  // Phase 2: Deserto Dourado (160m - 390m)
  // Phase 3: Reino dos Céus (390m - 690m)
  // Phase 4: Espaço Sideral Cósmico (690m+)

  if (heightInMeters < 160) {
    return {
      level: 1,
      levelName: "Fase 1: Floresta Encantada",
      skyTheme: "day",
      biome: "forest",
      biomePhase: 1,
      biomeTitle: "FLORESTA ENCANTADA",
      biomeWelcome: "🌲 BEM-VINDO À FLORESTA ENCANTADA!",
      biomeSubtitle: "Pule nos blocos de terra e grama viva!",
      biomeColor: "#22c55e",
      biomeIcon: "🌲",
      lavaSpeed: 15, // Extremely gentle, relaxed speed
      platformMinGap: 55,
      platformMaxGap: 105,
      smallPlatformChance: 0.08,
      movingPlatformChance: 0.08,
      fragilePlatformChance: 0.04,
      boosterPlatformChance: 0.1,
      rarePlatformChance: 0.08,
      obstacleChance: 0.0,
    };
  } else if (heightInMeters < 390) {
    return {
      level: 2,
      levelName: "Fase 2: Deserto Dourado",
      skyTheme: "sunset",
      biome: "desert",
      biomePhase: 2,
      biomeTitle: "DESERTO DOURADO",
      biomeWelcome: "🏜️ BEM-VINDO AO DESERTO DOURADO!",
      biomeSubtitle: "Pule nos blocos de arenito e areia dourada!",
      biomeColor: "#f59e0b",
      biomeIcon: "🏜️",
      lavaSpeed: 21,
      platformMinGap: 65,
      platformMaxGap: 118,
      smallPlatformChance: 0.15,
      movingPlatformChance: 0.18,
      fragilePlatformChance: 0.08,
      boosterPlatformChance: 0.09,
      rarePlatformChance: 0.06,
      obstacleChance: 0.02,
    };
  } else if (heightInMeters < 690) {
    return {
      level: 3,
      levelName: "Fase 3: Reino dos Céus",
      skyTheme: "dawn",
      biome: "sky",
      biomePhase: 3,
      biomeTitle: "REINO DOS CÉUS",
      biomeWelcome: "☁️ BEM-VINDO AO REINO DOS CÉUS!",
      biomeSubtitle: "Pule nas nuvens fofas celestiais!",
      biomeColor: "#38bdf8",
      biomeIcon: "☁️",
      lavaSpeed: 26,
      platformMinGap: 75,
      platformMaxGap: 130,
      smallPlatformChance: 0.22,
      movingPlatformChance: 0.26,
      fragilePlatformChance: 0.14,
      boosterPlatformChance: 0.11,
      rarePlatformChance: 0.05,
      obstacleChance: 0.05,
    };
  } else {
    // 690m+ Cosmic Space (Stage 4)
    const spaceSubLevel = Math.min(10, Math.floor((heightInMeters - 690) / 500));
    return {
      level: 4 + spaceSubLevel,
      levelName: spaceSubLevel === 0 ? "Fase 4: Espaço Sideral Cósmico" : `Fase 4.${spaceSubLevel + 1}: Infinito Cósmico`,
      skyTheme: "space",
      biome: "space",
      biomePhase: 4,
      biomeTitle: "ESPAÇO SIDERAL CÓSMICO",
      biomeWelcome: "✨ BEM-VINDO AO ESPAÇO SIDERAL!",
      biomeSubtitle: "Pule nas estrelas cósmicas e viaje pelo infinito!",
      biomeColor: "#a855f7",
      biomeIcon: "✨",
      lavaSpeed: Math.min(36, 30 + spaceSubLevel * 1.5),
      platformMinGap: 80,
      platformMaxGap: Math.min(145, 135 + spaceSubLevel * 2),
      smallPlatformChance: 0.28,
      movingPlatformChance: 0.32,
      fragilePlatformChance: 0.18,
      boosterPlatformChance: 0.12,
      rarePlatformChance: 0.05,
      obstacleChance: Math.min(0.18, 0.08 + spaceSubLevel * 0.02),
    };
  }
}

export type AbilityType =
  | "impulso"
  | "dash"
  | "superSalto"
  | "impacto"
  | "flutuar"
  | "segundaChance";

export interface Character {
  id: string;
  name: string;
  type: string;
  color: string;
  secondaryColor: string;
  accentColor: string;
  speed: number;
  jump: number;
  airControl: number;
  gravity: number;
  ability: AbilityType;
  abilityName: string;
  abilityDesc: string;
  cooldown: number; // in seconds
  duration: number; // in seconds
  description: string;
}

export type PlatformType =
  | "normal"
  | "small"
  | "moving"
  | "fragile"
  | "booster"
  | "rare";

export type BiomeType = "forest" | "desert" | "sky" | "space" | "cyber";

export interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PlatformType;
  biome?: BiomeType;
  portal?: "to_cyber" | "to_space";
  portalActivated?: boolean;
  portalPulse?: number;
  velocityX: number;
  minX?: number;
  maxX?: number;
  steppedOn?: boolean;
  breakTimer?: number;
  isBroken?: boolean;
  springAnimation?: number; // 0 to 1 for booster spring
  sparkleTimer?: number;
  collected?: boolean;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: "fireball" | "rock" | "geyser";
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  alive: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity?: number;
  shape?: "circle" | "spark" | "cloud" | "feather" | "star" | "cyber_glyph" | "laser";
  rotation?: number;
  rotSpeed?: number;
}

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  facing: "left" | "right";
  squashX: number;
  squashY: number;
  landStreak: number;
  jumpsDone: number;
  abilityActive: boolean;
  abilityTimer: number;
  abilityCooldownTimer: number;
  fenixRevived: boolean;
  invulnerableTimer: number;
  floating: boolean;
  dashTimer: number;
  dashDir: number;
  trail: { x: number; y: number; alpha: number; color: string }[];
}

export interface DifficultySettings {
  level: number;
  lavaSpeed: number;
  platformMinGap: number;
  platformMaxGap: number;
  smallPlatformChance: number;
  movingPlatformChance: number;
  fragilePlatformChance: number;
  boosterPlatformChance: number;
  rarePlatformChance: number;
  obstacleChance: number;
  levelName: string;
  skyTheme: "dawn" | "day" | "sunset" | "twilight" | "space";
  biome: BiomeType;
  biomePhase: number;
  biomeTitle: string;
  biomeWelcome: string;
  biomeSubtitle: string;
  biomeColor: string;
  biomeIcon: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  highScore: number;
  maxHeight: number;
  totalGames: number;
  createdAt: number;
}

export interface ScoreData {
  id: string;
  userId?: string;
  playerName: string;
  characterId: string;
  characterName: string;
  score: number;
  height: number;
  level: number;
  timestamp: number;
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  description?: string;
}

export interface GameBackupData {
  appName: string;
  version: string;
  backupDate: string;
  timestamp: number;
  player: {
    displayName: string;
    email?: string;
    highScore: number;
    maxHeight: number;
    totalGames: number;
    selectedCharacterId: string;
  };
  recentRuns?: {
    score: number;
    height: number;
    level: number;
    characterId: string;
    timestamp: number;
  }[];
}

export type GameState =
  | "menu"
  | "characters"
  | "howToPlay"
  | "leaderboard"
  | "auth"
  | "drive"
  | "playing"
  | "paused"
  | "gameOver";


import React from "react";
import { Character, UserProfile } from "../types";
import { sound } from "../utils/audio";
import {
  Flame,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
  Zap,
  Heart,
  Maximize2,
  Minimize2,
  Gamepad2,
  User as UserIcon,
  Sparkles,
} from "lucide-react";

interface HUDProps {
  score: number;
  height: number;
  level: number;
  combo: number;
  highScore: number;
  lavaDistance: number;
  character: Character;
  abilityActive: boolean;
  abilityTimer: number;
  abilityCooldownTimer: number;
  fenixAvailable: boolean;
  onPause: () => void;
  onRestart: () => void;
  onTriggerAbility: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  showRecordToast?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  showTouchControls?: boolean;
  onToggleTouchControls?: () => void;
  currentUser?: UserProfile | null;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  height,
  level,
  combo,
  highScore,
  lavaDistance,
  character,
  abilityActive,
  abilityTimer,
  abilityCooldownTimer,
  fenixAvailable,
  onPause,
  onRestart,
  onTriggerAbility,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  showRecordToast = false,
  isFullscreen = false,
  onToggleFullscreen,
  showTouchControls = true,
  onToggleTouchControls,
  currentUser,
}) => {
  // Danger meter calculation (0 = safe, 100 = touching lava)
  const dangerPercent = Math.max(0, Math.min(100, Math.floor(((320 - lavaDistance) / 320) * 100)));
  const isCriticalDanger = dangerPercent > 70;

  // Ability progress percent
  const isReady = !abilityActive && abilityCooldownTimer <= 0;
  const cooldownPercent = abilityActive
    ? 100
    : Math.max(0, 100 - (abilityCooldownTimer / character.cooldown) * 100);

  return (
    <div id="game-hud" className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 md:p-4 select-none">
      {/* Top Header Card */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg text-white">
          {/* Points & Altitude */}
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] tracking-wider uppercase text-sky-300 font-bold block">
                Pontos
              </span>
              <span className="text-lg md:text-xl font-black tabular-nums text-white">
                {score.toLocaleString()}
              </span>
            </div>

            <div className="h-6 w-[1px] bg-white/20" />

            <div>
              <span className="text-[10px] tracking-wider uppercase text-emerald-300 font-bold block">
                Altura
              </span>
              <span className="text-lg md:text-xl font-black tabular-nums text-emerald-400">
                {height} <span className="text-xs font-semibold text-emerald-200">m</span>
              </span>
            </div>
          </div>

          {/* Record & Level */}
          <div className="flex items-center gap-4">
            <div className={`text-right transition-all duration-300 ${showRecordToast ? "scale-105" : ""}`}>
              <div className="flex items-center justify-end gap-1">
                <span className="text-[10px] tracking-wider uppercase text-amber-300 font-bold block">
                  Recorde
                </span>
                {showRecordToast && (
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-1 py-0.2 rounded font-mono animate-pulse">
                    NOVO!
                  </span>
                )}
              </div>
              <span className={`text-sm md:text-base font-bold tabular-nums ${showRecordToast ? "text-yellow-300 font-black" : "text-amber-300"}`}>
                {Math.max(score, highScore).toLocaleString()}
              </span>
            </div>

            <div className="hidden sm:block h-6 w-[1px] bg-white/20" />

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] tracking-wider uppercase text-purple-300 font-bold">
                Nível
              </span>
              <span className="text-sm font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-lg border border-purple-500/30">
                {level}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5 pl-2 border-l border-white/20">
            {onToggleFullscreen && (
              <button
                id="hud-btn-fullscreen"
                onClick={onToggleFullscreen}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-slate-200"
                title={isFullscreen ? "Sair da Tela Cheia (F)" : "Tela Cheia (F)"}
              >
                {isFullscreen ? <Minimize2 size={16} className="text-amber-300" /> : <Maximize2 size={16} />}
              </button>
            )}
            {onToggleTouchControls && (
              <button
                id="hud-btn-touch-toggle"
                onClick={onToggleTouchControls}
                className={`p-1.5 rounded-xl active:scale-95 transition-all hidden sm:flex ${
                  showTouchControls ? "bg-white/10 text-slate-200" : "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                }`}
                title={showTouchControls ? "Ocultar Controles Touch (Modo PC)" : "Mostrar Controles Touch"}
              >
                <Gamepad2 size={16} />
              </button>
            )}
            <button
              id="hud-btn-sound"
              onClick={onToggleSound}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-slate-200"
              title="Som"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
            </button>
            <button
              id="hud-btn-music"
              onClick={onToggleMusic}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-slate-200"
              title="Música"
            >
              <Music size={16} className={musicEnabled ? "text-sky-400" : "text-slate-500"} />
            </button>
            <button
              id="hud-btn-restart"
              onClick={onRestart}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-slate-200"
              title="Reiniciar (R)"
            >
              <RotateCcw size={16} />
            </button>
            <button
              id="hud-btn-pause"
              onClick={onPause}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-slate-200"
              title="Pausar (P)"
            >
              <Pause size={16} />
            </button>
          </div>
        </div>

        {currentUser && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-[10px] font-bold text-emerald-300 self-end">
            <UserIcon size={12} className="text-emerald-400" />
            <span className="truncate max-w-[120px]">{currentUser.displayName}</span>
          </div>
        )}
      </div>

      {/* Top-Left Corner Landing Combo (Leaves center of screen 100% unobstructed) */}
      {combo >= 2 && (
        <div className="absolute top-28 left-3 md:left-4 pointer-events-none transition-all">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-sky-400/40 shadow-xl flex items-center gap-2 text-white animate-pulse">
            <span className="flex h-2.5 w-2.5 rounded-full bg-sky-400 animate-ping" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-sky-300 leading-none">
                Combo Pouso
              </span>
              <span className="text-sm font-black text-amber-300 tabular-nums leading-tight">
                {combo}x 🔥
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Character & Ability Widget */}
      <div className="flex items-end justify-between gap-3">
        {/* Character Card info */}
        <div className="flex items-center gap-2.5 bg-slate-900/85 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-lg text-white">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 border-white/20"
            style={{ backgroundColor: character.color }}
          >
            {character.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-bold leading-tight">{character.name}</div>
            <div className="text-[10px] text-slate-400">{character.type}</div>
          </div>
        </div>

        {/* Ability Button & Cooldown */}
        <div className="pointer-events-auto flex items-center gap-2">
          {character.id === "fenix" ? (
            <div
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold backdrop-blur-md shadow-lg ${
                fenixAvailable
                  ? "bg-red-950/80 border-red-500/50 text-red-300"
                  : "bg-slate-900/80 border-slate-700 text-slate-500"
              }`}
            >
              <Heart
                size={16}
                className={fenixAvailable ? "text-red-500 fill-red-500 animate-pulse" : "text-slate-600"}
              />
              <span>{fenixAvailable ? "2ª Chance: Pronta" : "2ª Chance: Usada"}</span>
            </div>
          ) : (
            <button
              id="hud-btn-ability"
              onClick={() => {
                sound.playClick();
                onTriggerAbility();
              }}
              disabled={!isReady}
              className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-bold text-xs shadow-xl backdrop-blur-md transition-all active:scale-95 ${
                abilityActive
                  ? "bg-amber-500 text-slate-950 ring-4 ring-amber-300 animate-pulse"
                  : isReady
                  ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:brightness-110 ring-2 ring-sky-300/40"
                  : "bg-slate-800/80 text-slate-400 border border-white/10"
              }`}
            >
              <Zap size={16} className={isReady || abilityActive ? "text-yellow-300" : "text-slate-500"} />
              <div className="text-left">
                <div className="leading-none text-[11px] uppercase tracking-wider">{character.abilityName}</div>
                <div className="text-[9px] text-slate-300">
                  {abilityActive
                    ? `${abilityTimer.toFixed(1)}s`
                    : isReady
                    ? "PRONTO (E / SHIFT)"
                    : `${abilityCooldownTimer.toFixed(1)}s`}
                </div>
              </div>

              {/* Circular Cooldown Bar */}
              {!isReady && !abilityActive && (
                <div
                  className="absolute inset-0 bg-slate-950/40 rounded-2xl overflow-hidden pointer-events-none"
                  style={{
                    clipPath: `inset(0 0 0 ${cooldownPercent}%)`,
                  }}
                />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

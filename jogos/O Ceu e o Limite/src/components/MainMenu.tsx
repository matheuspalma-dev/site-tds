import React from "react";
import { Character, UserProfile } from "../types";
import { sound } from "../utils/audio";
import {
  Play,
  Users,
  HelpCircle,
  Trophy,
  Volume2,
  VolumeX,
  Music,
  Sparkles,
  Maximize2,
  Minimize2,
  User as UserIcon,
  UserCheck,
  LogIn,
  Cloud,
} from "lucide-react";

interface MainMenuProps {
  selectedCharacter: Character;
  highScore: number;
  onStartGame: () => void;
  onOpenCharacters: () => void;
  onOpenHowToPlay: () => void;
  onOpenLeaderboard: () => void;
  onOpenDrive: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  selectedCharacter,
  highScore,
  onStartGame,
  onOpenCharacters,
  onOpenHowToPlay,
  onOpenLeaderboard,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  isFullscreen = false,
  onToggleFullscreen,
  currentUser,
  onOpenAuth,
  onOpenDrive,
}) => {
  return (
    <div id="main-menu-screen" className="absolute inset-0 flex flex-col justify-between items-center p-6 md:p-8 text-white z-30 select-none overflow-hidden">
      {/* Top Floating Controls */}
      <div className="flex items-center justify-between w-full max-w-md">
        {/* User / Record Pill / Drive Pill */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {onOpenAuth && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenAuth();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-lg transition-all text-xs font-bold active:scale-95 ${
                currentUser
                  ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30"
                  : "bg-slate-900/80 border-white/10 text-sky-300 hover:bg-slate-800"
              }`}
              title={currentUser ? `Conectado como ${currentUser.displayName}` : "Fazer Login ou Cadastro"}
            >
              {currentUser ? <UserCheck size={14} className="text-emerald-400" /> : <LogIn size={14} />}
              <span className="truncate max-w-[80px]">
                {currentUser ? currentUser.displayName : "Entrar"}
              </span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onOpenDrive();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 shadow-lg transition-all text-xs font-bold active:scale-95"
            title="Google Drive Cloud Save & Backups"
          >
            <Cloud size={13} />
            <span className="hidden sm:inline">Drive</span>
          </button>

          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
            <Trophy size={13} className="text-amber-400" />
            <span className="text-xs font-black text-amber-300 tabular-nums">
              {highScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Audio & Fullscreen Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-slate-300"
              title={isFullscreen ? "Sair da Tela Cheia (F)" : "Tela Cheia (F)"}
            >
              {isFullscreen ? <Minimize2 size={16} className="text-amber-300" /> : <Maximize2 size={16} />}
            </button>
          )}
          <button
            onClick={() => {
              sound.init();
              onToggleSound();
            }}
            className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-slate-300"
            title="Som"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
          </button>
          <button
            onClick={() => {
              sound.init();
              onToggleMusic();
            }}
            className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-slate-300"
            title="Música"
          >
            <Music size={16} className={musicEnabled ? "text-sky-400" : "text-slate-500"} />
          </button>
        </div>
      </div>

      {/* Middle Brand & Character Hero Banner */}
      <div className="flex flex-col items-center text-center space-y-4 my-auto">
        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-[11px] font-bold text-sky-300 tracking-wider uppercase mb-1">
            <Sparkles size={12} /> Jogo Arcade de Sobrevivência
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase drop-shadow-2xl bg-gradient-to-b from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
            O CÉU É O LIMITE
          </h1>
          <p className="text-sm md:text-base font-semibold text-sky-200/90 drop-shadow">
            &ldquo;Até onde você consegue chegar?&rdquo;
          </p>
        </div>

        {/* Character Preview Interactive Card */}
        <div
          onClick={() => {
            sound.playClick();
            onOpenCharacters();
          }}
          className="group relative cursor-pointer bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-white/15 shadow-2xl hover:border-sky-400/50 hover:bg-slate-900/95 transition-all hover:scale-105"
        >
          <div className="flex items-center gap-4">
            {/* Animated Character Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border-2 border-white/30 shadow-lg animate-bounce"
              style={{ backgroundColor: selectedCharacter.color }}
            >
              {selectedCharacter.name.substring(0, 2).toUpperCase()}
            </div>

            <div className="text-left">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Personagem Selecionado
              </span>
              <div className="text-lg font-black text-white flex items-center gap-2">
                {selectedCharacter.name}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/10 text-sky-300">
                  {selectedCharacter.type}
                </span>
              </div>
              <div className="text-xs text-amber-300 font-semibold mt-0.5">
                ⚡ Habilidade: {selectedCharacter.abilityName}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-sky-400/80 font-bold text-center mt-2.5 pt-2 border-t border-white/10 group-hover:text-sky-300">
            Clique para trocar de herói ⇄
          </div>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col gap-2.5 w-full max-w-xs">
        {/* Play Button */}
        <button
          id="main-menu-play-btn"
          onClick={() => {
            sound.init();
            sound.playClick();
            onStartGame();
          }}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 active:scale-95 transition-all font-black text-base text-slate-950 shadow-xl shadow-emerald-500/30"
        >
          <Play size={22} className="fill-slate-950" />
          JOGAR AGORA
        </button>

        {/* Secondary Buttons Grid */}
        <div className="grid grid-cols-3 gap-2">
          <button
            id="main-menu-char-btn"
            onClick={() => {
              sound.playClick();
              onOpenCharacters();
            }}
            className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/10 active:scale-95 transition-all text-xs font-bold text-slate-200"
          >
            <Users size={18} className="text-sky-400" />
            <span>Heróis</span>
          </button>

          <button
            id="main-menu-howto-btn"
            onClick={() => {
              sound.playClick();
              onOpenHowToPlay();
            }}
            className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/10 active:scale-95 transition-all text-xs font-bold text-slate-200"
          >
            <HelpCircle size={18} className="text-amber-400" />
            <span>Regras</span>
          </button>

          <button
            id="main-menu-leaderboard-btn"
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/10 active:scale-95 transition-all text-xs font-bold text-slate-200"
          >
            <Trophy size={18} className="text-purple-400" />
            <span>Ranking</span>
          </button>
        </div>

        {/* Google Drive Cloud Save Button */}
        <button
          id="main-menu-drive-btn"
          onClick={() => {
            sound.playClick();
            onOpenDrive();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600/30 via-sky-600/30 to-indigo-600/30 hover:bg-blue-600/40 backdrop-blur-md border border-blue-400/30 active:scale-98 transition-all text-xs font-bold text-sky-200 shadow-md"
        >
          <Cloud size={16} className="text-sky-400" />
          <span>Google Drive • Nuvem & Backups</span>
        </button>

        {/* Controls Hint */}
        <p className="text-center text-[11px] text-slate-400 mt-1">
          <strong>A / D</strong> Mover • <strong>W / ESPAÇO</strong> Pular • <strong>E / SHIFT</strong> Habilidade • <strong>F</strong> Tela Cheia
        </p>
      </div>
    </div>
  );
};

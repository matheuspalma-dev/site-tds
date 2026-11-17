import React from "react";
import { sound } from "../utils/audio";
import { Play, RotateCcw, Home, Volume2, VolumeX, Music, Users, Trophy } from "lucide-react";
import { Character } from "../types";

interface PauseModalProps {
  score: number;
  height: number;
  character: Character;
  onResume: () => void;
  onRestart: () => void;
  onChangeCharacter: () => void;
  onOpenLeaderboard: () => void;
  onGoToMenu: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  height,
  character,
  onResume,
  onRestart,
  onChangeCharacter,
  onOpenLeaderboard,
  onGoToMenu,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <div id="pause-modal" className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 text-white animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-4">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-black tracking-wider uppercase text-white">
            JOGO PAUSADO
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Respire fundo antes de continuar a escalada
          </p>
        </div>

        {/* Current Match Quick Stats */}
        <div className="flex items-center justify-around w-full bg-slate-950/70 py-3 px-4 rounded-2xl border border-white/5 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Altura</span>
            <span className="font-black text-emerald-400 text-base">{height} m</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Pontos</span>
            <span className="font-black text-sky-400 text-base">{score.toLocaleString()}</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Herói</span>
            <span className="font-black text-amber-300 text-base">{character.name}</span>
          </div>
        </div>

        {/* Sound toggles */}
        <div className="flex items-center justify-center gap-3 w-full py-1">
          <button
            onClick={onToggleSound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} className="text-red-400" />}
            <span>Som: {soundEnabled ? "Ligado" : "Mudo"}</span>
          </button>

          <button
            onClick={onToggleMusic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
          >
            <Music size={15} className={musicEnabled ? "text-sky-400" : "text-slate-500"} />
            <span>Música: {musicEnabled ? "Ligada" : "Muda"}</span>
          </button>
        </div>

        {/* Actions */}
        <div className="w-full space-y-2 pt-2 border-t border-white/10">
          <button
            id="pause-resume-btn"
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-98 transition-all font-black text-sm text-slate-950 shadow-lg shadow-emerald-500/20"
          >
            <Play size={18} />
            CONTINUAR (P)
          </button>

          <button
            id="pause-restart-btn"
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 transition-all text-xs font-bold"
          >
            <RotateCcw size={16} />
            REINICIAR PARTIDA (R)
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onChangeCharacter();
              }}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
            >
              <Users size={14} />
              Personagens
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenLeaderboard();
              }}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
            >
              <Trophy size={14} />
              Ranking
            </button>
          </div>

          <button
            id="pause-menu-btn"
            onClick={() => {
              sound.playClick();
              onGoToMenu();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Home size={14} />
            Voltar ao Menu Principal (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};

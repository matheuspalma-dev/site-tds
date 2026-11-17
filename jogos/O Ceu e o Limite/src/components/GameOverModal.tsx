import React, { useState, useEffect } from "react";
import { Character, UserProfile } from "../types";
import { sound } from "../utils/audio";
import { RotateCcw, Users, Trophy, Home, Send, CheckCircle2, UserCheck, Sparkles, Cloud } from "lucide-react";

interface GameOverModalProps {
  score: number;
  height: number;
  level: number;
  character: Character;
  highScore: number;
  isNewRecord: boolean;
  onPlayAgain: () => void;
  onChangeCharacter: () => void;
  onOpenLeaderboard: () => void;
  onGoToMenu: () => void;
  onSubmitScore: (playerName: string) => Promise<void>;
  currentUser?: UserProfile | null;
  onOpenDrive?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  height,
  level,
  character,
  highScore,
  isNewRecord,
  onPlayAgain,
  onChangeCharacter,
  onOpenLeaderboard,
  onGoToMenu,
  onSubmitScore,
  currentUser,
  onOpenDrive,
}) => {
  const [playerName, setPlayerName] = useState(() => {
    if (currentUser?.displayName) return currentUser.displayName;
    try {
      return localStorage.getItem("ceuLimitePlayerName") || "Aventureiro";
    } catch {
      return "Aventureiro";
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (currentUser?.displayName) {
      setPlayerName(currentUser.displayName);
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting || submitted) return;
    setIsSubmitting(true);
    sound.playClick();
    try {
      localStorage.setItem("ceuLimitePlayerName", playerName.trim());
      await onSubmitScore(playerName.trim());
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="game-over-modal" className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 text-white animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center space-y-5">
        {/* Title */}
        <div>
          {isNewRecord ? (
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/70 border border-amber-400/40 px-3 py-1 rounded-full animate-bounce inline-block">
                ★ NOVO RECORDE PESSOAL! ★
              </span>
              <h2 className="text-3xl font-black text-amber-300">PARABÉNS!</h2>
            </div>
          ) : (
            <h2 className="text-3xl font-black text-red-500 tracking-wider">
              A LAVA TE ALCANÇOU!
            </h2>
          )}
          <p className="text-xs text-slate-400 mt-1">
            Você sobreviveu corajosamente nas nuvens
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Altura
            </span>
            <span className="text-lg font-black text-emerald-400">
              {height} <span className="text-xs">m</span>
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Pontuação
            </span>
            <span className="text-lg font-black text-sky-400">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Nível
            </span>
            <span className="text-lg font-black text-purple-400">
              {level}
            </span>
          </div>
        </div>

        {/* Character Used */}
        <div className="flex items-center gap-3 bg-slate-950/40 px-4 py-2 rounded-xl border border-white/5 w-full justify-center text-xs">
          <span className="text-slate-400">Personagem:</span>
          <span
            className="font-bold px-2 py-0.5 rounded-md text-slate-950"
            style={{ backgroundColor: character.color }}
          >
            {character.name} ({character.type})
          </span>
        </div>

        {/* Connected player status */}
        {currentUser && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-bold text-emerald-300">
            <UserCheck size={13} />
            <span>Conta vinculada: <strong>{currentUser.displayName}</strong></span>
          </div>
        )}

        {/* Submit to Global Leaderboard Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-2">
          <div className="flex items-center gap-2">
            <input
              id="gameover-player-name-input"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Seu nome no ranking..."
              maxLength={20}
              disabled={submitted}
              className="flex-1 bg-slate-950/80 border border-white/15 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
            <button
              id="gameover-submit-score-btn"
              type="submit"
              disabled={isSubmitting || submitted}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                submitted
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-sky-500 hover:bg-sky-400 text-slate-950 font-black shadow"
              }`}
            >
              {submitted ? (
                <>
                  <CheckCircle2 size={14} /> Salvo
                </>
              ) : isSubmitting ? (
                "Enviando..."
              ) : (
                <>
                  <Send size={14} /> Salvar no Rank
                </>
              )}
            </button>
          </div>
          {submitted && (
            <p className="text-[11px] text-emerald-400 font-medium flex items-center justify-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Pontuação vinculada ao <strong>Ranking Oficial do Firebase</strong>!</span>
            </p>
          )}
        </form>

        {/* Action Buttons */}
        <div className="w-full space-y-2 pt-2 border-t border-white/10">
          <button
            id="gameover-play-again-btn"
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-98 transition-all font-black text-sm text-slate-950 shadow-lg shadow-emerald-500/20"
          >
            <RotateCcw size={18} />
            JOGAR NOVAMENTE (R)
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="gameover-char-select-btn"
              onClick={() => {
                sound.playClick();
                onChangeCharacter();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 transition-all text-xs font-bold"
            >
              <Users size={15} />
              Personagens
            </button>

            <button
              id="gameover-leaderboard-btn"
              onClick={() => {
                sound.playClick();
                onOpenLeaderboard();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 transition-all text-xs font-bold"
            >
              <Trophy size={15} />
              Ranking
            </button>
          </div>

          {onOpenDrive && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenDrive();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/30 to-sky-600/30 hover:bg-blue-600/50 border border-blue-400/30 text-sky-200 text-xs font-bold transition-all active:scale-98"
            >
              <Cloud size={15} className="text-sky-400" />
              <span>Salvar Backup no Google Drive</span>
            </button>
          )}

          <button
            id="gameover-menu-btn"
            onClick={() => {
              sound.playClick();
              onGoToMenu();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Home size={14} />
            Voltar ao Menu Inicial (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};

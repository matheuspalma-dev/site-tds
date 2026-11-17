import React, { useEffect, useState } from "react";
import { ScoreData, UserProfile } from "../types";
import { sound } from "../utils/audio";
import { fetchTopScoresFromFirebase, subscribeToLeaderboard } from "../lib/firebase";
import {
  ArrowLeft,
  Trophy,
  Medal,
  Award,
  RefreshCw,
  Flame,
  Mountain,
  Database,
  User as UserIcon,
  UserCheck,
  LogIn,
  Trash2,
} from "lucide-react";

interface LeaderboardModalProps {
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
  onBack: () => void;
  onStartGame: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  currentUser,
  onOpenAuth,
  onBack,
  onStartGame,
}) => {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [filterChar, setFilterChar] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    highestScore: number;
    maxHeight: number;
    totalGames: number;
  }>({
    highestScore: 0,
    maxHeight: 0,
    totalGames: 0,
  });
  const [isResetting, setIsResetting] = useState(false);

  const handleResetLeaderboard = async () => {
    if (!window.confirm("Deseja realmente zerar todos os recordes do placar?")) return;
    setIsResetting(true);
    sound.playClick();
    try {
      localStorage.removeItem("ceuLimiteHighScore");
      await fetch("/api/scores", { method: "DELETE" });
      setScores([]);
      setStats({
        highestScore: 0,
        maxHeight: 0,
        totalGames: 0,
      });
      await loadScores();
    } catch (e) {
      console.warn("Could not reset scores:", e);
    } finally {
      setIsResetting(false);
    }
  };

  const loadScores = async (char = filterChar) => {
    setLoading(true);
    try {
      // 1. Try Firebase Firestore directly
      const firestoreScores = await fetchTopScoresFromFirebase(char, 25);
      if (firestoreScores && firestoreScores.length > 0) {
        setScores(firestoreScores);
        const maxScore = Math.max(...firestoreScores.map((s) => s.score));
        const maxH = Math.max(...firestoreScores.map((s) => s.height));
        setStats({
          highestScore: maxScore,
          maxHeight: maxH,
          totalGames: firestoreScores.length,
        });
        setLoading(false);
        return;
      }

      // 2. Fallback to API
      const res = await fetch(`/api/scores?character=${char}&limit=25`);
      if (res.ok) {
        const data = await res.json();
        setScores(data.scores || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.warn("Leaderboard fetch error, fallback to local storage:", err);
      const localBest = parseInt(localStorage.getItem("ceuLimiteHighScore") || "0", 10);
      if (localBest > 0) {
        setScores([
          {
            id: "local-1",
            playerName: currentUser?.displayName || "Você (Local)",
            characterId: "leo",
            characterName: "Leo",
            score: localBest,
            height: Math.floor(localBest / 15),
            level: Math.floor(localBest / 4000) + 1,
            timestamp: Date.now(),
          },
        ]);
        setStats({
          highestScore: localBest,
          maxHeight: Math.floor(localBest / 15),
          totalGames: 1,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScores();

    // Subscribe to real-time Firestore updates
    const unsubscribe = subscribeToLeaderboard(filterChar, (realtimeScores) => {
      if (realtimeScores && realtimeScores.length > 0) {
        setScores(realtimeScores);
        const maxScore = Math.max(...realtimeScores.map((s) => s.score));
        const maxH = Math.max(...realtimeScores.map((s) => s.height));
        setStats({
          highestScore: maxScore,
          maxHeight: maxH,
          totalGames: realtimeScores.length,
        });
        setLoading(false);
      }
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [filterChar]);

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
          <Trophy size={14} />
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-black text-xs shadow">
          <Medal size={14} />
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-amber-100 font-black text-xs shadow">
          <Award size={14} />
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-400 font-bold text-xs">
        #{index + 1}
      </span>
    );
  };

  return (
    <div id="leaderboard-screen" className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-6 overflow-y-auto text-white z-40">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto w-full pb-4 border-b border-white/10">
        <button
          id="leaderboard-back-btn"
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-sm font-bold"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
            <Database size={11} /> Firebase Firestore Cloud Conectado
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-wide uppercase bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Trophy size={22} className="text-amber-400" />
            Ranking Global
          </h2>
          <p className="text-xs text-slate-400">
            Os maiores saltadores que desafiaram a lava e alcançaram as alturas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAuth && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenAuth();
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentUser
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                  : "bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-400/30"
              }`}
            >
              {currentUser ? <UserCheck size={14} /> : <LogIn size={14} />}
              <span className="hidden sm:inline">
                {currentUser ? currentUser.displayName : "Login / Cadastro"}
              </span>
            </button>
          )}

          <button
            id="leaderboard-play-btn"
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 transition-all text-sm font-black shadow-lg shadow-emerald-500/20"
          >
            Jogar
          </button>
        </div>
      </div>

      {/* Global Stats Overview */}
      <div className="grid grid-cols-3 gap-3 max-w-4xl mx-auto w-full my-3">
        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-400 font-bold uppercase mb-1">
            <Trophy size={14} /> Maior Pontuação
          </div>
          <div className="text-xl font-black text-white tabular-nums">
            {stats.highestScore.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-bold uppercase mb-1">
            <Mountain size={14} /> Altura Máxima
          </div>
          <div className="text-xl font-black text-emerald-400 tabular-nums">
            {stats.maxHeight.toLocaleString()} m
          </div>
        </div>

        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-white/10 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-purple-400 font-bold uppercase mb-1">
            <Flame size={14} /> Partidas Salvas
          </div>
          <div className="text-xl font-black text-purple-300 tabular-nums">
            {stats.totalGames}
          </div>
        </div>
      </div>

      {/* User Status Bar if logged in */}
      {currentUser && (
        <div className="max-w-4xl mx-auto w-full bg-emerald-950/40 border border-emerald-500/30 rounded-2xl px-4 py-2 flex items-center justify-between text-xs text-emerald-200 mb-2">
          <div className="flex items-center gap-2">
            <UserCheck size={16} className="text-emerald-400" />
            <span>
              Conectado como <strong>{currentUser.displayName}</strong> ({currentUser.email})
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold hidden sm:inline">
            Seus recordes são sincronizados automaticamente com o Firebase
          </span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 max-w-4xl mx-auto w-full my-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-1.5">
          {["all", "leo", "flash", "pulo", "rocky", "nuvem", "fenix"].map((charKey) => (
            <button
              key={charKey}
              onClick={() => {
                sound.playClick();
                setFilterChar(charKey);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${
                filterChar === charKey
                  ? "bg-sky-500 text-slate-950 shadow-md font-black"
                  : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {charKey === "all" ? "Todos os Heróis" : charKey}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleResetLeaderboard()}
            disabled={isResetting}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold active:scale-95 transition-all"
            title="Zerar placar e recordes"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">Zerar Recordes</span>
          </button>

          <button
            onClick={() => loadScores()}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300"
            title="Atualizar ranking"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="max-w-4xl mx-auto w-full flex-1 bg-slate-900/60 rounded-2xl border border-white/10 overflow-hidden my-2 flex flex-col">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-950/60 border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-2 md:col-span-1 text-center">Pos</div>
          <div className="col-span-5 md:col-span-4">Jogador</div>
          <div className="col-span-3 md:col-span-2">Personagem</div>
          <div className="hidden md:block md:col-span-2 text-right">Altura</div>
          <div className="col-span-2 md:col-span-1 text-center">Nível</div>
          <div className="col-span-2 text-right">Pontos</div>
        </div>

        <div className="divide-y divide-white/5 overflow-y-auto max-h-[340px]">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw size={16} className="animate-spin" /> Carregando pontuações do Firebase Firestore...
            </div>
          ) : scores.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Nenhuma pontuação registrada para este filtro ainda. Seja o primeiro a jogar!
            </div>
          ) : (
            scores.map((entry, idx) => {
              const isCurrentUser =
                (currentUser?.uid && entry.userId === currentUser.uid) ||
                (currentUser?.displayName && entry.playerName === currentUser.displayName);

              return (
                <div
                  key={entry.id || idx}
                  className={`grid grid-cols-12 gap-2 px-4 py-3 items-center text-xs transition-colors ${
                    isCurrentUser
                      ? "bg-emerald-500/15 border-l-4 border-emerald-400 hover:bg-emerald-500/25"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="col-span-2 md:col-span-1 flex justify-center">
                    {getRankBadge(idx)}
                  </div>

                  <div className="col-span-5 md:col-span-4 font-bold text-white truncate flex items-center gap-1.5">
                    <span>{entry.playerName}</span>
                    {isCurrentUser && (
                      <span className="text-[10px] bg-emerald-400/30 text-emerald-300 font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-400/40">
                        Você
                      </span>
                    )}
                  </div>

                  <div className="col-span-3 md:col-span-2">
                    <span className="text-[11px] font-semibold bg-white/10 px-2 py-0.5 rounded-md text-slate-300">
                      {entry.characterName}
                    </span>
                  </div>

                  <div className="hidden md:block md:col-span-2 text-right font-semibold text-emerald-400">
                    {entry.height} m
                  </div>

                  <div className="col-span-2 md:col-span-1 text-center font-bold text-purple-400">
                    {entry.level}
                  </div>

                  <div className="col-span-2 text-right font-black text-amber-300 tabular-nums">
                    {entry.score.toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-400 max-w-lg mx-auto w-full pt-2 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        Sincronização em tempo real ativa com o banco de dados Firebase Firestore.
      </div>
    </div>
  );
};

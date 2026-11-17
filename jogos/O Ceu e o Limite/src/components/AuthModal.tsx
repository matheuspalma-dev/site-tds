import React, { useState } from "react";
import { UserProfile } from "../types";
import { sound } from "../utils/audio";
import { registerPlayerAccount, loginPlayerAccount, logoutPlayerAccount } from "../lib/firebase";
import { signInWithGoogleDrive } from "../lib/googleDrive";
import { GoogleLogoSvg } from "./DriveModal";
import {
  ArrowLeft,
  UserCheck,
  UserPlus,
  LogIn,
  LogOut,
  Trophy,
  Mountain,
  Gamepad2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
  Cloud,
} from "lucide-react";

interface AuthModalProps {
  currentUser: UserProfile | null;
  onProfileUpdated: (user: UserProfile | null) => void;
  onBack: () => void;
  onOpenDrive?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onProfileUpdated,
  onBack,
  onOpenDrive,
}) => {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleGoogleSignIn = async () => {
    sound.playClick();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await signInWithGoogleDrive();
      if (res) {
        onProfileUpdated(res.profile);
        sound.playHighScore();
        setSuccessMessage(`Conectado com sucesso via Google! Olá, ${res.profile.displayName}!`);
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMessage("A janela de login do Google foi fechada.");
      } else {
        setErrorMessage(err.message || "Falha no login com Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (mode === "register" && (!displayName || displayName.trim().length < 2)) {
      setErrorMessage("O nome do jogador deve ter pelo menos 2 caracteres.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    sound.playClick();

    try {
      if (mode === "register") {
        const user = await registerPlayerAccount(email, password, displayName);
        onProfileUpdated(user);
        sound.playHighScore();
        setSuccessMessage(`Conta criada com sucesso! Bem-vindo, ${user.displayName}!`);
      } else {
        const user = await loginPlayerAccount(email, password);
        onProfileUpdated(user);
        sound.playHighScore();
        setSuccessMessage(`Login realizado com sucesso! Bem-vindo de volta, ${user.displayName}!`);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = "Ocorreu um erro ao processar sua solicitação.";
      if (err.code === "auth/email-already-in-use") {
        msg = "Este e-mail já está cadastrado. Tente fazer login.";
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        msg = "E-mail ou senha incorretos.";
      } else if (err.code === "auth/user-not-found") {
        msg = "Nenhuma conta encontrada com este e-mail.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Formato de e-mail inválido.";
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    sound.playClick();
    setLoading(true);
    try {
      await logoutPlayerAccount();
      onProfileUpdated(null);
      setSuccessMessage("Você desconectou da sua conta.");
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-screen"
      className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-6 text-white z-40 select-none overflow-y-auto"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-lg mx-auto w-full">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xs font-bold text-slate-200"
        >
          <ArrowLeft size={16} /> Voltar ao Menu
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
          <ShieldCheck size={12} /> Firebase Cloud Auth
        </div>
      </div>

      {/* Main Content Box */}
      <div className="max-w-md mx-auto w-full my-auto py-4">
        {currentUser ? (
          /* Profile Card when logged in */
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-emerald-500/30 shadow-2xl space-y-6 text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-600 flex items-center justify-center text-3xl font-black text-white shadow-lg mx-auto border-2 border-white/20">
                {currentUser.displayName.substring(0, 2).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-slate-900">
                <UserCheck size={14} className="text-white" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Jogador Conectado no Firebase
              </span>
              <h2 className="text-2xl font-black text-white">{currentUser.displayName}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-white/5 text-center">
                <Trophy size={16} className="text-amber-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 font-bold uppercase">Recorde</div>
                <div className="text-sm font-black text-amber-300 tabular-nums">
                  {currentUser.highScore ? currentUser.highScore.toLocaleString() : 0}
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-white/5 text-center">
                <Mountain size={16} className="text-emerald-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 font-bold uppercase">Altitude</div>
                <div className="text-sm font-black text-emerald-300 tabular-nums">
                  {currentUser.maxHeight || 0}m
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-white/5 text-center">
                <Gamepad2 size={16} className="text-sky-400 mx-auto mb-1" />
                <div className="text-[10px] text-slate-400 font-bold uppercase">Partidas</div>
                <div className="text-sm font-black text-sky-300 tabular-nums">
                  {currentUser.totalGames || 0}
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/20 text-left flex items-start gap-2.5">
              <Sparkles size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-200 leading-relaxed">
                Suas pontuações são <strong>automaticamente vinculadas</strong> ao seu nome no{" "}
                <strong>Ranking Global</strong> do Firebase a cada partida!
              </p>
            </div>

            {onOpenDrive && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenDrive();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600/30 via-sky-600/30 to-indigo-600/30 hover:bg-blue-600/40 border border-blue-400/30 text-sky-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
              >
                <Cloud size={16} className="text-sky-400" />
                <span>Gerenciar Backups no Google Drive</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 active:scale-95 border border-red-500/30 text-red-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <LogOut size={16} /> Desconectar Conta
            </button>
          </div>
        ) : (
          /* Login & Registration Form */
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5">
            {/* Google Sign-in Option (Official Button) */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="gsi-material-button w-full relative flex items-center justify-center gap-3 py-3 rounded-2xl bg-white text-slate-800 hover:bg-slate-100 active:scale-98 transition-all shadow-lg font-bold text-xs border border-slate-200 cursor-pointer disabled:opacity-50"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper flex items-center gap-2.5">
                  <div className="gsi-material-button-icon">
                    <GoogleLogoSvg />
                  </div>
                  <span className="gsi-material-button-contents font-medium tracking-wide">
                    {loading ? "Conectando..." : "Sign in with Google"}
                  </span>
                </div>
              </button>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                <div className="flex-1 h-px bg-white/10" />
                <span>ou use e-mail e senha</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode("register");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mode === "register"
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UserPlus size={14} /> Criar Cadastro
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMode("login");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  mode === "login"
                    ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LogIn size={14} /> Entrar (Login)
              </button>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-black text-white">
                {mode === "register" ? "Cadastrar Conta de Jogador" : "Acessar sua Conta"}
              </h2>
              <p className="text-[11px] text-slate-400 mt-1">
                {mode === "register"
                  ? "Crie sua conta para registrar seu nome e recordes no Ranking Oficial do Firebase."
                  : "Entre para carregar suas estatísticas e exibir seu nome no Ranking."}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === "register" && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Nome de Jogador (Exibido no Ranking)
                  </label>
                  <div className="relative">
                    <UserIcon
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ex: Kauan, SkyWalker, ProJumper"
                      maxLength={20}
                      required
                      className="w-full bg-slate-950/80 border border-white/10 focus:border-sky-400 rounded-2xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    required
                    className="w-full bg-slate-950/80 border border-white/10 focus:border-sky-400 rounded-2xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                    className="w-full bg-slate-950/80 border border-white/10 focus:border-sky-400 rounded-2xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-emerald-500 to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-slate-950" />
                    <span>Processando no Firebase...</span>
                  </>
                ) : mode === "register" ? (
                  <>
                    <UserPlus size={18} />
                    <span>Concluir Cadastro & Vincular Rank</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Entrar na Conta</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-slate-500 max-w-lg mx-auto w-full">
        Autenticação e dados sincronizados em tempo real com o banco de dados Firebase Firestore.
      </div>
    </div>
  );
};

import React from "react";
import { sound } from "../utils/audio";
import { ArrowLeft, Play, Keyboard, Smartphone, Cloud, Zap, Flame, ShieldAlert } from "lucide-react";

interface HowToPlayModalProps {
  onBack: () => void;
  onStartGame: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  onBack,
  onStartGame,
}) => {
  return (
    <div id="how-to-play-screen" className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-6 overflow-y-auto text-white z-40">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto w-full pb-4 border-b border-white/10">
        <button
          id="how-to-play-back-btn"
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
          <h2 className="text-xl md:text-2xl font-black tracking-wide uppercase bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
            Como Jogar
          </h2>
          <p className="text-xs text-slate-400">
            Guia completo de sobrevivência e controles de voo
          </p>
        </div>

        <button
          id="how-to-play-play-btn"
          onClick={() => {
            sound.playClick();
            onStartGame();
          }}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 transition-all text-sm font-black shadow-lg shadow-emerald-500/20"
        >
          <Play size={18} />
          Jogar
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full my-4">
        {/* Objective & Danger */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-amber-400 uppercase tracking-wide">
            <Flame size={18} className="text-red-500" />
            Objetivo Principal
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Uma maré avassaladora de lava está subindo implacavelmente pelas montanhas vulcânicas!
            Salte entre as nuvens suspensas no céu para subir o mais alto possível. Não há linha de chegada:
            o objetivo é a sobrevivência máxima!
          </p>
          <div className="bg-red-950/40 border border-red-500/30 p-3 rounded-xl flex items-start gap-2.5">
            <ShieldAlert size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-200 leading-normal">
              A lava fica mais rápida e o ambiente mais perigoso conforme você atinge altitudes superiores! Fique de olho na barra de perigo do HUD.
            </p>
          </div>
        </div>

        {/* Controls (Desktop & Mobile) */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-sky-400 uppercase tracking-wide">
            <Keyboard size={18} />
            Controles no Teclado
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/70 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 block text-[10px]">Mover Esquerda / Direita</span>
              <span className="font-bold text-white">A / D ou ← →</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 block text-[10px]">Pular</span>
              <span className="font-bold text-emerald-400">ESPAÇO / W / ↑</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 block text-[10px]">Habilidade Especial</span>
              <span className="font-bold text-amber-400">E ou SHIFT</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 block text-[10px]">Pausar / Reiniciar</span>
              <span className="font-bold text-purple-400">P / R</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-slate-300">
            <Smartphone size={16} className="text-emerald-400" />
            <span>No Celular: botões virtuais rápidos e responsivos aparecem na tela.</span>
          </div>
        </div>

        {/* Platforms Guide */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 text-sm font-black text-emerald-400 uppercase tracking-wide">
            <Cloud size={18} />
            Tipos de Plataformas
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs text-center">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 flex flex-col items-center">
              <div className="w-10 h-4 bg-white rounded-full mb-2 shadow" />
              <span className="font-bold text-white block">Normal</span>
              <span className="text-[10px] text-slate-400">Estável e segura</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 flex flex-col items-center">
              <div className="w-6 h-4 bg-white rounded-full mb-2 shadow" />
              <span className="font-bold text-white block">Pequena</span>
              <span className="text-[10px] text-slate-400">Menor área de pouso</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 flex flex-col items-center">
              <div className="w-10 h-4 bg-sky-200 rounded-full mb-2 shadow flex items-center justify-center text-[8px] font-bold text-sky-800">
                ◀ ▶
              </div>
              <span className="font-bold text-sky-300 block">Móvel</span>
              <span className="text-[10px] text-slate-400">Desloca no ar</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 flex flex-col items-center">
              <div className="w-10 h-4 bg-slate-400 rounded-full mb-2 shadow border border-dashed border-slate-600" />
              <span className="font-bold text-slate-300 block">Quebradiça</span>
              <span className="text-[10px] text-slate-400">Quebra após o pouso</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 flex flex-col items-center">
              <div className="w-10 h-4 bg-sky-100 rounded-full mb-2 shadow flex items-center justify-center text-[8px] font-bold text-sky-600">
                ▲ MOLA
              </div>
              <span className="font-bold text-emerald-300 block">Impulso</span>
              <span className="text-[10px] text-slate-400">Super pulo vertical</span>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 flex flex-col items-center">
              <div className="w-10 h-4 bg-amber-300 rounded-full mb-2 shadow-md shadow-amber-500/50 flex items-center justify-center text-[8px] font-bold text-slate-950">
                ★ +1500
              </div>
              <span className="font-bold text-amber-300 block">Rara</span>
              <span className="text-[10px] text-slate-400">Bônus de pontuação</span>
            </div>
          </div>
        </div>

        {/* Character Abilities Brief */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/10 space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 text-sm font-black text-purple-400 uppercase tracking-wide">
            <Zap size={18} />
            Habilidades Estratégicas dos Personagens
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5">
              <span className="font-bold text-sky-300">Leo: Impulso</span>
              <p className="text-[11px] text-slate-400">Sequência de pousos ativa turbo de velocidade.</p>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5">
              <span className="font-bold text-amber-300">Flash: Dash</span>
              <p className="text-[11px] text-slate-400">Arremesso sônico horizontal no ar.</p>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5">
              <span className="font-bold text-emerald-300">Pulo: Super Salto</span>
              <p className="text-[11px] text-slate-400">Pulo colossal que sobe várias plataformas.</p>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5">
              <span className="font-bold text-purple-300">Rocky: Impacto</span>
              <p className="text-[11px] text-slate-400">Destrói obstáculos e empurra a lava para baixo.</p>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5">
              <span className="font-bold text-cyan-300">Nuvem: Flutuar</span>
              <p className="text-[11px] text-slate-400">Plana suavemente no ar com baixa gravidade.</p>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-white/5">
              <span className="font-bold text-red-400">Fênix: 2ª Chance</span>
              <p className="text-[11px] text-slate-400">Ressurge das chamas ao tocar na lava (1x).</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 max-w-lg mx-auto w-full pt-2">
        Aperte <strong>JOGAR</strong> para iniciar a sua escalada rumo ao infinito!
      </div>
    </div>
  );
};

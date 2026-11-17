import React from "react";
import { ArrowLeft, ArrowRight, ArrowUp, Zap } from "lucide-react";

interface MobileControlsProps {
  onInputStateChange: (inputs: {
    left: boolean;
    right: boolean;
    jump: boolean;
    ability: boolean;
  }) => void;
  abilityName: string;
  abilityReady: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onInputStateChange,
  abilityName,
  abilityReady,
}) => {
  const inputsRef = React.useRef({
    left: false,
    right: false,
    jump: false,
    ability: false,
  });

  const setInput = (key: "left" | "right" | "jump" | "ability", active: boolean) => {
    if (inputsRef.current[key] !== active) {
      inputsRef.current[key] = active;
      onInputStateChange({ ...inputsRef.current });
    }
  };

  const bindPointer = (key: "left" | "right" | "jump" | "ability") => ({
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      setInput(key, true);
    },
    onPointerUp: (e: React.PointerEvent<HTMLElement>) => {
      e.preventDefault();
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setInput(key, false);
    },
    onPointerCancel: () => {
      setInput(key, false);
    },
    onPointerLeave: () => {
      setInput(key, false);
    },
    onTouchStart: (e: React.TouchEvent<HTMLElement>) => {
      e.preventDefault();
      setInput(key, true);
    },
    onTouchEnd: (e: React.TouchEvent<HTMLElement>) => {
      e.preventDefault();
      setInput(key, false);
    },
    onTouchCancel: (e: React.TouchEvent<HTMLElement>) => {
      e.preventDefault();
      setInput(key, false);
    },
  });

  return (
    <div
      id="mobile-controls"
      className="absolute bottom-2 inset-x-0 flex items-center justify-between px-3 md:hidden pointer-events-none z-30 select-none touch-none pb-2"
    >
      {/* Left/Right Directional Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          id="btn-touch-left"
          {...bindPointer("left")}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 active:bg-sky-500/80 active:scale-95 text-white flex items-center justify-center shadow-xl transition-transform"
          aria-label="Mover Esquerda"
        >
          <ArrowLeft size={24} />
        </button>

        <button
          id="btn-touch-right"
          {...bindPointer("right")}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 active:bg-sky-500/80 active:scale-95 text-white flex items-center justify-center shadow-xl transition-transform"
          aria-label="Mover Direita"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      {/* Action Controls (Ability & Jump) */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          id="btn-touch-ability"
          {...bindPointer("ability")}
          className={`w-14 h-14 rounded-2xl backdrop-blur-md border active:scale-95 flex flex-col items-center justify-center shadow-xl transition-all ${
            abilityReady
              ? "bg-gradient-to-tr from-amber-500 to-yellow-400 border-amber-300 text-slate-950 font-black animate-pulse"
              : "bg-slate-900/80 border-white/10 text-slate-400"
          }`}
          aria-label={abilityName}
        >
          <Zap size={20} />
          <span className="text-[9px] font-black uppercase leading-none mt-0.5">HAB</span>
        </button>

        <button
          id="btn-touch-jump"
          {...bindPointer("jump")}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 border-2 border-emerald-300 active:scale-95 text-slate-950 font-black flex flex-col items-center justify-center shadow-2xl transition-transform"
          aria-label="Pular"
        >
          <ArrowUp size={28} />
          <span className="text-[10px] font-black leading-none uppercase">PULO</span>
        </button>
      </div>
    </div>
  );
};

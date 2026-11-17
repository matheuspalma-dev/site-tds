import React, { useState } from "react";
import { Character } from "../types";
import { CHARACTERS } from "../constants/characters";
import { sound } from "../utils/audio";
import {
  ArrowLeft,
  Check,
  Play,
  Zap,
  Shield,
  Wind,
  Sparkles,
  Flame,
  Gauge,
  Activity,
  Award,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface CharacterSelectProps {
  selectedCharacter: Character;
  onSelectCharacter: (char: Character) => void;
  onBack: () => void;
  onStartGame: () => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  selectedCharacter,
  onSelectCharacter,
  onBack,
  onStartGame,
}) => {
  const [hoveredChar, setHoveredChar] = useState<Character | null>(null);

  const displayChar = hoveredChar || selectedCharacter;

  const getAbilityIcon = (ability: string) => {
    switch (ability) {
      case "dash":
        return <Zap size={18} className="text-amber-400 animate-pulse" />;
      case "superSalto":
        return <Sparkles size={18} className="text-emerald-400 animate-pulse" />;
      case "impacto":
        return <Shield size={18} className="text-purple-400 animate-pulse" />;
      case "flutuar":
        return <Wind size={18} className="text-cyan-400 animate-pulse" />;
      case "segundaChance":
        return <Flame size={18} className="text-red-400 animate-pulse" />;
      default:
        return <Gauge size={18} className="text-sky-400 animate-pulse" />;
    }
  };

  const handleCharacterClick = (char: Character) => {
    // Play character-specific thematic sound
    switch (char.ability) {
      case "dash":
        sound.playDash();
        break;
      case "superSalto":
        sound.playJump(true);
        break;
      case "impacto":
        sound.playImpact();
        break;
      case "flutuar":
        sound.playFloat();
        break;
      case "segundaChance":
        sound.playBooster();
        break;
      default:
        sound.playBooster();
        break;
    }
    onSelectCharacter(char);
  };

  return (
    <div
      id="character-select-screen"
      className="absolute inset-0 bg-slate-950/98 backdrop-blur-2xl flex flex-col justify-between p-3 md:p-6 overflow-y-auto text-white z-40"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 0%, ${displayChar.color}22 0%, transparent 60%), radial-gradient(circle at 10% 90%, #ef444415 0%, transparent 50%)`,
      }}
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 max-w-6xl mx-auto w-full pb-3 border-b border-white/10 shrink-0">
        <button
          id="char-select-back-btn"
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xs md:text-sm font-bold border border-white/10 hover:border-white/30"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-black tracking-widest text-amber-400 uppercase">
            <Sparkles size={13} />
            <span>GALERIA DE HERÓIS</span>
            <Sparkles size={13} />
          </div>
          <h2 className="text-lg md:text-2xl font-black tracking-tight uppercase bg-gradient-to-r from-white via-sky-200 to-amber-200 bg-clip-text text-transparent">
            Selecione seu Campeão
          </h2>
        </div>

        <button
          id="char-select-play-btn"
          onClick={() => {
            sound.playClick();
            onStartGame();
          }}
          className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 active:scale-95 transition-all text-xs md:text-sm font-black shadow-lg shadow-emerald-500/30 border border-emerald-400/40"
        >
          <Play size={16} className="fill-white" />
          <span>JOGAR</span>
        </button>
      </div>

      {/* Featured Hero Showcase Banner */}
      <div className="max-w-6xl mx-auto w-full my-3 p-3 md:p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-white/15 backdrop-blur-md shadow-2xl relative overflow-hidden shrink-0">
        {/* Ambient Glow */}
        <div
          className="absolute -right-10 -top-10 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-500"
          style={{ backgroundColor: displayChar.color }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          {/* Avatar & Signature */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center font-black text-2xl md:text-3xl border-2 shadow-2xl transition-transform duration-300 hover:scale-105"
                style={{
                  backgroundColor: displayChar.color,
                  borderColor: displayChar.accentColor,
                  boxShadow: `0 0 30px ${displayChar.color}66`,
                }}
              >
                {displayChar.name.substring(0, 2).toUpperCase()}
              </div>

              {/* Dynamic Archetype Pill */}
              <span
                className="absolute -bottom-2 -right-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shadow-md"
                style={{
                  backgroundColor: displayChar.secondaryColor,
                  borderColor: displayChar.accentColor,
                }}
              >
                {displayChar.type}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-black text-white tracking-wide">
                  {displayChar.name}
                </h3>
                {displayChar.id === selectedCharacter.id && (
                  <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-950/80 border border-emerald-400/60 text-emerald-300 px-2 py-0.5 rounded-full shadow">
                    <Check size={12} /> PRONTO PARA SUBIR
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 max-w-md mt-1 leading-relaxed">
                {displayChar.description}
              </p>
            </div>
          </div>

          {/* Ability Spotlight Box */}
          <div className="flex items-center gap-3 bg-slate-950/70 border border-white/15 px-4 py-2.5 rounded-2xl max-w-md w-full md:w-auto shadow-inner">
            <div
              className="p-2.5 rounded-xl border flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: `${displayChar.color}22`,
                borderColor: displayChar.accentColor,
              }}
            >
              {getAbilityIcon(displayChar.ability)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  {displayChar.abilityName}
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">
                  CD: {displayChar.cooldown}s
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                {displayChar.abilityDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Characters 6-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto w-full py-1">
        {CHARACTERS.map((char) => {
          const isSelected = selectedCharacter.id === char.id;

          return (
            <div
              key={char.id}
              id={`char-card-${char.id}`}
              onMouseEnter={() => setHoveredChar(char)}
              onMouseLeave={() => setHoveredChar(null)}
              onClick={() => handleCharacterClick(char)}
              className={`relative flex flex-col justify-between p-3.5 md:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none group ${
                isSelected
                  ? "bg-slate-900/95 shadow-2xl scale-[1.02] ring-2"
                  : "bg-slate-900/60 border-white/10 hover:border-white/30 hover:bg-slate-900/85 hover:scale-[1.01]"
              }`}
              style={{
                borderColor: isSelected ? char.color : undefined,
                boxShadow: isSelected ? `0 0 24px ${char.color}44` : undefined,
              }}
            >
              {/* Top Row: Avatar, Name, Selection Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 shadow-md group-hover:scale-110 transition-transform duration-200"
                    style={{
                      backgroundColor: char.color,
                      borderColor: char.accentColor,
                    }}
                  >
                    {char.name.substring(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-black tracking-wide text-white">
                        {char.name}
                      </h4>
                      {char.id === "flash" && (
                        <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.2 rounded-full animate-pulse">
                          UP DASH ⚡
                        </span>
                      )}
                    </div>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-md font-bold uppercase bg-white/10 text-slate-300 mt-0.5">
                      {char.type}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <span className="flex items-center gap-1 text-[10px] font-black text-sky-300 bg-sky-950/90 border border-sky-400/60 px-2.5 py-1 rounded-full shadow">
                    <Check size={12} /> SELECIONADO
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-500 group-hover:text-slate-300 transition-colors">
                    Clique p/ Selecionar
                  </span>
                )}
              </div>

              {/* Character Summary */}
              <p className="text-xs text-slate-300 my-2.5 line-clamp-2 leading-relaxed">
                {char.description}
              </p>

              {/* Stat Meters Grid */}
              <div className="space-y-1.5 my-1.5 text-xs bg-black/20 p-2.5 rounded-xl border border-white/5">
                {/* Speed */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Velocidade
                  </span>
                  <div className="w-28 md:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                      style={{ width: `${(char.speed / 1.35) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Jump */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Pulo
                  </span>
                  <div className="w-28 md:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${(char.jump / 1.45) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Air Control */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Controle
                  </span>
                  <div className="w-28 md:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
                      style={{ width: `${(char.airControl / 1.3) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Gravity */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Gravidade
                  </span>
                  <div className="w-28 md:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                      style={{ width: `${(char.gravity / 1.1) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Ability Badge Info */}
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
                <div className="p-1 rounded-lg bg-white/5 border border-white/10 shrink-0">
                  {getAbilityIcon(char.ability)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black text-amber-300 uppercase truncate">
                    {char.abilityName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {char.abilityDesc}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                id={`char-select-btn-${char.id}`}
                className={`mt-3 w-full py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-md scale-[1.01]"
                    : "bg-white/10 hover:bg-white/20 text-slate-200 group-hover:border group-hover:border-white/20"
                }`}
              >
                {isSelected ? (
                  <>
                    <Check size={14} /> ESCOLHIDO
                  </>
                ) : (
                  <>
                    <span>ESCOLHER {char.name.toUpperCase()}</span>
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Explosive Bottom Launcher Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-6xl mx-auto w-full pt-3 mt-1 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-2 text-xs text-slate-400 text-center sm:text-left">
          <Award size={16} className="text-amber-400 shrink-0 hidden sm:block" />
          <span>
            Personagem Atual: <strong className="text-white">{selectedCharacter.name}</strong> ({selectedCharacter.type})
          </span>
        </div>

        <button
          id="char-select-confirm-play-btn"
          onClick={() => {
            sound.playClick();
            onStartGame();
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:brightness-110 active:scale-95 transition-all text-sm font-black shadow-xl shadow-emerald-500/30 border border-emerald-300/40 text-slate-950"
        >
          <Play size={18} className="fill-slate-950" />
          <span>JOGAR COM {selectedCharacter.name.toUpperCase()}</span>
        </button>
      </div>
    </div>
  );
};

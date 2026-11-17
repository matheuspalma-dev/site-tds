import { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { Character, GameState, UserProfile, GameBackupData } from "./types";
import { CHARACTERS, DEFAULT_CHARACTER } from "./constants/characters";
import { sound } from "./utils/audio";
import {
  saveScoreToFirebase,
  subscribeToAuthProfile,
  fetchUserPersonalRecord,
  updateUserStatsInFirebase,
} from "./lib/firebase";
import { GameCanvas } from "./components/GameCanvas";
import { HUD } from "./components/HUD";
import { MainMenu } from "./components/MainMenu";
import { CharacterSelect } from "./components/CharacterSelect";
import { HowToPlayModal } from "./components/HowToPlayModal";
import { LeaderboardModal } from "./components/LeaderboardModal";
import { PauseModal } from "./components/PauseModal";
import { GameOverModal } from "./components/GameOverModal";
import { MobileControls } from "./components/MobileControls";
import { AuthModal } from "./components/AuthModal";
import { DriveModal } from "./components/DriveModal";

export default function App() {
  // Game state
  const [gameState, setGameState] = useState<GameState>("menu");

  // Authenticated Player Profile (Firebase Auth & Firestore)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Selected Character
  const [character, setCharacter] = useState<Character>(() => {
    try {
      const saved = localStorage.getItem("ceuLimiteSelectedCharacter");
      if (saved) {
        const found = CHARACTERS.find((c) => c.id === saved);
        if (found) return found;
      }
    } catch {}
    return DEFAULT_CHARACTER;
  });

  // High score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("ceuLimiteHighScore");
      if (saved) {
        const val = parseInt(saved, 10);
        // Clear corrupted, negative or giant debug values like 1000000000000000000
        if (!isNaN(val) && val >= 0 && val < 5000000) {
          return val;
        }
      }
      localStorage.removeItem("ceuLimiteHighScore");
      return 0;
    } catch {
      return 0;
    }
  });

  // Live match metrics
  const [currentScore, setCurrentScore] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [lavaDistance, setLavaDistance] = useState(300);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [showRecordToast, setShowRecordToast] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ability state
  const [abilityActive, setAbilityActive] = useState(false);
  const [abilityTimer, setAbilityTimer] = useState(0);
  const [abilityCooldownTimer, setAbilityCooldownTimer] = useState(0);
  const [fenixAvailable, setFenixAvailable] = useState(true);
  const [triggerAbilityCounter, setTriggerAbilityCounter] = useState(0);

  // Sound and music state
  const [soundEnabled, setSoundEnabled] = useState(sound.isSoundEnabled());
  const [musicEnabled, setMusicEnabled] = useState(sound.isMusicEnabled());

  // Fullscreen & PC desktop controls state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTouchControls, setShowTouchControls] = useState(() => {
    if (typeof window !== "undefined") {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    }
    return true;
  });

  // Mobile Inputs
  const [mobileInputs, setMobileInputs] = useState({
    left: false,
    right: false,
    jump: false,
    ability: false,
  });

  // Subscribe to Firebase Auth and User profile
  useEffect(() => {
    const unsubscribe = subscribeToAuthProfile(async (profile) => {
      setCurrentUser(profile);
      if (profile) {
        // Player logged in: retrieve saved record from user profile database
        let userRecord = Number(profile.highScore) || 0;
        if (userRecord >= 5000000 || userRecord < 0 || isNaN(userRecord)) {
          userRecord = 0;
        }

        // Also fetch personal best record directly from Firestore database
        if (profile.uid) {
          try {
            const dbRecord = await fetchUserPersonalRecord(profile.uid);
            if (dbRecord > userRecord && dbRecord < 5000000) {
              userRecord = dbRecord;
            }
          } catch {}
        }

        setHighScore(userRecord);
        try {
          localStorage.setItem("ceuLimiteHighScore", String(userRecord));
        } catch {}
      } else {
        // Guest mode / Logged out: reset to 0 or clean guest score
        setHighScore((prev) => (prev >= 5000000 ? 0 : prev));
      }
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Fullscreen toggle handler
  const toggleFullscreen = useCallback(() => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Error attempting to enable fullscreen:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn("Error attempting to exit fullscreen:", err);
        });
      }
    }
  }, []);

  // Monitor fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Save selected character to localStorage
  const handleSelectCharacter = (newChar: Character) => {
    setCharacter(newChar);
    try {
      localStorage.setItem("ceuLimiteSelectedCharacter", newChar.id);
    } catch {}
  };

  // Keyboard navigation for pause / restart / menu / fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyP") {
        if (gameState === "playing") {
          setGameState("paused");
        } else if (gameState === "paused") {
          setGameState("playing");
        }
      } else if (e.code === "KeyR") {
        if (gameState === "playing" || gameState === "paused" || gameState === "gameOver") {
          restartGame();
        }
      } else if (e.code === "KeyF") {
        toggleFullscreen();
      } else if (e.code === "KeyC") {
        setShowTouchControls((prev) => !prev);
      } else if (e.code === "Escape") {
        if (gameState !== "menu") {
          setGameState("menu");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, toggleFullscreen]);

  const startGame = useCallback(() => {
    sound.init();
    if (musicEnabled) sound.startMusic();
    setIsNewRecord(false);
    setShowRecordToast(false);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setCurrentScore(0);
    setCurrentHeight(0);
    setCurrentLevel(1);
    setCombo(0);
    setGameState("playing");
  }, [musicEnabled]);

  const restartGame = useCallback(() => {
    sound.init();
    setIsNewRecord(false);
    setShowRecordToast(false);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setGameState("playing");
  }, []);

  const handleGameOver = useCallback(
    (finalScore: number, finalHeight: number, finalLevel: number, _char: Character) => {
      setCurrentScore(finalScore);
      setCurrentHeight(finalHeight);
      setCurrentLevel(finalLevel);

      // Check if new record
      if (finalScore > highScore && finalScore < 5000000) {
        setHighScore(finalScore);
        setIsNewRecord(true);
        try {
          localStorage.setItem("ceuLimiteHighScore", String(finalScore));
        } catch {}

        if (currentUser?.uid) {
          updateUserStatsInFirebase(currentUser.uid, finalScore, finalHeight);
        }
      }

      setGameState("gameOver");
    },
    [highScore, currentUser]
  );

  const handleScoreUpdate = useCallback(
    (score: number, height: number, level: number, comboStreak: number, distance: number) => {
      setCurrentScore(score);
      setCurrentHeight(height);
      setCurrentLevel(level);
      setCombo(comboStreak);
      setLavaDistance(distance);
    },
    []
  );

  const handleAbilityStateChange = useCallback(
    (active: boolean, timer: number, cdTimer: number, fenixAvail: boolean) => {
      setAbilityActive(active);
      setAbilityTimer(timer);
      setAbilityCooldownTimer(cdTimer);
      setFenixAvailable(fenixAvail);
    },
    []
  );

  const handleNewHighScoreAchieved = useCallback((_score: number) => {
    setIsNewRecord(true);
    setShowRecordToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowRecordToast(false);
    }, 3200);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  // Submit score to Firebase Firestore and API with linked user profile
  const submitScoreToDatabase = async (playerName: string) => {
    const finalPlayerName = currentUser?.displayName || playerName;

    const scorePayload = {
      userId: currentUser?.uid,
      playerName: finalPlayerName,
      characterId: character.id,
      characterName: character.name,
      score: currentScore,
      height: currentHeight,
      level: currentLevel,
      timestamp: Date.now(),
    };

    // 1. Save directly to Firebase Firestore
    try {
      await saveScoreToFirebase(scorePayload);
    } catch (firebaseErr) {
      console.warn("Firestore direct save warning:", firebaseErr);
    }

    // 2. Also send to Express / API endpoint
    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scorePayload),
      });
    } catch (err) {
      console.error("Failed to submit score to API:", err);
    }
  };

  const toggleSound = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
  };

  const toggleMusic = () => {
    const next = sound.toggleMusic();
    setMusicEnabled(next);
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Game Canvas Container */}
      <div
        className={`relative flex items-center justify-center transition-all duration-300 ${
          isFullscreen
            ? "w-full h-full max-w-none max-h-none"
            : "w-full max-w-[480px] h-full max-h-[760px]"
        }`}
      >
        <GameCanvas
          character={character}
          gameState={gameState}
          onGameOver={handleGameOver}
          onScoreUpdate={handleScoreUpdate}
          onAbilityStateChange={handleAbilityStateChange}
          onNewHighScoreAchieved={handleNewHighScoreAchieved}
          highScore={highScore}
          mobileInputs={mobileInputs}
          triggerAbilityTrigger={triggerAbilityCounter}
        />

        {/* HUD Overlay when playing or paused */}
        {(gameState === "playing" || gameState === "paused") && (
          <HUD
            score={currentScore}
            height={currentHeight}
            level={currentLevel}
            combo={combo}
            highScore={highScore}
            lavaDistance={lavaDistance}
            character={character}
            abilityActive={abilityActive}
            abilityTimer={abilityTimer}
            abilityCooldownTimer={abilityCooldownTimer}
            fenixAvailable={fenixAvailable}
            onPause={() => setGameState("paused")}
            onRestart={restartGame}
            onTriggerAbility={() => setTriggerAbilityCounter((c) => c + 1)}
            soundEnabled={soundEnabled}
            musicEnabled={musicEnabled}
            onToggleSound={toggleSound}
            onToggleMusic={toggleMusic}
            showRecordToast={showRecordToast}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            showTouchControls={showTouchControls}
            onToggleTouchControls={() => setShowTouchControls((p) => !p)}
            currentUser={currentUser}
          />
        )}

        {/* Mobile Virtual Controls */}
        {gameState === "playing" && showTouchControls && (
          <MobileControls
            onInputStateChange={setMobileInputs}
            abilityName={character.abilityName}
            abilityReady={!abilityActive && abilityCooldownTimer <= 0}
          />
        )}

        {/* Main Menu */}
        {gameState === "menu" && (
          <MainMenu
            selectedCharacter={character}
            highScore={highScore}
            onStartGame={startGame}
            onOpenCharacters={() => setGameState("characters")}
            onOpenHowToPlay={() => setGameState("howToPlay")}
            onOpenLeaderboard={() => setGameState("leaderboard")}
            soundEnabled={soundEnabled}
            musicEnabled={musicEnabled}
            onToggleSound={toggleSound}
            onToggleMusic={toggleMusic}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            currentUser={currentUser}
            onOpenAuth={() => setGameState("auth")}
            onOpenDrive={() => setGameState("drive")}
          />
        )}

        {/* Character Selection */}
        {gameState === "characters" && (
          <CharacterSelect
            selectedCharacter={character}
            onSelectCharacter={handleSelectCharacter}
            onBack={() => setGameState("menu")}
            onStartGame={startGame}
          />
        )}

        {/* How To Play */}
        {gameState === "howToPlay" && (
          <HowToPlayModal
            onBack={() => setGameState("menu")}
            onStartGame={startGame}
          />
        )}

        {/* Leaderboard */}
        {gameState === "leaderboard" && (
          <LeaderboardModal
            currentUser={currentUser}
            onOpenAuth={() => setGameState("auth")}
            onBack={() => setGameState("menu")}
            onStartGame={startGame}
          />
        )}

        {/* Player Login / Register Auth Modal */}
        {gameState === "auth" && (
          <AuthModal
            currentUser={currentUser}
            onProfileUpdated={(user) => {
              setCurrentUser(user);
              if (user?.highScore && user.highScore > highScore) {
                setHighScore(user.highScore);
              }
            }}
            onBack={() => setGameState("menu")}
            onOpenDrive={() => setGameState("drive")}
          />
        )}

        {/* Google Drive Cloud Save & Backups */}
        {gameState === "drive" && (
          <DriveModal
            currentUser={currentUser}
            highScore={highScore}
            character={character}
            onRestoreBackup={(backup: GameBackupData) => {
              if (backup.player.highScore > highScore) {
                setHighScore(backup.player.highScore);
                try {
                  localStorage.setItem("ceuLimiteHighScore", String(backup.player.highScore));
                } catch {}
              }
              if (backup.player.selectedCharacterId) {
                const found = CHARACTERS.find((c) => c.id === backup.player.selectedCharacterId);
                if (found) {
                  setCharacter(found);
                  try {
                    localStorage.setItem("ceuLimiteSelectedCharacter", found.id);
                  } catch {}
                }
              }
            }}
            onProfileUpdated={(user) => {
              setCurrentUser(user);
              if (user?.highScore && user.highScore > highScore) {
                setHighScore(user.highScore);
              }
            }}
            onBack={() => setGameState("menu")}
          />
        )}

        {/* Pause Modal */}
        {gameState === "paused" && (
          <PauseModal
            score={currentScore}
            height={currentHeight}
            character={character}
            onResume={() => setGameState("playing")}
            onRestart={restartGame}
            onChangeCharacter={() => setGameState("characters")}
            onOpenLeaderboard={() => setGameState("leaderboard")}
            onGoToMenu={() => setGameState("menu")}
            soundEnabled={soundEnabled}
            musicEnabled={musicEnabled}
            onToggleSound={toggleSound}
            onToggleMusic={toggleMusic}
          />
        )}

        {/* Game Over Modal */}
        {gameState === "gameOver" && (
          <GameOverModal
            score={currentScore}
            height={currentHeight}
            level={currentLevel}
            character={character}
            highScore={highScore}
            isNewRecord={isNewRecord}
            onPlayAgain={restartGame}
            onChangeCharacter={() => setGameState("characters")}
            onOpenLeaderboard={() => setGameState("leaderboard")}
            onGoToMenu={() => setGameState("menu")}
            onSubmitScore={submitScoreToDatabase}
            currentUser={currentUser}
            onOpenDrive={() => setGameState("drive")}
          />
        )}
      </div>

      {/* Desktop Keyboard Helper Legend */}
      <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-full border border-white/10 text-[10px] text-slate-300 font-medium z-20 absolute bottom-2 pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
        <span>🎮 <strong>A / D / ◀ ▶</strong> Mover</span>
        <span className="text-white/20">•</span>
        <span>🚀 <strong>W / ESPAÇO</strong> Pulo</span>
        <span className="text-white/20">•</span>
        <span>⚡ <strong>E / SHIFT</strong> Habilidade</span>
        <span className="text-white/20">•</span>
        <span>🖥️ <strong>F</strong> Tela Cheia</span>
        <span className="text-white/20">•</span>
        <span>⏸️ <strong>P</strong> Pausa</span>
      </div>
    </div>
  );
}

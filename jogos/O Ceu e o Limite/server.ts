import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface ScoreEntry {
  id: string;
  playerName: string;
  characterId: string;
  characterName: string;
  score: number;
  height: number;
  level: number;
  timestamp: number;
}

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "scores.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data if DB file doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf-8");
}

function getScores(): ScoreEntry[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading scores DB:", err);
  }
  return [];
}

function saveScores(scores: ScoreEntry[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(scores, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing scores DB:", err);
  }
}

app.use(express.json());

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", game: "O CÉU É O LIMITE", version: "1.0.0" });
});

// Get Top Leaderboard
app.get("/api/scores", (req, res) => {
  const character = req.query.character as string | undefined;
  const limit = parseInt(req.query.limit as string) || 20;

  let scores = getScores();
  if (character && character !== "all") {
    scores = scores.filter((s) => s.characterId === character);
  }

  // Sort descending by score
  scores.sort((a, b) => b.score - a.score);
  const topScores = scores.slice(0, limit);

  const highestScore = scores.length > 0 ? scores[0].score : 0;
  const maxHeight = scores.length > 0 ? Math.max(...scores.map((s) => s.height)) : 0;
  const totalGames = scores.length;

  res.json({
    scores: topScores,
    stats: {
      highestScore,
      maxHeight,
      totalGames,
    },
  });
});

// Submit New Score
app.post("/api/scores", (req, res) => {
  try {
    const { playerName, characterId, characterName, score, height, level } = req.body;

    if (!score || typeof score !== "number" || score < 0) {
      return res.status(400).json({ error: "Invalid score value" });
    }

    const cleanName = (typeof playerName === "string" && playerName.trim())
      ? playerName.trim().substring(0, 20)
      : "Aventureiro";

    const newEntry: ScoreEntry = {
      id: "score-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      playerName: cleanName,
      characterId: characterId || "leo",
      characterName: characterName || "Leo",
      score: Math.floor(score),
      height: Math.floor(height || 0),
      level: Math.floor(level || 1),
      timestamp: Date.now(),
    };

    const scores = getScores();
    scores.push(newEntry);

    // Keep top 200 records
    scores.sort((a, b) => b.score - a.score);
    const trimmedScores = scores.slice(0, 200);
    saveScores(trimmedScores);

    const rank = trimmedScores.findIndex((s) => s.id === newEntry.id) + 1;

    res.status(201).json({
      success: true,
      entry: newEntry,
      rank,
      isTop10: rank > 0 && rank <= 10,
    });
  } catch (err) {
    console.error("Error saving score:", err);
    res.status(500).json({ error: "Internal server error saving score" });
  }
});

// Reset / Zero Out All Scores
app.delete("/api/scores", (_req, res) => {
  try {
    saveScores([]);
    res.json({
      success: true,
      message: "Placar de recordes zerado com sucesso!",
      scores: [],
      stats: {
        highestScore: 0,
        maxHeight: 0,
        totalGames: 0,
      },
    });
  } catch (err) {
    console.error("Error resetting scores:", err);
    res.status(500).json({ error: "Internal server error resetting scores" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[O CÉU É O LIMITE] Server running on http://localhost:${PORT}`);
  });
}

startServer();

import { GoogleAuthProvider, signInWithPopup, User, onAuthStateChanged } from "firebase/auth";
import { app, auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { DriveFileItem, GameBackupData, UserProfile } from "../types";

// Requested Workspace Scopes for Google Drive
export const WORKSPACE_DRIVE_SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.activity",
  "https://www.googleapis.com/auth/drive.activity.readonly",
  "https://www.googleapis.com/auth/drive.apps.readonly",
  "https://www.googleapis.com/auth/drive.install",
  "https://www.googleapis.com/auth/drive.meet.readonly",
  "https://www.googleapis.com/auth/drive.metadata",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.photos.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.scripts",
];

// Configure GoogleAuthProvider with Workspace Drive scopes
const googleProvider = new GoogleAuthProvider();
WORKSPACE_DRIVE_SCOPES.forEach((scope) => {
  googleProvider.addScope(scope);
});
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Flag to indicate if we are in the middle of a sign-in flow
let isSigningIn = false;

// Cache the access token IN MEMORY ONLY (never in localStorage or sessionStorage as required)
let cachedAccessToken: string | null = null;

// Drive auth state listeners
const driveAuthListeners = new Set<(user: User | null, token: string | null) => void>();

function notifyDriveListeners(user: User | null, token: string | null) {
  driveAuthListeners.forEach((fn) => {
    try {
      fn(user, token);
    } catch (e) {
      console.warn("Drive listener error:", e);
    }
  });
}

// Clear token on auth state change if signed out
if (auth) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      cachedAccessToken = null;
      notifyDriveListeners(null, null);
    }
  });
}

/**
 * Subscribe to Google Drive connection state
 */
export function subscribeToDriveAuth(
  callback: (user: User | null, token: string | null) => void
): () => void {
  driveAuthListeners.add(callback);
  if (auth?.currentUser && cachedAccessToken) {
    callback(auth.currentUser, cachedAccessToken);
  } else {
    callback(auth?.currentUser || null, cachedAccessToken);
  }
  return () => {
    driveAuthListeners.delete(callback);
  };
}

/**
 * Retrieve cached in-memory access token
 */
export async function getAccessToken(): Promise<string | null> {
  return cachedAccessToken;
}

/**
 * Sign in with Google to authorize Google Drive & Firebase Auth
 */
export async function signInWithGoogleDrive(): Promise<{
  user: User;
  accessToken: string;
  profile: UserProfile;
} | null> {
  if (!auth) {
    throw new Error("Firebase Auth is not available.");
  }

  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error("Não foi possível obter o token de acesso do Google Drive.");
    }

    cachedAccessToken = credential.accessToken;
    const user = result.user;

    // Build user profile
    const cleanName = user.displayName || user.email?.split("@")[0] || "Aventureiro Google";
    const cleanEmail = user.email || "";

    let profile: UserProfile = {
      uid: user.uid,
      displayName: cleanName,
      email: cleanEmail,
      highScore: 0,
      maxHeight: 0,
      totalGames: 0,
      createdAt: Date.now(),
    };

    if (db) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const existing = snap.data() as UserProfile;
          profile = {
            ...existing,
            displayName: cleanName,
            email: cleanEmail,
          };
          await setDoc(userDocRef, profile, { merge: true });
        } else {
          await setDoc(userDocRef, profile);
        }
      } catch (err) {
        console.warn("Could not sync firestore doc for Google user:", err);
      }
    }

    localStorage.setItem("ceu_saved_profile", JSON.stringify(profile));
    notifyDriveListeners(user, cachedAccessToken);

    return {
      user,
      accessToken: cachedAccessToken,
      profile,
    };
  } catch (error: any) {
    console.error("Google Drive sign-in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
}

/**
 * Sign out and clear cached Google access token
 */
export async function disconnectGoogleDrive(): Promise<void> {
  cachedAccessToken = null;
  if (auth) {
    try {
      await auth.signOut();
    } catch {}
  }
  notifyDriveListeners(null, null);
}

/**
 * List Céu é o Limite backup files stored in user's Google Drive
 */
export async function listDriveBackups(): Promise<DriveFileItem[]> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Faça login com sua Conta Google para acessar o Google Drive.");
  }

  // Search for backup files and certificates created by the game
  const query = "trashed = false and (name contains 'ceu_e_o_limite' or name contains 'Ceu_e_o_Limite' or appProperties has { key='app' and value='ceu_e_o_limite' })";
  const fields = "files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, description)";
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=${encodeURIComponent(fields)}&orderBy=modifiedTime desc&pageSize=30`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 401) {
      cachedAccessToken = null;
      notifyDriveListeners(auth?.currentUser || null, null);
      throw new Error("Sua sessão do Google Drive expirou. Por favor, conecte-se novamente.");
    }
    throw new Error(`Erro ao listar arquivos do Drive: ${res.statusText || errText}`);
  }

  const data = await res.json();
  return (data.files || []) as DriveFileItem[];
}

/**
 * Upload game backup to Google Drive
 */
export async function uploadGameBackupToDrive(backupData: GameBackupData): Promise<DriveFileItem> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Conecte sua Conta Google para salvar backups no Google Drive.");
  }

  const now = new Date();
  const dateStr = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const fileName = `ceu_e_o_limite_backup_${dateStr}.json`;

  const metadata = {
    name: fileName,
    mimeType: "application/json",
    description: `Backup do Céu é o Limite - Recorde: ${backupData.player.highScore} pts (${now.toLocaleDateString("pt-BR")})`,
    appProperties: {
      app: "ceu_e_o_limite",
      highScore: String(backupData.player.highScore),
      maxHeight: String(backupData.player.maxHeight),
      character: backupData.player.selectedCharacterId,
    },
  };

  const fileContent = JSON.stringify(backupData, null, 2);

  // Multipart upload to Google Drive v3
  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: application/json\r\n\r\n" +
    fileContent +
    closeDelimiter;

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,createdTime,modifiedTime,webViewLink,description",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Falha ao salvar no Google Drive (${res.status}): ${errText}`);
  }

  const createdFile = (await res.json()) as DriveFileItem;
  return createdFile;
}

/**
 * Load and parse a backup file content from Google Drive
 */
export async function downloadGameBackupFromDrive(fileId: string): Promise<GameBackupData> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Conecte sua Conta Google para restaurar backups.");
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Falha ao baixar backup do Google Drive: ${res.statusText}`);
  }

  const data = await res.json();
  return data as GameBackupData;
}

/**
 * Delete a backup file from Google Drive
 * (NOTE: MUST be preceded by user confirmation in UI as mandated by Workspace Integration Skill)
 */
export async function deleteDriveFile(fileId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Conecte sua Conta Google para gerenciar arquivos.");
  }

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204 && res.status !== 404) {
    throw new Error(`Falha ao excluir arquivo do Google Drive: ${res.statusText}`);
  }
}

/**
 * Export a commemorative Trophy Certificate file to Google Drive
 */
export async function exportTrophyCertificateToDrive(params: {
  playerName: string;
  highScore: number;
  maxHeight: number;
  characterName: string;
}): Promise<DriveFileItem> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Conecte sua Conta Google para salvar o certificado.");
  }

  const dateStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const content = `===============================================================
🏆 CERTIFICADO DE CONQUISTA - CÉU É O LIMITE 🏆
===============================================================

Parabéns, ${params.playerName}!
Você alcançou uma marca histórica na sua jornada de subida aos céus!

📊 Estatísticas Oficiais Registradas:
---------------------------------------------------------------
★ Pontuação Máxima: ${params.highScore.toLocaleString()} pts
★ Altura Alcançada: ${params.maxHeight.toLocaleString()} metros
★ Personagem Favorito: ${params.characterName}
★ Data da Conquista: ${dateStr}
★ Armazenamento: Google Drive Cloud Backup

"A lava sobe rápido, mas quem almeja o infinito nunca olha para trás!"

===============================================================
Céu é o Limite • AI Studio Build
===============================================================
`;

  const fileName = `Certificado_Recorde_${params.playerName.replace(/\s+/g, "_")}_${params.highScore}pts.txt`;

  const metadata = {
    name: fileName,
    mimeType: "text/plain",
    description: `Certificado Oficial de Recorde do Céu é o Limite (${params.highScore} pts)`,
    appProperties: {
      app: "ceu_e_o_limite",
      type: "certificate",
      highScore: String(params.highScore),
    },
  };

  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
    content +
    closeDelimiter;

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,createdTime,modifiedTime,webViewLink,description",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    throw new Error(`Falha ao exportar certificado para o Google Drive: ${res.statusText}`);
  }

  return (await res.json()) as DriveFileItem;
}

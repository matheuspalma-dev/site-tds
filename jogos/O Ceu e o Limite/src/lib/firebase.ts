import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  Firestore,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  Auth,
  User,
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";
import { ScoreData, UserProfile } from "../types";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
let auth: Auth | null = null;
try {
  auth = getAuth(app);
} catch (e) {
  console.warn("Could not initialize Firebase Auth:", e);
}

// Initialize Firestore with custom databaseId if configured
let db: Firestore | null = null;
try {
  const customDbId = (firebaseConfig as Record<string, any>).firestoreDatabaseId;
  if (customDbId && customDbId !== "(default)") {
    db = getFirestore(app, customDbId);
  } else {
    db = getFirestore(app);
  }
} catch (e) {
  console.warn("Could not initialize Firestore with database ID, fallback to default:", e);
  try {
    db = getFirestore(app);
  } catch (err) {
    console.error("Firestore init error:", err);
  }
}

export { app, auth, db };

// Collection references
const LEADERBOARD_COLLECTION = "leaderboard";
const USERS_COLLECTION = "users";

// Listeners for auth profile updates
const authProfileListeners = new Set<(profile: UserProfile | null) => void>();

function notifyAuthProfileListeners(profile: UserProfile | null) {
  authProfileListeners.forEach((fn) => {
    try {
      fn(profile);
    } catch (e) {
      console.warn("Error notifying profile listener:", e);
    }
  });
}

/**
 * Generate a safe user ID from email or unique timestamp
 */
function createSafeUserId(email: string): string {
  try {
    const sanitized = email.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    return `u_${sanitized.slice(0, 24)}_${sanitized.length}`;
  } catch {
    return `u_${Date.now()}`;
  }
}

/**
 * Register a new player account with Firebase Auth or direct Firestore profile
 */
export async function registerPlayerAccount(
  emailInput: string,
  passwordInput: string,
  displayNameInput: string
): Promise<UserProfile> {
  const cleanName = displayNameInput.trim() || "Aventureiro";
  const cleanEmail = emailInput.trim().toLowerCase();

  // Try Firebase Auth if available
  if (auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, passwordInput);
      const user = userCredential.user;

      try {
        await updateProfile(user, { displayName: cleanName });
      } catch {}

      const profile: UserProfile = {
        uid: user.uid,
        displayName: cleanName,
        email: cleanEmail,
        highScore: 0,
        maxHeight: 0,
        totalGames: 0,
        createdAt: Date.now(),
      };

      // Save to Firestore
      if (db) {
        try {
          await setDoc(doc(db, USERS_COLLECTION, user.uid), profile, { merge: true });
        } catch (dbErr) {
          console.warn("Failed saving user profile to firestore doc:", dbErr);
        }
      }

      localStorage.setItem("ceu_saved_profile", JSON.stringify(profile));
      notifyAuthProfileListeners(profile);
      return profile;
    } catch (authError: any) {
      console.warn("Firebase Auth native registration notice:", authError?.code || authError?.message);

      // If it's a blocked/not-allowed method or configuration issue, transparently fallback to Firestore profile
      const isConfigOrAllowedError =
        authError.code === "auth/operation-not-allowed" ||
        authError.code === "auth/admin-restricted-operation" ||
        authError.code === "auth/configuration-not-found" ||
        authError.code === "auth/network-request-failed";

      if (!isConfigOrAllowedError && authError.code === "auth/email-already-in-use") {
        // If email already in use, throw so UI can suggest login
        throw authError;
      }
      
      // If other specific error and not operation-not-allowed, check if we should still create profile
      if (!isConfigOrAllowedError && authError.code) {
        // Throw user-specific validation errors (e.g. invalid-email)
        if (authError.code === "auth/invalid-email") throw authError;
      }
    }
  }

  // Graceful direct Firestore Profile Registration fallback
  const userDocId = createSafeUserId(cleanEmail);
  let profile: UserProfile = {
    uid: userDocId,
    displayName: cleanName,
    email: cleanEmail,
    highScore: 0,
    maxHeight: 0,
    totalGames: 0,
    createdAt: Date.now(),
  };

  if (db) {
    try {
      const userDocRef = doc(db, USERS_COLLECTION, userDocId);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const existingData = snap.data() as UserProfile;
        profile = {
          ...existingData,
          displayName: cleanName,
          email: cleanEmail,
        };
        await setDoc(userDocRef, profile, { merge: true });
      } else {
        await setDoc(userDocRef, profile);
      }
    } catch (err) {
      console.warn("Could not save to firestore users fallback:", err);
    }
  }

  localStorage.setItem("ceu_saved_profile", JSON.stringify(profile));
  notifyAuthProfileListeners(profile);
  return profile;
}

/**
 * Sign in player with Email and Password
 */
export async function loginPlayerAccount(
  emailInput: string,
  passwordInput: string
): Promise<UserProfile> {
  const cleanEmail = emailInput.trim().toLowerCase();

  // Try Firebase Auth first if available
  if (auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
      const user = userCredential.user;

      let profile: UserProfile | null = null;

      // Fetch from Firestore
      if (db) {
        try {
          const userDocRef = doc(db, USERS_COLLECTION, user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            profile = snap.data() as UserProfile;
          }
        } catch (err) {
          console.warn("Could not fetch user profile doc:", err);
        }
      }

      if (!profile) {
        profile = {
          uid: user.uid,
          displayName: user.displayName || cleanEmail.split("@")[0] || "Aventureiro",
          email: cleanEmail,
          highScore: 0,
          maxHeight: 0,
          totalGames: 0,
          createdAt: Date.now(),
        };
        if (db) {
          try {
            await setDoc(doc(db, USERS_COLLECTION, user.uid), profile, { merge: true });
          } catch {}
        }
      }

      localStorage.setItem("ceu_saved_profile", JSON.stringify(profile));
      notifyAuthProfileListeners(profile);
      return profile;
    } catch (authError: any) {
      console.warn("Firebase Auth native login notice:", authError?.code || authError?.message);

      const isConfigOrAllowedError =
        authError.code === "auth/operation-not-allowed" ||
        authError.code === "auth/admin-restricted-operation" ||
        authError.code === "auth/configuration-not-found" ||
        authError.code === "auth/network-request-failed";

      if (!isConfigOrAllowedError && (authError.code === "auth/wrong-password" || authError.code === "auth/invalid-credential")) {
        throw authError;
      }
    }
  }

  // Graceful direct Firestore Profile Login fallback
  const userDocId = createSafeUserId(cleanEmail);
  let profile: UserProfile | null = null;

  if (db) {
    try {
      const userDocRef = doc(db, USERS_COLLECTION, userDocId);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        profile = snap.data() as UserProfile;
      }
    } catch (err) {
      console.warn("Could not fetch from firestore users fallback:", err);
    }
  }

  if (!profile) {
    const fallbackName = cleanEmail.split("@")[0] || "Aventureiro";
    profile = {
      uid: userDocId,
      displayName: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
      email: cleanEmail,
      highScore: 0,
      maxHeight: 0,
      totalGames: 0,
      createdAt: Date.now(),
    };
    if (db) {
      try {
        await setDoc(doc(db, USERS_COLLECTION, userDocId), profile, { merge: true });
      } catch {}
    }
  }

  localStorage.setItem("ceu_saved_profile", JSON.stringify(profile));
  notifyAuthProfileListeners(profile);
  return profile;
}

/**
 * Sign out current player
 */
export async function logoutPlayerAccount(): Promise<void> {
  if (auth) {
    try {
      await signOut(auth);
    } catch {}
  }
  localStorage.removeItem("ceu_saved_profile");
  notifyAuthProfileListeners(null);
}

/**
 * Subscribe to Auth changes
 */
export function subscribeToAuthProfile(
  onProfileChange: (profile: UserProfile | null) => void
): () => void {
  authProfileListeners.add(onProfileChange);

  // Check local cached profile first
  try {
    const cached = localStorage.getItem("ceu_saved_profile");
    if (cached) {
      const parsed = JSON.parse(cached);
      onProfileChange(parsed);
      
      // Sychronize newest stats from Firestore in background
      if (db && parsed?.uid) {
        getDoc(doc(db, USERS_COLLECTION, parsed.uid)).then((snap) => {
          if (snap.exists()) {
            const fresh = snap.data() as UserProfile;
            localStorage.setItem("ceu_saved_profile", JSON.stringify(fresh));
            onProfileChange(fresh);
          }
        }).catch(() => {});
      }
    }
  } catch {}

  let unsubscribeAuth = () => {};
  if (auth) {
    try {
      unsubscribeAuth = onAuthStateChanged(auth, async (user: User | null) => {
        if (!user) {
          // If no Firebase Auth user, don't clear if local Firestore profile is active
          return;
        }

        let profile: UserProfile | null = null;
        if (db) {
          try {
            const snap = await getDoc(doc(db, USERS_COLLECTION, user.uid));
            if (snap.exists()) {
              profile = snap.data() as UserProfile;
            }
          } catch (e) {
            console.warn("Could not get firestore user profile on auth change:", e);
          }
        }

        if (!profile) {
          profile = {
            uid: user.uid,
            displayName: user.displayName || user.email?.split("@")[0] || "Aventureiro",
            email: user.email || "",
            highScore: 0,
            maxHeight: 0,
            totalGames: 0,
            createdAt: Date.now(),
          };
        } else if (profile.highScore && profile.highScore > 10000000) {
          profile.highScore = 0;
        }

        localStorage.setItem("ceu_saved_profile", JSON.stringify(profile));
        notifyAuthProfileListeners(profile);
      });
    } catch {}
  }

  return () => {
    authProfileListeners.delete(onProfileChange);
    if (typeof unsubscribeAuth === "function") {
      unsubscribeAuth();
    }
  };
}

/**
 * Update stats for logged user
 */
export async function updateUserStatsInFirebase(
  uid: string,
  newScore: number,
  newHeight: number
): Promise<void> {
  if (!db || !uid) return;
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      await updateDoc(userDocRef, {
        highScore: Math.max(data.highScore || 0, newScore),
        maxHeight: Math.max(data.maxHeight || 0, newHeight),
        totalGames: (data.totalGames || 0) + 1,
      });
    }
  } catch (e) {
    console.warn("Could not update user stats in firestore:", e);
  }
}

/**
 * Save new score to Firestore (with optional linked userId)
 */
export async function saveScoreToFirebase(entry: Omit<ScoreData, "id">): Promise<string> {
  if (!db) {
    throw new Error("Firestore not initialized");
  }

  const docData: Record<string, any> = {
    playerName: entry.playerName || "Aventureiro",
    characterId: entry.characterId || "leo",
    characterName: entry.characterName || "Leo",
    score: Math.floor(entry.score),
    height: Math.floor(entry.height),
    level: Math.floor(entry.level),
    timestamp: entry.timestamp || Date.now(),
  };

  if (entry.userId) {
    docData.userId = entry.userId;
  }

  const docRef = await addDoc(collection(db, LEADERBOARD_COLLECTION), docData);

  // If userId exists, also update stats
  if (entry.userId) {
    updateUserStatsInFirebase(entry.userId, entry.score, entry.height);
  }

  return docRef.id;
}

/**
 * Fetch top scores from Firestore
 */
export async function fetchTopScoresFromFirebase(
  characterFilter = "all",
  maxResults = 25
): Promise<ScoreData[]> {
  if (!db) return [];

  try {
    const col = collection(db, LEADERBOARD_COLLECTION);
    let q;

    if (characterFilter && characterFilter !== "all") {
      q = query(
        col,
        where("characterId", "==", characterFilter),
        orderBy("score", "desc"),
        limit(maxResults)
      );
    } else {
      q = query(col, orderBy("score", "desc"), limit(maxResults));
    }

    const snapshot = await getDocs(q);
    const results: ScoreData[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Record<string, any>;
      results.push({
        id: docSnap.id,
        userId: data.userId as string | undefined,
        playerName: (data.playerName as string) || "Anônimo",
        characterId: (data.characterId as string) || "leo",
        characterName: (data.characterName as string) || "Leo",
        score: Number(data.score) || 0,
        height: Number(data.height) || 0,
        level: Number(data.level) || 1,
        timestamp: Number(data.timestamp) || Date.now(),
      });
    });

    return results;
  } catch (err) {
    console.warn("Firestore fetch error:", err);
    return [];
  }
}

/**
 * Real-time listener for leaderboard
 */
export function subscribeToLeaderboard(
  characterFilter: string,
  onUpdate: (scores: ScoreData[]) => void
) {
  if (!db) return () => {};

  try {
    const col = collection(db, LEADERBOARD_COLLECTION);
    let q;

    if (characterFilter && characterFilter !== "all") {
      q = query(
        col,
        where("characterId", "==", characterFilter),
        orderBy("score", "desc"),
        limit(25)
      );
    } else {
      q = query(col, orderBy("score", "desc"), limit(25));
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const results: ScoreData[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Record<string, any>;
          results.push({
            id: docSnap.id,
            userId: data.userId as string | undefined,
            playerName: (data.playerName as string) || "Anônimo",
            characterId: (data.characterId as string) || "leo",
            characterName: (data.characterName as string) || "Leo",
            score: Number(data.score) || 0,
            height: Number(data.height) || 0,
            level: Number(data.level) || 1,
            timestamp: Number(data.timestamp) || Date.now(),
          });
        });
        onUpdate(results);
      },
      (error) => {
        console.warn("Firestore snapshot listener error:", error);
      }
    );
  } catch (err) {
    console.warn("Could not set up snapshot listener:", err);
    return () => {};
  }
}

/**
 * Fetch a specific user's highest recorded score from database
 */
export async function fetchUserPersonalRecord(uid: string): Promise<number> {
  if (!db || !uid) return 0;
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (userDoc.exists()) {
      const data = userDoc.data() as UserProfile;
      const score = Number(data.highScore) || 0;
      if (score > 0 && score < 10000000) {
        return score;
      }
    }
  } catch (e) {
    console.warn("Could not fetch user personal record:", e);
  }
  return 0;
}


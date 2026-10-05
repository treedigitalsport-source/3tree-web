import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";

let initialized = false;

const defaultProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tree-digital-sport";
const defaultBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || `${defaultProjectId}.firebasestorage.app`;

if (getApps().length === 0) {
  try {
    // 1. Intentar con archivo de credenciales local si existe
    const serviceAccount = require("../../firebase-service-account.json");
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: defaultBucket
    });
    initialized = true;
  } catch {
    // 2. Intentar con variables de entorno (.env / Vercel)
    try {
      if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        initializeApp({
          credential: cert({
            projectId: defaultProjectId,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          }),
          storageBucket: defaultBucket
        });
        initialized = true;
      } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({
          credential: cert(parsed),
          storageBucket: defaultBucket
        });
        initialized = true;
      }
    } catch (e) {
      console.warn("Firebase Admin fallback initialization error:", e);
    }
  }
} else {
  initialized = true;
}

export const getAdminDb = (): Firestore | null => {
  if (getApps().length > 0) return getFirestore();
  return null;
};

export const getAdminStorage = (): Storage | null => {
  if (getApps().length > 0) return getStorage();
  return null;
};

export const db = (initialized ? getFirestore() : null) as unknown as Firestore;
export const storage = (initialized ? getStorage() : null) as unknown as Storage;


import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";

let initialized = false;

if (getApps().length === 0) {
  try {
    const serviceAccount = require("../../firebase-service-account.json");
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: "treedigital-2fe4b.appspot.com"
    });
    initialized = true;
  } catch (error) {
    // If running in cloud environment without local credentials, fallback safely
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({
          credential: cert(parsed),
          storageBucket: "treedigital-2fe4b.appspot.com"
        });
        initialized = true;
      }
    } catch (e) {
      // safe fallback
    }
  }
} else {
  initialized = true;
}

export const db = initialized ? getFirestore() : (null as unknown as Firestore);
export const storage = initialized ? getStorage() : (null as unknown as Storage);

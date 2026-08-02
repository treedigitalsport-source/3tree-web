import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";

// Use the local JSON file securely
// This runs on the server side only
const apps = getApps();

if (!apps || apps.length === 0) {
  try {
    const serviceAccount = require("../../firebase-service-account.json");
    
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: "treedigital-2fe4b.appspot.com"
    });
    console.log("Firebase Admin Initialized successfully.");
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();

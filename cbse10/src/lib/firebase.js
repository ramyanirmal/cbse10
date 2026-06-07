// src/lib/firebase.js
// ⚠️  REPLACE with your own Firebase project config
// Firebase Console → Project Settings → Your Apps → Web App → Config

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ── Firestore helpers ──────────────────────────────────────

// Save a completed test result
export async function saveTestResult(result) {
  try {
    await addDoc(collection(db, 'testResults'), {
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.error('saveTestResult failed:', e);
  }
}

// Get all test results (for history + stats)
export async function getTestHistory() {
  try {
    const q = query(collection(db, 'testResults'), orderBy('timestamp', 'desc'), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error('getTestHistory failed:', e);
    return [];
  }
}

// Save / update player profile (XP, level, streaks, badges)
export async function saveProfile(profile) {
  try {
    await setDoc(doc(db, 'profile', 'player'), profile);
  } catch (e) {
    console.error('saveProfile failed:', e);
  }
}

// Load player profile
export async function loadProfile() {
  try {
    const snap = await getDoc(doc(db, 'profile', 'player'));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error('loadProfile failed:', e);
    return null;
  }
}

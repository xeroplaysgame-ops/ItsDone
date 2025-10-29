// Firebase initialization (web SDK) - placeholder values.
// For Expo managed workflow, using firebase JS SDK is recommended.
// Replace the config below with your project's credentials.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCyjDVcAHCWsA0HIBvPbJ8W4IBPuvsG74",
  authDomain: "focus-flow-app-5e4bc.firebaseapp.com",
  projectId: "focus-flow-app-5e4bc",
  storageBucket: "focus-flow-app-5e4bc.firebasestorage.app",
  messagingSenderId: "882378906745",
  appId: "1:882378906745:web:701ee9fed45cca317dc8a8",
  measurementId: "G-5JGP5M1KVT",
};

export function initFirebase() {
  try {
    if (!getApps().length) {
      const app = initializeApp(firebaseConfig);
      return app;
    }
    return getApp();
  } catch (e) {
    console.warn('Firebase init error', e);
    return null;
  }
}

export const auth = () => {
  const app = initFirebase();
  return app ? getAuth(app) : null;
};

export const firestore = () => {
  const app = initFirebase();
  return app ? getFirestore(app) : null;
};

// NOTE: If you want to use @react-native-firebase/* native modules, you'll need a custom dev build or bare workflow.
// The web SDK works well for Expo managed apps.

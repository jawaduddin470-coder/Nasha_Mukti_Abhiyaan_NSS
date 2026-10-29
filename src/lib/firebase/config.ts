/**
 * Firebase Client Configuration & SDK Initialization
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Initializes the Firebase Web App and Auth providers using client-safe configuration.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { FirebaseClientConfig } from '../../types/firebase';

export const firebaseConfig: FirebaseClientConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Helper to verify whether Firebase environment variables are populated.
 */
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase App singleton safely
export const firebaseApp: FirebaseApp | null = isFirebaseConfigured()
  ? (!getApps().length ? initializeApp(firebaseConfig as Record<string, string>) : getApp())
  : null;

// Export initialized Auth instance
export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;

// Export configured Google Auth Provider
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account',
});

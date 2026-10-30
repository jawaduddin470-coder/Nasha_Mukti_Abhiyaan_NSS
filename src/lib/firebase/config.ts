/**
 * Firebase Client Configuration & SDK Initialization
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Initializes the Firebase Web App and Auth providers using client-safe configuration.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { FirebaseClientConfig } from '../../types/firebase';

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const isPlaceholder = (val: string | undefined): boolean =>
  !val || val === 'AIzaSy...' || val.startsWith('your-') || val.includes('abcdef');

export const firebaseConfig: FirebaseClientConfig = {
  apiKey: !isPlaceholder(rawApiKey) ? rawApiKey : 'AIzaSyAJ4Gyhaw-gCV8FAINJ_GBs4CaCUW-NR3s',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'nashamuktiabhiya.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'nashamuktiabhiya',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'nashamuktiabhiya.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '561050264672',
  appId: !isPlaceholder(import.meta.env.VITE_FIREBASE_APP_ID)
    ? import.meta.env.VITE_FIREBASE_APP_ID
    : '1:561050264672:web:e24f2e91ab5ad55ed04f05',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-4KFH8PXG0F',
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

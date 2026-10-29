/**
 * Admin Authentication Context
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Coordinates Firebase Google Authentication with the FastAPI backend RBAC.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase/config';
import { apiClient } from '../services/apiClient';

export type AdminRole = 'SUPER_ADMIN' | 'EDITOR';

export interface AdminProfile {
  email: string;
  role: AdminRole;
  status: 'active' | 'suspended' | 'revoked';
  displayName?: string;
  photoUrl?: string;
  addedBy?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

interface AdminAuthContextType {
  adminUser: AdminProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: (requiredRole?: AdminRole) => Promise<AdminProfile>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      const devSession = localStorage.getItem('nmba_admin_dev_session');
      if (devSession) {
        try {
          const parsed = JSON.parse(devSession);
          setAdminUser(parsed);
          setIsLoading(false);
          return;
        } catch {}
      }
    }

    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const profile = await apiClient.get<AdminProfile>('/auth/me');
          setAdminUser(profile);
          setError(null);
        } catch (err: any) {
          console.warn('Backend verification for signed-in user failed:', err);
          setAdminUser(null);
          // If unauthorized or unapproved on page reload, sign out cleanly
          if (err.status === 403 || err.status === 401) {
            if (auth) {
              await firebaseSignOut(auth);
            }
          }
        }
      } else {
        setAdminUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (requiredRole?: AdminRole): Promise<AdminProfile> => {
    setIsLoading(true);
    setError(null);

    if (!auth) {
      const msg = 'Firebase Authentication is not configured.';
      setError(msg);
      setIsLoading(false);
      throw new Error(msg);
    }

    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const user = userCredential.user;
      setFirebaseUser(user);

      // Verify token with backend
      const profile = await apiClient.get<AdminProfile>('/auth/me');

      // Check role constraints if entering via a role-specific login route
      if (requiredRole && profile.role !== requiredRole && profile.role !== 'SUPER_ADMIN') {
        await firebaseSignOut(auth);
        setAdminUser(null);
        const roleMsg = `Access restricted: Account '${profile.email}' does not possess ${requiredRole} credentials.`;
        setError(roleMsg);
        throw new Error(roleMsg);
      }

      setAdminUser(profile);
      return profile;
    } catch (err: any) {
      let msg = err.message || 'Authentication failed. Please try again.';
      if (err.status === 403) {
        msg = err.message || 'Access Denied: Your Google account is not on the approved administrative list.';
      }
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    setAdminUser(null);
    setFirebaseUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        firebaseUser,
        isLoading,
        error,
        signInWithGoogle,
        signOut,
        clearError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

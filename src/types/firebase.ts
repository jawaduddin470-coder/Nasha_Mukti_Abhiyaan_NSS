/**
 * Future Architecture Stubs: Firebase & CMS Types
 * Prepares the codebase for Phase 2/3 without exposing client secrets or mock auth.
 */

export type UserRole = 'super_admin' | 'editor' | 'viewer';

export interface CmsUserContract {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string;
}

export interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

export interface AuditLogContract {
  id: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'archive';
  collection: 'events' | 'gallery' | 'awareness';
  documentId: string;
  performedBy: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

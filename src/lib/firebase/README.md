# Firebase Architecture & Integration Roadmap

## Status: Prepared for Future Phase (Phase 3)

To ensure high engineering integrity, Phase 1 strictly avoids fake authentication, dummy admin dashboards, or mock database layers. All components (Events, Gallery, Awareness, Support) consume typed contracts directly compatible with Firestore and Firebase Storage.

## Firestore Collection Schema (Target Phase 3)

### 1. `events`
```typescript
interface FirestoreEventDoc {
  id: string; // Document ID
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: 'rally' | 'workshop' | 'pledge_drive' | 'seminar' | 'competition';
  status: 'upcoming' | 'ongoing' | 'completed';
  date: Timestamp;
  timeDisplay: string;
  venue: string;
  venueType: 'campus' | 'community' | 'virtual';
  targetAudience: string;
  coordinators: string[];
  registrationRequired: boolean;
  featured: boolean;
  coverImage?: string; // Firebase Storage public URL
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 2. `gallery_items`
```typescript
interface FirestoreGalleryDoc {
  id: string;
  title: string;
  caption: string;
  date: Timestamp;
  category: 'campus_rally' | 'workshops' | 'pledge_signatures' | 'student_walks' | 'orientations';
  imageUrl: string; // Firebase Storage gs:// or https download URL
  thumbnailUrl?: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
  tags: string[];
  location: string;
  uploadedBy: string; // Admin UID
  createdAt: Timestamp;
}
```

### 3. `audit_logs` & `cms_users`
- Strict Role-Based Access Control (RBAC): `super_admin`, `editor`, `viewer`.
- Firestore Security Rules enforced server-side.
- Zero mock privileges in client state.

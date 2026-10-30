/**
 * Media & Image Resolution Utilities
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Ensures consistent image URL resolution across Vite dev proxy,
 * direct backend endpoints, and production deployments.
 * Provides resilient, accessible fallbacks when media assets cannot load.
 */

import { API_BASE_URL } from '../services/apiClient';

/**
 * Extracts backend server origin from API_BASE_URL (e.g., 'http://localhost:8000')
 */
export function getBackendOrigin(): string {
  try {
    if (API_BASE_URL.startsWith('http')) {
      const url = new URL(API_BASE_URL);
      return url.origin;
    }
  } catch {
    // ignore
  }
  return '';
}

/**
 * Resolves any media URL (relative, uploaded, or absolute) to a reliable resource URL.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();
  if (!trimmed) return '';

  // Data URIs and Blob URIs
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Fully qualified HTTP/HTTPS URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Uploaded media (/uploads/...)
  // In development, Vite proxies /uploads to http://localhost:8000.
  // In standalone preview or production where Vite proxy is not handling /uploads,
  // we can use the relative path or prefix if origin is specified.
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return cleanPath;
  }

  // Leading slash relative path (e.g. /PHOTO-2026-10-27-23-13-25.jpg)
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return `/${trimmed}`;
}

/**
 * Generates an elegant SVG placeholder data-URI for when an activity or gallery image fails.
 * Adheres strictly to the warm off-white and teal branding (#FAF9F5, #159E9A).
 */
export function getFallbackPlaceholder(label: string = 'Campus Initiative', category: string = 'NSS MJCET'): string {
  const safeLabel = label.replace(/[<>&"]/g, '');
  const safeCat = category.replace(/[<>&"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="none">
    <rect width="800" height="600" fill="#EAF5FB"/>
    <rect x="20" y="20" width="760" height="560" rx="16" fill="#F4FAFD" stroke="#CFE3F0" stroke-width="2"/>
    <circle cx="400" cy="250" r="54" fill="#DCEBF5"/>
    <path d="M380 250H420M400 230V270" stroke="#159E9A" stroke-width="4" stroke-linecap="round"/>
    <text x="400" y="340" font-family="system-ui, sans-serif" font-size="20" font-weight="700" fill="#183153" text-anchor="middle">${safeLabel}</text>
    <text x="400" y="375" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#159E9A" text-anchor="middle" letter-spacing="1">${safeCat.toUpperCase()}</text>
    <text x="400" y="415" font-family="system-ui, sans-serif" font-size="12" fill="#64748B" text-anchor="middle">NSS MJCET &bull; Nasha Mukti Abhiyaan</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Reusable image onError event handler to gracefully switch to a branded SVG fallback
 * without replacing with arbitrary, unrelated stock photos.
 */
export function handleMediaError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackLabel: string = 'Campus Drive',
  category: string = 'NSS MJCET'
) {
  const target = event.currentTarget;
  // Prevent infinite loop if fallback fails
  if (target.dataset.hasFallback === 'true') return;
  target.dataset.hasFallback = 'true';
  target.src = getFallbackPlaceholder(fallbackLabel, category);
  target.classList.add('opacity-90');
}

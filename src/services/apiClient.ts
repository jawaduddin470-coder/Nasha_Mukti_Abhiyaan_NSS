/**
 * Centralized API Client
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Dispatches requests to the FastAPI backend, automatically injecting
 * the authenticated administrator's Firebase ID token when available.
 */

import { auth } from '../lib/firebase/config';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

async function getAuthHeader(): Promise<Record<string, string>> {
  if (auth && auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      return { Authorization: `Bearer ${token}` };
    } catch (e) {
      console.warn('Failed to retrieve Firebase ID token:', e);
    }
  }
  if (import.meta.env.DEV) {
    const devToken = localStorage.getItem('nmba_admin_dev_token');
    if (devToken) {
      return { Authorization: `Bearer ${devToken}` };
    }
  }
  return {};
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Ensure GET requests always bypass stale browser cache
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  let finalEndpoint = endpoint;
  if (isGet) {
    const separator = finalEndpoint.includes('?') ? '&' : '?';
    finalEndpoint = `${finalEndpoint}${separator}_t=${Date.now()}`;
  }

  const url = finalEndpoint.startsWith('http') ? finalEndpoint : `${API_BASE_URL}${finalEndpoint}`;
  const authHeaders = await getAuthHeader();

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(isGet ? { 'Cache-Control': 'no-cache, no-store, must-revalidate', Pragma: 'no-cache' } : {}),
    ...authHeaders,
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, {
    cache: isGet ? 'no-store' : 'default',
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // Keep default error text
    }
    const err = new Error(errorDetail);
    (err as any).status = response.status;
    throw err;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  put: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  patch: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
};

/**
 * Central Media Library Service
 * NSS MJCET Nasha Mukti Abhiyaan
 */

import { apiClient, apiRequest } from './apiClient';

export interface MediaItem {
  id: string;
  filename: string;
  originalFilename?: string;
  originalName?: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  category: string;
  title: string;
  dimensions?: { width: number; height: number };
  createdAt: string;
  uploadedBy?: string;
}

export async function fetchMediaItems(
  category?: string,
  searchQuery?: string,
  limit: number = 100,
  skip: number = 0
): Promise<MediaItem[]> {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (searchQuery && searchQuery.trim()) params.append('searchQuery', searchQuery.trim());
  params.append('limit', limit.toString());
  params.append('skip', skip.toString());

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get<MediaItem[]>(`/admin/media${queryString}`);
}

export async function uploadMediaAsset(
  file: File,
  title?: string,
  category: string = 'general'
): Promise<MediaItem> {
  const formData = new FormData();
  formData.append('file', file);
  if (title) formData.append('title', title);
  if (category) formData.append('category', category);

  return apiRequest<MediaItem>('/admin/media/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function deleteMediaAsset(id: string): Promise<{ message: string }> {
  return apiClient.delete<{ message: string }>(`/admin/media/${encodeURIComponent(id)}`);
}

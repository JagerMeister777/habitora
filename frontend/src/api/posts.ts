import { request } from './client';
import type { Post } from '../types';

export const createPost = (data: {
  userId: number;
  text: string;
  feelingScore: number;
  emotionKeywords?: string[];
  isVisible?: boolean;
}): Promise<Post> =>
  request<Post>('/posts', { method: 'POST', body: JSON.stringify(data) });

export const getTimeline = (limit = 20, cursor?: number): Promise<Post[]> => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set('cursor', String(cursor));
  return request<Post[]>(`/posts/timeline?${params.toString()}`);
};

export const getPostsByUser = (userId: number): Promise<Post[]> =>
  request<Post[]>(`/users/${userId}/posts`);

export const deletePost = (id: number): Promise<void> =>
  request(`/posts/${id}`, { method: 'DELETE' });

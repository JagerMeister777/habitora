import { request } from './client';
import type { Post } from '../types';

export const createPost = (data: {
  userId: number;
  text: string;
  feelingScore: number;
  emotionKeywords?: string[];
}): Promise<Post> =>
  request<Post>('/posts', { method: 'POST', body: JSON.stringify(data) });

export const getPostsByUser = (userId: number): Promise<Post[]> =>
  request<Post[]>(`/users/${userId}/posts`);

export const deletePost = (id: number): Promise<void> =>
  request(`/posts/${id}`, { method: 'DELETE' });

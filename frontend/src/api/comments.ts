import { request } from './client';
import type { Comment } from '../types';

export const createComment = (postId: number, userId: number, text: string): Promise<Comment> =>
  request<Comment>(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ userId, text }),
  });

export const listComments = (postId: number): Promise<Comment[]> =>
  request<Comment[]>(`/posts/${postId}/comments`);

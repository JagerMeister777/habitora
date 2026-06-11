import { request } from './client';
import type { Thank } from '../types';

export const sendThank = (commentId: number, fromUserId: number, message?: string): Promise<Thank> =>
  request<Thank>(`/comments/${commentId}/thank`, {
    method: 'POST',
    body: JSON.stringify({ fromUserId, message }),
  });

export const listThanks = (commentId: number): Promise<Thank[]> =>
  request<Thank[]>(`/comments/${commentId}/thanks`);

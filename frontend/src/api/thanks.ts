import { request } from './client';
import type { Thank } from '../types';

export const sendThank = (
  postId: number,
  fromUserId: number,
  message?: string,
): Promise<Thank> =>
  request(`/posts/${postId}/thank`, {
    method: 'POST',
    body: JSON.stringify({ fromUserId, message }),
  });

export const listThanks = (postId: number): Promise<Thank[]> =>
  request(`/posts/${postId}/thanks`);

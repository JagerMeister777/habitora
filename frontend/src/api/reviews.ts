import { request } from './client';
import type { Review } from '../types';

export const generateReview = (userId: number): Promise<Review> =>
  request<Review>(`/users/${userId}/reviews/generate`, { method: 'POST' });

export const listReviews = (userId: number): Promise<Review[]> =>
  request<Review[]>(`/users/${userId}/reviews`);

import { request } from './client';
import type { Notification } from '../types';

export const listNotifications = (userId: number): Promise<Notification[]> =>
  request<Notification[]>(`/users/${userId}/notifications`);

export const markNotificationRead = (id: number): Promise<Notification> =>
  request<Notification>(`/notifications/${id}/read`, { method: 'PATCH' });

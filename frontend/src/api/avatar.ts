import { request } from './client';
import type { Avatar } from '../types';

export const getAvatar = (userId: number): Promise<Avatar> =>
  request<Avatar>(`/users/${userId}/avatar`);

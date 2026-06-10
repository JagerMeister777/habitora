import { request } from './client';
import type { User } from '../types';

export const register = (data: {
  email: string;
  password: string;
  confirmPass: string;
  nickname?: string;
}): Promise<{ message: string; user: User }> =>
  request('/users', { method: 'POST', body: JSON.stringify(data) });

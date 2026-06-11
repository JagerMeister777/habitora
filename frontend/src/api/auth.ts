import { request } from './client';
import type { User } from '../types';

export const login = (email: string, password: string): Promise<User> =>
  request<User>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

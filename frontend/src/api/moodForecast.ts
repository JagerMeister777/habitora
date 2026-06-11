import { request } from './client';
import type { MoodForecast } from '../types';

export const getMoodForecast = (userId: number): Promise<MoodForecast> =>
  request<MoodForecast>(`/users/${userId}/mood-forecast`);

export const regenerateForecast = (userId: number): Promise<MoodForecast> =>
  request<MoodForecast>(`/users/${userId}/mood-forecast/regenerate`, { method: 'POST' });

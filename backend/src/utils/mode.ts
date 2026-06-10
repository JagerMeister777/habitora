import { Mode } from '../types';

export const resolveMode = (feelingScore: number): Mode => {
  if (feelingScore <= 3) return 'LOW';
  if (feelingScore <= 6) return 'NEUTRAL';
  return 'HIGH';
};

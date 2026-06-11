import { WeatherMood } from '../types';

export const resolveMood = (feelingScore: number): WeatherMood => {
  if (feelingScore <= 10) return 'STORM';
  if (feelingScore <= 20) return 'RAIN';
  if (feelingScore <= 30) return 'SNOW';
  if (feelingScore <= 40) return 'FOG';
  if (feelingScore <= 50) return 'CLOUDY';
  if (feelingScore <= 60) return 'WHIRLWIND';
  if (feelingScore <= 70) return 'SPROUT';
  if (feelingScore <= 80) return 'RAINBOW';
  if (feelingScore <= 90) return 'STAR';
  return 'SUNNY';
};

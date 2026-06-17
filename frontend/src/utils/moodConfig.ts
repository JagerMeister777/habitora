import {
  PiCloudLightningFill, PiCloudRainFill, PiCloudSnowFill, PiCloudFogFill,
  PiCloudFill, PiWindFill, PiPlantFill, PiRainbowFill, PiMoonStarsFill, PiSunFill,
} from 'react-icons/pi';
import type { IconType } from 'react-icons';
import type { WeatherMood } from '../types';

export type MoodConfigEntry = {
  icon: IconType;
  label: string;
  color: string;
  border: string;
  text: string;
};

export const moodConfig: Record<WeatherMood, MoodConfigEntry> = {
  STORM:     { icon: PiCloudLightningFill, label: '嵐',       color: '#ffebee', border: '#ef9a9a', text: '#b71c1c' },
  RAIN:      { icon: PiCloudRainFill,      label: '雨',       color: '#e3f2fd', border: '#90caf9', text: '#1565c0' },
  SNOW:      { icon: PiCloudSnowFill,      label: '雪',       color: '#f3f8ff', border: '#b3d4f5', text: '#37474f' },
  FOG:       { icon: PiCloudFogFill,       label: '霧',       color: '#f5f5f5', border: '#bdbdbd', text: '#424242' },
  CLOUDY:    { icon: PiCloudFill,          label: 'くもり',   color: '#fff8e1', border: '#ffe082', text: '#5d4037' },
  WHIRLWIND: { icon: PiWindFill,           label: 'つむじ風', color: '#fff3e0', border: '#ffcc80', text: '#e65100' },
  SPROUT:    { icon: PiPlantFill,          label: '芽吹き',   color: '#f1f8e9', border: '#aed581', text: '#33691e' },
  RAINBOW:   { icon: PiRainbowFill,        label: '虹',       color: '#fce4ec', border: '#f48fb1', text: '#880e4f' },
  STAR:      { icon: PiMoonStarsFill,      label: '星空',     color: '#e8eaf6', border: '#9fa8da', text: '#283593' },
  SUNNY:     { icon: PiSunFill,            label: '晴れ',     color: '#e8f5e9', border: '#a5d6a7', text: '#1b5e20' },
};



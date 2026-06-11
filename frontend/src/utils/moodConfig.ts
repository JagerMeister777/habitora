import {
  WiThunderstorm, WiRain, WiSnow, WiFog, WiDayCloudy,
  WiStrongWind, WiNightClear, WiDaySunny,
} from 'react-icons/wi';
import { FaSeedling } from 'react-icons/fa';
import { BsRainbow } from 'react-icons/bs';
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
  STORM:     { icon: WiThunderstorm, label: '嵐',       color: '#ffebee', border: '#ef9a9a', text: '#b71c1c' },
  RAIN:      { icon: WiRain,         label: '雨',       color: '#e3f2fd', border: '#90caf9', text: '#1565c0' },
  SNOW:      { icon: WiSnow,         label: '雪',       color: '#f3f8ff', border: '#b3d4f5', text: '#37474f' },
  FOG:       { icon: WiFog,          label: '霧',       color: '#f5f5f5', border: '#bdbdbd', text: '#424242' },
  CLOUDY:    { icon: WiDayCloudy,    label: 'くもり',   color: '#fff8e1', border: '#ffe082', text: '#5d4037' },
  WHIRLWIND: { icon: WiStrongWind,   label: 'つむじ風', color: '#fff3e0', border: '#ffcc80', text: '#e65100' },
  SPROUT:    { icon: FaSeedling,     label: '芽吹き',   color: '#f1f8e9', border: '#aed581', text: '#33691e' },
  RAINBOW:   { icon: BsRainbow,      label: '虹',       color: '#fce4ec', border: '#f48fb1', text: '#880e4f' },
  STAR:      { icon: WiNightClear,   label: '星空',     color: '#e8eaf6', border: '#9fa8da', text: '#283593' },
  SUNNY:     { icon: WiDaySunny,     label: '晴れ',     color: '#e8f5e9', border: '#a5d6a7', text: '#1b5e20' },
};

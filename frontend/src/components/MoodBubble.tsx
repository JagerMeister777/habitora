import { moodConfig } from '../utils/moodConfig';
import type { WeatherMood } from '../types';

interface Props {
  mood: string;
  size?: number;
}

export const MoodBubble = ({ mood, size = 24 }: Props) => {
  const mc = moodConfig[mood as WeatherMood] ?? moodConfig.CLOUDY;
  const Icon = mc.icon;
  return (
    <div style={{
      background: mc.color,
      border: `2px solid ${mc.border}`,
      borderRadius: '50%',
      width: size + 16,
      height: size + 16,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: mc.text,
      flexShrink: 0,
    }}>
      <Icon size={size} />
    </div>
  );
};

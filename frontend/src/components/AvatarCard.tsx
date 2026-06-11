import type { Avatar } from '../types';
import { moodConfig } from '../utils/moodConfig';
import type { WeatherMood } from '../types';

const EXPRESSION_LABELS: Record<string, string> = {
  NEUTRAL: 'おだやか',
  HAPPY: 'うれしい',
  SAD: 'かなしい',
  ANXIOUS: 'そわそわ',
  ANGRY: 'もやもや',
  HOPEFUL: 'わくわく',
  GENTLE: 'おだやか',
  CURIOUS: 'わくわく好奇心旺盛',
  DREAMY: 'ゆったり夢見がち',
  DETERMINED: 'きりっとした',
  CHEERFUL: '元気いっぱい',
  ENERGETIC: 'エネルギッシュ',
};

const COMMENT_STYLE_LABELS: Record<string, string> = {
  GENTLE: 'やさしい',
  LOGICAL: 'おだやか・論理的',
  CHEERFUL: '明るい',
  CALM: '落ち着いた',
  WARM: '温かみのある',
  DIRECT: 'ストレートな',
  ENERGETIC: '元気あふれる',
};

interface Props {
  avatar: Avatar;
}

export const AvatarCard = ({ avatar }: Props) => {
  const mc = moodConfig[avatar.mood as WeatherMood] ?? moodConfig.CLOUDY;
  const Icon = mc.icon;
  const expressionLabel = EXPRESSION_LABELS[avatar.expression] ?? avatar.expression;
  const styleLabel = COMMENT_STYLE_LABELS[avatar.commentStyle] ?? avatar.commentStyle;

  return (
    <div style={{ ...styles.card, background: mc.color, borderColor: mc.border }}>
      <div style={{ ...styles.iconWrap, color: mc.text }}>
        <Icon size={56} />
      </div>
      <div style={styles.info}>
        <div style={styles.levelBadge}>Lv.{avatar.level}</div>
        <div style={{ ...styles.moodLabel, color: mc.text }}>{mc.label}</div>
        <div style={styles.expression}>{expressionLabel}な気持ち</div>
        <div style={styles.style}>{styleLabel}なあなた</div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid',
    borderRadius: '14px',
    padding: '1rem 1.25rem',
    marginBottom: '1.25rem',
  },
  iconWrap: { flexShrink: 0, display: 'flex', alignItems: 'center' },
  info: { flex: 1 },
  levelBadge: {
    display: 'inline-block',
    background: '#2d7a4f',
    color: '#fff',
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '1px 8px',
    borderRadius: '10px',
    marginBottom: '0.3rem',
  },
  moodLabel: { fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.2 },
  expression: { fontSize: '0.85rem', color: '#555', marginTop: '0.2rem' },
  style: { fontSize: '0.78rem', color: '#888', marginTop: '0.15rem' },
};

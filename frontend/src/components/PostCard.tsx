import { useState } from 'react';
import type { Post, WeatherMood } from '../types';
import { sendThank } from '../api/thanks';
import { useAuth } from '../context/AuthContext';

const moodConfig: Record<WeatherMood, { icon: string; label: string; color: string; border: string; text: string }> = {
  STORM:     { icon: '⛈️',  label: '嵐',       color: '#ffebee', border: '#ef9a9a', text: '#b71c1c' },
  RAIN:      { icon: '🌧️', label: '雨',       color: '#e3f2fd', border: '#90caf9', text: '#1565c0' },
  SNOW:      { icon: '❄️',  label: '雪',       color: '#f3f8ff', border: '#b3d4f5', text: '#37474f' },
  FOG:       { icon: '🌫️', label: '霧',       color: '#f5f5f5', border: '#bdbdbd', text: '#424242' },
  CLOUDY:    { icon: '⛅',  label: 'くもり',   color: '#fff8e1', border: '#ffe082', text: '#5d4037' },
  WHIRLWIND: { icon: '🌪️', label: 'つむじ風', color: '#fff3e0', border: '#ffcc80', text: '#e65100' },
  SPROUT:    { icon: '🌻',  label: '芽吹き',   color: '#f1f8e9', border: '#aed581', text: '#33691e' },
  RAINBOW:   { icon: '🌈',  label: '虹',       color: '#fce4ec', border: '#f48fb1', text: '#880e4f' },
  STAR:      { icon: '🌟',  label: '星空',     color: '#e8eaf6', border: '#9fa8da', text: '#283593' },
  SUNNY:     { icon: '☀️',  label: '晴れ',     color: '#e8f5e9', border: '#a5d6a7', text: '#1b5e20' },
};

interface Props {
  post: Post;
  onDelete?: (id: number) => void;
  onThank?: (postId: number) => void;
  showThankBtn?: boolean;
}

export const PostCard = ({ post, onDelete, showThankBtn }: Props) => {
  const { user } = useAuth();
  const config = moodConfig[post.mood] ?? moodConfig.CLOUDY;
  const [thankDone, setThankDone] = useState(false);
  const [thankLoading, setThankLoading] = useState(false);

  const date = new Date(post.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const handleThank = async () => {
    if (!user || thankDone) return;
    setThankLoading(true);
    try {
      await sendThank(post.id, user.id);
      setThankDone(true);
    } catch {
      // already thanked or self-post — ignore
    } finally {
      setThankLoading(false);
    }
  };

  return (
    <div style={{ ...styles.card, background: config.color, borderColor: config.border }}>
      <div style={styles.header}>
        <span style={{ ...styles.moodBadge, color: config.text, borderColor: config.border }}>
          {config.icon} {config.label}
        </span>
        <span style={styles.score}>スコア: {post.feelingScore}/100</span>
        <div style={styles.actions}>
          {showThankBtn && user && user.id !== post.userId && (
            <button
              onClick={handleThank}
              disabled={thankDone || thankLoading}
              style={{ ...styles.thankBtn, opacity: thankDone ? 0.5 : 1 }}
            >
              {thankDone ? '💛 送った' : '💛 ありがとう'}
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(post.id)} style={styles.deleteBtn}>削除</button>
          )}
        </div>
      </div>
      <p style={styles.text}>{post.text}</p>
      {post.emotionKeywords.length > 0 && (
        <div style={styles.tags}>
          {post.emotionKeywords.map((kw) => (
            <span key={kw} style={{ ...styles.tag, borderColor: config.border, color: config.text }}>
              {kw}
            </span>
          ))}
        </div>
      )}
      <time style={styles.date}>{date}</time>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: '1px solid',
    borderRadius: '12px',
    padding: '1.2rem',
    marginBottom: '1rem',
  },
  header: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem', flexWrap: 'wrap' },
  moodBadge: {
    fontSize: '0.9rem',
    fontWeight: 600,
    border: '1px solid',
    borderRadius: '20px',
    padding: '3px 12px',
  },
  score: { fontSize: '0.82rem', color: '#666' },
  actions: { display: 'flex', gap: '0.5rem', marginLeft: 'auto', alignItems: 'center' },
  thankBtn: {
    background: 'none',
    border: '1px solid #f9c74f',
    borderRadius: '4px',
    padding: '2px 10px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#e09000',
    fontWeight: 600,
  },
  deleteBtn: {
    background: 'none',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '2px 8px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#888',
  },
  text: { margin: '0 0 0.6rem', lineHeight: 1.6, color: '#333' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' },
  tag: {
    fontSize: '0.78rem',
    border: '1px solid',
    borderRadius: '12px',
    padding: '1px 8px',
  },
  date: { fontSize: '0.78rem', color: '#999' },
};

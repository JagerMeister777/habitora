import type { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { CommentSection } from './CommentSection';
import { moodConfig } from '../utils/moodConfig';
import { MoodBubble } from './MoodBubble';
import type { WeatherMood } from '../types';
import { FiTrash2 } from 'react-icons/fi';

interface Props {
  post: Post;
  onDelete?: (id: number) => void;
  showComments?: boolean;
}

export const PostCard = ({ post, onDelete, showComments = true }: Props) => {
  const { user } = useAuth();
  const config = moodConfig[post.mood as WeatherMood] ?? moodConfig.CLOUDY;

  const date = new Date(post.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div style={{ ...styles.card, background: config.color, borderColor: config.border }}>
      <div style={styles.header}>
        <MoodBubble mood={post.mood} size={20} />
        <span style={{ ...styles.moodLabel, color: config.text }}>{config.label}</span>
        <span style={styles.score}>スコア: {post.feelingScore}/100</span>
        <div style={styles.actions}>
          {onDelete && user?.id === post.userId && (
            <button onClick={() => onDelete(post.id)} style={styles.deleteBtn}>
              <FiTrash2 size={13} style={{ verticalAlign: 'middle', marginRight: 3 }} />
              削除
            </button>
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

      {showComments && <CommentSection postId={post.id} postAuthorId={post.userId} />}
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
  header: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' },
  moodLabel: { fontSize: '0.9rem', fontWeight: 700 },
  score: { fontSize: '0.82rem', color: '#666' },
  actions: { display: 'flex', gap: '0.5rem', marginLeft: 'auto', alignItems: 'center' },
  deleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
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

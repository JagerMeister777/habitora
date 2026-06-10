import type { Post } from '../types';

const modeConfig = {
  LOW: { label: '😔 落ち込み', color: '#fff0f0', border: '#f5c2c7', text: '#842029' },
  NEUTRAL: { label: '😐 普通', color: '#fffbf0', border: '#ffd97d', text: '#664d03' },
  HIGH: { label: '😊 良好', color: '#f0fff4', border: '#a3d9a5', text: '#155724' },
};

interface Props {
  post: Post;
  onDelete?: (id: number) => void;
}

export const PostCard = ({ post, onDelete }: Props) => {
  const config = modeConfig[post.mode];
  const date = new Date(post.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div style={{ ...styles.card, background: config.color, borderColor: config.border }}>
      <div style={styles.header}>
        <span style={{ ...styles.modeBadge, color: config.text, borderColor: config.border }}>
          {config.label}
        </span>
        <span style={styles.score}>スコア: {post.feelingScore}/10</span>
        {onDelete && (
          <button onClick={() => onDelete(post.id)} style={styles.deleteBtn}>削除</button>
        )}
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
  header: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' },
  modeBadge: {
    fontSize: '0.85rem',
    fontWeight: 600,
    border: '1px solid',
    borderRadius: '20px',
    padding: '2px 10px',
  },
  score: { fontSize: '0.85rem', color: '#666', marginLeft: 'auto' },
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

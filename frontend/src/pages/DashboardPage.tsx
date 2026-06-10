import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPostsByUser, deletePost } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/PostCard';
import type { Post } from '../types';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    getPostsByUser(user.id)
      .then(setPosts)
      .catch(() => setError('投稿の取得に失敗しました。'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('この投稿を削除しますか？')) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('削除に失敗しました。');
    }
  };

  if (!user) return null;

  return (
    <div>
      <div style={styles.topBar}>
        <h2 style={styles.heading}>
          {user.nickname ?? user.name}さんの記録
        </h2>
        <Link to="/posts/new" style={styles.newBtn}>+ 今日の気持ちを記録</Link>
      </div>

      {loading && <p style={styles.info}>読み込み中...</p>}
      {error && <p style={styles.errorText}>{error}</p>}

      {!loading && posts.length === 0 && (
        <div style={styles.empty}>
          <p>まだ記録がありません。</p>
          <Link to="/posts/new" style={styles.emptyLink}>最初の気持ちを記録してみましょう →</Link>
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading: { margin: 0, color: '#333' },
  newBtn: {
    background: '#2d7a4f',
    color: '#fff',
    textDecoration: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  info: { textAlign: 'center', color: '#888' },
  errorText: { color: '#842029', background: '#fff0f0', padding: '0.6rem 1rem', borderRadius: '6px' },
  empty: { textAlign: 'center', padding: '3rem', color: '#888', background: '#fff', borderRadius: '12px' },
  emptyLink: { color: '#2d7a4f', textDecoration: 'none', fontWeight: 600 },
};

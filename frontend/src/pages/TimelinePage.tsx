import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getTimeline } from '../api/posts';
import { PostCard } from '../components/PostCard';
import type { Post } from '../types';

export const TimelinePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getTimeline(20)
      .then((data) => {
        setPosts(data);
        setHasMore(data.length === 20);
      })
      .catch(() => setError('タイムラインの取得に失敗しました。'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleLoadMore = async () => {
    if (posts.length === 0) return;
    setLoadingMore(true);
    try {
      const cursor = posts[posts.length - 1].id;
      const more = await getTimeline(20, cursor);
      setPosts((prev) => [...prev, ...more]);
      setHasMore(more.length === 20);
    } catch { /* ignore */ } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <p style={styles.center}>読み込み中...</p>;
  if (error) return <p style={{ ...styles.center, color: '#c00' }}>{error}</p>;

  return (
    <div>
      <h2 style={styles.heading}>👥 みんなの投稿</h2>
      <p style={styles.desc}>公開されている気持ちの記録です。「ありがとう」を送って優しさを届けましょう。</p>

      {posts.length === 0 ? (
        <div style={styles.empty}>
          <p>まだ公開投稿がありません。</p>
          <p style={{ fontSize: '0.88rem', color: '#999', marginTop: '0.5rem' }}>
            投稿作成時に「みんなに公開する」をオンにすると表示されます。
          </p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} showThankBtn={true} />
          ))}
          {hasMore && (
            <button onClick={handleLoadMore} disabled={loadingMore} style={styles.moreBtn}>
              {loadingMore ? '読み込み中...' : 'もっと見る'}
            </button>
          )}
          {!hasMore && posts.length > 0 && (
            <p style={styles.endNote}>すべての投稿を表示しました。</p>
          )}
        </>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  heading: { marginBottom: '0.5rem', color: '#333' },
  desc: { fontSize: '0.9rem', color: '#777', marginBottom: '1.5rem' },
  center: { textAlign: 'center', marginTop: '3rem', color: '#666' },
  empty: { textAlign: 'center', padding: '3rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid #eee', color: '#777' },
  moreBtn: { display: 'block', width: '100%', padding: '0.75rem', marginTop: '0.5rem', background: '#f1f8f4', color: '#2d7a4f', border: '1px solid #a3d9a5', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' },
  endNote: { textAlign: 'center', fontSize: '0.82rem', color: '#bbb', marginTop: '1rem' },
};

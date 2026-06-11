import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPostsByUser, deletePost } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import { PostCard } from '../components/PostCard';
import type { Post, WeatherMood } from '../types';
import { moodConfig } from '../utils/moodConfig';
import { FiStar } from 'react-icons/fi';

const MBTI_NAMES: Record<string, string> = {
  INFP: '優しき理想家', INFJ: '静かな導き手', ISFP: '感性のアーティスト', ISFJ: '世話好きな癒し手',
  INTP: '知の探求者', INTJ: '静かな野心家', ISTP: '静かなる実行者', ISTJ: '堅実な守り人',
  ENFP: '夢見る冒険者', ENFJ: '共鳴する応援者', ESFP: '陽気なひまわり', ESFJ: '頼れるお姉さん',
  ENTP: 'ひらめきの火花', ENTJ: 'ビジョンの指揮官', ESTP: 'アクションスター', ESTJ: '現実主義の管理者',
};

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

  const recentMoods = posts.slice(0, 7).map((p) => p.mood);

  return (
    <div>
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.heading}>
            {user.nickname ?? user.email.split('@')[0]}さんの記録
          </h2>
          {user.mbtiType && (
            <div style={styles.mbtiBadge}>
              <FiStar size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              {user.mbtiType}
              {MBTI_NAMES[user.mbtiType] && <span style={styles.mbtiName}> 「{MBTI_NAMES[user.mbtiType]}」</span>}
            </div>
          )}
          {!user.mbtiType && (
            <Link to="/onboarding" style={styles.mbtiLink}>
              <FiStar size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} /> 性格タイプを診断する →
            </Link>
          )}
        </div>
        <Link to="/posts/new" style={styles.newBtn}>+ 今日の気持ちを記録</Link>
      </div>

      {recentMoods.length > 0 && (
        <div style={styles.weatherRow}>
          <span style={styles.weatherLabel}>最近の天気:</span>
          {recentMoods.map((mood, i) => {
            const MoodIcon = (moodConfig[mood] ?? moodConfig.CLOUDY).icon;
            return (
              <span key={i} style={{ ...styles.weatherIcon, color: moodConfig[mood]?.text ?? '#555' }} title={mood}>
                <MoodIcon size={24} />
              </span>
            );
          })}
        </div>
      )}

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
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' },
  heading: { margin: '0 0 0.25rem', color: '#333' },
  mbtiBadge: { fontSize: '0.85rem', color: '#2d7a4f', fontWeight: 600 },
  mbtiName: { fontWeight: 400, color: '#555' },
  mbtiLink: { fontSize: '0.85rem', color: '#2d7a4f', textDecoration: 'none', fontWeight: 600 },
  newBtn: {
    background: '#2d7a4f', color: '#fff', textDecoration: 'none',
    padding: '0.6rem 1.2rem', borderRadius: '6px', fontSize: '0.9rem',
    fontWeight: 600, whiteSpace: 'nowrap',
  },
  weatherRow: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    background: '#fff', padding: '0.6rem 1rem', borderRadius: '8px',
    marginBottom: '1.2rem', flexWrap: 'wrap',
  },
  weatherLabel: { fontSize: '0.82rem', color: '#888', marginRight: '0.25rem' },
  weatherIcon: { display: 'inline-flex', cursor: 'default' },
  info: { textAlign: 'center', color: '#888' },
  errorText: { color: '#842029', background: '#fff0f0', padding: '0.6rem 1rem', borderRadius: '6px' },
  empty: { textAlign: 'center', padding: '3rem', color: '#888', background: '#fff', borderRadius: '12px' },
  emptyLink: { color: '#2d7a4f', textDecoration: 'none', fontWeight: 600 },
};

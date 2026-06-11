import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { generateReview, listReviews } from '../api/reviews';
import type { Review } from '../types';

const moodIcon: Record<string, string> = {
  STORM: '⛈️', RAIN: '🌧️', SNOW: '❄️', FOG: '🌫️', CLOUDY: '⛅',
  WHIRLWIND: '🌪️', SPROUT: '🌻', RAINBOW: '🌈', STAR: '🌟', SUNNY: '☀️',
};

export const ReviewPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [genError, setGenError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    listReviews(user.id)
      .then(setReviews)
      .catch(() => setError('ふり返りの取得に失敗しました。'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    setGenError('');
    try {
      const review = await generateReview(user.id);
      setReviews((prev) => {
        const filtered = prev.filter((r) => r.id !== review.id);
        return [review, ...filtered];
      });
    } catch (e: unknown) {
      setGenError(e instanceof Error ? e.message : '生成に失敗しました。');
    } finally {
      setGenerating(false);
    }
  };

  const highlight = (r: Review): { avg: number; moodCounts: Record<string, number> } | null => {
    try { return JSON.parse(r.highlightFeelingJson); } catch { return null; }
  };

  const mainMood = (r: Review): string => {
    const h = highlight(r);
    if (!h) return '';
    return Object.entries(h.moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
  };

  if (loading) return <p style={styles.center}>読み込み中...</p>;

  return (
    <div>
      <h2 style={styles.heading}>📖 ふり返り</h2>

      <div style={styles.generateBox}>
        <p style={styles.generateDesc}>今月の記録をもとにふり返りを生成します。</p>
        {genError && <p style={styles.error}>{genError}</p>}
        <button onClick={handleGenerate} disabled={generating} style={styles.generateBtn}>
          {generating ? '生成中...' : '✨ 今月のふり返りを生成'}
        </button>
      </div>

      {error && <p style={{ color: '#c00', fontSize: '0.9rem' }}>{error}</p>}

      {reviews.length === 0 ? (
        <div style={styles.empty}>
          <p>まだふり返りがありません。</p>
          <p style={{ fontSize: '0.88rem', color: '#999' }}>上のボタンで今月のふり返りを作成できます。</p>
        </div>
      ) : (
        <div style={styles.list}>
          {reviews.map((r) => {
            const mm = mainMood(r);
            const h = highlight(r);
            const period = `${new Date(r.periodStart).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}`;
            return (
              <div key={r.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.period}>{period}</span>
                  {mm && <span style={styles.moodIcon}>{moodIcon[mm] ?? '⛅'}</span>}
                  {r.levelChange > 0 && <span style={styles.levelBadge}>+{r.levelChange} Lv UP!</span>}
                </div>
                {r.summaryText && <p style={styles.summary}>{r.summaryText}</p>}
                {h && (
                  <p style={styles.score}>平均スコア: <strong>{h.avg}点</strong></p>
                )}
                {r.avatarComment && (
                  <p style={styles.avatarComment}>💬 {r.avatarComment}</p>
                )}
                <time style={styles.reviewedAt}>
                  生成日: {new Date(r.reviewedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </time>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  heading: { marginBottom: '1.5rem', color: '#333' },
  center: { textAlign: 'center', marginTop: '3rem', color: '#666' },
  generateBox: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' },
  generateDesc: { margin: '0 0 1rem', color: '#555', fontSize: '0.9rem' },
  generateBtn: { padding: '0.75rem 2rem', background: '#2d7a4f', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  error: { color: '#c00', fontSize: '0.88rem', marginBottom: '0.75rem' },
  empty: { textAlign: 'center', padding: '2.5rem 1rem', color: '#777', background: '#fff', borderRadius: '12px', border: '1px solid #eee' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.2rem' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' },
  period: { fontWeight: 700, fontSize: '1rem', color: '#333' },
  moodIcon: { fontSize: '1.5rem' },
  levelBadge: { marginLeft: 'auto', background: '#fef3c7', color: '#d97706', fontSize: '0.8rem', fontWeight: 700, padding: '2px 10px', borderRadius: '10px', border: '1px solid #fcd34d' },
  summary: { margin: '0 0 0.5rem', color: '#444', fontSize: '0.95rem', lineHeight: 1.6 },
  score: { margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#555' },
  avatarComment: { margin: '0 0 0.6rem', color: '#555', fontSize: '0.9rem', fontStyle: 'italic' },
  reviewedAt: { fontSize: '0.78rem', color: '#aaa' },
};

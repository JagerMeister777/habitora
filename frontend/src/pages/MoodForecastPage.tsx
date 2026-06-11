import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMoodForecast, regenerateForecast } from '../api/moodForecast';
import type { MoodForecast } from '../types';
import { moodConfig } from '../utils/moodConfig';
import { MoodBubble } from '../components/MoodBubble';
import type { WeatherMood } from '../types';
import { FiCloud, FiRefreshCw, FiMessageCircle } from 'react-icons/fi';

export const MoodForecastPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [forecast, setForecast] = useState<MoodForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getMoodForecast(user.id)
      .then(setForecast)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleRegenerate = async () => {
    if (!user) return;
    setRefreshing(true);
    setError('');
    try {
      const f = await regenerateForecast(user.id);
      setForecast(f);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '更新に失敗しました。');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <p style={styles.center}>読み込み中...</p>;

  if (error) return (
    <div style={styles.errorBox}>
      <p style={{ color: '#c00', marginBottom: '1rem' }}>{error}</p>
      <p style={{ color: '#777', fontSize: '0.9rem' }}>気持ちを記録してからもう一度確認してください。</p>
    </div>
  );

  if (!forecast) return null;

  const moodTrend: Record<string, string> = JSON.parse(forecast.moodTrendJson);
  const trendEntries = Object.entries(moodTrend).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div>
      <h2 style={styles.heading}><FiCloud size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} /> 気持ち天気予報</h2>

      <div style={{ ...styles.mainCard, background: (moodConfig[forecast.mainMood as WeatherMood] ?? moodConfig.CLOUDY).color, borderColor: (moodConfig[forecast.mainMood as WeatherMood] ?? moodConfig.CLOUDY).border }}>
        <div style={styles.bigIcon}><MoodBubble mood={forecast.mainMood} size={56} /></div>
        <div style={{ ...styles.mainMoodLabel, color: (moodConfig[forecast.mainMood as WeatherMood] ?? moodConfig.CLOUDY).text }}>{(moodConfig[forecast.mainMood as WeatherMood] ?? moodConfig.CLOUDY).label}</div>
        {forecast.avatarComment && (
          <p style={styles.avatarComment}><FiMessageCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {forecast.avatarComment}</p>
        )}
      </div>

      {trendEntries.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>直近7日間の天気</h3>
          <div style={styles.trendRow}>
            {trendEntries.map(([date, mood]) => (
              <div key={date} style={styles.trendItem}>
                <MoodBubble mood={mood} size={22} />
                <span style={styles.trendDate}>
                  {new Date(date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {forecast.emotionSummary && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>感情サマリー</h3>
          <p style={styles.summaryText}>{forecast.emotionSummary}</p>
        </div>
      )}

      <button onClick={handleRegenerate} disabled={refreshing} style={styles.refreshBtn}>
        {refreshing ? '更新中...' : <><FiRefreshCw size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} /> 今すぐ更新する</>}
      </button>

      <p style={styles.footerNote}>
        最終更新: {new Date(forecast.forecastedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  heading: { marginBottom: '1.5rem', color: '#333' },
  center: { textAlign: 'center', marginTop: '3rem', color: '#666' },
  errorBox: { textAlign: 'center', padding: '3rem 1rem', background: '#fff', borderRadius: '12px', border: '1px solid #eee' },
  mainCard: { textAlign: 'center', border: '1px solid', borderRadius: '16px', padding: '2.5rem 1rem', marginBottom: '1.5rem' },
  bigIcon: { lineHeight: 1, display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' },
  mainMoodLabel: { fontSize: '1.4rem', fontWeight: 700, marginTop: '0.25rem' },
  avatarComment: { marginTop: '1rem', color: '#555', fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic' },
  section: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.2rem', marginBottom: '1rem' },
  sectionTitle: { margin: '0 0 1rem', fontSize: '0.95rem', color: '#555', fontWeight: 600 },
  trendRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  trendItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', minWidth: '44px' },
  trendIcon: { display: 'inline-flex' },
  trendDate: { fontSize: '0.72rem', color: '#888' },
  summaryText: { margin: 0, color: '#444', fontSize: '0.95rem', lineHeight: 1.7 },
  refreshBtn: { display: 'block', width: '100%', padding: '0.8rem', background: '#2d7a4f', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '0.75rem' },
  footerNote: { textAlign: 'center', fontSize: '0.78rem', color: '#aaa' },
};

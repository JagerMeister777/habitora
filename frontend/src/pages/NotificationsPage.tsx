import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { listNotifications, markNotificationRead } from '../api/notifications';
import type { Notification } from '../types';
import { FiHeart, FiCalendar, FiCloud, FiAward, FiBell } from 'react-icons/fi';
import type { IconType } from 'react-icons';

const typeIcon: Record<string, IconType> = {
  THANK: FiHeart,
  REMINDER: FiCalendar,
  MOOD: FiCloud,
  ACHIEVEMENT: FiAward,
  COMMENT: FiAward,
};

export const NotificationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    listNotifications(user.id)
      .then(setNotifications)
      .catch(() => setError('通知の取得に失敗しました。'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleClick = async (n: Notification) => {
    if (n.isRead) return;
    try {
      const updated = await markNotificationRead(n.id);
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? updated : x)));
    } catch { /* ignore */ }
  };

  if (loading) return <p style={styles.center}>読み込み中...</p>;
  if (error) return <p style={{ ...styles.center, color: '#c00' }}>{error}</p>;

  return (
    <div>
      <h2 style={styles.heading}><FiBell size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} /> 通知</h2>
      {notifications.length === 0 ? (
        <div style={styles.empty}>
          <p>通知はまだありません。</p>
          <p style={{ fontSize: '0.9rem', color: '#999' }}>ありがとうをもらったときなどに通知が届きます。</p>
        </div>
      ) : (
        <ul style={styles.list}>
          {notifications.map((n) => (
            <li
              key={n.id}
              style={{ ...styles.item, background: n.isRead ? '#f9f9f9' : '#fffde7', cursor: n.isRead ? 'default' : 'pointer' }}
              onClick={() => handleClick(n)}
            >
              <span style={styles.icon}>{(() => { const NI = typeIcon[n.type] ?? FiBell; return <NI size={20} />; })()}</span>
              <div style={styles.body}>
                <p style={styles.title}>{n.title}</p>
                <p style={styles.message}>{n.message}</p>
                <time style={styles.date}>
                  {new Date(n.createdAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
              {!n.isRead && <span style={styles.badge}>未読</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  heading: { marginBottom: '1.5rem', color: '#333' },
  center: { textAlign: 'center', marginTop: '3rem', color: '#666' },
  empty: { textAlign: 'center', padding: '3rem 1rem', color: '#777', background: '#fff', borderRadius: '12px', border: '1px solid #eee' },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  item: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', borderRadius: '10px', border: '1px solid #eee', transition: 'background 0.15s' },
  icon: { flexShrink: 0, display: 'flex', alignItems: 'center', color: '#2d7a4f' },
  body: { flex: 1 },
  title: { margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.95rem', color: '#333' },
  message: { margin: '0 0 0.4rem', fontSize: '0.88rem', color: '#555' },
  date: { fontSize: '0.78rem', color: '#999' },
  badge: { flexShrink: 0, background: '#f59e0b', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' },
};

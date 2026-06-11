import { ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listNotifications } from '../api/notifications';

export const Layout = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    listNotifications(user.id)
      .then((ns) => setUnreadCount(ns.filter((n) => !n.isRead).length))
      .catch(() => { /* ignore */ });
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>🌱 Habitora</Link>
        <nav style={styles.nav}>
          {user ? (
            <>
              <Link to="/timeline" style={styles.navLink}>👥 みんなの投稿</Link>
              <Link to="/forecast" style={styles.navLink}>⛅ 天気予報</Link>
              <Link to="/reviews" style={styles.navLink}>📖 ふり返り</Link>
              <Link to="/consultation" style={styles.navLink}>🪞 こころの鏡</Link>
              <Link to="/notifications" style={styles.navLink}>
                🔔
                {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
              </Link>
              <Link to="/profile" style={styles.navLink}>
                {user.nickname ?? user.email.split('@')[0]}
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>ログアウト</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>ログイン</Link>
              <Link to="/register" style={styles.navLink}>新規登録</Link>
            </>
          )}
        </nav>
      </header>
      <main style={styles.main}>{children}</main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '60px',
    background: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  logo: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#2d7a4f',
    textDecoration: 'none',
  },
  nav: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
  navLink: { color: '#555', textDecoration: 'none', fontSize: '0.9rem', position: 'relative' as const },
  badge: {
    position: 'absolute' as const,
    top: '-6px',
    right: '-8px',
    background: '#ef4444',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 700,
    borderRadius: '10px',
    padding: '1px 5px',
    lineHeight: 1.2,
  },
  logoutBtn: {
    background: 'none',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '4px 12px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#555',
  },
  main: { maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' },
};

import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

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
              <span style={styles.userName}>{user.nickname ?? user.email.split('@')[0]}</span>
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
  nav: { display: 'flex', alignItems: 'center', gap: '1rem' },
  navLink: { color: '#555', textDecoration: 'none', fontSize: '0.9rem' },
  userName: { fontSize: '0.9rem', color: '#333' },
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

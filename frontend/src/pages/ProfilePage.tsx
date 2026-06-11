import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { request } from '../api/client';
import type { User } from '../types';

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  if (!user) { navigate('/login'); return null; }

  const [email, setEmail] = useState(user.email);
  const [nickname, setNickname] = useState(user.nickname ?? '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const body: Record<string, string> = { email, nickname };
      if (password) body.password = password;
      const updated = await request<User>(`/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      setUser(updated);
      setPassword('');
      setSuccess('プロフィールを更新しました。');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '更新に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  const mbtiLabel = user.mbtiType
    ? `${user.mbtiType}`
    : '未診断';

  return (
    <div style={styles.wrap}>
      <h2 style={styles.heading}>👤 プロフィール</h2>

      <div style={styles.statsRow}>
        <div style={styles.stat}><span style={styles.statNum}>Lv.{user.level}</span><span style={styles.statLabel}>レベル</span></div>
        <div style={styles.stat}><span style={styles.statNum}>{user.kindnessTotal}</span><span style={styles.statLabel}>優しさ合計</span></div>
        <div style={styles.stat}>
          <span style={styles.statNum}>{mbtiLabel}</span>
          <span style={styles.statLabel}>MBTIタイプ</span>
        </div>
      </div>

      {user.mbtiType && (
        <p style={styles.rediag}>
          MBTIを再診断する → <Link to="/onboarding" style={styles.link}>診断ページへ</Link>
        </p>
      )}

      <form onSubmit={handleSave} style={styles.form}>
        <label style={styles.label}>メールアドレス</label>
        <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label style={styles.label}>ニックネーム</label>
        <input style={styles.input} type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="任意" />

        <label style={styles.label}>新しいパスワード（変更する場合のみ）</label>
        <input style={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8文字以上" minLength={8} />

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <button type="submit" disabled={saving} style={styles.btn}>
          {saving ? '保存中...' : '保存する'}
        </button>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: '480px', margin: '0 auto' },
  heading: { marginBottom: '1.5rem', color: '#333' },
  statsRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  stat: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1rem 0.5rem' },
  statNum: { fontSize: '1.4rem', fontWeight: 700, color: '#2d7a4f' },
  statLabel: { fontSize: '0.78rem', color: '#777', marginTop: '0.25rem' },
  rediag: { fontSize: '0.88rem', color: '#555', marginBottom: '1.5rem' },
  link: { color: '#2d7a4f', fontWeight: 600 },
  form: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.88rem', color: '#555', fontWeight: 600 },
  input: { padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', outline: 'none' },
  error: { color: '#c00', fontSize: '0.88rem', margin: 0 },
  success: { color: '#2d7a4f', fontSize: '0.88rem', margin: 0 },
  btn: { marginTop: '0.5rem', padding: '0.7rem', background: '#2d7a4f', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
};

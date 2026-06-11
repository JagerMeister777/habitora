import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/users';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';
import { FaLeaf } from 'react-icons/fa';

export const RegisterPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPass: '', nickname: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPass) {
      setError('パスワードが一致しません。');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(form);
      const user = await login(form.email, form.password);
      setUser(user);
      navigate('/onboarding');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '登録に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}><FaLeaf style={{ verticalAlign: 'middle', marginRight: 8 }} /> Habitora</h1>
        <p style={styles.subtitle}>新規登録</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {([
            { field: 'email', label: 'メールアドレス', type: 'email', placeholder: 'example@email.com' },
            { field: 'nickname', label: 'ニックネーム（任意）', type: 'text', placeholder: 'たろう' },
            { field: 'password', label: 'パスワード（8文字以上）', type: 'password', placeholder: '••••••••' },
            { field: 'confirmPass', label: 'パスワード確認', type: 'password', placeholder: '••••••••' },
          ] as const).map(({ field, label, type, placeholder }) => (
            <div key={field}>
              <label style={styles.label}>{label}</label>
              <input
                type={type}
                value={form[field]}
                onChange={set(field)}
                required={field !== 'nickname'}
                style={styles.input}
                placeholder={placeholder}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? '処理中...' : '登録する'}
          </button>
        </form>
        <p style={styles.link}>
          既にアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  card: { background: '#fff', borderRadius: '12px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' },
  title: { textAlign: 'center', color: '#2d7a4f', marginBottom: '0.25rem' },
  subtitle: { textAlign: 'center', color: '#888', marginBottom: '1.5rem' },
  error: { background: '#fff0f0', border: '1px solid #f5c2c7', borderRadius: '6px', padding: '0.6rem 1rem', color: '#842029', marginBottom: '1rem', fontSize: '0.9rem' },
  label: { display: 'block', fontSize: '0.85rem', color: '#555', marginBottom: '0.25rem' },
  input: { width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', marginBottom: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '0.75rem', background: '#2d7a4f', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
  link: { textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#888' },
};

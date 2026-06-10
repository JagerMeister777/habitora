import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';

const modeLabel = (score: number) => {
  if (score <= 3) return '😔 落ち込み (LOW)';
  if (score <= 6) return '😐 普通 (NEUTRAL)';
  return '😊 良好 (HIGH)';
};

export const CreatePostPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [feelingScore, setFeelingScore] = useState(5);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addKeyword = () => {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw)) {
      setKeywords((prev) => [...prev, kw]);
    }
    setKeywordInput('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    setLoading(true);
    try {
      await createPost({ userId: user.id, text, feelingScore, emotionKeywords: keywords });
      navigate('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '投稿に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={styles.heading}>今日の気持ちを記録する</h2>
      <div style={styles.card}>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>今の気持ち（テキスト）</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            style={styles.textarea}
            placeholder="今日どんな気持ちでしたか？"
            rows={4}
          />

          <label style={styles.label}>
            気分スコア: <strong>{feelingScore}/10</strong>
            &nbsp;&nbsp;
            <span style={styles.modeLabel}>{modeLabel(feelingScore)}</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={feelingScore}
            onChange={(e) => setFeelingScore(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            <span>1 (つらい)</span>
            <span>10 (最高)</span>
          </div>

          <label style={styles.label}>感情タグ</label>
          <div style={styles.tagRow}>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
              style={styles.tagInput}
              placeholder="例: 嬉しい、疲れた"
            />
            <button type="button" onClick={addKeyword} style={styles.addBtn}>追加</button>
          </div>
          {keywords.length > 0 && (
            <div style={styles.tags}>
              {keywords.map((kw) => (
                <span key={kw} style={styles.tag}>
                  {kw}
                  <button
                    type="button"
                    onClick={() => setKeywords((prev) => prev.filter((k) => k !== kw))}
                    style={styles.removeTag}
                  >×</button>
                </span>
              ))}
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? '投稿中...' : '記録する'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  heading: { marginBottom: '1.5rem', color: '#333' },
  card: { background: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  error: { background: '#fff0f0', border: '1px solid #f5c2c7', borderRadius: '6px', padding: '0.6rem 1rem', color: '#842029', marginBottom: '1rem', fontSize: '0.9rem' },
  label: { display: 'block', fontSize: '0.9rem', color: '#555', marginBottom: '0.4rem', marginTop: '1.2rem' },
  modeLabel: { fontSize: '0.85rem', color: '#2d7a4f', fontWeight: 600 },
  textarea: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box' },
  slider: { width: '100%', accentColor: '#2d7a4f', marginTop: '0.25rem' },
  sliderLabels: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem' },
  tagRow: { display: 'flex', gap: '0.5rem' },
  tagInput: { flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' },
  addBtn: { padding: '0.5rem 1rem', background: '#e8f5e9', color: '#2d7a4f', border: '1px solid #a3d9a5', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' },
  tag: { display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#e8f5e9', border: '1px solid #a3d9a5', borderRadius: '12px', padding: '2px 10px', fontSize: '0.82rem', color: '#2d7a4f' },
  removeTag: { background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '0.85rem', padding: '0' },
  submitBtn: { marginTop: '1.5rem', width: '100%', padding: '0.75rem', background: '#2d7a4f', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
};

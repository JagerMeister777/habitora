import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';
import type { WeatherMood } from '../types';

const resolveMood = (score: number): WeatherMood => {
  if (score <= 10) return 'STORM';
  if (score <= 20) return 'RAIN';
  if (score <= 30) return 'SNOW';
  if (score <= 40) return 'FOG';
  if (score <= 50) return 'CLOUDY';
  if (score <= 60) return 'WHIRLWIND';
  if (score <= 70) return 'SPROUT';
  if (score <= 80) return 'RAINBOW';
  if (score <= 90) return 'STAR';
  return 'SUNNY';
};

const moodInfo: Record<WeatherMood, { icon: string; label: string; desc: string; color: string }> = {
  STORM:     { icon: '⛈️',  label: '嵐',       desc: '怒り・動揺を感じています',     color: '#b71c1c' },
  RAIN:      { icon: '🌧️', label: '雨',       desc: '悲しい・寂しい気持ちです',     color: '#1565c0' },
  SNOW:      { icon: '❄️',  label: '雪',       desc: '静かな寂しさがあります',       color: '#37474f' },
  FOG:       { icon: '🌫️', label: '霧',       desc: '混乱・疲れを感じています',     color: '#424242' },
  CLOUDY:    { icon: '⛅',  label: 'くもり',   desc: 'ぼんやり・静かな気持ちです',   color: '#5d4037' },
  WHIRLWIND: { icon: '🌪️', label: 'つむじ風', desc: '少し焦りを感じています',       color: '#e65100' },
  SPROUT:    { icon: '🌻',  label: '芽吹き',   desc: '小さな前向きさがあります',     color: '#33691e' },
  RAINBOW:   { icon: '🌈',  label: '虹',       desc: '癒し・希望を感じています',     color: '#880e4f' },
  STAR:      { icon: '🌟',  label: '星空',     desc: '穏やかに思索しています',       color: '#283593' },
  SUNNY:     { icon: '☀️',  label: '晴れ',     desc: '安心・前向きな気持ちです',     color: '#1b5e20' },
};

const MAX_CHARS = 250;

export const CreatePostPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [feelingScore, setFeelingScore] = useState(55);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const mood = resolveMood(feelingScore);
  const info = moodInfo[mood];
  const charsLeft = MAX_CHARS - text.length;

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
    if (text.length > MAX_CHARS) {
      setError(`本文は${MAX_CHARS}文字以内で入力してください。`);
      return;
    }
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
          <label style={styles.label}>今の気持ち（最大250文字）</label>
          <div style={{ position: 'relative' }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              maxLength={MAX_CHARS}
              style={styles.textarea}
              placeholder="今日どんな気持ちでしたか？"
              rows={4}
            />
            <span style={{ ...styles.charCount, color: charsLeft < 20 ? '#c62828' : '#aaa' }}>
              {charsLeft}
            </span>
          </div>

          <label style={styles.label}>
            今日の気分スコア: <strong>{feelingScore}/100</strong>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={feelingScore}
            onChange={(e) => setFeelingScore(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderLabels}>
            <span>0 (つらい)</span>
            <span>100 (最高)</span>
          </div>

          <div style={{ ...styles.moodPreview, borderColor: info.color }}>
            <span style={styles.moodIcon}>{info.icon}</span>
            <div>
              <div style={{ fontWeight: 700, color: info.color }}>{info.label}</div>
              <div style={{ fontSize: '0.82rem', color: '#666' }}>{info.desc}</div>
            </div>
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
  textarea: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box' },
  charCount: { position: 'absolute', bottom: '8px', right: '10px', fontSize: '0.75rem' },
  slider: { width: '100%', accentColor: '#2d7a4f', marginTop: '0.25rem' },
  sliderLabels: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem' },
  moodPreview: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid',
    background: '#fafafa', marginTop: '0.75rem',
  },
  moodIcon: { fontSize: '2rem' },
  tagRow: { display: 'flex', gap: '0.5rem' },
  tagInput: { flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' },
  addBtn: { padding: '0.5rem 1rem', background: '#e8f5e9', color: '#2d7a4f', border: '1px solid #a3d9a5', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' },
  tag: { display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#e8f5e9', border: '1px solid #a3d9a5', borderRadius: '12px', padding: '2px 10px', fontSize: '0.82rem', color: '#2d7a4f' },
  removeTag: { background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '0.85rem', padding: '0' },
  submitBtn: { marginTop: '1.5rem', width: '100%', padding: '0.75rem', background: '#2d7a4f', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
};

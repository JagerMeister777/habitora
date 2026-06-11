import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitInitialMbti, type MbtiAnswers } from '../api/mbti';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';

const QUESTIONS = [
  {
    axis: 'IE',
    question: '初対面の人が多い場所で、自然と話しかけますか？それとも観察派ですか？',
    optionA: '自然と話しかける（外向き）',
    optionB: 'じっくり観察する（内向き）',
  },
  {
    axis: 'SN',
    question: '新しいものを選ぶとき、直感で決めますか？それとも細かく比べますか？',
    optionA: '直感で決める（イメージ派）',
    optionB: '細かく比べる（情報重視）',
  },
  {
    axis: 'TF',
    question: '友人が悩んでいるとき、まず共感しますか？論理的に解決策を出しますか？',
    optionA: 'まず共感する（気持ち重視）',
    optionB: '解決策を提案する（論理的）',
  },
  {
    axis: 'JP',
    question: '予定が急に変わったとき、うまく対応できますか？それとも戸惑いますか？',
    optionA: '柔軟に対応できる（臨機応変）',
    optionB: '少し戸惑う（計画派）',
  },
  {
    axis: 'SN補強',
    question: '新しい発見がある場所と、安心できる静かな場所、どちらが好きですか？',
    optionA: '新しい発見がある場所（探求）',
    optionB: '安心できる静かな場所（安定）',
  },
] as const;

const MBTI_NAMES: Record<string, string> = {
  INFP: '優しき理想家', INFJ: '静かな導き手', ISFP: '感性のアーティスト', ISFJ: '世話好きな癒し手',
  INTP: '知の探求者', INTJ: '静かな野心家', ISTP: '静かなる実行者', ISTJ: '堅実な守り人',
  ENFP: '夢見る冒険者', ENFJ: '共鳴する応援者', ESFP: '陽気なひまわり', ESFJ: '頼れるお姉さん',
  ENTP: 'ひらめきの火花', ENTJ: 'ビジョンの指揮官', ESTP: 'アクションスター', ESTJ: '現実主義の管理者',
};

export const OnboardingPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<('A' | 'B')[]>([]);
  const [result, setResult] = useState<{ resultType: string; typeName: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAnswer = async (choice: 'A' | 'B') => {
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);

    if (newAnswers.length < QUESTIONS.length) {
      setStep(newAnswers.length);
      return;
    }

    setLoading(true);
    try {
      const mbtiAnswers: MbtiAnswers = {
        q1: newAnswers[0],
        q2: newAnswers[1],
        q3: newAnswers[2],
        q4: newAnswers[3],
        q5: newAnswers[4],
      };
      const diagnosis = await submitInitialMbti(user.id, mbtiAnswers);
      setResult({ resultType: diagnosis.resultType, typeName: diagnosis.typeName });
      setUser({ ...user, mbtiType: diagnosis.resultType });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '診断に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => navigate('/');

  if (result) {
    const typeName = MBTI_NAMES[result.resultType] ?? result.typeName;
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.emoji}>✨</div>
          <h2 style={styles.title}>あなたのタイプは...</h2>
          <div style={styles.resultType}>{result.resultType}</div>
          <div style={styles.typeName}>「{typeName}」</div>
          <p style={styles.resultNote}>
            これはあなたの今の傾向を表す「仮の姿」です。
            投稿を重ねるうちに、より深く自分を知ることができます。
          </p>
          <button onClick={() => navigate('/')} style={styles.btn}>
            ダッシュボードへ
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <p style={{ textAlign: 'center', color: '#888' }}>診断中...</p>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <p style={styles.progress}>{step + 1} / {QUESTIONS.length}</p>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
        <h2 style={styles.title}>あなたのことを教えてください</h2>
        {error && <div style={styles.error}>{error}</div>}
        <p style={styles.question}>{q.question}</p>
        <div style={styles.options}>
          <button onClick={() => handleAnswer('A')} style={styles.option}>
            {q.optionA}
          </button>
          <button onClick={() => handleAnswer('B')} style={styles.option}>
            {q.optionB}
          </button>
        </div>
        <button onClick={handleSkip} style={styles.skip}>スキップする</button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' },
  card: { background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '480px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', textAlign: 'center' },
  progress: { fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem' },
  progressBar: { height: '4px', background: '#e0e0e0', borderRadius: '2px', marginBottom: '2rem', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#2d7a4f', borderRadius: '2px', transition: 'width 0.3s ease' },
  title: { color: '#333', marginBottom: '1.5rem', fontSize: '1.1rem' },
  question: { fontSize: '1rem', color: '#444', lineHeight: 1.6, marginBottom: '1.5rem' },
  options: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  option: {
    padding: '0.9rem 1.2rem', background: '#f8fdf9', border: '2px solid #a3d9a5',
    borderRadius: '10px', fontSize: '0.95rem', cursor: 'pointer', color: '#333',
    textAlign: 'left', transition: 'all 0.15s ease', fontWeight: 500,
  },
  emoji: { fontSize: '3rem', marginBottom: '0.5rem' },
  resultType: { fontSize: '2.5rem', fontWeight: 700, color: '#2d7a4f', marginBottom: '0.5rem' },
  typeName: { fontSize: '1.2rem', color: '#555', marginBottom: '1rem' },
  resultNote: { fontSize: '0.85rem', color: '#888', lineHeight: 1.6, marginBottom: '2rem' },
  btn: { padding: '0.75rem 2.5rem', background: '#2d7a4f', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
  error: { background: '#fff0f0', border: '1px solid #f5c2c7', borderRadius: '6px', padding: '0.6rem 1rem', color: '#842029', marginBottom: '1rem', fontSize: '0.9rem' },
  skip: { background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: '0.8rem', marginTop: '1.5rem', textDecoration: 'underline' },
};

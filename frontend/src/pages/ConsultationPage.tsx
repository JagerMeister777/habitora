import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createConsultation, listConsultations, archiveConsultation } from '../api/consultation';
import type { Consultation } from '../types';
import { FiEye, FiMessageCircle, FiStar, FiArchive } from 'react-icons/fi';
import { PiSmileySadFill, PiWarningCircleFill, PiChatCenteredTextFill, PiMagnifyingGlassFill, PiPencilFill } from 'react-icons/pi';
import type { IconType } from 'react-icons';

const THEMES: { key: string; label: string; icon: IconType }[] = [
  { key: '悩み',    label: '悩み',    icon: PiSmileySadFill },
  { key: '不安',    label: '不安',    icon: PiWarningCircleFill },
  { key: '感情整理',label: '感情整理',icon: PiChatCenteredTextFill },
  { key: '自己理解',label: '自己理解',icon: PiMagnifyingGlassFill },
  { key: 'その他',  label: 'その他',  icon: PiPencilFill },
];

export const ConsultationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    listConsultations(user.id)
      .then(setConsultations)
      .catch(() => { /* ignore */ })
      .finally(() => setListLoading(false));
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const c = await createConsultation({ userId: user.id, content, selectedTheme: theme || undefined });
      setActiveConsultation(c);
      setStepIndex(0);
      setConsultations((prev) => [c, ...prev]);
      setContent('');
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : '送信に失敗しました。');
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await archiveConsultation(id);
      setConsultations((prev) => prev.filter((c) => c.id !== id));
      if (activeConsultation?.id === id) setActiveConsultation(null);
    } catch { /* ignore */ }
  };

  const steps = activeConsultation ? JSON.parse(activeConsultation.guidanceStepsJson) as string[] : [];

  return (
    <div>
      <h2 style={styles.heading}><FiEye size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} /> こころの鏡</h2>

      {!activeConsultation ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <p style={styles.desc}>今の気持ちをテーマを選んで話しかけてみてください。</p>

          <div style={styles.themeRow}>
            {THEMES.map((t) => {
              const TI = t.icon;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTheme(t.key)}
                  style={{ ...styles.themeChip, ...(theme === t.key ? styles.themeChipActive : {}) }}
                >
                  <TI size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {t.label}
                </button>
              );
            })}
          </div>

          <textarea
            style={styles.textarea}
            rows={5}
            placeholder="今の気持ちを自由に書いてください..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          {submitError && <p style={styles.error}>{submitError}</p>}

          <button type="submit" disabled={submitting} style={styles.submitBtn}>
            {submitting ? '送信中...' : <><FiMessageCircle size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} /> 話しかける</>}
          </button>
        </form>
      ) : (
        <div style={styles.guidanceBox}>
          {activeConsultation.avatarReaction && (
            <p style={styles.avatarReaction}><FiMessageCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {activeConsultation.avatarReaction}</p>
          )}

          <div style={styles.stepProgress}>
            <span style={styles.stepLabel}>ステップ {stepIndex + 1} / {steps.length}</span>
          </div>

          <div style={styles.stepCard}>
            <p style={styles.stepText}>{steps[stepIndex]}</p>
          </div>

          <div style={styles.stepActions}>
            {stepIndex > 0 && (
              <button onClick={() => setStepIndex((i) => i - 1)} style={styles.stepBtn}>← 前へ</button>
            )}
            {stepIndex < steps.length - 1 ? (
              <button onClick={() => setStepIndex((i) => i + 1)} style={{ ...styles.stepBtn, ...styles.stepBtnPrimary }}>
                次のステップ →
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {activeConsultation.insightSummary && (
                  <p style={styles.insight}><FiStar size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {activeConsultation.insightSummary}</p>
                )}
                <button onClick={() => setActiveConsultation(null)} style={{ ...styles.stepBtn, ...styles.stepBtnPrimary }}>
                  新しい相談をする
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!listLoading && consultations.length > 0 && (
        <div style={styles.historySection}>
          <h3 style={styles.historyTitle}>過去の相談</h3>
          <div style={styles.historyList}>
            {consultations.map((c) => (
              <div key={c.id} style={styles.historyCard}>
                <div style={styles.historyHeader}>
                  {c.selectedTheme && <span style={styles.themeBadge}>{c.selectedTheme}</span>}
                  <time style={styles.historyDate}>
                    {new Date(c.submittedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                  </time>
                  <button onClick={() => handleArchive(c.id)} style={styles.archiveBtn}>
                    <FiArchive size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />アーカイブ
                  </button>
                </div>
                <p style={styles.historyContent}>{c.content.slice(0, 80)}{c.content.length > 80 ? '…' : ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  heading: { marginBottom: '1.5rem', color: '#333' },
  form: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  desc: { margin: 0, color: '#666', fontSize: '0.9rem' },
  themeRow: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  themeChip: { padding: '6px 14px', borderRadius: '20px', border: '1px solid #ddd', background: '#f9f9f9', cursor: 'pointer', fontSize: '0.88rem', color: '#555' },
  themeChipActive: { background: '#2d7a4f', color: '#fff', borderColor: '#2d7a4f' },
  textarea: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', lineHeight: 1.6, resize: 'vertical', outline: 'none' },
  error: { color: '#c00', fontSize: '0.88rem', margin: 0 },
  submitBtn: { padding: '0.75rem', background: '#2d7a4f', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  guidanceBox: { background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' },
  avatarReaction: { background: '#f0faf4', border: '1px solid #a7d4b8', borderRadius: '10px', padding: '0.75rem 1rem', color: '#2d7a4f', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '1rem' },
  stepProgress: { marginBottom: '0.75rem' },
  stepLabel: { fontSize: '0.82rem', color: '#999' },
  stepCard: { background: '#f8f9fa', borderRadius: '10px', padding: '1.2rem', marginBottom: '1rem' },
  stepText: { margin: 0, fontSize: '1rem', color: '#333', lineHeight: 1.7 },
  stepActions: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  stepBtn: { padding: '0.6rem 1.2rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', cursor: 'pointer', fontSize: '0.9rem', color: '#555' },
  stepBtnPrimary: { background: '#2d7a4f', color: '#fff', border: 'none', fontWeight: 600 },
  insight: { background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '10px', padding: '0.75rem 1rem', color: '#78350f', fontSize: '0.9rem', margin: 0 },
  historySection: { marginTop: '0.5rem' },
  historyTitle: { fontSize: '1rem', color: '#555', marginBottom: '0.75rem' },
  historyList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  historyCard: { background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '0.9rem 1rem' },
  historyHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' },
  themeBadge: { fontSize: '0.8rem', background: '#e8f5e9', color: '#2d7a4f', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 },
  historyDate: { fontSize: '0.78rem', color: '#aaa' },
  archiveBtn: { marginLeft: 'auto', background: 'none', border: '1px solid #ddd', borderRadius: '6px', padding: '2px 8px', fontSize: '0.78rem', color: '#888', cursor: 'pointer' },
  historyContent: { margin: 0, fontSize: '0.88rem', color: '#555' },
};

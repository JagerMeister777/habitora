import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listComments, createComment } from '../api/comments';
import { sendThank } from '../api/thanks';
import { ApiError } from '../api/client';
import type { Comment } from '../types';
import { FiMessageCircle, FiHeart, FiAlertTriangle } from 'react-icons/fi';

interface Props {
  postId: number;
}

export const CommentSection = ({ postId }: Props) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [thankedIds, setThankedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listComments(postId)
      .then(setComments)
      .catch(() => { /* ignore */ })
      .finally(() => setLoading(false));
  }, [open, postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const comment = await createComment(postId, user.id, text.trim());
      setComments((prev) => [...prev, comment]);
      setText('');
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'コメントの投稿に失敗しました。');
    } finally {
      setSubmitting(false);
    }
  };

  const handleThank = async (commentId: number) => {
    if (!user || thankedIds.has(commentId)) return;
    try {
      await sendThank(commentId, user.id);
      setThankedIds((prev) => new Set(prev).add(commentId));
      setComments((prev) =>
        prev.map((c) => c.id === commentId ? { ...c, thankCount: c.thankCount + 1 } : c),
      );
    } catch { /* 重複など無視 */ }
  };

  const commentCount = comments.length;

  return (
    <div style={styles.wrap}>
      <button onClick={() => setOpen((o) => !o)} style={styles.toggle}>
        <FiMessageCircle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
        コメント{open ? 'を閉じる' : `を見る${commentCount > 0 ? `（${commentCount}件）` : ''}`}
      </button>

      {open && (
        <div style={styles.body}>
          {loading && <p style={styles.hint}>読み込み中...</p>}

          {!loading && comments.length === 0 && (
            <p style={styles.hint}>まだコメントがありません。最初のコメントをどうぞ。</p>
          )}

          {comments.map((c) => (
            <div key={c.id} style={styles.comment}>
              <div style={styles.commentHeader}>
                <span style={styles.author}>{c.authorNickname ?? '名無し'}</span>
                <time style={styles.date}>
                  {new Date(c.createdAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </time>
                {user && user.id !== c.userId && (
                  <button
                    onClick={() => handleThank(c.id)}
                    disabled={thankedIds.has(c.id)}
                    style={{ ...styles.thankBtn, opacity: thankedIds.has(c.id) ? 0.5 : 1 }}
                  >
                    <FiHeart size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                    {thankedIds.has(c.id) ? '送った' : 'ありがとう'}
                    {c.thankCount > 0 && <span style={styles.thankCount}> {c.thankCount}</span>}
                  </button>
                )}
                {user && user.id === c.userId && c.thankCount > 0 && (
                  <span style={styles.thankReceived}><FiHeart size={12} style={{ verticalAlign: 'middle', marginRight: 2 }} /> {c.thankCount}</span>
                )}
              </div>
              <p style={styles.commentText}>{c.text}</p>
            </div>
          ))}

          {user && (
            user.isRestricted ? (
              <p style={styles.restricted}><FiAlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> 違反が繰り返されたため、コメントの投稿が制限されています。</p>
            ) : (
              <form onSubmit={handleSubmit} style={styles.form}>
                <textarea
                  style={styles.textarea}
                  rows={2}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="コメントを入力... (最大200文字)"
                  maxLength={200}
                  required
                />
                {submitError && <p style={styles.error}>{submitError}</p>}
                <button type="submit" disabled={submitting} style={styles.submitBtn}>
                  {submitting ? '送信中...' : '送信'}
                </button>
              </form>
            )
          )}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrap: { marginTop: '0.75rem', borderTop: '1px solid #f0f0f0', paddingTop: '0.6rem' },
  toggle: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#888', padding: '0' },
  body: { marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  hint: { fontSize: '0.82rem', color: '#bbb', margin: 0 },
  comment: { background: '#f9f9f9', borderRadius: '8px', padding: '0.6rem 0.8rem' },
  commentHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' as const },
  author: { fontWeight: 600, fontSize: '0.82rem', color: '#555' },
  date: { fontSize: '0.75rem', color: '#bbb' },
  thankBtn: { marginLeft: 'auto', background: 'none', border: '1px solid #f9c74f', borderRadius: '4px', padding: '1px 8px', cursor: 'pointer', fontSize: '0.78rem', color: '#e09000', fontWeight: 600 },
  thankCount: { fontSize: '0.75rem' },
  thankReceived: { marginLeft: 'auto', fontSize: '0.8rem', color: '#e09000' },
  commentText: { margin: 0, fontSize: '0.88rem', color: '#444', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' },
  textarea: { padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.88rem', resize: 'vertical', outline: 'none' },
  error: { color: '#c00', fontSize: '0.82rem', margin: 0 },
  submitBtn: { alignSelf: 'flex-end', padding: '0.4rem 1.2rem', background: '#2d7a4f', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' },
  restricted: { fontSize: '0.82rem', color: '#c00', background: '#fff5f5', borderRadius: '6px', padding: '0.5rem 0.75rem', border: '1px solid #fca5a5' },
};

import { PrismaClient } from '@prisma/client';
import { AppError, ReviewResponse } from '../types';

const prisma = new PrismaClient();

const AVATAR_COMMENTS: Record<string, string> = {
  SUNNY:     'とても輝かしい月でしたね。その笑顔、大切にしてください。',
  RAINBOW:   '乗り越えた証が虹になりました。あなたは強いです。',
  STAR:      '静かに深く考えた月でしたね。その思索はあなたの財産です。',
  SPROUT:    '小さな芽吹きを積み重ねた月でした。着実に育っています。',
  CLOUDY:    'ぼんやりした日も、それがあなたの正直な気持ちです。',
  WHIRLWIND: '忙しく動き回った月でしたね。少し立ち止まって深呼吸を。',
  FOG:       '霧の中でも前に進めた自分を認めてあげてください。',
  RAIN:      '悲しみや寂しさを感じた月でした。それも大切な感情です。',
  SNOW:      '静かな時間を過ごせましたか。自分をいたわれましたか？',
  STORM:     '嵐のような月でしたね。それでも記録し続けたあなたはすごい。',
};

const toResponse = (r: {
  id: number; userId: number; periodStart: Date; periodEnd: Date;
  summaryText: string | null; selectedPostIdsJson: string;
  highlightFeelingJson: string; avatarComment: string | null;
  levelChange: number; reviewedAt: Date;
}): ReviewResponse => ({
  id: r.id, userId: r.userId, periodStart: r.periodStart, periodEnd: r.periodEnd,
  summaryText: r.summaryText, selectedPostIdsJson: r.selectedPostIdsJson,
  highlightFeelingJson: r.highlightFeelingJson, avatarComment: r.avatarComment,
  levelChange: r.levelChange, reviewedAt: r.reviewedAt,
});

export const generateMonthlyReview = async (userId: number): Promise<ReviewResponse> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');

  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const posts = await prisma.post.findMany({
    where: { userId, createdAt: { gte: periodStart, lte: periodEnd } },
    orderBy: { createdAt: 'asc' },
  });

  if (posts.length === 0) throw new AppError(400, '今月の投稿がまだありません。');

  const avgScore = Math.round(posts.reduce((s, p) => s + p.feelingScore, 0) / posts.length);

  const moodCounts: Record<string, number> = {};
  posts.forEach((p) => { moodCounts[p.mood] = (moodCounts[p.mood] ?? 0) + 1; });
  const mainMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0];

  const sorted = [...posts].sort((a, b) => b.feelingScore - a.feelingScore);
  const highlights = [sorted[0], sorted[sorted.length - 1]].filter(Boolean);

  const summaryText =
    `今月は${posts.length}回記録しました。平均スコアは${avgScore}点で、` +
    `いちばん多かった天気は「${mainMood}」でした。`;

  const avatarComment = AVATAR_COMMENTS[mainMood] ?? 'よく記録してくれました。';
  const levelChange = posts.length >= 10 ? 1 : 0;

  if (levelChange > 0) {
    await prisma.user.update({ where: { id: userId }, data: { level: { increment: 1 } } });
  }

  const existing = await prisma.review.findFirst({
    where: { userId, periodStart: { gte: periodStart } },
  });

  const data = {
    summaryText,
    selectedPostIdsJson: JSON.stringify(highlights.map((p) => p.id)),
    highlightFeelingJson: JSON.stringify({ avg: avgScore, moodCounts }),
    avatarComment,
    levelChange,
    reviewedAt: new Date(),
  };

  const review = existing
    ? await prisma.review.update({ where: { id: existing.id }, data })
    : await prisma.review.create({ data: { userId, periodStart, periodEnd, ...data } });

  return toResponse(review);
};

export const listReviews = async (userId: number): Promise<ReviewResponse[]> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');

  const reviews = await prisma.review.findMany({
    where: { userId },
    orderBy: { periodStart: 'desc' },
  });
  return reviews.map(toResponse);
};

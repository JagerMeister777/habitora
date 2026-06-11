import { PrismaClient } from '@prisma/client';
import { AppError, MoodForecastResponse } from '../types';

const prisma = new PrismaClient();

const AVATAR_COMMENTS: Record<string, string> = {
  SUNNY:     'この調子で行きましょう！あなたの光が周りを照らしています。',
  RAINBOW:   '困難の後に虹が出ます。今、まさにその時期ですね。',
  STAR:      '夜空の星のように、静かに輝いています。',
  SPROUT:    '少しずつ、でも確実に前向きになっています。',
  CLOUDY:    '雲の上には必ず青空があります。',
  WHIRLWIND: '少しゆっくりしてみませんか？',
  FOG:       '霧は必ず晴れます。今日は自分をいたわってあげてください。',
  RAIN:      '雨の日は、自分に優しくする日です。',
  SNOW:      '雪のような静かさの中に、美しさがあります。',
  STORM:     'この嵐も、必ず過ぎ去ります。無理しないでください。',
};

const EMOTION_SUMMARIES: Record<string, string> = {
  SUNNY:     'とても前向きな気持ちが続いています。',
  RAINBOW:   '希望と癒しを感じる日が多かったようです。',
  STAR:      '静かに深く思索する時間が多かったようです。',
  SPROUT:    '小さな前向きさが積み重なっています。',
  CLOUDY:    'ぼんやりとした静かな気持ちが続いています。',
  WHIRLWIND: '焦りや忙しさを感じることが多かったようです。',
  FOG:       '混乱や疲れを感じることが多かったようです。',
  RAIN:      '悲しみや寂しさを感じることが多かったようです。',
  SNOW:      '静かな孤独感を感じることが多かったようです。',
  STORM:     '怒りや動揺を感じることが多かったようです。',
};

const toResponse = (f: {
  id: number; userId: number; startDate: Date; endDate: Date;
  mainMood: string; moodTrendJson: string; emotionSummary: string | null;
  avatarComment: string | null; forecastedAt: Date;
}): MoodForecastResponse => ({
  id: f.id, userId: f.userId, startDate: f.startDate, endDate: f.endDate,
  mainMood: f.mainMood, moodTrendJson: f.moodTrendJson,
  emotionSummary: f.emotionSummary, avatarComment: f.avatarComment,
  forecastedAt: f.forecastedAt,
});

export const getOrGenerateForecast = async (userId: number): Promise<MoodForecastResponse> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.moodForecast.findFirst({
    where: { userId, forecastedAt: { gte: today } },
    orderBy: { forecastedAt: 'desc' },
  });
  if (existing) return toResponse(existing);

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const posts = await prisma.post.findMany({
    where: { userId, createdAt: { gte: startDate } },
    orderBy: { createdAt: 'asc' },
  });

  if (posts.length === 0) throw new AppError(400, 'まだ投稿がありません。気持ちを記録してから確認してください。');

  const moodCounts: Record<string, number> = {};
  posts.forEach((p) => { moodCounts[p.mood] = (moodCounts[p.mood] ?? 0) + 1; });
  const mainMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0];

  const recent7 = posts.slice(-7);
  const moodTrend: Record<string, string> = {};
  recent7.forEach((p) => {
    const dateKey = p.createdAt.toISOString().split('T')[0];
    moodTrend[dateKey] = p.mood;
  });

  const avgScore = Math.round(posts.reduce((s, p) => s + p.feelingScore, 0) / posts.length);
  const emotionSummary =
    `直近30日間（${posts.length}件）の平均スコアは${avgScore}点です。` +
    (EMOTION_SUMMARIES[mainMood] ?? '');

  const forecast = await prisma.moodForecast.create({
    data: {
      userId,
      startDate,
      endDate,
      mainMood,
      moodTrendJson: JSON.stringify(moodTrend),
      emotionSummary,
      avatarComment: AVATAR_COMMENTS[mainMood] ?? '',
    },
  });

  return toResponse(forecast);
};

export const regenerateForecast = async (userId: number): Promise<MoodForecastResponse> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const posts = await prisma.post.findMany({
    where: { userId, createdAt: { gte: startDate } },
    orderBy: { createdAt: 'asc' },
  });

  if (posts.length === 0) throw new AppError(400, 'まだ投稿がありません。');

  const moodCounts: Record<string, number> = {};
  posts.forEach((p) => { moodCounts[p.mood] = (moodCounts[p.mood] ?? 0) + 1; });
  const mainMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0];

  const recent7 = posts.slice(-7);
  const moodTrend: Record<string, string> = {};
  recent7.forEach((p) => {
    const dateKey = p.createdAt.toISOString().split('T')[0];
    moodTrend[dateKey] = p.mood;
  });

  const avgScore = Math.round(posts.reduce((s, p) => s + p.feelingScore, 0) / posts.length);
  const emotionSummary =
    `直近30日間（${posts.length}件）の平均スコアは${avgScore}点です。` +
    (EMOTION_SUMMARIES[mainMood] ?? '');

  const forecast = await prisma.moodForecast.create({
    data: {
      userId,
      startDate,
      endDate,
      mainMood,
      moodTrendJson: JSON.stringify(moodTrend),
      emotionSummary,
      avatarComment: AVATAR_COMMENTS[mainMood] ?? '',
    },
  });

  return toResponse(forecast);
};

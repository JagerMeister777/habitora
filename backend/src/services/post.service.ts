import { PrismaClient } from '@prisma/client';
import { AppError, PostResponse, WeatherMood } from '../types';
import { resolveMood } from '../utils/mood';

const prisma = new PrismaClient();

const parseKeywords = (raw: string): string[] => {
  try { return JSON.parse(raw) as string[]; } catch { return []; }
};

const toResponse = (post: {
  id: number;
  userId: number;
  text: string;
  feelingScore: number;
  mood: string;
  emotionKeywords: string;
  isVisible: boolean;
  createdAt: Date;
}): PostResponse => ({
  id: post.id,
  userId: post.userId,
  text: post.text,
  feelingScore: post.feelingScore,
  mood: post.mood as WeatherMood,
  emotionKeywords: parseKeywords(post.emotionKeywords),
  isVisible: post.isVisible,
  createdAt: post.createdAt,
});

const requireUser = async (userId: number): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');
};

const buildEmotionVector = (feelingScore: number): string => {
  const normalized = feelingScore / 100;
  const joy = Math.max(0, normalized - 0.3);
  const sadness = Math.max(0, 0.7 - normalized);
  const anger = feelingScore <= 10 ? 0.8 : 0;
  const anxiety = feelingScore >= 51 && feelingScore <= 60 ? 0.6 : 0;
  const hope = normalized >= 0.6 ? normalized - 0.5 : 0;
  return JSON.stringify({ joy, sadness, anger, anxiety, hope });
};

export const createPost = async (data: {
  userId: number;
  text: string;
  feelingScore: number;
  emotionKeywords?: string[];
}): Promise<PostResponse> => {
  await requireUser(data.userId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existing = await prisma.post.findFirst({
    where: {
      userId: data.userId,
      createdAt: { gte: today, lt: tomorrow },
    },
  });
  if (existing) throw new AppError(409, '今日はすでに投稿しています。1日1投稿までです。');

  const mood = resolveMood(data.feelingScore);

  const post = await prisma.post.create({
    data: {
      userId: data.userId,
      text: data.text,
      feelingScore: data.feelingScore,
      mood,
      emotionKeywords: JSON.stringify(data.emotionKeywords ?? []),
      isVisible: false,
    },
  });

  await prisma.feelingAnalysis.create({
    data: {
      postId: post.id,
      emotionScore: data.feelingScore,
      emotionVectorJson: buildEmotionVector(data.feelingScore),
      mood,
      reasonText: null,
      suggestedWords: JSON.stringify([]),
    },
  });

  await prisma.avatar.upsert({
    where: { userId: data.userId },
    create: { userId: data.userId, mood, fixedType: null },
    update: { mood, updatedAt: new Date() },
  });

  return toResponse(post);
};

export const getPost = async (id: number): Promise<PostResponse> => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new AppError(404, '投稿が見つかりませんでした。');
  return toResponse(post);
};

export const getPostsByUser = async (userId: number): Promise<PostResponse[]> => {
  await requireUser(userId);
  const posts = await prisma.post.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return posts.map(toResponse);
};

export const updatePost = async (
  id: number,
  data: { text: string; feelingScore: number; emotionKeywords?: string[]; isVisible?: boolean },
): Promise<PostResponse> => {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, '投稿が見つかりませんでした。');

  const keywords = data.emotionKeywords !== undefined
    ? JSON.stringify(data.emotionKeywords)
    : existing.emotionKeywords;

  const mood = resolveMood(data.feelingScore);

  const post = await prisma.post.update({
    where: { id },
    data: {
      text: data.text,
      feelingScore: data.feelingScore,
      mood,
      emotionKeywords: keywords,
      ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
    },
  });
  return toResponse(post);
};

export const deletePost = async (id: number): Promise<void> => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new AppError(404, '投稿が見つかりませんでした。');
  await prisma.post.delete({ where: { id } });
};

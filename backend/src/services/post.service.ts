import { PrismaClient } from '@prisma/client';
import { AppError, PostResponse } from '../types';
import { resolveMode } from '../utils/mode';

const prisma = new PrismaClient();

const toResponse = (post: {
  id: number;
  userId: number;
  text: string;
  feelingScore: number;
  mode: string;
  emotionKeywords: unknown;
  isVisible: boolean;
  createdAt: Date;
}): PostResponse => ({
  id: post.id,
  userId: post.userId,
  text: post.text,
  feelingScore: post.feelingScore,
  mode: post.mode as PostResponse['mode'],
  emotionKeywords: (post.emotionKeywords as string[]) ?? [],
  isVisible: post.isVisible,
  createdAt: post.createdAt,
});

const requireUser = async (userId: number): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');
};

export const createPost = async (data: {
  userId: number;
  text: string;
  feelingScore: number;
  emotionKeywords?: string[];
}): Promise<PostResponse> => {
  await requireUser(data.userId);

  const post = await prisma.post.create({
    data: {
      userId: data.userId,
      text: data.text,
      feelingScore: data.feelingScore,
      mode: resolveMode(data.feelingScore),
      emotionKeywords: data.emotionKeywords ?? [],
      isVisible: false,
    },
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

  const post = await prisma.post.update({
    where: { id },
    data: {
      text: data.text,
      feelingScore: data.feelingScore,
      mode: resolveMode(data.feelingScore),
      emotionKeywords: (data.emotionKeywords ?? existing.emotionKeywords) as string[],
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

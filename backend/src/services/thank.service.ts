import { PrismaClient } from '@prisma/client';
import { AppError, ThankResponse } from '../types';

const prisma = new PrismaClient();

const toResponse = (thank: {
  id: number;
  postId: number;
  fromUserId: number;
  toUserId: number;
  message: string | null;
  kindnessScore: number;
  createdAt: Date;
}): ThankResponse => ({
  id: thank.id,
  postId: thank.postId,
  fromUserId: thank.fromUserId,
  toUserId: thank.toUserId,
  message: thank.message,
  kindnessScore: thank.kindnessScore,
  createdAt: thank.createdAt,
});

export const createThank = async (
  postId: number,
  fromUserId: number,
  message?: string,
): Promise<ThankResponse> => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError(404, '投稿が見つかりませんでした。');

  if (post.userId === fromUserId) {
    throw new AppError(400, '自分の投稿にありがとうはできません。');
  }

  const already = await prisma.thank.findFirst({ where: { postId, fromUserId } });
  if (already) throw new AppError(409, 'すでにありがとうを送っています。');

  const thank = await prisma.thank.create({
    data: {
      postId,
      fromUserId,
      toUserId: post.userId,
      message: message ?? null,
      kindnessScore: 3,
    },
  });

  await prisma.user.update({
    where: { id: post.userId },
    data: { kindnessTotal: { increment: 1 } },
  });

  await prisma.notification.create({
    data: {
      userId: post.userId,
      type: 'THANK_RECEIVED',
      title: 'ありがとうが届きました',
      message: message
        ? `「${message}」というメッセージが届きました。`
        : 'あなたの投稿にありがとうが届きました。',
      relatedObjectId: postId,
      relatedObjectType: 'POST',
    },
  });

  return toResponse(thank);
};

export const listThanks = async (postId: number): Promise<ThankResponse[]> => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError(404, '投稿が見つかりませんでした。');

  const thanks = await prisma.thank.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  return thanks.map(toResponse);
};

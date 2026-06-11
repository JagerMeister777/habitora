import { PrismaClient } from '@prisma/client';
import { AppError, ThankResponse } from '../types';

const prisma = new PrismaClient();

const toResponse = (thank: {
  id: number;
  commentId: number;
  fromUserId: number;
  toUserId: number;
  message: string | null;
  kindnessScore: number;
  createdAt: Date;
}): ThankResponse => ({
  id: thank.id,
  commentId: thank.commentId,
  fromUserId: thank.fromUserId,
  toUserId: thank.toUserId,
  message: thank.message,
  kindnessScore: thank.kindnessScore,
  createdAt: thank.createdAt,
});

export const createThank = async (
  commentId: number,
  fromUserId: number,
  message?: string,
): Promise<ThankResponse> => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { user: { select: { nickname: true } } },
  });
  if (!comment) throw new AppError(404, 'コメントが見つかりませんでした。');
  if (comment.isHidden) throw new AppError(400, 'このコメントにはありがとうを送れません。');
  if (comment.userId === fromUserId) throw new AppError(400, '自分のコメントにはありがとうできません。');

  const already = await prisma.thank.findUnique({ where: { commentId_fromUserId: { commentId, fromUserId } } });
  if (already) throw new AppError(409, 'すでにありがとうを送っています。');

  const sender = await prisma.user.findUnique({ where: { id: fromUserId } });

  const thank = await prisma.thank.create({
    data: {
      commentId,
      fromUserId,
      toUserId: comment.userId,
      message: message ?? null,
      kindnessScore: 3,
    },
  });

  await prisma.user.update({
    where: { id: comment.userId },
    data: { kindnessTotal: { increment: 1 } },
  });

  await prisma.notification.create({
    data: {
      userId: comment.userId,
      type: 'THANK',
      title: 'ありがとうが届きました',
      message: message
        ? `${sender?.nickname ?? 'だれか'} さんから「${message}」というメッセージが届きました。`
        : `${sender?.nickname ?? 'だれか'} さんからありがとうをもらいました。`,
      relatedObjectId: thank.id,
      relatedObjectType: 'Thank',
    },
  });

  return toResponse(thank);
};

export const listThanks = async (commentId: number): Promise<ThankResponse[]> => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new AppError(404, 'コメントが見つかりませんでした。');

  const thanks = await prisma.thank.findMany({
    where: { commentId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  return thanks.map(toResponse);
};

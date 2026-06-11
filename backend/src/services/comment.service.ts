import { PrismaClient } from '@prisma/client';
import { AppError, CommentResponse } from '../types';

const prisma = new PrismaClient();

const BLOCKED_KEYWORDS = [
  '死ね', '氏ね', '死んで', '消えろ', '失せろ', '殺す', '殺せ',
  'クソ野郎', 'バカ野郎', 'アホ野郎', 'キチガイ',
  'ブス', 'デブ', 'ゴミ人間', '死ぬべき', '消えて', 'うせろ',
  'いらない', '最低最悪', 'キモい', 'きもい',
  '自殺しろ', 'うざい死ね', '消えてしまえ',
];

const containsBlockedKeyword = (text: string): string | null => {
  for (const kw of BLOCKED_KEYWORDS) {
    if (text.includes(kw)) return kw;
  }
  return null;
};

const toResponse = (c: {
  id: number; postId: number; userId: number;
  user: { nickname: string | null };
  text: string; isHidden: boolean; createdAt: Date;
  _count: { thanks: number };
}): CommentResponse => ({
  id: c.id,
  postId: c.postId,
  userId: c.userId,
  authorNickname: c.user.nickname,
  text: c.text,
  isHidden: c.isHidden,
  createdAt: c.createdAt,
  thankCount: c._count.thanks,
});

export const createComment = async (
  postId: number,
  userId: number,
  text: string,
): Promise<CommentResponse> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');
  if (user.isRestricted) throw new AppError(403, 'コメントの投稿が制限されています。');

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError(404, '投稿が見つかりませんでした。');

  const hitKeyword = containsBlockedKeyword(text);
  const isHidden = hitKeyword !== null;

  const comment = await prisma.comment.create({
    data: {
      postId,
      userId,
      text,
      isHidden,
      hiddenReason: isHidden ? '自動検出による非表示' : null,
    },
    include: { user: { select: { nickname: true } }, _count: { select: { thanks: true } } },
  });

  if (isHidden) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { penaltyCount: { increment: 1 } },
    });
    if (updated.penaltyCount >= 3 && !updated.isRestricted) {
      await prisma.user.update({ where: { id: userId }, data: { isRestricted: true } });
    }
    await prisma.notification.create({
      data: {
        userId,
        type: 'PENALTY',
        title: 'コメントが非表示になりました',
        message: `投稿したコメントが不適切なコンテンツとして検出され、非表示になりました。${updated.penaltyCount >= 3 ? '繰り返しの違反によりコメントが制限されました。' : `あと${3 - updated.penaltyCount}回の違反でコメントが制限されます。`}`,
        relatedObjectId: comment.id,
        relatedObjectType: 'Comment',
      },
    });
  }

  return toResponse(comment);
};

export const listComments = async (postId: number): Promise<CommentResponse[]> => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError(404, '投稿が見つかりませんでした。');

  const comments = await prisma.comment.findMany({
    where: { postId, isHidden: false },
    orderBy: { createdAt: 'asc' },
    include: { user: { select: { nickname: true } }, _count: { select: { thanks: true } } },
  });
  return comments.map(toResponse);
};

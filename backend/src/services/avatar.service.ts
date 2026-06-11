import { PrismaClient } from '@prisma/client';
import { AppError, AvatarResponse } from '../types';

const prisma = new PrismaClient();

const toResponse = (avatar: {
  id: number;
  userId: number;
  fixedType: string | null;
  level: number;
  mood: string;
  expression: string;
  itemsJson: string;
  commentStyle: string;
  updatedAt: Date;
}): AvatarResponse => ({
  id: avatar.id,
  userId: avatar.userId,
  fixedType: avatar.fixedType,
  level: avatar.level,
  mood: avatar.mood,
  expression: avatar.expression,
  itemsJson: avatar.itemsJson,
  commentStyle: avatar.commentStyle,
  updatedAt: avatar.updatedAt,
});

export const getOrCreateAvatar = async (userId: number): Promise<AvatarResponse> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');

  const avatar = await prisma.avatar.upsert({
    where: { userId },
    create: {
      userId,
      fixedType: user.mbtiType,
      level: user.level,
    },
    update: {},
  });
  return toResponse(avatar);
};

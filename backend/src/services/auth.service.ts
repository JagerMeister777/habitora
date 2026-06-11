import { PrismaClient } from '@prisma/client';
import { AppError, UserResponse } from '../types';
import { verify } from '../utils/password';

const prisma = new PrismaClient();

export const login = async (email: string, password: string): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.isDeleted) {
    throw new AppError(401, 'メールアドレスまたはパスワードが正しくありません。');
  }

  const valid = await verify(password, user.password);
  if (!valid) {
    throw new AppError(401, 'メールアドレスまたはパスワードが正しくありません。');
  }

  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    mbtiType: user.mbtiType,
    level: user.level,
    kindnessTotal: user.kindnessTotal,
    penaltyCount: user.penaltyCount,
    isRestricted: user.isRestricted,
    reDiagnosisNeeded: user.reDiagnosisNeeded,
    registeredAt: user.registeredAt,
  };
};

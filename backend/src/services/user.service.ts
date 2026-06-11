import { PrismaClient } from '@prisma/client';
import { AppError, UserResponse } from '../types';
import { hash } from '../utils/password';

const prisma = new PrismaClient();

const toResponse = (user: {
  id: number;
  email: string;
  nickname: string | null;
  mbtiType: string | null;
  level: number;
  kindnessTotal: number;
  penaltyCount: number;
  isRestricted: boolean;
  reDiagnosisNeeded: boolean;
  registeredAt: Date;
}): UserResponse => ({
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
});

export const getUser = async (id: number): Promise<UserResponse> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'ユーザーが見つかりませんでした。');
  if (user.isDeleted) throw new AppError(404, 'ユーザーが削除されています。');
  return toResponse(user);
};

export const createUser = async (data: {
  email: string;
  password: string;
  nickname?: string;
}): Promise<UserResponse> => {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw new AppError(409, '既にメールアドレスが使われています。');

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: await hash(data.password),
      nickname: data.nickname,
    },
  });
  return toResponse(user);
};

export const updateUser = async (
  id: number,
  data: { email: string; password?: string; nickname?: string },
): Promise<UserResponse> => {
  const current = await prisma.user.findUnique({ where: { id } });
  if (!current || current.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');

  if (data.email !== current.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email: data.email } });
    if (emailTaken) throw new AppError(409, '既にメールアドレスが使われています。');
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      email: data.email,
      ...(data.password ? { password: await hash(data.password) } : {}),
      nickname: data.nickname,
    },
  });
  return toResponse(user);
};

export const deleteUser = async (id: number): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');
  await prisma.user.update({ where: { id }, data: { isDeleted: true } });
};

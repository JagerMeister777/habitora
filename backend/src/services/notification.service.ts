import { PrismaClient } from '@prisma/client';
import { AppError, NotificationResponse } from '../types';

const prisma = new PrismaClient();

const toResponse = (n: {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedObjectId: number | null;
  createdAt: Date;
}): NotificationResponse => ({
  id: n.id,
  userId: n.userId,
  type: n.type,
  title: n.title,
  message: n.message,
  isRead: n.isRead,
  relatedObjectId: n.relatedObjectId,
  createdAt: n.createdAt,
});

export const listNotifications = async (userId: number): Promise<NotificationResponse[]> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) throw new AppError(404, 'ユーザーが見つかりませんでした。');

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return notifications.map(toResponse);
};

export const markRead = async (id: number): Promise<NotificationResponse> => {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) throw new AppError(404, '通知が見つかりませんでした。');

  const updated = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
  return toResponse(updated);
};

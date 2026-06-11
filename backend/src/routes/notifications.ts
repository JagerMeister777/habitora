import { Router, Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service';

const router = Router();

router.get('/users/:id/notifications', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await notificationService.listNotifications(Number(req.params.id));
    res.json(notifications);
  } catch (err) {
    next(err);
  }
});

router.patch('/notifications/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await notificationService.markRead(Number(req.params.id));
    res.json(notification);
  } catch (err) {
    next(err);
  }
});

export default router;

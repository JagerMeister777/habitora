import { Router, Request, Response, NextFunction } from 'express';
import * as avatarService from '../services/avatar.service';

const router = Router();

router.get('/users/:id/avatar', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const avatar = await avatarService.getOrCreateAvatar(Number(req.params.id));
    res.json(avatar);
  } catch (err) {
    next(err);
  }
});

export default router;

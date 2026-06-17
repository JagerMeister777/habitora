import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as thankService from '../services/thank.service';

const router = Router();

const createSchema = z.object({
  fromUserId: z.number().int().positive(),
  message: z.string().max(100).optional(),
});

router.post('/comments/:id/thank', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fromUserId, message } = createSchema.parse(req.body);
    const thank = await thankService.createThank(Number(req.params.id), fromUserId, message);
    res.status(201).json(thank);
  } catch (err) {
    next(err);
  }
});

router.get('/comments/:id/thanks', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thanks = await thankService.listThanks(Number(req.params.id));
    res.json(thanks);
  } catch (err) {
    next(err);
  }
});

export default router;

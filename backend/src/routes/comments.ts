import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as commentService from '../services/comment.service';

const router = Router();

const createSchema = z.object({
  userId: z.number().int().positive(),
  text: z.string().min(1, 'コメントを入力してください。').max(200, 'コメントは200文字以内で入力してください。'),
});

router.post('/posts/:id/comments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, text } = createSchema.parse(req.body);
    const comment = await commentService.createComment(Number(req.params.id), userId, text);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

router.get('/posts/:id/comments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await commentService.listComments(Number(req.params.id));
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as postService from '../services/post.service';

const router = Router();

const createSchema = z.object({
  userId: z.number().int().positive('ユーザーIDを入力してください。'),
  text: z.string().min(1, '本文を入力してください。').max(250, '本文は250文字以内で入力してください。'),
  feelingScore: z.number().int().min(0).max(100, '感情スコアは0〜100で入力してください。'),
  emotionKeywords: z.array(z.string()).optional(),
});

const updateSchema = z.object({
  text: z.string().min(1, '本文を入力してください。').max(250, '本文は250文字以内で入力してください。'),
  feelingScore: z.number().int().min(0).max(100),
  emotionKeywords: z.array(z.string()).optional(),
  isVisible: z.boolean().optional(),
});

router.post('/posts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createSchema.parse(req.body);
    const post = await postService.createPost(data);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

router.get('/posts/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await postService.getPost(Number(req.params.id));
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.get('/users/:userId/posts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await postService.getPostsByUser(Number(req.params.userId));
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.put('/posts/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateSchema.parse(req.body);
    const post = await postService.updatePost(Number(req.params.id), data);
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.delete('/posts/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await postService.deletePost(Number(req.params.id));
    res.json({ message: `id : ${req.params.id} の投稿を削除しました。` });
  } catch (err) {
    next(err);
  }
});

export default router;

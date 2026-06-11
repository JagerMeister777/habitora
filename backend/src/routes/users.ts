import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as userService from '../services/user.service';
import * as avatarService from '../services/avatar.service';

const router = Router();

const userSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください。'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください。'),
  confirmPass: z.string(),
  nickname: z.string().optional(),
}).refine((d) => d.password === d.confirmPass, {
  message: 'パスワードが一致しませんでした。',
  path: ['confirmPass'],
});

const updateSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください。'),
  password: z.string().min(8).optional(),
  nickname: z.string().optional(),
});

router.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUser(Number(req.params.id));
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/users/:id/avatar', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const avatar = await avatarService.getOrCreateAvatar(Number(req.params.id));
    res.json(avatar);
  } catch (err) {
    next(err);
  }
});

router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = userSchema.parse(req.body);
    const user = await userService.createUser(data);
    res.status(201).json({ message: '登録が完了しました。', user });
  } catch (err) {
    next(err);
  }
});

router.put('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateSchema.parse(req.body);
    const user = await userService.updateUser(Number(req.params.id), data);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.delete('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser(Number(req.params.id));
    res.json({ message: `id : ${req.params.id} を削除しました。` });
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as mbtiService from '../services/mbti.service';

const router = Router();

const answersSchema = z.object({
  userId: z.number().int().positive(),
  q1: z.enum(['A', 'B']),
  q2: z.enum(['A', 'B']),
  q3: z.enum(['A', 'B']),
  q4: z.enum(['A', 'B']),
  q5: z.enum(['A', 'B']),
});

router.post('/mbti/initial', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, ...answers } = answersSchema.parse(req.body);
    const result = await mbtiService.createInitialDiagnosis(userId, answers);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/users/:id/mbti', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const diagnoses = await mbtiService.getDiagnoses(Number(req.params.id));
    res.json(diagnoses);
  } catch (err) {
    next(err);
  }
});

export default router;

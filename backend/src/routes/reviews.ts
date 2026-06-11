import { Router, Request, Response, NextFunction } from 'express';
import { generateMonthlyReview, listReviews } from '../services/review.service';

const router = Router();

router.post('/users/:id/reviews/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const review = await generateMonthlyReview(userId);
    res.json(review);
  } catch (e) { next(e); }
});

router.get('/users/:id/reviews', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const reviews = await listReviews(userId);
    res.json(reviews);
  } catch (e) { next(e); }
});

export default router;

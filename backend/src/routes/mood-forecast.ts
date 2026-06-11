import { Router, Request, Response, NextFunction } from 'express';
import { getOrGenerateForecast, regenerateForecast } from '../services/mood-forecast.service';

const router = Router();

router.get('/users/:id/mood-forecast', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const forecast = await getOrGenerateForecast(userId);
    res.json(forecast);
  } catch (e) { next(e); }
});

router.post('/users/:id/mood-forecast/regenerate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const forecast = await regenerateForecast(userId);
    res.json(forecast);
  } catch (e) { next(e); }
});

export default router;

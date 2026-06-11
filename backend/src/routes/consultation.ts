import { Router, Request, Response, NextFunction } from 'express';
import { createConsultation, listConsultations, archiveConsultation } from '../services/consultation.service';

const router = Router();

router.post('/consultation', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, title, content, selectedTheme } = req.body;
    const consultation = await createConsultation({ userId, title, content, selectedTheme });
    res.status(201).json(consultation);
  } catch (e) { next(e); }
});

router.get('/users/:id/consultations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const consultations = await listConsultations(userId);
    res.json(consultations);
  } catch (e) { next(e); }
});

router.patch('/consultation/:id/archive', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const consultation = await archiveConsultation(id);
    res.json(consultation);
  } catch (e) { next(e); }
});

export default router;

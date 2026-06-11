import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import postRouter from './routes/posts';
import mbtiRouter from './routes/mbti';
import thanksRouter from './routes/thanks';
import notificationsRouter from './routes/notifications';
import avatarRouter from './routes/avatar';
import reviewsRouter from './routes/reviews';
import moodForecastRouter from './routes/mood-forecast';
import consultationRouter from './routes/consultation';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', postRouter);
app.use('/api', mbtiRouter);
app.use('/api', thanksRouter);
app.use('/api', notificationsRouter);
app.use('/api', avatarRouter);
app.use('/api', reviewsRouter);
app.use('/api', moodForecastRouter);
app.use('/api', consultationRouter);

app.use(errorHandler);

// フロントエンドの静的ファイルを配信
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Habitora running on http://localhost:${PORT}`);
});

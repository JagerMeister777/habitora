import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import postRouter from './routes/posts';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT ?? 8080;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', postRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Habitora backend running on http://localhost:${PORT}`);
});

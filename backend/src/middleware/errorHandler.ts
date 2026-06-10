import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../types';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const timestamp = new Date().toISOString();

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      error: statusText(err.statusCode),
      message: err.message,
      timestamp,
    });
    return;
  }

  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    res.status(400).json({ status: 400, error: 'Bad Request', message, timestamp });
    return;
  }

  console.error(err);
  res.status(500).json({ status: 500, error: 'Internal Server Error', message: 'サーバーエラーが発生しました。', timestamp });
};

const statusText = (code: number): string => {
  const map: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    404: 'Not Found',
    409: 'Conflict',
  };
  return map[code] ?? 'Error';
};

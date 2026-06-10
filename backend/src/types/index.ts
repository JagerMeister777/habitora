export type Mode = 'LOW' | 'NEUTRAL' | 'HIGH';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  nickname: string | null;
  registeredAt: Date;
}

export interface PostResponse {
  id: number;
  userId: number;
  text: string;
  feelingScore: number;
  mode: Mode;
  emotionKeywords: string[];
  isVisible: boolean;
  createdAt: Date;
}

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

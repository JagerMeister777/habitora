export type Mode = 'LOW' | 'NEUTRAL' | 'HIGH';

export interface User {
  id: number;
  name: string;
  email: string;
  nickname: string | null;
  registeredAt: string;
}

export interface Post {
  id: number;
  userId: number;
  text: string;
  feelingScore: number;
  mode: Mode;
  emotionKeywords: string[];
  isVisible: boolean;
  createdAt: string;
}

import { request } from './client';
import type { MBTIDiagnosis } from '../types';

export interface MbtiAnswers {
  q1: 'A' | 'B';
  q2: 'A' | 'B';
  q3: 'A' | 'B';
  q4: 'A' | 'B';
  q5: 'A' | 'B';
}

export const submitInitialMbti = (
  userId: number,
  answers: MbtiAnswers,
): Promise<MBTIDiagnosis & { typeName: string }> =>
  request('/mbti/initial', {
    method: 'POST',
    body: JSON.stringify({ userId, ...answers }),
  });

export const getMbtiDiagnoses = (userId: number): Promise<MBTIDiagnosis[]> =>
  request(`/users/${userId}/mbti`);

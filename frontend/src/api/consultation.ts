import { request } from './client';
import type { Consultation } from '../types';

export const createConsultation = (data: {
  userId: number;
  content: string;
  selectedTheme?: string;
  title?: string;
}): Promise<Consultation> =>
  request<Consultation>('/consultation', { method: 'POST', body: JSON.stringify(data) });

export const listConsultations = (userId: number): Promise<Consultation[]> =>
  request<Consultation[]>(`/users/${userId}/consultations`);

export const archiveConsultation = (id: number): Promise<Consultation> =>
  request<Consultation>(`/consultation/${id}/archive`, { method: 'PATCH' });

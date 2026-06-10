const BASE = '/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'エラーが発生しました。' }));
    throw new ApiError(res.status, body.message ?? 'エラーが発生しました。');
  }

  return res.json() as Promise<T>;
};

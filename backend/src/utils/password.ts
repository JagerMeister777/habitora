import bcrypt from 'bcryptjs';

export const hash = (plain: string): Promise<string> =>
  bcrypt.hash(plain, 10);

export const verify = (plain: string, hashed: string): Promise<boolean> =>
  bcrypt.compare(plain, hashed);

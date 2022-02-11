import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  20
);

export function createId(): string {
  const newId = nanoid();

  return newId;
}

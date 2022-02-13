import { z } from 'zod';

type ValidISOString = string;

const isISOString = (val: string): val is ValidISOString => {
  const d = new Date(val);
  return !Number.isNaN(d.valueOf()) && d.toISOString() === val;
};

export const UserSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    email: z.string().email(),
    address: z.string(),
    dateOfBirth: z
      .string()
      .refine(isISOString, 'dateOfBirth must be a valid ISO string'),
  })
  .strip();

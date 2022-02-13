import { z } from 'zod';
import { Role } from './enum';

type ValidISOString = string;

const isISOString = (val: string): val is ValidISOString => {
  const d = new Date(val);
  return !Number.isNaN(d.valueOf()) && d.toISOString() === val;
};

export const CreateUserSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    address: z.string(),
    phone: z.string(),
    role: z.string().optional().default(Role.USER),
    dateOfBirth: z
      .string()
      .refine(isISOString, 'dateOfBirth must be a valid ISO string'),
  })
  .strip();

export const UpdateUserSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    address: z.string(),
    phone: z.string(),
    role: z.string().optional().default(Role.USER),
    dateOfBirth: z
      .string()
      .refine(isISOString, 'dateOfBirth must be a valid ISO string'),
  })
  .strip();

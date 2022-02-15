import { z } from 'zod';

type ValidISOString = string;

const isISOString = (val: string): val is ValidISOString => {
  const d = new Date(val);
  return !Number.isNaN(d.valueOf()) && d.toISOString() === val;
};

export const AppointmentSchema = z
  .object({
    id: z.string().optional(),
    type: z.string(),
    notes: z.string().optional(),
    startAt: z
      .string()
      .refine(isISOString, 'StartAt date must be a valid ISO string'),
    endAt: z
      .string()
      .refine(isISOString, 'EndAt date must be a valid ISO string'),
    userId: z.string(),
  })
  .strip();

import { z } from 'zod';

export const idParamValidator = z.object({
  id: z.string().length(24),
});

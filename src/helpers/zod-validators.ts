import { z } from 'zod';

/**
 * A helper function that validates a path param that is supposed to be an id of a databse object
 */
export const idParamValidator = z.object({
  id: z.string().length(24),
});

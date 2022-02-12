import { Response } from 'express';
import { NotFoundError } from '../models/errors';

export function sendError(
  res: Response,
  error: Error | unknown,
  status: number = 400
): Response {
  if (error instanceof NotFoundError) {
    status = 404;
  }

  return res.status(status).send({ error: (error as Error).message });
}

import { Response } from 'express';
import { NotFoundError } from '../models/errors';

/**
 * Utility function that sends an error response based on the error type
 * @param res The response object in witch to send the error
 * @param error The error containing the type and the message, if the error is a NotFoundError, the code will be 404 otherwise 400
 * @param status A custom status code to send in the response, if not provided the status code will be 400 or 404 depending on the error type
 * @returns A Response object with the error message and the status code
 */
export function sendError(
  res: Response,
  error: Error,
  status: number = 400
): Response {
  if (error instanceof NotFoundError) {
    status = 404;
  }

  return res.status(status).send({ error: (error as Error).message });
}

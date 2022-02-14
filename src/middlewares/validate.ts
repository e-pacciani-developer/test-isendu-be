import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodErrorMap, ZodIssue } from 'zod';

/**
 * A Zod Validator tha validates a request body against a given Zod schema, if the validation fails, it will return a BadRequest error
 * containing the list of the validation errors
 * @param schema The schema to validate the request body against
 * @returns If the validation is successful returns the request to the next handler, otherwise a BadRequest error containing the property 'errors' with a list of strings
 * containing the validation errors
 */
export const validateBody =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parse(req.body);
      return next();
    } catch (error) {
      const issues = (error as any).issues.map(
        (issue: ZodIssue) => issue.path.join('.') + ' : ' + issue.message
      );

      return res.status(400).send({ errors: issues });
    }
  };

/**
 * A Zod Validator tha validates a request path params against a given Zod schema, if the validation fails, it will return a BadRequest error
 * containing the list of the validation errors
 * @param schema The schema to validate the request path params against
 * @returns If the validation is successful returns the request to the next handler, otherwise a BadRequest error containing the property 'errors' with a list of strings
 * containing the validation errors
 */
export const validateParams =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = await schema.parse(req.params);
      return next();
    } catch (error) {
      const issues = (error as any).issues.map(
        (issue: ZodIssue) => issue.path.join('.') + ' : ' + issue.message
      );

      return res.status(400).send({ errors: issues });
    }
  };

/**
 * A Zod Validator tha validates a request query params against a given Zod schema, if the validation fails, it will return a BadRequest error
 * containing the list of the validation errors
 * @param schema The schema to validate the request query params against
 * @returns If the validation is successful returns the request to the next handler, otherwise a BadRequest error containing the property 'errors' with a list of strings
 * containing the validation errors
 */
export const validateQueryParams =
  (schema: AnyZodObject): any =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await schema.parse(req.query);
      return next();
    } catch (error) {
      const issues = (error as any).issues.map(
        (issue: ZodIssue) => issue.path.join('.') + ' : ' + issue.message
      );

      return res.status(400).send({ errors: issues });
    }
  };

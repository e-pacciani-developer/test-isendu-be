import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodIssue } from 'zod';

export const validateBody =
  (schema: AnyZodObject): any =>
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

export const validateParams =
  (schema: AnyZodObject): any =>
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

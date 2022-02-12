import express from 'express';
import { UserController } from '../controllers/user-controller';
import { validateBody, validateParams } from '../middlewares';
import { idParamValidator } from '../helpers/zod-validators';
import { UserSchema } from '../models';

export const usersRouter = express.Router();

usersRouter.get('/', UserController.getAll);

usersRouter.get(
  '/:id',
  validateParams(idParamValidator),
  UserController.getOneById
);

usersRouter.post('/', validateBody(UserSchema), UserController.create);

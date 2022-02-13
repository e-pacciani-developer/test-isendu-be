import express from 'express';
import { UsersController } from '../controllers/users.controller';
import { validateBody, validateParams } from '../middlewares';
import { idParamValidator } from '../helpers/zod-validators';
import { UserSchema } from '../models';

export const usersRouter = express.Router();

usersRouter.get('/', UsersController.getAll);

usersRouter.get(
  '/:id',
  validateParams(idParamValidator),
  UsersController.getOneById
);

usersRouter.post('/', validateBody(UserSchema), UsersController.create);

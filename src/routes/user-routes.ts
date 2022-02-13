import express from 'express';
import { UsersController } from '../controllers/users.controller';
import { validateBody, validateParams } from '../middlewares';
import { idParamValidator } from '../helpers/zod-validators';
import { CreateUserSchema, UpdateUserSchema } from '../models';

export const usersRouter = express.Router();

usersRouter.get('/', UsersController.getAll);

usersRouter.get(
  '/:id',
  validateParams(idParamValidator),
  UsersController.getOneById
);

usersRouter.put('/:id', validateBody(UpdateUserSchema), UsersController.update);
usersRouter.post('/', validateBody(CreateUserSchema), UsersController.create);
usersRouter.delete(
  '/:id',
  validateParams(idParamValidator),
  UsersController.remove
);

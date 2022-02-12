import { GetRequest, PostRequest, TResponse } from '../models';
import { sendError } from '../helpers/response-helpers';
import { usersRepository } from '../repositories/repositories';
import { User } from '@prisma/client';

export const UserController = {
  getOneById,
  create,
};

/**
 * Retrives a user by id
 * @param req The id of the user to retrieve
 * @param res The response object with the retrieved user
 * @returns The user retrieved if successful, an error otherwise
 */
async function getOneById(
  req: GetRequest<{ id: string }>,
  res: TResponse<User>
): Promise<TResponse<User>> {
  const { id } = req.params;

  try {
    const user = await usersRepository.getOneById(id);

    return res.send(user);
  } catch (e) {
    return sendError(res, e);
  }
}

/**
 * Creates a new user
 * @param req The user to create
 * @param res The response object with the created user
 * @returns The created user if successfull, an error otherwise
 */
async function create(
  req: PostRequest<User>,
  res: TResponse<User>
): Promise<TResponse<User>> {
  const user = req.body;

  try {
    const newUser = await usersRepository.create(user);

    return res.send(newUser);
  } catch (e) {
    return sendError(res, e);
  }
}

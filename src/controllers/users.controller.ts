import { GetRequest, PostRequest, TResponse } from '../models';
import { sendError } from '../helpers/response-helpers';
import usersService from '../services/users.service';
import { User } from '@prisma/client';

export const UsersController = {
  getAll,
  getOneById,
  create,
};

/**
 * Retrives all the users from the database
 * @param req The request object, with no query or path params
 * @param res The response object with the retrived list
 * @returns The list of users retrieved if successful, an error otherwise
 */
async function getAll(
  req: GetRequest,
  res: TResponse<User[]>
): Promise<TResponse<User[]>> {
  try {
    const users = await usersService.getAll();

    return res.send(users);
  } catch (e) {
    console.log(e);
    return sendError(res, e);
  }
}

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
    const user = await usersService.getOneById(id);

    return res.send(user);
  } catch (e) {
    console.log(e);
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
    const newUser = await usersService.create(user);

    return res.send(newUser);
  } catch (e) {
    console.log(e);
    return sendError(res, e);
  }
}

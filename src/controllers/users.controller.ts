import {
  DeleteRequest,
  GetRequest,
  PostRequest,
  PutRequest,
  TResponse,
} from '../models';
import { sendError } from '../helpers/response-helpers';
import usersService from '../services/users.service';
import { User } from '@prisma/client';
import { CreateUserDto } from '../models/dto/users-dto';

export const UsersController = {
  getAll,
  getOneById,
  create,
  update,
  remove,
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
  req: PostRequest<CreateUserDto>,
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

async function update(
  req: PutRequest<User, { id: string }>,
  res: TResponse<User>
): Promise<TResponse<User>> {
  const { id } = req.params;
  const appointment = req.body;

  try {
    const updatedUser = await usersService.update(id, appointment);

    return res.send(updatedUser);
  } catch (e) {
    console.error(e);
    return sendError(res, e);
  }
}

async function remove(
  req: DeleteRequest<{ id: string }>,
  res: TResponse<boolean>
): Promise<TResponse<boolean>> {
  const { id } = req.params;

  try {
    await usersService.delete(id);

    return res.send(true);
  } catch (e) {
    console.error(e);
    return sendError(res, e);
  }
}

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
 * @returns A promise with the response containingthe  list of users retrieved if successful, a BadRequest error otherwise
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
    return sendError(res, e as Error);
  }
}

/**
 * Retrives a user by id
 * @param req The request containing the id of the user to retrieve
 * @param res The response object with the retrieved user or an error if not found
 * @returns A promise with the response containing user retrieved if successful, a NotFound error if not found, a BadRequest error otherwise
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
    return sendError(res, e as Error);
  }
}

/**
 * Creates a new user
 * @param req The user to create
 * @param res The response object with the created user
 * @returns A promise with the response containing the created user if successfull, a BadRequest error otherwise
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
    return sendError(res, e as Error);
  }
}

/**
 * Updates the data of a user
 * @param req The request containing the user data to update in the body and the id of the user to update as path param
 * @param res The response object with the updated user if successful, a BadRequest error otherwise
 * @returns A promise with the response containing the updated user if successful, a BadRequest error otherwise
 */
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
    return sendError(res, e as Error);
  }
}

/**
 * Deletes the user with the given id and all the appointments associated with it
 * @param req The request containing the id of the user to delete
 * @param res The response object with true if the user was deleted or a BadRequest error if it was not
 * @returns A promise with the response containing true if the user was deleted, a BadRequest error otherwise
 */
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
    return sendError(res, e as Error);
  }
}

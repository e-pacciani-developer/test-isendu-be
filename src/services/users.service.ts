import { prisma, User } from '@prisma/client';
import db from '../db';
import { NotFoundError, CreateUserDto } from '../models';

class UsersService {
  /**
   * Retrives the list of all the users
   * @param nameFilter A filter to apply on the name of the users
   * @returns A promise with the list of users, throws an error if something goes wrong
   */
  async getAll(nameFilter?: string): Promise<User[]> {
    try {
      const users = await db.user.findMany({
        where: { name: { contains: nameFilter, mode: 'insensitive' } },
      });

      return users;
    } catch (e) {
      console.error(e);
      throw new Error('Error while getting all users');
    }
  }

  /**
   * Retrives a user by its id
   * @param id The id of the user to retrieve
   * @returns A promise with the user retrieved if successful, a NotFound error if not found, a BadRequest error otherwise
   */
  async getOneById(id: string): Promise<User> {
    try {
      const user = await db.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    } catch (e) {
      console.error(e);
      throw new NotFoundError('User not found');
    }
  }

  /**
   * Creates a new user
   * @param user The data of the user to create
   * @returns A promise with the created user if successful, a BadRequest error otherwise
   */
  async create(user: CreateUserDto): Promise<User> {
    try {
      const newUser = await db.user.create({ data: user });

      return newUser;
    } catch (e) {
      console.log(e);
      throw new Error('Error while creating new user');
    }
  }

  /**
   * Updates a user data
   * @param userId The id of the user to update
   * @param user The data of the user to update
   * @returns A Promise with the updated user if successful, a NotFound error if not found, a BadRequest error otherwise
   */
  async update(userId: string, user: User): Promise<User> {
    // Check if the ids match
    if (user.id !== userId) {
      throw new Error('User id does not match');
    }

    try {
      const userToUpdate = await db.user.findUnique({
        where: { id: userId },
      });

      if (!userToUpdate) {
        throw new NotFoundError('User not found');
      }

      // Remove the id propery from the user to update to avoid Prisma conflicting ids errors
      const { id, ...userData } = user;

      const updatedUser = await db.user.update({
        where: { id },
        data: userData,
      });

      return updatedUser;
    } catch (e) {
      console.log(e);
      throw new Error('Error while updating the user');
    }
  }

  /**
   * Deletes a user and all the appointments associated to it
   * @param userId The id of the user to delete
   * @returns A Promise containig true if successful, a NotFound error if not found, a BadRequest error otherwise
   */
  async delete(userId: string): Promise<true> {
    try {
      const userToDelete = await db.user.findUnique({
        where: { id: userId },
      });

      if (!userToDelete) {
        throw new NotFoundError('User not found');
      }

      // The related appointments will be deleted automatically
      // by Prisma because the relation has the cascade delete option
      // activated
      await db.user.delete({
        where: { id: userId },
      });

      return true;
    } catch (e) {
      console.error(e);
      throw new Error('Error while deleting the user');
    }
  }
}

const usersService = new UsersService();
export default usersService;

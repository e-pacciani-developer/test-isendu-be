import {} from '../models/errors';
import { User } from '@prisma/client';
import { db } from '../db';
import { NotFoundError, CreateUserDto } from '../models';

class UsersService {
  public db = db;

  async getAll(): Promise<User[]> {
    try {
      const users = await this.db.user.findMany();

      return users;
    } catch (e) {
      console.error(e);
      throw new Error('Error while getting all users');
    }
  }

  async getOneById(id: string): Promise<User> {
    try {
      const user = await this.db.user.findUnique({
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

  async create(user: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.db.user.create({ data: user });

      return newUser;
    } catch (e) {
      console.log(e);
      throw new Error('Error while creating new user');
    }
  }

  async update(userId: string, user: User): Promise<User> {
    if (user.id !== userId) {
      throw new Error('User id does not match');
    }

    try {
      const userToUpdate = await this.db.user.findUnique({
        where: { id: userId },
      });

      if (!userToUpdate) {
        throw new NotFoundError('User not found');
      }

      const { id, ...userData } = user;

      const updatedUser = await this.db.user.update({
        where: { id },
        data: userData,
      });

      return updatedUser;
    } catch (e) {
      console.log(e);
      throw new Error('Error while updating the user');
    }
  }
}

const usersService = new UsersService();
export default usersService;

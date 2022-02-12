import { NotFoundError } from '../models/errors';
import { User } from '@prisma/client';
import { db } from '../db';

export class UsersRepository {
  public db = db;

  async getAll(): Promise<User[]> {
    try {
      const users = await this.db.user.findMany();

      return users;
    } catch (e) {
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
      throw new NotFoundError('User not found');
    }
  }

  async create(user: User): Promise<User> {
    try {
      const newUser = await this.db.user.create({ data: user });

      return newUser;
    } catch (e) {
      throw new Error('Error while creating new user');
    }
  }
}

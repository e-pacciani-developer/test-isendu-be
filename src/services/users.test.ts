import { User } from '@prisma/client';
import { Role } from '../models';
import { prismaMock } from './../singleton';
import usersService from './users.service';

describe('Users service', () => {
  it('Should return a list of users', async () => {
    const users: User[] = [
      {
        id: '6206a047714387b96ee2af7f',
        name: 'Mario Rossi',
        email: 'm.r@gmail.com',
        address: '',
        dateOfBirth: new Date(),
        phone: '',
        role: Role.USER,
      },
      {
        id: '6206a047714387b96ee2af7l',
        name: 'Franco Rossi',
        email: 'm.r@gmail.com',
        address: '',
        dateOfBirth: new Date(),
        phone: '',
        role: Role.USER,
      },
    ];

    prismaMock.user.findMany.mockResolvedValue(users);

    expect(usersService.getAll()).resolves.toEqual(users);
  });

  it('Should return the requested user', () => {
    const requestedUser: User = {
      id: '6206a047714387b96ee2af7f',
      name: 'Mario Rossi',
      email: 'm.r@gmail.com',
      address: '',
      dateOfBirth: new Date(),
      phone: '',
      role: Role.USER,
    };

    prismaMock.user.findUnique.mockResolvedValue(requestedUser);

    expect(
      usersService.getOneById('6206a047714387b96ee2af7f')
    ).resolves.toEqual(requestedUser);
  });

  it('Should create a user', () => {
    const createdUser: User = {
      id: '6206a047714387b96ee2af7f',
      name: 'Mario Rossi',
      email: 'm.r@gmail.com',
      address: '',
      dateOfBirth: new Date(),
      phone: '',
      role: Role.USER,
    };

    const { id, ...userToCreate } = createdUser;

    prismaMock.user.create.mockResolvedValue(createdUser);

    expect(usersService.create(userToCreate)).resolves.toEqual(createdUser);
  });

  it('Should update a user', () => {
    const userToUpdate: User = {
      id: '6206a047714387b96ee2af7f',
      name: 'Mario Rossi',
      email: 'm.r@gmail.com',
      address: '',
      dateOfBirth: new Date(),
      phone: '',
      role: Role.USER,
    };

    const userBeforeUpdate = { ...userToUpdate, name: 'Fabio Rossi' };

    prismaMock.user.findUnique.mockResolvedValue(userBeforeUpdate);
    prismaMock.user.update.mockResolvedValue(userToUpdate);

    expect(
      usersService.update('6206a047714387b96ee2af7f', userToUpdate)
    ).resolves.toEqual(userToUpdate);
  });

  it('Should delete a user', async () => {
    const userToDelete: User = {
      id: '6206a047714387b96ee2af7f',
      name: 'Mario Rossi',
      email: 'm.r@gmail.com',
      address: '',
      dateOfBirth: new Date(),
      phone: '',
      role: Role.USER,
    };

    prismaMock.user.findUnique.mockResolvedValue(userToDelete);
    prismaMock.user.delete.mockResolvedValue(userToDelete);

    expect(usersService.delete('6206a047714387b96ee2af7f')).resolves.toEqual(
      true
    );
  });

  it("Should throw an error if attempting to delete a user that doesn't exists", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error());

    expect(
      usersService.delete('6206a047714387b96ee2af7x')
    ).rejects.toThrowError();
  });
});

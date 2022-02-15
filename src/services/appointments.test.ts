import { Appointment, User } from '@prisma/client';
import { Role } from '../models';
import { prismaMock } from './../singleton';
import appointmentService from './appointments.service';

describe('Appointments API', () => {
  test('Should return an appointments list', async () => {
    const appointments: Appointment[] = [
      {
        id: '6207969653ac4f2ab1673ebe',
        endAt: new Date('2020-06-01T12:00:00'),
        startAt: new Date('2020-06-01T11:00:00'),
        userId: '6206a047714387b96ee2af7f',
        notes: 'Un appuntamento qualsiasi',
        type: 'Teeth Cleaning',
      },
    ];

    prismaMock.appointment.findMany.mockResolvedValue(appointments);

    expect(
      appointmentService.getAll(1, 1, Role.ADMIN, '6206a047714387b96ee2af7f')
    ).resolves.toEqual({
      data: appointments,
      hasMore: false,
    });
  }, 300000);

  test('Should correctly paginate the response', async () => {
    const appointments: Appointment[] = [
      {
        id: '6207969653ac4f2ab1673ebe',
        endAt: new Date('2020-06-01T12:00:00'),
        startAt: new Date('2020-06-01T11:00:00'),
        userId: '6206a047714387b96ee2af7f',
        notes: 'Un appuntamento qualsiasi',
        type: 'Teeth Cleaning',
      },
    ];

    prismaMock.appointment.findMany.mockResolvedValue(appointments);

    const result = await appointmentService.getAll(
      1,
      1,
      Role.ADMIN,
      '6206a047714387b96ee2af7f'
    );

    expect(result.data.length).toEqual(1);
    expect(result.hasMore).toEqual(false);
  });

  test('Should create an appointment', async () => {
    const newAppointment: Appointment = {
      id: '6207969653ac4f2ab1673ebe',
      endAt: new Date('2020-06-01T12:00:00'),
      startAt: new Date('2020-06-01T11:00:00'),
      userId: '6206a047714387b96ee2af7f',
      notes: 'New appointment',
      type: 'Teeth Cleaning',
    };

    const user: User = {
      id: '6206a047714387b96ee2af7f',
      name: 'Mario Rossi',
      email: 'm.r@gmail.com',
      address: '',
      dateOfBirth: new Date(),
      phone: '',
      role: Role.USER,
    };

    const { id, ...appointmentToCreate } = newAppointment;

    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.appointment.create.mockResolvedValue(newAppointment);

    expect(
      appointmentService.create(appointmentToCreate, '6206a047714387b96ee2af7f')
    ).resolves.toEqual(newAppointment);
  });

  it('Should update an appointment', async () => {
    const appointment: Appointment = {
      id: '6207969653ac4f2ab1673ebe',
      endAt: new Date('2020-06-01T12:00:00'),
      startAt: new Date('2020-06-01T11:00:00'),
      userId: '6206a047714387b96ee2af7f',
      notes: 'New appointment',
      type: 'Teeth Cleaning',
    };

    const user: User = {
      id: '6206a047714387b96ee2af7f',
      name: 'Mario Rossi',
      email: 'm.r@gmail.com',
      address: '',
      dateOfBirth: new Date(),
      phone: '',
      role: Role.USER,
    };

    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.appointment.update.mockResolvedValue(appointment);

    expect(
      appointmentService.create(appointment, '6206a047714387b96ee2af7f')
    ).resolves.toEqual(appointment);
  });

  test('Should delete an appointment', async () => {
    const appoitnmentToDelete: Appointment = {
      id: '6207969653ac4f2ab1673ebe',
      endAt: new Date('2020-06-01T12:00:00'),
      startAt: new Date('2020-06-01T11:00:00'),
      userId: '6206a047714387b96ee2af7f',
      notes: 'Aappointment to update',
      type: 'Teeth Cleaning',
    };

    prismaMock.appointment.findUnique.mockResolvedValue(appoitnmentToDelete);
    prismaMock.appointment.delete.mockResolvedValue(appoitnmentToDelete);

    expect(
      appointmentService.delete('6207969653ac4f2ab1673ebe')
    ).resolves.toEqual(true);
  });

  test('Should return false if the asked slot is not available', async () => {
    const appoitnment: Appointment = {
      id: '6207969653ac4f2ab1673ebe',
      endAt: new Date('2020-06-01T12:00:00'),
      startAt: new Date('2020-06-01T11:00:00'),
      userId: '6206a047714387b96ee2af7f',
      notes: 'Aappointment to update',
      type: 'Teeth Cleaning',
    };

    const overlappingAppointment: Appointment = {
      id: '6207969653ac4f2ab1673ebe',
      endAt: new Date('2020-06-01T12:00:00'),
      startAt: new Date('2020-06-01T11:00:00'),
      userId: '6206a047714387b96ee2af7f',
      notes: 'Aappointment to update',
      type: 'Teeth Cleaning',
    };

    prismaMock.appointment.findMany.mockResolvedValue([appoitnment]);

    expect(
      appointmentService.checkForAvailability(overlappingAppointment)
    ).resolves.toEqual(false);
  });

  test('Should return true if the asked slot is available', async () => {
    const appoitnment: Appointment = {
      id: '6207969653ac4f2ab1673ebe',
      endAt: new Date('2020-06-01T12:00:00'),
      startAt: new Date('2020-06-01T11:00:00'),
      userId: '6206a047714387b96ee2af7f',
      notes: 'Aappointment to update',
      type: 'Teeth Cleaning',
    };

    prismaMock.appointment.findMany.mockResolvedValue([]);

    expect(
      appointmentService.checkForAvailability(appoitnment)
    ).resolves.toEqual(true);
  });
});

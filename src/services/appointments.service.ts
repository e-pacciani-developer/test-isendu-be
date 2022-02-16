import { Appointment } from '@prisma/client';
import {
  CreateAppointmentDto,
  GetAppointmentsDto,
  NotFoundError,
  Role,
} from '../models';
import db from '../db';

class AppointmentsService {
  /**
   * Retrives the list of appointments filtered by the given parameters. If page of limit is not provided, it will return all the appointments
   * @param page The page of the appointments to be returned
   * @param limit The limit of elements to be returned
   * @param role The role of the user that is requesting the appointments
   * @param userId The id of the user that is requesting the appointments
   * @returns A GetAppointmentsDto witch contains the list of appointments and a flag "hasMore" to indicate if there are more appointments to be loaded
   */
  async getAll(
    page: number,
    limit: number,
    role: Role,
    userId: string
  ): Promise<GetAppointmentsDto> {
    // The adminisrator can see all the appointments so we don't need to filter by userId
    const where = role === Role.ADMIN ? {} : { userId };

    // Query with pagination
    const qry = db.appointment.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { user: true },
      orderBy: { startAt: 'asc' },
      where: { startAt: { gte: new Date() }, ...where },
    });

    // Count query
    const countQry = db.appointment.count();

    try {
      // Fetching data
      const data = await qry;
      const count = await countQry;

      // Calculating if there are more appointments to be loaded
      const hasMore = count > page * limit;

      return { data, hasMore };
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw e;
      }
      throw new Error((e as Error).message);
    }
  }

  /**
   * Retrives the list of appointments that start between the start and an end date
   * @param start The start date to filter the appointments
   * @param end THe end date to filter the appointments
   * @returns A list of appointments
   */
  async getAppointmentsForCalendar(
    start: Date,
    end: Date
  ): Promise<Appointment[]> {
    const qry = db.appointment.findMany({
      where: {
        startAt: {
          gte: start,
          lte: end,
        },
      },
    });

    try {
      const appointments = await qry;

      return appointments;
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw e;
      }
      throw new Error((e as Error).message);
    }
  }

  /**
   * Creates a new appointment, checking if the user is existing, it is required to check if the asked slot is available before calling this function
   * @param data The appointment's data
   * @param userId The id of the user that will be the associated with the appointment
   * @returns The appointment created or an error if the user doesn't exist or the userId passed in the path param doesn't match the userId passed in the body
   */
  async create(
    data: CreateAppointmentDto,
    userId: string
  ): Promise<Appointment> {
    if (data.userId !== userId) {
      throw new Error('UserId does not match');
    }

    try {
      const user = await db.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const appointment = await db.appointment.create({
        data,
      });

      return appointment;
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw e;
      }
      throw new Error((e as Error).message);
    }
  }

  /**
   * Updates appointment, checking if the user and the appointment requested exist
   * @param data The appointment's data o update
   * @param userId The id of the user that will be the associated with the appointment
   * @returns The appointment updated or an error if the user doesn't exist or the some values in the data are invalid
   */
  async update(data: Appointment, appointmentId: string): Promise<Appointment> {
    try {
      const user = await db.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (data.id !== appointmentId) {
        throw new Error('Appointments ids do not match');
      }

      const appointmentToUpdate = await db.appointment.findUnique({
        where: { id: appointmentId },
      });

      if (!appointmentToUpdate) {
        throw new NotFoundError('Appointment not found');
      }

      const { id, ...appointmentData } = data;

      const appointment = await db.appointment.update({
        where: { id },
        data: appointmentData,
      });

      return appointment;
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw e;
      }
      throw new Error((e as Error).message);
    }
  }

  /**
   * Deletes an appointment by its id
   * @param id The id of the appoitnment to be deleted
   * @returns A promise that resolves to true if the appointment was deleted or throws an error if it wasn't
   */
  async delete(id: string): Promise<true> {
    try {
      const appointment = await db.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      await db.appointment.delete({
        where: { id },
      });

      return true;
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw e;
      }
      throw new Error((e as Error).message);
    }
  }

  /**
   * Checks if the given slot is available, that means that there is no appointment that overlaps with the given slot
   * @param appointment The appointment with the start and end hours to be checked
   * @returns A promise containing true if the slot is available or false if it isn't, or throws an error if there was an error while checking
   */
  async checkForAvailability(
    appointment: CreateAppointmentDto
  ): Promise<boolean> {
    try {
      const result = await db.appointment.findMany({
        where: {
          AND: [
            {
              startAt: { lte: appointment.endAt },
              endAt: { gte: appointment.startAt },
            },
          ],
        },
      });

      return result.length === 0;
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw e;
      }
      throw new Error((e as Error).message);
    }
  }
}

const appointmentService = new AppointmentsService();

export default appointmentService;

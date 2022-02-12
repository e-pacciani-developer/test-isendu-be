import { Appointment } from '@prisma/client';
import { GetAppointmentsDto, Role } from '../models';
import { db } from '../db';

export class AppointmentsRepository {
  public db = db;

  async getAll(
    page: number,
    limit: number,
    role: Role,
    userId: string
  ): Promise<GetAppointmentsDto> {
    // The adminisrator can see all the appointments so we don't need to filter by userId
    const where = role === Role.ADMIN ? {} : { userId };

    // Query with pagination
    const qry = this.db.appointment.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { user: true },
      orderBy: { startAt: 'asc' },
      where,
    });

    // Count query
    const countQry = this.db.appointment.count();

    try {
      // Fetching data
      const data = await qry;
      const count = await countQry;

      // Calculating hasMore
      const hasMore = count > page * limit;

      return { data, hasMore };
    } catch (e) {
      console.error(e);
      throw new Error('Error while getting all appointments');
    }
  }

  async create(data: Appointment, userId: string): Promise<Appointment> {
    if (data.userId !== userId) {
      throw new Error('UserId does not match');
    }

    try {
      const user = await this.db.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const appointment = await this.db.appointment.create({
        data,
      });

      return appointment;
    } catch (e) {
      console.error(e);
      throw new Error('Error while creating new appointment');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const appointment = await this.db.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      await this.db.appointment.delete({
        where: { id },
      });

      return true;
    } catch (e) {
      throw new Error('Error while deleting appointment');
    }
  }

  async checkForAvailability(appointment: Appointment): Promise<boolean> {
    try {
      const result = await this.db.appointment.findMany({
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
      console.error(e);
      throw new Error('Error while checking for availability');
    }
  }
}

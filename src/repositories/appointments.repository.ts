import { Appointment } from '@prisma/client';
import { db } from '../db';

export class AppointmentsRepository {
  public db = db;

  async getAll(): Promise<Appointment[]> {
    try {
      const result = await this.db.appointment.findMany();
      return result;
    } catch (e) {
      throw new Error('Error while getting all appointments');
    }
  }

  async create(data: Appointment): Promise<Appointment> {
    try {
      const result = await this.db.appointment.create({ data });
      return result;
    } catch (e) {
      throw new Error('Error while creating new appointment');
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
      throw new Error('Error while checking for availability');
    }
  }
}

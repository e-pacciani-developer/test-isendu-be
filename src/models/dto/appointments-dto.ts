import { Appointment } from '@prisma/client';

export interface GetAppointmentsDto {
  data: Appointment[];
  hasMore: boolean;
}

export type CreateAppointmentDto = Omit<Appointment, 'id'>;

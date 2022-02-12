import { Appointment } from '@prisma/client';

export interface GetAppointmentsDto {
  data: Appointment[];
  hasMore: boolean;
}

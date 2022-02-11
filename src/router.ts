import { Application } from 'express';
import { appointmentsRouter, usersRouter } from './routes';

export function buildRoutes(app: Application): void {
  app.use('/api/appointments', appointmentsRouter);
  app.use('/api/users', usersRouter);
}

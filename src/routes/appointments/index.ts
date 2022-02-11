import { validateBody } from '../../middlewares';
import { AppointmentSchema } from '../../types';
import express from 'express';
import { AppointmentsController } from '../../controllers/appointments.controller';

export const appointmentsRouter = express.Router();

appointmentsRouter.get('/', AppointmentsController.getAll);
// appointmentsRouter.get('/:id', AppointmentsController.getSingle);
appointmentsRouter.post(
  '/',
  validateBody(AppointmentSchema),
  AppointmentsController.create
);

// appointmentsRouter.put(
//   '/:id',
//   validate(AppointmentSchema),
//   AppointmentsController.update
// );
// appointmentsRouter.delete('/:id', AppointmentsController.remove);

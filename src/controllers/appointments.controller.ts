import { Appointment } from '@prisma/client';
import appoinmentService from '../services/appointments.service';
import { sendError } from '../helpers/response-helpers';
import {
  DeleteRequest,
  GetAppointmentsDto,
  GetRequest,
  PostRequest,
  Role,
  TResponse,
} from '../models';

export const AppointmentsController = {
  getAll,
  create,
  remove,
};

async function getAll(
  req: GetRequest<
    undefined,
    { page: number; limit: number; role: string; userId: string }
  >,
  res: TResponse<GetAppointmentsDto>
): Promise<TResponse<GetAppointmentsDto>> {
  try {
    // Here we pass the role and the userId as query params but tipically
    // they would be passed in the JWT token for security reasons
    const {
      page = 1,
      limit = Number.MAX_VALUE,
      role = Role.USER,
      userId,
    } = req.query;

    // the cast is safe becouse the query params are validated before
    const response = await appoinmentService.getAll(
      Number(page),
      Number(limit),
      role as Role,
      userId
    );

    return res.send(response);
  } catch (e) {
    return sendError(res, e);
  }
}

/**
 * Checks if the asked slot is available, if so creates a new appointment else returns an error
 * @param req Appointment data
 * @param res Generated appointment
 * @returns The response with the generated appointment if slot is available, an error otherwise
 */
async function create(
  req: PostRequest<Appointment, { userId: string }>,
  res: TResponse<Appointment>
): Promise<TResponse<Appointment>> {
  const appointment = req.body;
  const { userId } = req.params;

  try {
    const slotIsAvailable = await appoinmentService.checkForAvailability(
      appointment
    );

    if (slotIsAvailable) {
      const newItem = await appoinmentService.create(appointment, userId);

      return res.send(newItem);
    }

    return sendError(
      res,
      new Error(
        'The slot you selected is not available, please select another hour'
      )
    );
  } catch (e) {
    console.error(e);
    return sendError(res, e);
  }
}

async function remove(
  req: DeleteRequest<{ id: string }>,
  res: TResponse<boolean>
): Promise<TResponse<boolean>> {
  const { id } = req.params;

  try {
    await appoinmentService.delete(id);

    return res.send(true);
  } catch (e) {
    console.error(e);
    return sendError(res, e);
  }
}

import { Appointment } from '@prisma/client';
import appoinmentService from '../services/appointments.service';
import { sendError } from '../helpers/response-helpers';
import {
  CreateAppointmentDto,
  DeleteRequest,
  GetAppointmentsDto,
  GetRequest,
  PostRequest,
  PutRequest,
  Role,
  TResponse,
} from '../models';

export const AppointmentsController = {
  getAll,
  create,
  remove,
};

/**
 * Retrives the list of appointments filtered by the given parameters. If page of limit is not provided, it will return all the appointments
 * @param req The request with the filters, page and limit for pagination implementation,
 *  role and userId for filtering the appointments (the user can only see his own appointments)
 * @param res The response object containing the list of appointments and a flag "hasMore" to indicate if there are more appointments to be loaded
 * @returns A list of appointments filtered by the given parameters and a flag "hasMore" to indicate if there are more appointments to be loaded
 */
async function getAll(
  req: GetRequest<
    undefined,
    { page: number; limit: number; role: Role; userId: string }
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

    // the cast is safe because the query params are validated before reaching this point
    const response = await appoinmentService.getAll(
      Number(page),
      Number(limit),
      role as Role,
      userId
    );

    return res.send(response);
  } catch (e) {
    return sendError(res, e as Error);
  }
}

/**
 * Checks if the asked slot is available, if so creates a new appointment else returns an error
 * @param req The request with the appointment data and as path param the id of the user that will be the associated with the appointment
 * @param res The response object containing the created appointment or a BadRequest error if the slot is not available
 * @returns The response with the generated appointment if slot is available, an error otherwise
 */
async function create(
  req: PostRequest<CreateAppointmentDto, { userId: string }>,
  res: TResponse<Appointment>
): Promise<TResponse<Appointment>> {
  const appointment = req.body;
  const { userId } = req.params;

  try {
    // Check if the asked slot is available
    const slotIsAvailable = await appoinmentService.checkForAvailability(
      appointment
    );

    // If the slot is not available,return an error
    if (!slotIsAvailable) {
      return sendError(
        res,
        new Error(
          'The slot you selected is not available, please select another time'
        )
      );
    }

    // Create and return the new appointment
    const newAppointment = await appoinmentService.create(appointment, userId);

    return res.send(newAppointment);
  } catch (e) {
    console.error(e);
    return sendError(res, e as Error);
  }
}

/**
 * Deletes an appointment by the given id
 * @param req The request with the id of the appointment to be deleted
 * @param res The resonse object containing true if the appointment was deleted or a BadRequest error if it was not
 * @returns True if the appointment was deleted, a BadRequest error if it was not
 */
async function remove(
  req: DeleteRequest<{ id: string }>,
  res: TResponse<true>
): Promise<TResponse<true>> {
  const { id } = req.params;

  try {
    await appoinmentService.delete(id);

    return res.send(true);
  } catch (e) {
    console.error(e);
    return sendError(res, e as Error);
  }
}

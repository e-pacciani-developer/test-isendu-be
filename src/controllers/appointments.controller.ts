import { Appointment } from '@prisma/client';
import { appointmentsRepository as repository } from '../repositories/repositories';
import { sendError } from '../helpers/response-helpers';
import { GetRequest, PostRequest, TResponse } from '../types';

export const AppointmentsController = {
  getAll,
  // getSingle,
  // update,
  create,
  // remove,
};

async function getAll(
  req: GetRequest,
  res: TResponse<Appointment[]>
): Promise<TResponse<Appointment[]>> {
  try {
    const items = await repository.getAll();

    return res.send(items);
  } catch (e) {
    return sendError(res, e);
  }
}

// async function getSingle(
//   req: GetRequest<{ id: string }>,
//   res: TResponse<Appointment>
// ): Promise<TResponse<Appointment>> {
//   const { id } = req.params;

//   try {
//     const item = await repository.getDoc(id);

//     return res.send(item);
//   } catch (e) {
//     return sendError(res, e);
//   }
// }

// async function update(
//   req: PutRequest<Appointment, { id: string }>,
//   res: TResponse<Appointment>
// ): Promise<TResponse<Appointment>> {
//   const { id } = req.params;

//   const todo = req.body;

//   try {
//     const updatedItem = await repository.update(id, todo);

//     return res.send(updatedItem);
//   } catch (e) {
//     return sendError(res, e);
//   }
// }

/**
 * Checks if the asked slot is available, if so creates a new appointment else returns an error
 * @param req Appointment data
 * @param res Generated appointment
 * @returns The response with the generated appointment if slot is available, an error otherwise
 */
async function create(
  req: PostRequest<Appointment>,
  res: TResponse<Appointment>
): Promise<TResponse<Appointment>> {
  const appointment = req.body;

  try {
    const slotIsAvailable = await repository.checkForAvailability(appointment);

    if (slotIsAvailable) {
      const newItem = await repository.create(appointment);

      return res.send(newItem);
    }

    return sendError(res, new Error('Slot is not available'));
  } catch (e) {
    // TODO Log error
    return sendError(res, e);
  }
}

// async function remove(
//   req: DeleteRequest<{ id: string }>,
//   res: TResponse<boolean>
// ): Promise<TResponse<boolean>> {
//   const { id } = req.params;

//   try {
//     await repository.delete(id);

//     return res.send(true);
//   } catch (e) {
//     return sendError(res, e);
//   }
// }

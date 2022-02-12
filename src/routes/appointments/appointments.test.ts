import { User } from '@prisma/client';
import { app } from '../../app';
import supertest from 'supertest';

describe('Appointments API', () => {
  it('Testing to see if Jest works', () => {
    expect(1).toBe(1);
  });

  test('Should return all the appointments', async () => {
    const limit = 10;
    const response = await supertest(app).get(
      `/api/appointments?page=1&limit=${limit}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body.data.length).toBeLessThanOrEqual(limit);
    expect(response.body.data[0]).toEqual(
      //   expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        startAt: expect.any(String),
        endAt: expect.any(String),
        description: expect.any(String),
        userId: expect.any(String),
        user: {
          id: expect.any(String),
          name: expect.any(String),
        },
      })
      //   ])
    );
  }, 300000);
});

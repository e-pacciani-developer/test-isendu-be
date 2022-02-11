import { app } from '../../app';
import supertest from 'supertest';

describe('Appointments API', () => {
  it('Testing to see if Jest works', () => {
    expect(1).toBe(1);
  });

  test('Should return all the appointments', async () => {
    const response = await supertest(app).get('/api/appointments');
    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body[0]).toEqual(
      //   expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(String),
        startAt: expect.any(Date),
        endAt: expect.any(String),
        description: expect.any(String),
      })
      //   ])
    );
  }, 300000);
});

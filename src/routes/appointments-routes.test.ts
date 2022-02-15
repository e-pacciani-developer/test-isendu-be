import { app } from '../app';
import supertest from 'supertest';

describe('Appointments routes', () => {
  it('Should check if the GET / query params are correctly formatted', async () => {
    const query = {
      page: 'a',
      limit: 'b',
    };

    expect(
      supertest(app).get('/api/appointments').query(query)
    ).resolves.toHaveProperty('status', 400);
  });

  it('Should throw an error if the schema is not correct', async () => {
    const data = {
      endAt: 'abc', // Wrong type
      notes: '',
      userId: '6206a047714387b96ee2af7f',
      type: 'Teeth Cleaning',
      startAt: '2020-02-15T20:00:00.000+00:00',
    };

    expect(
      supertest(app).post('/api/appointments').send(data)
    ).resolves.toHaveProperty('status', 415);
  });

  it('Should throw an error if the id param is not a valid uuid', async () => {
    const id = 'abc';

    expect(
      supertest(app).delete(`/api/appointments/${id}`)
    ).resolves.toHaveProperty('status', 400);
  });
});

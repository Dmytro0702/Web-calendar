import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/index';

const app = createApp();

describe('Calendars API', () => {
  it('GET /api/calendars returns []', async () => {
    const res = await request(app).get('/api/calendars');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/calendars creates calendar', async () => {
    const res = await request(app)
      .post('/api/calendars')
      .send({ name: 'Default', color: '#22c55e' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Default');
  });
});

import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/index';

const app = createApp();

describe('Events API', () => {
  it('GET /api/events returns []', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/events creates event', async () => {
    const payload = { title: 'Test', date: '2025-01-01', startTime: '09:00', endTime: '10:00' };
    const res = await request(app).post('/api/events').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test');
  });
});

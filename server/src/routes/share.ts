import { Router } from 'express';

import { db } from '../db/memory.js';

const share = Router();

/**
 * POST /api/share/event
 * body: { eventId: string }
 * Ответ: { url: string }
 */
share.post('/event', (req, res) => {
  const userId = req.userId!;
  const { eventId } = req.body ?? {};
  if (!eventId) return res.status(400).json({ error: 'eventId is required' });

  const exists = db
    .listEvents(userId, { from: '0000-01-01', to: '9999-12-31' })
    .some((e) => e.id === eventId);
  if (!exists) return res.status(404).json({ error: 'Event not found' });

  // Заглушка токена/линка
  const token = Buffer.from(`${userId}:${eventId}`).toString('base64url');
  const url = `${req.protocol}://${req.get('host')}/share/${token}`;
  res.json({ url });
});

export default share;

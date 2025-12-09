import { Router } from 'express';

import { db } from '../db/memory.js';

const events = Router();

// GET /api/events?from=YYYY-MM-DD&to=YYYY-MM-DD&calendarIds=a,b
events.get('/', (req, res) => {
  const userId = req.userId!;
  const { from, to, calendarIds } = req.query as {
    from?: string;
    to?: string;
    calendarIds?: string;
  };
  if (!from || !to) return res.status(400).json({ error: 'from and to are required' });
  const ids = calendarIds ? calendarIds.split(',').filter(Boolean) : undefined;
  const data = db.listEvents(userId, { from, to, calendarIds: ids });
  res.json(data);
});

// POST /api/events
events.post('/', (req, res) => {
  const userId = req.userId!;
  const body = req.body ?? {};
  const required = ['title', 'date', 'startTime', 'endTime', 'calendarId'] as const;
  for (const k of required) {
    if (!body[k]) return res.status(400).json({ error: `Field ${k} is required` });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date))
    return res.status(400).json({ error: 'Invalid date' });
  if (!/^\d{2}:\d{2}$/.test(body.startTime) || !/^\d{2}:\d{2}$/.test(body.endTime)) {
    return res.status(400).json({ error: 'Invalid time format' });
  }

  const created = db.createEvent(userId, {
    id: 'tmp', // перезапишется в db
    ownerId: userId,
    title: body.title,
    description: body.description,
    date: body.date,
    startTime: body.startTime,
    endTime: body.endTime,
    allDay: !!body.allDay,
    recurrence: body.recurrence,
    calendarId: body.calendarId,
    color: body.color,
    createdAt: '',
    updatedAt: '',
  } as any);

  res.status(201).json(created);
});

// PATCH /api/events/:id
events.patch('/:id', (req, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const patch = req.body ?? {};
  if (patch.date && !/^\d{4}-\d{2}-\d{2}$/.test(patch.date)) {
    return res.status(400).json({ error: 'Invalid date' });
  }
  if (patch.startTime && !/^\d{2}:\d{2}$/.test(patch.startTime)) {
    return res.status(400).json({ error: 'Invalid startTime' });
  }
  if (patch.endTime && !/^\d{2}:\d{2}$/.test(patch.endTime)) {
    return res.status(400).json({ error: 'Invalid endTime' });
  }
  const updated = db.updateEvent(userId, id, patch);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

// DELETE /api/events/:id
events.delete('/:id', (req, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const ok = db.deleteEvent(userId, id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

export default events;

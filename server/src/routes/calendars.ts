import { Router } from 'express';

import { db } from '../db/memory.js';

const calendars = Router();

// GET /api/calendars
calendars.get('/', (req, res) => {
  const userId = req.userId!;
  const data = db.listCalendars(userId);
  res.json(data);
});

// POST /api/calendars
calendars.post('/', (req, res) => {
  const userId = req.userId!;
  const { name, color } = req.body ?? {};
  if (!name || !color || !/^#[0-9a-fA-F]{6}$/.test(color)) {
    return res.status(400).json({ error: 'Invalid payload: name, color(#RRGGBB) required' });
  }
  const created = db.createCalendar(userId, { name, color });
  res.status(201).json(created);
});

// PATCH /api/calendars/:id
calendars.patch('/:id', (req, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { name, color, isVisible } = req.body ?? {};
  if (color && !/^#[0-9a-fA-F]{6}$/.test(color)) {
    return res.status(400).json({ error: 'Invalid color format' });
  }
  const updated = db.updateCalendar(userId, id, { name, color, isVisible });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

// DELETE /api/calendars/:id
calendars.delete('/:id', (req, res) => {
  const userId = req.userId!;
  const { id } = req.params;
  const ok = db.deleteCalendar(userId, id);
  if (!ok) return res.status(400).json({ error: 'Cannot delete (maybe isDefault or not found)' });
  res.status(204).end();
});

export default calendars;


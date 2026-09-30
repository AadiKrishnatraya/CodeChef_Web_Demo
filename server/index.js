import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDb, store } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

initDb();

app.use(cors());
app.use(express.json());

const api = express.Router();

/* ---------------- events ---------------- */

api.get('/events', (req, res) => {
  const events = [...store.getEvents()].sort((a, b) => a.date.localeCompare(b.date));
  res.json(events);
});

api.post('/events', (req, res) => {
  const body = req.body || {};
  if (!body.name?.trim()) return res.status(400).json({ error: 'Event name is required.' });
  if (!body.date) return res.status(400).json({ error: 'Date is required.' });
  if (!body.time?.trim()) return res.status(400).json({ error: 'Time is required.' });
  if (!body.venue?.trim()) return res.status(400).json({ error: 'Venue is required.' });
  if (!body.category?.trim()) return res.status(400).json({ error: 'Category is required.' });

  if (body.featured) {
    const events = store.getEvents().map((e) => ({ ...e, featured: false }));
    store.saveEvents(events);
  }

  const event = {
    id: store.newId('evt'),
    name: body.name.trim(),
    date: body.date,
    time: body.time.trim(),
    venue: body.venue.trim(),
    category: body.category.trim(),
    description: (body.description || '').trim(),
    featured: Boolean(body.featured),
    createdAt: new Date().toISOString(),
  };
  const events = store.getEvents();
  events.push(event);
  store.saveEvents(events);
  res.status(201).json(event);
});

api.put('/events/:id', (req, res) => {
  const events = store.getEvents();
  const idx = events.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Event not found.' });

  const body = req.body || {};
  if (!body.name?.trim()) return res.status(400).json({ error: 'Event name is required.' });
  if (!body.date) return res.status(400).json({ error: 'Date is required.' });
  if (!body.time?.trim()) return res.status(400).json({ error: 'Time is required.' });
  if (!body.venue?.trim()) return res.status(400).json({ error: 'Venue is required.' });
  if (!body.category?.trim()) return res.status(400).json({ error: 'Category is required.' });

  if (body.featured) {
    store.saveEvents(
      events.map((e) => (e.id === req.params.id ? { ...e, featured: true } : { ...e, featured: false })),
    );
  }

  const updated = {
    ...events[idx],
    name: body.name.trim(),
    date: body.date,
    time: body.time.trim(),
    venue: body.venue.trim(),
    category: body.category.trim(),
    description: (body.description || '').trim(),
    featured: Boolean(body.featured),
  };
  const next = store.getEvents().map((e) => (e.id === req.params.id ? updated : e));
  store.saveEvents(next);
  res.json(updated);
});

api.delete('/events/:id', (req, res) => {
  const events = store.getEvents();
  const idx = events.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Event not found.' });

  store.saveEvents(events.filter((e) => e.id !== req.params.id));
  const regs = store.getRegistrations();
  store.saveRegistrations(regs.filter((r) => r.eventId !== req.params.id));
  res.json({ ok: true });
});

/* ---------------- registrations ---------------- */

api.get('/registrations', (req, res) => {
  res.json(store.getRegistrations());
});

api.post('/registrations', (req, res) => {
  const body = req.body || {};
  const { eventId, name, email, collegeYear, phone } = body;

  const events = store.getEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return res.status(400).json({ error: 'Please choose a valid event.' });

  const trimmed = {
    name: (name || '').trim(),
    email: (email || '').trim().toLowerCase(),
    collegeYear: (collegeYear || '').trim(),
    phone: (phone || '').trim(),
  };
  if (!trimmed.name) return res.status(400).json({ error: 'Name is required.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed.email))
    return res.status(400).json({ error: 'A valid email is required.' });
  if (!trimmed.collegeYear) return res.status(400).json({ error: 'College/Year is required.' });
  if (!/^[0-9+\-\s()]{7,15}$/.test(trimmed.phone))
    return res.status(400).json({ error: 'A valid phone number is required.' });

  const dup = store
    .getRegistrations()
    .find((r) => r.eventId === eventId && r.email === trimmed.email);
  if (dup)
    return res
      .status(409)
      .json({ error: 'You are already registered for this event with this email.' });

  const registration = {
    id: store.newId('reg'),
    eventId,
    ...trimmed,
    createdAt: new Date().toISOString(),
  };
  const regs = store.getRegistrations();
  regs.push(registration);
  store.saveRegistrations(regs);
  res.status(201).json(registration);
});

app.use('/api', api);

/* ---------------- static frontend (production) ---------------- */

const dist = path.join(__dirname, '..', 'dist');
if (fs.existsSync(dist)) {
  app.use(
    express.static(dist, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
      },
    }),
  );
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`));

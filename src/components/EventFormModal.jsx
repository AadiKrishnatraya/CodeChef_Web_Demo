import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../lib/api.js';
import { useToast } from '../lib/toast.jsx';

const CATEGORIES = ['Hackathon', 'Contest', 'Workshop', 'Tech Talk', 'Meetup', 'Cultural', 'Seminar'];

const empty = {
  name: '',
  date: '',
  time: '',
  venue: '',
  category: 'Workshop',
  description: '',
  featured: false,
};

export default function EventFormModal({ open, event, onClose }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const isEdit = Boolean(event);

  useEffect(() => {
    if (open) {
      setForm(event ? { ...empty, ...event } : empty);
      setErrors({});
    }
  }, [open, event]);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((errs) => ({ ...errs, [key]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Event name is required.';
    else if (form.name.trim().length < 4) errs.name = 'Give the event a descriptive name (4+ chars).';
    if (!form.date) errs.date = 'Pick a date.';
    if (!form.time.trim()) errs.time = 'Set a start time.';
    if (!form.venue.trim()) errs.venue = 'Venue is required.';
    if (!form.category.trim()) errs.category = 'Choose a category.';
    if (form.description.trim() && form.description.trim().length < 20)
      errs.description = 'Add a little more detail (20+ chars) or leave it empty.';
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setBusy(true);
    try {
      if (isEdit) {
        await api(`/events/${event.id}`, { method: 'PUT', body: form });
        toast.success(`Updated “${form.name}”.`);
      } else {
        await api('/events', { method: 'POST', body: form });
        toast.success(`“${form.name}” is live on the student Events page.`);
      }
      onClose(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      title={isEdit ? 'Edit event' : 'Add a new event'}
      subtitle={isEdit ? event?.name : 'It appears on the student side immediately after saving.'}
      width={620}
    >
      <form className="reg-form" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="ev-name">Event name</label>
          <input
            id="ev-name"
            type="text"
            placeholder="e.g. HackNova 5.0 — 24-Hour Hackathon"
            value={form.name}
            onChange={set('name')}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="ev-date">Date</label>
            <input id="ev-date" type="date" value={form.date} onChange={set('date')} />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>
          <div className="field">
            <label htmlFor="ev-time">Time</label>
            <input
              id="ev-time"
              type="time"
              value={to24h(form.time)}
              onChange={(e) => setForm((f) => ({ ...f, time: to12h(e.target.value) }))}
            />
            {errors.time && <span className="field-error">{errors.time}</span>}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="ev-venue">Venue</label>
            <input
              id="ev-venue"
              type="text"
              placeholder="e.g. Seminar Hall 2, IT Block"
              value={form.venue}
              onChange={set('venue')}
            />
            {errors.venue && <span className="field-error">{errors.venue}</span>}
          </div>
          <div className="field">
            <label htmlFor="ev-cat">Category</label>
            <select id="ev-cat" className="select" value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <span className="field-error">{errors.category}</span>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="ev-desc">Description</label>
          <textarea
            id="ev-desc"
            rows={4}
            placeholder="What's the plan? Prizes, format, what to bring…"
            value={form.description}
            onChange={set('description')}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <label className="check-row" htmlFor="ev-featured">
          <input
            id="ev-featured"
            type="checkbox"
            checked={form.featured}
            onChange={set('featured')}
          />
          <span>
            <strong>Feature this event</strong>
            <em>Show it big on the home page. Only one event can be featured at a time.</em>
          </span>
        </label>

        <div className="reg-actions">
          <button type="button" className="btn btn-ghost" onClick={() => onClose(false)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create event'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* time helpers: keep stored value human-friendly ("6:30 PM"), but drive the
   native time input with a 24h value */
function to24h(t) {
  if (!t) return '';
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(t.trim());
  if (!m) return '';
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ap = m[3]?.toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${min}`;
}

function to12h(v) {
  if (!v) return '';
  const [hStr, min] = v.split(':');
  let h = parseInt(hStr, 10);
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${min} ${ap}`;
}

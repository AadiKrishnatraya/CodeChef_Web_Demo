import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal.jsx';
import { api } from '../lib/api.js';
import { useToast } from '../lib/toast.jsx';

const initialForm = { name: '', email: '', collegeYear: '', phone: '' };

export default function RegistrationModal({ event, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  if (!event) return null;

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((errs) => ({ ...errs, [key]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your full name.';
    else if (form.name.trim().length < 3) errs.name = 'Name must be at least 3 characters.';

    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      errs.email = 'Enter a valid email like you@campus.edu.';

    if (!form.collegeYear.trim()) errs.collegeYear = 'College / Year is required.';
    else if (form.collegeYear.trim().length < 2) errs.collegeYear = 'This looks too short.';

    if (!form.phone.trim()) errs.phone = 'Phone number is required.';
    else if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone.trim()))
      errs.phone = 'Enter a valid phone number (7–15 digits).';

    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const reg = await api('/registrations', { method: 'POST', body: { ...form, eventId: event.id } });
      setSuccess(reg);
      toast.success(`You're in! Registered for ${event.name}.`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const closeAll = () => {
    onClose();
    if (success) navigate('/events');
  };

  return (
    <Modal
      open
      onClose={success ? closeAll : onClose}
      width={600}
      title={success ? undefined : 'Event registration'}
      subtitle={success ? undefined : event?.name}
    >
      {success ? (
        <div className="reg-success">
          <div className="reg-check">
            <svg viewBox="0 0 52 52" width="64" height="64" aria-hidden="true">
              <circle className="check-circle" cx="26" cy="26" r="24" fill="none" />
              <path className="check-mark" fill="none" d="M14 27l8 8 16-16" />
            </svg>
          </div>
          <h4>Registration confirmed!</h4>
          <p>
            <strong>{success.name}</strong>, your spot for <strong>{event.name}</strong> is locked in.
            A confirmation will land at <strong>{success.email}</strong>.
          </p>
          <div className="reg-summary">
            <div>
              <span>Event</span>
              <strong>{event.name}</strong>
            </div>
            <div>
              <span>Venue</span>
              <strong>{event.venue}</strong>
            </div>
          </div>
          <button className="btn btn-primary" onClick={closeAll}>
            Done
          </button>
        </div>
      ) : (
        <form className="reg-form" onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="reg-name">Name</label>
            <input
              id="reg-name"
              type="text"
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={set('name')}
              autoComplete="name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              placeholder="you@campus.edu"
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="reg-year">College / Year</label>
              <input
                id="reg-year"
                type="text"
                placeholder="e.g. CSE — 2nd Year"
                value={form.collegeYear}
                onChange={set('collegeYear')}
              />
              {errors.collegeYear && <span className="field-error">{errors.collegeYear}</span>}
            </div>

            <div className="field">
              <label htmlFor="reg-phone">Phone number</label>
              <input
                id="reg-phone"
                type="tel"
                placeholder="10-digit mobile"
                value={form.phone}
                onChange={set('phone')}
                autoComplete="tel"
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="reg-foot">
            <p className="muted small">
              Registering as <strong>{event.name}</strong> · {event.venue}
            </p>
            <div className="reg-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit registration'}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}

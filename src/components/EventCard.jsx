import { CalendarDays, MapPin, Clock, Tag } from 'lucide-react';
import { formatDate, daysUntil } from '../lib/api.js';

const CATEGORY_STYLES = {
  Hackathon: 'cat-hackathon',
  Contest: 'cat-contest',
  Workshop: 'cat-workshop',
  'Tech Talk': 'cat-talk',
  Meetup: 'cat-meetup',
  Cultural: 'cat-cultural',
  Seminar: 'cat-talk',
};

export default function EventCard({ event, onRegister, compact = false }) {
  const days = daysUntil(event.date);
  const isPast = days < 0;
  const isSoon = days >= 0 && days <= 3;

  return (
    <article
      className={`event-card ${compact ? 'event-card-compact' : ''} ${event.featured ? 'is-featured' : ''}`}
    >
      <div className="event-card-top">
        <span className={`cat-chip ${CATEGORY_STYLES[event.category] || 'cat-meetup'}`}>
          <Tag size={12} />
          {event.category}
        </span>
        <span className={`event-when ${isPast ? 'when-past' : isSoon ? 'when-soon' : ''}`}>
          {isPast ? 'Past event' : days === 0 ? 'Today' : `In ${days} day${days === 1 ? '' : 's'}`}
        </span>
      </div>

      <h3 className="event-name">{event.name}</h3>

      <ul className="event-meta">
        <li>
          <CalendarDays size={15} />
          {formatDate(event.date)} · {event.time}
        </li>
        <li>
          <MapPin size={15} />
          {event.venue}
        </li>
      </ul>

      {!compact && <p className="event-desc">{event.description}</p>}

      <div className="event-card-foot">
        <span className="event-date-tile">
          <span className="tile-month">
            {new Date(`${event.date}T00:00:00`).toLocaleString('en-IN', { month: 'short' }).toUpperCase()}
          </span>
          <span className="tile-day">{String(new Date(`${event.date}T00:00:00`).getDate()).padStart(2, '0')}</span>
        </span>
        <button className="btn btn-primary btn-sm" onClick={() => onRegister(event)} disabled={isPast}>
          {isPast ? 'Registrations closed' : 'Register →'}
        </button>
      </div>
    </article>
  );
}

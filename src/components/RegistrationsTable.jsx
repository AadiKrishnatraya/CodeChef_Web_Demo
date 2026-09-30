import { formatDateTime } from '../lib/api.js';
import { useEvents } from '../lib/events.jsx';

export default function RegistrationsTable({ registrations, emptyMessage }) {
  const { byId } = useEvents();

  if (!registrations.length) {
    return <div className="empty-note">{emptyMessage || 'No registrations found.'}</div>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th>College / Year</th>
            <th>Phone</th>
            <th>Event</th>
            <th>Registered on</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((r) => {
            const event = r.eventId ? byId(r.eventId) : null;
            return (
              <tr key={r.id}>
                <td className="td-strong">{r.name}</td>
                <td className="td-mono">{r.email}</td>
                <td>{r.collegeYear}</td>
                <td className="td-mono">{r.phone}</td>
                <td>{event ? event.name : <span className="muted">Event removed</span>}</td>
                <td className="td-mono">{formatDateTime(r.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

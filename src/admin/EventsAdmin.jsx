import { CalendarPlus, Pencil, Star, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import Modal from '../components/Modal.jsx';

export default function EventsAdmin({ events, regCounts, onAdd, onEdit, onDelete, deleting, deleteBusy, onCloseDelete, onConfirmDelete }) {
  const sorted = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [events]);

  return (
    <section className="dash-panel">
      <div className="dash-toolbar">
        <h2>Events</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>
          <CalendarPlus size={15} /> Add event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="empty-note">
          <p>No events yet. Add your first one — it appears on the student Events page instantly.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date &amp; time</th>
                <th>Venue</th>
                <th>Category</th>
                <th>Regs</th>
                <th>Status</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e) => {
                const isUpcoming = new Date(`${e.date}T23:59:59`) >= new Date();
                return (
                  <tr key={e.id}>
                    <td className="td-strong">
                      {e.name}
                      {e.featured && <span className="mini-flag"><Star size={10} /> featured</span>}
                    </td>
                    <td className="td-mono">{e.date} · {e.time}</td>
                    <td>{e.venue}</td>
                    <td><span className="mini-cat">{e.category}</span></td>
                    <td className="td-mono">{regCounts[e.id] || 0}</td>
                    <td>
                      <span className={`status-pill ${isUpcoming ? 'status-up' : 'status-past'}`}>
                        {isUpcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </td>
                    <td className="td-actions">
                      <button className="icon-btn" onClick={() => onEdit(e)} aria-label={`Edit ${e.name}`}>
                        <Pencil size={15} />
                      </button>
                      <button className="icon-btn icon-danger" onClick={() => onDelete(e)} aria-label={`Delete ${e.name}`}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!deleting} onClose={onCloseDelete} title="Delete this event?" width={480}>
        <div className="delete-body">
          <p>
            <strong>“{deleting?.name}”</strong> will be removed from the student site, and its{' '}
            <strong>{deleting ? regCounts[deleting.id] || 0 : 0}</strong> registration(s) will be deleted too.
            This cannot be undone.
          </p>
          <div className="reg-actions">
            <button className="btn btn-ghost" onClick={onCloseDelete}>Cancel</button>
            <button className="btn btn-danger" onClick={onConfirmDelete} disabled={deleteBusy}>
              {deleteBusy ? 'Deleting…' : 'Yes, delete event'}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

import { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { formatDateTime } from '../lib/api.js';
import { useEvents } from '../lib/events.jsx';
import RegistrationsTable from './RegistrationsTable.jsx';
import Spinner from './Spinner.jsx';

export default function RegistrationsPanel({ regs, loading, error, onRetry }) {
  const [query, setQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const { byId, events } = useEvents();

  const filtered = useMemo(() => {
    if (!regs) return [];
    const q = query.trim().toLowerCase();
    return regs
      .filter((r) => {
        const matchesQuery = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
        const matchesEvent = eventFilter === 'all' || r.eventId === eventFilter;
        return matchesQuery && matchesEvent;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [regs, query, eventFilter]);

  const exportCsv = () => {
    if (!filtered.length) return;
    const rows = [
      ['Name', 'Email', 'College/Year', 'Phone', 'Event', 'Registered on'],
      ...filtered.map((r) => [
        r.name,
        r.email,
        r.collegeYear,
        r.phone,
        byId(r.eventId)?.name || 'Event removed',
        formatDateTime(r.createdAt),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codechef-club-registrations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="dash-panel">
      <div className="dash-toolbar">
        <h2>Registered students</h2>
        <button className="btn btn-outline btn-sm" onClick={exportCsv} disabled={!filtered.length}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search by student name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search registrations"
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              ×
            </button>
          )}
        </div>
        <select
          className="select select-grow"
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          aria-label="Filter by event"
        >
          <option value="all">All events</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      <p className="results-count muted">
        {loading
          ? 'Loading…'
          : `${filtered.length} of ${regs?.length ?? 0} registration${(regs?.length ?? 0) === 1 ? '' : 's'}`}
      </p>

      {loading ? (
        <Spinner label="Loading registrations…" />
      ) : error ? (
        <div className="empty-note">
          Couldn't load registrations. <button className="link-btn" onClick={onRetry}>Retry</button>
        </div>
      ) : (
        <RegistrationsTable
          registrations={filtered}
          emptyMessage={
            regs?.length === 0
              ? 'No registrations yet. They will appear here as students sign up.'
              : 'No registrations match your search or filter.'
          }
        />
      )}
    </section>
  );
}

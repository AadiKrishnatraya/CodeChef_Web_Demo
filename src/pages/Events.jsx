import { useEffect, useMemo, useState } from 'react';
import { CalendarSearch, Search, SlidersHorizontal } from 'lucide-react';
import { useEvents } from '../lib/events.jsx';
import EventCard from '../components/EventCard.jsx';
import RegistrationModal from '../components/RegistrationModal.jsx';
import Spinner from '../components/Spinner.jsx';

export default function Events() {
  const { events, upcoming, past, loading, error, reload } = useEvents();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [showPast, setShowPast] = useState(false);
  const [regEvent, setRegEvent] = useState(null);

  useEffect(() => {
    document.title = 'Events · CodeChef Club';
  }, []);

  const categories = useMemo(
    () => ['All', ...[...new Set(events.map((e) => e.category))].sort()],
    [events],
  );

  const base = showPast ? past() : upcoming();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return base.filter((e) => {
      const matchesQuery = !q || e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q);
      const matchesCategory = category === 'All' || e.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [base, query, category]);

  const clearAll = () => {
    setQuery('');
    setCategory('All');
  };

  return (
    <div className="page-fade section page-pad-top">
      <div className="container">
        <div className="page-head">
          <span className="section-kicker">// the board</span>
          <h1 className="page-title">Events</h1>
          <p className="page-sub">
            Everything the club is running this semester. Search, filter, and grab a seat — most
            workshops cap out fast.
          </p>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search events by name or venue…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search events"
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                ×
              </button>
            )}
          </div>

          <div className="filter-scroll">
            <SlidersHorizontal size={15} className="filter-icon" />
            {categories.map((c) => (
              <button
                key={c}
                className={`chip ${category === c ? 'chip-active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            className={`chip chip-toggle ${showPast ? 'chip-active' : ''}`}
            onClick={() => setShowPast((s) => !s)}
          >
            {showPast ? 'Showing past' : 'Show past events'}
          </button>
        </div>

        <p className="results-count muted">
          {loading ? 'Loading…' : `${filtered.length} event${filtered.length === 1 ? '' : 's'} ${showPast ? 'in archive' : 'upcoming'}`}
        </p>

        {loading ? (
          <Spinner label="Loading events…" />
        ) : error ? (
          <div className="empty-note">
            Couldn't load events. <button className="link-btn" onClick={() => reload()}>Retry</button>
          </div>
        ) : filtered.length ? (
          <div className="cards-grid">
            {filtered.map((ev) => (
              <EventCard key={ev.id} event={ev} onRegister={setRegEvent} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="empty-note">
            <CalendarSearch size={28} />
            <p>No events published yet. Check back soon — or if you're the admin, add one from the dashboard.</p>
          </div>
        ) : (
          <div className="empty-note">
            <Search size={28} />
            <p>
              No events match {query && <>“<strong>{query}</strong>”{category !== 'All' && ' in'}</>}
              {category !== 'All' && <> <strong>{category}</strong></>}. Try a different search or category.
            </p>
            <button className="btn btn-outline btn-sm" onClick={clearAll}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      <RegistrationModal event={regEvent} onClose={() => setRegEvent(null)} />
    </div>
  );
}

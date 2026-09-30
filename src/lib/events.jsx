import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

const EventsContext = createContext(null);

const sortByProximity = (events) =>
  [...events].sort((a, b) => {
    const da = new Date(`${a.date}T00:00:00`);
    const db = new Date(`${b.date}T00:00:00`);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return (Math.abs(da - now) || 0) - (Math.abs(db - now) || 0);
  });

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const list = await api('/events');
      setEvents(list);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({
      events,
      loading,
      error,
      reload: load,
      upcoming: () => sortByProximity(events).filter((e) => new Date(`${e.date}T23:59:59`) >= new Date()),
      past: () => sortByProximity(events).filter((e) => new Date(`${e.date}T23:59:59`) < new Date()),
      byId: (id) => events.find((e) => e.id === id) || null,
    }),
    [events, loading, error, load],
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used within EventsProvider');
  return ctx;
}

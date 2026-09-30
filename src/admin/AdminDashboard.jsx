import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../lib/auth.js';
import { useEvents } from '../lib/events.jsx';
import { useToast } from '../lib/toast.jsx';
import AdminShell from './AdminShell.jsx';
import StatsGrid from './StatsGrid.jsx';
import EventsAdmin from './EventsAdmin.jsx';
import RegistrationsPanel from '../components/RegistrationsPanel.jsx';
import EventFormModal from '../components/EventFormModal.jsx';
import Spinner from '../components/Spinner.jsx';

export default function AdminDashboardNew() {
  const { admin, logout } = useAuth();
  const { events, loading, error, reload, upcoming } = useEvents();
  const toast = useToast();

  const [tab, setTab] = useState('events');
  const [regs, setRegs] = useState(null);
  const [regsError, setRegsError] = useState(null);
  const [regLoading, setRegLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const loadRegs = async (silent = false) => {
    if (!silent) setRegLoading(true);
    try {
      const list = await api('/registrations');
      setRegs(list);
      setRegsError(null);
    } catch (e) {
      setRegsError(e.message);
    } finally {
      setRegLoading(false);
    }
  };

  useEffect(() => {
    loadRegs();
  }, []);

  const regCounts = useMemo(() => {
    const map = {};
    regs?.forEach((r) => {
      map[r.eventId] = (map[r.eventId] || 0) + 1;
    });
    return map;
  }, [regs]);

  const openForm = (event = null) => {
    setEditing(event);
    setFormOpen(true);
  };

  const closeForm = (didSave) => {
    setFormOpen(false);
    setEditing(null);
    if (didSave) {
      reload();
      loadRegs(true);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api(`/events/${deleting.id}`, { method: 'DELETE' });
      toast.success(`Deleted “${deleting.name}” and its registrations.`);
      setDeleting(null);
      reload();
      loadRegs(true);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) {
    return (
      <div className="page-fade section page-pad-top">
        <div className="container">
          <Spinner label="Loading dashboard…" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-fade section page-pad-top">
        <div className="container">
          <div className="empty-note">
            Couldn't load the dashboard. <button className="link-btn" onClick={() => reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminShell admin={admin} onLogout={logout} tab={tab} onTab={setTab}>
      <StatsGrid
        events={events}
        upcomingCount={upcoming().length}
        totalRegs={regs?.length ?? 0}
        featuredCount={events.filter((e) => e.featured).length}
      />

      {tab === 'events' ? (
        <EventsAdmin
          events={events}
          regCounts={regCounts}
          onAdd={() => openForm(null)}
          onEdit={openForm}
          onDelete={(e) => setDeleting(e)}
          deleting={deleting}
          deleteBusy={deleteBusy}
          onCloseDelete={() => setDeleting(null)}
          onConfirmDelete={confirmDelete}
        />
      ) : (
        <RegistrationsPanel regs={regs} loading={regLoading} error={regsError} onRetry={loadRegs} />
      )}

      <EventFormModal open={formOpen} event={editing} onClose={closeForm} />
    </AdminShell>
  );
}

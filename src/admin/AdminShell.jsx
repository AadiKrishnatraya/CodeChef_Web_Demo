import { Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, Users } from 'lucide-react';

export default function AdminShell({ admin, onLogout, tab, onTab, children }) {
  const tabs = [
    { id: 'events', label: 'Manage events', icon: LayoutDashboard },
    { id: 'regs', label: 'Registered students', icon: Users },
  ];

  return (
    <div className="page-fade section page-pad-top">
      <div className="container">
        <div className="dash-head">
          <div>
            <span className="section-kicker">// control room</span>
            <h1 className="page-title">Admin dashboard</h1>
            <p className="page-sub">
              Signed in as <strong>{admin.user.name}</strong> ({admin.user.email})
            </p>
          </div>
          <div className="dash-head-actions">
            <Link to="/" className="btn btn-ghost btn-sm">View site</Link>
            <button className="btn btn-outline btn-sm" onClick={onLogout}>
              <LogOut size={15} /> Log out
            </button>
          </div>
        </div>

        <div className="dash-tabs">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`dash-tab ${tab === id ? 'dash-tab-active' : ''}`}
              onClick={() => onTab(id)}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}

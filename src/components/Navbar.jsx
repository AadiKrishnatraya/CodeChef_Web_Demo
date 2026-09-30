import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/events', label: 'Events' },
    { to: '/admin/login', label: 'Admin Login' },
  ];

  return (
    <header className={`site-nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">&gt;_</span>
          <span className="brand-name">CodeChef Club</span>
        </Link>

        <button
          className="nav-burger"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>

        <nav className={`nav-links ${open ? 'nav-open' : ''}`}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/events" className="btn btn-primary btn-sm nav-cta" onClick={() => setOpen(false)}>
            Join an event
          </Link>
        </nav>
      </div>
    </header>
  );
}

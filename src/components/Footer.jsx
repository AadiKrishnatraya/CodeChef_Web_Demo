import { Link } from 'react-router-dom';
import { Github, Instagram, Linkedin, Mail, MapPin, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className="brand-mark">&gt;_</span>
            <span className="brand-name">CodeChef Club</span>
          </Link>
          <p className="footer-tag">
            The campus technical club for people who ship. Hackathons, contests, workshops and
            conversations that make you better at the craft.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="GitHub"><Github size={17} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={17} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={17} /></a>
            <a href="mailto:codechef.club@campus.edu" aria-label="Email"><Mail size={17} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/admin/login">Admin Login</Link>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <span><MapPin size={14} /> Innovation Lab, Block C</span>
          <span><Code2 size={14} /> codechef.club@campus.edu</span>
          <span><Code2 size={14} /> Mon–Fri · 4 PM – 6 PM</span>
        </div>
      </div>
      <div className="footer-bar">
        <span>© {new Date().getFullYear()} CodeChef Club · Built by members, for members.</span>
        <span className="footer-cursor">npm run dream █</span>
      </div>
    </footer>
  );
}

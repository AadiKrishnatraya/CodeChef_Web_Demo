import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/auth.js';
import { useToast } from '../lib/toast.jsx';

const ADMIN_EMAIL = 'admin@codechef.club';
const ADMIN_PASSWORD = 'admin123';

export default function AdminLogin() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required.';
    if (!password) errs.password = 'Password is required.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    setTimeout(() => {
      if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        login('demo-token', { email: ADMIN_EMAIL, name: 'Club Admin' });
        toast.success('Welcome back, admin.');
        navigate('/admin', { replace: true });
      } else {
        toast.error('Invalid credentials. Try the demo login below.');
        setErrors({ password: 'Incorrect email or password.' });
      }
      setBusy(false);
  }, 550);
  };

  return (
    <div className="auth-wrap page-fade">
      <div className="auth-card">
        <Link to="/" className="auth-back">
          <ArrowLeft size={15} /> Back to site
        </Link>
        <div className="auth-icon"><ShieldCheck size={26} /></div>
        <h1>Admin login</h1>
        <p className="auth-sub">Club coordinators manage events and registrations here.</p>

        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@codechef.club"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }}
              autoComplete="username"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="admin-pass">Password</label>
            <input
              id="admin-pass"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((x) => ({ ...x, password: undefined })); }}
              autoComplete="current-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Checking…' : 'Log in'}
          </button>
        </form>

        <div className="auth-hint">
          <Lock size={13} />
          <span>Demo credentials — <strong>admin@codechef.club</strong> / <strong>admin123</strong></span>
        </div>
      </div>
    </div>
  );
}

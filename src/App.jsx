import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './lib/toast.jsx';
import { EventsProvider } from './lib/events.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';

export default function App() {
  return (
    <ToastProvider>
      <EventsProvider>
        <HashRouter>
          <div className="app-shell">
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </EventsProvider>
    </ToastProvider>
  );
}

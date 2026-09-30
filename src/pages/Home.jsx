import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, CalendarDays, Clock, Code2, Flame, MapPin, Sparkles, Terminal, Trophy, Users,
} from 'lucide-react';
import { useEvents } from '../lib/events.jsx';
import EventCard from '../components/EventCard.jsx';
import RegistrationModal from '../components/RegistrationModal.jsx';
import Spinner from '../components/Spinner.jsx';

const QUICK_STATS = [
  { icon: Terminal, label: 'Members in the community', value: '420+' },
  { icon: CalendarDays, label: 'Events every semester', value: '20+' },
  { icon: Trophy, label: 'National contest wins', value: '17' },
  { icon: Users, label: 'Projects shipped together', value: '60+' },
];

export default function Home() {
  const { upcoming, past, loading, error, reload } = useEvents();
  const [regEvent, setRegEvent] = useState(null);
  const navigate = useNavigate();

  const featured = useMemo(
    () => upcoming().find((e) => e.featured) || upcoming()[0] || null,
    [upcoming],
  );
  const others = useMemo(
    () => upcoming().filter((e) => e.id !== featured?.id).slice(0, 3),
    [upcoming, featured],
  );
  const pastTwo = useMemo(() => past().slice(-2), [past]);

  return (
    <div className="page-fade">
      {/* hero */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-kicker">
              <Sparkles size={14} />
              CodeChef Club · campus technical community
            </span>
            <h1 className="hero-title">
              Where campus coders <em>build</em>, <em>break</em> &amp; <em>become</em>.
            </h1>
            <p className="hero-sub">
              Weekly contests. All-night hackathons. Workshops where you actually write code instead of
              watching slides. Find an event, register in ten seconds, and ship something you're proud of.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/events')}>
                Explore events <ArrowRight size={17} />
              </button>
              <a className="btn btn-outline btn-lg" href="#featured">
                This month's featured
              </a>
            </div>
            <div className="hero-marquee" aria-hidden="true">
              <div className="marquee-track">
                <span className="marquee-chunk">
                  {'greedy · graphs · git rebase · dp on trees · clean commits · systems · '.repeat(3)}
                </span>
                <span className="marquee-chunk">
                  {'greedy · graphs · git rebase · dp on trees · clean commits · systems · '.repeat(3)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* club intro */}
      <section className="section intro-section">
        <div className="container intro-grid">
          <div className="intro-copy">
            <span className="section-kicker">// who we are</span>
            <h2 className="section-title">A club that runs like a good repo.</h2>
            <p>
              CodeChef Club is the campus technical community for competitive programming, open source
              and hands-on engineering. We meet every week — to solve, to build, and to teach each
              other what we just learned.
            </p>
            <p>
              No gatekeeping, no dead committees. Just students who take the craft seriously and
              senior mentors who've been through the interviews.
            </p>
          </div>
          <div className="intro-panel" aria-hidden="true">
            <div className="term-bar">
              <span className="term-dot dot-r" />
              <span className="term-dot dot-y" />
              <span className="term-dot dot-g" />
              <span className="term-title">codechef-club — zsh</span>
            </div>
            <div className="term-body">
              <p><span className="t-prompt">$ whoami</span></p>
              <p className="t-out">a builder looking for a crew</p>
              <p><span className="t-prompt">$ git clone club/events</span></p>
              <p className="t-out">✔ 420 contributors</p>
              <p><span className="t-prompt">$ npm run join</span></p>
              <p className="t-out t-blink">▍registering…</p>
            </div>
          </div>
        </div>

        <div className="container stats-grid">
          {QUICK_STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="stat-card">
              <Icon size={20} />
              <div>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* featured event */}
      <section className="section" id="featured">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker"><Flame size={13} /> spotlight</span>
              <h2 className="section-title">Featured event</h2>
            </div>
          </div>

          {loading ? (
            <Spinner label="Loading featured event…" />
          ) : error ? (
            <div className="empty-note">
              Couldn't load events. <button className="link-btn" onClick={() => reload()}>Retry</button>
            </div>
          ) : featured ? (
            <div className="featured-card">
              <div className="featured-badge"><Flame size={14} /> FEATURED</div>
              <div className="featured-grid">
                <div>
                  <h3 className="featured-title">{featured.name}</h3>
                  <p className="featured-desc">{featured.description}</p>
                  <div className="featured-meta">
                    <span>
                      <CalendarDays size={15} />
                      {new Date(`${featured.date}T00:00:00`).toLocaleDateString('en-IN', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </span>
                    <span><Clock size={15} /> {featured.time}</span>
                    <span><MapPin size={15} /> {featured.venue}</span>
                  </div>
                  <button className="btn btn-primary" onClick={() => setRegEvent(featured)}>
                    Register for this one <ArrowRight size={16} />
                  </button>
                </div>
                <div className="featured-visual" aria-hidden="true">
                  <div className="featured-ring" />
                  <div className="featured-ring ring-2" />
                  <span className="featured-cat">{featured.category}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-note">No featured event right now — check back soon.</div>
          )}
        </div>
      </section>

      {/* upcoming events */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">// fresh from the queue</span>
              <h2 className="section-title">Upcoming events</h2>
            </div>
            <Link to="/events" className="btn btn-outline btn-sm">
              View all events <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <Spinner label="Loading events…" />
          ) : error ? (
            <div className="empty-note">
              Couldn't load events. <button className="link-btn" onClick={() => reload()}>Retry</button>
            </div>
          ) : others.length ? (
            <div className="cards-grid">
              {others.map((ev) => (
                <EventCard key={ev.id} event={ev} onRegister={setRegEvent} compact />
              ))}
            </div>
          ) : (
            <div className="empty-note">No upcoming events yet — the board is plotting something.</div>
          )}
        </div>
      </section>

      {/* past events strip */}
      {pastTwo.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-kicker">// archive</span>
                <h2 className="section-title">Recently wrapped</h2>
              </div>
            </div>
            <div className="past-strip">
              {pastTwo.map((ev) => (
                <div key={ev.id} className="past-chip">
                  <Code2 size={14} />
                  <strong>{ev.name}</strong>
                  <span>
                    {new Date(`${ev.date}T00:00:00`).toLocaleDateString('en-IN', {
                      month: 'long', year: 'numeric',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <RegistrationModal event={regEvent} onClose={() => setRegEvent(null)} />
    </div>
  );
}

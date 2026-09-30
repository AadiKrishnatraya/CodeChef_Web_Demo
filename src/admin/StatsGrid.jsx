import { CalendarDays, CalendarPlus, Star, Ticket } from 'lucide-react';

export default function StatsGrid({ events, upcomingCount, totalRegs, featuredCount }) {
  const cards = [
    { icon: CalendarDays, value: events.length, label: 'Total events' },
    { icon: CalendarPlus, value: upcomingCount, label: 'Upcoming events' },
    { icon: Ticket, value: totalRegs, label: 'Total registrations' },
    { icon: Star, value: featuredCount, label: 'Featured event' },
  ];

  return (
    <div className="stats-grid dash-stats">
      {cards.map(({ icon: Icon, value, label }) => (
        <div key={label} className="stat-card">
          <Icon size={20} />
          <div>
            <strong>{value ?? '—'}</strong>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

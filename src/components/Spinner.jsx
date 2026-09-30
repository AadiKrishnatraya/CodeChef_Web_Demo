import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="spinner-wrap" role="status">
      <Loader2 className="spin" size={26} />
      <span>{label}</span>
    </div>
  );
}

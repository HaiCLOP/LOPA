import { motion } from 'framer-motion';
import { Search, Bell } from 'lucide-react';
import { useProductivityScore } from '../../hooks/useTauri';

export function Header() {
  const { data: liveScore } = useProductivityScore(30000);
  const score = liveScore?.score ? Math.round(liveScore.score) : 76;
  const greeting = getGreeting();

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between pb-5 mb-1"
      style={{ borderBottom: '1px solid var(--color-hairline)' }}
    >
      <div>
        <h1 className="text-[28px] font-bold text-white tracking-[-0.3px] uppercase">
          {greeting}
        </h1>
        <p className="text-[13px] font-light mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Score */}
        <div className="flex items-center gap-3 px-4 py-2" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold tracking-[1.5px] uppercase" style={{ color: 'var(--color-text-muted)' }}>SCORE</span>
            <span className="text-[20px] font-bold text-white tabular-nums">{score}</span>
          </div>
          <div className="w-[2px] h-6" style={{ background: scoreColor(score) }} />
        </div>

        {/* Actions */}
        <button className="w-9 h-9 flex items-center justify-center" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
          <Search className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
        </button>
        <button className="w-9 h-9 flex items-center justify-center relative" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
          <Bell className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
          <span className="absolute -top-1 -right-1 w-2 h-2" style={{ background: 'var(--color-m-red)' }} />
        </button>
      </div>
    </motion.header>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function scoreColor(s: number): string {
  if (s >= 80) return '#0fa336';
  if (s >= 60) return '#1c69d4';
  if (s >= 40) return '#f4b400';
  return '#e22718';
}

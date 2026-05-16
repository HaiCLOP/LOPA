import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { AppIcon } from '../ui/AppIcon';
import { Clock, ArrowUpDown, Filter } from 'lucide-react';
import { useRecentActivity, type LiveActivityRecord } from '../../hooks/useTauri';

const CATEGORY_COLORS: Record<string, string> = {
  productive: '#22c55e',
  communication: '#3b82f6',
  entertainment: '#f59e0b',
  other: '#9ca3af',
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  if (min < 60) return `${min}m ${sec}s`;
  const h = Math.floor(min / 60);
  return `${h}h ${min % 60}m`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Fallback mock data
const mockActivity: LiveActivityRecord[] = [
  { id: 1, app_name: 'Code', window_title: 'App.tsx — Lopa', exe_path: '', started_at: '2026-05-16T20:30:00', ended_at: '2026-05-16T21:00:00', duration_seconds: 1800, category: 'productive', date: '2026-05-16' },
  { id: 2, app_name: 'Chrome', window_title: 'React Docs', exe_path: '', started_at: '2026-05-16T20:15:00', ended_at: '2026-05-16T20:30:00', duration_seconds: 900, category: 'productive', date: '2026-05-16' },
  { id: 3, app_name: 'Discord', window_title: '#general', exe_path: '', started_at: '2026-05-16T20:10:00', ended_at: '2026-05-16T20:15:00', duration_seconds: 300, category: 'communication', date: '2026-05-16' },
  { id: 4, app_name: 'Figma', window_title: 'Lopa Dashboard', exe_path: '', started_at: '2026-05-16T19:40:00', ended_at: '2026-05-16T20:10:00', duration_seconds: 1800, category: 'productive', date: '2026-05-16' },
  { id: 5, app_name: 'Spotify', window_title: 'Lo-fi Study', exe_path: '', started_at: '2026-05-16T19:30:00', ended_at: '2026-05-16T19:40:00', duration_seconds: 600, category: 'entertainment', date: '2026-05-16' },
];

export function ActivityPage() {
  const { data: liveActivity } = useRecentActivity(10000);

  const activity = liveActivity && liveActivity.length > 0 ? liveActivity : mockActivity;

  return (
    <div className="flex flex-col h-full p-5 gap-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-accent-green)]" />
            Activity
          </h1>
          <p className="text-[13px] text-[var(--color-text-muted)]">
            Recent app usage timeline
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-[11px] font-medium text-[var(--color-text-secondary)] hover:bg-white/60 transition-colors">
            <Filter className="w-3 h-3" /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-[11px] font-medium text-[var(--color-text-secondary)] hover:bg-white/60 transition-colors">
            <ArrowUpDown className="w-3 h-3" /> Sort
          </button>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-1.5">
        {activity.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.3 }}
          >
            <GlassCard padding="sm" className="flex items-center gap-3 py-3 px-4">
              {/* Category dot */}
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#9ca3af' }}
              />

              {/* App icon */}
              <AppIcon app={item.app_name.toLowerCase()} size={32} />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[var(--color-text-primary)]">
                    {item.app_name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100/80 text-[var(--color-text-muted)] capitalize">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] truncate">
                  {item.window_title}
                </p>
              </div>

              {/* Time + Duration */}
              <div className="text-right flex-shrink-0">
                <p className="text-[12px] font-medium text-[var(--color-text-primary)] tabular-nums">
                  {formatDuration(item.duration_seconds)}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] tabular-nums">
                  {formatTime(item.started_at)}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

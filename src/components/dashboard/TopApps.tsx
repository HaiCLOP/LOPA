import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { AppIcon } from '../ui/AppIcon';
import { topApps as mockTopApps } from '../../data/mockData';
import { useTopApps, type LiveAppUsage } from '../../hooks/useTauri';

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m`;
  return `${m}m`;
}

export function TopApps() {
  const { data: liveApps } = useTopApps(15000);

  // Use live data when available, fall back to mock
  const apps = liveApps && liveApps.length > 0
    ? liveApps.map((app: LiveAppUsage) => ({
        name: app.app_name,
        duration: formatMinutes(app.total_minutes),
        minutes: app.total_minutes,
        color: app.color,
        icon: app.icon,
        category: app.category as any,
      }))
    : mockTopApps;

  const maxMinutes = Math.max(...apps.map((a) => a.minutes), 1);

  return (
    <GlassCard padding="lg" delay={0.25} className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
          Top Apps
        </h3>
        <button className="text-[12px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
          View all
        </button>
      </div>

      {/* App List */}
      <div className="space-y-3.5">
        {apps.map((app, index) => (
          <motion.div
            key={app.name}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.08, duration: 0.35 }}
            className="flex items-center gap-3"
          >
            <AppIcon app={app.icon} size={30} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">
                  {app.name}
                </p>
                <p className="text-[12px] text-[var(--color-text-muted)] font-medium tabular-nums ml-2 flex-shrink-0">
                  {app.duration}
                </p>
              </div>
              <div className="w-full h-[5px] rounded-full bg-gray-100/80 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: app.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(app.minutes / maxMinutes) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}

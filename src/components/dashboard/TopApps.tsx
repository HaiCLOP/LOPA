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
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid var(--color-hairline)', paddingBottom: 12 }}>
        <h3 className="text-[11px] font-bold tracking-[1.5px] uppercase text-white">
          TOP APPS
        </h3>
        <button className="text-[10px] font-bold tracking-[1px] uppercase" style={{ color: 'var(--color-text-muted)' }}>
          VIEW ALL →
        </button>
      </div>

      {/* App List */}
      <div className="space-y-4">
        {apps.map((app, index) => (
          <motion.div
            key={app.name}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.06, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <AppIcon app={app.icon} size={28} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[12px] font-medium text-white truncate">
                  {app.name}
                </p>
                <p className="text-[11px] font-bold tabular-nums ml-2 flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }}>
                  {app.duration}
                </p>
              </div>
              <div className="w-full h-[3px] overflow-hidden" style={{ background: 'var(--color-hairline)' }}>
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: app.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(app.minutes / maxMinutes) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}

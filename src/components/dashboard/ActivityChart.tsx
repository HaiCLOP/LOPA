import { GlassCard } from '../ui/GlassCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { activityData as mockActivityData } from '../../data/mockData';
import { useHourlyActivity } from '../../hooks/useTauri';
import { Info, ChevronDown } from 'lucide-react';

const CHART_COLORS = {
  productive: '#22c55e',
  communication: '#3b82f6',
  entertainment: '#f59e0b',
  other: '#d1d5db',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-heavy rounded-lg px-3 py-2 text-[11px] shadow-lg border border-white/40">
      <p className="font-semibold text-[var(--color-text-primary)] mb-1">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[var(--color-text-secondary)] capitalize">{entry.dataKey}:</span>
          <span className="font-medium text-[var(--color-text-primary)]">{Math.round(entry.value)}m</span>
        </div>
      ))}
    </div>
  );
};

export function ActivityChart() {
  const { data: liveData } = useHourlyActivity(30000);

  // Use live data when available, fall back to mock
  const rawData = liveData && liveData.length > 0 ? liveData : mockActivityData;

  // Show every 2nd label for cleaner x-axis
  const displayData = rawData.filter((_, i) => i % 2 === 0);

  return (
    <GlassCard padding="lg" delay={0.2} className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
            Today's Activity
          </h3>
          <Info className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
        </div>
        <button className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-black/[0.03]">
          Today
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: 180 }}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={displayData} barGap={1} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={{ stroke: 'rgba(0,0,0,0.06)' }}
              tickLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${Math.round(v)}m`}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
            <Bar dataKey="productive" stackId="stack" fill={CHART_COLORS.productive} radius={[0, 0, 0, 0]} />
            <Bar dataKey="communication" stackId="stack" fill={CHART_COLORS.communication} radius={[0, 0, 0, 0]} />
            <Bar dataKey="entertainment" stackId="stack" fill={CHART_COLORS.entertainment} radius={[0, 0, 0, 0]} />
            <Bar dataKey="other" stackId="stack" fill={CHART_COLORS.other} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-gray-200/30">
        {Object.entries(CHART_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-[var(--color-text-muted)] capitalize font-medium">
              {key}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

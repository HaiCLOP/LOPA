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
import { ChevronDown } from 'lucide-react';

const CHART_COLORS = {
  productive: '#0fa336',
  communication: '#1c69d4',
  entertainment: '#f4b400',
  other: '#333333',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="px-3 py-2 text-[11px]" style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-hairline)' }}>
      <p className="font-bold text-white mb-1 text-[10px] tracking-[1px] uppercase">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div className="w-1.5 h-1.5" style={{ backgroundColor: entry.color }} />
          <span className="capitalize" style={{ color: 'var(--color-text-muted)' }}>{entry.dataKey}:</span>
          <span className="font-bold text-white">{Math.round(entry.value)}m</span>
        </div>
      ))}
    </div>
  );
};

export function ActivityChart() {
  const { data: liveData } = useHourlyActivity(30000);
  const rawData = liveData && liveData.length > 0 ? liveData : mockActivityData;
  const displayData = rawData.filter((_, i) => i % 2 === 0);

  return (
    <GlassCard padding="lg" delay={0.2} className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid var(--color-hairline)', paddingBottom: 12 }}>
        <h3 className="text-[11px] font-bold tracking-[1.5px] uppercase text-white">
          TODAY'S ACTIVITY
        </h3>
        <button
          className="flex items-center gap-1.5 text-[10px] font-bold tracking-[1px] uppercase px-2.5 py-1.5"
          style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-hairline)' }}
        >
          Today
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1" style={{ minHeight: 180 }}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={displayData} barGap={0} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-hairline)"
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10, fill: '#666' }}
              axisLine={{ stroke: 'var(--color-hairline)' }}
              tickLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#666' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${Math.round(v)}m`}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="productive" stackId="stack" fill={CHART_COLORS.productive} radius={[0, 0, 0, 0]} />
            <Bar dataKey="communication" stackId="stack" fill={CHART_COLORS.communication} radius={[0, 0, 0, 0]} />
            <Bar dataKey="entertainment" stackId="stack" fill={CHART_COLORS.entertainment} radius={[0, 0, 0, 0]} />
            <Bar dataKey="other" stackId="stack" fill={CHART_COLORS.other} radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 pt-3" style={{ borderTop: '1px solid var(--color-hairline)' }}>
        {Object.entries(CHART_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2 h-2" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-bold tracking-[0.5px] uppercase" style={{ color: 'var(--color-text-muted)' }}>
              {key}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

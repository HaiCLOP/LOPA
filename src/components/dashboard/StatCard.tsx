import { motion } from 'framer-motion';
import { Clock, Target, Coffee, ArrowLeftRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Sparkline } from '../ui/Sparkline';
import type { StatCardData } from '../../types';

const iconMap: Record<string, React.ElementType> = {
  Clock, Target, Coffee, ArrowLeftRight,
};

interface StatCardProps {
  data: StatCardData;
  index: number;
}

export function StatCard({ data, index }: StatCardProps) {
  const Icon = iconMap[data.icon] || Clock;

  return (
    <GlassCard padding="md" delay={0.05 * index} className="flex flex-col min-w-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-[1.5px] uppercase" style={{ color: 'var(--color-text-muted)' }}>
            {data.label}
          </p>
          <p className="text-[28px] font-bold text-white leading-none mt-2 tabular-nums">
            {data.value}
          </p>
        </div>
        <div
          className="w-8 h-8 flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-hairline)' }}
        >
          <Icon className="w-[15px] h-[15px]" style={{ color: data.color }} strokeWidth={2} />
        </div>
      </div>

      {/* Trend + Sparkline */}
      <div className="flex items-end justify-between mt-auto" style={{ borderTop: '1px solid var(--color-hairline)', paddingTop: 8 }}>
        <div className="flex items-center gap-1.5">
          {data.trend !== 'neutral' && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`text-[12px] font-bold ${
                data.trend === 'up' ? 'trend-up' : 'trend-down'
              }`}
            >
              {data.trend === 'up' ? '↑' : '↓'} {data.trendValue}
            </motion.span>
          )}
          <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
            {data.trendLabel}
          </span>
        </div>
        <Sparkline
          data={data.sparklineData}
          width={64}
          height={20}
          color={data.color}
          strokeWidth={1.5}
        />
      </div>
    </GlassCard>
  );
}

interface StatCardsRowProps {
  cards: StatCardData[];
}

export function StatCardsRow({ cards }: StatCardsRowProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <StatCard key={card.id} data={card} index={i} />
      ))}
    </div>
  );
}

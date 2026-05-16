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
    <GlassCard padding="md" delay={0.08 * index} className="flex flex-col min-w-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11.5px] font-medium text-[var(--color-text-muted)] mb-1">
            {data.label}
          </p>
          <p className="text-[26px] font-bold text-[var(--color-text-primary)] leading-none tracking-tight">
            {data.value}
          </p>
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${data.color}12` }}
        >
          <Icon className="w-[18px] h-[18px]" style={{ color: data.color }} strokeWidth={2} />
        </div>
      </div>

      {/* Trend + Sparkline */}
      <div className="flex items-end justify-between mt-auto">
        <div className="flex items-center gap-1.5">
          {data.trend !== 'neutral' && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`text-[12px] font-semibold ${
                data.trend === 'up' ? 'trend-up' : 'trend-down'
              }`}
            >
              {data.trend === 'up' ? '↑' : '↓'} {data.trendValue}
            </motion.span>
          )}
          {data.trend === 'neutral' && (
            <span className="text-[11px]">●</span>
          )}
          <span className="text-[11px] text-[var(--color-text-muted)]">
            {data.trendLabel}
          </span>
        </div>
        <Sparkline
          data={data.sparklineData}
          width={72}
          height={24}
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

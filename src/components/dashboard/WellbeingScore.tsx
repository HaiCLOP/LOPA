import { motion } from 'framer-motion';
import { Moon, Heart, Leaf, Monitor, ChevronDown } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { CircularProgress } from '../ui/CircularProgress';
import { wellbeingData } from '../../data/mockData';
import { getScoreColor, getStatusColor } from '../../lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Moon, Heart, Leaf, Monitor,
};

export function WellbeingScore() {
  const scoreColor = getScoreColor(wellbeingData.score);

  return (
    <GlassCard padding="md" delay={0.45} className="flex items-center gap-6">
      {/* Score Section */}
      <div className="flex items-center gap-4 pr-5 border-r border-gray-200/40 flex-shrink-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[13px] text-[var(--color-text-secondary)] font-medium">
            Wellbeing Score
          </span>
          <ChevronDown className="w-3 h-3 text-[var(--color-text-muted)]" />
        </div>
      </div>

      <div className="flex items-center gap-4 pr-5 border-r border-gray-200/40 flex-shrink-0">
        <CircularProgress
          value={wellbeingData.score}
          size={52}
          strokeWidth={4}
          color={scoreColor}
          trackColor="rgba(0,0,0,0.05)"
        >
          <span className="text-[15px] font-bold text-[var(--color-text-primary)]">
            {wellbeingData.score}
          </span>
        </CircularProgress>
        <div>
          <p className="text-[14px] font-bold" style={{ color: scoreColor }}>
            {wellbeingData.label}
          </p>
          <p className="text-[10.5px] text-[var(--color-text-muted)] max-w-[140px] leading-snug">
            {wellbeingData.description}
          </p>
          <button className="text-[10.5px] font-medium text-indigo-500 hover:text-indigo-600 transition-colors mt-0.5">
            View breakdown
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-6 flex-1 overflow-x-auto">
        {wellbeingData.metrics.map((metric, index) => {
          const Icon = iconMap[metric.icon] || Monitor;
          const statusColor = getStatusColor(metric.status);

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.08, duration: 0.3 }}
              className="flex items-center gap-2.5 flex-shrink-0"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${statusColor}10` }}
              >
                <Icon className="w-4 h-4" style={{ color: statusColor }} />
              </div>
              <div>
                <p className="text-[10.5px] text-[var(--color-text-muted)] font-medium leading-none mb-1">
                  {metric.label}
                </p>
                <p className="text-[14px] font-bold text-[var(--color-text-primary)] leading-none">
                  {metric.value}
                </p>
                <p className="text-[10px] font-medium capitalize mt-0.5 leading-none" style={{ color: statusColor }}>
                  {metric.status}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}

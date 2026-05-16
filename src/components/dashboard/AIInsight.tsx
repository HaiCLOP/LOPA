import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { MoreVertical, ArrowRight } from 'lucide-react';
import { useInsights, type InsightData } from '../../hooks/useTauri';

const fallbackInsight: InsightData = {
  id: 'peak_window',
  title: 'Peak Focus Window',
  description: "You're most productive between 8:20 PM – 10:15 PM. Consider planning your deep work during this time.",
  category: 'focus',
  priority: 'high',
  action: 'Schedule focus blocks',
  icon: '⚡',
};

export function AIInsight() {
  const { data: liveInsights } = useInsights(30000);

  const insight = liveInsights && liveInsights.length > 0
    ? liveInsights[0]
    : fallbackInsight;

  // Parse time range from description if present
  const timeMatch = insight.description.match(/between (.+? [AP]M)\s*[–-]\s*(.+? [AP]M)/);
  const startTime = timeMatch ? timeMatch[1] : null;
  const endTime = timeMatch ? timeMatch[2] : null;
  const bodyText = timeMatch
    ? insight.description.replace(/between .+? [AP]M\s*[–-]\s*.+? [AP]M\.?\s*/, '')
    : insight.description;

  return (
    <GlassCard padding="lg" delay={0.3} className="flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[16px]">{insight.icon}</span>
          <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
            AI Insight
          </h3>
        </div>
        <button className="p-1 rounded-lg hover:bg-black/[0.04] transition-colors">
          <MoreVertical className="w-4 h-4 text-[var(--color-text-muted)]" />
        </button>
      </div>

      {/* Insight Content */}
      <div className="flex-1">
        <p className="text-[13px] text-[var(--color-text-secondary)] mb-1">
          {startTime ? `You're most productive between` : insight.title}
        </p>
        {startTime && endTime ? (
          <p className="text-[22px] font-bold text-[var(--color-text-primary)] mb-2">
            {startTime} – {endTime}
          </p>
        ) : null}
        <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
          {bodyText || insight.description}
        </p>
      </div>

      {/* Landscape Illustration */}
      <div className="mt-3 h-16 rounded-lg overflow-hidden relative">
        <svg viewBox="0 0 400 60" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0f2e9" />
              <stop offset="100%" stopColor="#d1fae5" />
            </linearGradient>
          </defs>
          <rect width="400" height="60" fill="url(#skyGrad)" />
          <path d="M0,40 Q50,15 100,30 T200,25 T300,35 T400,20 V60 H0Z" fill="#86efac" opacity="0.4" />
          <path d="M0,45 Q80,25 160,38 T320,30 T400,40 V60 H0Z" fill="#4ade80" opacity="0.3" />
          <path d="M0,50 Q100,35 200,45 T400,42 V60 H0Z" fill="#22c55e" opacity="0.2" />
        </svg>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ x: 2 }}
        className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-accent-indigo)] mt-3 group"
      >
        {insight.action || 'View full Insight'}
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </motion.button>
    </GlassCard>
  );
}

import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { ArrowRight } from 'lucide-react';
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

  const timeMatch = insight.description.match(/between (.+? [AP]M)\s*[–-]\s*(.+? [AP]M)/);
  const startTime = timeMatch ? timeMatch[1] : null;
  const endTime = timeMatch ? timeMatch[2] : null;
  const bodyText = timeMatch
    ? insight.description.replace(/between .+? [AP]M\s*[–-]\s*.+? [AP]M\.?\s*/, '')
    : insight.description;

  return (
    <GlassCard padding="lg" delay={0.3} className="flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4" style={{ borderBottom: '1px solid var(--color-hairline)', paddingBottom: 12 }}>
        <div className="flex items-center gap-2">
          <span className="text-[14px]">{insight.icon}</span>
          <h3 className="text-[11px] font-bold tracking-[1.5px] uppercase text-white">
            AI INSIGHT
          </h3>
        </div>
        <span className="text-[9px] font-bold tracking-[1px] uppercase px-2 py-0.5" style={{
          color: insight.priority === 'high' ? '#e22718' : '#f4b400',
          border: `1px solid ${insight.priority === 'high' ? 'rgba(226,39,24,0.3)' : 'rgba(244,180,0,0.3)'}`,
        }}>
          {insight.priority}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-[12px] font-light" style={{ color: 'var(--color-text-secondary)' }}>
          {startTime ? `You're most productive between` : insight.title}
        </p>
        {startTime && endTime ? (
          <p className="text-[24px] font-bold text-white mt-1 mb-2 tabular-nums">
            {startTime} – {endTime}
          </p>
        ) : null}
        <p className="text-[12px] font-light leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {bodyText || insight.description}
        </p>
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ x: 2 }}
        className="flex items-center gap-1.5 mt-4 group"
        style={{ color: 'var(--color-m-blue)' }}
      >
        <span className="text-[10px] font-bold tracking-[1.5px] uppercase">
          {insight.action || 'VIEW INSIGHT'}
        </span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </motion.button>
    </GlassCard>
  );
}

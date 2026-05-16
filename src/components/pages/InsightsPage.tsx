import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Lightbulb, ArrowRight, TrendingUp, Target, Sparkles } from 'lucide-react';
import { useInsights, useRecommendations, useFocusPatterns } from '../../hooks/useTauri';

const PRIORITY_STYLES: Record<string, string> = {
  high: 'bg-red-50 text-red-700 border-red-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

function formatHour(h: number): string {
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

export function InsightsPage() {
  const { data: insights } = useInsights(30000);
  const { data: recommendations } = useRecommendations(30000);
  const { data: patterns } = useFocusPatterns(30000);

  const displayInsights = insights || [];
  const displayRecs = recommendations || [];

  return (
    <div className="flex flex-col h-full p-5 gap-4 overflow-y-auto">
      <div className="mb-1">
        <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--color-accent-indigo)]" />
          Insights
        </h1>
        <p className="text-[13px] text-[var(--color-text-muted)]">
          Personalized analysis from your activity patterns
        </p>
      </div>

      {/* Focus Pattern Card */}
      {patterns && (
        <GlassCard padding="lg" delay={0.05} className="relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[var(--color-accent-green)]" />
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
              Your Focus Profile
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] text-[var(--color-text-muted)]">Peak Window</p>
              <p className="text-[18px] font-bold text-[var(--color-text-primary)]">
                {formatHour(patterns.peak_start_hour)} – {formatHour(patterns.peak_end_hour)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--color-text-muted)]">Avg Focus</p>
              <p className="text-[18px] font-bold text-[var(--color-text-primary)]">
                {Math.round(patterns.avg_focus_duration_min)}m
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--color-text-muted)]">Distractions</p>
              <p className="text-[18px] font-bold text-[var(--color-text-primary)]">
                {patterns.distraction_count}
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Insights Grid */}
      {displayInsights.length > 0 && (
        <>
          <h2 className="text-[14px] font-semibold text-[var(--color-text-secondary)] flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Today's Insights
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {displayInsights.map((insight, idx) => (
              <GlassCard key={insight.id} padding="md" delay={0.1 + idx * 0.05}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[20px]">{insight.icon}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[insight.priority] || PRIORITY_STYLES.low}`}>
                    {insight.priority}
                  </span>
                </div>
                <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-1">
                  {insight.title}
                </h3>
                <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed mb-2">
                  {insight.description}
                </p>
                {insight.action && (
                  <motion.button
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-1 text-[11px] font-medium text-[var(--color-accent-indigo)] group"
                  >
                    {insight.action}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                )}
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {/* Recommendations */}
      {displayRecs.length > 0 && (
        <>
          <h2 className="text-[14px] font-semibold text-[var(--color-text-secondary)] flex items-center gap-2 mt-2">
            <TrendingUp className="w-4 h-4" /> Recommendations
          </h2>
          <div className="space-y-2">
            {displayRecs.map((rec, idx) => (
              <GlassCard key={rec.id} padding="md" delay={0.2 + idx * 0.05}>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    rec.impact === 'high' ? 'bg-red-400' : rec.impact === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <div>
                    <p className="text-[13px] font-medium text-[var(--color-text-primary)]">{rec.text}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{rec.reasoning}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {displayInsights.length === 0 && !patterns && (
        <GlassCard padding="lg" delay={0.1} className="text-center py-12">
          <Sparkles className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-[14px] font-medium text-[var(--color-text-secondary)]">
            No insights yet
          </p>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-1">
            Keep using your apps — insights will appear as patterns emerge.
          </p>
        </GlassCard>
      )}
    </div>
  );
}

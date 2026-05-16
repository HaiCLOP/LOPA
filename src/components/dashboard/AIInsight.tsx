import { motion } from 'framer-motion';
import { Sparkles, MoreVertical } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { aiInsight } from '../../data/mockData';

export function AIInsight() {
  return (
    <GlassCard padding="lg" delay={0.3} className="flex flex-col relative overflow-hidden">
      {/* Ambient background gradient */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 30%, #fefce8 70%, #fffbeb 100%)',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">
              AI Insight
            </h3>
          </div>
          <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors">
            <MoreVertical className="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-[13px] text-[var(--color-text-secondary)] mb-1">
            You're most productive between
          </p>
          <p className="text-[18px] font-bold text-[var(--color-text-primary)] tracking-tight mb-2">
            {aiInsight.timeRange}
          </p>
          <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed mb-4">
            {aiInsight.description}
          </p>
        </motion.div>

        {/* Landscape illustration placeholder */}
        <div className="rounded-lg overflow-hidden mb-3 h-14 bg-gradient-to-r from-emerald-50/60 via-sky-50/40 to-amber-50/50 flex items-end justify-center relative">
          {/* Simple mountain silhouette */}
          <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,40 L30,18 L50,28 L80,8 L110,25 L140,12 L170,22 L200,15 L200,40 Z" fill="rgba(34,197,94,0.12)" />
            <path d="M0,40 L40,25 L70,32 L100,20 L130,30 L160,22 L200,28 L200,40 Z" fill="rgba(34,197,94,0.08)" />
          </svg>
        </div>

        {/* Action */}
        <button className="text-[12px] font-medium text-[var(--color-text-secondary)] px-3 py-1.5 rounded-lg border border-gray-200/60 hover:bg-black/[0.03] transition-colors">
          View full Insight
        </button>
      </div>
    </GlassCard>
  );
}

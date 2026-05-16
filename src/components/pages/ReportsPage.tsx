import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { CircularProgress } from '../ui/CircularProgress';
import { FileText, Download, Calendar, TrendingUp, Clock, Target, ArrowLeftRight, Zap } from 'lucide-react';
import { useProductivityScore, useDailyStats } from '../../hooks/useTauri';

// Mock weekly data for chart bars
const weekData = [
  { day: 'Mon', score: 72, screenHrs: 5.2 },
  { day: 'Tue', score: 68, screenHrs: 6.1 },
  { day: 'Wed', score: 81, screenHrs: 4.8 },
  { day: 'Thu', score: 76, screenHrs: 5.5 },
  { day: 'Fri', score: 85, screenHrs: 4.2 },
  { day: 'Sat', score: 45, screenHrs: 7.1 },
  { day: 'Sun', score: 0, screenHrs: 0 },
];

function WeeklyBar({ day, score, maxScore = 100, delay }: { day: string; score: number; maxScore?: number; delay: number }) {
  const height = (score / maxScore) * 100;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className="relative w-full h-[120px] flex items-end justify-center">
        <motion.div
          className="w-8 rounded-t-lg"
          style={{ backgroundColor: color + '30' }}
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-t-lg"
            style={{ backgroundColor: color }}
            initial={{ height: 0 }}
            animate={{ height: `${height * 0.7}%` }}
            transition={{ duration: 0.6, delay: delay + 0.1, ease: 'easeOut' }}
          />
        </motion.div>
      </div>
      <span className="text-[10px] font-medium text-[var(--color-text-muted)]">{day}</span>
      <span className="text-[12px] font-bold text-[var(--color-text-primary)]">{score > 0 ? score : '—'}</span>
    </div>
  );
}

export function ReportsPage() {
  const { data: liveScore } = useProductivityScore(30000);
  const { data: liveStats } = useDailyStats(30000);

  const todayScore = liveScore?.score ? Math.round(liveScore.score) : 76;
  const weekAvg = Math.round(weekData.filter((d) => d.score > 0).reduce((a, b) => a + b.score, 0) / weekData.filter((d) => d.score > 0).length);

  return (
    <div className="flex flex-col h-full p-5 gap-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--color-accent-purple)]" />
            Reports
          </h1>
          <p className="text-[13px] text-[var(--color-text-muted)]">
            Weekly productivity summary
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg glass text-[11px] font-medium text-[var(--color-text-secondary)] hover:bg-white/60 transition-colors">
            <Calendar className="w-3.5 h-3.5" /> This Week
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--color-accent-indigo)] text-white text-[12px] font-medium"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </motion.button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Week Average', value: `${weekAvg}/100`, icon: <TrendingUp className="w-4 h-4" />, color: '#6366f1' },
          { label: 'Screen Time Today', value: liveStats?.screen_time || '5h 42m', icon: <Clock className="w-4 h-4" />, color: '#3b82f6' },
          { label: 'Focus Today', value: liveStats?.focus_time || '2h 15m', icon: <Target className="w-4 h-4" />, color: '#22c55e' },
          { label: 'App Switches', value: String(liveStats?.app_switches ?? 87), icon: <ArrowLeftRight className="w-4 h-4" />, color: '#f59e0b' },
        ].map((stat, idx) => (
          <GlassCard key={stat.label} padding="md" delay={0.05 + idx * 0.05}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <span className="text-[11px] text-[var(--color-text-muted)]">{stat.label}</span>
            </div>
            <p className="text-[20px] font-bold text-[var(--color-text-primary)]">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Weekly Chart */}
      <GlassCard padding="lg" delay={0.15}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--color-accent-indigo)]" />
            Productivity This Week
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#22c55e]" />
              <span className="text-[10px] text-[var(--color-text-muted)]">Excellent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]" />
              <span className="text-[10px] text-[var(--color-text-muted)]">Good</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b]" />
              <span className="text-[10px] text-[var(--color-text-muted)]">Fair</span>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-2 px-4">
          {weekData.map((d, i) => (
            <WeeklyBar key={d.day} day={d.day} score={d.score} delay={0.2 + i * 0.07} />
          ))}
        </div>
      </GlassCard>

      {/* Today's Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard padding="lg" delay={0.25}>
          <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-3">Today's Score</h3>
          <div className="flex items-center gap-4">
            <CircularProgress value={todayScore} max={100} size={80} strokeWidth={6} color={todayScore >= 80 ? '#22c55e' : '#3b82f6'}>
              <span className="text-[22px] font-bold text-[var(--color-text-primary)]">{todayScore}</span>
            </CircularProgress>
            <div>
              <p className="text-[13px] font-medium text-[var(--color-text-primary)]">
                {liveScore?.label || 'Good'}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                {todayScore >= weekAvg ? `${todayScore - weekAvg} points above` : `${weekAvg - todayScore} points below`} your weekly average
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard padding="lg" delay={0.3}>
          <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] mb-3">Category Split</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Productive', pct: liveScore?.productive_pct ?? 58, color: '#22c55e' },
              { label: 'Communication', pct: liveScore?.communication_pct ?? 22, color: '#3b82f6' },
              { label: 'Entertainment', pct: liveScore?.entertainment_pct ?? 12, color: '#f59e0b' },
              { label: 'Other', pct: liveScore?.other_pct ?? 8, color: '#9ca3af' },
            ].map((cat) => (
              <div key={cat.label}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-[11px] text-[var(--color-text-secondary)]">{cat.label}</span>
                  <span className="text-[11px] font-medium text-[var(--color-text-primary)]">{Math.round(cat.pct)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100/80 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

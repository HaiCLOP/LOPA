import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { CircularProgress } from '../ui/CircularProgress';
import { ChevronDown, Moon, Heart, Shield, Monitor, Zap } from 'lucide-react';
import { useWellbeingScore, type WellbeingFactor } from '../../hooks/useTauri';

const FACTOR_ICONS: Record<string, React.ReactNode> = {
  screen_balance: <Monitor className="w-4 h-4" />,
  mindful_breaks: <Shield className="w-4 h-4" />,
  focus_quality: <Zap className="w-4 h-4" />,
  context_switches: <Moon className="w-4 h-4" />,
  digital_diet: <Heart className="w-4 h-4" />,
};

const STATUS_COLORS: Record<string, string> = {
  great: '#22c55e',
  good: '#3b82f6',
  fair: '#f59e0b',
  poor: '#ef4444',
};

// Fallback static data for browser mode
const fallbackFactors: WellbeingFactor[] = [
  { id: 'screen_balance', label: 'Screen Balance', value: '5h 42m', status: 'good', weight: 0.25 },
  { id: 'mindful_breaks', label: 'Mindful Breaks', value: '6', status: 'great', weight: 0.2 },
  { id: 'focus_quality', label: 'Focus Quality', value: '65%', status: 'good', weight: 0.25 },
  { id: 'context_switches', label: 'Context Flow', value: '87', status: 'fair', weight: 0.15 },
  { id: 'digital_diet', label: 'Digital Diet', value: '12%', status: 'great', weight: 0.15 },
];

export function WellbeingScore() {
  const { data: liveWellbeing } = useWellbeingScore(20000);

  const score = liveWellbeing?.score ?? 82;
  const label = liveWellbeing?.label ?? 'Great';
  const description = liveWellbeing?.description ?? 'This score reflects your digital balance and habits.';
  const factors = liveWellbeing?.factors ?? fallbackFactors;

  return (
    <GlassCard padding="lg" delay={0.45} className="flex items-center gap-5">
      {/* Score Ring */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[var(--color-text-primary)]">
            Wellbeing Score
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
        </div>
        <CircularProgress value={score} max={100} size={52} strokeWidth={5} color="#22c55e">
          <span className="text-[15px] font-bold text-[var(--color-text-primary)]">{score}</span>
        </CircularProgress>
      </div>

      {/* Score Label */}
      <div className="flex flex-col">
        <span
          className="text-[16px] font-bold"
          style={{ color: score >= 80 ? '#22c55e' : score >= 60 ? '#3b82f6' : '#f59e0b' }}
        >
          {label}
        </span>
        <span className="text-[11px] text-[var(--color-text-muted)] max-w-[200px] leading-relaxed">
          {description}
        </span>
        <button className="text-[11px] text-[var(--color-accent-indigo)] font-medium mt-0.5 text-left hover:underline">
          View breakdown
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-gray-200/40" />

      {/* Factors */}
      <div className="flex items-center gap-6 overflow-x-auto flex-1">
        {factors.map((factor, index) => (
          <motion.div
            key={factor.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.06, duration: 0.3 }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${STATUS_COLORS[factor.status] || '#9ca3af'}18` }}
            >
              <span style={{ color: STATUS_COLORS[factor.status] || '#9ca3af' }}>
                {FACTOR_ICONS[factor.id] || <Monitor className="w-4 h-4" />}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--color-text-muted)] leading-none">
                {factor.label}
              </span>
              <span className="text-[14px] font-semibold text-[var(--color-text-primary)] leading-tight">
                {factor.value}
              </span>
              <span
                className="text-[9px] font-medium capitalize leading-none"
                style={{ color: STATUS_COLORS[factor.status] || '#9ca3af' }}
              >
                {factor.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}

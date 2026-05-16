import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Monitor, Shield, Zap, Moon, Heart } from 'lucide-react';
import { useWellbeingScore, type WellbeingFactor } from '../../hooks/useTauri';

const FACTOR_ICONS: Record<string, React.ReactNode> = {
  screen_balance: <Monitor className="w-3.5 h-3.5" />,
  mindful_breaks: <Shield className="w-3.5 h-3.5" />,
  focus_quality: <Zap className="w-3.5 h-3.5" />,
  context_switches: <Moon className="w-3.5 h-3.5" />,
  digital_diet: <Heart className="w-3.5 h-3.5" />,
};

const STATUS_COLORS: Record<string, string> = {
  great: '#0fa336',
  good: '#1c69d4',
  fair: '#f4b400',
  poor: '#e22718',
};

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
  const factors = liveWellbeing?.factors ?? fallbackFactors;
  const scoreColor = score >= 80 ? '#0fa336' : score >= 60 ? '#1c69d4' : score >= 40 ? '#f4b400' : '#e22718';

  return (
    <GlassCard padding="lg" delay={0.45} className="flex items-center gap-6">
      {/* Score + Label */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div>
          <p className="text-[10px] font-bold tracking-[1.5px] uppercase mb-1" style={{ color: 'var(--color-text-muted)' }}>
            WELLBEING
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] font-bold text-white tabular-nums leading-none">
              {score}
            </span>
            <span className="text-[12px] font-bold tracking-[1px] uppercase" style={{ color: scoreColor }}>
              {label}
            </span>
          </div>
        </div>
        {/* M-stripe indicator */}
        <div className="w-[3px] h-10" style={{ background: scoreColor }} />
      </div>

      {/* Hairline Divider */}
      <div className="w-px h-12" style={{ background: 'var(--color-hairline)' }} />

      {/* Factors */}
      <div className="flex items-center gap-6 overflow-x-auto flex-1">
        {factors.map((factor, index) => (
          <motion.div
            key={factor.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05, duration: 0.25 }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div
              className="w-6 h-6 flex items-center justify-center"
              style={{ color: STATUS_COLORS[factor.status] || '#666' }}
            >
              {FACTOR_ICONS[factor.id] || <Monitor className="w-3.5 h-3.5" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-[0.5px] uppercase" style={{ color: 'var(--color-text-muted)' }}>
                {factor.label}
              </span>
              <span className="text-[14px] font-bold text-white leading-tight tabular-nums">
                {factor.value}
              </span>
              <span
                className="text-[8px] font-bold tracking-[1px] uppercase"
                style={{ color: STATUS_COLORS[factor.status] || '#666' }}
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

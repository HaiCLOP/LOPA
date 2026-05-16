import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { CircularProgress } from '../ui/CircularProgress';
import { Target, Plus, Check, Clock, Shield, Zap } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  target: string;
  current: number;
  max: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

const defaultGoals: Goal[] = [
  { id: 'screen', title: 'Screen Time Limit', target: 'Under 6 hours', current: 342, max: 360, unit: 'min', icon: <Clock className="w-4 h-4" />, color: '#22c55e' },
  { id: 'focus', title: 'Daily Focus Time', target: 'At least 2 hours', current: 95, max: 120, unit: 'min', icon: <Zap className="w-4 h-4" />, color: '#6366f1' },
  { id: 'breaks', title: 'Mindful Breaks', target: '6 breaks per day', current: 4, max: 6, unit: 'breaks', icon: <Shield className="w-4 h-4" />, color: '#3b82f6' },
  { id: 'switches', title: 'Context Switches', target: 'Under 80 per day', current: 65, max: 80, unit: 'switches', icon: <Target className="w-4 h-4" />, color: '#f59e0b' },
];

export function GoalsPage() {
  const [goals] = useState<Goal[]>(defaultGoals);

  return (
    <div className="flex flex-col h-full p-5 gap-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--color-accent-indigo)]" />
            Goals
          </h1>
          <p className="text-[13px] text-[var(--color-text-muted)]">
            Track your daily wellbeing targets
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--color-accent-indigo)] text-white text-[12px] font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> New Goal
        </motion.button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal, idx) => {
          const pct = Math.min((goal.current / goal.max) * 100, 100);
          const isComplete = goal.current >= goal.max;

          return (
            <GlassCard key={goal.id} padding="lg" delay={0.05 + idx * 0.06}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${goal.color}15` }}
                  >
                    <span style={{ color: goal.color }}>{goal.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                      {goal.title}
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{goal.target}</p>
                  </div>
                </div>
                {isComplete && (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                )}
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[24px] font-bold text-[var(--color-text-primary)] tabular-nums">
                    {goal.current}
                    <span className="text-[12px] font-normal text-[var(--color-text-muted)] ml-1">
                      / {goal.max} {goal.unit}
                    </span>
                  </p>
                </div>
                <CircularProgress value={pct} max={100} size={44} strokeWidth={4} color={goal.color}>
                  <span className="text-[10px] font-bold text-[var(--color-text-primary)]">
                    {Math.round(pct)}%
                  </span>
                </CircularProgress>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-gray-100/80 mt-3 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: goal.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

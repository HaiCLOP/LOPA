import { motion } from 'framer-motion';
import { Sparkles, Play, Pause, RotateCcw, Settings2, ChevronDown } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { CircularProgress } from '../ui/CircularProgress';
import { useTimer } from '../../hooks/useTimer';
import { formatTime } from '../../lib/utils';

export function FocusTimer() {
  const { timeRemaining, isRunning, progress, start, pause, reset } = useTimer(1500);

  return (
    <GlassCard padding="lg" delay={0.35} className="flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">
            Focus Timer
          </h3>
        </div>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/[0.04] transition-colors">
          <Settings2 className="w-4 h-4 text-[var(--color-text-muted)]" />
        </button>
      </div>

      {/* Timer Ring */}
      <div className="my-3">
        <CircularProgress
          value={progress}
          size={140}
          strokeWidth={5}
          color="#6366f1"
          trackColor="rgba(0,0,0,0.04)"
          animate={false}
        >
          <div className="flex flex-col items-center">
            <motion.span
              key={timeRemaining}
              initial={{ scale: 1.02 }}
              animate={{ scale: 1 }}
              className="text-[32px] font-bold text-[var(--color-text-primary)] tracking-tight tabular-nums leading-none"
            >
              {formatTime(timeRemaining)}
            </motion.span>
            <button className="flex items-center gap-1 mt-1.5 text-[11px] text-[var(--color-text-muted)] font-medium hover:text-[var(--color-text-secondary)] transition-colors">
              Deep Focus
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </CircularProgress>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-2">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100/60 hover:bg-gray-200/60 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-[var(--color-text-muted)]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRunning ? pause : start}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transition-shadow"
        >
          {isRunning ? (
            <Pause className="w-5 h-5" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100/60 hover:bg-gray-200/60 transition-colors"
        >
          <Settings2 className="w-4 h-4 text-[var(--color-text-muted)]" />
        </motion.button>
      </div>
    </GlassCard>
  );
}

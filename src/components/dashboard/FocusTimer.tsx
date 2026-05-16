import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { CircularProgress } from '../ui/CircularProgress';
import { useTimer } from '../../hooks/useTimer';
import { formatTime } from '../../lib/utils';

export function FocusTimer() {
  const { timeRemaining, isRunning, progress, start, pause, reset } = useTimer(1500);

  return (
    <GlassCard padding="lg" delay={0.35} className="flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4" style={{ borderBottom: '1px solid var(--color-hairline)', paddingBottom: 12 }}>
        <h3 className="text-[11px] font-bold tracking-[1.5px] uppercase text-white">
          FOCUS TIMER
        </h3>
      </div>

      {/* Timer Ring */}
      <div className="my-3">
        <CircularProgress
          value={progress}
          size={130}
          strokeWidth={4}
          color="#1c69d4"
          trackColor="var(--color-hairline)"
          animate={false}
        >
          <div className="flex flex-col items-center">
            <motion.span
              key={timeRemaining}
              initial={{ scale: 1.01 }}
              animate={{ scale: 1 }}
              className="text-[30px] font-bold text-white tracking-tight tabular-nums leading-none"
            >
              {formatTime(timeRemaining)}
            </motion.span>
            <button className="flex items-center gap-1 mt-2 text-[10px] font-bold tracking-[1px] uppercase" style={{ color: 'var(--color-text-muted)' }}>
              DEEP FOCUS
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </CircularProgress>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="w-8 h-8 flex items-center justify-center"
          style={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-hairline)' }}
        >
          <RotateCcw className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={isRunning ? pause : start}
          className="w-11 h-11 flex items-center justify-center text-white"
          style={{ background: 'var(--color-m-blue)' }}
        >
          {isRunning ? (
            <Pause className="w-5 h-5" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          )}
        </motion.button>
      </div>
    </GlassCard>
  );
}

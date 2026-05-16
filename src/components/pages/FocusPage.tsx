import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { CircularProgress } from '../ui/CircularProgress';
import { useTimer } from '../../hooks/useTimer';
import { Play, Pause, RotateCcw, Settings2, Coffee, Brain, Flame } from 'lucide-react';

const PRESETS = [
  { label: 'Deep Focus', minutes: 50, icon: <Brain className="w-4 h-4" />, color: '#6366f1' },
  { label: 'Pomodoro', minutes: 25, icon: <Flame className="w-4 h-4" />, color: '#22c55e' },
  { label: 'Short Sprint', minutes: 15, icon: <Play className="w-4 h-4" />, color: '#f59e0b' },
  { label: 'Break', minutes: 5, icon: <Coffee className="w-4 h-4" />, color: '#3b82f6' },
];

export function FocusPage() {
  const [selectedPreset, setSelectedPreset] = useState(1); // Pomodoro
  const [totalSessions, setTotalSessions] = useState(0);
  const duration = PRESETS[selectedPreset].minutes;
  const { timeLeft, isRunning, progress, start, pause, reset } = useTimer(duration);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleComplete = () => {
    setTotalSessions((p) => p + 1);
    reset();
  };

  // Auto-complete when timer hits 0
  if (timeLeft === 0 && isRunning) {
    handleComplete();
  }

  return (
    <div className="flex flex-col h-full p-5 gap-4 overflow-y-auto items-center justify-center">
      {/* Timer Card */}
      <GlassCard padding="lg" delay={0.05} className="w-full max-w-md text-center">
        <h1 className="text-[22px] font-bold text-[var(--color-text-primary)] mb-6">Focus Mode</h1>

        {/* Circular Timer */}
        <div className="flex justify-center mb-6">
          <CircularProgress value={progress} max={100} size={200} strokeWidth={8} color={PRESETS[selectedPreset].color}>
            <div className="flex flex-col items-center">
              <span className="text-[42px] font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-[12px] text-[var(--color-text-muted)]">
                {PRESETS[selectedPreset].label}
              </span>
            </div>
          </CircularProgress>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRunning ? pause : start}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: PRESETS[selectedPreset].color }}
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Session Counter */}
        <p className="text-[12px] text-[var(--color-text-muted)]">
          {totalSessions} sessions completed today
        </p>
      </GlassCard>

      {/* Presets */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-md">
        {PRESETS.map((preset, idx) => (
          <motion.button
            key={preset.label}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setSelectedPreset(idx); reset(); }}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
              selectedPreset === idx
                ? 'glass-heavy border-2'
                : 'glass hover:bg-white/50'
            }`}
            style={selectedPreset === idx ? { borderColor: preset.color + '40' } : {}}
          >
            <span style={{ color: preset.color }}>{preset.icon}</span>
            <span className="text-[11px] font-medium text-[var(--color-text-primary)]">
              {preset.label}
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">{preset.minutes}m</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

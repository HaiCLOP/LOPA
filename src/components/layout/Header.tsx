import { motion } from 'framer-motion';
import { Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { CircularProgress } from '../ui/CircularProgress';
import { userProfile, focusStreak, productivityScore as mockScore } from '../../data/mockData';
import { getGreeting, getScoreColor } from '../../lib/utils';
import { useProductivityScore } from '../../hooks/useTauri';

export function Header() {
  const greeting = getGreeting();
  const { data: liveScore } = useProductivityScore(15000);

  const score = liveScore?.score ? Math.round(liveScore.score) : mockScore;
  const label = liveScore?.label || 'Good';
  const scoreColor = getScoreColor(score);
  const isUp = score >= 60;

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex items-center justify-between px-2 pt-1 pb-3"
    >
      {/* Greeting */}
      <div>
        <h2 className="text-[22px] font-bold text-[var(--color-text-primary)] tracking-tight">
          {greeting.text}, {userProfile.firstName} {greeting.emoji}
        </h2>
        <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">
          Let's make today intentional and meaningful.
        </p>
      </div>

      {/* Right stats */}
      <div className="flex items-center gap-4">
        {/* Focus Streak */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass rounded-xl px-4 py-2.5 flex items-center gap-2.5"
        >
          <span className="text-base">🔥</span>
          <div>
            <p className="text-[10.5px] text-[var(--color-text-muted)] font-medium leading-none mb-0.5">
              Focus Streak
            </p>
            <p className="text-[14px] font-bold text-[var(--color-text-primary)] leading-none">
              {focusStreak} days
            </p>
          </div>
        </motion.div>

        {/* Productivity Score */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass rounded-xl px-4 py-2 flex items-center gap-3"
        >
          <CircularProgress
            value={score}
            size={42}
            strokeWidth={3.5}
            color={scoreColor}
            trackColor="rgba(0,0,0,0.05)"
          >
            <span className="text-[13px] font-bold text-[var(--color-text-primary)]">
              {score}
            </span>
          </CircularProgress>
          <div>
            <p className="text-[10.5px] text-[var(--color-text-muted)] font-medium leading-none mb-0.5">
              Productivity Score
            </p>
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-semibold" style={{ color: scoreColor }}>
                {label}
              </span>
              {isUp ? (
                <TrendingUp className="w-3 h-3" style={{ color: scoreColor }} />
              ) : (
                <TrendingDown className="w-3 h-3" style={{ color: scoreColor }} />
              )}
            </div>
          </div>
        </motion.div>

        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/60 transition-colors"
        >
          <Bell className="w-[18px] h-[18px] text-[var(--color-text-secondary)]" />
        </motion.button>
      </div>
    </motion.header>
  );
}

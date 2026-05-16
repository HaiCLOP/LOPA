import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Pause } from 'lucide-react';

interface TrackingBadgeProps {
  isTracking: boolean;
  onToggle: () => void;
}

export function TrackingBadge({ isTracking, onToggle }: TrackingBadgeProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <motion.button
          onClick={onToggle}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-bold tracking-[1.5px] uppercase cursor-pointer select-none"
          style={{
            background: 'transparent',
            border: `1px solid ${isTracking ? '#0fa336' : 'var(--color-hairline)'}`,
            color: isTracking ? '#0fa336' : 'var(--color-text-muted)',
          }}
        >
          {isTracking ? (
            <>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 bg-green-500" />
              </span>
              <Radio className="w-3 h-3" />
              TRACKING ACTIVE
            </>
          ) : (
            <>
              <Pause className="w-3 h-3" />
              TRACKING PAUSED
            </>
          )}
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}

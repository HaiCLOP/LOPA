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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11.5px] font-semibold
            transition-all duration-300 cursor-pointer select-none
            ${isTracking
              ? 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/60'
              : 'bg-gray-100/60 text-gray-500 border border-gray-200/40'
            }
          `}
        >
          {isTracking ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Radio className="w-3 h-3" />
              Tracking Active
            </>
          ) : (
            <>
              <Pause className="w-3 h-3" />
              Tracking Paused
            </>
          )}
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}

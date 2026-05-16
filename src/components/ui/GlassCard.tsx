import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'heavy' | 'light' | 'sidebar';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  delay?: number;
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export function GlassCard({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay,
        ease: 'easeOut',
      }}
      className={cn(paddingMap[padding], className)}
      style={{
        background: variant === 'heavy' ? 'var(--color-surface-elevated)' : 'var(--color-surface-card)',
        border: '1px solid var(--color-hairline)',
        borderRadius: 0,
      }}
    >
      {children}
    </motion.div>
  );
}

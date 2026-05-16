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
  const glassClass = {
    default: 'glass',
    heavy: 'glass-heavy',
    light: 'glass-light',
    sidebar: 'glass-sidebar',
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        glassClass,
        'rounded-2xl',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

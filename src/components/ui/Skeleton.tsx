import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  borderRadius?: string;
}

export function Skeleton({
  width = '100%',
  height = 16,
  className = '',
  borderRadius = '8px',
}: SkeletonProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 100%)',
        backgroundSize: '200% 100%',
      }}
      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton width={40} height={40} borderRadius="12px" />
        <div className="flex-1 space-y-2">
          <Skeleton height={12} width="60%" />
          <Skeleton height={10} width="40%" />
        </div>
      </div>
      <Skeleton height={24} width="50%" />
      <Skeleton height={8} width="80%" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <Skeleton height={14} width="30%" />
      <div className="flex items-end gap-1.5 h-[120px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            width="100%"
            height={`${20 + Math.random() * 80}%`}
            borderRadius="4px 4px 0 0"
          />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col h-full p-5 gap-3 overflow-hidden animate-pulse">
      <div className="flex justify-between items-center mb-2">
        <div className="space-y-2">
          <Skeleton height={24} width={280} />
          <Skeleton height={14} width={200} />
        </div>
        <div className="flex gap-3">
          <Skeleton width={120} height={42} borderRadius="12px" />
          <Skeleton width={120} height={42} borderRadius="12px" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-[1fr_320px] gap-3">
        <ChartSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

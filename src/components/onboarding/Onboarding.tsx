import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight, Shield, Brain, Clock, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: 'LOPA',
    subtitle: 'AI-POWERED DIGITAL WELLBEING',
    description: 'Understand your digital habits. Build healthier relationships with technology. Every byte stays on your machine.',
    icon: <Leaf className="w-8 h-8 text-white" />,
    accent: '#1c69d4',
  },
  {
    title: 'PRIVACY FIRST',
    subtitle: 'YOUR DATA STAYS LOCAL',
    description: 'All tracking and analytics happen on-device. No cloud. No telemetry. Zero data leaves your machine.',
    icon: <Shield className="w-8 h-8 text-white" />,
    accent: '#0fa336',
  },
  {
    title: 'AI INSIGHTS',
    subtitle: 'PATTERN DETECTION ENGINE',
    description: 'Our analytics engine detects focus patterns, identifies peak productivity windows, and generates actionable recommendations.',
    icon: <Brain className="w-8 h-8 text-white" />,
    accent: '#8b5cf6',
  },
  {
    title: 'MINDFUL FOCUS',
    subtitle: 'TIMER & BREAK REMINDERS',
    description: 'Pomodoro sessions. Focus streak tracking. Background break reminders every 50 minutes. Built for sustained performance.',
    icon: <Clock className="w-8 h-8 text-white" />,
    accent: '#e22718',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#000' }}>
      {/* M Stripe at top */}
      <div className="absolute top-0 left-0 right-0 m-stripe" />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex flex-col items-center text-center max-w-md px-8"
        >
          {/* Icon */}
          <motion.div
            className="w-16 h-16 flex items-center justify-center mb-8"
            style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {current.icon}
          </motion.div>

          {/* Title */}
          <h1 className="text-[32px] font-bold text-white tracking-[-0.3px] uppercase mb-2">
            {current.title}
          </h1>
          <p className="text-[11px] font-bold tracking-[2px] uppercase mb-6" style={{ color: current.accent }}>
            {current.subtitle}
          </p>
          <p className="text-[14px] font-light leading-relaxed mb-10 max-w-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {current.description}
          </p>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-[2px] transition-all duration-300"
                style={{
                  width: i === step ? 32 : 8,
                  background: i === step ? '#fff' : 'var(--color-hairline-strong)',
                }}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => isLast ? onComplete() : setStep(step + 1)}
            className="flex items-center gap-2 px-8 py-3 text-white text-[12px] font-bold tracking-[1.5px] uppercase"
            style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'transparent' }}
          >
            {isLast ? (
              <>
                <Check className="w-4 h-4" />
                GET STARTED
              </>
            ) : (
              <>
                CONTINUE
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          {/* Skip */}
          {!isLast && (
            <button
              onClick={onComplete}
              className="mt-4 text-[11px] tracking-[1px] uppercase transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Skip
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

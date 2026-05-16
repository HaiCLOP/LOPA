import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight, Shield, Brain, Clock, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: 'Welcome to Lopa',
    subtitle: 'Your AI-powered digital wellbeing companion',
    description: 'Lopa helps you understand your digital habits and build healthier relationships with technology.',
    icon: <Leaf className="w-10 h-10 text-white" />,
    gradient: 'from-emerald-400 to-teal-600',
  },
  {
    title: 'Privacy First',
    subtitle: 'Your data stays on your device',
    description: 'All tracking and analytics happen locally. No data ever leaves your machine — we believe privacy is a fundamental right.',
    icon: <Shield className="w-10 h-10 text-white" />,
    gradient: 'from-blue-400 to-indigo-600',
  },
  {
    title: 'AI-Powered Insights',
    subtitle: 'Smart recommendations tailored to you',
    description: 'Our analytics engine detects your focus patterns, identifies peak productivity windows, and suggests improvements.',
    icon: <Brain className="w-10 h-10 text-white" />,
    gradient: 'from-violet-400 to-purple-600',
  },
  {
    title: 'Mindful Focus',
    subtitle: 'Built-in focus timer and break reminders',
    description: 'Use Pomodoro sessions, track your focus streak, and get gentle reminders to take care of yourself.',
    icon: <Clock className="w-10 h-10 text-white" />,
    gradient: 'from-orange-400 to-rose-500',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col items-center text-center max-w-md px-8"
        >
          {/* Icon Circle */}
          <motion.div
            className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${current.gradient} flex items-center justify-center shadow-2xl mb-8`}
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {current.icon}
          </motion.div>

          {/* Title */}
          <h1 className="text-[28px] font-bold text-[var(--color-text-primary)] tracking-tight mb-2">
            {current.title}
          </h1>
          <p className="text-[15px] font-medium text-[var(--color-accent-indigo)] mb-4">
            {current.subtitle}
          </p>
          <p className="text-[14px] text-[var(--color-text-muted)] leading-relaxed mb-10 max-w-sm">
            {current.description}
          </p>

          {/* Dots */}
          <div className="flex gap-2 mb-8">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-8 bg-[var(--color-accent-indigo)]' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => isLast ? onComplete() : setStep(step + 1)}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-[14px] font-semibold shadow-lg bg-gradient-to-r ${current.gradient}`}
          >
            {isLast ? (
              <>
                <Check className="w-4 h-4" />
                Get Started
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          {/* Skip */}
          {!isLast && (
            <button
              onClick={onComplete}
              className="mt-4 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Skip introduction
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

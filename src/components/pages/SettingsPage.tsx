import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Shield, Eye, Clock, Bell, Trash2, Download, Palette, Moon, Sun, Monitor } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { showToast } from '../ui/Toast';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 ${
        enabled ? 'bg-[var(--color-accent-green)]' : 'bg-gray-300'
      }`}
    >
      <motion.div
        className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm"
        animate={{ left: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingRow({ icon, title, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-100/60 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100/80 flex items-center justify-center text-[var(--color-text-secondary)]">
          {icon}
        </div>
        <div>
          <p className="text-[13px] font-medium text-[var(--color-text-primary)]">{title}</p>
          <p className="text-[11px] text-[var(--color-text-muted)]">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

type ThemeOption = 'light' | 'dark' | 'system';

const themeOptions: { value: ThemeOption; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
  { value: 'system', label: 'System', icon: <Monitor className="w-3.5 h-3.5" /> },
];

export function SettingsPage() {
  const [autoTrack, setAutoTrack] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [breakReminders, setBreakReminders] = useState(true);
  const [blurTitles, setBlurTitles] = useState(false);
  const { theme, setTheme } = useAppStore();

  return (
    <div className="flex flex-col h-full p-5 gap-4 overflow-y-auto">
      <div className="mb-1">
        <h1 className="text-[22px] font-bold text-[var(--color-text-primary)]">Settings</h1>
        <p className="text-[13px] text-[var(--color-text-muted)]">Configure your Lopa experience</p>
      </div>

      {/* Privacy & Tracking */}
      <GlassCard padding="lg" delay={0.05}>
        <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Privacy & Tracking
        </h2>
        <SettingRow
          icon={<Eye className="w-4 h-4" />}
          title="Auto-start tracking"
          description="Begin tracking when Lopa launches"
        >
          <Toggle enabled={autoTrack} onToggle={() => setAutoTrack(!autoTrack)} />
        </SettingRow>
        <SettingRow
          icon={<Shield className="w-4 h-4" />}
          title="Blur window titles"
          description="Hide sensitive titles in activity logs"
        >
          <Toggle enabled={blurTitles} onToggle={() => setBlurTitles(!blurTitles)} />
        </SettingRow>
      </GlassCard>

      {/* Notifications */}
      <GlassCard padding="lg" delay={0.1}>
        <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
          <Bell className="w-4 h-4" /> Notifications
        </h2>
        <SettingRow
          icon={<Bell className="w-4 h-4" />}
          title="Insight notifications"
          description="Get notified when new insights are available"
        >
          <Toggle enabled={notifications} onToggle={() => setNotifications(!notifications)} />
        </SettingRow>
        <SettingRow
          icon={<Clock className="w-4 h-4" />}
          title="Break reminders"
          description="Remind me to take breaks every 50 minutes"
        >
          <Toggle enabled={breakReminders} onToggle={() => setBreakReminders(!breakReminders)} />
        </SettingRow>
      </GlassCard>

      {/* Appearance */}
      <GlassCard padding="lg" delay={0.15}>
        <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Appearance
        </h2>
        <div className="mt-3">
          <p className="text-[12px] text-[var(--color-text-muted)] mb-2">Theme</p>
          <div className="flex gap-2">
            {themeOptions.map((opt) => (
              <motion.button
                key={opt.value}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setTheme(opt.value);
                  showToast(`Theme set to ${opt.label}`, 'success');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all ${
                  theme === opt.value
                    ? 'bg-[var(--color-accent-indigo)] text-white shadow-md'
                    : 'glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                {opt.icon}
                {opt.label}
              </motion.button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Data Management */}
      <GlassCard padding="lg" delay={0.2}>
        <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
          <Download className="w-4 h-4" /> Data Management
        </h2>
        <div className="flex gap-3 mt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => showToast('Data exported successfully', 'success')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent-indigo)]/10 text-[var(--color-accent-indigo)] text-[12px] font-medium hover:bg-[var(--color-accent-indigo)]/15 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Data
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => showToast('This action cannot be undone', 'warning')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-[12px] font-medium hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Data
          </motion.button>
        </div>
      </GlassCard>

      {/* Version */}
      <div className="text-center py-2">
        <p className="text-[11px] text-[var(--color-text-muted)]">Lopa v0.2.0 • Phase 4</p>
      </div>
    </div>
  );
}

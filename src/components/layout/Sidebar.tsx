import { motion } from 'framer-motion';
import {
  Home, Target, BarChart3, Activity, Flag,
  Sparkles, FileText, Settings, Leaf,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { navItems, userProfile } from '../../data/mockData';

const iconMap: Record<string, React.ElementType> = {
  Home, Target, BarChart3, Activity, Flag,
  Sparkles, FileText, Settings,
};

export function Sidebar() {
  const { activeNav, setActiveNav } = useAppStore();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass-sidebar flex flex-col w-[230px] h-full flex-shrink-0 py-5 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md">
          <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-[var(--color-text-primary)] tracking-tight">Lopa</h1>
          <p className="text-[10px] text-[var(--color-text-muted)] font-medium tracking-wide">Digital Wellbeing</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || Home;
          const isActive = activeNav === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`nav-item w-full ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && <span className="badge-new">{item.badge}</span>}
            </motion.button>
          );
        })}
      </nav>

      {/* Upgrade Card */}
      <div className="mx-3 mt-4 mb-3">
        <div className="rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/60 border border-gray-200/50 p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/80 border border-gray-200/50 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[13px] font-semibold text-[var(--color-text-primary)] mb-0.5">Lopa Pro</p>
          <p className="text-[10.5px] text-[var(--color-text-muted)] mb-3 leading-snug">
            Unlock the full potential of your digital wellbeing.
          </p>
          <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[12px] font-semibold shadow-sm hover:shadow-md transition-shadow">
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-4 pt-3 border-t border-gray-200/40">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-pink-400 flex items-center justify-center text-white text-[13px] font-bold shadow-sm">
            {userProfile.firstName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">
                {userProfile.name}
              </p>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                Pro
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)]">View Profile</p>
          </div>
          <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.aside>
  );
}

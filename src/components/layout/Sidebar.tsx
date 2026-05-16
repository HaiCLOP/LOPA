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
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col w-[220px] h-full flex-shrink-0 overflow-hidden"
      style={{
        background: 'var(--color-surface-soft)',
        borderRight: '1px solid var(--color-hairline)',
      }}
    >
      {/* Logo + M Stripe */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 flex items-center justify-center" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
            <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[14px] font-bold text-white tracking-[1.5px] uppercase">LOPA</h1>
            <p className="text-[9px] tracking-[1.5px] uppercase" style={{ color: 'var(--color-text-muted)' }}>DIGITAL WELLBEING</p>
          </div>
        </div>
        {/* M Stripe */}
        <div className="m-stripe w-full" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || Home;
          const isActive = activeNav === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              whileTap={{ scale: 0.98 }}
              className={`nav-item w-full ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-[16px] h-[16px] flex-shrink-0" strokeWidth={isActive ? 2.2 : 1.5} />
              <span className="flex-1 text-left text-[13px]">{item.label}</span>
              {item.badge && <span className="badge-new">{item.badge}</span>}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom User */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid var(--color-hairline)' }}>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 flex items-center justify-center text-[12px] font-bold text-white" style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-hairline)' }}>
            {userProfile.firstName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-white truncate tracking-wide uppercase">
              {userProfile.name}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>v0.2.0</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

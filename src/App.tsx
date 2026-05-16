import { AppLayout } from './components/layout/AppLayout';
import { Header } from './components/layout/Header';
import { StatCardsRow } from './components/dashboard/StatCard';
import { ActivityChart } from './components/dashboard/ActivityChart';
import { TopApps } from './components/dashboard/TopApps';
import { AIInsight } from './components/dashboard/AIInsight';
import { FocusTimer } from './components/dashboard/FocusTimer';
import { AICoach } from './components/dashboard/AICoach';
import { WellbeingScore } from './components/dashboard/WellbeingScore';
import { TrackingBadge } from './components/dashboard/TrackingBadge';
import { statCards } from './data/mockData';
import { useDailyStats, useTrackingControl } from './hooks/useTauri';
import type { StatCardData } from './types';

function Dashboard() {
  const { data: liveStats } = useDailyStats(10000);
  const { isTracking, toggle, isTauriApp } = useTrackingControl();

  // Merge live stats into stat cards when available
  const displayCards: StatCardData[] = liveStats
    ? [
        {
          ...statCards[0],
          value: liveStats.screen_time || statCards[0].value,
        },
        {
          ...statCards[1],
          value: liveStats.focus_time || statCards[1].value,
        },
        {
          ...statCards[2],
          value: liveStats.break_time || statCards[2].value,
        },
        {
          ...statCards[3],
          value: String(liveStats.app_switches) || statCards[3].value,
        },
      ]
    : statCards;

  return (
    <div className="flex flex-col h-full p-5 gap-3 overflow-y-auto">
      {/* Header */}
      <Header />

      {/* Tracking Status Badge (only in Tauri) */}
      {isTauriApp && (
        <TrackingBadge isTracking={isTracking} onToggle={toggle} />
      )}

      {/* Stat Cards Row */}
      <StatCardsRow cards={displayCards} />

      {/* Middle Section: Activity Chart + Top Apps */}
      <div className="grid grid-cols-[1fr_320px] gap-3">
        <ActivityChart />
        <TopApps />
      </div>

      {/* Bottom Section: AI Insight + Focus Timer + AI Coach */}
      <div className="grid grid-cols-3 gap-3">
        <AIInsight />
        <FocusTimer />
        <AICoach />
      </div>

      {/* Wellbeing Score Bar */}
      <WellbeingScore />
    </div>
  );
}

export default function App() {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}

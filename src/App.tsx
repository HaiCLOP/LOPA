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
import { SettingsPage } from './components/pages/SettingsPage';
import { InsightsPage } from './components/pages/InsightsPage';
import { ActivityPage } from './components/pages/ActivityPage';
import { FocusPage } from './components/pages/FocusPage';
import { GoalsPage } from './components/pages/GoalsPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { CoachPage } from './components/pages/CoachPage';
import { statCards } from './data/mockData';
import { useDailyStats, useTrackingControl } from './hooks/useTauri';
import { useAppStore } from './stores/appStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ToastContainer } from './components/ui/Toast';
import type { StatCardData } from './types';

function Dashboard() {
  const { data: liveStats } = useDailyStats(10000);
  const { isTracking, toggle, isTauriApp } = useTrackingControl();

  const displayCards: StatCardData[] = liveStats
    ? [
        { ...statCards[0], value: liveStats.screen_time || statCards[0].value },
        { ...statCards[1], value: liveStats.focus_time || statCards[1].value },
        { ...statCards[2], value: liveStats.break_time || statCards[2].value },
        { ...statCards[3], value: String(liveStats.app_switches) || statCards[3].value },
      ]
    : statCards;

  return (
    <div className="flex flex-col h-full p-5 gap-3 overflow-y-auto">
      <Header />
      {isTauriApp && <TrackingBadge isTracking={isTracking} onToggle={toggle} />}
      <StatCardsRow cards={displayCards} />
      <div className="grid grid-cols-[1fr_320px] gap-3">
        <ActivityChart />
        <TopApps />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <AIInsight />
        <FocusTimer />
        <AICoach />
      </div>
      <WellbeingScore />
    </div>
  );
}

function CurrentPage() {
  const { activeNav } = useAppStore();

  switch (activeNav) {
    case 'focus':
      return <FocusPage />;
    case 'insights':
      return <InsightsPage />;
    case 'activity':
      return <ActivityPage />;
    case 'goals':
      return <GoalsPage />;
    case 'ai-coach':
      return <CoachPage />;
    case 'reports':
      return <ReportsPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <Dashboard />;
  }
}

export default function App() {
  useKeyboardShortcuts();

  return (
    <AppLayout>
      <CurrentPage />
      <ToastContainer />
    </AppLayout>
  );
}

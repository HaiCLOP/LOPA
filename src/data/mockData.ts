import type {
  StatCardData,
  AppUsage,
  ActivityDataPoint,
  AIInsightData,
  ChatMessage,
  WellbeingData,
  UserProfile,
  NavItem,
} from '../types';

/* ═══════════════════════════════════════════
   USER PROFILE
   ═══════════════════════════════════════════ */

export const userProfile: UserProfile = {
  name: 'Arjun Sharma',
  firstName: 'Arjun',
  avatar: '',
  plan: 'pro',
};

/* ═══════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════ */

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Home' },
  { id: 'focus', label: 'Focus', icon: 'Target' },
  { id: 'insights', label: 'Insights', icon: 'BarChart3' },
  { id: 'activity', label: 'Activity', icon: 'Activity' },
  { id: 'goals', label: 'Goals', icon: 'Flag' },
  { id: 'ai-coach', label: 'AI Coach', icon: 'Sparkles', badge: 'NEW' },
  { id: 'reports', label: 'Reports', icon: 'FileText' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];

/* ═══════════════════════════════════════════
   STAT CARDS
   ═══════════════════════════════════════════ */

export const statCards: StatCardData[] = [
  {
    id: 'screen-time',
    label: 'Screen Time',
    value: '5h 42m',
    icon: 'Clock',
    trend: 'down',
    trendValue: '8%',
    trendLabel: 'from yesterday',
    sparklineData: [30, 45, 38, 52, 48, 55, 42, 60, 55, 48, 42, 38],
    color: '#6366f1',
  },
  {
    id: 'focus-time',
    label: 'Focus Time',
    value: '2h 15m',
    icon: 'Target',
    trend: 'up',
    trendValue: '18%',
    trendLabel: 'from yesterday',
    sparklineData: [20, 25, 30, 28, 35, 40, 38, 42, 45, 48, 50, 55],
    color: '#22c55e',
  },
  {
    id: 'break-time',
    label: 'Break Time',
    value: '45m',
    icon: 'Coffee',
    trend: 'neutral',
    trendValue: '',
    trendLabel: 'Good balance',
    sparklineData: [15, 18, 12, 20, 16, 22, 18, 14, 20, 16, 18, 15],
    color: '#3b82f6',
  },
  {
    id: 'app-switches',
    label: 'App Switches',
    value: '87',
    icon: 'ArrowLeftRight',
    trend: 'down',
    trendValue: '15%',
    trendLabel: 'from yesterday',
    sparklineData: [50, 45, 55, 60, 52, 48, 42, 55, 50, 45, 40, 38],
    color: '#f59e0b',
  },
];

/* ═══════════════════════════════════════════
   ACTIVITY CHART DATA
   ═══════════════════════════════════════════ */

export const activityData: ActivityDataPoint[] = [
  { hour: '12 AM', productive: 0, communication: 0, entertainment: 0, other: 0 },
  { hour: '1 AM', productive: 0, communication: 0, entertainment: 0, other: 0 },
  { hour: '2 AM', productive: 0, communication: 0, entertainment: 0, other: 0 },
  { hour: '3 AM', productive: 0, communication: 0, entertainment: 0, other: 0 },
  { hour: '4 AM', productive: 0, communication: 0, entertainment: 0, other: 0 },
  { hour: '5 AM', productive: 0, communication: 0, entertainment: 0, other: 0 },
  { hour: '6 AM', productive: 5, communication: 0, entertainment: 0, other: 2 },
  { hour: '7 AM', productive: 10, communication: 5, entertainment: 0, other: 3 },
  { hour: '8 AM', productive: 25, communication: 8, entertainment: 2, other: 5 },
  { hour: '9 AM', productive: 35, communication: 12, entertainment: 3, other: 5 },
  { hour: '10 AM', productive: 42, communication: 8, entertainment: 2, other: 3 },
  { hour: '11 AM', productive: 38, communication: 10, entertainment: 5, other: 4 },
  { hour: '12 PM', productive: 15, communication: 12, entertainment: 18, other: 8 },
  { hour: '1 PM', productive: 20, communication: 8, entertainment: 10, other: 5 },
  { hour: '2 PM', productive: 40, communication: 6, entertainment: 2, other: 4 },
  { hour: '3 PM', productive: 45, communication: 5, entertainment: 3, other: 2 },
  { hour: '4 PM', productive: 38, communication: 10, entertainment: 5, other: 4 },
  { hour: '5 PM', productive: 20, communication: 15, entertainment: 8, other: 6 },
  { hour: '6 PM', productive: 10, communication: 8, entertainment: 20, other: 5 },
  { hour: '7 PM', productive: 5, communication: 10, entertainment: 25, other: 8 },
  { hour: '8 PM', productive: 30, communication: 5, entertainment: 10, other: 3 },
  { hour: '9 PM', productive: 35, communication: 3, entertainment: 8, other: 2 },
  { hour: '10 PM', productive: 15, communication: 2, entertainment: 15, other: 5 },
  { hour: '11 PM', productive: 5, communication: 0, entertainment: 10, other: 3 },
];

/* ═══════════════════════════════════════════
   TOP APPS
   ═══════════════════════════════════════════ */

export const topApps: AppUsage[] = [
  { name: 'VS Code', duration: '1h 32m', minutes: 92, color: '#007ACC', icon: 'vscode', category: 'productive' },
  { name: 'Chrome', duration: '1h 08m', minutes: 68, color: '#4285F4', icon: 'chrome', category: 'productive' },
  { name: 'Figma', duration: '45m', minutes: 45, color: '#A259FF', icon: 'figma', category: 'productive' },
  { name: 'Spotify', duration: '32m', minutes: 32, color: '#1DB954', icon: 'spotify', category: 'entertainment' },
  { name: 'Discord', duration: '28m', minutes: 28, color: '#5865F2', icon: 'discord', category: 'communication' },
];

/* ═══════════════════════════════════════════
   AI INSIGHT
   ═══════════════════════════════════════════ */

export const aiInsight: AIInsightData = {
  id: '1',
  title: 'Peak Productivity Window',
  description: 'Consider planning your deep work during this time.',
  timeRange: '8:20 PM – 10:15 PM',
  type: 'productivity',
};

/* ═══════════════════════════════════════════
   AI COACH MESSAGES
   ═══════════════════════════════════════════ */

export const coachMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'ai',
    content: 'How was your focus yesterday?',
    timestamp: '10:25 AM',
  },
  {
    id: '2',
    role: 'ai',
    content: 'You had 3 distraction spikes between 2–4 PM. Want me to help you avoid that pattern today?',
    timestamp: '10:25 AM',
  },
];

/* ═══════════════════════════════════════════
   WELLBEING
   ═══════════════════════════════════════════ */

export const wellbeingData: WellbeingData = {
  score: 82,
  label: 'Great',
  description: 'This score reflects your digital balance and habits.',
  metrics: [
    { id: 'sleep', label: 'Sleep', value: '7h 15m', status: 'good', icon: 'Moon' },
    { id: 'physical', label: 'Physical Activity', value: '45m', status: 'good', icon: 'Heart' },
    { id: 'breaks', label: 'Mindful Breaks', value: '6', status: 'great', icon: 'Leaf' },
    { id: 'screen', label: 'Screen Balance', value: 'Good', status: 'good', icon: 'Monitor' },
  ],
};

/* ═══════════════════════════════════════════
   DASHBOARD STATS
   ═══════════════════════════════════════════ */

export const focusStreak = 12;
export const productivityScore = 76;

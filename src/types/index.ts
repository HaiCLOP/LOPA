/* ═══════════════════════════════════════════
   LOPA — TypeScript Interfaces
   ═══════════════════════════════════════════ */

export interface StatCardData {
  id: string;
  label: string;
  value: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  trendLabel: string;
  sparklineData: number[];
  color: string;
}

export interface AppUsage {
  name: string;
  duration: string;
  minutes: number;
  color: string;
  icon: string;
  category: AppCategory;
}

export type AppCategory = 'productive' | 'communication' | 'entertainment' | 'other';

export interface ActivityDataPoint {
  hour: string;
  productive: number;
  communication: number;
  entertainment: number;
  other: number;
}

export interface AIInsightData {
  id: string;
  title: string;
  description: string;
  timeRange: string;
  type: 'productivity' | 'focus' | 'wellbeing' | 'distraction';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'assistant';
  content: string;
  timestamp: string | Date;
}

export interface WellbeingMetric {
  id: string;
  label: string;
  value: string;
  status: 'great' | 'good' | 'fair' | 'poor';
  icon: string;
}

export interface WellbeingData {
  score: number;
  label: string;
  description: string;
  metrics: WellbeingMetric[];
}

export interface UserProfile {
  name: string;
  firstName: string;
  avatar: string;
  plan: 'free' | 'pro';
}

export interface FocusSession {
  duration: number;
  remaining: number;
  isRunning: boolean;
  mode: string;
}

export type NavItem = {
  id: string;
  label: string;
  icon: string;
  badge?: string;
};

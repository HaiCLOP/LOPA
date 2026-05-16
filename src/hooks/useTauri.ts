import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════
// Types matching Rust response structs
// ═══════════════════════════════════════════

export interface LiveDailyStats {
  screen_time: string;
  screen_time_minutes: number;
  focus_time: string;
  focus_time_minutes: number;
  break_time: string;
  break_time_minutes: number;
  app_switches: number;
  total_apps: number;
}

export interface LiveAppUsage {
  app_name: string;
  total_minutes: number;
  category: string;
  color: string;
  icon: string;
}

export interface LiveHourlyActivity {
  hour: string;
  productive: number;
  communication: number;
  entertainment: number;
  other: number;
}

export interface LiveActivityRecord {
  id: number;
  app_name: string;
  window_title: string;
  exe_path: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  category: string;
  date: string;
}

export interface TrackingStatus {
  is_tracking: boolean;
  current_app: string | null;
}

// ═══════════════════════════════════════════
// Detect if running inside Tauri
// ═══════════════════════════════════════════

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

// ═══════════════════════════════════════════
// Generic polling hook
// ═══════════════════════════════════════════

function usePolling<T>(
  fetcher: () => Promise<T>,
  intervalMs: number = 5000,
  enabled: boolean = true,
): { data: T | null; error: string | null; loading: boolean; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch = useCallback(async () => {
    try {
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    fetch();
    intervalRef.current = setInterval(fetch, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetch, intervalMs, enabled]);

  return { data, error, loading, refetch: fetch };
}

// ═══════════════════════════════════════════
// Tracking control hooks
// ═══════════════════════════════════════════

export function useTrackingControl() {
  const [isTracking, setIsTracking] = useState(false);
  const tauri = isTauri();

  useEffect(() => {
    if (!tauri) return;
    invoke<TrackingStatus>('get_tracking_status').then((status) => {
      setIsTracking(status.is_tracking);
    });
  }, [tauri]);

  const start = useCallback(async () => {
    if (!tauri) return;
    await invoke('start_tracking');
    setIsTracking(true);
  }, [tauri]);

  const stop = useCallback(async () => {
    if (!tauri) return;
    await invoke('stop_tracking');
    setIsTracking(false);
  }, [tauri]);

  const toggle = useCallback(async () => {
    if (isTracking) await stop();
    else await start();
  }, [isTracking, start, stop]);

  return { isTracking, start, stop, toggle, isTauriApp: tauri };
}

// ═══════════════════════════════════════════
// Data hooks
// ═══════════════════════════════════════════

export function useDailyStats(refreshInterval: number = 10000) {
  const tauri = isTauri();
  const fetcher = useCallback(async () => {
    return invoke<LiveDailyStats>('get_daily_stats', { date: null });
  }, []);
  return usePolling(fetcher, refreshInterval, tauri);
}

export function useTopApps(refreshInterval: number = 15000) {
  const tauri = isTauri();
  const fetcher = useCallback(async () => {
    return invoke<LiveAppUsage[]>('get_top_apps', { date: null, limit: 5 });
  }, []);
  return usePolling(fetcher, refreshInterval, tauri);
}

export function useHourlyActivity(refreshInterval: number = 30000) {
  const tauri = isTauri();
  const fetcher = useCallback(async () => {
    return invoke<LiveHourlyActivity[]>('get_hourly_activity', { date: null });
  }, []);
  return usePolling(fetcher, refreshInterval, tauri);
}

export function useRecentActivity(refreshInterval: number = 10000) {
  const tauri = isTauri();
  const fetcher = useCallback(async () => {
    return invoke<LiveActivityRecord[]>('get_recent_activity', { date: null, limit: 20 });
  }, []);
  return usePolling(fetcher, refreshInterval, tauri);
}

// ═══════════════════════════════════════════
// Analytics types
// ═══════════════════════════════════════════

export interface ProductivityScore {
  score: number;
  label: string;
  productive_pct: number;
  communication_pct: number;
  entertainment_pct: number;
  other_pct: number;
  focus_ratio: number;
  switch_penalty: number;
}

export interface WellbeingFactor {
  id: string;
  label: string;
  value: string;
  status: string;
  weight: number;
}

export interface WellbeingAssessment {
  score: number;
  label: string;
  description: string;
  factors: WellbeingFactor[];
}

export interface FocusPattern {
  peak_start_hour: number;
  peak_end_hour: number;
  avg_focus_duration_min: number;
  longest_streak_min: number;
  distraction_count: number;
}

export interface InsightData {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  action: string | null;
  icon: string;
}

export interface RecommendationData {
  id: string;
  text: string;
  reasoning: string;
  impact: string;
}

// ═══════════════════════════════════════════
// Analytics hooks
// ═══════════════════════════════════════════

export function useProductivityScore(refreshInterval: number = 15000) {
  const tauri = isTauri();
  const fetcher = useCallback(async () => {
    return invoke<ProductivityScore>('get_productivity_score', { date: null });
  }, []);
  return usePolling(fetcher, refreshInterval, tauri);
}

export function useWellbeingScore(refreshInterval: number = 20000) {
  const tauri = isTauri();
  const fetcher = useCallback(async () => {
    return invoke<WellbeingAssessment>('get_wellbeing_score', { date: null });
  }, []);
  return usePolling(fetcher, refreshInterval, tauri);
}

export function useFocusPatterns(refreshInterval: number = 30000) {
  const tauri = isTauri();
  const fetcher = useCallback(async () => {
    return invoke<FocusPattern>('get_focus_patterns', { date: null });
  }, []);
  return usePolling(fetcher, refreshInterval, tauri);
}

export function useInsights(refreshInterval: number = 30000) {
  const tauri = isTauri();
  const fetcher = useCallback(async () => {
    return invoke<InsightData[]>('get_insights', { date: null });
  }, []);
  return usePolling(fetcher, refreshInterval, tauri);
}

export function useRecommendations(refreshInterval: number = 30000) {
  const tauri = isTauri();
  const fetcher = useCallback(async () => {
    return invoke<RecommendationData[]>('get_recommendations', { date: null });
  }, []);
  return usePolling(fetcher, refreshInterval, tauri);
}


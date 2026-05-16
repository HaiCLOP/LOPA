use crate::database::{AppUsageSummary, HourlyActivity, ActivityRecord, Database};
use crate::tracker::Tracker;
use chrono::Local;
use serde::Serialize;
use std::sync::Arc;
use tauri::State;

// ═══════════════════════════════════════════
// App State — shared across all commands
// ═══════════════════════════════════════════

pub struct AppState {
    pub db: Arc<Database>,
    pub tracker: Tracker,
}

// ═══════════════════════════════════════════
// Response types
// ═══════════════════════════════════════════

#[derive(Serialize)]
pub struct TrackingStatus {
    pub is_tracking: bool,
    pub current_app: Option<String>,
}

#[derive(Serialize)]
pub struct FormatttedStats {
    pub screen_time: String,
    pub screen_time_minutes: f64,
    pub focus_time: String,
    pub focus_time_minutes: f64,
    pub break_time: String,
    pub break_time_minutes: f64,
    pub app_switches: i64,
    pub total_apps: i64,
}

fn format_duration(minutes: f64) -> String {
    let h = (minutes / 60.0).floor() as i64;
    let m = (minutes % 60.0).round() as i64;
    if h > 0 {
        format!("{}h {}m", h, m)
    } else {
        format!("{}m", m)
    }
}

// ═══════════════════════════════════════════
// Tauri Commands
// ═══════════════════════════════════════════

#[tauri::command]
pub fn start_tracking(state: State<AppState>) -> Result<bool, String> {
    if state.tracker.is_running() {
        return Ok(true);
    }
    state.tracker.start(state.db.clone());
    Ok(true)
}

#[tauri::command]
pub fn stop_tracking(state: State<AppState>) -> Result<bool, String> {
    state.tracker.stop();
    Ok(false)
}

#[tauri::command]
pub fn get_tracking_status(state: State<AppState>) -> Result<TrackingStatus, String> {
    Ok(TrackingStatus {
        is_tracking: state.tracker.is_running(),
        current_app: None,
    })
}

#[tauri::command]
pub fn get_daily_stats(state: State<AppState>, date: Option<String>) -> Result<FormatttedStats, String> {
    let date = date.unwrap_or_else(|| Local::now().format("%Y-%m-%d").to_string());
    let stats = state.db.get_daily_stats(&date).map_err(|e| e.to_string())?;

    Ok(FormatttedStats {
        screen_time: format_duration(stats.screen_time_minutes),
        screen_time_minutes: stats.screen_time_minutes,
        focus_time: format_duration(stats.focus_time_minutes),
        focus_time_minutes: stats.focus_time_minutes,
        break_time: format_duration(stats.break_time_minutes),
        break_time_minutes: stats.break_time_minutes,
        app_switches: stats.app_switches,
        total_apps: stats.total_apps,
    })
}

#[tauri::command]
pub fn get_top_apps(state: State<AppState>, date: Option<String>, limit: Option<i64>) -> Result<Vec<AppUsageSummary>, String> {
    let date = date.unwrap_or_else(|| Local::now().format("%Y-%m-%d").to_string());
    let limit = limit.unwrap_or(5);
    state.db.get_top_apps(&date, limit).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_hourly_activity(state: State<AppState>, date: Option<String>) -> Result<Vec<HourlyActivity>, String> {
    let date = date.unwrap_or_else(|| Local::now().format("%Y-%m-%d").to_string());
    state.db.get_hourly_activity(&date).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_recent_activity(state: State<AppState>, date: Option<String>, limit: Option<i64>) -> Result<Vec<ActivityRecord>, String> {
    let date = date.unwrap_or_else(|| Local::now().format("%Y-%m-%d").to_string());
    let limit = limit.unwrap_or(20);
    state.db.get_recent_activity(&date, limit).map_err(|e| e.to_string())
}

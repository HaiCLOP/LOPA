use crate::database::Database;
use serde::Serialize;
use std::sync::Arc;

#[derive(Debug, Serialize)]
pub struct ExportData {
    pub exported_at: String,
    pub total_records: usize,
    pub date_range: String,
    pub summary: ExportSummary,
    pub activities: Vec<ExportActivity>,
}

#[derive(Debug, Serialize)]
pub struct ExportSummary {
    pub screen_time_minutes: f64,
    pub focus_time_minutes: f64,
    pub break_time_minutes: f64,
    pub app_switches: i64,
    pub unique_apps: i64,
}

#[derive(Debug, Serialize)]
pub struct ExportActivity {
    pub app_name: String,
    pub category: String,
    pub total_minutes: f64,
    pub sessions: i64,
}

/// Exports a complete daily summary including stats and per-app breakdown.
pub fn export_daily_summary(db: &Arc<Database>, date: &str) -> ExportData {
    let top_apps = db.get_top_apps(date, 100).unwrap_or_default();
    let daily_stats = db.get_daily_stats(date).unwrap_or_default();

    let activities: Vec<ExportActivity> = top_apps
        .iter()
        .map(|app| ExportActivity {
            app_name: app.app_name.clone(),
            category: app.category.clone(),
            total_minutes: app.total_minutes,
            sessions: 1,
        })
        .collect();

    let total = activities.len();

    ExportData {
        exported_at: chrono::Local::now().format("%Y-%m-%dT%H:%M:%S").to_string(),
        total_records: total,
        date_range: date.to_string(),
        summary: ExportSummary {
            screen_time_minutes: daily_stats.screen_time_minutes,
            focus_time_minutes: daily_stats.focus_time_minutes,
            break_time_minutes: daily_stats.break_time_minutes,
            app_switches: daily_stats.app_switches,
            unique_apps: daily_stats.total_apps,
        },
        activities,
    }
}

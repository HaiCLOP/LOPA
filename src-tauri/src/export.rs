use crate::database::Database;
use serde::Serialize;
use std::sync::Arc;

#[derive(Debug, Serialize)]
pub struct ExportData {
    pub exported_at: String,
    pub total_records: usize,
    pub date_range: String,
    pub activities: Vec<ExportActivity>,
}

#[derive(Debug, Serialize)]
pub struct ExportActivity {
    pub app_name: String,
    pub category: String,
    pub total_minutes: f64,
    pub sessions: i64,
}

pub fn export_daily_summary(db: &Arc<Database>, date: &str) -> ExportData {
    let top_apps = db.get_top_apps(date, 100).unwrap_or_default();

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
        activities,
    }
}

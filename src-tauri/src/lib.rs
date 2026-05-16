mod analytics;
mod categories;
mod commands;
mod database;
mod export;
mod insights;
mod tracker;

use commands::AppState;
use database::Database;
use tracker::Tracker;
use tauri::Manager;
use std::sync::Arc;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data directory");

            let db = Database::new(app_data_dir)
                .expect("Failed to initialize database");
            let db = Arc::new(db);
            let tracker = Tracker::new();
            tracker.start(db.clone());

            app.manage(AppState { db, tracker });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::start_tracking,
            commands::stop_tracking,
            commands::get_tracking_status,
            commands::get_daily_stats,
            commands::get_top_apps,
            commands::get_hourly_activity,
            commands::get_recent_activity,
            commands::get_productivity_score,
            commands::get_wellbeing_score,
            commands::get_focus_patterns,
            commands::get_insights,
            commands::get_recommendations,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Lopa");
}

mod categories;
mod commands;
mod database;
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
            // Initialize database in the app's data directory
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data directory");

            let db = Database::new(app_data_dir)
                .expect("Failed to initialize database");

            let db = Arc::new(db);
            let tracker = Tracker::new();

            // Auto-start tracking on launch
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running Lopa");
}

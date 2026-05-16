mod analytics;
mod categories;
mod commands;
mod database;
mod export;
mod insights;
mod reminders;
mod tracker;

use commands::AppState;
use database::Database;
use reminders::BreakReminder;
use tracker::Tracker;
use tauri::{
    Manager,
    menu::{Menu, MenuItem},
    tray::TrayIconEvent,
};
use std::sync::Arc;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Database + tracking
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data directory");

            let db = Database::new(app_data_dir)
                .expect("Failed to initialize database");
            let db = Arc::new(db);
            let tracker = Tracker::new();
            tracker.start(db.clone());

            // Break reminders (50 minute intervals)
            let break_reminder = BreakReminder::new(50);
            break_reminder.start(app.handle().clone());

            app.manage(AppState { db, tracker });

            // System tray menu
            let handle = app.handle();
            if let Some(tray) = handle.tray_icon_by_id("main-tray") {
                let show_item = MenuItem::with_id(handle, "show", "Show Lopa", true, None::<&str>)?;
                let pause_item = MenuItem::with_id(handle, "pause", "Pause Tracking", true, None::<&str>)?;
                let quit_item = MenuItem::with_id(handle, "quit", "Quit", true, None::<&str>)?;

                let menu = Menu::with_items(handle, &[&show_item, &pause_item, &quit_item])?;
                tray.set_menu(Some(menu))?;
                tray.set_show_menu_on_left_click(false)?;

                let app_handle = handle.clone();
                tray.on_menu_event(move |_app, event| {
                    match event.id.as_ref() {
                        "show" => {
                            if let Some(window) = app_handle.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "quit" => {
                            std::process::exit(0);
                        }
                        _ => {}
                    }
                });

                let app_handle2 = handle.clone();
                tray.on_tray_icon_event(move |_tray, event| {
                    if let TrayIconEvent::Click { button, .. } = event {
                        if button == tauri::tray::MouseButton::Left {
                            if let Some(window) = app_handle2.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                });
            }

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
            commands::export_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Lopa");
}

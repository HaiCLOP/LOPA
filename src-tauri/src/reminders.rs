use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use std::thread;
use std::time::Duration;
use tauri::Emitter;

/// Monitors continuous work sessions and emits break reminders.
/// Sends a Tauri event when the user has been active beyond the threshold.
pub struct BreakReminder {
    running: Arc<AtomicBool>,
    interval_minutes: u64,
}

impl BreakReminder {
    pub fn new(interval_minutes: u64) -> Self {
        Self {
            running: Arc::new(AtomicBool::new(false)),
            interval_minutes,
        }
    }

    /// Start the break reminder loop in a background thread.
    /// Emits "break-reminder" events through the Tauri app handle.
    pub fn start(&self, app_handle: tauri::AppHandle) {
        if self.running.load(Ordering::SeqCst) {
            return; // Already running
        }

        self.running.store(true, Ordering::SeqCst);
        let running = self.running.clone();
        let interval = self.interval_minutes;

        thread::spawn(move || {
            let sleep_duration = Duration::from_secs(interval * 60);
            let mut elapsed_minutes: u64 = 0;

            while running.load(Ordering::SeqCst) {
                // Sleep in 1-minute increments to allow for responsive shutdown
                thread::sleep(Duration::from_secs(60));
                elapsed_minutes += 1;

                if elapsed_minutes >= interval {
                    // Emit break reminder event to frontend
                    let payload = serde_json::json!({
                        "message": format!(
                            "You've been working for {} minutes. Time for a break!",
                            interval
                        ),
                        "type": "break_reminder",
                        "minutes_worked": interval,
                    });

                    let _ = app_handle.emit("break-reminder", payload);
                    elapsed_minutes = 0; // Reset counter
                }
            }
        });
    }

    pub fn stop(&self) {
        self.running.store(false, Ordering::SeqCst);
    }

    pub fn is_running(&self) -> bool {
        self.running.load(Ordering::SeqCst)
    }
}

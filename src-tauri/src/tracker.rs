use crate::categories::categorize_app;
use crate::database::{ActivityRecord, Database};
use chrono::Local;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::Duration;

#[cfg(target_os = "windows")]
use windows::Win32::Foundation::{CloseHandle, HWND, MAX_PATH};
#[cfg(target_os = "windows")]
use windows::Win32::System::ProcessStatus::GetModuleFileNameExW;
#[cfg(target_os = "windows")]
use windows::Win32::System::Threading::{OpenProcess, PROCESS_QUERY_INFORMATION, PROCESS_VM_READ};
#[cfg(target_os = "windows")]
use windows::Win32::UI::WindowsAndMessaging::{GetForegroundWindow, GetWindowTextW, GetWindowThreadProcessId};

// ═══════════════════════════════════════════
// Foreground Window Info
// ═══════════════════════════════════════════

#[derive(Debug, Clone)]
pub struct ForegroundWindow {
    pub app_name: String,
    pub window_title: String,
    pub exe_path: String,
    pub pid: u32,
}

/// Get the current foreground window information using Windows API
#[cfg(target_os = "windows")]
pub fn get_foreground_window_info() -> Option<ForegroundWindow> {
    unsafe {
        let hwnd: HWND = GetForegroundWindow();
        if hwnd.0.is_null() {
            return None;
        }

        // Get window title
        let mut title_buf = [0u16; 512];
        let title_len = GetWindowTextW(hwnd, &mut title_buf);
        if title_len == 0 {
            return None;
        }
        let window_title = String::from_utf16_lossy(&title_buf[..title_len as usize]);

        // Get process ID
        let mut pid: u32 = 0;
        GetWindowThreadProcessId(hwnd, Some(&mut pid));
        if pid == 0 {
            return None;
        }

        // Get process name from PID
        let (app_name, exe_path) = get_process_name(pid);

        Some(ForegroundWindow {
            app_name,
            window_title,
            exe_path,
            pid,
        })
    }
}

/// Get process name and exe path from PID
#[cfg(target_os = "windows")]
unsafe fn get_process_name(pid: u32) -> (String, String) {
    let handle = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, false, pid);

    match handle {
        Ok(handle) => {
            let mut buf = [0u16; MAX_PATH as usize];
            let len = GetModuleFileNameExW(handle, None, &mut buf);
            let _ = CloseHandle(handle);

            if len > 0 {
                let full_path = String::from_utf16_lossy(&buf[..len as usize]);
                let app_name = full_path
                    .rsplit('\\')
                    .next()
                    .unwrap_or(&full_path)
                    .trim_end_matches(".exe")
                    .trim_end_matches(".EXE")
                    .to_string();
                return (app_name, full_path);
            }
            ("Unknown".to_string(), String::new())
        }
        Err(_) => ("Unknown".to_string(), String::new()),
    }
}

/// Fallback for non-Windows platforms
#[cfg(not(target_os = "windows"))]
pub fn get_foreground_window_info() -> Option<ForegroundWindow> {
    None
}

// ═══════════════════════════════════════════
// Tracker Engine
// ═══════════════════════════════════════════

pub struct Tracker {
    is_running: Arc<AtomicBool>,
}

impl Tracker {
    pub fn new() -> Self {
        Tracker {
            is_running: Arc::new(AtomicBool::new(false)),
        }
    }

    pub fn is_running(&self) -> bool {
        self.is_running.load(Ordering::Relaxed)
    }

    /// Start the background tracking loop
    pub fn start(&self, db: Arc<Database>) {
        if self.is_running.load(Ordering::Relaxed) {
            return; // Already running
        }

        self.is_running.store(true, Ordering::Relaxed);
        let is_running = self.is_running.clone();

        std::thread::spawn(move || {
            let mut current_session_id: Option<i64> = None;
            let mut current_app: Option<String> = None;
            let mut session_start = Local::now();
            let poll_interval = Duration::from_secs(3);

            while is_running.load(Ordering::Relaxed) {
                if let Some(window) = get_foreground_window_info() {
                    let now = Local::now();
                    let today = now.format("%Y-%m-%d").to_string();
                    let now_str = now.format("%Y-%m-%dT%H:%M:%S").to_string();

                    let app_changed = current_app.as_ref() != Some(&window.app_name);

                    if app_changed {
                        // Close previous session
                        if let Some(session_id) = current_session_id.take() {
                            let duration = (now - session_start).num_seconds();
                            let _ = db.update_activity_end(session_id, &now_str, duration);
                        }

                        // Record app switch
                        if let Some(ref prev_app) = current_app {
                            let _ = db.insert_app_switch(prev_app, &window.app_name);
                        }

                        // Start new session
                        let category = categorize_app(&window.app_name);
                        let record = ActivityRecord {
                            id: None,
                            app_name: window.app_name.clone(),
                            window_title: window.window_title.clone(),
                            exe_path: window.exe_path.clone(),
                            started_at: now_str,
                            ended_at: None,
                            duration_seconds: 0,
                            category: category.to_string(),
                            date: today,
                        };

                        match db.insert_activity(&record) {
                            Ok(id) => {
                                current_session_id = Some(id);
                                current_app = Some(window.app_name);
                                session_start = now;
                            }
                            Err(e) => {
                                eprintln!("[Lopa Tracker] DB insert error: {}", e);
                            }
                        }
                    } else {
                        // Same app — update duration periodically
                        if let Some(session_id) = current_session_id {
                            let duration = (now - session_start).num_seconds();
                            let _ = db.update_activity_end(session_id, &now_str, duration);
                        }
                    }
                }

                std::thread::sleep(poll_interval);
            }

            // Close final session when stopping
            if let Some(session_id) = current_session_id {
                let now = Local::now();
                let now_str = now.format("%Y-%m-%dT%H:%M:%S").to_string();
                let duration = (now - session_start).num_seconds();
                let _ = db.update_activity_end(session_id, &now_str, duration);
            }
        });
    }

    /// Stop the tracking loop
    pub fn stop(&self) {
        self.is_running.store(false, Ordering::Relaxed);
    }
}

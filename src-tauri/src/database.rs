use chrono::Local;
use rusqlite::{params, Connection, Result as SqlResult};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Mutex;

// ═══════════════════════════════════════════
// Data Models
// ═══════════════════════════════════════════

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActivityRecord {
    pub id: Option<i64>,
    pub app_name: String,
    pub window_title: String,
    pub exe_path: String,
    pub started_at: String,
    pub ended_at: Option<String>,
    pub duration_seconds: i64,
    pub category: String,
    pub date: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppUsageSummary {
    pub app_name: String,
    pub total_minutes: f64,
    pub category: String,
    pub color: String,
    pub icon: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HourlyActivity {
    pub hour: String,
    pub productive: f64,
    pub communication: f64,
    pub entertainment: f64,
    pub other: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DailyStats {
    pub screen_time_minutes: f64,
    pub focus_time_minutes: f64,
    pub break_time_minutes: f64,
    pub app_switches: i64,
    pub total_apps: i64,
}

// ═══════════════════════════════════════════
// Database Manager
// ═══════════════════════════════════════════

pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    /// Initialize database at the app data directory
    pub fn new(app_data_dir: PathBuf) -> SqlResult<Self> {
        std::fs::create_dir_all(&app_data_dir).ok();
        let db_path = app_data_dir.join("lopa_activity.db");
        let conn = Connection::open(&db_path)?;

        // Enable WAL mode for better concurrent performance
        conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;")?;

        let db = Database {
            conn: Mutex::new(conn),
        };
        db.initialize_schema()?;
        Ok(db)
    }

    fn initialize_schema(&self) -> SqlResult<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute_batch(
            "
            CREATE TABLE IF NOT EXISTS activity_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                app_name TEXT NOT NULL,
                window_title TEXT NOT NULL,
                exe_path TEXT NOT NULL DEFAULT '',
                started_at TEXT NOT NULL,
                ended_at TEXT,
                duration_seconds INTEGER DEFAULT 0,
                category TEXT NOT NULL DEFAULT 'other',
                date TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_activity_date ON activity_sessions(date);
            CREATE INDEX IF NOT EXISTS idx_activity_app ON activity_sessions(app_name);
            CREATE INDEX IF NOT EXISTS idx_activity_category ON activity_sessions(category);

            CREATE TABLE IF NOT EXISTS app_switches (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                from_app TEXT NOT NULL,
                to_app TEXT NOT NULL,
                switched_at TEXT NOT NULL,
                date TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_switches_date ON app_switches(date);

            CREATE TABLE IF NOT EXISTS focus_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                started_at TEXT NOT NULL,
                ended_at TEXT,
                target_minutes INTEGER NOT NULL DEFAULT 25,
                actual_minutes REAL DEFAULT 0,
                completed INTEGER DEFAULT 0,
                date TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_focus_date ON focus_sessions(date);
            ",
        )?;
        Ok(())
    }

    // ═══════════════════════════════════════════
    // Activity Session CRUD
    // ═══════════════════════════════════════════

    /// Insert a new activity session (returns the row id)
    pub fn insert_activity(&self, record: &ActivityRecord) -> SqlResult<i64> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO activity_sessions (app_name, window_title, exe_path, started_at, ended_at, duration_seconds, category, date)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                record.app_name,
                record.window_title,
                record.exe_path,
                record.started_at,
                record.ended_at,
                record.duration_seconds,
                record.category,
                record.date,
            ],
        )?;
        Ok(conn.last_insert_rowid())
    }

    /// Update the end time and duration of an existing session
    pub fn update_activity_end(&self, id: i64, ended_at: &str, duration: i64) -> SqlResult<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "UPDATE activity_sessions SET ended_at = ?1, duration_seconds = ?2 WHERE id = ?3",
            params![ended_at, duration, id],
        )?;
        Ok(())
    }

    /// Record an app switch event
    pub fn insert_app_switch(&self, from_app: &str, to_app: &str) -> SqlResult<()> {
        let conn = self.conn.lock().unwrap();
        let now = Local::now().format("%Y-%m-%dT%H:%M:%S").to_string();
        let date = Local::now().format("%Y-%m-%d").to_string();
        conn.execute(
            "INSERT INTO app_switches (from_app, to_app, switched_at, date) VALUES (?1, ?2, ?3, ?4)",
            params![from_app, to_app, now, date],
        )?;
        Ok(())
    }

    // ═══════════════════════════════════════════
    // Query Methods
    // ═══════════════════════════════════════════

    /// Get today's daily stats
    pub fn get_daily_stats(&self, date: &str) -> SqlResult<DailyStats> {
        let conn = self.conn.lock().unwrap();

        // Total screen time
        let screen_time: f64 = conn
            .query_row(
                "SELECT COALESCE(SUM(duration_seconds), 0) / 60.0 FROM activity_sessions WHERE date = ?1",
                params![date],
                |row| row.get(0),
            )
            .unwrap_or(0.0);

        // Focus time (productive category)
        let focus_time: f64 = conn
            .query_row(
                "SELECT COALESCE(SUM(duration_seconds), 0) / 60.0 FROM activity_sessions WHERE date = ?1 AND category = 'productive'",
                params![date],
                |row| row.get(0),
            )
            .unwrap_or(0.0);

        // App switches count
        let app_switches: i64 = conn
            .query_row(
                "SELECT COUNT(*) FROM app_switches WHERE date = ?1",
                params![date],
                |row| row.get(0),
            )
            .unwrap_or(0);

        // Unique apps used
        let total_apps: i64 = conn
            .query_row(
                "SELECT COUNT(DISTINCT app_name) FROM activity_sessions WHERE date = ?1",
                params![date],
                |row| row.get(0),
            )
            .unwrap_or(0);

        // Break time estimate: total elapsed time minus screen time
        let break_time = (screen_time * 0.15).max(0.0); // Rough estimate

        Ok(DailyStats {
            screen_time_minutes: screen_time,
            focus_time_minutes: focus_time,
            break_time_minutes: break_time,
            app_switches,
            total_apps,
        })
    }

    /// Get top apps by usage for a given date
    pub fn get_top_apps(&self, date: &str, limit: i64) -> SqlResult<Vec<AppUsageSummary>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT app_name, COALESCE(SUM(duration_seconds), 0) / 60.0 as total_min, category
             FROM activity_sessions
             WHERE date = ?1
             GROUP BY app_name
             ORDER BY total_min DESC
             LIMIT ?2",
        )?;

        let results = stmt
            .query_map(params![date, limit], |row| {
                let app_name: String = row.get(0)?;
                let total_minutes: f64 = row.get(1)?;
                let category: String = row.get(2)?;

                let (color, icon) = crate::categories::get_app_visual(&app_name);

                Ok(AppUsageSummary {
                    app_name,
                    total_minutes,
                    category,
                    color: color.to_string(),
                    icon: icon.to_string(),
                })
            })?
            .collect::<SqlResult<Vec<_>>>()?;

        Ok(results)
    }

    /// Get hourly activity breakdown for the chart
    pub fn get_hourly_activity(&self, date: &str) -> SqlResult<Vec<HourlyActivity>> {
        let conn = self.conn.lock().unwrap();

        let mut hours: Vec<HourlyActivity> = (0..24)
            .map(|h| {
                let label = if h == 0 {
                    "12 AM".to_string()
                } else if h < 12 {
                    format!("{} AM", h)
                } else if h == 12 {
                    "12 PM".to_string()
                } else {
                    format!("{} PM", h - 12)
                };
                HourlyActivity {
                    hour: label,
                    productive: 0.0,
                    communication: 0.0,
                    entertainment: 0.0,
                    other: 0.0,
                }
            })
            .collect();

        let mut stmt = conn.prepare(
            "SELECT strftime('%H', started_at) as hr, category, COALESCE(SUM(duration_seconds), 0) / 60.0
             FROM activity_sessions
             WHERE date = ?1
             GROUP BY hr, category",
        )?;

        let rows = stmt.query_map(params![date], |row| {
            let hr: String = row.get(0)?;
            let category: String = row.get(1)?;
            let minutes: f64 = row.get(2)?;
            Ok((hr, category, minutes))
        })?;

        for row in rows {
            if let Ok((hr, category, minutes)) = row {
                if let Ok(h) = hr.parse::<usize>() {
                    if h < 24 {
                        match category.as_str() {
                            "productive" => hours[h].productive += minutes,
                            "communication" => hours[h].communication += minutes,
                            "entertainment" => hours[h].entertainment += minutes,
                            _ => hours[h].other += minutes,
                        }
                    }
                }
            }
        }

        Ok(hours)
    }

    /// Get recent activity records
    pub fn get_recent_activity(&self, date: &str, limit: i64) -> SqlResult<Vec<ActivityRecord>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, app_name, window_title, exe_path, started_at, ended_at, duration_seconds, category, date
             FROM activity_sessions
             WHERE date = ?1
             ORDER BY started_at DESC
             LIMIT ?2",
        )?;

        let results = stmt
            .query_map(params![date, limit], |row| {
                Ok(ActivityRecord {
                    id: Some(row.get(0)?),
                    app_name: row.get(1)?,
                    window_title: row.get(2)?,
                    exe_path: row.get(3)?,
                    started_at: row.get(4)?,
                    ended_at: row.get(5)?,
                    duration_seconds: row.get(6)?,
                    category: row.get(7)?,
                    date: row.get(8)?,
                })
            })?
            .collect::<SqlResult<Vec<_>>>()?;

        Ok(results)
    }
}

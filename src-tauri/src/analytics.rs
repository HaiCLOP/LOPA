use crate::database::Database;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

// ═══════════════════════════════════════════
// Productivity Score Engine
// ═══════════════════════════════════════════

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProductivityScore {
    pub score: f64,
    pub label: String,
    pub productive_pct: f64,
    pub communication_pct: f64,
    pub entertainment_pct: f64,
    pub other_pct: f64,
    pub focus_ratio: f64,
    pub switch_penalty: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WellbeingAssessment {
    pub score: i32,
    pub label: String,
    pub description: String,
    pub factors: Vec<WellbeingFactor>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WellbeingFactor {
    pub id: String,
    pub label: String,
    pub value: String,
    pub status: String,
    pub weight: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FocusPattern {
    pub peak_start_hour: u32,
    pub peak_end_hour: u32,
    pub avg_focus_duration_min: f64,
    pub longest_streak_min: f64,
    pub distraction_count: i32,
}

pub struct AnalyticsEngine;

impl AnalyticsEngine {
    /// Calculate productivity score (0-100) based on app usage patterns
    pub fn calculate_productivity(db: &Arc<Database>, date: &str) -> ProductivityScore {
        let stats = db.get_daily_stats(date).unwrap_or_default();
        let top_apps = db.get_top_apps(date, 20).unwrap_or_default();

        let total_minutes = stats.screen_time_minutes.max(1.0);

        // Category breakdown
        let mut productive_min = 0.0_f64;
        let mut communication_min = 0.0_f64;
        let mut entertainment_min = 0.0_f64;
        let mut other_min = 0.0_f64;

        for app in &top_apps {
            match app.category.as_str() {
                "productive" => productive_min += app.total_minutes,
                "communication" => communication_min += app.total_minutes,
                "entertainment" => entertainment_min += app.total_minutes,
                _ => other_min += app.total_minutes,
            }
        }

        let productive_pct = (productive_min / total_minutes * 100.0).min(100.0);
        let communication_pct = (communication_min / total_minutes * 100.0).min(100.0);
        let entertainment_pct = (entertainment_min / total_minutes * 100.0).min(100.0);
        let other_pct = (other_min / total_minutes * 100.0).min(100.0);

        // Focus ratio: focus time vs screen time
        let focus_ratio = if total_minutes > 0.0 {
            (stats.focus_time_minutes / total_minutes).min(1.0)
        } else {
            0.0
        };

        // App switch penalty: more switches = less focused
        let switch_rate = stats.app_switches as f64 / total_minutes.max(1.0);
        let switch_penalty = (switch_rate * 10.0).min(30.0);

        // Composite score
        let base_score = productive_pct * 0.45
            + focus_ratio * 100.0 * 0.25
            + (100.0 - entertainment_pct) * 0.15
            + (100.0 - switch_penalty) * 0.15;

        let score = base_score.clamp(0.0, 100.0);

        let label = match score as i32 {
            80..=100 => "Excellent",
            60..=79 => "Good",
            40..=59 => "Fair",
            _ => "Needs Focus",
        };

        ProductivityScore {
            score,
            label: label.to_string(),
            productive_pct,
            communication_pct,
            entertainment_pct,
            other_pct,
            focus_ratio,
            switch_penalty,
        }
    }

    /// Assess overall digital wellbeing
    pub fn assess_wellbeing(db: &Arc<Database>, date: &str) -> WellbeingAssessment {
        let stats = db.get_daily_stats(date).unwrap_or_default();
        let productivity = Self::calculate_productivity(db, date);

        let mut factors = Vec::new();
        let mut total_score = 0.0;

        // Screen balance (target: 4-6 hours)
        let screen_score = if stats.screen_time_minutes < 240.0 {
            90.0 // Under 4h = great
        } else if stats.screen_time_minutes < 360.0 {
            80.0 // 4-6h = good
        } else if stats.screen_time_minutes < 480.0 {
            60.0 // 6-8h = fair
        } else {
            40.0 // 8h+ = poor
        };

        factors.push(WellbeingFactor {
            id: "screen_balance".to_string(),
            label: "Screen Balance".to_string(),
            value: format_minutes(stats.screen_time_minutes),
            status: score_to_status(screen_score),
            weight: 0.25,
        });
        total_score += screen_score * 0.25;

        // Break quality (target: 10+ mins per hour)
        let break_ratio = stats.break_time_minutes / stats.screen_time_minutes.max(1.0);
        let break_score = (break_ratio * 600.0).clamp(0.0, 100.0);

        factors.push(WellbeingFactor {
            id: "mindful_breaks".to_string(),
            label: "Mindful Breaks".to_string(),
            value: format!("{}", (stats.break_time_minutes / 10.0).round() as i32),
            status: score_to_status(break_score),
            weight: 0.2,
        });
        total_score += break_score * 0.2;

        // Focus quality
        let focus_score = productivity.focus_ratio * 100.0;
        factors.push(WellbeingFactor {
            id: "focus_quality".to_string(),
            label: "Focus Quality".to_string(),
            value: format!("{}%", focus_score.round() as i32),
            status: score_to_status(focus_score),
            weight: 0.25,
        });
        total_score += focus_score * 0.25;

        // Context switching (fewer = better)
        let switch_score = (100.0 - productivity.switch_penalty * 3.0).clamp(0.0, 100.0);
        factors.push(WellbeingFactor {
            id: "context_switches".to_string(),
            label: "Context Flow".to_string(),
            value: format!("{}", stats.app_switches),
            status: score_to_status(switch_score),
            weight: 0.15,
        });
        total_score += switch_score * 0.15;

        // Entertainment balance
        let ent_score = if productivity.entertainment_pct < 15.0 {
            90.0
        } else if productivity.entertainment_pct < 30.0 {
            70.0
        } else if productivity.entertainment_pct < 50.0 {
            50.0
        } else {
            30.0
        };

        factors.push(WellbeingFactor {
            id: "digital_diet".to_string(),
            label: "Digital Diet".to_string(),
            value: format!("{}%", productivity.entertainment_pct.round() as i32),
            status: score_to_status(ent_score),
            weight: 0.15,
        });
        total_score += ent_score * 0.15;

        let final_score = total_score.round() as i32;
        let label = match final_score {
            80..=100 => "Great",
            60..=79 => "Good",
            40..=59 => "Fair",
            _ => "Needs Attention",
        };

        WellbeingAssessment {
            score: final_score,
            label: label.to_string(),
            description: "This score reflects your digital balance and habits.".to_string(),
            factors,
        }
    }

    /// Detect focus patterns from hourly data
    pub fn detect_focus_patterns(db: &Arc<Database>, date: &str) -> FocusPattern {
        let hourly = db.get_hourly_activity(date).unwrap_or_default();
        let stats = db.get_daily_stats(date).unwrap_or_default();

        let mut peak_hour = 0;
        let mut peak_productive = 0.0_f64;

        for (i, h) in hourly.iter().enumerate() {
            if h.productive > peak_productive {
                peak_productive = h.productive;
                peak_hour = i;
            }
        }

        // Find peak window (contiguous productive hours)
        let peak_start = if peak_hour > 0 { peak_hour - 1 } else { peak_hour };
        let peak_end = (peak_hour + 2).min(23);

        // Estimate avg focus duration
        let avg_focus = if stats.app_switches > 0 {
            stats.focus_time_minutes / stats.app_switches as f64
        } else {
            stats.focus_time_minutes
        };

        FocusPattern {
            peak_start_hour: peak_start as u32,
            peak_end_hour: peak_end as u32,
            avg_focus_duration_min: avg_focus,
            longest_streak_min: stats.focus_time_minutes * 0.4,
            distraction_count: (stats.app_switches as f64 * 0.3) as i32,
        }
    }
}

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════

fn format_minutes(min: f64) -> String {
    let h = (min / 60.0).floor() as i32;
    let m = (min % 60.0).round() as i32;
    if h > 0 {
        format!("{}h {}m", h, m)
    } else {
        format!("{}m", m)
    }
}

fn score_to_status(score: f64) -> String {
    match score as i32 {
        80..=100 => "great".to_string(),
        60..=79 => "good".to_string(),
        40..=59 => "fair".to_string(),
        _ => "poor".to_string(),
    }
}

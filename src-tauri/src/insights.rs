use crate::analytics::AnalyticsEngine;
use crate::database::Database;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Insight {
    pub id: String,
    pub title: String,
    pub description: String,
    pub category: String,     // "focus", "health", "productivity", "habit"
    pub priority: String,     // "high", "medium", "low"
    pub action: Option<String>,
    pub icon: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Recommendation {
    pub id: String,
    pub text: String,
    pub reasoning: String,
    pub impact: String,       // "high", "medium", "low"
}

pub struct InsightGenerator;

impl InsightGenerator {
    pub fn generate_insights(db: &Arc<Database>, date: &str) -> Vec<Insight> {
        let mut insights = Vec::new();
        let productivity = AnalyticsEngine::calculate_productivity(db, date);
        let patterns = AnalyticsEngine::detect_focus_patterns(db, date);
        let stats = db.get_daily_stats(date).unwrap_or_default();

        // Peak productivity window
        let peak_start = format_hour(patterns.peak_start_hour);
        let peak_end = format_hour(patterns.peak_end_hour);

        insights.push(Insight {
            id: "peak_window".to_string(),
            title: "Peak Focus Window".to_string(),
            description: format!(
                "You're most productive between {} – {}. Consider planning deep work during this time.",
                peak_start, peak_end
            ),
            category: "focus".to_string(),
            priority: "high".to_string(),
            action: Some("Schedule focus blocks".to_string()),
            icon: "⚡".to_string(),
        });

        // Screen time warning
        if stats.screen_time_minutes > 360.0 {
            insights.push(Insight {
                id: "screen_warning".to_string(),
                title: "Extended Screen Time".to_string(),
                description: format!(
                    "You've been at your screen for over {} hours today. Take a 15-minute break to rest your eyes.",
                    (stats.screen_time_minutes / 60.0).round() as i32
                ),
                category: "health".to_string(),
                priority: "high".to_string(),
                action: Some("Take a break".to_string()),
                icon: "👀".to_string(),
            });
        }

        // Context switching concern
        if stats.app_switches > 50 {
            insights.push(Insight {
                id: "switch_overload".to_string(),
                title: "High Context Switching".to_string(),
                description: format!(
                    "You switched between apps {} times today. Try batching similar tasks together.",
                    stats.app_switches
                ),
                category: "productivity".to_string(),
                priority: "medium".to_string(),
                action: Some("Enable Focus Mode".to_string()),
                icon: "🔄".to_string(),
            });
        }

        // Entertainment ratio
        if productivity.entertainment_pct > 25.0 {
            insights.push(Insight {
                id: "entertainment_ratio".to_string(),
                title: "Entertainment Creep".to_string(),
                description: format!(
                    "{}% of your screen time went to entertainment today. Consider setting daily limits.",
                    productivity.entertainment_pct.round() as i32
                ),
                category: "habit".to_string(),
                priority: "medium".to_string(),
                action: Some("Set app limits".to_string()),
                icon: "🎮".to_string(),
            });
        }

        // Good focus streak
        if patterns.avg_focus_duration_min > 20.0 {
            insights.push(Insight {
                id: "focus_streak".to_string(),
                title: "Strong Focus Today".to_string(),
                description: format!(
                    "Your average focus session is {:.0} minutes — keep up the momentum.",
                    patterns.avg_focus_duration_min
                ),
                category: "focus".to_string(),
                priority: "low".to_string(),
                action: None,
                icon: "🎯".to_string(),
            });
        }

        // Low distraction day
        if patterns.distraction_count < 10 && stats.screen_time_minutes > 60.0 {
            insights.push(Insight {
                id: "low_distraction".to_string(),
                title: "Minimal Distractions".to_string(),
                description: "Great job staying focused — only a few context switches today.".to_string(),
                category: "productivity".to_string(),
                priority: "low".to_string(),
                action: None,
                icon: "✨".to_string(),
            });
        }

        // High productivity score
        if productivity.score > 80.0 {
            insights.push(Insight {
                id: "high_productivity".to_string(),
                title: "Productivity Score: Excellent".to_string(),
                description: format!(
                    "Your productivity score is {:.0}/100 — you're in the zone today!",
                    productivity.score
                ),
                category: "productivity".to_string(),
                priority: "low".to_string(),
                action: None,
                icon: "🚀".to_string(),
            });
        }

        insights
    }

    pub fn generate_recommendations(db: &Arc<Database>, date: &str) -> Vec<Recommendation> {
        let mut recs = Vec::new();
        let productivity = AnalyticsEngine::calculate_productivity(db, date);
        let stats = db.get_daily_stats(date).unwrap_or_default();
        let patterns = AnalyticsEngine::detect_focus_patterns(db, date);

        // Focus duration recommendation
        if patterns.avg_focus_duration_min < 15.0 && stats.screen_time_minutes > 30.0 {
            recs.push(Recommendation {
                id: "extend_focus".to_string(),
                text: "Try working in 25-minute focused blocks".to_string(),
                reasoning: "Your average focus session is short — Pomodoro technique can help build sustained attention.".to_string(),
                impact: "high".to_string(),
            });
        }

        // Break reminder
        if stats.break_time_minutes < stats.screen_time_minutes * 0.1 {
            recs.push(Recommendation {
                id: "more_breaks".to_string(),
                text: "Schedule a 5-minute break every 50 minutes".to_string(),
                reasoning: "Regular breaks improve focus retention and reduce eye strain.".to_string(),
                impact: "medium".to_string(),
            });
        }

        // Reduce entertainment
        if productivity.entertainment_pct > 30.0 {
            recs.push(Recommendation {
                id: "limit_entertainment".to_string(),
                text: "Set a 1-hour daily limit for entertainment apps".to_string(),
                reasoning: "Entertainment is consuming a large portion of your productive hours.".to_string(),
                impact: "high".to_string(),
            });
        }

        // Communication batching
        if productivity.communication_pct > 25.0 {
            recs.push(Recommendation {
                id: "batch_comms".to_string(),
                text: "Batch communication into 2–3 windows per day".to_string(),
                reasoning: "Frequent messaging interrupts deep work flow — try checking messages at set times.".to_string(),
                impact: "medium".to_string(),
            });
        }

        recs
    }
}

fn format_hour(h: u32) -> String {
    if h == 0 {
        "12:00 AM".to_string()
    } else if h < 12 {
        format!("{}:00 AM", h)
    } else if h == 12 {
        "12:00 PM".to_string()
    } else {
        format!("{}:00 PM", h - 12)
    }
}

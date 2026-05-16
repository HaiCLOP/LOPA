# Lopa — AI-Powered Digital Wellbeing

<div align="center">

**Your intelligent companion for mindful technology use.**

![Version](https://img.shields.io/badge/version-0.2.0-6366f1?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Windows-0078d7?style=flat-square)
![Rust](https://img.shields.io/badge/backend-Rust-orange?style=flat-square)
![React](https://img.shields.io/badge/frontend-React%2018-61dafb?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)

</div>

---

## Overview

Lopa is a desktop application that tracks your digital activity and provides AI-generated insights to help you build healthier computing habits. Every byte of data stays on your machine — no cloud, no telemetry.

## Features

### Core
- **Real-time Activity Tracking** — Automatic foreground window detection and categorization
- **Productivity Scoring** — Weighted algorithm that evaluates your work patterns (0-100)
- **Wellbeing Assessment** — 5-factor model analyzing screen time, focus, breaks, variety, and balance
- **AI Coach** — Context-aware conversational assistant that uses your live data
- **Focus Timer** — Pomodoro and custom timers with session tracking

### Phase 4 (Latest)
- **System Tray** — Background operation with Show/Pause/Quit menu
- **Dark Mode** — Full theme system with Light/Dark/System toggle (persisted)
- **Weekly Reports** — Productivity bar charts, category breakdown, export to PDF
- **Break Reminders** — Background service that nudges you every 50 minutes
- **Onboarding** — Animated 4-step welcome flow for first-time users
- **Error Boundary** — Graceful crash recovery UI
- **Loading Skeletons** — Shimmer animations for polished loading states

## Architecture

```
┌─────────────────────────────────────────┐
│              Tauri Shell                │
│  ┌───────────┐       ┌───────────────┐  │
│  │   React   │ <──── │    Rust       │  │
│  │ Frontend  │  IPC  │   Backend     │  │
│  │           │ ────> │              │  │
│  │ • Zustand │       │ • Tracker    │  │
│  │ • Framer  │       │ • Analytics  │  │
│  │ • Tailwind│       │ • SQLite     │  │
│  │ • Lucide  │       │ • Reminders  │  │
│  └───────────┘       └───────────────┘  │
└─────────────────────────────────────────┘
```

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Tauri v2                            |
| Backend     | Rust (windows-sys, rusqlite, chrono)|
| Frontend    | React 18, TypeScript                |
| State       | Zustand with persistence            |
| Styling     | TailwindCSS + CSS variables         |
| Animations  | Framer Motion                       |
| Database    | SQLite (WAL mode)                   |
| Icons       | Lucide React                        |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/HaiCLOP/LOPA.git
cd LOPA

# Install dependencies
npm install

# Development (full native experience)
npm run tauri dev

# Production build
npm run tauri build
```

### Prerequisites
- Node.js 18+
- Rust toolchain (rustup)
- Windows 10/11

## IPC Commands

| Command               | Description                        |
|-----------------------|------------------------------------|
| `start_tracking`      | Begin foreground window monitoring |
| `stop_tracking`       | Pause activity tracking            |
| `get_tracking_status` | Check if tracker is running        |
| `get_daily_stats`     | Screen time, focus, breaks, etc    |
| `get_top_apps`        | Top apps by usage duration         |
| `get_hourly_activity` | Per-hour category breakdown        |
| `get_recent_activity` | Latest activity records            |
| `get_productivity_score` | Weighted productivity (0-100)   |
| `get_wellbeing_score` | 5-factor wellbeing assessment      |
| `get_focus_patterns`  | Peak focus window detection        |
| `get_insights`        | AI-generated behavioral insights   |
| `get_recommendations` | Actionable improvement suggestions |
| `export_data`         | Privacy-first data export          |

## Privacy

Lopa is 100% offline. All computation happens locally in Rust. Your behavioral data never leaves your device.

## License

MIT © 2024 Lopa Contributors

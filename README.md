# Lopa — AI-Powered Digital Wellbeing

A premium Windows desktop app for mindful technology use. Built with **Tauri + React + Rust**.

![Lopa Dashboard](https://img.shields.io/badge/Platform-Windows-blue) ![Tauri](https://img.shields.io/badge/Backend-Tauri%20v2-orange) ![React](https://img.shields.io/badge/Frontend-React%20%2B%20TS-61dafb)

## What it does

Lopa runs quietly in the background, tracking which applications you use and for how long. It then surfaces real-time analytics, behavioral insights, and focus recommendations — all processed locally on your machine.

- **Real-time tracking** — monitors foreground windows via Windows API
- **Auto-categorization** — classifies 80+ apps into productive, communication, entertainment
- **Productivity scoring** — composite score based on focus time, app switches, category ratios
- **Wellbeing assessment** — 5-factor evaluation (screen balance, breaks, focus, flow, digital diet)
- **AI insights** — contextual observations about your patterns (peak focus windows, distraction alerts)
- **Focus mode** — Pomodoro timer with multiple presets (Deep Focus, Sprint, Break)
- **Goals tracking** — set and monitor daily wellbeing targets
- **Privacy-first** — all data stays in local SQLite, never leaves your machine

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop framework | Tauri v2 |
| Backend | Rust (windows-sys, rusqlite, chrono) |
| Frontend | React 18 + TypeScript |
| Styling | TailwindCSS + Framer Motion |
| State | Zustand |
| Database | SQLite (WAL mode) |
| UI paradigm | Glassmorphism |

## Architecture

```
src/              — React frontend
  components/     — Dashboard, pages, UI primitives
  hooks/          — Tauri IPC hooks, timer, keyboard shortcuts
  stores/         — Zustand state
  data/           — Mock data for browser mode

src-tauri/src/    — Rust backend
  tracker.rs      — Windows API foreground polling (3s interval)
  database.rs     — SQLite schema, CRUD, aggregation queries
  categories.rs   — App categorization engine (80+ apps)
  analytics.rs    — Productivity scoring, wellbeing assessment
  insights.rs     — Contextual insight and recommendation generator
  commands.rs     — 12 Tauri IPC commands
  export.rs       — Data export for portability
```

## Development

```bash
# Frontend only (mock data)
npm run dev

# Full desktop app with tracking
npm run tauri dev
```

> First Tauri build takes ~2-3 minutes for Rust compilation.

## Pages

| Page | Route | Description |
|------|-------|------------|
| Dashboard | `dashboard` | Stats, charts, AI insight, focus timer, coach |
| Focus | `focus` | Full-screen Pomodoro timer with presets |
| Insights | `insights` | AI-generated patterns and recommendations |
| Activity | `activity` | Timeline of recent app usage |
| Goals | `goals` | Daily wellbeing targets with progress rings |
| Settings | `settings` | Privacy, notifications, data management |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+1` | Dashboard |
| `Ctrl+2` | Focus Mode |
| `Ctrl+3` | Insights |
| `Ctrl+4` | Activity |
| `Ctrl+5` | Goals |
| `Ctrl+6` | Settings |
| `Escape` | Back to Dashboard |

## License

Private — all rights reserved.

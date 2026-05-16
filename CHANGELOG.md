# Changelog

All notable changes to Lopa are documented here.

## [0.2.0] — 2024-05-17

### Added
- **System Tray** — App runs in background with Show/Pause/Quit tray menu
- **Dark Mode** — Full theme system with Light/Dark/System toggle (persisted via localStorage)
- **AI Coach Page** — Full-page conversational assistant with quick action buttons
- **Reports Page** — Weekly productivity bar chart, category breakdown, summary cards
- **Break Reminders** — Background Rust service emitting Tauri events every 50 minutes
- **Onboarding Flow** — 4-step animated welcome experience for first-time users
- **Error Boundary** — Graceful crash recovery UI with reload action
- **Loading Skeletons** — Shimmer animations for all dashboard cards and charts
- **Data Export** — Enhanced JSON export with daily summary stats
- **Theme Picker** — Settings page with Light/Dark/System selector and toast feedback

### Changed
- AI Coach now generates context-aware responses using live productivity data
- Settings page wired to persistent Zustand store
- App router expanded from 6 to 8 pages
- Focus Timer uses correct duration in seconds

### Fixed
- Tauri v2 tray API compatibility (TrayIconBuilder pattern)
- Emitter trait import for break reminder events
- TypeScript errors in store persistence and timer hook

## [0.1.0] — 2024-05-16

### Added
- Real-time foreground window tracking via Windows API
- SQLite database with WAL mode
- Productivity scoring algorithm (0-100 weighted)
- 5-factor wellbeing assessment engine
- Insight generator with pattern detection
- Focus timer with Pomodoro presets
- Glassmorphism UI with nature background
- 6 navigation pages (Dashboard, Focus, Insights, Activity, Goals, Settings)
- 12 IPC commands bridging Rust backend to React frontend
- Keyboard shortcuts (Ctrl+1-6) for page navigation
- Toast notification system
- Privacy-first architecture (100% offline)

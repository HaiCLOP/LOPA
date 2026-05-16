import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  activeNav: string;
  setActiveNav: (id: string) => void;
  focusDuration: number;
  setFocusDuration: (seconds: number) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeNav: 'dashboard',
      setActiveNav: (id) => set({ activeNav: id }),
      focusDuration: 1500,
      setFocusDuration: (seconds) => set({ focusDuration: seconds }),
      theme: 'light' as Theme,
      setTheme: (theme) => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        document.documentElement.setAttribute('data-theme', resolved);
        set({ theme, resolvedTheme: resolved });
      },
      resolvedTheme: 'light' as 'light' | 'dark',
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    {
      name: 'lopa-settings',
      partials: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

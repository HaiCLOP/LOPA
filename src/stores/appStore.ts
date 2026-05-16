import { create } from 'zustand';

interface AppState {
  activeNav: string;
  setActiveNav: (id: string) => void;
  focusDuration: number;
  setFocusDuration: (seconds: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeNav: 'dashboard',
  setActiveNav: (id) => set({ activeNav: id }),
  focusDuration: 1500,
  setFocusDuration: (seconds) => set({ focusDuration: seconds }),
}));

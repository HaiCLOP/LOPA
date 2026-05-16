import { useEffect } from 'react';
import { showToast } from '../components/ui/Toast';

/**
 * Listens for break reminder events from the Tauri backend.
 * Shows a toast notification when a break is due.
 * Falls back to a browser-based timer for development mode.
 */
export function useBreakReminder(intervalMinutes: number = 50) {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    // Tauri event listener
    if (typeof window !== 'undefined' && '__TAURI__' in window) {
      import('@tauri-apps/api/event').then(({ listen }) => {
        listen<{ message: string; minutes_worked: number }>('break-reminder', (event) => {
          showToast(event.payload.message, 'info', 8000);
        }).then((unlisten) => {
          cleanup = unlisten;
        });
      });
    } else {
      // Browser fallback: periodic reminder
      const timer = setInterval(() => {
        showToast(
          `You've been working for ${intervalMinutes} minutes. Time for a break! 🌿`,
          'info',
          6000,
        );
      }, intervalMinutes * 60 * 1000);

      cleanup = () => clearInterval(timer);
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [intervalMinutes]);
}

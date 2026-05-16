import { useEffect, useCallback } from 'react';
import { useAppStore } from '../stores/appStore';

type KeyCombo = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
};

type ShortcutMap = Record<string, { combo: KeyCombo; handler: () => void }>;

function matchesCombo(e: KeyboardEvent, combo: KeyCombo): boolean {
  return (
    e.key.toLowerCase() === combo.key.toLowerCase() &&
    !!e.ctrlKey === !!combo.ctrl &&
    !!e.shiftKey === !!combo.shift &&
    !!e.altKey === !!combo.alt
  );
}

/**
 * Global keyboard shortcuts for navigation and quick actions.
 * - Ctrl+1..6 — Switch between pages
 * - Ctrl+K   — Quick command palette (placeholder)
 * - Escape   — Return to dashboard
 */
export function useKeyboardShortcuts() {
  const { setActiveNav } = useAppStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't fire shortcuts when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const shortcuts: ShortcutMap = {
        dashboard: { combo: { key: '1', ctrl: true }, handler: () => setActiveNav('dashboard') },
        focus: { combo: { key: '2', ctrl: true }, handler: () => setActiveNav('focus') },
        insights: { combo: { key: '3', ctrl: true }, handler: () => setActiveNav('insights') },
        activity: { combo: { key: '4', ctrl: true }, handler: () => setActiveNav('activity') },
        goals: { combo: { key: '5', ctrl: true }, handler: () => setActiveNav('goals') },
        coach: { combo: { key: '6', ctrl: true }, handler: () => setActiveNav('ai-coach') },
        reports: { combo: { key: '7', ctrl: true }, handler: () => setActiveNav('reports') },
        settings: { combo: { key: '8', ctrl: true }, handler: () => setActiveNav('settings') },
        escape: { combo: { key: 'Escape' }, handler: () => setActiveNav('dashboard') },
      };

      for (const shortcut of Object.values(shortcuts)) {
        if (matchesCombo(e, shortcut.combo)) {
          e.preventDefault();
          shortcut.handler();
          break;
        }
      }
    },
    [setActiveNav],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-full w-full" style={{ background: 'var(--color-canvas)' }}>
      <Sidebar />
      <main className="flex-1 overflow-hidden relative" style={{ background: 'var(--color-canvas)' }}>
        {children}
      </main>
    </div>
  );
}

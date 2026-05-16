interface AppIconProps {
  app: string;
  size?: number;
  className?: string;
}

const appColors: Record<string, { bg: string; fg: string; letter: string }> = {
  vscode: { bg: '#007ACC', fg: '#fff', letter: 'VS' },
  chrome: { bg: '#4285F4', fg: '#fff', letter: 'G' },
  figma: { bg: '#A259FF', fg: '#fff', letter: 'F' },
  spotify: { bg: '#1DB954', fg: '#fff', letter: 'S' },
  discord: { bg: '#5865F2', fg: '#fff', letter: 'D' },
};

export function AppIcon({ app, size = 32, className = '' }: AppIconProps) {
  const config = appColors[app] || { bg: '#9ca3af', fg: '#fff', letter: app[0]?.toUpperCase() || '?' };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg font-bold flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: config.bg,
        color: config.fg,
        fontSize: size * 0.35,
      }}
    >
      {config.letter}
    </div>
  );
}

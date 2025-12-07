import { Dumbbell, Settings, BarChart3 } from 'lucide-react';

interface HeaderProps {
  onOpenStats?: () => void;
  onOpenSettings?: () => void;
}

export function Header({ onOpenStats, onOpenSettings }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <Dumbbell size={28} />
          <div>
            <h1>FitTrack</h1>
            <p className="header-subtitle">Plan treningowy - 1 miesiąc</p>
          </div>
        </div>
        <div className="header-actions">
          {onOpenStats && (
            <button className="icon-button" onClick={onOpenStats} aria-label="Statystyki">
              <BarChart3 size={22} />
            </button>
          )}
          {onOpenSettings && (
            <button className="icon-button" onClick={onOpenSettings} aria-label="Ustawienia">
              <Settings size={22} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

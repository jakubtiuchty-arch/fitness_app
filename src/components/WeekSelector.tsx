import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekSelectorProps {
  currentWeek: number;
  totalWeeks: number;
  onWeekChange: (week: number) => void;
}

export function WeekSelector({ currentWeek, totalWeeks, onWeekChange }: WeekSelectorProps) {
  const handlePrev = () => {
    if (currentWeek > 0) {
      onWeekChange(currentWeek - 1);
    }
  };

  const handleNext = () => {
    if (currentWeek < totalWeeks - 1) {
      onWeekChange(currentWeek + 1);
    }
  };

  return (
    <div className="week-selector">
      <button
        className="week-nav-button"
        onClick={handlePrev}
        disabled={currentWeek === 0}
        aria-label="Poprzedni tydzień"
      >
        <ChevronLeft size={24} />
      </button>
      <div className="week-indicator">
        <span className="week-label">Tydzień</span>
        <span className="week-number">{currentWeek + 1}</span>
        <span className="week-total">z {totalWeeks}</span>
      </div>
      <button
        className="week-nav-button"
        onClick={handleNext}
        disabled={currentWeek === totalWeeks - 1}
        aria-label="Następny tydzień"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}

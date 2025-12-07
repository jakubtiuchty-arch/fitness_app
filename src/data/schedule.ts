import type { WeekSchedule, WorkoutType } from '../types';

const dayNames = [
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedziela'
];

const dayNamesShort = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

type SchedulePattern = WorkoutType[];

const weekPatterns: SchedulePattern[] = [
  // Tydzień 1: A, Wolne, AEROBY, Wolne, B, Wolne, AEROBY
  ['A', 'REST', 'AEROBY', 'REST', 'B', 'REST', 'AEROBY'],
  // Tydzień 2: Wolne, A, Wolne, AEROBY, Wolne, B, Wolne
  ['REST', 'A', 'REST', 'AEROBY', 'REST', 'B', 'REST'],
  // Tydzień 3: AEROBY, Wolne, A, Wolne, AEROBY, Wolne, B
  ['AEROBY', 'REST', 'A', 'REST', 'AEROBY', 'REST', 'B'],
  // Tydzień 4: Wolne, AEROBY, Wolne, A, Wolne, AEROBY, Wolne
  ['REST', 'AEROBY', 'REST', 'A', 'REST', 'AEROBY', 'REST']
];

export function generateMonthSchedule(): WeekSchedule[] {
  return weekPatterns.map((pattern, weekIndex) => ({
    weekNumber: weekIndex + 1,
    days: pattern.map((workoutType, dayIndex) => ({
      day: dayNamesShort[dayIndex],
      dayName: dayNames[dayIndex],
      workoutType,
      completed: false
    }))
  }));
}

export function getWorkoutLabel(type: WorkoutType): string {
  switch (type) {
    case 'A':
      return 'TRENING A';
    case 'B':
      return 'TRENING B';
    case 'AEROBY':
      return 'AEROBY';
    case 'REST':
      return 'Wolne';
    default:
      return '';
  }
}

export function getWorkoutColor(type: WorkoutType): string {
  switch (type) {
    case 'A':
      return 'bg-blue-600';
    case 'B':
      return 'bg-purple-600';
    case 'AEROBY':
      return 'bg-green-600';
    case 'REST':
      return 'bg-slate-700';
    default:
      return 'bg-slate-600';
  }
}

export function getWorkoutEmoji(type: WorkoutType): string {
  switch (type) {
    case 'A':
      return '🏋️';
    case 'B':
      return '🤸';
    case 'AEROBY':
      return '🏃';
    case 'REST':
      return '😴';
    default:
      return '';
  }
}

export { dayNames, dayNamesShort };

import type { WorkoutType, DaySchedule } from '../types';

// Rotacja: Siła A -> Cardio 1 -> Siła B -> Cardio 2 -> (powtórz)
const rotationPattern: WorkoutType[] = ['SILA_A', 'CARDIO_1', 'SILA_B', 'CARDIO_2'];

export function getWorkoutForDay(dayNumber: number): WorkoutType {
  // dayNumber zaczyna się od 1
  const index = (dayNumber - 1) % rotationPattern.length;
  return rotationPattern[index];
}

export function generateSchedule(totalDays: number = 28): DaySchedule[] {
  return Array.from({ length: totalDays }, (_, i) => ({
    dayNumber: i + 1,
    workoutType: getWorkoutForDay(i + 1),
    completed: false
  }));
}

export function getWorkoutLabel(type: WorkoutType): string {
  switch (type) {
    case 'SILA_A':
      return 'SIŁA A';
    case 'SILA_B':
      return 'SIŁA B';
    case 'CARDIO_1':
      return 'CARDIO 1';
    case 'CARDIO_2':
      return 'CARDIO 2';
    default:
      return '';
  }
}

export function getWorkoutSubtitle(type: WorkoutType): string {
  switch (type) {
    case 'SILA_A':
      return 'Push & Legs';
    case 'SILA_B':
      return 'Pull & Hinge';
    case 'CARDIO_1':
      return 'Interwały HIIT';
    case 'CARDIO_2':
      return 'Bieg ciągły LISS';
    default:
      return '';
  }
}

export function getWorkoutColor(type: WorkoutType): string {
  switch (type) {
    case 'SILA_A':
      return 'workout-sila-a';
    case 'SILA_B':
      return 'workout-sila-b';
    case 'CARDIO_1':
      return 'workout-cardio-1';
    case 'CARDIO_2':
      return 'workout-cardio-2';
    default:
      return '';
  }
}

export function getWorkoutEmoji(type: WorkoutType): string {
  switch (type) {
    case 'SILA_A':
      return '🏋️';
    case 'SILA_B':
      return '💪';
    case 'CARDIO_1':
      return '🔥';
    case 'CARDIO_2':
      return '🏃';
    default:
      return '';
  }
}

export function isStrengthWorkout(type: WorkoutType): boolean {
  return type === 'SILA_A' || type === 'SILA_B';
}

export function isCardioWorkout(type: WorkoutType): boolean {
  return type === 'CARDIO_1' || type === 'CARDIO_2';
}

export type WorkoutType = 'SILA_A' | 'SILA_B' | 'CARDIO_1' | 'CARDIO_2';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: string;
  restTime: string;
  notes?: string;
  tempo?: string;
}

export interface Workout {
  id: string;
  type: WorkoutType;
  name: string;
  description: string;
  restBetweenSets: string;
  tempo?: string;
  exercises: Exercise[];
}

export interface CardioOption {
  id: string;
  name: string;
  description: string;
  phases: {
    name: string;
    duration: string;
    description: string;
  }[];
}

export interface DaySchedule {
  dayNumber: number;
  workoutType: WorkoutType;
  completed: boolean;
  completedAt?: string;
}

export interface ExerciseProgress {
  exerciseId: string;
  completed: boolean;
  sets: SetProgress[];
  notes?: string;
}

export interface SetProgress {
  setNumber: number;
  completed: boolean;
  weight?: number;
  reps?: number;
  duration?: number;
}

export interface WorkoutSession {
  id: string;
  date: string;
  workoutType: WorkoutType;
  startTime: string;
  endTime?: string;
  exercises: ExerciseProgress[];
  totalDuration?: number;
  caloriesBurned?: number;
  notes?: string;
  syncedToGoogleFit: boolean;
}

export interface UserStats {
  totalWorkouts: number;
  totalDuration: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate?: string;
}

export interface GoogleFitData {
  isConnected: boolean;
  lastSync?: string;
  accessToken?: string;
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DaySchedule,
  WorkoutSession,
  ExerciseProgress,
  SetProgress,
  UserStats,
  GoogleFitData,
  WorkoutType
} from '../types';
import { generateSchedule, getWorkoutForDay } from '../data/schedule';

// Calculate which day of the plan we're on
function calculateCurrentDay(planStartDate: string | null, scheduleLength: number = 28): number {
  if (!planStartDate) return 1;

  const start = new Date(planStartDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));

  // Cycle within schedule length (wraps around after 28 days)
  const day = (diffDays % scheduleLength) + 1;
  return Math.max(1, Math.min(day, scheduleLength));
}

interface WorkoutStore {
  // Schedule
  schedule: DaySchedule[];
  currentDayNumber: number;
  planStartDate: string | null;

  // Active session
  activeSession: WorkoutSession | null;

  // History
  completedSessions: WorkoutSession[];

  // Stats
  stats: UserStats;

  // Google Fit
  googleFit: GoogleFitData;

  // Actions - Schedule
  initializeSchedule: () => void;
  syncDayWithDate: () => void;
  markDayCompleted: (dayNumber: number) => void;
  getTodayWorkout: () => WorkoutType;

  // Actions - Session
  startSession: (workoutType: WorkoutType) => void;
  endSession: () => void;
  updateExerciseProgress: (exerciseId: string, progress: Partial<ExerciseProgress>) => void;
  completeSet: (exerciseId: string, setIndex: number, data: Partial<SetProgress>) => void;

  // Actions - Stats
  updateStats: () => void;

  // Actions - Google Fit
  connectGoogleFit: (accessToken: string) => void;
  disconnectGoogleFit: () => void;
  syncToGoogleFit: (sessionId: string) => Promise<void>;

  // Utility
  resetProgress: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      // Initial state
      schedule: generateSchedule(28),
      currentDayNumber: 1,
      planStartDate: null,
      activeSession: null,
      completedSessions: [],
      stats: {
        totalWorkouts: 0,
        totalDuration: 0,
        currentStreak: 0,
        longestStreak: 0
      },
      googleFit: {
        isConnected: false
      },

      // Schedule actions
      initializeSchedule: () => {
        set({ schedule: generateSchedule(28) });
      },

      syncDayWithDate: () => {
        let { planStartDate, activeSession } = get();

        // If no start date, set it to today (plan starts now)
        if (!planStartDate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          planStartDate = today.toISOString();
          set({ planStartDate });
        }

        // Clear stale active sessions (older than 4 hours)
        if (activeSession) {
          const sessionAge = Date.now() - new Date(activeSession.startTime).getTime();
          if (sessionAge > 4 * 60 * 60 * 1000) {
            set({ activeSession: null });
          }
        }

        const currentDayNumber = calculateCurrentDay(planStartDate, get().schedule.length);
        set({ currentDayNumber });
      },

      getTodayWorkout: () => {
        const { currentDayNumber } = get();
        return getWorkoutForDay(currentDayNumber);
      },

      markDayCompleted: (dayNumber: number) => {
        const schedule = [...get().schedule];
        const dayIndex = dayNumber - 1;
        if (dayIndex >= 0 && dayIndex < schedule.length) {
          schedule[dayIndex] = {
            ...schedule[dayIndex],
            completed: true,
            completedAt: new Date().toISOString()
          };
          set({ schedule });
        }
        get().updateStats();
      },

      // Session actions
      startSession: (workoutType: WorkoutType) => {
        const session: WorkoutSession = {
          id: `session-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          workoutType,
          startTime: new Date().toISOString(),
          exercises: [],
          syncedToGoogleFit: false
        };
        set({ activeSession: session });
      },

      endSession: () => {
        const activeSession = get().activeSession;
        if (activeSession) {
          const endTime = new Date().toISOString();
          const startTime = new Date(activeSession.startTime).getTime();
          const totalDuration = Math.round((new Date(endTime).getTime() - startTime) / 60000);

          const completedSession: WorkoutSession = {
            ...activeSession,
            endTime,
            totalDuration
          };

          // Mark the current day as completed
          const currentDayNumber = get().currentDayNumber;
          get().markDayCompleted(currentDayNumber);

          set({
            activeSession: null,
            completedSessions: [...get().completedSessions, completedSession]
          });

          get().updateStats();
        }
      },

      updateExerciseProgress: (exerciseId: string, progress: Partial<ExerciseProgress>) => {
        const activeSession = get().activeSession;
        if (!activeSession) return;

        const exerciseIndex = activeSession.exercises.findIndex(e => e.exerciseId === exerciseId);

        if (exerciseIndex >= 0) {
          const exercises = [...activeSession.exercises];
          exercises[exerciseIndex] = { ...exercises[exerciseIndex], ...progress };
          set({ activeSession: { ...activeSession, exercises } });
        } else {
          const newProgress: ExerciseProgress = {
            exerciseId,
            completed: false,
            sets: [],
            ...progress
          };
          set({
            activeSession: {
              ...activeSession,
              exercises: [...activeSession.exercises, newProgress]
            }
          });
        }
      },

      completeSet: (exerciseId: string, setIndex: number, data: Partial<SetProgress>) => {
        const activeSession = get().activeSession;
        if (!activeSession) return;

        let exercises = [...activeSession.exercises];
        let exerciseProgress = exercises.find(e => e.exerciseId === exerciseId);

        if (!exerciseProgress) {
          exerciseProgress = {
            exerciseId,
            completed: false,
            sets: []
          };
          exercises.push(exerciseProgress);
        }

        const exerciseIndex = exercises.indexOf(exerciseProgress);
        const sets = [...exerciseProgress.sets];

        while (sets.length <= setIndex) {
          sets.push({ setNumber: sets.length + 1, completed: false });
        }

        sets[setIndex] = {
          ...sets[setIndex],
          ...data,
          completed: true
        };

        exercises[exerciseIndex] = {
          ...exerciseProgress,
          sets,
          completed: sets.length > 0 && sets.every(s => s.completed)
        };

        set({ activeSession: { ...activeSession, exercises } });
      },

      // Stats actions
      updateStats: () => {
        const sessions = get().completedSessions;
        const schedule = get().schedule;

        const completedDays = schedule.filter(d => d.completed);

        let currentStreak = 0;
        let longestStreak = get().stats.longestStreak;

        // Calculate streak based on completed sessions
        const sortedSessions = [...sessions].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        if (sortedSessions.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const lastSession = sortedSessions[0].date;

          // If last session was today or yesterday
          if (lastSession === today ||
              new Date(lastSession).getTime() >= new Date(today).getTime() - 86400000) {
            currentStreak = 1;
            for (let i = 1; i < sortedSessions.length; i++) {
              const diff = new Date(sortedSessions[i-1].date).getTime() -
                          new Date(sortedSessions[i].date).getTime();
              // Max 2 days gap (since we train every day)
              if (diff <= 86400000 * 2) {
                currentStreak++;
              } else {
                break;
              }
            }
          }
        }

        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }

        const totalDuration = sessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0);

        set({
          stats: {
            totalWorkouts: completedDays.length,
            totalDuration,
            currentStreak,
            longestStreak,
            lastWorkoutDate: sortedSessions[0]?.date
          }
        });
      },

      // Google Fit actions
      connectGoogleFit: (accessToken: string) => {
        set({
          googleFit: {
            isConnected: true,
            accessToken,
            lastSync: new Date().toISOString()
          }
        });
      },

      disconnectGoogleFit: () => {
        set({
          googleFit: {
            isConnected: false
          }
        });
      },

      syncToGoogleFit: async (sessionId: string) => {
        const session = get().completedSessions.find(s => s.id === sessionId);
        const googleFit = get().googleFit;

        if (!session || !googleFit.isConnected || !googleFit.accessToken) {
          throw new Error('Cannot sync: session not found or Google Fit not connected');
        }

        const sessions = get().completedSessions.map(s =>
          s.id === sessionId ? { ...s, syncedToGoogleFit: true } : s
        );

        set({
          completedSessions: sessions,
          googleFit: {
            ...googleFit,
            lastSync: new Date().toISOString()
          }
        });
      },

      // Utility
      resetProgress: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        set({
          schedule: generateSchedule(28),
          planStartDate: today.toISOString(),
          currentDayNumber: 1,
          activeSession: null,
          completedSessions: [],
          stats: {
            totalWorkouts: 0,
            totalDuration: 0,
            currentStreak: 0,
            longestStreak: 0
          }
        });
      }
    }),
    {
      name: 'fitness-tracker-storage',
      version: 2 // Increment version to force reset for new data structure
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WeekSchedule,
  WorkoutSession,
  ExerciseProgress,
  SetProgress,
  UserStats,
  GoogleFitData,
  WorkoutType
} from '../types';
import { generateMonthSchedule } from '../data/schedule';

interface WorkoutStore {
  // Schedule
  schedule: WeekSchedule[];
  currentWeek: number;
  currentDay: number;

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
  setCurrentWeek: (week: number) => void;
  markDayCompleted: (weekIndex: number, dayIndex: number) => void;

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
      schedule: generateMonthSchedule(),
      currentWeek: 0,
      currentDay: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
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
        set({ schedule: generateMonthSchedule() });
      },

      setCurrentWeek: (week: number) => {
        set({ currentWeek: week });
      },

      markDayCompleted: (weekIndex: number, dayIndex: number) => {
        const schedule = [...get().schedule];
        schedule[weekIndex].days[dayIndex].completed = true;
        schedule[weekIndex].days[dayIndex].completedAt = new Date().toISOString();
        set({ schedule });
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

        const completedDays = schedule.flatMap(w => w.days).filter(d => d.completed && d.workoutType !== 'REST');

        let currentStreak = 0;
        let longestStreak = get().stats.longestStreak;

        // Calculate streak (simplified)
        const sortedSessions = [...sessions].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        if (sortedSessions.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const lastSession = sortedSessions[0].date;

          if (lastSession === today ||
              new Date(lastSession).getTime() >= new Date(today).getTime() - 86400000 * 2) {
            currentStreak = 1;
            for (let i = 1; i < sortedSessions.length; i++) {
              const diff = new Date(sortedSessions[i-1].date).getTime() -
                          new Date(sortedSessions[i].date).getTime();
              if (diff <= 86400000 * 3) { // Allow 3 days gap (rest days)
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

        // This would normally make an API call to Google Fit
        // For now, we just mark it as synced
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
        set({
          schedule: generateMonthSchedule(),
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
      version: 1
    }
  )
);

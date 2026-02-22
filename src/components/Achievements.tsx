import { useWorkoutStore } from '../store/workoutStore';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  check: (stats: AchievementStats) => boolean;
}

interface AchievementStats {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  totalDuration: number;
  completedSessions: number;
  workoutTypes: { SILA_A: number; SILA_B: number; CARDIO_1: number };
}

const achievements: Achievement[] = [
  {
    id: 'first-workout',
    name: 'Pierwszy krok',
    icon: '🎯',
    description: 'Ukończ pierwszy trening',
    check: (stats) => stats.totalWorkouts >= 1
  },
  {
    id: 'streak-3',
    name: 'Rozpędzony',
    icon: '🔥',
    description: '3 treningi z rzędu',
    check: (stats) => stats.currentStreak >= 3 || stats.longestStreak >= 3
  },
  {
    id: 'streak-5',
    name: 'Nie do zatrzymania',
    icon: '⚡',
    description: '5 treningów z rzędu',
    check: (stats) => stats.currentStreak >= 5 || stats.longestStreak >= 5
  },
  {
    id: 'streak-7',
    name: 'Tydzień perfekcji',
    icon: '📅',
    description: '7 treningów z rzędu (cały tydzień)',
    check: (stats) => stats.currentStreak >= 7 || stats.longestStreak >= 7
  },
  {
    id: 'push-master',
    name: 'Push Master',
    icon: '🏋️',
    description: 'Ukończ 5 treningów Siła A',
    check: (stats) => stats.workoutTypes.SILA_A >= 5
  },
  {
    id: 'pull-master',
    name: 'Pull Master',
    icon: '💪',
    description: 'Ukończ 5 treningów Siła B',
    check: (stats) => stats.workoutTypes.SILA_B >= 5
  },
  {
    id: 'hiit-warrior',
    name: 'HIIT Warrior',
    icon: '🔥',
    description: 'Ukończ 5 treningów HIIT',
    check: (stats) => stats.workoutTypes.CARDIO_1 >= 5
  },
  {
    id: 'hiit-master',
    name: 'Mistrz HIIT',
    icon: '⚡',
    description: 'Ukończ 10 treningów HIIT',
    check: (stats) => stats.workoutTypes.CARDIO_1 >= 10
  },
  {
    id: 'hour-warrior',
    name: 'Godzinny wojownik',
    icon: '⏱️',
    description: 'Spędź łącznie 60 minut na treningu',
    check: (stats) => stats.totalDuration >= 60
  },
  {
    id: 'dedicated',
    name: 'Oddany',
    icon: '🏆',
    description: 'Ukończ 14 treningów (2 tygodnie)',
    check: (stats) => stats.totalWorkouts >= 14
  },
  {
    id: 'month-complete',
    name: 'Miesiąc mocy',
    icon: '🌟',
    description: 'Ukończ 28 treningów (miesiąc)',
    check: (stats) => stats.totalWorkouts >= 28
  },
  {
    id: 'streak-14',
    name: 'Legenda',
    icon: '👑',
    description: '14 treningów z rzędu',
    check: (stats) => stats.currentStreak >= 14 || stats.longestStreak >= 14
  }
];

export function Achievements() {
  const { stats, completedSessions } = useWorkoutStore();

  // Calculate workout type counts
  const workoutTypes = completedSessions.reduce(
    (acc, session) => {
      if (session.workoutType === 'SILA_A') acc.SILA_A++;
      else if (session.workoutType === 'SILA_B') acc.SILA_B++;
      else if (session.workoutType === 'CARDIO_1') acc.CARDIO_1++;
      return acc;
    },
    { SILA_A: 0, SILA_B: 0, CARDIO_1: 0 }
  );

  const achievementStats: AchievementStats = {
    totalWorkouts: stats.totalWorkouts,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    totalDuration: stats.totalDuration,
    completedSessions: completedSessions.length,
    workoutTypes
  };

  const unlockedCount = achievements.filter(a => a.check(achievementStats)).length;

  return (
    <div className="achievements-section">
      <h3>Osiągnięcia ({unlockedCount}/{achievements.length})</h3>
      <div className="achievements-grid">
        {achievements.map((achievement) => {
          const unlocked = achievement.check(achievementStats);
          return (
            <div
              key={achievement.id}
              className={`achievement-card ${unlocked ? 'unlocked' : 'locked'}`}
              title={achievement.description}
            >
              <span className="achievement-icon">{achievement.icon}</span>
              <span className="achievement-name">{achievement.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

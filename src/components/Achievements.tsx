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
  workoutTypes: { A: number; B: number; AEROBY: number };
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
    id: 'week-complete',
    name: 'Tydzień za nami',
    icon: '📅',
    description: 'Ukończ 4 treningi w tygodniu',
    check: (stats) => stats.totalWorkouts >= 4
  },
  {
    id: 'strength-master',
    name: 'Siłacz',
    icon: '🏋️',
    description: 'Ukończ 5 treningów siłowych (A)',
    check: (stats) => stats.workoutTypes.A >= 5
  },
  {
    id: 'hypertrophy-master',
    name: 'Rzeźbiarz',
    icon: '💪',
    description: 'Ukończ 5 treningów hipertrofii (B)',
    check: (stats) => stats.workoutTypes.B >= 5
  },
  {
    id: 'cardio-master',
    name: 'Maratończyk',
    icon: '🏃',
    description: 'Ukończ 5 treningów cardio',
    check: (stats) => stats.workoutTypes.AEROBY >= 5
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
    description: 'Ukończ 10 treningów',
    check: (stats) => stats.totalWorkouts >= 10
  },
  {
    id: 'month-complete',
    name: 'Miesiąc mocy',
    icon: '🌟',
    description: 'Ukończ cały miesięczny plan',
    check: (stats) => stats.totalWorkouts >= 16
  },
  {
    id: 'streak-10',
    name: 'Legenda',
    icon: '👑',
    description: '10 treningów z rzędu',
    check: (stats) => stats.currentStreak >= 10 || stats.longestStreak >= 10
  },
  {
    id: 'three-hours',
    name: 'Czas to mięśnie',
    icon: '💎',
    description: 'Spędź łącznie 3 godziny na treningu',
    check: (stats) => stats.totalDuration >= 180
  }
];

export function Achievements() {
  const { stats, completedSessions } = useWorkoutStore();

  // Calculate workout type counts
  const workoutTypes = completedSessions.reduce(
    (acc, session) => {
      if (session.workoutType === 'A') acc.A++;
      else if (session.workoutType === 'B') acc.B++;
      else if (session.workoutType === 'AEROBY') acc.AEROBY++;
      return acc;
    },
    { A: 0, B: 0, AEROBY: 0 }
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

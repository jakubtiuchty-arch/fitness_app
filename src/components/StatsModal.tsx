import { X, Trophy, Clock, Flame, TrendingUp } from 'lucide-react';
import { useWorkoutStore } from '../store/workoutStore';
import { Achievements } from './Achievements';
import { getWorkoutEmoji } from '../data/schedule';

interface StatsModalProps {
  onClose: () => void;
}

export function StatsModal({ onClose }: StatsModalProps) {
  const { stats, completedSessions, schedule } = useWorkoutStore();

  const totalWorkoutsInPlan = schedule.length;
  const completedWorkouts = schedule.filter(d => d.completed).length;
  const progressPercentage = Math.round((completedWorkouts / totalWorkoutsInPlan) * 100);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content stats-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Twoje statystyki</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Trophy size={24} />
            </div>
            <div className="stat-value">{stats.totalWorkouts}</div>
            <div className="stat-label">Ukończone treningi</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-value">{formatDuration(stats.totalDuration)}</div>
            <div className="stat-label">Łączny czas</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Flame size={24} />
            </div>
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Aktualna passa</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-value">{stats.longestStreak}</div>
            <div className="stat-label">Najdłuższa passa</div>
          </div>
        </div>

        <div className="progress-section">
          <h3>Postęp planu</h3>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="progress-text">
            <span>{completedWorkouts} z {totalWorkoutsInPlan} dni</span>
            <span>{progressPercentage}%</span>
          </div>
        </div>

        {completedSessions.length > 0 && (
          <div className="recent-section">
            <h3>Ostatnie treningi</h3>
            <div className="recent-list">
              {completedSessions.slice(-5).reverse().map(session => (
                <div key={session.id} className="recent-item">
                  <div className="recent-type">
                    {getWorkoutEmoji(session.workoutType)}
                    <span>{session.workoutType.replace('_', ' ')}</span>
                  </div>
                  <div className="recent-date">{new Date(session.date).toLocaleDateString('pl-PL')}</div>
                  <div className="recent-duration">{session.totalDuration} min</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Achievements />
      </div>
    </div>
  );
}

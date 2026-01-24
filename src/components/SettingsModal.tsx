import { useState } from 'react';
import { X, Trash2, CloudOff, Check } from 'lucide-react';
import { useWorkoutStore } from '../store/workoutStore';
import { GoogleFitButton } from './GoogleFitButton';
import { ConfirmModal } from './ConfirmModal';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { googleFit, resetProgress, disconnectGoogleFit, currentDayNumber, planStartDate } = useWorkoutStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetConfirm = () => {
    resetProgress();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content settings-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Ustawienia</h2>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          <div className="settings-section">
            <h3>Google Fit</h3>
            <p className="settings-description">
              Połącz z Google Fit, aby automatycznie synchronizować swoje treningi.
            </p>

            <div className="google-fit-status">
              {googleFit.isConnected ? (
                <div className="connected-status">
                  <div className="status-badge success">
                    <Check size={16} />
                    <span>Połączono</span>
                  </div>
                  {googleFit.lastSync && (
                    <p className="last-sync">
                      Ostatnia synchronizacja: {new Date(googleFit.lastSync).toLocaleString('pl-PL')}
                    </p>
                  )}
                  <button className="disconnect-button" onClick={disconnectGoogleFit}>
                    <CloudOff size={18} />
                    <span>Rozłącz</span>
                  </button>
                </div>
              ) : (
                <GoogleFitButton />
              )}
            </div>
          </div>

          <div className="settings-section">
            <h3>Plan treningowy</h3>
            <p className="settings-description">
              Plan przygotowawczy do sezonu - codzienna rotacja.
            </p>
            <div className="plan-info">
              <div className="plan-item">
                <span>Siła A:</span>
                <span>Push & Legs (6 ćwiczeń)</span>
              </div>
              <div className="plan-item">
                <span>Cardio 1:</span>
                <span>HIIT Interwały 45s/45s</span>
              </div>
              <div className="plan-item">
                <span>Siła B:</span>
                <span>Pull & Hinge (6 ćwiczeń)</span>
              </div>
              <div className="plan-item">
                <span>Cardio 2:</span>
                <span>LISS Bieg ciągły 45-60 min</span>
              </div>
            </div>

            <div className="week-counter-section">
              <div className="plan-item">
                <span>Aktualny dzień:</span>
                <span>Dzień {currentDayNumber}</span>
              </div>
              {planStartDate && (
                <div className="plan-item">
                  <span>Start planu:</span>
                  <span>{new Date(planStartDate).toLocaleDateString('pl-PL')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="settings-section danger">
            <h3>Strefa niebezpieczna</h3>
            <p className="settings-description">
              Zresetuj cały postęp i zacznij od Dnia 1.
            </p>
            <button className="danger-button" onClick={() => setShowResetConfirm(true)}>
              <Trash2 size={18} />
              <span>Resetuj postęp</span>
            </button>
          </div>

          <div className="settings-footer">
            <p>FitTrack v2.0.0</p>
            <p>Plan przygotowawczy do sezonu</p>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        title="Resetuj cały postęp"
        message="Czy na pewno chcesz zresetować cały postęp? Zaczniesz od Dnia 1. Ta operacja jest nieodwracalna."
        confirmText="Tak, resetuj wszystko"
        cancelText="Anuluj"
        variant="danger"
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}

import { X, Trash2, CloudOff, Check } from 'lucide-react';
import { useWorkoutStore } from '../store/workoutStore';
import { GoogleFitButton } from './GoogleFitButton';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { googleFit, resetProgress, disconnectGoogleFit } = useWorkoutStore();

  const handleResetProgress = () => {
    if (window.confirm('Czy na pewno chcesz zresetować cały postęp? Ta operacja jest nieodwracalna.')) {
      resetProgress();
      onClose();
    }
  };

  return (
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
            Aktualnie używasz planu "Full Body + Aeroby - 1 miesiąc".
          </p>
          <div className="plan-info">
            <div className="plan-item">
              <span>Trening A:</span>
              <span>Siła i baza (6 ćwiczeń)</span>
            </div>
            <div className="plan-item">
              <span>Trening B:</span>
              <span>Hipertrofia i detal (6 ćwiczeń)</span>
            </div>
            <div className="plan-item">
              <span>Aeroby:</span>
              <span>Interwały lub stałe tempo</span>
            </div>
          </div>
        </div>

        <div className="settings-section danger">
          <h3>Strefa niebezpieczna</h3>
          <p className="settings-description">
            Zresetuj cały postęp i zacznij od nowa.
          </p>
          <button className="danger-button" onClick={handleResetProgress}>
            <Trash2 size={18} />
            <span>Resetuj postęp</span>
          </button>
        </div>

        <div className="settings-footer">
          <p>FitTrack v1.0.0</p>
          <p>Stworzono z myślą o Twoich celach</p>
        </div>
      </div>
    </div>
  );
}

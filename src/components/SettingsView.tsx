import { useState } from 'react';
import { Trash2, CloudOff, Check } from 'lucide-react';
import { useWorkoutStore } from '../store/workoutStore';
import { GoogleFitButton } from './GoogleFitButton';
import { ConfirmModal } from './ConfirmModal';

export function SettingsView() {
  const { googleFit, resetProgress, disconnectGoogleFit, currentDayNumber, planStartDate } = useWorkoutStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetConfirm = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-ios-bg pb-32 animate-in fade-in duration-300">
      <div className="sticky top-0 z-40 bg-ios-bg/90 backdrop-blur-xl border-b border-ios-gray4">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-3xl font-bold text-white tracking-tight">Ustawienia</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
        
        {/* Integracje Group */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-ios-gray uppercase tracking-widest pl-4">Integracje</span>
          <div className="bg-ios-card rounded-2xl overflow-hidden border border-ios-gray4/50">
            <div className="p-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" fill="#4285F4"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white">Google Fit</h3>
                  <p className="text-sm text-ios-gray">Synchronizuj treningi z aplikacją zdrowotną.</p>
                </div>
              </div>

              {googleFit.isConnected ? (
                <div className="bg-ios-bg rounded-xl p-3 border border-ios-gray4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[#32D74B] text-sm font-semibold">
                      <Check size={16} /> Połączono
                    </div>
                    {googleFit.lastSync && (
                      <p className="text-xs text-ios-gray mt-1">Ostatnio: {new Date(googleFit.lastSync).toLocaleString('pl-PL')}</p>
                    )}
                  </div>
                  <button 
                    className="flex items-center gap-2 bg-ios-gray4/50 hover:bg-ios-gray4 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                    onClick={disconnectGoogleFit}
                  >
                    <CloudOff size={16} /> Rozłącz
                  </button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <GoogleFitButton />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Plan Treningowy Group */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-ios-gray uppercase tracking-widest pl-4">Aktualny plan</span>
          <div className="bg-ios-card rounded-2xl overflow-hidden border border-ios-gray4/50">
            <div className="p-4 border-b border-ios-gray4/50">
              <h3 className="text-base font-semibold text-white mb-1">Przygotowanie do sezonu</h3>
              <p className="text-sm text-ios-gray mb-4">Codzienna rotacja (Push, HIIT, Pull, HIIT)</p>
              
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-ios-gray">
                    <span className="text-[#5E5CE6]">💪</span> Siła A
                  </div>
                  <span className="text-white font-medium">Push & Legs</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-ios-gray">
                    <span className="text-[#FF453A]">🔥</span> Cardio 1
                  </div>
                  <span className="text-white font-medium">HIIT Interwały</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-ios-gray">
                    <span className="text-[#0A84FF]">🦍</span> Siła B
                  </div>
                  <span className="text-white font-medium">Pull & Hinge</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-ios-gray">
                    <span className="text-[#FF453A]">🔥</span> Cardio 1
                  </div>
                  <span className="text-white font-medium">HIIT Interwały</span>
                </div>
              </div>
            </div>
            
            <div className="bg-ios-bg p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-ios-gray">Dzień cyklu:</span>
                <span className="text-black font-bold text-lg bg-[#A8F000] px-3 py-0.5 rounded-lg">{currentDayNumber}</span>
              </div>
              {planStartDate && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ios-gray">Rozpoczęto:</span>
                  <span className="text-white font-medium">{new Date(planStartDate).toLocaleDateString('pl-PL')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Danger Zone Group */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-ios-gray uppercase tracking-widest pl-4">Strefa niebezpieczna</span>
          <div className="bg-ios-card rounded-2xl overflow-hidden border border-ios-gray4/50 p-4">
            <h3 className="text-base font-semibold text-[#FF453A] mb-1">Reset postępów</h3>
            <p className="text-sm text-ios-gray mb-4">Kasuje całą historię treningów i przywraca plan do pierwszego dnia. Operacji nie można cofnąć.</p>
            
            <button 
              className="w-full bg-[#FF453A]/10 hover:bg-[#FF453A]/20 text-[#FF453A] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors border border-[#FF453A]/20"
              onClick={() => setShowResetConfirm(true)}
            >
              <Trash2 size={20} />
              Resetuj i zacznij od nowa
            </button>
          </div>
        </div>

        <div className="text-center text-ios-gray mt-6 mb-8">
          <p className="text-sm font-semibold">FitTrack v2.0</p>
          <p className="text-xs opacity-70 mt-1">Stworzone z pasją</p>
        </div>
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        title="Czy na pewno?"
        message="Trwale usuniesz wszystkie swoje postępy i rozpoczniesz plan całkowicie od zera. Nie będziesz mógł tego cofnąć."
        confirmText="Tak, usuń postęp"
        cancelText="Anuluj"
        variant="danger"
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}

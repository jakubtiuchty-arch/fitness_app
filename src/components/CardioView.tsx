import { ArrowLeft, Play, Pause, Check, Timer, Flame, Heart } from 'lucide-react';
import { getCardioOption } from '../data/workouts';
import type { WorkoutSession } from '../types';
import { IntervalTimer } from './IntervalTimer';

interface CardioViewProps {
  cardioType: 'CARDIO_1';
  onBack: () => void;
  activeSession: WorkoutSession | null;
  onStart: () => void;
  onFinish: () => void;
  elapsed: number;
  isRunning: boolean;
  onPause: () => void;
  formatTime: (seconds: number) => string;
}

export function CardioView({
  cardioType,
  onBack,
  activeSession,
  onStart,
  onFinish,
  elapsed,
  isRunning,
  onPause,
  formatTime
}: CardioViewProps) {
  const cardioOption = getCardioOption();
  const isHIIT = cardioType === 'CARDIO_1';

  return (
    <div className="min-h-screen bg-ios-bg pb-32">
      {/* IOS Sticky Header */}
      <div className="sticky top-0 z-40 bg-ios-bg/90 backdrop-blur-xl border-b border-ios-gray4">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-ios-gray4/50 text-ios-primary active:scale-95 transition-transform" 
            onClick={onBack}
          >
            <ArrowLeft size={22} />
          </button>
          
          <div className="flex-1 text-center">
            <span className="text-xs font-semibold text-ios-primary uppercase tracking-widest block">
              {isHIIT ? 'CARDIO 1' : 'CARDIO 2'}
            </span>
            <span className="text-sm text-ios-gray font-medium">
              {isHIIT ? '🔥 Interwały HIIT' : '🏃 Bieg ciągły LISS'}
            </span>
          </div>

          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
        {/* Show interval timer for HIIT when session is active */}
        {isHIIT && activeSession && (
          <IntervalTimer
            totalRounds={10}
            runTime={45}
            walkTime={45}
            onComplete={onFinish}
            autoStart={true}
          />
        )}

        {/* Show regular timer for LISS */}
        {!isHIIT && activeSession && (
          <div className="bg-[#32D74B]/10 border border-[#32D74B]/20 rounded-[32px] p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(50,215,75,0.1)]">
            <span className="text-[#32D74B] text-xs font-bold tracking-widest uppercase mb-2">
              Czas Treningu
            </span>
            <div className="text-7xl font-black text-white tracking-tighter font-mono mb-6">
              {formatTime(elapsed)}
            </div>
            
            <div className="flex items-center gap-4 bg-ios-bg/50 px-4 py-3 rounded-2xl border border-ios-gray4 mb-8">
              <div className="flex flex-col items-center px-2">
                <Timer size={16} className="text-ios-gray mb-1" />
                <span className="text-[10px] text-ios-gray uppercase font-bold">Cel</span>
                <span className="text-sm text-white font-medium">45-60 min</span>
              </div>
              <div className="w-px h-8 bg-ios-gray4"></div>
              <div className="flex flex-col items-center px-2">
                <Heart size={16} className="text-[#FF453A] mb-1" />
                <span className="text-[10px] text-ios-gray uppercase font-bold">Tętno</span>
                <span className="text-sm text-white font-medium">65-70% HRmax</span>
              </div>
            </div>

            <button 
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-transform active:scale-90 ${isRunning ? 'bg-ios-gray4 text-white' : 'bg-[#32D74B] text-black shadow-[0_0_20px_rgba(50,215,75,0.4)]'}`}
              onClick={onPause}
            >
              {isRunning ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-1" />}
            </button>
          </div>
        )}

        {/* Phase description - only before starting */}
        {!activeSession && (
          <div className="flex flex-col gap-4">
            <div className="bg-ios-card rounded-2xl p-5 border border-ios-gray4/50 shadow-sm">
              <p className="text-sm text-ios-gray leading-relaxed m-0">{cardioOption.description}</p>
            </div>

            <h3 className="text-lg font-bold text-white mt-2 ml-1">Fazy Treningu</h3>
            <div className="flex flex-col gap-3">
              {cardioOption.phases.map((phase, index) => (
                <div key={index} className="bg-ios-card rounded-2xl p-4 border border-ios-gray4/50 flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isHIIT ? 'bg-[#FF453A]/20 text-[#FF453A]' : 'bg-[#32D74B]/20 text-[#32D74B]'}`}>
                    {isHIIT ? <Flame size={24} /> : <Heart size={24} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-base font-bold text-white truncate pr-2">{phase.name}</h4>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 ${isHIIT ? 'bg-[#FF453A]/10 text-[#FF453A]' : 'bg-[#32D74B]/10 text-[#32D74B]'}`}>
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-sm text-ios-gray leading-snug">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {isHIIT && (
              <div className="mt-4 flex items-start gap-3 bg-[#FF9F0A]/10 text-[#FF9F0A] p-4 rounded-2xl border border-[#FF9F0A]/20">
                <span className="text-xl shrink-0">⚠️</span>
                <div className="text-sm leading-relaxed">
                  <strong>Autoregulacja:</strong> Jeśli czujesz, że nogi masz z betonu po wczorajszych przysiadach – zmień na CARDIO 2 (LISS). Lepiej lżejszy trening niż kontuzja.
                </div>
              </div>
            )}

            {!isHIIT && (
              <div className="mt-4 flex items-start gap-3 bg-ios-primary/10 text-ios-primary p-4 rounded-2xl border border-ios-primary/20">
                <span className="text-xl shrink-0">💡</span>
                <div className="text-sm leading-relaxed">
                  <strong>Opcje:</strong> Możesz wybrać bieg z narastającą prędkością (BNP) - zaczynasz wolno, co 10 min zwiększasz tempo. Ostatnie 10 min mocne.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pływający pasek akcji na dole */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-ios-glass backdrop-blur-xl border-t border-ios-gray4/50 pb-safe z-50">
        <div className="max-w-md mx-auto">
          {!activeSession ? (
            <button 
              className={`w-full text-black font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 !opacity-100 ${isHIIT ? 'bg-[#FF453A] shadow-[0_0_20px_rgba(255,69,58,0.3)] text-white' : 'bg-[#32D74B] shadow-[0_0_20px_rgba(50,215,75,0.3)]'}`}
              onClick={onStart}
            >
              <Play size={24} className="fill-current" />
              <span>Rozpocznij {isHIIT ? 'interwały' : 'bieg'}</span>
            </button>
          ) : (
            <button 
              className={`w-full bg-ios-card hover:bg-ios-gray4 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 border ${isHIIT ? 'border-[#FF453A]/50 text-[#FF453A]' : 'border-[#32D74B]/50 text-[#32D74B]'}`}
              onClick={onFinish}
            >
              <Check size={24} strokeWidth={3} />
              <span>Zakończ trening</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

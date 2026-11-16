import React from 'react';
import { formatElapsedTime, toFa } from '../game/capstoneEngine';

export interface XpToastInfo {
  id: number;
  amount: number;
  streak: number;
}

interface MissionHeaderProps {
  currentStageIndex: number; // -1 on title, 0..4 during stages, 5 on victory
  xp: number;
  streak: number;
  remainingSeconds: number;
  xpToast: XpToastInfo | null;
  muted: boolean;
  onToggleMute: () => void;
  onRequestExit: () => void;
}

export const MissionHeader: React.FC<MissionHeaderProps> = ({
  currentStageIndex,
  xp,
  streak,
  remainingSeconds,
  xpToast,
  muted,
  onToggleMute,
  onRequestExit
}) => {
  const showPlayStats = currentStageIndex >= 0 && currentStageIndex < 5;
  const lowTime = remainingSeconds <= 30;

  return (
    <header className="relative z-20 mx-auto w-full max-w-[680px] px-3 pt-3 pb-1.5 sm:px-5">
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-[#7DB3FF]/25 bg-[#0A1A42]/80 px-2.5 py-2 shadow-[0_8px_24px_rgba(3,10,28,0.4)] backdrop-blur-md sm:px-3.5">
        {/* Right side in RTL: Back button + Mission Title */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onRequestExit}
            aria-label="برگشت به شروع"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#7DB3FF]/40 bg-[#17367A] text-lg font-black text-white shadow-[0_2px_0_#0A1940] transition-all duration-150 hover:bg-[#1F4699] active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#58E6CB] sm:h-10 sm:w-10"
          >
            <span aria-hidden="true">›</span>
          </button>
          <h1 className="truncate text-sm font-black tracking-tight text-white sm:text-base">
            انواع یادگیری ماشین
          </h1>
        </div>

        {/* Left side in RTL: Countdown Timer + Streak + XP + Mute */}
        <div className="relative flex shrink-0 items-center gap-1.5 sm:gap-2">
          {showPlayStats && (() => {
            const radius = 13;
            const circ = 2 * Math.PI * radius;
            const fraction = Math.max(0, Math.min(1, remainingSeconds / 300));
            const offset = circ - fraction * circ;
            return (
              <div
                data-testid="mission-timer"
                dir="ltr"
                aria-label={`زمان باقی‌مانده ${formatElapsedTime(remainingSeconds)}`}
                className={`flex h-9 items-center gap-1.5 rounded-xl border px-2 text-[11px] font-black tabular-nums transition-colors sm:h-10 sm:px-2.5 sm:text-xs ${
                  lowTime
                    ? 'border-[#FF8A6B] bg-[#5C1D24] text-[#FFE0D6]'
                    : 'border-[#7DB3FF]/40 bg-[#132B63] text-[#DCEBFF]'
                }`}
              >
                <div className="relative grid h-7 w-7 shrink-0 place-items-center">
                  <svg className="h-7 w-7 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
                    <circle cx="16" cy="16" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                    <circle
                      cx="16"
                      cy="16"
                      r={radius}
                      fill="none"
                      stroke={lowTime ? '#FF8A6B' : '#5EE6D0'}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={offset}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <span className="absolute text-[10px]" aria-hidden="true">⏱</span>
                </div>
                <span>{formatElapsedTime(remainingSeconds)}</span>
              </div>
            );
          })()}

          <div
            className="relative flex h-9 items-center gap-1 rounded-xl border border-[#FFD24C]/70 bg-[#FFD24C] px-2.5 text-xs font-black text-[#000000] tabular-nums shadow-[0_2px_0_#B87B09] sm:h-10 sm:px-3 sm:text-sm"
            aria-label={`${toFa(xp)} امتیاز`}
          >
            <span aria-hidden="true" className="text-[#000000]">
              ★
            </span>
            <span data-testid="xp-value" className="text-[#000000]">{toFa(xp)}</span>

            {xpToast && (
              <>
                <span
                  key={xpToast.id}
                  aria-hidden="true"
                  className="animate-float-xp pointer-events-none absolute -bottom-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#FFD24C] bg-[#0B1533] px-2.5 py-0.5 text-[11px] font-black text-[#FFD24C] shadow-lg"
                >
                  +{toFa(xpToast.amount)} ★{xpToast.streak >= 2 ? ` · ${toFa(xpToast.streak)}×` : ''}
                </span>
                <span className="pointer-events-none absolute -top-3 -right-2 animate-ping text-xs text-[#FFE178]" aria-hidden="true">✦</span>
                <span className="pointer-events-none absolute -bottom-2 -left-3 animate-ping text-xs text-[#58E6CB]" aria-hidden="true">✦</span>
                <span className="pointer-events-none absolute top-1/2 -right-4 animate-bounce text-xs text-[#FFD24C]" aria-hidden="true">★</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'روشن کردن صدای بازی' : 'بستن صدای بازی'}
            aria-pressed={muted}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#7DB3FF]/40 bg-[#17367A] text-sm text-white shadow-[0_2px_0_#0A1940] transition-colors hover:bg-[#1F4699] focus-visible:outline-2 focus-visible:outline-[#58E6CB] sm:h-10 sm:w-10"
          >
            <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

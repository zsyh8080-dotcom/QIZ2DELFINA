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
          {showPlayStats && (
            <div
              data-testid="mission-timer"
              dir="ltr"
              aria-label={`زمان باقی‌مانده ${formatElapsedTime(remainingSeconds)}`}
              className={`flex h-9 items-center gap-1 rounded-xl border px-2 text-[11px] font-black tabular-nums transition-colors sm:h-10 sm:px-2.5 sm:text-xs ${
                lowTime
                  ? 'border-[#FF8A6B] bg-[#5C1D24] text-[#FFE0D6]'
                  : 'border-[#7DB3FF]/40 bg-[#132B63] text-[#DCEBFF]'
              }`}
            >
              <span aria-hidden="true">⏱</span>
              <span>{formatElapsedTime(remainingSeconds)}</span>
            </div>
          )}

          {streak >= 2 && showPlayStats && (
            <div
              key={`streak-${streak}`}
              className="animate-pop flex h-9 items-center gap-0.5 rounded-xl border border-[#FF9E84]/70 bg-[#5C2224]/85 px-2 text-[11px] font-black text-[#FFE07D] tabular-nums sm:h-10 sm:px-2.5 sm:text-xs"
              aria-label={`زنجیرهٔ ${toFa(streak)} پاسخ درست پیاپی`}
            >
              <span aria-hidden="true">🔥</span>
              <span>{toFa(streak)}×</span>
            </div>
          )}

          <div
            className="relative flex h-9 items-center gap-1 rounded-xl border border-[#FFD24C]/70 bg-[#132B63] px-2.5 text-xs font-black text-[#FFE27A] tabular-nums shadow-[0_2px_0_#0A1940] sm:h-10 sm:px-3 sm:text-sm"
            aria-label={`${toFa(xp)} امتیاز`}
          >
            <span aria-hidden="true" className="text-[#FFD24C]">
              ★
            </span>
            <span data-testid="xp-value">{toFa(xp)}</span>

            {xpToast && (
              <span
                key={xpToast.id}
                aria-hidden="true"
                className="animate-float-xp pointer-events-none absolute -bottom-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#FFD24C] bg-[#0B1533] px-2.5 py-0.5 text-[11px] font-black text-[#FFD24C] shadow-lg"
              >
                +{toFa(xpToast.amount)} ★{xpToast.streak >= 2 ? ` · ${toFa(xpToast.streak)}×` : ''}
              </span>
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

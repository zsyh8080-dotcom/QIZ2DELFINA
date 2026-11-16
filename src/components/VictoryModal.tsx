import React, { useState } from 'react';
import {
  formatElapsedTime,
  MasterySummary,
  SavedFinalStats,
  SUMMARY_CARDS,
  toFa
} from '../game/capstoneEngine';
import { MasteryEmblemSvg } from './MasteryEmblemSvg';

interface VictoryModalProps {
  xp: number;
  bestStreak: number;
  elapsedSeconds: number;
  timedOut?: boolean;
  mastery: MasterySummary;
  savedStats: SavedFinalStats;
  onPlayAgain: () => void;
}

const TINT_CLASSES: Record<'gold' | 'mint' | 'lavender' | 'coral', string> = {
  gold: 'border-[#F2CF66] bg-[#FFF8DC] shadow-[0_2px_0_#D1A32A]',
  mint: 'border-[#58E6CB] bg-[#E5FCF7] shadow-[0_2px_0_#19A88F]',
  lavender: 'border-[#9BA8FF] bg-[#EEF0FF] shadow-[0_2px_0_#6B77D9]',
  coral: 'border-[#FF9E84] bg-[#FFF0EC] shadow-[0_2px_0_#D96B4F]'
};

const LEVEL_STEPS: { level: 1 | 2 | 3; label: string; minAcc: string }[] = [
  { level: 1, label: 'سطح ۱ برنزی', minAcc: 'شروع' },
  { level: 2, label: 'سطح ۲ نقره‌ای', minAcc: '۶۰٪' },
  { level: 3, label: 'سطح ۳ طلایی', minAcc: '۸۵٪' }
];

const SummaryConceptGraphic: React.FC<{ id: string }> = ({ id }) => {
  if (id === 'sum-rule') {
    return (
      <svg viewBox="0 0 56 56" className="h-12 w-12 shrink-0" aria-hidden="true">
        <rect x="4" y="4" width="48" height="48" rx="14" fill="#FFF2C6" stroke="#D1A32A" strokeWidth="2" />
        <circle cx="22" cy="28" r="9" fill="none" stroke="#8A5A00" strokeWidth="3.5" strokeDasharray="4.5 2.5" />
        <circle cx="22" cy="28" r="3" fill="#8A5A00" />
        <circle cx="38" cy="22" r="4" fill="#1BB396" />
        <circle cx="38" cy="34" r="4" fill="#3932A8" />
        <line x1="31" y1="28" x2="35" y2="23" stroke="#141933" strokeWidth="2" />
        <line x1="31" y1="28" x2="35" y2="33" stroke="#141933" strokeWidth="2" />
      </svg>
    );
  }
  if (id === 'sum-data') {
    return (
      <svg viewBox="0 0 56 56" className="h-12 w-12 shrink-0" aria-hidden="true">
        <rect x="4" y="4" width="48" height="48" rx="14" fill="#D6FCF3" stroke="#19A88F" strokeWidth="2" />
        <circle cx="25" cy="25" r="10" fill="#FFFFFF" stroke="#0B6153" strokeWidth="3" />
        <line x1="32" y1="32" x2="42" y2="42" stroke="#0B6153" strokeWidth="4" strokeLinecap="round" />
        <circle cx="25" cy="25" r="3.5" fill="#F59E0B" />
      </svg>
    );
  }
  if (id === 'sum-sup') {
    return (
      <svg viewBox="0 0 56 56" className="h-12 w-12 shrink-0" aria-hidden="true">
        <rect x="4" y="4" width="48" height="48" rx="14" fill="#E8EBFF" stroke="#6B77D9" strokeWidth="2" />
        <rect x="11" y="15" width="15" height="26" rx="4" fill="#3932A8" />
        <circle cx="18.5" cy="28" r="4" fill="#FFD24C" />
        <path d="M31 36 A9 9 0 0 1 47 36" fill="none" stroke="#C53030" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="39" y1="36" x2="44" y2="24" stroke="#141933" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="39" cy="36" r="2.5" fill="#141933" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 56 56" className="h-12 w-12 shrink-0" aria-hidden="true">
      <rect x="4" y="4" width="48" height="48" rx="14" fill="#FFE8E3" stroke="#D96B4F" strokeWidth="2" />
      <circle cx="19" cy="22" r="4.5" fill="#0B6153" />
      <circle cx="23" cy="35" r="4.5" fill="#0B6153" />
      <circle cx="15" cy="32" r="4.5" fill="#0B6153" />
      <circle cx="38" cy="21" r="4.5" fill="#9E5D00" />
      <circle cx="40" cy="34" r="4.5" fill="#9E5D00" />
      <circle cx="33" cy="28" r="2.5" fill="#141933" stroke="#FFFFFF" strokeWidth="1" />
    </svg>
  );
};

export const VictoryModal: React.FC<VictoryModalProps> = ({
  xp,
  bestStreak,
  elapsedSeconds,
  timedOut = false,
  mastery,
  savedStats,
  onPlayAgain
}) => {
  const [selectedTip, setSelectedTip] = useState<string>(SUMMARY_CARDS[0].id);
  const activeCard = SUMMARY_CARDS.find((c) => c.id === selectedTip) || SUMMARY_CARDS[0];
  const isNewRecord = savedStats.runsCompleted > 1 && xp >= savedStats.bestScore;

  // Accuracy donut ring geometry (r=20 -> C ≈ 125.66)
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const clampedAcc = Math.max(0, Math.min(100, mastery.accuracyPercent));
  const strokeDashoffset = circumference - (clampedAcc / 100) * circumference;

  return (
    <div className="animate-pop relative mx-auto w-full max-w-[640px] overflow-hidden rounded-[28px] border border-[#FFD24C]/55 bg-[#10275C]/90 p-4 shadow-[0_24px_60px_rgba(3,10,28,0.68)] sm:p-5">
      {/* Graphical Celebration Stage Banner */}
      <div className="relative overflow-hidden rounded-[22px] border border-[#7DB3FF]/35 bg-gradient-to-b from-[#15357B] via-[#0E2458] to-[#08173D] px-4 py-4 text-center">
        {/* Decorative Celebration Constellation Stars */}
        <svg
          aria-hidden="true"
          viewBox="0 0 400 180"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
        >
          <circle cx="42" cy="34" r="2.2" fill="#FFE178" />
          <circle cx="88" cy="70" r="1.6" fill="#6EF3D6" />
          <circle cx="352" cy="38" r="2.4" fill="#FFE178" />
          <circle cx="316" cy="76" r="1.8" fill="#6EF3D6" />
          <path d="M56 122 L60 112 L64 122 L74 126 L64 130 L60 140 L56 130 L46 126 Z" fill="#FFE178" opacity="0.7" />
          <path d="M342 124 L345 116 L348 124 L356 127 L348 130 L345 138 L342 130 L334 127 Z" fill="#6EF3D6" opacity="0.7" />
        </svg>

        <div className="relative flex flex-col items-center">
          <p className="text-xs font-extrabold text-[#7DEEE0]">
            {mastery.levelLabel} ·{' '}
            {timedOut
              ? 'زمان آزمون تموم شد پس ببین چه سطحی گرفتی'
              : isNewRecord
                ? 'رکورد تازه ثبت کردی'
                : 'نشان ویژه باز شد'}
          </p>

          {/* Bespoke Special Level Emblem with Character Inside */}
          <MasteryEmblemSvg
            level={mastery.levelNumber}
            className="mt-1 h-44 w-44 sm:h-48 sm:w-48"
          />

          <h2 className="mt-1 text-xl font-black text-[#FFE178] sm:text-2xl">
            {mastery.badgeName}
          </h2>
          <p className="mt-1 text-sm font-extrabold text-white">
            لقب تو {mastery.rankTitle} هست
          </p>

          {/* Visual 3-Level Achievement Ladder */}
          <div
            className="mt-3.5 grid w-full max-w-[440px] grid-cols-3 gap-2"
            aria-label="نردبان سطح نشان"
          >
            {LEVEL_STEPS.map((step) => {
              const reached = step.level <= mastery.levelNumber;
              const current = step.level === mastery.levelNumber;
              return (
                <div
                  key={step.level}
                  className={`flex flex-col items-center rounded-xl border px-2 py-1.5 text-center transition-colors ${
                    current
                      ? 'border-[#FFD24C] bg-[#FFD24C]/20 text-[#FFE89E]'
                      : reached
                        ? 'border-[#58E6CB]/55 bg-[#58E6CB]/12 text-[#8EF5E1]'
                        : 'border-white/15 bg-[#0A1940]/60 text-[#9DB3DB]'
                  }`}
                >
                  <span className="text-[11px] font-black whitespace-nowrap">
                    {reached ? '★' : '☆'} {step.label}
                  </span>
                  <span className="mt-0.5 text-[10px] font-bold opacity-85">{step.minAcc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3 Graphical Stat Cards (Icon / SVG Progress Gauge / Time & Streak) */}
      <div className="mt-3.5 grid grid-cols-3 gap-2.5">
        {/* Card 1: Score with Gold Star Shield SVG */}
        <div className="flex flex-col items-center justify-center rounded-[18px] border-2 border-[#F2CF66] bg-[#FFFDF7] px-2 py-2.5 text-center text-[#141933] shadow-sm">
          <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
            <circle cx="24" cy="24" r="21" fill="#FFF1BD" stroke="#E0A526" strokeWidth="2.5" />
            <polygon
              points="24,10 28,18.5 37.5,19.8 30.5,26.3 32.3,35.6 24,31 15.7,35.6 17.5,26.3 10.5,19.8 20,18.5"
              fill="#F5B82E"
              stroke="#9E5D00"
              strokeWidth="1.5"
            />
          </svg>
          <div className="mt-1 text-lg font-black text-[#9E5D00] tabular-nums sm:text-xl" dir="ltr">
            {toFa(xp)} ★
          </div>
          <div className="text-[11px] font-extrabold text-[#474D6B] sm:text-xs">امتیاز کل</div>
        </div>

        {/* Card 2: Live Circular SVG Accuracy Ring */}
        <div className="flex flex-col items-center justify-center rounded-[18px] border-2 border-[#58E6CB] bg-[#EFFCF8] px-2 py-2.5 text-center text-[#141933] shadow-sm">
          <div className="relative h-12 w-12">
            <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90" aria-hidden="true">
              <circle
                cx="24"
                cy="24"
                r={radius}
                fill="none"
                stroke="#C3F2E8"
                strokeWidth="5"
              />
              <circle
                cx="24"
                cy="24"
                r={radius}
                fill="none"
                stroke="#0E8F78"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-[11px] font-black text-[#08473D] tabular-nums">
              {toFa(mastery.accuracyPercent)}٪
            </span>
          </div>
          <div className="mt-1 text-lg font-black text-[#0B6153] tabular-nums sm:text-xl">
            {toFa(mastery.accuracyPercent)}٪
          </div>
          <div className="text-[11px] font-extrabold text-[#2C5C54] sm:text-xs">دقت بار اول</div>
        </div>

        {/* Card 3: Streak + Elapsed Stopwatch SVG */}
        <div className="flex flex-col items-center justify-center rounded-[18px] border-2 border-[#9BA8FF] bg-[#F4F6FF] px-2 py-2.5 text-center text-[#141933] shadow-sm">
          <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
            <circle cx="24" cy="24" r="21" fill="#E3E7FF" stroke="#6B77D9" strokeWidth="2.5" />
            <polygon points="26,10 15,26 23,26 21,38 33,22 25,22" fill="#3932A8" />
          </svg>
          <div
            className="mt-1 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-base font-black text-[#3932A8] tabular-nums sm:text-lg"
            dir="ltr"
          >
            <span className="whitespace-nowrap">{toFa(bestStreak)}×</span>
            <span className="whitespace-nowrap text-xs font-extrabold text-[#4E5694]">
              ⏱ {formatElapsedTime(elapsedSeconds)}
            </span>
          </div>
          <div className="text-[11px] font-extrabold text-[#3E436E] sm:text-xs">
            پیاپی و زمان
          </div>
        </div>
      </div>

      {/* Illustrated Quick Review Cheat-Sheet */}
      <div className="mt-3.5 rounded-[20px] border border-[#7DB3FF]/30 bg-[#08173B]/85 p-3">
        <div className="mb-2 text-center text-xs font-extrabold text-[#DCEBFF]">
          مرور تصویری نکته‌ها
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SUMMARY_CARDS.map((card) => {
            const active = selectedTip === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedTip(card.id)}
                className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-1.5 text-center text-xs font-black whitespace-nowrap transition-all duration-150 active:translate-y-0.5 ${
                  active
                    ? `${TINT_CLASSES[card.tint]} text-[#141933] ring-2 ring-[#FFD24C]`
                    : 'border-[#7DB3FF]/45 bg-[#17367A] text-white shadow-[0_2px_0_#0A1940] hover:bg-[#1F4699]'
                }`}
              >
                <span aria-hidden="true">{card.icon}</span>
                <span className="truncate">{card.title}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 flex items-center gap-3 rounded-xl border border-[#F2CF66]/60 bg-[#FFFDF7] p-3 text-right text-xs font-bold leading-relaxed text-[#141933] sm:text-sm">
          <SummaryConceptGraphic id={activeCard.id} />
          <p className="min-w-0 flex-1">{activeCard.body}</p>
        </div>
      </div>

      {/* Primary Play Again CTA */}
      <div className="mt-4">
        <button
          type="button"
          data-start="true"
          onClick={onPlayAgain}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-black text-[#141933] transition-transform duration-150 hover:brightness-[1.03] active:translate-y-0.5 sm:text-base"
          style={{
            background: 'linear-gradient(180deg, #FFE178 0%, #F3AF22 100%)',
            boxShadow: '0 4px 0 #B87B09, 0 10px 24px rgba(2,10,30,0.45)'
          }}
        >
          <span>بازی دوباره</span>
          <span aria-hidden="true">↻</span>
        </button>
      </div>
    </div>
  );
};

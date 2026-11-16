import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CinemaMode,
  computeCentroid,
  computeDistance,
  CORAL_GROWTH_DATA,
  DATA_TYPE_LABELS,
  DataKind,
  evaluateClusterPlacement,
  findNearestCenter,
  FISH_LAB_EXAMPLES,
  FISH_LAB_MYSTERY,
  RunDeck,
  STAGES,
  SupervisedTaskKind,
  toFa
} from '../game/capstoneEngine';
import { soundFx } from '../game/soundFx';
import {
  CinemaItemSvg,
  ClusterGlyphSvg,
  CoralGrowthRegressionSvg,
  FeatureDetectiveSceneSvg,
  SupervisedFishSvg,
  SynthesisSceneSvg
} from './GameSvgs';

export interface AnswerReportOptions {
  recoveredFromMistake?: boolean;
  nextPrompt?: string;
}

interface StageViewsProps {
  stageIndex: number;
  deck: RunDeck;
  onReportAnswer: (
    firstTry: boolean,
    feedback: string,
    celebrating: boolean,
    options?: AnswerReportOptions
  ) => void;
  onNudge: (hint: string) => void;
  onGuide: (message: string) => void;
  onStageComplete: () => void;
}

// Visual SVG Concept Map showing how Machine Learning concepts connect across the 5 stages
const CONCEPT_NODES = [
  { id: 'cinema', label: 'یادگیری ماشین' },
  { id: 'features', label: 'داده و سرنخ' },
  { id: 'supervised', label: 'با نظارت' },
  { id: 'clustering', label: 'بدون نظارت' },
  { id: 'synthesis', label: 'آزمون نهایی' }
] as const;

const ConceptMap: React.FC<{ currentIndex: number }> = ({ currentIndex }) => {
  return (
    <div
      aria-label="نقشهٔ پیوستگی مفاهیم یادگیری ماشین"
      className="relative rounded-2xl border border-[#8CB9FF]/20 bg-[#08173B]/80 px-2.5 py-2.5 sm:px-3"
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-black text-[#FFE178]">نقشهٔ مأموریت</span>
      </div>

      <div className="relative">
        {/* SVG connector lines bridging the 5 concept centers horizontally (RTL: 0 on right -> 4 on left) */}
        <svg
          viewBox="0 0 500 24"
          preserveAspectRatio="none"
          className="pointer-events-none absolute top-[7px] right-0 left-0 h-5 w-full"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((edgeIdx) => {
            const xStart = 450 - edgeIdx * 100;
            const xEnd = 450 - (edgeIdx + 1) * 100;
            const isCompleted = edgeIdx < currentIndex;
            const isCurrentLead = edgeIdx === currentIndex - 1;
            return (
              <line
                key={edgeIdx}
                x1={xStart}
                y1={12}
                x2={xEnd}
                y2={12}
                stroke={isCurrentLead || isCompleted ? '#FFE178' : '#7DB3FF'}
                strokeOpacity={isCompleted ? 1 : 0.25}
                strokeWidth={isCompleted ? 4 : 2}
                strokeLinecap="round"
                style={{ filter: isCurrentLead || isCompleted ? 'drop-shadow(0 0 6px #FFD45A)' : undefined }}
              />
            );
          })}
        </svg>

        <div className="relative z-10 grid grid-cols-5 gap-1 text-center">
          {CONCEPT_NODES.map((node, i) => {
            const isDone = i < currentIndex;
            const isActive = i === currentIndex;
            return (
              <div key={node.id} className="flex flex-col items-center gap-1">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full border-2 text-[11px] font-black transition-all duration-200 ${
                    isActive
                      ? 'animate-pulse-glow border-[#FFF9F0] bg-[#FFD45A] text-[#0B1533] shadow-[0_0_12px_rgba(255,212,90,0.65)]'
                      : isDone
                        ? 'border-[#FFD45A] bg-[#FFB800] text-[#0B1533]'
                        : 'border-white/25 bg-[#0E2457] text-white/55'
                  }`}
                >
                  {isDone ? '✓' : toFa(i + 1)}
                </span>
                <span
                  className={`line-clamp-2 text-[9.5px] leading-tight font-bold sm:text-[11px] ${
                    isActive ? 'text-[#FFD45A]' : isDone ? 'text-[#FFD45A]' : 'text-[#9BC2FF]/65'
                  }`}
                >
                  {node.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const StageViews: React.FC<StageViewsProps> = ({
  stageIndex,
  deck,
  onReportAnswer,
  onNudge,
  onGuide,
  onStageComplete
}) => {
  const stageMeta = STAGES[stageIndex];

  return (
    <div
      key={`${deck.seed}-${stageMeta.id}`}
      className="animate-pop mx-auto w-full max-w-[640px] space-y-4 rounded-[26px] border border-[#7DB3FF]/35 bg-[#10275C]/80 p-4 shadow-[0_18px_48px_rgba(3,10,28,0.5)] sm:p-5"
    >
      <ConceptMap currentIndex={stageIndex} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="space-y-4"
      >
        {stageMeta.id === 'cinema' && (
          <CinemaStage
            deck={deck}
            onReportAnswer={onReportAnswer}
            onNudge={onNudge}
            onStageComplete={onStageComplete}
          />
        )}
        {stageMeta.id === 'features' && (
          <FeaturesStage
            deck={deck}
            onReportAnswer={onReportAnswer}
            onNudge={onNudge}
            onStageComplete={onStageComplete}
          />
        )}
        {stageMeta.id === 'supervised' && (
          <SupervisedStage
            deck={deck}
            onReportAnswer={onReportAnswer}
            onNudge={onNudge}
            onGuide={onGuide}
            onStageComplete={onStageComplete}
          />
        )}
        {stageMeta.id === 'clustering' && (
          <ClusteringStage
            deck={deck}
            onReportAnswer={onReportAnswer}
            onNudge={onNudge}
            onGuide={onGuide}
            onStageComplete={onStageComplete}
          />
        )}
        {stageMeta.id === 'synthesis' && (
          <SynthesisStage
            deck={deck}
            onReportAnswer={onReportAnswer}
            onNudge={onNudge}
            onStageComplete={onStageComplete}
          />
        )}
      </motion.div>
    </div>
  );
};

// ---------------- STAGE 1: Rule-Writing vs Machine Learning ----------------
const CinemaStage: React.FC<{
  deck: RunDeck;
  onReportAnswer: StageViewsProps['onReportAnswer'];
  onNudge: (hint: string) => void;
  onStageComplete: () => void;
}> = ({ deck, onReportAnswer, onNudge, onStageComplete }) => {
  const [idx, setIdx] = useState(0);
  const [hadMistake, setHadMistake] = useState(false);
  const [shakeChoice, setShakeChoice] = useState<CinemaMode | null>(null);
  const [solvedCurrent, setSolvedCurrent] = useState(false);

  const items = deck.cinemaItems;
  const current = items[idx];

  const handlePick = (mode: CinemaMode) => {
    if (solvedCurrent) return;
    if (mode === current.answer) {
      setSolvedCurrent(true);
      onReportAnswer(!hadMistake, current.okFeedback, true, {
        recoveredFromMistake: hadMistake
      });
    } else {
      setHadMistake(true);
      setShakeChoice(mode);
      soundFx.playNudge();
      onNudge(current.hintFeedback);
      setTimeout(() => setShakeChoice(null), 320);
    }
  };

  const handleNext = () => {
    soundFx.playPop();
    if (idx + 1 < items.length) {
      setIdx(idx + 1);
      setHadMistake(false);
      setSolvedCurrent(false);
    } else {
      onStageComplete();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#BFD3F5]">
        <span>کارت {toFa(idx + 1)} از {toFa(items.length)}</span>
        <div className="flex items-center gap-1.5">
          {items.map((item, i) => (
            <span
              key={item.id}
              className={`h-2 w-6 rounded-full transition-colors ${
                i < idx || (i === idx && solvedCurrent)
                  ? 'bg-[#5EE6D0]'
                  : i === idx
                    ? 'bg-[#FFD45A]'
                    : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Single clear direct question */}
      <h3 className="text-center text-base font-black leading-relaxed text-white sm:text-lg">
        این کار با قانون‌نویسی انجام میشه یا یادگیری ماشین؟
      </h3>

      {/* Scenario Card */}
      <div
        className={`rounded-[22px] border-2 bg-[#FFFDF7] p-4 text-[#141933] shadow-md transition-colors duration-200 ${
          solvedCurrent
            ? 'animate-celebrate-bump border-[#1BB396] ring-2 ring-[#58E6CB]/45'
            : shakeChoice
              ? 'border-[#F05252]'
              : 'border-[#F2CF66]'
        }`}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className={`grid h-20 w-20 place-items-center rounded-2xl border-2 transition-colors duration-200 ${
              solvedCurrent ? 'border-[#1BB396] bg-[#D6FCF3]' : 'border-[#F2CF66] bg-[#FFF2C6]'
            }`}
          >
            <CinemaItemSvg id={current.id} className="h-16 w-16" />
          </div>

          <p className="text-sm font-black leading-relaxed text-[#141933] sm:text-base">{current.task}</p>

          {solvedCurrent && (
            <div className="animate-pop inline-flex items-center gap-1.5 rounded-xl bg-[#D6FCF3] px-3 py-1 text-xs font-extrabold text-[#08473D]">
              ✓ {current.answer === 'rule' ? 'قانون‌نویسی' : 'یادگیری ماشین'}
            </div>
          )}
        </div>
      </div>

      {/* Vertically Stacked 3D Option Buttons with Numbered Keycaps */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => handlePick('rule')}
          className={`flex min-h-[72px] w-full items-center gap-3 rounded-[18px] border-2 p-3.5 text-right text-[#141933] transition-all duration-150 active:translate-y-0.5 ${
            shakeChoice === 'rule'
              ? 'animate-shake border-[#F05252] bg-[#FFE8E3] text-[#8F1D1D] shadow-[0_3px_0_#C53030]'
              : solvedCurrent && current.answer === 'rule'
                ? 'animate-celebrate-bump border-[#1BB396] bg-[#D6FCF3] text-[#08473D] shadow-[0_3px_0_#148F79] ring-2 ring-[#58E6CB]'
                : 'border-[#F2CF66] bg-gradient-to-b from-[#FFFDF7] to-[#FCE49A] shadow-[0_3px_0_#C99A2E] hover:brightness-[0.98]'
          }`}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#8A5A00]/15 text-xs font-black text-[#6E4500]">
            ۱
          </span>
          <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0" aria-hidden="true">
            <rect x="4" y="4" width="40" height="40" rx="12" fill="#F3AF22" opacity="0.28" />
            <g className="animate-gear">
              <circle cx="24" cy="24" r="10" fill="none" stroke="#8A5A00" strokeWidth="3.5" strokeDasharray="5 3" />
              <circle cx="24" cy="24" r="4" fill="#8A5A00" />
            </g>
          </svg>
          <div>
            <div className="text-sm font-black sm:text-base">قانون‌نویسی</div>
            <div className="mt-0.5 text-xs font-bold text-[#3E3957]">
              تو خودت قانون و شرط رو مینویسی
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handlePick('ml')}
          className={`flex min-h-[72px] w-full items-center gap-3 rounded-[18px] border-2 p-3.5 text-right text-[#141933] transition-all duration-150 active:translate-y-0.5 ${
            shakeChoice === 'ml'
              ? 'animate-shake border-[#F05252] bg-[#FFE8E3] text-[#8F1D1D] shadow-[0_3px_0_#C53030]'
              : solvedCurrent && current.answer === 'ml'
                ? 'animate-celebrate-bump border-[#1BB396] bg-[#D6FCF3] text-[#08473D] shadow-[0_3px_0_#148F79] ring-2 ring-[#58E6CB]'
                : 'border-[#58E6CB] bg-gradient-to-b from-[#F4FFFD] to-[#BDF5EA] shadow-[0_3px_0_#1E9E86] hover:brightness-[0.98]'
          }`}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#0B6153]/15 text-xs font-black text-[#0B6153]">
            ۲
          </span>
          <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0" aria-hidden="true">
            <rect x="4" y="4" width="40" height="40" rx="12" fill="#58E6CB" opacity="0.32" />
            <line x1="14" y1="18" x2="34" y2="24" stroke="#0B6153" strokeWidth="2.5" />
            <line x1="14" y1="30" x2="34" y2="24" stroke="#0B6153" strokeWidth="2.5" />
            <circle cx="14" cy="18" r="4" fill="#0B6153" />
            <circle cx="14" cy="30" r="4" fill="#0B6153" />
            <circle cx="34" cy="24" r="5" fill="#4B43C9" className="animate-pulse-glow" />
          </svg>
          <div>
            <div className="text-sm font-black sm:text-base">یادگیری ماشین</div>
            <div className="mt-0.5 text-xs font-bold text-[#224A44]">
              ماشین از مثال‌ها الگو میگیره و حدس میزنه
            </div>
          </div>
        </button>
      </div>

      {solvedCurrent && (
        <button
          type="button"
          onClick={handleNext}
          className="animate-pop min-h-[48px] w-full rounded-full bg-[#58E6CB] px-5 py-2.5 text-sm font-black text-[#082B25] shadow-[0_4px_0_#148F79] active:translate-y-0.5"
        >
          {idx + 1 < items.length ? 'کارت بعدی ‹' : 'ادامه ‹'}
        </button>
      )}
    </div>
  );
};

// ---------------- STAGE 2: Interactive Hidden-Object SVG Detective ----------------
const FeaturesStage: React.FC<{
  deck: RunDeck;
  onReportAnswer: StageViewsProps['onReportAnswer'];
  onNudge: (hint: string) => void;
  onStageComplete: () => void;
}> = ({ deck, onReportAnswer, onNudge, onStageComplete }) => {
  const [caseIdx, setCaseIdx] = useState(0);
  const [pickedType, setPickedType] = useState<DataKind | null>(null);
  const [typeMistake, setTypeMistake] = useState(false);
  const [shakeTypeId, setShakeTypeId] = useState<DataKind | null>(null);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [chipMistake, setChipMistake] = useState(false);
  const [shakeChipId, setShakeChipId] = useState<string | null>(null);
  const [wrongHighlightId, setWrongHighlightId] = useState<string | null>(null);
  const [scenePulse, setScenePulse] = useState(false);

  const items = deck.featureItems;
  const current = items[caseIdx];
  const intrinsicIds = current.chips.filter((c) => c.intrinsic).map((c) => c.id);
  const allFeaturesFound = intrinsicIds.every((id) => selectedChips.includes(id));

  const handleTypePick = (kind: DataKind) => {
    if (pickedType === current.correctType) return;
    if (kind === current.correctType) {
      setPickedType(kind);
      setShakeTypeId(null);
      setScenePulse(true);
      setTimeout(() => setScenePulse(false), 320);
      onReportAnswer(!typeMistake, current.typeReason, true, {
        recoveredFromMistake: typeMistake,
        nextPrompt: 'روی ۲ سرنخ اصلی توی تصویر بالا بزن.'
      });
    } else {
      setTypeMistake(true);
      setShakeTypeId(kind);
      soundFx.playNudge();
      onNudge('به صحنه نگاه کن ببین داده با دوربین ثبت شده یا میکروفون یا نوشته یا عدد حسگر');
      setTimeout(() => setShakeTypeId(null), 360);
    }
  };

  const handleChipTap = (chipId: string) => {
    if (pickedType !== current.correctType || allFeaturesFound || selectedChips.includes(chipId)) return;
    const chip = current.chips.find((c) => c.id === chipId);
    if (!chip) return;
    if (chip.intrinsic) {
      setWrongHighlightId(null);
      setScenePulse(true);
      setTimeout(() => setScenePulse(false), 320);
      const next = [...selectedChips, chipId];
      setSelectedChips(next);
      const finished = intrinsicIds.every((id) => next.includes(id));
      onReportAnswer(
        !chipMistake,
        finished ? `${chip.reason}. هر دو سرنخ اصلی پیدا شدن` : chip.reason,
        finished,
        { recoveredFromMistake: chipMistake }
      );
    } else {
      setChipMistake(true);
      setWrongHighlightId(chipId);
      setShakeChipId(chipId);
      soundFx.playNudge();
      onNudge(chip.reason);
      setTimeout(() => setShakeChipId(null), 420);
    }
  };

  const handleNextCase = () => {
    soundFx.playPop();
    if (caseIdx + 1 < items.length) {
      setCaseIdx(caseIdx + 1);
      setPickedType(null);
      setTypeMistake(false);
      setShakeTypeId(null);
      setSelectedChips([]);
      setChipMistake(false);
      setWrongHighlightId(null);
    } else {
      onStageComplete();
    }
  };

  const typeSolved = pickedType === current.correctType;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-extrabold text-[#DCEBFF]">
        <span>صحنهٔ {toFa(caseIdx + 1)} از {toFa(items.length)}</span>
        <span className="text-[#6EF3D6] tabular-nums">سرنخ‌های پیدا شده {toFa(selectedChips.length)} از ۲</span>
      </div>

      {/* Single clear direct question */}
      <h3 className="text-center text-base font-black leading-relaxed text-white sm:text-lg">
        {!typeSolved
          ? 'این صحنه با چه نوع داده‌ای ثبت شده؟'
          : !allFeaturesFound
            ? 'روی ۲ سرنخِ اصلی خودِ موضوع توی تصویر بزن.'
            : 'هر ۲ سرنخ اصلی پیدا شدن.'}
      </h3>

      {/* Interactive SVG Scene */}
      <div
        className={`rounded-[20px] border-2 bg-[#F6F8FF] p-3 text-[#141933] transition-all duration-200 ${
          scenePulse
            ? 'animate-celebrate-bump border-[#1BB396] ring-4 ring-[#58E6CB]/35'
            : shakeChipId || shakeTypeId
              ? 'border-[#F05252]'
              : allFeaturesFound
                ? 'border-[#1BB396]'
                : 'border-[#9BA8FF]'
        }`}
      >
        <p className="mb-2.5 text-center text-xs font-extrabold text-[#2B3054] sm:text-sm">
          {current.prompt}
        </p>

        <div className="relative mx-auto aspect-[360/185] w-full max-w-[440px] overflow-hidden rounded-2xl">
          <FeatureDetectiveSceneSvg
            caseId={current.id}
            foundIds={selectedChips}
            wrongId={wrongHighlightId}
          />

          {typeSolved &&
            current.chips.map((chip) => {
              const found = selectedChips.includes(chip.id);
              const shaking = shakeChipId === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  disabled={found || allFeaturesFound}
                  onClick={() => handleChipTap(chip.id)}
                  aria-label={chip.label}
                  data-hotspot-id={chip.id}
                  style={{
                    left: `${chip.hotspot.xPct}%`,
                    top: `${chip.hotspot.yPct}%`
                  }}
                  className="group absolute z-10 flex min-h-[44px] min-w-[64px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-end p-1 focus-visible:outline-2 focus-visible:outline-[#3932A8]"
                >
                  <span
                    className={`rounded-full border-2 px-2 py-0.5 text-[10.5px] font-black shadow-md transition-all duration-150 sm:text-[11px] ${
                      shaking
                        ? 'animate-shake border-[#F05252] bg-[#FFE8E3] text-[#8F1D1D]'
                        : found
                          ? 'animate-celebrate-bump border-[#0E8F78] bg-[#58E6CB] text-[#082B25]'
                          : 'border-[#141933]/45 bg-[#FFFDF7] text-[#141933] group-hover:scale-105 group-hover:border-[#3932A8] group-hover:bg-[#FFE89E]'
                    }`}
                  >
                    {found ? `✓ ${chip.hotspot.shortTag}` : chip.hotspot.shortTag}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* 2x2 Grid of Square Frosted Glassmorphism Cards with Glass Glow Hover & Clear Badges */}
      <div className="grid grid-cols-2 gap-3">
        {DATA_TYPE_LABELS.map((dt, dtIdx) => {
          const isCorrect = pickedType === dt.id;
          const isShaking = shakeTypeId === dt.id;
          const lockedOut = typeSolved && !isCorrect;
          return (
            <button
              key={dt.id}
              type="button"
              disabled={lockedOut}
              onClick={() => handleTypePick(dt.id)}
              className={`group relative flex aspect-square flex-col items-center justify-between rounded-[22px] border-2 p-3 text-center transition-all duration-200 active:scale-95 ${
                isShaking
                  ? 'animate-shake border-[#F05252] bg-[#FFE8E3]/90 text-[#8F1D1D] shadow-[0_4px_20px_rgba(240,82,82,0.4)]'
                  : isCorrect
                    ? 'animate-celebrate-bump border-[#58E6CB] bg-[#0E8F78]/80 text-white shadow-[0_4px_24px_rgba(88,230,203,0.5)]'
                    : 'border-[#7DB3FF]/45 bg-[#0A1D4A]/60 backdrop-blur-md text-white shadow-[0_8px_32px_rgba(3,10,28,0.37)] hover:border-[#FFD45A] hover:bg-[#15357B]/70 hover:shadow-[0_0_24px_rgba(255,212,90,0.45)] disabled:opacity-40 disabled:shadow-none'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-[11px] font-black text-white">
                  {toFa(dtIdx + 1)}
                </span>
                <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-extrabold text-[#FFE178]">
                  نوع داده
                </span>
              </div>

              <div className="my-auto flex flex-col items-center gap-1.5">
                <span className="text-3xl sm:text-4xl" aria-hidden="true">{dt.icon}</span>
                <span className="rounded-xl border border-[#7DB3FF]/30 bg-[#08173B]/90 px-3 py-1 text-xs font-black tracking-wide text-white shadow-md sm:text-sm">
                  {dt.label}
                </span>
              </div>

              <span className="text-[10px] font-bold text-[#A5C7FF] group-hover:text-white">
                انتخاب این مورد
              </span>
            </button>
          );
        })}
      </div>

      {allFeaturesFound && (
        <button
          type="button"
          onClick={handleNextCase}
          className="animate-pop min-h-[48px] w-full rounded-full bg-[#58E6CB] px-5 py-2.5 text-sm font-black text-[#082B25] shadow-[0_4px_0_#148F79] active:translate-y-0.5"
        >
          {caseIdx + 1 < items.length ? 'صحنهٔ بعدی ‹' : 'ادامه ‹'}
        </button>
      )}
    </div>
  );
};

// ---------------- STAGE 3: Supervised Learning Quiz + Interactive Train & Predict Lab ----------------
const SupervisedStage: React.FC<{
  deck: RunDeck;
  onReportAnswer: StageViewsProps['onReportAnswer'];
  onNudge: (hint: string) => void;
  onGuide: (message: string) => void;
  onStageComplete: () => void;
}> = ({ deck, onReportAnswer, onNudge, onGuide, onStageComplete }) => {
  const [subStep, setSubStep] = useState<'quiz' | 'lab_class' | 'lab_reg'>('quiz');
  const [idx, setIdx] = useState(0);
  const [hadMistake, setHadMistake] = useState(false);
  const [solvedCurrent, setSolvedCurrent] = useState(false);
  const [shakeKind, setShakeKind] = useState<SupervisedTaskKind | null>(null);

  // Interactive Lab Part 1: Fish Classification from Labeled Examples
  const [fishMistake, setFishMistake] = useState(false);
  const [fishSolved, setFishSolved] = useState(false);
  const [shakeFishChoice, setShakeFishChoice] = useState<string | null>(null);

  // Interactive Lab Part 2: Coral Growth Regression Prediction
  const [regMistake, setRegMistake] = useState(false);
  const [regSolved, setRegSolved] = useState(false);
  const [shakeRegCm, setShakeRegCm] = useState<number | null>(null);

  const items = deck.supervisedItems;
  const current = items[idx];

  const handlePick = (kind: SupervisedTaskKind) => {
    if (solvedCurrent) return;
    if (kind === current.answer) {
      setSolvedCurrent(true);
      onReportAnswer(!hadMistake, current.okFeedback, true, {
        recoveredFromMistake: hadMistake
      });
    } else {
      setHadMistake(true);
      setShakeKind(kind);
      soundFx.playNudge();
      onNudge(current.hintFeedback);
      setTimeout(() => setShakeKind(null), 320);
    }
  };

  const handleNext = () => {
    soundFx.playPop();
    if (idx + 1 < items.length) {
      setIdx(idx + 1);
      setHadMistake(false);
      setSolvedCurrent(false);
    } else {
      setSubStep('lab_class');
      onGuide('به ۳ مثال برچسب‌دار بالا نگاه کن و بگو این ماهی جدید کدوم گروهه.');
    }
  };

  const handleFishGuess = (guess: 'دلقک‌ماهی' | 'بادکنک‌ماهی') => {
    if (fishSolved) return;
    if (guess === FISH_LAB_MYSTERY.answer) {
      setFishSolved(true);
      onReportAnswer(!fishMistake, FISH_LAB_MYSTERY.okFeedback, true, {
        recoveredFromMistake: fishMistake
      });
    } else {
      setFishMistake(true);
      setShakeFishChoice(guess);
      soundFx.playNudge();
      onNudge(FISH_LAB_MYSTERY.hintFeedback);
      setTimeout(() => setShakeFishChoice(null), 320);
    }
  };

  const handleRegGuess = (cm: number) => {
    if (regSolved) return;
    if (cm === CORAL_GROWTH_DATA.answerCm) {
      setRegSolved(true);
      onReportAnswer(!regMistake, CORAL_GROWTH_DATA.okFeedback, true, {
        recoveredFromMistake: regMistake
      });
    } else {
      setRegMistake(true);
      setShakeRegCm(cm);
      soundFx.playNudge();
      onNudge(CORAL_GROWTH_DATA.hintFeedback);
      setTimeout(() => setShakeRegCm(null), 320);
    }
  };

  if (subStep === 'quiz') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-extrabold text-[#DCEBFF]">
          <span>سؤال {toFa(idx + 1)} از {toFa(items.length)}</span>
          <span className="text-[#6EF3D6]">تشخیص نوع با نظارت</span>
        </div>

        {/* Single clear direct question */}
        <h3 className="text-center text-base font-black leading-relaxed text-white sm:text-lg">
          این مدل اسم گروه انتخاب میکنه یا عدد حدس میزنه؟
        </h3>

        {/* Vertically Stacked Flow Card: Model Task -> Labeled Samples -> Output */}
        <div
          className={`flex flex-col gap-3 rounded-[20px] border-2 bg-[#FFFDF7] p-4 text-[#141933] transition-colors duration-200 ${
            solvedCurrent ? 'animate-celebrate-bump border-[#1BB396]' : 'border-[#F2CF66]'
          }`}
        >
          <div className="rounded-2xl border border-[#F2CF66] bg-[#FFF4D1] p-3 text-center">
            <div className="text-xs font-black text-[#825200]">کارِ مدل</div>
            <div className="mt-1 text-sm font-black leading-snug text-[#141933] sm:text-base">
              {current.title}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#C6CEFF] bg-[#F4F6FF] p-3">
            <div className="text-xs font-black text-[#3932A8]">مثال‌های آماده</div>
            <div className="flex flex-wrap justify-center gap-2">
              {current.trainingSamples.map((sample, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#8E9BFF] bg-white px-3 py-1.5 text-xs font-black text-[#141933]"
                >
                  <span aria-hidden="true">{sample.icon}</span>
                  <span>{sample.tag}</span>
                </span>
              ))}
            </div>
          </div>

          {solvedCurrent && (
            <div className="animate-pop rounded-xl bg-[#D6FCF3] px-3 py-1.5 text-center text-xs font-black text-[#08473D]">
              ✓ {current.liveOutputPreview}
            </div>
          )}
        </div>

        {/* Vertically Stacked Option Buttons with Numbered Keycaps */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handlePick('classification')}
            className={`flex min-h-[72px] w-full items-center gap-3 rounded-[18px] border-2 p-3.5 text-right text-[#141933] transition-all duration-150 active:translate-y-0.5 ${
              shakeKind === 'classification'
                ? 'animate-shake border-[#F05252] bg-[#FFE8E3] text-[#8F1D1D] shadow-[0_3px_0_#C53030]'
                : solvedCurrent && current.answer === 'classification'
                  ? 'animate-celebrate-bump border-[#1BB396] bg-[#D6FCF3] text-[#08473D] shadow-[0_3px_0_#148F79] ring-2 ring-[#58E6CB]'
                  : 'border-[#9BA8FF] bg-gradient-to-b from-[#F8F9FF] to-[#D6DCFF] shadow-[0_3px_0_#6B77D9] hover:brightness-[0.98]'
            }`}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#3932A8]/15 text-xs font-black text-[#3932A8]">
              ۱
            </span>
            <svg viewBox="0 0 52 52" className="h-12 w-12 shrink-0 drop-shadow-md" aria-hidden="true">
              <rect x="4" y="10" width="20" height="32" rx="6" fill="#4B43C9" />
              <rect x="28" y="10" width="20" height="32" rx="6" fill="#1BB396" />
              <circle cx="14" cy="22" r="4" fill="#FFE178" />
              <circle cx="38" cy="22" r="4" fill="#FFFFFF" />
              <path d="M10 32 L18 32 M34 32 L42 32" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div>
              <div className="text-sm font-black sm:text-base">دسته‌بندی</div>
              <div className="mt-0.5 text-xs font-bold text-[#353A63]">
                انتخاب اسم یک گروه
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handlePick('regression')}
            className={`flex min-h-[72px] w-full items-center gap-3 rounded-[18px] border-2 p-3.5 text-right text-[#141933] transition-all duration-150 active:translate-y-0.5 ${
              shakeKind === 'regression'
                ? 'animate-shake border-[#F05252] bg-[#FFE8E3] text-[#8F1D1D] shadow-[0_3px_0_#C53030]'
                : solvedCurrent && current.answer === 'regression'
                  ? 'animate-celebrate-bump border-[#1BB396] bg-[#D6FCF3] text-[#08473D] shadow-[0_3px_0_#148F79] ring-2 ring-[#58E6CB]'
                  : 'border-[#FF9E84] bg-gradient-to-b from-[#FFF9F7] to-[#FFD2C4] shadow-[0_3px_0_#C9684F] hover:brightness-[0.98]'
            }`}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#8F2B14]/15 text-xs font-black text-[#8F2B14]">
              ۲
            </span>
            <svg viewBox="0 0 52 52" className="h-12 w-12 shrink-0 drop-shadow-md" aria-hidden="true">
              <rect x="6" y="8" width="40" height="36" rx="8" fill="#FFF2C6" stroke="#D97706" strokeWidth="2.5" />
              <path d="M12 32 Q20 16 28 26 T40 14" fill="none" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="40" cy="14" r="4" fill="#DC2626" />
              <text x="14" y="22" fill="#92400E" fontSize="11" fontWeight="900" fontFamily="sans-serif">123</text>
            </svg>
            <div>
              <div className="text-sm font-black sm:text-base">رگرسیون</div>
              <div className="mt-0.5 text-xs font-bold text-[#5C2D22]">
                حدس زدن یک عدد
              </div>
            </div>
          </button>
        </div>

        {solvedCurrent && (
          <button
            type="button"
            onClick={handleNext}
            className="animate-pop min-h-[48px] w-full rounded-full bg-[#58E6CB] px-5 py-2.5 text-sm font-black text-[#082B25] shadow-[0_4px_0_#148F79] active:translate-y-0.5"
          >
            {idx + 1 < items.length ? 'سؤال بعدی ‹' : 'ادامه ‹'}
          </button>
        )}
      </div>
    );
  }

  if (subStep === 'lab_class') {
    return (
      <div className="animate-pop space-y-4">
        <div className="flex items-center justify-between text-xs font-extrabold text-[#DCEBFF]">
          <span>آزمایش ۱ از ۲ · دسته‌بندی</span>
          <span className="text-[#6EF3D6]">یادگیری از مثال‌های برچسب‌دار</span>
        </div>

        <h3 className="text-center text-base font-black leading-relaxed text-white sm:text-lg">
          مدل از روی ۳ مثال یاد گرفته. بگو این ماهی جدید کدوم گروهه؟
        </h3>

        {/* Labeled Training Shelf + New Mystery Fish vertically stacked */}
        <div className="flex flex-col gap-3 rounded-[20px] border-2 border-[#9BA8FF] bg-[#FFFDF7] p-4 text-[#141933]">
          <div className="text-center text-xs font-black text-[#3932A8]">
            مثال‌های برچسب‌دارِ ربات
          </div>
          <div className="grid grid-cols-3 gap-2">
            {FISH_LAB_EXAMPLES.map((ex) => (
              <div
                key={ex.id}
                className="flex flex-col items-center rounded-2xl border border-[#C6CEFF] bg-[#F4F6FF] p-2 text-center"
              >
                <SupervisedFishSvg variant={ex.variant} size={ex.size} className="h-12 w-14" />
                <span className="mt-1 rounded-full bg-[#0E2457] px-2 py-0.5 text-[10.5px] font-black text-[#6EF3D6]">
                  {ex.label}
                </span>
                <span className="mt-0.5 text-[10px] font-bold text-[#3E436E]">{ex.trait}</span>
              </div>
            ))}
          </div>

          <div
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center transition-colors ${
              fishSolved ? 'border-[#1BB396] bg-[#D6FCF3]' : 'border-[#F2CF66] bg-[#FFF4D1]'
            }`}
          >
            <span className="text-xs font-black text-[#825200]">ماهی جدید برای امتحان ربات</span>
            <SupervisedFishSvg variant={FISH_LAB_MYSTERY.variant} mystery={!fishSolved} className="h-14 w-16" />
            <span className="text-xs font-extrabold text-[#141933]">
              نشانهٔ این ماهی {FISH_LAB_MYSTERY.trait} هست
            </span>
            {fishSolved && (
              <span className="animate-pop rounded-full bg-[#1BB396] px-3 py-0.5 text-xs font-black text-white">
                ✓ دسته‌بندی بادکنک‌ماهی
              </span>
            )}
          </div>
        </div>

        {/* High-Contrast Tactile Stacked Choices */}
        <div className="flex flex-col gap-3">
          {(['دلقک‌ماهی', 'بادکنک‌ماهی'] as const).map((label, optionIdx) => {
            const isCorrect = fishSolved && label === FISH_LAB_MYSTERY.answer;
            const isShaking = shakeFishChoice === label;
            return (
              <button
                key={label}
                type="button"
                disabled={fishSolved}
                onClick={() => handleFishGuess(label)}
                className={`flex min-h-[60px] w-full items-center justify-between rounded-[18px] border-2 px-4 py-3 text-right transition-all duration-150 active:translate-y-0.5 ${
                  isShaking
                    ? 'animate-shake border-[#F05252] bg-[#FFE8E3] text-[#8F1D1D] shadow-[0_3px_0_#C53030]'
                    : isCorrect
                      ? 'animate-celebrate-bump border-[#1BB396] bg-[#D6FCF3] text-[#08473D] shadow-[0_3px_0_#148F79] ring-2 ring-[#58E6CB]'
                      : 'border-[#7DB3FF]/60 bg-[#17367A] text-white shadow-[0_3px_0_#0A1940] hover:bg-[#1F4699] disabled:opacity-50 disabled:shadow-none'
                }`}
              >
                <span className="flex items-center gap-2.5 text-sm font-black sm:text-base">
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-lg text-xs font-black ${
                      isCorrect ? 'bg-[#08473D]/15 text-[#08473D]' : 'bg-white/15 text-[#DCEBFF]'
                    }`}
                  >
                    {toFa(optionIdx + 1)}
                  </span>
                  <span>{label}</span>
                </span>
                <SupervisedFishSvg
                  variant={label === 'دلقک‌ماهی' ? 'clown' : 'puffer'}
                  className="h-9 w-11"
                />
              </button>
            );
          })}
        </div>

        {fishSolved && (
          <button
            type="button"
            onClick={() => {
              soundFx.playPop();
              setSubStep('lab_reg');
              onGuide('به عددهای رشد مرجان نگاه کن ببین روز ۴ چند سانتی‌متر میشه.');
            }}
            className="animate-pop min-h-[48px] w-full rounded-full bg-[#58E6CB] px-5 py-2.5 text-sm font-black text-[#082B25] shadow-[0_4px_0_#148F79] active:translate-y-0.5"
          >
            آزمایش بعدی ‹
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="animate-pop space-y-4">
      <div className="flex items-center justify-between text-xs font-extrabold text-[#DCEBFF]">
        <span>آزمایش ۲ از ۲ · رگرسیون</span>
        <span className="text-[#FFD24C]">حدس زدن یک عدد از روی الگو</span>
      </div>

      <h3 className="text-center text-base font-black leading-relaxed text-white sm:text-lg">
        این نمودار رشد مرجان رو ببین. روز ۴ قدش تقریباً چند سانتی‌متر میشه؟
      </h3>

      <div
        className={`rounded-[20px] border-2 bg-[#FFFDF7] p-3.5 text-[#141933] transition-colors ${
          regSolved ? 'animate-celebrate-bump border-[#1BB396]' : 'border-[#F2CF66]'
        }`}
      >
        <CoralGrowthRegressionSvg solved={regSolved} answerCm={CORAL_GROWTH_DATA.answerCm} />
        <p className="mt-2 text-center text-xs font-extrabold text-[#3B4263]">
          هر روز به اندازهٔ ۱۰ سانتی‌متر به قد مرجان اضافه شده.
        </p>
      </div>

      {/* High-Contrast Tactile Numeric Predictions */}
      <div className="flex flex-col gap-3">
        {CORAL_GROWTH_DATA.choicesCm.map((cm, optionIdx) => {
          const isCorrect = regSolved && cm === CORAL_GROWTH_DATA.answerCm;
          const isShaking = shakeRegCm === cm;
          return (
            <button
              key={cm}
              type="button"
              disabled={regSolved}
              onClick={() => handleRegGuess(cm)}
              className={`flex min-h-[58px] w-full items-center justify-between rounded-[18px] border-2 px-4 py-3 text-base font-black transition-all duration-150 active:translate-y-0.5 ${
                isShaking
                  ? 'animate-shake border-[#F05252] bg-[#FFE8E3] text-[#8F1D1D] shadow-[0_3px_0_#C53030]'
                  : isCorrect
                    ? 'animate-celebrate-bump border-[#1BB396] bg-[#D6FCF3] text-[#08473D] shadow-[0_3px_0_#148F79] ring-2 ring-[#58E6CB]'
                    : 'border-[#7DB3FF]/60 bg-[#17367A] text-white shadow-[0_3px_0_#0A1940] hover:bg-[#1F4699] disabled:opacity-50 disabled:shadow-none'
              }`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-lg text-xs font-black ${
                  isCorrect ? 'bg-[#08473D]/15 text-[#08473D]' : 'bg-white/15 text-[#DCEBFF]'
                }`}
              >
                {toFa(optionIdx + 1)}
              </span>
              <span>{toFa(cm)} سانتی‌متر</span>
              <span className="w-6" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {regSolved && (
        <button
          type="button"
          onClick={onStageComplete}
          className="animate-pop min-h-[48px] w-full rounded-full bg-[#58E6CB] px-5 py-2.5 text-sm font-black text-[#082B25] shadow-[0_4px_0_#148F79] active:translate-y-0.5"
        >
          ادامه ‹
        </button>
      )}
    </div>
  );
};

// ---------------- STAGE 4: Clear Unsupervised Similarity Clustering Map ----------------
const ClusteringStage: React.FC<{
  deck: RunDeck;
  onReportAnswer: StageViewsProps['onReportAnswer'];
  onNudge: (hint: string) => void;
  onGuide: (message: string) => void;
  onStageComplete: () => void;
}> = ({ deck, onReportAnswer, onNudge, onGuide, onStageComplete }) => {
  const map = deck.clusterMap;
  const g0Center = computeCentroid(map.dots.filter((d) => d.naturalGroup === 0));
  const g1Center = computeCentroid(map.dots.filter((d) => d.naturalGroup === 1));

  const [phase, setPhase] = useState<'place' | 'assign' | 'done'>('place');
  const [centers, setCenters] = useState<{ x: number; y: number }[]>([]);
  const [hadMistake, setHadMistake] = useState(false);
  const [assignMistake, setAssignMistake] = useState(false);
  const [assignedCenterIdx, setAssignedCenterIdx] = useState<0 | 1 | null>(null);
  const [mapShake, setMapShake] = useState(false);
  const [shakeAssignIdx, setShakeAssignIdx] = useState<0 | 1 | null>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== 'place') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.max(10, Math.min(90, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const yPct = Math.max(14, Math.min(86, Math.round(((e.clientY - rect.top) / rect.height) * 100)));

    soundFx.playPop();
    const next = [...centers, { x: xPct, y: yPct }];
    if (next.length < 2) {
      setCenters(next);
      onGuide('عالی مرکز اول رو گذاشتی پس حالا وسط دستهٔ دیگه بزن');
      return;
    }

    const result = evaluateClusterPlacement(map.dots, next[0], next[1]);
    if (result.separated) {
      setCenters(next);
      setPhase('assign');
      onReportAnswer(!hadMistake, 'دو خوشه از روی نزدیکی و بدون هیچ برچسبی از هم جدا شدن', true, {
        recoveredFromMistake: hadMistake,
        nextPrompt: 'حالا بگو مورد جدید به کدوم گروه نزدیک‌تره.'
      });
    } else {
      setHadMistake(true);
      setCenters([]);
      setMapShake(true);
      soundFx.playNudge();
      onNudge('هر مرکز رو وسط یک دسته بذار تا دو گروه راحت از هم جدا میشن');
      setTimeout(() => setMapShake(false), 360);
    }
  };

  const handleAutoSnap = () => {
    soundFx.playPop();
    setCenters([g0Center, g1Center]);
    setPhase('assign');
    onReportAnswer(!hadMistake, 'مدل نقطهٔ وسط هر دسته رو مثلِ مرکز گروه پیدا کرد', true, {
      recoveredFromMistake: hadMistake,
      nextPrompt: 'مورد جدید رو به نزدیک‌ترین گروه وصل کن.'
    });
  };

  const handleResetCenters = () => {
    soundFx.playPop();
    setCenters([]);
    setAssignedCenterIdx(null);
    setShakeAssignIdx(null);
    setPhase('place');
    onGuide('مرکزها پاک شدن پس دوباره وسط هر دو دسته یک مرکز بذار');
  };

  const handleAssignMystery = (centerIndex: 0 | 1) => {
    if (phase !== 'assign' || centers.length < 2) return;
    const nearest = findNearestCenter(map.mystery, [centers[0], centers[1]]);
    if (centerIndex === nearest) {
      setAssignedCenterIdx(centerIndex);
      setShakeAssignIdx(null);
      setPhase('done');
      onReportAnswer(!assignMistake, map.mystery.explanation, true, {
        recoveredFromMistake: assignMistake
      });
    } else {
      setAssignMistake(true);
      setShakeAssignIdx(centerIndex);
      soundFx.playNudge();
      onNudge('عدد فاصله روی خط‌چین‌ها رو مقایسه کن و گروهی که عددش کمتره رو انتخاب کن');
      setTimeout(() => setShakeAssignIdx(null), 360);
    }
  };

  const dist0 = centers.length === 2 ? computeDistance(map.mystery, centers[0]) : null;
  const dist1 = centers.length === 2 ? computeDistance(map.mystery, centers[1]) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 text-xs font-extrabold text-[#DCEBFF]">
        <span>{map.title}</span>
        <span className="text-[#6EF3D6] tabular-nums">
          {phase === 'place' ? 'گام ۱ از ۲' : 'گام ۲ از ۲'}
        </span>
      </div>

      {/* Single clear direct question */}
      <h3 className="text-center text-base font-black leading-relaxed text-white sm:text-lg">
        {phase === 'place'
          ? 'اینجا اسمی نداریم. وسط هر دو دسته بزن تا ۲ گروه شبیه بسازی.'
          : phase === 'assign'
            ? `${map.mystery.name} اومده. به کدوم گروه نزدیک‌تره؟`
            : `${map.mystery.name} به نزدیک‌ترین گروه وصل شد.`}
      </h3>

      {/* Interactive Similarity Map with Clear Two-Pole Axis Guides */}
      <div
        className={`overflow-hidden rounded-[20px] border-2 bg-[#081A42] transition-colors duration-200 ${
          mapShake
            ? 'animate-shake border-[#FF6B6B]'
            : phase === 'done'
              ? 'animate-celebrate-bump border-[#5EE6D0] ring-2 ring-[#5EE6D0]/40'
              : 'border-[#7ADFD1]/50'
        }`}
      >
        <div
          role="application"
          aria-label="نمودار دو بعدی خوشه‌بندی بدون نظارت"
          onClick={handleMapClick}
          className={`relative h-[250px] w-full select-none sm:h-[268px] ${
            phase === 'place' ? 'cursor-crosshair' : 'cursor-default'
          }`}
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 32%, rgba(94, 230, 208, 0.14), transparent 36%), radial-gradient(circle at 76% 72%, rgba(255, 212, 90, 0.14), transparent 36%)'
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'linear-gradient(to right, #8CB9FF 1px, transparent 1px), linear-gradient(to bottom, #8CB9FF 1px, transparent 1px)',
              backgroundSize: '25% 25%'
            }}
          />

          {/* Clear Vertical Two-Pole Axis Labels */}
          <span className="pointer-events-none absolute top-2 right-3 rounded bg-[#081A42]/85 px-1.5 py-0.5 text-[10.5px] font-extrabold text-[#9BC2FF]">
            ↑ {map.yMaxLabel}
          </span>
          <span className="pointer-events-none absolute bottom-2 right-3 rounded bg-[#081A42]/85 px-1.5 py-0.5 text-[10.5px] font-bold text-[#9BC2FF]/80">
            ↓ {map.yMinLabel}
          </span>

          {phase === 'place' && (
            <div className="pointer-events-none absolute top-2 left-3 rounded-full border border-[#FFD45A]/45 bg-[#0B1533]/90 px-2.5 py-0.5 text-[10.5px] font-black text-[#FFD45A]">
              {centers.length === 0 ? 'لمس ۱: وسط دستهٔ اول' : 'لمس ۲: وسط دستهٔ دوم'}
            </div>
          )}

        {centers.length === 2 && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <circle
              cx={centers[0].x}
              cy={centers[0].y}
              r={18}
              fill="#5EE6D0"
              fillOpacity={0.08}
              stroke="#5EE6D0"
              strokeOpacity={0.5}
              strokeWidth={0.5}
              strokeDasharray="2 1.5"
            />
            <circle
              cx={centers[1].x}
              cy={centers[1].y}
              r={18}
              fill="#FFD45A"
              fillOpacity={0.08}
              stroke="#FFD45A"
              strokeOpacity={0.5}
              strokeWidth={0.5}
              strokeDasharray="2 1.5"
            />

            {map.dots.map((dot) => {
              const assigned = findNearestCenter(dot, [centers[0], centers[1]]);
              const target = centers[assigned];
              return (
                <line
                  key={`link-${dot.id}`}
                  x1={dot.x}
                  y1={dot.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={assigned === 0 ? '#5EE6D0' : '#FFD45A'}
                  strokeOpacity={0.65}
                  strokeWidth={0.9}
                />
              );
            })}

            {phase !== 'place' && (
              <>
                <line
                  x1={map.mystery.x}
                  y1={map.mystery.y}
                  x2={centers[0].x}
                  y2={centers[0].y}
                  stroke="#5EE6D0"
                  strokeDasharray="3 2.5"
                  strokeWidth={assignedCenterIdx === 0 ? 1.8 : 1.1}
                  strokeOpacity={assignedCenterIdx === 1 ? 0.25 : 1}
                  className="animate-dash"
                />
                <line
                  x1={map.mystery.x}
                  y1={map.mystery.y}
                  x2={centers[1].x}
                  y2={centers[1].y}
                  stroke="#FFD45A"
                  strokeDasharray="3 2.5"
                  strokeWidth={assignedCenterIdx === 1 ? 1.8 : 1.1}
                  strokeOpacity={assignedCenterIdx === 0 ? 0.25 : 1}
                  className="animate-dash"
                />
              </>
            )}
          </svg>
        )}

        {/* Distance badges rendered cleanly on line midpoints */}
        {phase !== 'place' && centers.length === 2 && dist0 !== null && dist1 !== null && (
          <>
            <span
              style={{
                left: `${(map.mystery.x + centers[0].x) / 2}%`,
                top: `${(map.mystery.y + centers[0].y) / 2}%`
              }}
              className={`pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#5EE6D0] bg-[#0B1533]/95 px-2 py-0.5 text-[10px] font-black text-[#5EE6D0] tabular-nums shadow ${
                assignedCenterIdx === 1 ? 'opacity-30' : 'opacity-100'
              }`}
            >
              {toFa(dist0)}
            </span>
            <span
              style={{
                left: `${(map.mystery.x + centers[1].x) / 2}%`,
                top: `${(map.mystery.y + centers[1].y) / 2}%`
              }}
              className={`pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FFD45A] bg-[#0B1533]/95 px-2 py-0.5 text-[10px] font-black text-[#FFD45A] tabular-nums shadow ${
                assignedCenterIdx === 0 ? 'opacity-30' : 'opacity-100'
              }`}
            >
              {toFa(dist1)}
            </span>
          </>
        )}

        {/* Well-spaced item nodes */}
        {map.dots.map((dot) => {
          const assigned =
            centers.length === 2 ? findNearestCenter(dot, [centers[0], centers[1]]) : null;
          return (
            <div
              key={dot.id}
              style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
              className={`pointer-events-none absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 shadow-md transition-all duration-300 ${
                assigned === 0
                  ? 'scale-105 border-[#5EE6D0] bg-[#5EE6D0]/25'
                  : assigned === 1
                    ? 'scale-105 border-[#FFD45A] bg-[#FFD45A]/25'
                    : 'border-white/55 bg-[#14306B]'
              }`}
            >
              <ClusterGlyphSvg iconKey={dot.icon} className="h-6 w-6" />
            </div>
          );
        })}

        {/* Cluster Centers */}
        {centers.map((c, i) => (
          <div
            key={i}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          >
            <span
              aria-hidden="true"
              className={`animate-ripple absolute -inset-2 rounded-full border-2 ${
                i === 0 ? 'border-[#5EE6D0]' : 'border-[#FFD45A]'
              }`}
            />
            <div
              className={`animate-pop relative grid h-10 w-10 place-items-center rounded-full border-2 text-base font-black shadow-lg ${
                i === 0
                  ? 'border-[#5EE6D0] bg-[#0B1533] text-[#5EE6D0]'
                  : 'border-[#FFD45A] bg-[#0B1533] text-[#FFD45A]'
              }`}
            >
              <span>◎</span>
              <span
                className={`absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full text-[10px] font-black text-[#0B1533] ${
                  i === 0 ? 'bg-[#5EE6D0]' : 'bg-[#FFD45A]'
                }`}
              >
                {toFa(i + 1)}
              </span>
            </div>
          </div>
        ))}

        {/* Matching Mystery Item */}
        {phase !== 'place' && (
          <div
            style={{ left: `${map.mystery.x}%`, top: `${map.mystery.y}%` }}
            className="animate-pop pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <div
              className={`animate-pulse-glow grid h-10 w-10 place-items-center rounded-full border-2 bg-[#FFF9F0] shadow-[0_0_16px_rgba(255,138,107,0.75)] ${
                assignedCenterIdx === 0
                  ? 'border-[#5EE6D0]'
                  : assignedCenterIdx === 1
                    ? 'border-[#FFD45A]'
                    : 'border-[#FF8A6B]'
              }`}
            >
              <ClusterGlyphSvg iconKey={map.mystery.icon} className="h-6 w-6" />
            </div>
            <span
              className={`mt-0.5 block whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-black text-[#0B1533] ${
                assignedCenterIdx === 0
                  ? 'bg-[#5EE6D0]'
                  : assignedCenterIdx === 1
                    ? 'bg-[#FFD45A]'
                    : 'bg-[#FF8A6B]'
              }`}
            >
              {assignedCenterIdx !== null ? `گروه ${toFa(assignedCenterIdx + 1)} ✓` : map.mystery.name}
            </span>
          </div>
        )}
        </div>

        <div
          dir="ltr"
          style={{ direction: 'ltr' }}
          className="flex items-center justify-between border-t border-[#7ADFD1]/25 bg-[#061333]/95 px-3 py-1.5 text-[11px] font-extrabold text-[#B8D4FF]"
        >
          <span data-testid="x-min-label" className="inline-flex items-center gap-1">
            <span aria-hidden="true">←</span>
            <span>{map.xMinLabel}</span>
          </span>
          <span className="text-[10.5px] font-bold text-[#DCEBFF]/85">{map.xLabel}</span>
          <span data-testid="x-max-label" className="inline-flex items-center gap-1">
            <span>{map.xMaxLabel}</span>
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>

      {/* Controls below map */}
      {phase === 'place' && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {centers.length > 0 ? (
            <button
              type="button"
              onClick={handleResetCenters}
              className="min-h-[42px] rounded-full border border-[#7DB3FF]/50 bg-[#17367A] px-4 py-1.5 text-xs font-black text-white shadow-[0_2px_0_#0A1940] hover:bg-[#1F4699]"
            >
              پاک کردن
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={handleAutoSnap}
            className="min-h-[42px] rounded-full border border-[#FFD24C]/70 bg-[#17367A] px-4 py-1.5 text-xs font-black text-[#FFD24C] shadow-[0_2px_0_#0A1940] hover:bg-[#1F4699]"
          >
            چیدن خودکار
          </button>
        </div>
      )}

      {/* Vertically Stacked Group Choice Cards with 3D Depth */}
      {phase === 'assign' && (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleAssignMystery(0)}
            className={`flex min-h-[60px] w-full items-center justify-between rounded-[18px] border-2 px-4 py-3 text-right text-sm font-black transition-all duration-150 active:translate-y-0.5 ${
              shakeAssignIdx === 0
                ? 'animate-shake border-[#F05252] bg-[#FFE8E3] text-[#8F1D1D] shadow-[0_3px_0_#C53030]'
                : 'border-[#58E6CB] bg-[#E5FCF7] text-[#082B25] shadow-[0_3px_0_#148F79] hover:brightness-[0.98]'
            }`}
          >
            <span>◎ گروه ۱</span>
            {dist0 !== null && (
              <span className="rounded-full bg-[#0B6153]/15 px-3 py-0.5 text-xs font-extrabold text-[#0B6153] tabular-nums">
                فاصله {toFa(dist0)} واحد
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleAssignMystery(1)}
            className={`flex min-h-[60px] w-full items-center justify-between rounded-[18px] border-2 px-4 py-3 text-right text-sm font-black transition-all duration-150 active:translate-y-0.5 ${
              shakeAssignIdx === 1
                ? 'animate-shake border-[#F05252] bg-[#FFE8E3] text-[#8F1D1D] shadow-[0_3px_0_#C53030]'
                : 'border-[#F2CF66] bg-[#FFF5D4] text-[#141933] shadow-[0_3px_0_#C2850D] hover:brightness-[0.98]'
            }`}
          >
            <span>◎ گروه ۲</span>
            {dist1 !== null && (
              <span className="rounded-full bg-[#825200]/15 px-3 py-0.5 text-xs font-extrabold text-[#754900] tabular-nums">
                فاصله {toFa(dist1)} واحد
              </span>
            )}
          </button>

          <div className="text-left">
            <button
              type="button"
              onClick={handleResetCenters}
              className="min-h-[38px] rounded-full border border-[#7DB3FF]/45 bg-[#17367A] px-3.5 py-1 text-xs font-extrabold text-[#DCEBFF] shadow-[0_2px_0_#0A1940] hover:bg-[#1F4699]"
            >
              دوباره
            </button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <button
          type="button"
          onClick={onStageComplete}
          className="animate-pop min-h-[48px] w-full rounded-full bg-[#58E6CB] px-5 py-2.5 text-sm font-black text-[#082B25] shadow-[0_4px_0_#148F79] active:translate-y-0.5"
        >
          ادامه ‹
        </button>
      )}
    </div>
  );
};

// ---------------- STAGE 5: Clean 3-Question Visual Final Quiz ----------------
const SynthesisStage: React.FC<{
  deck: RunDeck;
  onReportAnswer: StageViewsProps['onReportAnswer'];
  onNudge: (hint: string) => void;
  onStageComplete: () => void;
}> = ({ deck, onReportAnswer, onNudge, onStageComplete }) => {
  const [round, setRound] = useState(0);
  const [solvedRound, setSolvedRound] = useState(false);
  const [hadMistake, setHadMistake] = useState(false);
  const [shakeOptionId, setShakeOptionId] = useState<string | null>(null);

  // Pick 3 crisp, well-rounded missions for the Final Quiz
  const quizItems = deck.synthesisItems.slice(0, 3);
  const activeMission = quizItems[round];

  const advanceRound = () => {
    soundFx.playPop();
    if (round + 1 < quizItems.length) {
      setRound(round + 1);
      setSolvedRound(false);
      setHadMistake(false);
      setShakeOptionId(null);
    } else {
      onStageComplete();
    }
  };

  const handleDispatchPick = (optId: string) => {
    if (solvedRound || !activeMission) return;
    const picked = activeMission.options.find((o) => o.id === optId);
    if (!picked) return;
    if (picked.correct) {
      setSolvedRound(true);
      setShakeOptionId(null);
      onReportAnswer(!hadMistake, activeMission.okFeedback, true, {
        recoveredFromMistake: hadMistake
      });
    } else {
      setHadMistake(true);
      setShakeOptionId(optId);
      soundFx.playNudge();
      onNudge(activeMission.hintFeedback);
      setTimeout(() => setShakeOptionId(null), 360);
    }
  };

  if (!activeMission) return null;

  return (
    <div key={activeMission.id} className="animate-pop space-y-4">
      <div className="flex items-center justify-between text-xs font-extrabold text-[#DCEBFF]">
        <span>آزمون نهایی · سؤال {toFa(round + 1)} از {toFa(quizItems.length)}</span>
        <div className="flex items-center gap-1.5">
          {quizItems.map((q, idx) => (
            <span
              key={q.id}
              className={`h-2 w-6 rounded-full transition-colors ${
                idx < round || (idx === round && solvedRound)
                  ? 'bg-[#58E6CB]'
                  : idx === round
                    ? 'bg-[#FFD24C]'
                    : 'bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Single clear direct question */}
      <h3 className="text-center text-base font-black leading-relaxed text-white sm:text-lg">
        {activeMission.prompt}
      </h3>

      {/* Story + Visual Illustration Card */}
      <div
        className={`flex flex-col items-center justify-center rounded-[20px] border-2 bg-[#FFFDF7] p-3.5 text-[#141933] transition-colors duration-200 ${
          solvedRound ? 'animate-celebrate-bump border-[#1BB396]' : 'border-[#9BA8FF]'
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-[#7DB3FF]/45 bg-[#0B2256] p-1">
          <SynthesisSceneSvg id={activeMission.id} solved={solvedRound} />
        </div>
        <p className="mt-3 text-center text-xs font-extrabold leading-relaxed text-[#242847] sm:text-sm">
          {activeMission.story}
        </p>
        {solvedRound && (
          <div className="animate-pop mt-2 rounded-full bg-[#D6FCF3] px-3 py-0.5 text-xs font-black text-[#08473D]">
            ✓ {activeMission.tag}
          </div>
        )}
      </div>

      {/* High-Contrast Tactile Stacked Option Cards with Numbered Keycaps */}
      <div className="flex flex-col gap-3">
        {activeMission.options.map((opt, optionIdx) => {
          const isShaking = shakeOptionId === opt.id;
          const isSolvedChoice = solvedRound && opt.correct;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={solvedRound}
              onClick={() => handleDispatchPick(opt.id)}
              className={`flex min-h-[70px] w-full items-center gap-3 rounded-[18px] border-2 px-4 py-3 text-right transition-all duration-150 active:translate-y-0.5 ${
                isShaking
                  ? 'animate-shake border-[#F05252] bg-[#FFE8E3] text-[#8F1D1D] shadow-[0_3px_0_#C53030]'
                  : isSolvedChoice
                    ? 'animate-celebrate-bump border-[#1BB396] bg-[#D6FCF3] text-[#08473D] shadow-[0_3px_0_#148F79] ring-2 ring-[#58E6CB]'
                    : 'border-[#7DB3FF]/60 bg-[#17367A] text-white shadow-[0_3px_0_#0A1940] hover:bg-[#1F4699] disabled:opacity-50 disabled:shadow-none'
              }`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-black ${
                  isShaking
                    ? 'bg-[#8F1D1D]/15 text-[#8F1D1D]'
                    : isSolvedChoice
                      ? 'bg-[#08473D]/15 text-[#08473D]'
                      : 'bg-white/15 text-[#DCEBFF]'
                }`}
              >
                {toFa(optionIdx + 1)}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm font-black sm:text-base">
                  {opt.icon && <span aria-hidden="true">{opt.icon}</span>}
                  <span>{opt.label}</span>
                </div>
                <div
                  className={`mt-1 text-xs font-bold ${
                    isShaking
                      ? 'text-[#8F1D1D]'
                      : isSolvedChoice
                        ? 'text-[#0B6153]'
                        : 'text-[#DCEBFF]'
                  }`}
                >
                  {opt.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {solvedRound && (
        <button
          type="button"
          onClick={advanceRound}
          className="animate-pop min-h-[48px] w-full rounded-full bg-[#FFD24C] px-5 py-2.5 text-sm font-black text-[#141933] shadow-[0_4px_0_#B87B09] active:translate-y-0.5"
        >
          {round + 1 < quizItems.length ? 'سؤال بعدی ‹' : 'پایان و مدال ‹'}
        </button>
      )}
    </div>
  );
};

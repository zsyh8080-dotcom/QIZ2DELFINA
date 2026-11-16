import { useCallback, useEffect, useState } from 'react';
import { DelphiDock, DelphiMood } from './components/DelphiDock';
import { ExitDialog } from './components/Dialogs';
import { MissionHeader, XpToastInfo } from './components/MissionHeader';
import { OceanBackdrop } from './components/OceanBackdrop';
import { AnswerReportOptions, StageViews } from './components/StageViews';
import { TitleIntroStage } from './components/TitleIntroStage';
import { VictoryModal } from './components/VictoryModal';
import {
  buildRunDeck,
  computeAnswerXp,
  evaluateMastery,
  GamePhase,
  MISSION_DURATION_SECONDS,
  readSavedStats,
  RunDeck,
  SavedFinalStats,
  saveRunCompletion,
  STAGES
} from './game/capstoneEngine';
import { composeDelphiBubbles, DelphiBubble } from './game/delphiNarrator';
import { soundFx } from './game/soundFx';

const INITIAL_TITLE_BUBBLES = composeDelphiBubbles({
  event: 'title_intro',
  coreText: ''
});

const INITIAL_STAGE_BUBBLES_CONNECTED = composeDelphiBubbles({
  event: 'stage_enter',
  stageId: STAGES[0].id,
  coreText: STAGES[0].introLine
});

const INITIAL_STAGE_BUBBLES_STANDALONE = composeDelphiBubbles({
  event: 'stage_enter',
  stageId: STAGES[0].id,
  coreText: STAGES[0].introLine,
  standaloneStart: true
});

export default function App() {
  const [savedStats, setSavedStats] = useState<SavedFinalStats>(() => readSavedStats());
  const [seed, setSeed] = useState<number>(() => {
    const initial = readSavedStats().lastSeed || 101;
    return initial + 17;
  });
  const [deck, setDeck] = useState<RunDeck>(() => buildRunDeck(seed));

  const [phase, setPhase] = useState<GamePhase>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return 'playing';
    }
    return 'title';
  });

  const [stageIndex, setStageIndex] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestRunStreak, setBestRunStreak] = useState<number>(0);
  const [firstTryHits, setFirstTryHits] = useState<number>(0);
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [turnIndex, setTurnIndex] = useState<number>(0);

  const [delphiMood, setDelphiMood] = useState<DelphiMood>('curious');
  const [delphiBubbles, setDelphiBubbles] = useState<DelphiBubble[]>(() => {
    if (
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('autostart') === '1'
    ) {
      return INITIAL_STAGE_BUBBLES_STANDALONE;
    }
    return INITIAL_TITLE_BUBBLES;
  });

  const [muted, setMuted] = useState<boolean>(false);
  const [exitOpen, setExitOpen] = useState<boolean>(false);
  const [xpToast, setXpToast] = useState<XpToastInfo | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(MISSION_DURATION_SECONDS);
  const [timedOut, setTimedOut] = useState<boolean>(false);

  // Sync body dataset state for state-machine clarity and testability
  useEffect(() => {
    const bodyState = phase === 'victory' ? 'gameover' : exitOpen ? 'paused' : phase;
    document.body.dataset.state = bodyState;
  }, [phase, exitOpen]);

  // Live mission countdown timer while active (pauses during dialogs and victory)
  useEffect(() => {
    if (phase !== 'playing' || exitOpen) return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase, exitOpen]);

  // Gracefully finish placement test if countdown reaches 00:00
  useEffect(() => {
    if (phase === 'playing' && remainingSeconds === 0) {
      soundFx.playVictory();
      const summary = evaluateMastery(firstTryHits, Math.max(totalAnswered, 1));
      const updated = saveRunCompletion(xp, bestRunStreak, summary.stars, deck.seed);
      setSavedStats(updated);
      setTimedOut(true);
      setPhase('victory');
      setDelphiMood('celebrating');
      setDelphiBubbles(
        composeDelphiBubbles({
          event: 'victory',
          coreText: '',
          totalXp: xp,
          stars: summary.stars,
          rankTitle: summary.rankTitle,
          timedOut: true
        })
      );
    }
  }, [phase, remainingSeconds, firstTryHits, totalAnswered, xp, bestRunStreak, deck.seed]);

  const startNewRun = useCallback(
    (skipToPlay = true) => {
      soundFx.playPop();
      const nextSeed = seed + Math.floor(Math.random() * 89) + 13;
      setSeed(nextSeed);
      setDeck(buildRunDeck(nextSeed));
      setStageIndex(0);
      setXp(0);
      setStreak(0);
      setBestRunStreak(0);
      setFirstTryHits(0);
      setTotalAnswered(0);
      setTurnIndex(0);
      setRemainingSeconds(MISSION_DURATION_SECONDS);
      setTimedOut(false);
      setExitOpen(false);
      if (skipToPlay) {
        setPhase('playing');
        setDelphiMood('curious');
        setDelphiBubbles(INITIAL_STAGE_BUBBLES_CONNECTED);
      } else {
        setPhase('title');
        setDelphiMood('curious');
        setDelphiBubbles(INITIAL_TITLE_BUBBLES);
      }
    },
    [seed]
  );

  // Keyboard shortcuts: Enter/Space to start on title, Escape to toggle pause/exit dialog
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase === 'title' && !exitOpen && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        startNewRun(true);
      } else if (e.key === 'Escape') {
        if (exitOpen) setExitOpen(false);
        else if (phase === 'playing') setExitOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, exitOpen, startNewRun]);

  const handleToggleMute = () => {
    const next = !muted;
    soundFx.muted = next;
    setMuted(next);
    if (!next) soundFx.playPop();
  };

  const handleReportAnswer = useCallback(
    (
      firstTry: boolean,
      feedback: string,
      celebrating: boolean,
      options?: AnswerReportOptions
    ) => {
      const nextStreak = firstTry ? streak + 1 : 0;
      const gained = computeAnswerXp(firstTry, nextStreak);
      soundFx.playSuccess(nextStreak);

      const nextTurn = turnIndex + 1;
      setXp((prev) => prev + gained);
      setStreak(nextStreak);
      setBestRunStreak((prev) => Math.max(prev, nextStreak));
      setTotalAnswered((prev) => prev + 1);
      setTurnIndex(nextTurn);
      if (firstTry) setFirstTryHits((prev) => prev + 1);
      setXpToast({ id: nextTurn, amount: gained, streak: nextStreak });
      window.setTimeout(() => {
        setXpToast((cur) => (cur?.id === nextTurn ? null : cur));
      }, 1350);

      setDelphiMood(celebrating ? 'celebrating' : 'curious');
      setDelphiBubbles(
        composeDelphiBubbles({
          event: 'correct',
          stageId: STAGES[stageIndex].id,
          coreText: feedback,
          nextPrompt: options?.nextPrompt,
          streak: nextStreak,
          recoveredFromMistake: options?.recoveredFromMistake ?? !firstTry,
          xpGained: gained,
          turnIndex: nextTurn
        })
      );
    },
    [streak, turnIndex, stageIndex]
  );

  const handleNudge = useCallback(
    (hint: string) => {
      const nextTurn = turnIndex + 1;
      setStreak(0);
      setTurnIndex(nextTurn);
      setDelphiMood('curious');
      setDelphiBubbles(
        composeDelphiBubbles({
          event: 'wrong',
          stageId: STAGES[stageIndex].id,
          coreText: hint,
          turnIndex: nextTurn
        })
      );
    },
    [turnIndex, stageIndex]
  );

  const handleGuide = useCallback(
    (message: string) => {
      const nextTurn = turnIndex + 1;
      setTurnIndex(nextTurn);
      setDelphiMood('curious');
      setDelphiBubbles(
        composeDelphiBubbles({
          event: 'guide',
          stageId: STAGES[stageIndex].id,
          coreText: message,
          turnIndex: nextTurn
        })
      );
    },
    [turnIndex, stageIndex]
  );

  const handleStageComplete = useCallback(() => {
    if (stageIndex + 1 < STAGES.length) {
      soundFx.playStageClear();
      const prevStage = STAGES[stageIndex];
      const nextIdx = stageIndex + 1;
      const nextStage = STAGES[nextIdx];
      setStageIndex(nextIdx);
      setDelphiMood('curious');
      setDelphiBubbles(
        composeDelphiBubbles({
          event: 'stage_enter',
          stageId: nextStage.id,
          previousStageId: prevStage.id,
          coreText: nextStage.introLine
        })
      );
    } else {
      soundFx.playVictory();
      const summary = evaluateMastery(firstTryHits, totalAnswered);
      const updated = saveRunCompletion(xp, bestRunStreak, summary.stars, deck.seed);
      setSavedStats(updated);
      setPhase('victory');
      setDelphiMood('celebrating');
      setDelphiBubbles(
        composeDelphiBubbles({
          event: 'victory',
          coreText: '',
          totalXp: xp,
          stars: summary.stars,
          rankTitle: summary.rankTitle
        })
      );
    }
  }, [stageIndex, firstTryHits, totalAnswered, xp, bestRunStreak, deck.seed]);

  const mastery = evaluateMastery(
    firstTryHits,
    timedOut ? Math.max(totalAnswered, 1) : totalAnswered
  );
  const spentSeconds = Math.max(0, MISSION_DURATION_SECONDS - remainingSeconds);

  return (
    <div className="relative flex min-h-dvh flex-col justify-between overflow-x-hidden">
      <OceanBackdrop reducedMotion={false} />

      <MissionHeader
        currentStageIndex={phase === 'title' ? -1 : phase === 'victory' ? 5 : stageIndex}
        xp={xp}
        streak={streak}
        remainingSeconds={remainingSeconds}
        xpToast={xpToast}
        muted={muted}
        onToggleMute={handleToggleMute}
        onRequestExit={() => {
          soundFx.playPop();
          if (phase === 'title') {
            try {
              window.parent?.postMessage({ type: 'delfina:navigate', route: 'routes' }, '*');
            } catch {
              // no-op standalone
            }
          } else {
            setExitOpen(true);
          }
        }}
      />

      <main className="relative z-10 flex flex-1 items-center justify-center px-3 py-2 sm:px-5">
        {phase === 'title' && <TitleIntroStage savedStats={savedStats} />}

        {phase === 'playing' && (
          <StageViews
            stageIndex={stageIndex}
            deck={deck}
            onReportAnswer={handleReportAnswer}
            onNudge={handleNudge}
            onGuide={handleGuide}
            onStageComplete={handleStageComplete}
          />
        )}

        {phase === 'victory' && (
          <VictoryModal
            xp={xp}
            bestStreak={bestRunStreak}
            elapsedSeconds={spentSeconds}
            timedOut={timedOut}
            mastery={mastery}
            savedStats={savedStats}
            onPlayAgain={() => startNewRun(true)}
          />
        )}
      </main>

      {phase !== 'victory' ? (
        <DelphiDock
          mood={delphiMood}
          bubbles={delphiBubbles}
          ctaLabel={phase === 'title' ? 'شروع' : undefined}
          isStartCta={phase === 'title'}
          onCtaClick={phase === 'title' ? () => startNewRun(true) : undefined}
          character={phase === 'playing' ? 'official' : 'delphi'}
        />
      ) : (
        <DelphiDock mood="celebrating" bubbles={delphiBubbles} character="delphi" />
      )}

      <ExitDialog
        open={exitOpen}
        stageIndex={stageIndex}
        xp={xp}
        onCancel={() => setExitOpen(false)}
        onConfirmReset={() => startNewRun(false)}
      />
    </div>
  );
}

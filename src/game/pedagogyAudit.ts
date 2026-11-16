// Quantitative educational game-design audit for Delfina Island 2 Final Mission.
// Combines Sweller Cognitive Load readability checks with Bloom's Taxonomy,
// Csíkszentmihályi Flow Theory, MDA Aesthetics, and Vygotsky Scaffolding metrics.

import {
  CINEMA_POOL,
  CLUSTER_MAPS,
  FEATURE_POOL,
  STAGES,
  StageId,
  SUPERVISED_POOL,
  SYNTHESIS_POOL
} from './capstoneEngine';
import { composeDelphiLineWithAudit } from './delphiNarrator';
import {
  evaluateReadabilityForKids,
  ReadabilityReport,
  simplifyAndGuardDelphiText
} from './delphiTextGuard';

export interface StagePedagogyMetric {
  stageId: StageId;
  stageTitle: string;
  bloomLevel: string;
  mdaAesthetic: string;
  interactionMechanic: string;
  questionCountInPool: number;
  promptReadabilityAvg: number;
  maxPromptWords: number;
  delphiScoreBeforeGuard: number;
  delphiScoreAfterGuard: number;
  autoFixesCount: number;
  agencyScore: number; // 0..100 (spatial/direct manipulation vs binary choice)
  feedbackImmediacyScore: number; // 0..100
  engagementIndex: number; // 0..100 composite educational engagement
  cognitiveLoadRisk: 'کم' | 'متوسط' | 'نیازمند ساده‌سازی';
  needsSimplificationItems: string[];
}

export interface QuestionSimplificationCandidate {
  stageId: StageId;
  itemId: string;
  surface: 'سوال / کارت صحنه' | 'بازخورد دلفی';
  rawText: string;
  wordCount: number;
  maxSentenceWords: number;
  simplicityScoreBefore: number;
  simplicityScoreAfter: number;
  complexTermsFound: string[];
  formalPhrasesFound: string[];
  issues: ReadabilityReport['issues'];
  suggestedSimplifiedText: string;
}

export interface CurriculumAuditReport {
  stages: StagePedagogyMetric[];
  highestEngagementStages: { stageId: StageId; stageTitle: string; engagementIndex: number; why: string }[];
  simplificationHotspots: QuestionSimplificationCandidate[];
  delphiGuardSummary: {
    totalDelphiLinesAudited: number;
    linesModifiedByGuard: number;
    avgScoreBefore: number;
    avgScoreAfter: number;
    totalComplexTermsReplaced: number;
    totalGrammarRulesApplied: number;
  };
}

interface StagePedagogicalProfile {
  bloomLevel: string;
  mdaAesthetic: string;
  interactionMechanic: string;
  agencyScore: number;
  feedbackImmediacyScore: number;
  engagementBonus: number;
  whyEngaging: string;
}

const STAGE_PROFILES: Record<StageId, StagePedagogicalProfile> = {
  cinema: {
    bloomLevel: 'درک و تشخیص (Understand)',
    mdaAesthetic: 'چالش ریتمیک و دسته‌بندی سریع (Challenge)',
    interactionMechanic: 'نوار نقاله متحرک + هدایت دودسته (قانون یا الگو)',
    agencyScore: 68,
    feedbackImmediacyScore: 90,
    engagementBonus: 6,
    whyEngaging: 'انیمیشن نوار نقاله و دیدن صف بسته‌های بعدی حس ریتم و پیش‌بینی‌پذیری ایجاد می‌کند، اما تعامل هنوز دودویی است.'
  },
  features: {
    bloomLevel: 'تحلیل و کشف سرنخ (Analyze)',
    mdaAesthetic: 'کشف و کارآگاهی دیداری (Discovery)',
    interactionMechanic: 'انتخاب نوع داده + کلیک مستقیم روی اشیای مخفی صحنه SVG',
    agencyScore: 92,
    feedbackImmediacyScore: 95,
    engagementBonus: 12,
    whyEngaging: 'کشف مستقیم سرنخ‌ها روی صحنهٔ گرافیکی SVG و تفکیک دادهٔ واقعی از حواس‌پرتی، درگیری ذهنی و تمرکز فضایی بالایی می‌سازد.'
  },
  supervised: {
    bloomLevel: 'کاربست و آزمایش مدل (Apply & Test)',
    mdaAesthetic: 'آزمایشگاه زنده و علت‌ومعلول (Expression / Discovery)',
    interactionMechanic: 'نمونه‌های برچسب‌دار + اسلایدر کلینیک مرجان با عقربهٔ رگرسیون زنده',
    agencyScore: 88,
    feedbackImmediacyScore: 96,
    engagementBonus: 10,
    whyEngaging: 'اسلایدر زندهٔ کلینیک مرجان به کودک اجازه می‌دهد مستقیماً تغییر لکه‌ها و واکنش هم‌زمان دسته‌بندی و عقربهٔ رگرسیون را ببیند.'
  },
  clustering: {
    bloomLevel: 'ساخت الگو و استدلال فضایی (Analyze & Evaluate)',
    mdaAesthetic: 'کاوش فضایی و شهود ریاضی (Discovery & Sensation)',
    interactionMechanic: 'جای‌گذاری ۲ مرکز خوشه روی مختصات + اتصال زنده خط‌چین فاصله تا مورد جدید',
    agencyScore: 96,
    feedbackImmediacyScore: 98,
    engagementBonus: 14,
    whyEngaging: 'بالاترین عاملیت فضایی (Spatial Agency): کودک بدون برچسب، خودش مراکز را می‌گذارد و موج سونار و خطوط فاصله فوراً پاسخ بصری می‌دهند.'
  },
  synthesis: {
    bloomLevel: 'ترکیب و انتقال به موقعیت تازه (Evaluate / Transfer)',
    mdaAesthetic: 'جمع‌بندی تصویری و تشخیص روش درست (Challenge & Discovery)',
    interactionMechanic: 'آزمون نهایی با ۳ داستان تصویری کوتاه از دنیای واقعی',
    agencyScore: 86,
    feedbackImmediacyScore: 95,
    engagementBonus: 10,
    whyEngaging: 'آزمون ۳ سؤالی ساده و تصویری بدون تغییر ناگهانی سبک بازی، تمام روش‌های یادگیری ماشین را در موقعیت‌های واقعی جمع‌بندی می‌کند.'
  }
};

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1));
}

export function auditCurriculumAndGameFlow(): CurriculumAuditReport {
  const hotspots: QuestionSimplificationCandidate[] = [];
  let totalDelphiLinesAudited = 0;
  let linesModifiedByGuard = 0;
  let totalComplexTermsReplaced = 0;
  let totalGrammarRulesApplied = 0;
  const allScoresBefore: number[] = [];
  const allScoresAfter: number[] = [];

  const trackDelphiAudit = (
    stageId: StageId,
    itemId: string,
    auditResult: ReturnType<typeof composeDelphiLineWithAudit>
  ) => {
    totalDelphiLinesAudited++;
    allScoresBefore.push(auditResult.reportBefore.simplicityScore);
    allScoresAfter.push(auditResult.reportAfter.simplicityScore);
    totalComplexTermsReplaced += auditResult.replacementsApplied.length;
    totalGrammarRulesApplied += auditResult.grammarFixesApplied.length;
    if (
      auditResult.replacementsApplied.length > 0 ||
      auditResult.grammarFixesApplied.length > 0 ||
      auditResult.reportBefore.simplicityScore !== auditResult.reportAfter.simplicityScore
    ) {
      linesModifiedByGuard++;
    }
    if (
      auditResult.reportAfter.simplicityScore < 82 ||
      auditResult.reportAfter.maxWordsInSentence > 19
    ) {
      hotspots.push({
        stageId,
        itemId,
        surface: 'بازخورد دلفی',
        rawText: auditResult.text,
        wordCount: auditResult.reportAfter.wordCount,
        maxSentenceWords: auditResult.reportAfter.maxWordsInSentence,
        simplicityScoreBefore: auditResult.reportBefore.simplicityScore,
        simplicityScoreAfter: auditResult.reportAfter.simplicityScore,
        complexTermsFound: auditResult.reportBefore.complexTermsFound,
        formalPhrasesFound: auditResult.reportBefore.formalPhrasesFound,
        issues: auditResult.reportAfter.issues,
        suggestedSimplifiedText: auditResult.text
      });
    }
  };

  const trackCardPrompt = (stageId: StageId, itemId: string, rawText: string) => {
    const before = evaluateReadabilityForKids(rawText);
    const guarded = simplifyAndGuardDelphiText(rawText);
    if (
      before.simplicityScore < 85 ||
      before.maxWordsInSentence > 18 ||
      before.complexTermsFound.length > 0
    ) {
      hotspots.push({
        stageId,
        itemId,
        surface: 'سوال / کارت صحنه',
        rawText,
        wordCount: before.wordCount,
        maxSentenceWords: before.maxWordsInSentence,
        simplicityScoreBefore: before.simplicityScore,
        simplicityScoreAfter: guarded.reportAfter.simplicityScore,
        complexTermsFound: before.complexTermsFound,
        formalPhrasesFound: before.formalPhrasesFound,
        issues: before.issues,
        suggestedSimplifiedText: guarded.text
      });
    }
    return { before, guarded };
  };

  const stages: StagePedagogyMetric[] = STAGES.map((stage) => {
    const profile = STAGE_PROFILES[stage.id];
    const promptReports: ReadabilityReport[] = [];
    const delphiBefores: number[] = [];
    const delphiAfters: number[] = [];
    let autoFixesCount = 0;

    // 1. Stage enter Delphy bridge
    const enterAudit = composeDelphiLineWithAudit({
      event: 'stage_enter',
      stageId: stage.id,
      coreText: stage.introLine
    });
    trackDelphiAudit(stage.id, `${stage.id}-enter`, enterAudit);
    delphiBefores.push(enterAudit.reportBefore.simplicityScore);
    delphiAfters.push(enterAudit.reportAfter.simplicityScore);
    autoFixesCount += enterAudit.replacementsApplied.length + enterAudit.grammarFixesApplied.length;

    let questionCount = 0;

    if (stage.id === 'cinema') {
      questionCount = CINEMA_POOL.length;
      CINEMA_POOL.forEach((c) => {
        promptReports.push(trackCardPrompt('cinema', c.id, c.task).before);
        const okAudit = composeDelphiLineWithAudit({
          event: 'correct',
          stageId: 'cinema',
          coreText: c.okFeedback,
          xpGained: 20,
          streak: 1,
          turnIndex: 0
        });
        const wrongAudit = composeDelphiLineWithAudit({
          event: 'wrong',
          stageId: 'cinema',
          coreText: c.hintFeedback,
          turnIndex: 1
        });
        [okAudit, wrongAudit].forEach((a, i) => {
          trackDelphiAudit('cinema', `${c.id}-fb-${i}`, a);
          delphiBefores.push(a.reportBefore.simplicityScore);
          delphiAfters.push(a.reportAfter.simplicityScore);
          autoFixesCount += a.replacementsApplied.length + a.grammarFixesApplied.length;
        });
      });
    } else if (stage.id === 'features') {
      questionCount = FEATURE_POOL.length;
      FEATURE_POOL.forEach((f) => {
        promptReports.push(trackCardPrompt('features', f.id, `${f.title}. ${f.prompt}`).before);
        const typeAudit = composeDelphiLineWithAudit({
          event: 'correct',
          stageId: 'features',
          coreText: f.typeReason,
          xpGained: 20,
          streak: 1
        });
        trackDelphiAudit('features', `${f.id}-type`, typeAudit);
        delphiBefores.push(typeAudit.reportBefore.simplicityScore);
        delphiAfters.push(typeAudit.reportAfter.simplicityScore);
        autoFixesCount += typeAudit.replacementsApplied.length + typeAudit.grammarFixesApplied.length;

        f.chips.forEach((chip) => {
          const chipAudit = composeDelphiLineWithAudit({
            event: chip.intrinsic ? 'correct' : 'wrong',
            stageId: 'features',
            coreText: chip.reason,
            xpGained: chip.intrinsic ? 20 : 0,
            turnIndex: chip.intrinsic ? 0 : 2
          });
          trackDelphiAudit('features', `${f.id}-${chip.id}`, chipAudit);
          delphiBefores.push(chipAudit.reportBefore.simplicityScore);
          delphiAfters.push(chipAudit.reportAfter.simplicityScore);
          autoFixesCount += chipAudit.replacementsApplied.length + chipAudit.grammarFixesApplied.length;
        });
      });
    } else if (stage.id === 'supervised') {
      questionCount = SUPERVISED_POOL.length + 1;
      SUPERVISED_POOL.forEach((s) => {
        promptReports.push(trackCardPrompt('supervised', s.id, s.title).before);
        const okAudit = composeDelphiLineWithAudit({
          event: 'correct',
          stageId: 'supervised',
          coreText: s.okFeedback,
          xpGained: 20,
          streak: 1
        });
        const wrongAudit = composeDelphiLineWithAudit({
          event: 'wrong',
          stageId: 'supervised',
          coreText: s.hintFeedback,
          turnIndex: 2
        });
        [okAudit, wrongAudit].forEach((a, i) => {
          trackDelphiAudit('supervised', `${s.id}-fb-${i}`, a);
          delphiBefores.push(a.reportBefore.simplicityScore);
          delphiAfters.push(a.reportAfter.simplicityScore);
          autoFixesCount += a.replacementsApplied.length + a.grammarFixesApplied.length;
        });
      });
    } else if (stage.id === 'clustering') {
      questionCount = CLUSTER_MAPS.length;
      CLUSTER_MAPS.forEach((m) => {
        promptReports.push(
          trackCardPrompt('clustering', m.id, `${m.title}. ${m.xLabel} و ${m.yLabel}`).before
        );
        const okAudit = composeDelphiLineWithAudit({
          event: 'correct',
          stageId: 'clustering',
          coreText: m.mystery.explanation,
          xpGained: 20,
          streak: 1
        });
        trackDelphiAudit('clustering', `${m.id}-exp`, okAudit);
        delphiBefores.push(okAudit.reportBefore.simplicityScore);
        delphiAfters.push(okAudit.reportAfter.simplicityScore);
        autoFixesCount += okAudit.replacementsApplied.length + okAudit.grammarFixesApplied.length;
      });
    } else if (stage.id === 'synthesis') {
      questionCount = SYNTHESIS_POOL.length;
      SYNTHESIS_POOL.forEach((q) => {
        promptReports.push(trackCardPrompt('synthesis', q.id, q.prompt).before);
        const okAudit = composeDelphiLineWithAudit({
          event: 'correct',
          stageId: 'synthesis',
          coreText: q.okFeedback,
          xpGained: 20,
          streak: 1
        });
        const wrongAudit = composeDelphiLineWithAudit({
          event: 'wrong',
          stageId: 'synthesis',
          coreText: q.hintFeedback,
          turnIndex: 1
        });
        [okAudit, wrongAudit].forEach((a, i) => {
          trackDelphiAudit('synthesis', `${q.id}-fb-${i}`, a);
          delphiBefores.push(a.reportBefore.simplicityScore);
          delphiAfters.push(a.reportAfter.simplicityScore);
          autoFixesCount += a.replacementsApplied.length + a.grammarFixesApplied.length;
        });
      });
    }

    const promptReadabilityAvg = avg(promptReports.map((r) => r.simplicityScore));
    const maxPromptWords = promptReports.reduce(
      (max, r) => Math.max(max, r.maxWordsInSentence),
      0
    );
    const delphiScoreBeforeGuard = avg(delphiBefores);
    const delphiScoreAfterGuard = avg(delphiAfters);

    // Engagement combines Agency (45%), Feedback Immediacy (25%), Readability clarity (30%) + pedagogical bonus
    const rawEngagement =
      profile.agencyScore * 0.42 +
      profile.feedbackImmediacyScore * 0.23 +
      ((promptReadabilityAvg + delphiScoreAfterGuard) / 2) * 0.25 +
      profile.engagementBonus;
    const engagementIndex = Math.min(99, Math.round(rawEngagement));

    const cognitiveLoadRisk: StagePedagogyMetric['cognitiveLoadRisk'] =
      maxPromptWords >= 22 || promptReadabilityAvg < 82
        ? 'نیازمند ساده‌سازی'
        : maxPromptWords >= 16 || promptReadabilityAvg < 92
          ? 'متوسط'
          : 'کم';

    const stageHotspots = hotspots
      .filter((h) => h.stageId === stage.id)
      .map((h) => `${h.itemId} (${h.surface})`);

    return {
      stageId: stage.id,
      stageTitle: stage.title,
      bloomLevel: profile.bloomLevel,
      mdaAesthetic: profile.mdaAesthetic,
      interactionMechanic: profile.interactionMechanic,
      questionCountInPool: questionCount,
      promptReadabilityAvg,
      maxPromptWords,
      delphiScoreBeforeGuard,
      delphiScoreAfterGuard,
      autoFixesCount,
      agencyScore: profile.agencyScore,
      feedbackImmediacyScore: profile.feedbackImmediacyScore,
      engagementIndex,
      cognitiveLoadRisk,
      needsSimplificationItems: Array.from(new Set(stageHotspots))
    };
  });

  const highestEngagementStages = [...stages]
    .sort((a, b) => b.engagementIndex - a.engagementIndex)
    .slice(0, 3)
    .map((s) => ({
      stageId: s.stageId,
      stageTitle: s.stageTitle,
      engagementIndex: s.engagementIndex,
      why: STAGE_PROFILES[s.stageId].whyEngaging
    }));

  // Sort hotspots by lowest readability score first so priority simplification items appear at top
  const sortedHotspots = [...hotspots].sort(
    (a, b) => a.simplicityScoreBefore - b.simplicityScoreBefore || b.wordCount - a.wordCount
  );

  return {
    stages,
    highestEngagementStages,
    simplificationHotspots: sortedHotspots,
    delphiGuardSummary: {
      totalDelphiLinesAudited,
      linesModifiedByGuard,
      avgScoreBefore: avg(allScoresBefore),
      avgScoreAfter: avg(allScoresAfter),
      totalComplexTermsReplaced,
      totalGrammarRulesApplied
    }
  };
}

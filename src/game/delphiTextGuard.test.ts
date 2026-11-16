import test from 'node:test';
import assert from 'node:assert/strict';
import {
  balanceLongSentences,
  evaluateReadabilityForKids,
  simplifyAndGuardDelphiText
} from './delphiTextGuard';
import { composeDelphiLine, composeDelphiLineWithAudit } from './delphiNarrator';
import { auditCurriculumAndGameFlow } from './pedagogyAudit';

test('lexicon guard replaces ambiguous jargon and preserves Unicode Persian word boundaries', () => {
  const input = 'عامل هوشمند با الگوریتم پیچیده فرکانسِ صدا را تحلیل می‌کند و مقدار پیوسته‌ست.';
  const res = simplifyAndGuardDelphiText(input);

  assert.ok(!res.text.includes('عامل'));
  assert.ok(!res.text.includes('الگوریتم'));
  assert.ok(!res.text.includes('فرکانس'));
  assert.ok(!res.text.includes('تحلیل'));
  assert.ok(!res.text.includes('پیوسته‌ست'));

  assert.ok(res.text.includes('ربات بازیکن'));
  assert.ok(res.text.includes('روش کارِ مدل'));
  assert.ok(res.text.includes('تندیِ موجِ'));
  assert.ok(res.text.includes('بررسی'));
  assert.ok(res.text.includes('عددی و اندازه‌گیریه'));
  assert.ok(res.reportAfter.simplicityScore > res.reportBefore.simplicityScore);

  // Substring safety: words containing letters of replaced terms shouldn't corrupt
  const unrelated = 'تعاملِ کودکان و تحلیل‌گرها بررسی می‌شود.';
  const guardedUnrelated = simplifyAndGuardDelphiText(unrelated);
  assert.ok(guardedUnrelated.text.includes('تعاملِ'));
  assert.ok(guardedUnrelated.text.includes('میشه'));
});

test('grammar guard converts formal connectors and passive verbs into conversational Persian', () => {
  const input =
    'عبارت است از روشی که از آنجایی که ساده است، پاسخ به‌عنوان الگو انتخاب می‌شود؛ چراکه دقیق است.';
  const res = simplifyAndGuardDelphiText(input);

  assert.ok(!res.text.includes('عبارت است از'));
  assert.ok(!res.text.includes('از آنجایی که'));
  assert.ok(!res.text.includes('می‌شود'));
  assert.ok(!res.text.includes('چراکه'));
  assert.ok(!res.text.includes('به‌عنوان'));

  assert.ok(res.text.includes('یعنی'));
  assert.ok(res.text.includes('میشه'));
  assert.ok(res.text.includes('چون'));
  assert.ok(res.text.includes('مثلِ'));
  assert.ok(res.grammarFixesApplied.length >= 4);
});

test('balanceLongSentences splits dense clauses over 20 words at safe connectors', () => {
  const dense =
    'وقتی عکس‌ها هیچ برچسبی ندارن ماشین مجبوره ویژگی‌های نزدیک به هم رو کنار هم بذاره تا الگو پیدا میشه اما برچسب آماده‌ای برای تمرین از قبل توی جدول وجود نداره.';
  const balanced = balanceLongSentences(dense, 18);
  assert.ok(balanced.includes('. اما'));
  const report = evaluateReadabilityForKids(balanced);
  assert.ok(report.sentenceCount >= 2);
});

test('composeDelphiLine guards every stage and event output before display', () => {
  const guardedWrong = composeDelphiLineWithAudit({
    event: 'wrong',
    stageId: 'supervised',
    coreText: 'وزن یک مقدار عددی پیوسته‌ست و فرکانسِ آن قطعی است؛ چراکه الگوریتم عدد تخمین می‌زند.',
    turnIndex: 2
  });

  assert.ok(!guardedWrong.text.includes('چراکه'));
  assert.ok(!guardedWrong.text.includes('پیوسته‌ست'));
  assert.ok(!guardedWrong.text.includes('فرکانس'));
  assert.ok(!guardedWrong.text.includes('قطعی'));
  assert.ok(!guardedWrong.text.includes('الگوریتم'));
  assert.ok(!guardedWrong.text.includes('تخمین'));
  assert.ok(guardedWrong.text.includes('چون'));
  assert.ok(guardedWrong.text.includes('پس'));
  assert.equal(/[،,;؛:«»"'()]/.test(guardedWrong.text), false);
  assert.equal(guardedWrong.reportAfter.complexTermsFound.length, 0);

  const publicText = composeDelphiLine({
    event: 'correct',
    stageId: 'clustering',
    coreText: 'مدل میانگین مکان را به‌عنوان مرکز پیدا کرد',
    streak: 2,
    xpGained: 25
  });
  assert.ok(!publicText.includes('میانگین'));
  assert.ok(!publicText.includes('به‌عنوان'));
  assert.ok(publicText.includes('نقطهٔ وسط'));
});

test('pedagogyAudit computes quantitative engagement and readability report for all 5 stages', () => {
  const report = auditCurriculumAndGameFlow();
  assert.equal(report.stages.length, 5);
  assert.ok(report.highestEngagementStages.length === 3);
  assert.ok(report.delphiGuardSummary.totalDelphiLinesAudited >= 20);
  assert.ok(
    report.delphiGuardSummary.avgScoreAfter >= report.delphiGuardSummary.avgScoreBefore
  );
  assert.equal(report.delphiGuardSummary.totalComplexTermsReplaced, 0);
  assert.ok(report.delphiGuardSummary.avgScoreAfter >= 90);
});

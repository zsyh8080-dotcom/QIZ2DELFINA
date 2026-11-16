import test from 'node:test';
import assert from 'node:assert/strict';
import {
  composeDelphiBubbles,
  composeDelphiLine,
  DELPHI_SIMPLE_SYNONYMS,
  simplifyDelphiHardWordsAndMetaphors
} from './delphiNarrator';

const PERSIAN_CONNECTORS = ['حالا که', 'پس', 'چون', 'برای همین'];
const FORBIDDEN_BUBBLE_PUNCT = /[،,;؛:«»"'()]/;

function hasConnector(text: string): boolean {
  return PERSIAN_CONNECTORS.some((c) => text.includes(c));
}

test('title_intro generates paginated short bubbles with connectors and no forbidden punctuation', () => {
  const bubbles = composeDelphiBubbles({
    event: 'title_intro',
    coreText: ''
  });
  assert.equal(bubbles.length, 2);
  for (const b of bubbles) {
    const words = b.text.split(/\s+/u).filter(Boolean);
    assert.ok(words.length >= 8 && words.length <= 18, `Unexpected word count ${words.length}: ${b.text}`);
    assert.equal(FORBIDDEN_BUBBLE_PUNCT.test(b.text), false, `Forbidden punct in: ${b.text}`);
    assert.ok(!b.keywords || b.keywords.length <= 2);
  }
  const combined = bubbles.map((b) => b.text).join(' ');
  assert.equal(hasConnector(combined), true);
  assert.ok(combined.includes('یادگیری ماشین'));
  assert.equal(combined.includes('یادگیرنده'), false);
});

test('stage_enter bridges connected stages and provides independent standalone intros', () => {
  const connected = composeDelphiBubbles({
    event: 'stage_enter',
    stageId: 'clustering',
    previousStageId: 'supervised',
    coreText: ''
  });
  assert.equal(connected.length, 2);
  const connectedText = connected.map((b) => b.text).join(' ');
  assert.equal(hasConnector(connectedText), true);
  assert.ok(connectedText.includes('هیچ اسمی'));
  assert.ok(!connectedText.includes('فانوس'));
  assert.equal(FORBIDDEN_BUBBLE_PUNCT.test(connectedText), false);

  const standalone = composeDelphiBubbles({
    event: 'stage_enter',
    stageId: 'cinema',
    coreText: '',
    standaloneStart: true
  });
  const standaloneText = standalone.map((b) => b.text).join(' ');
  assert.ok(standaloneText.includes('دلفی'));
  assert.equal(FORBIDDEN_BUBBLE_PUNCT.test(standaloneText), false);
});

test('correct and wrong events maintain conversational tone, connectors, and strict bubble limits', () => {
  const normal = composeDelphiLine({
    event: 'correct',
    coreText: 'وقتی شرط عددی روشنه قانون آماده سریع‌تره',
    streak: 1,
    xpGained: 20,
    turnIndex: 0
  });
  assert.equal(hasConnector(normal), true);
  assert.ok(normal.includes('۲۰ امتیاز'));
  assert.ok(!normal.includes('+۲۰★'));
  assert.equal(FORBIDDEN_BUBBLE_PUNCT.test(normal), false);

  const withNext = composeDelphiBubbles({
    event: 'correct',
    coreText: 'دوربین عکس گرفته و نوع داده تصویر است',
    nextPrompt: 'روی ۲ سرنخ اصلی توی تصویر بالا بزن.',
    streak: 1,
    xpGained: 20,
    turnIndex: 1
  });
  assert.ok(withNext.some((b) => b.text.includes('حالا روی ۲ سرنخ اصلی')));
  for (const b of withNext) {
    assert.equal(FORBIDDEN_BUBBLE_PUNCT.test(b.text), false);
    assert.ok(!b.keywords || b.keywords.length <= 2);
  }

  const streakLine = composeDelphiLine({
    event: 'correct',
    coreText: 'مدل از مثال‌ها الگو می‌گیره',
    streak: 3,
    xpGained: 30,
    turnIndex: 2
  });
  assert.equal(hasConnector(streakLine), true);
  assert.ok(streakLine.includes('۳ پاسخ پیاپی'));

  const wrong = composeDelphiLine({
    event: 'wrong',
    coreText: 'اینجا فقط یه مقایسه ساده عدد داریم',
    turnIndex: 0
  });
  assert.ok(wrong.includes('چون'));
  assert.ok(wrong.includes('پس'));
  assert.ok(wrong.includes('امتحانش کن'));
  assert.equal(FORBIDDEN_BUBBLE_PUNCT.test(wrong), false);
});

test('victory composes paginated connected summary with Persian score and star count', () => {
  const bubbles = composeDelphiBubbles({
    event: 'victory',
    coreText: '',
    totalXp: 420,
    stars: 3,
    rankTitle: 'قهرمان جزیرهٔ ۲'
  });
  assert.equal(bubbles.length, 2);
  const combined = bubbles.map((b) => b.text).join(' ');
  assert.equal(hasConnector(combined), true);
  assert.ok(combined.includes('۴۲۰'));
  assert.ok(combined.includes('۳ ستاره'));
  assert.equal(FORBIDDEN_BUBBLE_PUNCT.test(combined), false);
});

test('simplifyDelphiHardWordsAndMetaphors detects and replaces metaphors and hard terms with یادگیری ماشین', () => {
  assert.ok(Object.keys(DELPHI_SIMPLE_SYNONYMS).length >= 25);

  const sample =
    'مغزِ هوش مصنوعی با این جادو از اقیانوسِ داده‌ها الگو استخراج می‌کنه و فرآیند تخمین رو بهتر می‌کنه.';
  const processed = simplifyDelphiHardWordsAndMetaphors(sample);

  assert.ok(!processed.text.includes('مغزِ هوش مصنوعی'));
  assert.ok(!processed.text.includes('جادو'));
  assert.ok(!processed.text.includes('اقیانوسِ داده‌ها'));
  assert.ok(!processed.text.includes('استخراج'));
  assert.ok(!processed.text.includes('فرآیند'));
  assert.ok(!processed.text.includes('تخمین'));

  assert.ok(processed.text.includes('مدلِ یادگیری ماشین'));
  assert.equal(processed.text.includes('یادگیرنده'), false);
  assert.ok(processed.text.includes('روش کار برنامه'));
  assert.ok(processed.text.includes('مجموعه مثال‌ها'));
  assert.ok(processed.text.includes('پیدا کردن'));
  assert.ok(processed.text.includes('مراحل کار'));
  assert.ok(processed.text.includes('حدس نزدیک'));
  assert.ok(processed.detectedTerms.length >= 6);

  const safeTitle = simplifyDelphiHardWordsAndMetaphors('قهرمان اقیانوس هوش مصنوعی');
  assert.equal(safeTitle.text, 'قهرمان اقیانوس هوش مصنوعی');
  assert.equal(safeTitle.detectedTerms.length, 0);
});

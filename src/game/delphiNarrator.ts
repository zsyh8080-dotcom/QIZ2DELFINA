// Narrative continuity & multi-bubble dialogue engine for Delphy (ages 8-13, Persian RTL).
// Rules enforced:
// - Warm, curious conversational Persian ('ببین', 'می‌شه', 'بیا امتحانش کنیم')
// - Strong story continuity linking each bubble/stage to the previous action ('حالا که', 'پس', 'چون', 'برای همین')
// - Concise 10-15 word bubbles (~2 lines max on mobile) with optional pagination
// - Up to 1-2 highlighted keywords per bubble
// - Child-facing bubbles contain NO Persian/English commas, colons, semicolons, quotes, or parentheses
// - Consistent terminology: 'یادگیری ماشین' (never 'یادگیرنده')

import { StageId, toFa } from './capstoneEngine';
import {
  evaluateReadabilityForKids,
  sanitizeKidBubblePunctuation,
  simplifyAndGuardDelphiText,
  TextGuardResult
} from './delphiTextGuard';

export type DelphiEventType =
  | 'title_intro'
  | 'stage_enter'
  | 'correct'
  | 'wrong'
  | 'guide'
  | 'stage_complete'
  | 'victory';

export interface DelphiBubble {
  id: string;
  text: string;
  keywords?: string[];
}

export interface DelphiNarrativeInput {
  event: DelphiEventType;
  stageId?: StageId;
  previousStageId?: StageId;
  coreText: string;
  nextPrompt?: string;
  standaloneStart?: boolean;
  streak?: number;
  recoveredFromMistake?: boolean;
  xpGained?: number;
  totalXp?: number;
  stars?: number;
  rankTitle?: string;
  timedOut?: boolean;
  turnIndex?: number;
}

// Curated kid-friendly dictionary (ages 8-13) mapping complex words and confusing
// metaphors to clear, literal Persian synonyms before rendering inside Delphy's bubble.
export const DELPHI_SIMPLE_SYNONYMS: Record<string, string> = {
  'فانوس': 'روش کار',
  'مغزِ هوش مصنوعی': 'مدلِ یادگیری ماشین',
  'مغز ربات': 'مدلِ یادگیری ماشین',
  'مدلِ یادگیرنده': 'مدلِ یادگیری ماشین',
  'رباتِ یادگیرنده': 'رباتِ یادگیری ماشین',
  'ربات یادگیرنده': 'ربات یادگیری ماشین',
  'اقیانوسِ داده‌ها': 'مجموعه مثال‌ها',
  'دریایِ داده‌ها': 'مجموعه مثال‌ها',
  'چراغِ راهنما': 'نشانهٔ کمک',
  'قطب‌نمای ذهن': 'راهنمای انتخاب',
  'جادو': 'روش کار برنامه',
  'شاخه': 'روش',
  'فرکانس': 'تندیِ موج',
  'عامل': 'ربات بازیکن',
  'پیوسته‌ست': 'عددی و اندازه‌گیریه',
  'پیوسته': 'عددی',
  'مجزا': 'جدا از هم',
  'قطعی': 'ثابت',
  'الگوریتم': 'روش کارِ مدل',
  'بهینه‌سازی': 'بهتر کردن',
  'پارامتر': 'تنظیمات',
  'تخمین': 'حدس نزدیک',
  'سیستم': 'برنامه',
  'مسئلهٔ': 'کارِ',
  'ناظر': 'راهنما',
  'تحلیل': 'بررسی',
  'معیار': 'نشانه',
  'آستانه': 'مرز عدد',
  'میانگین': 'نقطهٔ وسط',
  'ذاتی': 'اصلیِ خودِ موضوع',
  'فرآیند': 'مراحل کار',
  'فرایند': 'مراحل کار',
  'استخراج': 'پیدا کردن'
};

export interface DelphiLexiconMatch {
  term: string;
  synonym: string;
}

export interface DelphiLexiconProcessResult {
  text: string;
  detectedTerms: DelphiLexiconMatch[];
}

function buildPersianBoundaryRegex(phrase: string): RegExp {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}\\u200c])${escaped}(?![\\p{L}\\p{N}\\u200c])`, 'gu');
}

export function simplifyDelphiHardWordsAndMetaphors(
  rawText: string,
  dictionary: Record<string, string> = DELPHI_SIMPLE_SYNONYMS
): DelphiLexiconProcessResult {
  let processed = rawText.trim();
  const detectedTerms: DelphiLexiconMatch[] = [];

  const entries = Object.entries(dictionary).sort(([a], [b]) => b.length - a.length);

  for (const [term, synonym] of entries) {
    const pattern = buildPersianBoundaryRegex(term);
    if (pattern.test(processed)) {
      pattern.lastIndex = 0;
      processed = processed.replace(pattern, synonym);
      detectedTerms.push({ term, synonym });
    }
  }

  return {
    text: processed.replace(/\s{2,}/g, ' ').trim(),
    detectedTerms
  };
}

function cleanKeyword(kw: string): string {
  return simplifyDelphiHardWordsAndMetaphors(kw).text.replace(/[،,;؛:«»"'()]/g, '').trim();
}

function finalizeBubbleText(raw: string): string {
  const lexiconPass = simplifyDelphiHardWordsAndMetaphors(raw);
  const guardPass = simplifyAndGuardDelphiText(lexiconPass.text, {
    stripBubblePunctuation: true
  });
  return sanitizeKidBubblePunctuation(guardPass.text);
}

// Split a longer message cleanly into ~12-15 word bubbles along sentence ends or Persian connectors
function splitIntoShortBubbles(
  prefixId: string,
  rawText: string,
  keywords: string[] = []
): DelphiBubble[] {
  const cleanText = finalizeBubbleText(rawText);
  if (!cleanText) return [];

  // First split by sentence endings (. or ؟)
  const rawSentences = cleanText
    .split(/(?<=[.!؟])\s+/u)
    .map((s) => s.trim())
    .filter(Boolean);

  // Keep every chunk crisp (<= 16 words) so it fits max 2 lines on mobile without awkward mid-clause breaks
  const chunks: string[] = [];
  for (const s of rawSentences) {
    const words = s.split(/\s+/u).filter(Boolean);
    if (words.length <= 16) {
      const prev = chunks[chunks.length - 1];
      const prevWords = prev ? prev.split(/\s+/u).filter(Boolean).length : 99;
      if (prev && prevWords + words.length <= 15) {
        chunks[chunks.length - 1] = `${prev} ${s}`;
      } else {
        chunks.push(s);
      }
    } else {
      // Split along safe discourse junction near the middle, keeping both bubbles natural (>= 5 words)
      let splitPos = -1;
      for (const m of s.matchAll(/\s+(پس|برای همین|حالا که|چون|اما|و بعد|که|تا)\s+/gu)) {
        if (m.index !== undefined) {
          const leftWords = s.slice(0, m.index).trim().split(/\s+/u).length;
          const rightWords = s.slice(m.index).trim().split(/\s+/u).length;
          if (leftWords >= 5 && rightWords >= 5) {
            splitPos = m.index;
            break;
          }
        }
      }
      if (splitPos > 0) {
        const part1Raw = s.slice(0, splitPos).trim();
        const part1 = sanitizeKidBubblePunctuation(/[.!؟]$/.test(part1Raw) ? part1Raw : `${part1Raw}.`);
        const part2 = sanitizeKidBubblePunctuation(s.slice(splitPos).trim());
        chunks.push(part1, part2);
      } else {
        const mid = Math.ceil(words.length / 2);
        chunks.push(
          sanitizeKidBubblePunctuation(words.slice(0, mid).join(' ')),
          sanitizeKidBubblePunctuation(words.slice(mid).join(' '))
        );
      }
    }
  }

  const normalizedKeywords = keywords.map(cleanKeyword).filter(Boolean).slice(0, 2);

  return chunks.map((chunkText, i) => {
    const matchedKws = normalizedKeywords
      .filter((kw) => chunkText.includes(kw))
      .slice(0, 2);
    return {
      id: `${prefixId}-${i}`,
      text: chunkText,
      keywords: matchedKws.length > 0 ? matchedKws : undefined
    };
  });
}

// Stage-enter multi-bubble story scripts (each bubble 10-15 words, linked directly to previous stage)
export const STAGE_STORY_BUBBLES: Record<
  StageId,
  { connected: { text: string; keywords: string[] }[]; standalone: { text: string; keywords: string[] }[] }
> = {
  cinema: {
    connected: [
      {
        text: 'از آنجا که آزمون افزایش سطح با تشخیص قانون و الگو آغاز می‌شود ابتدا کارت‌های مسابقه را با دقت بررسی کنید.',
        keywords: ['آزمون افزایش سطح', 'قانون']
      },
      {
        text: 'بنابراین با اطمینان تصمیم بگیرید که هر فعالیت با قانون‌نویسی ساده انجام می‌شود یا به یادگیری ماشین نیاز دارد.',
        keywords: ['قانون‌نویسی', 'یادگیری ماشین']
      }
    ],
    standalone: [
      {
        text: 'من دلفی هستم و نزدیک ساحل منتظر مانده‌ام تا آزمون افزایش سطح را با یکدیگر آغاز کنیم.',
        keywords: ['دلفی', 'آزمون افزایش سطح']
      },
      {
        text: 'چون سطح شما ارتقا می‌یابد پس مشخص کنید که هر مورد با قانون‌نویسی انجام می‌شود یا یادگیری ماشین.',
        keywords: ['سطحت']
      }
    ]
  },
  features: {
    connected: [
      {
        text: 'اکنون که متوجه شدید کجا یادگیری ماشین لازم است مشاهده کنید مدل از چه داده‌ای سرنخ اصلی را دریافت می‌کند.',
        keywords: ['داده', 'سرنخ']
      },
      {
        text: 'زیرا دادهٔ درست اهمیت زیادی دارد ابتدا نوع آن را انتخاب کنید و سپس دو سرنخ اصلی تصویر را پیدا نمایید.',
        keywords: ['نوعش', 'دو سرنخ']
      }
    ],
    standalone: [
      {
        text: 'در این مرحله از آزمون بررسی کنید هر صحنه از چه نوع داده‌ای استفاده می‌کند و آن را انتخاب کنید.',
        keywords: ['داده']
      },
      {
        text: 'پس از انتخاب نوع داده چون پس‌زمینه ممکن است گول‌زننده باشد دو سرنخ اصلی موضوع را پیدا کنید.',
        keywords: ['سرنخ']
      }
    ]
  },
  supervised: {
    connected: [
      {
        text: 'اکنون که سرنخ‌ها را شناختید مدل با مثال‌های برچسب‌دار تمرین می‌کند تا سطح شما در این بازی بالاتر برود.',
        keywords: ['مثال‌های برچسب‌دار']
      },
      {
        text: 'بنابراین دقت کنید آیا مدل قرار است نام یک گروه را تعیین کند یا به دلیل نیاز به مقدار عددی مقدار عددی را حدس بزند.',
        keywords: ['اسم یک گروه', 'مقدار عددی']
      }
    ],
    standalone: [
      {
        text: 'چون در اینجا مثال‌ها پاسخ آماده دارند مدل با یادگیری با نظارت تمرین می‌کند تا امتیاز کسب کنید.',
        keywords: ['یادگیری با نظارت']
      }
    ]
  },
  clustering: {
    connected: [
      {
        text: 'در بخش قبل مثال‌ها برچسب داشتند اما از آنجا که روی این نقشه هیچ اسمی وجود ندارد کار کاملاً متفاوتی انجام می‌شود.',
        keywords: ['هیچ اسمی']
      },
      {
        text: 'بنابراین دو مرکز در میان دسته‌ها قرار دهید تا موارد مشابه بر اساس نزدیکی در کنار یکدیگر واقع شوند.',
        keywords: ['نزدیکی']
      }
    ],
    standalone: [
      {
        text: 'زیرا در اینجا هیچ برچسبی وجود ندارد پس مدل بر اساس نزدیکی نقاط دو گروه کاملاً تازه ایجاد می‌کند.',
        keywords: ['نزدیکی']
      }
    ]
  },
  synthesis: {
    connected: [
      {
        text: 'اکنون که تمام بخش‌های پیشین را با موفقیت پشت سر گذاشتید نوبت مرحلهٔ پایانی آزمون است تا نشان اصلی خود را دریافت کنید.',
        keywords: ['افزایش سطح']
      },
      {
        text: 'بنابراین هر داستان کوتاه را با دقت بخوانید زیرا با انتخاب روش درست یادگیری ماشین سطح شما ارتقا می‌یابد.',
        keywords: ['یادگیری ماشین']
      }
    ],
    standalone: [
      {
        text: 'چون این مرحله بخش پایانی آزمون افزایش سطح است برای سه داستان کوتاه روش درست را با دقت انتخاب کنید.',
        keywords: ['افزایش سطح']
      }
    ]
  }
};

const CORRECT_LEADS = [
  'چه پیشرفت عالی‌ای پس',
  'چه انتخاب درستی بنابرین پس',
  'آفرین چه تحلیل دقیقی پس',
  'دقیقاً به هدف زدید پس'
];

const STREAK_LEADS = [
  'چقدر دقیق و منظم پیش می‌روید پس',
  'پشت سر هم پاسخ صحیح دادید پس',
  'چه تمرکز بالایی دارید پس'
];

const RECOVERY_LEADS = [
  'مجدداً با دقت نگاه کردید و پاسخ درست را دادید پس',
  'با تمرکز بیشتر آن را پیدا کردید پس',
  'چه عالی اشتباه خود را جبران نمودید پس'
];

const WRONG_LEADS = [
  'لحظه‌ای به تصویر نگاه کنید چون',
  'اجازه دهید دوباره با هم بررسی کنیم چون',
  'عجله نکنید و با دقت مشاهده نمایید چون'
];

export function composeDelphiBubbles(input: DelphiNarrativeInput): DelphiBubble[] {
  const idx = Math.abs(input.turnIndex ?? 0);
  const core = input.coreText.trim();

  if (input.event === 'title_intro') {
    return [
      {
        id: `title-0`,
        text: finalizeBubbleText(
          'برای اینکه سطحت بره بالا باید توی آزمون افزایش سطح یادگیری ماشین شرکت کنی.'
        ),
        keywords: ['آزمون افزایش سطح', 'یادگیری ماشین']
      },
      {
        id: `title-1`,
        text: finalizeBubbleText(
          'من در ساحل منتظرم و مسئول آزمون در مأموریت همراهت است پس شروع را بزن.'
        ),
        keywords: ['مسئول آزمون', 'شروع']
      }
    ];
  }

  if (input.event === 'stage_enter' && input.stageId) {
    const script = STAGE_STORY_BUBBLES[input.stageId];
    const items = input.standaloneStart && !input.previousStageId ? script.standalone : script.connected;
    return items.map((item, i) => ({
      id: `stage-${input.stageId}-${i}`,
      text: finalizeBubbleText(item.text),
      keywords: item.keywords.map(cleanKeyword).slice(0, 2)
    }));
  }

  if (input.event === 'wrong') {
    const lead = WRONG_LEADS[idx % WRONG_LEADS.length];
    const cleanCore = core.replace(/[.!؟،,;؛:«»"'()]+$/g, '').trim();
    return splitIntoShortBubbles(
      `wrong-${idx}`,
      `${lead} ${cleanCore}. پس آن را دوباره امتحان کنید.`,
      ['امتحان کنید']
    );
  }

  if (input.event === 'guide') {
    return splitIntoShortBubbles(`guide-${idx}`, `خوبه پس ${core}`, ['خوبه']);
  }

  if (input.event === 'correct') {
    const streak = input.streak ?? 0;
    let lead: string;
    if (input.recoveredFromMistake) {
      lead = RECOVERY_LEADS[idx % RECOVERY_LEADS.length];
    } else if (streak >= 2) {
      lead = STREAK_LEADS[idx % STREAK_LEADS.length];
    } else {
      lead = CORRECT_LEADS[idx % CORRECT_LEADS.length];
    }

    const cleanCore = core.replace(/[.!؟،,;؛:«»"'()]+$/g, '').trim();
    const xpSentence =
      typeof input.xpGained === 'number' && input.xpGained > 0
        ? streak >= 2
          ? `با ${toFa(streak)} پاسخ پیاپی ${toFa(input.xpGained)} امتیاز گرفتی.`
          : `${toFa(input.xpGained)} امتیاز گرفتی.`
        : '';

    const bubbles = splitIntoShortBubbles(
      `ok-${idx}`,
      `${lead} ${cleanCore}.`,
      streak >= 2 ? ['پیاپی'] : ['درست']
    );

    if (xpSentence && input.nextPrompt?.trim()) {
      bubbles.push({
        id: `ok-${idx}-next`,
        text: finalizeBubbleText(`${xpSentence} حالا ${input.nextPrompt.trim()}`),
        keywords: ['حالا']
      });
    } else if (input.nextPrompt?.trim()) {
      bubbles.push({
        id: `ok-${idx}-next`,
        text: finalizeBubbleText(`حالا ${input.nextPrompt.trim()}`),
        keywords: ['حالا']
      });
    } else if (xpSentence) {
      const last = bubbles[bubbles.length - 1];
      const merged = finalizeBubbleText(`${last.text} ${xpSentence}`);
      if (merged.split(/\s+/u).length <= 15) {
        bubbles[bubbles.length - 1] = { ...last, text: merged };
      } else {
        bubbles.push({ id: `ok-${idx}-xp`, text: finalizeBubbleText(xpSentence) });
      }
    }

    return bubbles;
  }

  if (input.event === 'stage_complete') {
    return splitIntoShortBubbles(`complete-${idx}`, `این ایستگاه با موفقیت تموم شد پس ${core}`);
  }

  // victory
  const xpStr = toFa(input.totalXp ?? 0);
  const starsStr = toFa(input.stars ?? 3);
  const rank = input.rankTitle ?? 'فرماندهٔ طلایی الگوها';
  return [
    {
      id: 'victory-0',
      text: finalizeBubbleText(
        input.timedOut
          ? `زمان آزمون افزایش سطح تموم شد پس با ${xpStr} امتیاز و ${starsStr} ستاره عنوان ${rank} رو گرفتی.`
          : `آزمون افزایش سطح رو عالی تموم کردی پس با ${xpStr} امتیاز و ${starsStr} ستاره عنوان ${rank} رو گرفتی.`
      ),
      keywords: [rank]
    },
    {
      id: 'victory-1',
      text: finalizeBubbleText(
        'برای مرور نکته‌های جذاب کارت‌های پایین رو باز کن و هر وقت خواستی برای سطح بالاتر دوباره بازی کن.'
      ),
      keywords: ['سطح بالاتر', 'دوباره']
    }
  ];
}

// Legacy string adapter & readability audit support
export function composeDelphiLineWithAudit(input: DelphiNarrativeInput): TextGuardResult {
  const bubbles = composeDelphiBubbles(input);
  const combinedText = bubbles.map((b) => b.text).join(' ');
  const rawBase = `${input.coreText} ${input.nextPrompt ?? ''}`.trim() || combinedText;
  const guardBefore = evaluateReadabilityForKids(rawBase);
  const lexiconPass = simplifyDelphiHardWordsAndMetaphors(rawBase);
  const textGuardPass = simplifyAndGuardDelphiText(lexiconPass.text, {
    stripBubblePunctuation: true
  });
  const guardAfter = evaluateReadabilityForKids(combinedText);

  const mergedReplacements = [
    ...lexiconPass.detectedTerms.map(({ term, synonym }) => ({
      from: term,
      to: synonym,
      reason: 'جایگزینی واژه دشوار با معادل ساده ۸ تا ۱۳ سال'
    })),
    ...textGuardPass.replacementsApplied
  ];

  return {
    text: combinedText,
    replacementsApplied: mergedReplacements,
    grammarFixesApplied: textGuardPass.grammarFixesApplied,
    reportBefore: guardBefore,
    reportAfter: guardAfter
  };
}

export function composeDelphiLine(input: DelphiNarrativeInput): string {
  return composeDelphiBubbles(input)
    .map((b) => b.text)
    .join(' ');
}

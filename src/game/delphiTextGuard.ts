// Persian NLP & Readability Guardrail for Delphy's dialogue (ages 8-13).
// Performs Unicode-safe Persian tokenization, ambiguous/complex term replacement,
// passive/formal grammar simplification, and sentence-length balancing before render.

export interface LexiconReplacementRule {
  id: string;
  complexTerm: string;
  simpleSynonym: string;
  pattern: RegExp;
  reason: string;
}

export interface GrammarRule {
  id: string;
  pattern: RegExp;
  replacement: string;
  label: string;
}

export type GrammarIssueKind =
  | 'complex_vocabulary'
  | 'formal_grammar'
  | 'sentence_too_long'
  | 'dense_clauses';

export interface ReadabilityReport {
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  maxWordsInSentence: number;
  longWordRatio: number;
  complexTermsFound: string[];
  formalPhrasesFound: string[];
  issues: GrammarIssueKind[];
  simplicityScore: number; // 0..100 (higher = clearer and simpler for ages 8-13)
  ageBandFit: 'مناسب ۸ تا ۱۰ سال' | 'مناسب ۱۱ تا ۱۳ سال' | 'نیاز به ساده‌سازی';
}

export interface TextGuardResult {
  text: string;
  replacementsApplied: { from: string; to: string; reason: string }[];
  grammarFixesApplied: string[];
  reportBefore: ReadabilityReport;
  reportAfter: ReadabilityReport;
}

// Unicode-aware Persian boundary helper (JS \b only matches ASCII \w)
function persianPhraseRegex(phrase: string): RegExp {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}\\u200c])${escaped}(?![\\p{L}\\p{N}\\u200c])`, 'gu');
}

// Curated dictionary of jargon, ambiguous metaphors, or heavy academic words
// mapped to literal, kid-friendly Persian synonyms for ages 8-13.
export const KID_SIMPLE_LEXICON: LexiconReplacementRule[] = [
  {
    id: 'lex-freq',
    complexTerm: 'فرکانس',
    simpleSynonym: 'تندیِ موج',
    pattern: persianPhraseRegex('فرکانس'),
    reason: 'واژهٔ تخصصی فیزیک برای ۸–۱۰ ساله‌ها مبهم است'
  },
  {
    id: 'lex-agent',
    complexTerm: 'عامل',
    simpleSynonym: 'ربات بازیکن',
    pattern: persianPhraseRegex('عامل'),
    reason: 'کلمهٔ «عامل» در فارسی روزمرهٔ کودک معنای روشنی ندارد'
  },
  {
    id: 'lex-continuous',
    complexTerm: 'پیوسته‌ست',
    simpleSynonym: 'عددی و اندازه‌گیریه',
    pattern: persianPhraseRegex('پیوسته‌ست'),
    reason: 'مفهوم پیوسته در ریاضی برای دورهٔ ابتدایی دشوار است'
  },
  {
    id: 'lex-continuous-base',
    complexTerm: 'پیوسته',
    simpleSynonym: 'عددی',
    pattern: persianPhraseRegex('پیوسته'),
    reason: 'واژهٔ پیوسته برای کودک ابهام دارد'
  },
  {
    id: 'lex-distinct',
    complexTerm: 'مجزا',
    simpleSynonym: 'جدا از هم',
    pattern: persianPhraseRegex('مجزا'),
    reason: 'معادل محاوره‌ای «جدا از هم» فوری فهمیده می‌شود'
  },
  {
    id: 'lex-definite',
    complexTerm: 'قطعی',
    simpleSynonym: 'ثابت',
    pattern: persianPhraseRegex('قطعی'),
    reason: '«ثابت» ملموس‌تر از «قطعی» است'
  },
  {
    id: 'lex-algorithm',
    complexTerm: 'الگوریتم',
    simpleSynonym: 'روش کارِ مدل',
    pattern: persianPhraseRegex('الگوریتم'),
    reason: 'واژهٔ فنی که با «روش کار مدل» روشن‌تر می‌شود'
  },
  {
    id: 'lex-optimize',
    complexTerm: 'بهینه‌سازی',
    simpleSynonym: 'بهتر کردن',
    pattern: persianPhraseRegex('بهینه‌سازی'),
    reason: 'ساده‌سازی مصدر سنگین فنی'
  },
  {
    id: 'lex-parameter',
    complexTerm: 'پارامتر',
    simpleSynonym: 'تنظیمات',
    pattern: persianPhraseRegex('پارامتر'),
    reason: 'واژهٔ تخصصی برنامه‌نویسی'
  },
  {
    id: 'lex-estimate',
    complexTerm: 'تخمین',
    simpleSynonym: 'حدس نزدیک',
    pattern: persianPhraseRegex('تخمین'),
    reason: '«حدس نزدیک» برای کودک قابل درک‌تر است'
  },
  {
    id: 'lex-system',
    complexTerm: 'سیستم',
    simpleSynonym: 'برنامه',
    pattern: persianPhraseRegex('سیستم'),
    reason: '«برنامه» برای مخاطب ۸–۱۳ سال آشناتر است'
  },
  {
    id: 'lex-problem',
    complexTerm: 'مسئلهٔ',
    simpleSynonym: 'کارِ',
    pattern: persianPhraseRegex('مسئلهٔ'),
    reason: 'جلوگیری از لحن کتاب درسی'
  },
  {
    id: 'lex-branch',
    complexTerm: 'شاخه',
    simpleSynonym: 'روش',
    pattern: persianPhraseRegex('شاخه'),
    reason: 'استعارهٔ شاخه ممکن است حواس کودک را پرت کند'
  },
  {
    id: 'lex-supervisor',
    complexTerm: 'ناظر',
    simpleSynonym: 'راهنما',
    pattern: persianPhraseRegex('ناظر'),
    reason: 'یکپارچگی اصطلاح آموزشی بدون واژهٔ مبهم'
  },
  {
    id: 'lex-lantern',
    complexTerm: 'فانوس',
    simpleSynonym: 'روش کار',
    pattern: persianPhraseRegex('فانوس'),
    reason: 'حذف استعارهٔ گمراه‌کننده'
  },
  {
    id: 'lex-analysis',
    complexTerm: 'تحلیل',
    simpleSynonym: 'بررسی',
    pattern: persianPhraseRegex('تحلیل'),
    reason: '«بررسی» روشن‌تر و ملموس‌تر است'
  },
  {
    id: 'lex-criteria',
    complexTerm: 'معیار',
    simpleSynonym: 'نشانه',
    pattern: persianPhraseRegex('معیار'),
    reason: 'واژهٔ «نشانه» ملموس‌تر از «معیار» است'
  },
  {
    id: 'lex-threshold',
    complexTerm: 'آستانه',
    simpleSynonym: 'مرز عدد',
    pattern: persianPhraseRegex('آستانه'),
    reason: 'مفهوم «مرز عدد» بدون ابهام است'
  },
  {
    id: 'lex-average',
    complexTerm: 'میانگین',
    simpleSynonym: 'نقطهٔ وسط',
    pattern: persianPhraseRegex('میانگین'),
    reason: '«نقطهٔ وسط» در بازی خوشه‌بندی دیداری‌تر است'
  },
  {
    id: 'lex-feature-intrinsic',
    complexTerm: 'ذاتی',
    simpleSynonym: 'اصلیِ خودِ موضوع',
    pattern: persianPhraseRegex('ذاتی'),
    reason: '«اصلی خودِ موضوع» کاملاً ملموس است'
  }
];

// Grammar rules simplifying stiff/formal structures to active conversational Persian
export const GRAMMAR_SIMPLIFICATION_RULES: GrammarRule[] = [
  {
    id: 'gram-passive-shavad',
    pattern: persianPhraseRegex('می‌شود'),
    replacement: 'میشه',
    label: 'تبدیل فعل رسمی «می‌شود» به گفتاریِ روان «میشه»'
  },
  {
    id: 'gram-passive-gardad',
    pattern: persianPhraseRegex('می‌گردد'),
    replacement: 'میشه',
    label: 'حذف فعل اداری «می‌گردد»'
  },
  {
    id: 'gram-mishe-unified',
    pattern: persianPhraseRegex('می‌شه'),
    replacement: 'میشه',
    label: 'یکدست‌سازی «می‌شه» به «میشه»'
  },
  {
    id: 'gram-passive-ast',
    pattern: persianPhraseRegex('عبارت است از'),
    replacement: 'یعنی',
    label: 'جایگزینی عبارت رسمی «عبارت است از» با «یعنی»'
  },
  {
    id: 'gram-cherake',
    pattern: persianPhraseRegex('چراکه'),
    replacement: 'چون',
    label: 'ساده‌سازی حرف ربط کتابی «چراکه» به «چون»'
  },
  {
    id: 'gram-azonja',
    pattern: persianPhraseRegex('از اونجایی که'),
    replacement: 'چون',
    label: 'کوتاه کردن عبارت طولانی «از اونجایی که»'
  },
  {
    id: 'gram-azonja-formal',
    pattern: persianPhraseRegex('از آنجایی که'),
    replacement: 'چون',
    label: 'کوتاه کردن عبارت کتابی «از آنجایی که»'
  },
  {
    id: 'gram-onvan',
    pattern: persianPhraseRegex('به‌عنوان'),
    replacement: 'مثلِ',
    label: 'تبدیل «به‌عنوان» به «مثلِ»'
  },
  {
    id: 'gram-mored-nazar',
    pattern: persianPhraseRegex('مورد نظر ما'),
    replacement: 'که می‌خوایم',
    label: 'ساده‌سازی عبارت رسمی «مورد نظر ما»'
  },
  {
    id: 'gram-ast-end',
    pattern: persianPhraseRegex('است'),
    replacement: 'هست',
    label: 'لحن صمیمی‌تر برای کودک ۸ تا ۱۳ سال'
  }
];

export function tokenizePersianWords(text: string): string[] {
  const matches = text.match(/[\p{L}\p{N}\u200c]+/gu);
  return matches ? matches.filter((t) => t.replace(/\u200c/g, '').length > 0) : [];
}

export function splitPersianSentences(text: string): string[] {
  return text
    .split(/[.!؟؛]+/u)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Breaks overlong clauses (> 20 words) cleanly at natural discourse junctions
export function balanceLongSentences(text: string, maxWordsPerSentence = 20): string {
  const rawChunks = text
    .split(/([.!؟])/u)
    .reduce<string[]>((acc, part, idx) => {
      if (idx % 2 === 0) acc.push(part);
      else if (acc.length > 0) acc[acc.length - 1] += part;
      return acc;
    }, [])
    .map((s) => s.trim())
    .filter(Boolean);

  const balanced = rawChunks.map((sentence) => {
    const words = tokenizePersianWords(sentence);
    if (words.length <= maxWordsPerSentence) return sentence;

    // Look for a safe semicolon or connector boundary near the middle
    if (sentence.includes('؛')) {
      return sentence.replace(/\s*؛\s*/u, '. ');
    }
    const splitMatch = sentence.match(/\s+(اما|ولی|و بعد|حالا)\s+/u);
    if (splitMatch && splitMatch.index && splitMatch.index > 18) {
      const idx = splitMatch.index;
      const before = sentence.slice(0, idx).trim().replace(/[،؛]+$/u, '');
      const after = sentence.slice(idx).trim();
      return `${before}. ${after}`;
    }
    return sentence;
  });

  return balanced.join(' ').replace(/\s{2,}/g, ' ').trim();
}

export function evaluateReadabilityForKids(text: string): ReadabilityReport {
  const words = tokenizePersianWords(text);
  const sentences = splitPersianSentences(text);
  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  const avgWordsPerSentence = Number((wordCount / sentenceCount).toFixed(1));
  const maxWordsInSentence = sentences.reduce(
    (max, s) => Math.max(max, tokenizePersianWords(s).length),
    0
  );

  // Exclude known lesson nouns like دسته‌بندی/خوشه‌بندی/یادگیری from penalty
  const lessonAllowList = new Set([
    'یادگیری',
    'دسته‌بندی',
    'خوشه‌بندی',
    'رگرسیون',
    'زیردریایی',
    'برچسب‌دار',
    'هوشمندانه',
    'مأموریت'
  ]);
  const longWords = words.filter((w) => {
    const clean = w.replace(/\u200c/g, '');
    return clean.length >= 9 && !lessonAllowList.has(w);
  });
  const longWordRatio = wordCount > 0 ? Number((longWords.length / wordCount).toFixed(2)) : 0;

  const complexTermsFound = KID_SIMPLE_LEXICON.filter((rule) => {
    rule.pattern.lastIndex = 0;
    return rule.pattern.test(text);
  }).map((r) => r.complexTerm);

  const formalPhrasesFound = GRAMMAR_SIMPLIFICATION_RULES.filter((rule) => {
    rule.pattern.lastIndex = 0;
    return rule.pattern.test(text);
  }).map((r) => r.label);

  const issues: GrammarIssueKind[] = [];
  if (complexTermsFound.length > 0) issues.push('complex_vocabulary');
  if (formalPhrasesFound.length > 0) issues.push('formal_grammar');
  if (maxWordsInSentence > 22) issues.push('sentence_too_long');
  if (avgWordsPerSentence > 18) issues.push('dense_clauses');

  let score = 100;
  score -= complexTermsFound.length * 14;
  score -= formalPhrasesFound.length * 7;
  score -= Math.max(0, maxWordsInSentence - 18) * 2.5;
  score -= Math.round(longWordRatio * 25);
  const simplicityScore = Math.max(0, Math.min(100, Math.round(score)));

  const ageBandFit =
    simplicityScore >= 85 && maxWordsInSentence <= 18
      ? 'مناسب ۸ تا ۱۰ سال'
      : simplicityScore >= 65
        ? 'مناسب ۱۱ تا ۱۳ سال'
        : 'نیاز به ساده‌سازی';

  return {
    wordCount,
    sentenceCount,
    avgWordsPerSentence,
    maxWordsInSentence,
    longWordRatio,
    complexTermsFound,
    formalPhrasesFound,
    issues,
    simplicityScore,
    ageBandFit
  };
}

export function sanitizeKidBubblePunctuation(text: string): string {
  const cleaned = text
    .replace(/[«»"'()]/g, ' ')
    .replace(/[،,;؛:]+/g, ' ')
    .replace(/\s+([.!؟])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (!cleaned) return '';
  return /[.!؟]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

export function simplifyAndGuardDelphiText(
  rawText: string,
  options?: { stripBubblePunctuation?: boolean }
): TextGuardResult {
  const reportBefore = evaluateReadabilityForKids(rawText);
  let next = rawText.trim();
  const replacementsApplied: { from: string; to: string; reason: string }[] = [];
  const grammarFixesApplied: string[] = [];

  for (const rule of KID_SIMPLE_LEXICON) {
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(next)) {
      rule.pattern.lastIndex = 0;
      next = next.replace(rule.pattern, rule.simpleSynonym);
      replacementsApplied.push({
        from: rule.complexTerm,
        to: rule.simpleSynonym,
        reason: rule.reason
      });
    }
  }

  for (const gRule of GRAMMAR_SIMPLIFICATION_RULES) {
    gRule.pattern.lastIndex = 0;
    if (gRule.pattern.test(next)) {
      gRule.pattern.lastIndex = 0;
      next = next.replace(gRule.pattern, gRule.replacement);
      grammarFixesApplied.push(gRule.label);
    }
  }

  next = balanceLongSentences(next, 20);
  next = next.replace(/\s+([.!؟،؛])/g, '$1').replace(/\s{2,}/g, ' ').trim();
  if (options?.stripBubblePunctuation) {
    next = sanitizeKidBubblePunctuation(next);
  }

  const reportAfter = evaluateReadabilityForKids(next);

  return {
    text: next,
    replacementsApplied,
    grammarFixesApplied,
    reportBefore,
    reportAfter
  };
}

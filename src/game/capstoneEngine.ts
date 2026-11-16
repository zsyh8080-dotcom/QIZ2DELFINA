// Pure, deterministic game engine and Island 2 summary curriculum for Delfina Final Mission

export type GamePhase = 'title' | 'playing' | 'paused' | 'victory';
export type StageId = 'cinema' | 'features' | 'supervised' | 'clustering' | 'synthesis';

export interface StageMeta {
  id: StageId;
  index: number;
  shortLabel: string;
  title: string;
  missionOrigin: string;
  introLine: string;
}

export const STAGES: StageMeta[] = [
  {
    id: 'cinema',
    index: 0,
    shortLabel: 'قانون یا یادگیری ماشین',
    title: 'ایستگاه ۱ · قانون‌نویسی یا یادگیری ماشین',
    missionOrigin: 'تشخیص قانون ساده در برابر یادگیری از مثال',
    introLine:
      'هر کارت رو بخون و بین قانون‌نویسی و یادگیری ماشین انتخاب کن.'
  },
  {
    id: 'features',
    index: 1,
    shortLabel: 'داده و سرنخ',
    title: 'ایستگاه ۲ · داده و سرنخ‌های اصلی',
    missionOrigin: 'تشخیص نوع داده و پیدا کردن سرنخ روی صحنه',
    introLine:
      'اول نوع داده رو انتخاب کن و بعد روی ۲ سرنخ اصلی توی تصویر بزن.'
  },
  {
    id: 'supervised',
    index: 2,
    shortLabel: 'با نظارت',
    title: 'ایستگاه ۳ · یادگیری با نظارت',
    missionOrigin: 'یادگیری با مثال‌های برچسب‌دار و کلینیک مرجان',
    introLine:
      'وقتی مثال‌ها جواب آماده دارن مدل باید گروه انتخاب کنه یا عدد حدس بزنه؟'
  },
  {
    id: 'clustering',
    index: 3,
    shortLabel: 'بدون نظارت',
    title: 'ایستگاه ۴ · یادگیری بدون نظارت',
    missionOrigin: 'خوشه‌بندی خودکار داده‌های بدون برچسب',
    introLine:
      'اینجا هیچ اسمی نداریم پس روی نقشه ۲ مرکز بذار تا هر نقطه بره کنار گروه نزدیکش.'
  },
  {
    id: 'synthesis',
    index: 4,
    shortLabel: 'آزمون نهایی',
    title: 'ایستگاه ۵ · آزمون نهایی',
    missionOrigin: 'جمع‌بندی روش‌های یادگیری ماشین در موقعیت‌های واقعی',
    introLine:
      'توی آزمون نهایی ۳ داستان کوتاه رو بخون و روش درست یادگیری ماشین رو انتخاب کن.'
  }
];

export function toFa(value: number | string): string {
  const digits = '۰۱۲۳۴۵۶۷۸۹';
  return String(value).replace(/\d/g, (d) => digits[Number(d)]);
}

export const MISSION_DURATION_SECONDS = 300;

export function formatElapsedTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${toFa(String(mins).padStart(2, '0'))}:${toFa(String(secs).padStart(2, '0'))}`;
}

// Seeded PRNG (Mulberry32) so tests are deterministic and replays always shuffle freshly
export function createRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickShuffled<T>(items: readonly T[], count: number, seed: number): T[] {
  const rng = createRng(seed);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

// ---------------- Stage 1: Rule-Based vs Machine Learning ----------------
export type CinemaMode = 'rule' | 'ml';

export interface CinemaScenario {
  id: string;
  icon: string;
  task: string;
  answer: CinemaMode;
  okFeedback: string;
  hintFeedback: string;
}

export const CINEMA_POOL: CinemaScenario[] = [
  {
    id: 'c1',
    icon: '🎟️',
    task: 'اگر قد مهمان زیر ۱۲۰ سانتی‌متر بود دستگاه بلیت کودک چاپ کنه.',
    answer: 'rule',
    okFeedback: 'شرط قد رو تو مینویسی و دستگاه دقیقاً همون قانون اگر و آنگاه رو اجرا میکنه.',
    hintFeedback: 'اینجا عدد قد کاملاً روشنه پس یک دستور ثابت کافیه.'
  },
  {
    id: 'c2',
    icon: '🎬',
    task: 'از روی فیلم‌هایی که سارا قبلاً دوست داشته فیلم تازه پیشنهاد بده.',
    answer: 'ml',
    okFeedback: 'انتخاب‌های سارا داده هستن و مدل از شباهتشون پیشنهاد نزدیک حدس میزنه حتی اگه سلیقه‌ش عوض میشه.',
    hintFeedback: 'سلیقهٔ آدم‌ها فرمول ثابت نداره پس مدل از مثال‌های قبلی سارا الگو میگیره.'
  },
  {
    id: 'c3',
    icon: '🌡️',
    task: 'هر وقت دمای آب آکواریوم از ۳۰ درجه بیشتر شد زنگ هشدار بزنه.',
    answer: 'rule',
    okFeedback: 'این دستور رو خودمون میذاریم و دستگاه فقط عدد دما رو با ۳۰ مقایسه میکنه.',
    hintFeedback: 'مقایسه عدد دما با ۳۰ یک قانون ساده هست و نیازی به مثال نداره.'
  },
  {
    id: 'c4',
    icon: '🐬',
    task: 'توی عکس‌های واقعی دریا تشخیص بده کدوم دلفینه و کدوم کوسه.',
    answer: 'ml',
    okFeedback: 'عکس‌ها نور و زاویهٔ متفاوتی دارن برای همین مدل با دیدن عکس‌های مثال الگو رو یاد میگیره و حدس میزنه.',
    hintFeedback: 'زاویهٔ عکس همیشه فرق میکنه پس یک قانون ساده کافی نیست.'
  },
  {
    id: 'c5',
    icon: '🗣️',
    task: 'صدای بچه‌ها رو بشنوه و بفهمه دارن میگن بپر یا بایست.',
    answer: 'ml',
    okFeedback: 'لحن صدای هر بچه فرق داره برای همین مدل از نمونه‌های صدا شباهت‌ها رو یاد میگیره.',
    hintFeedback: 'صدای آدم‌ها با هم فرق داره پس یادگیری ماشین از نمونه‌ها کمک میگیره.'
  },
  {
    id: 'c6',
    icon: '⭐',
    task: 'وقتی امتیاز بازیکن به ۱۰۰ رسید قفل صندوقچه طلایی باز میشه.',
    answer: 'rule',
    okFeedback: 'وقتی شرط دقیقاً عدد ۱۰۰ باشه دستگاه همون دستور اگر و آنگاه رو بی‌کم‌وکاست اجرا میکنه.',
    hintFeedback: 'این فقط مقایسهٔ امتیاز با عدد ۱۰۰ هست پس کدوم روش مناسبه؟'
  }
];

// ---------------- Stage 2: Data Types & Intrinsic Features ----------------
export type DataKind = 'image' | 'audio' | 'text' | 'number';

export interface FeatureHotspot {
  xPct: number; // percentage 10..90 matching the SVG artwork object center
  yPct: number; // percentage 15..85
  shortTag: string; // concise 2-3 word label for kids inside the scene
}

export interface FeatureChip {
  id: string;
  label: string;
  intrinsic: boolean; // true = belongs to the subject itself, false = misleading background/noise
  reason: string;
  hotspot: FeatureHotspot;
}

export interface FeatureCase {
  id: string;
  badge: string;
  title: string;
  prompt: string;
  correctType: DataKind;
  typeReason: string;
  chips: FeatureChip[];
}

export const DATA_TYPE_LABELS: { id: DataKind; label: string; icon: string }[] = [
  { id: 'image', label: 'تصویر', icon: '🖼️' },
  { id: 'audio', label: 'صوت', icon: '🔊' },
  { id: 'text', label: 'متن', icon: '💬' },
  { id: 'number', label: 'عدد', icon: '🔢' }
];

export const FEATURE_POOL: FeatureCase[] = [
  {
    id: 'f1',
    badge: 'تشخیص میوه',
    title: 'جدا کردن سیب سالم از لکه‌دار',
    prompt: 'دوربین از سبد میوه عکس گرفته.',
    correctType: 'image',
    typeReason: 'چون دوربین عکس گرفته پس نوع داده تصویر هست.',
    chips: [
      {
        id: 'f1a',
        label: 'لکه و رنگ پوست',
        intrinsic: true,
        reason: 'رنگ و لکهٔ روی پوست وضعیتِ خودِ سیب رو نشون میده',
        hotspot: { xPct: 62, yPct: 58, shortTag: 'لکهٔ پوست' }
      },
      {
        id: 'f1b',
        label: 'شکل گرد میوه',
        intrinsic: true,
        reason: 'شکل و فرورفتگیِ میوه مستقیماً برای خودِ میوه هست',
        hotspot: { xPct: 38, yPct: 58, shortTag: 'شکل میوه' }
      },
      {
        id: 'f1c',
        label: 'رومیزی زیر سبد',
        intrinsic: false,
        reason: 'رومیزی مال خود سیب نیست و رنگش میوه رو عوض نمیکنه',
        hotspot: { xPct: 81, yPct: 79, shortTag: 'رومیزی' }
      },
      {
        id: 'f1d',
        label: 'ساعت دیواری',
        intrinsic: false,
        reason: 'ساعت روی دیوار نشون نمیده سیب سالمه یا نه',
        hotspot: { xPct: 16, yPct: 28, shortTag: 'ساعت دیوار' }
      }
    ]
  },
  {
    id: 'f2',
    badge: 'تشخیص صدا',
    title: 'تشخیص آواز نهنگ از قایق',
    prompt: 'میکروفون زیر آب صدا ضبط کرده.',
    correctType: 'audio',
    typeReason: 'میکروفون موج صدا ضبط کرده پس نوع داده صوت هست.',
    chips: [
      {
        id: 'f2a',
        label: 'زیر و بمی موج صدا',
        intrinsic: true,
        reason: 'زیر و بمی موج صدای نهنگ با موتور قایق فرق داره',
        hotspot: { xPct: 51, yPct: 42, shortTag: 'زیر و بمی موج' }
      },
      {
        id: 'f2b',
        label: 'ریتم صدای نهنگ',
        intrinsic: true,
        reason: 'الگوی ریتم صدای نهنگ ویژگی اصلیِ خودِ صداست',
        hotspot: { xPct: 28, yPct: 56, shortTag: 'ریتم آواز' }
      },
      {
        id: 'f2c',
        label: 'رنگ بدنه میکروفون',
        intrinsic: false,
        reason: 'رنگ بدنهٔ میکروفون هیچ ربطی به صدای ضبط‌شده نداره',
        hotspot: { xPct: 69, yPct: 54, shortTag: 'رنگ میکروفون' }
      },
      {
        id: 'f2d',
        label: 'تقویم روی دیوار',
        intrinsic: false,
        reason: 'روزِ تقویم صدای نهنگ رو عوض نمیکنه و بی‌ربطه',
        hotspot: { xPct: 86, yPct: 27, shortTag: 'تقویم' }
      }
    ]
  },
  {
    id: 'f3',
    badge: 'بررسی پیام',
    title: 'پیدا کردن پیامِ تبلیغاتی',
    prompt: 'جعبهٔ پیام‌ها پر از جمله‌های نوشته‌شده‌ست.',
    correctType: 'text',
    typeReason: 'پیام‌ها از کلمه و جمله ساخته شدن پس نوع داده متن هست.',
    chips: [
      {
        id: 'f3a',
        label: 'کلمه‌های تبلیغی مثل جایزه',
        intrinsic: true,
        reason: 'کلمه‌های توی خودِ پیام سرنخ اصلیِ متن هستن',
        hotspot: { xPct: 45, yPct: 39, shortTag: 'متن پیام' }
      },
      {
        id: 'f3b',
        label: 'لینک مشکوک داخل پیام',
        intrinsic: true,
        reason: 'لینک‌های عجیب توی متن الگوی پیام‌های تبلیغاتی هستن',
        hotspot: { xPct: 54, yPct: 61, shortTag: 'لینک داخل متن' }
      },
      {
        id: 'f3c',
        label: 'رنگ قاب گوشی',
        intrinsic: false,
        reason: 'رنگ قاب گوشی هیچ ربطی به نوشتهٔ پیام نداره',
        hotspot: { xPct: 24, yPct: 54, shortTag: 'قاب گوشی' }
      },
      {
        id: 'f3d',
        label: 'شارژ باتری تبلت',
        intrinsic: false,
        reason: 'درصد شارژ باتری ویژگیِ متن پیام نیست',
        hotspot: { xPct: 68, yPct: 24, shortTag: 'شارژ باتری' }
      }
    ]
  },
  {
    id: 'f4',
    badge: 'هواشناسی دریا',
    title: 'پیش‌بینی موجِ طوفانی',
    prompt: 'حسگرهای هواشناسی سرعت باد ۴۵ و فشار هوا ۹۹۰ رو با عدد ثبت کردن.',
    correctType: 'number',
    typeReason: 'سرعت باد و فشار هوا مقدار عددی هستن پس نوع داده عدد هست.',
    chips: [
      {
        id: 'f4a',
        label: 'عدد سرعت باد',
        intrinsic: true,
        reason: 'تندیِ باد مستقیم موج‌های بلند دریا رو میسازه',
        hotspot: { xPct: 24, yPct: 46, shortTag: 'سرعت باد' }
      },
      {
        id: 'f4b',
        label: 'عدد فشار هوا',
        intrinsic: true,
        reason: 'پایین اومدن عدد فشار هوا نشانهٔ نزدیک شدن طوفانه',
        hotspot: { xPct: 76, yPct: 46, shortTag: 'فشار هوا' }
      },
      {
        id: 'f4c',
        label: 'اسم کاپیتان قایق',
        intrinsic: false,
        reason: 'اسم کاپیتان باعث موج و طوفان نمیشه',
        hotspot: { xPct: 50, yPct: 84, shortTag: 'اسم کاپیتان' }
      },
      {
        id: 'f4d',
        label: 'رنگ پرچم روی قایق',
        intrinsic: false,
        reason: 'رنگ پرچم روی دکل قایق آب‌وهوا رو تغییر نمیده',
        hotspot: { xPct: 55, yPct: 48, shortTag: 'پرچم قایق' }
      }
    ]
  }
];

// ---------------- Stage 3: Supervised Learning (Classification vs Regression) ----------------
export type SupervisedTaskKind = 'classification' | 'regression';

export interface SupervisedScenario {
  id: string;
  icon: string;
  title: string;
  sampleNote: string;
  trainingSamples: { icon: string; tag: string }[];
  liveOutputPreview: string;
  answer: SupervisedTaskKind;
  okFeedback: string;
  hintFeedback: string;
}

export const SUPERVISED_POOL: SupervisedScenario[] = [
  {
    id: 's1',
    icon: '🐠',
    title: 'با دیدن عکس بگه دلقک‌ماهی هست یا ستاره دریایی',
    sampleNote: 'مثال برچسب‌دار با عکس و اسم گروه',
    trainingSamples: [
      { icon: '🐠', tag: 'دلقک‌ماهی' },
      { icon: '⭐', tag: 'ستاره دریایی' }
    ],
    liveOutputPreview: 'حدس مدل دلقک‌ماهی ۹۳٪',
    answer: 'classification',
    okFeedback: 'وقتی مدل بین چند گروه مشخص انتخاب می‌کنه اسمش دسته‌بندی هست.',
    hintFeedback: 'جواب این سؤال یک عدد نیست بلکه انتخاب اسم یک گروهه.'
  },
  {
    id: 's2',
    icon: '🚌',
    title: 'حدس بزنه اتوبوس دریایی چند دقیقه دیگه می‌رسه',
    sampleNote: 'مثال برچسب‌دار با مسیر و عدد دقیقه',
    trainingSamples: [
      { icon: '🚌', tag: '۱۲ دقیقه' },
      { icon: '🚌', tag: '۱۹ دقیقه' }
    ],
    liveOutputPreview: 'حدس عددی مدل ۱۶ دقیقه',
    answer: 'regression',
    okFeedback: 'وقتی خروجی مدل یک عدد نزدیک مثل ۱۶ دقیقه باشه بهش می‌گیم رگرسیون.',
    hintFeedback: 'جواب این سؤال یک عدد و دقیقه است نه اسم یک گروه.'
  },
  {
    id: 's3',
    icon: '♻️',
    title: 'زباله رو توی سطل پلاستیک یا جلبک بذاره',
    sampleNote: 'مثال برچسب‌دار با عکس و برچسب سطل',
    trainingSamples: [
      { icon: '🧴', tag: 'پلاستیک' },
      { icon: '🌿', tag: 'جلبک' }
    ],
    liveOutputPreview: 'حدس مدل پلاستیک ۹۶٪',
    answer: 'classification',
    okFeedback: 'گذاشتن هر نمونه توی سطل برچسب‌دار درست یعنی دسته‌بندی.',
    hintFeedback: 'اینجا مدل برچسب درست رو از بین دو سطل انتخاب می‌کنه.'
  },
  {
    id: 's4',
    icon: '🌡️',
    title: 'حدس بزنه دمای آب فردا چند درجه سانتی‌گراد میشه',
    sampleNote: 'مثال برچسب‌دار با دمای عددی روزهای قبل',
    trainingSamples: [
      { icon: '🌡️', tag: '۲۳ درجه' },
      { icon: '🌡️', tag: '۲۷ درجه' }
    ],
    liveOutputPreview: 'حدس عددی مدل ۲۵ درجه',
    answer: 'regression',
    okFeedback: 'حدس زدن مقدار عددی دما روی عقربه کار رگرسیون هست.',
    hintFeedback: 'خروجی اینجا یک عدد اندازه‌گیری شده با درجه هست.'
  },
  {
    id: 's5',
    icon: '🎵',
    title: 'حال‌وهوای آهنگ رو انتخاب کنه شاد یا آرام',
    sampleNote: 'مثال برچسب‌دار با آهنگ و اسم حال‌وهوا',
    trainingSamples: [
      { icon: '🎵', tag: 'شاد' },
      { icon: '🎶', tag: 'آرام' }
    ],
    liveOutputPreview: 'حدس مدل آهنگ شاد ۹۱٪',
    answer: 'classification',
    okFeedback: 'انتخاب بین برچسب شاد یا آرام همون دسته‌بندی هست.',
    hintFeedback: 'اینجا عدد حدس نمی‌زنیم بلکه یک گروه انتخاب می‌کنیم.'
  },
  {
    id: 's6',
    icon: '🐚',
    title: 'حدس بزنه صدف بزرگ چند گرم وزن داره',
    sampleNote: 'مثال برچسب‌دار با اندازه صدف و وزن به گرم',
    trainingSamples: [
      { icon: '🐚', tag: '۴۵ گرم' },
      { icon: '🐚', tag: '۸۰ گرم' }
    ],
    liveOutputPreview: 'حدس عددی مدل ۶۴ گرم',
    answer: 'regression',
    okFeedback: 'حدس زدن مقدار وزن به گرم کار رگرسیون هست.',
    hintFeedback: 'وزن یک عدد و اندازه هست پس کدوم روش عدد حدس می‌زنه؟'
  }
];

// Interactive Mini-Trainer for Stage 3b:
// Kids apply supervised learning directly: (1) Classify a new fish from labeled examples, (2) Predict a number on a growth chart
export interface FishLabExample {
  id: string;
  variant: 'clown' | 'puffer';
  size: 'sm' | 'md';
  label: 'دلقک‌ماهی' | 'بادکنک‌ماهی';
  trait: string;
}

export const FISH_LAB_EXAMPLES: FishLabExample[] = [
  { id: 'fl1', variant: 'clown', size: 'md', label: 'دلقک‌ماهی', trait: 'راه‌راه نارنجی' },
  { id: 'fl2', variant: 'clown', size: 'sm', label: 'دلقک‌ماهی', trait: 'راه‌راه سفید' },
  { id: 'fl3', variant: 'puffer', size: 'md', label: 'بادکنک‌ماهی', trait: 'خال‌دار زرد' }
];

export const FISH_LAB_MYSTERY = {
  variant: 'puffer' as const,
  trait: 'بدن گردِ خال‌دار زرد',
  answer: 'بادکنک‌ماهی' as const,
  okFeedback: 'مدل به مثال‌های برچسب‌دار نگاه کرد و چون طرحش خال‌دار زرد بود گروه بادکنک‌ماهی رو حدس زد.',
  hintFeedback: 'به مثال‌های بالا نگاه کن. ماهیِ خال‌دار زرد چه اسمی داشت؟ همون رو انتخاب کن'
};

export interface CoralGrowthPoint {
  day: number;
  cm: number;
}

export const CORAL_GROWTH_DATA = {
  points: [
    { day: 1, cm: 10 },
    { day: 2, cm: 20 },
    { day: 3, cm: 30 }
  ] as CoralGrowthPoint[],
  targetDay: 4,
  answerCm: 40,
  choicesCm: [15, 40, 75] as const,
  okFeedback: 'توی رگرسیون مثال‌ها عدد دارن پس مدل از روی الگو رشد عدد ۴۰ سانتی‌متر رو حدس زد.',
  hintFeedback: 'به عددهای روز ۱ تا ۳ نگاه کن ببین هر روز چقدر اضافه شده پس روز ۴ چند میشه؟'
};

// ---------------- Stage 4: Unsupervised Clustering Map ----------------
export interface ClusterDot {
  id: string;
  x: number; // 10..90 (%)
  y: number; // 15..85 (%)
  icon: string;
  naturalGroup: 0 | 1;
}

export interface ClusterMapScenario {
  id: string;
  title: string;
  xLabel: string;
  yLabel: string;
  xMinLabel: string;
  xMaxLabel: string;
  yMinLabel: string;
  yMaxLabel: string;
  dots: ClusterDot[];
  mystery: {
    x: number;
    y: number;
    icon: string;
    name: string;
    expectedGroup: 0 | 1;
    explanation: string;
  };
}

export const CLUSTER_MAPS: ClusterMapScenario[] = [
  {
    id: 'cm1',
    title: 'موجودهای دریایی خلیج',
    xLabel: 'اندازهٔ باله',
    yLabel: 'نرمی بدن',
    xMinLabel: 'بی‌باله',
    xMaxLabel: 'باله‌دار',
    yMinLabel: 'سفت',
    yMaxLabel: 'نرم و ژله‌ای',
    dots: [
      { id: 'd1', x: 22, y: 24, icon: '🐙', naturalGroup: 0 },
      { id: 'd2', x: 37, y: 31, icon: '🦑', naturalGroup: 0 },
      { id: 'd3', x: 18, y: 42, icon: '🪼', naturalGroup: 0 },
      { id: 'd4', x: 68, y: 64, icon: '🐡', naturalGroup: 1 },
      { id: 'd5', x: 84, y: 72, icon: '🐠', naturalGroup: 1 },
      { id: 'd6', x: 64, y: 82, icon: '🐟', naturalGroup: 1 }
    ],
    mystery: {
      x: 84,
      y: 44,
      icon: '🐟',
      name: 'ماهی جدید',
      expectedGroup: 1,
      explanation: 'بدون هیچ برچسبی هم از روی شکل و هم فاصلهٔ کوتاه‌تر به گروه دوم وصل شد.'
    }
  },
  {
    id: 'cm2',
    title: 'شکل و نرمی اشیا روی نقشه',
    xLabel: 'نرمی و بافت',
    yLabel: 'شکل و گوشه',
    xMinLabel: 'سخت',
    xMaxLabel: 'نرم',
    yMinLabel: 'گوشه‌دار',
    yMaxLabel: 'گرد و نرم',
    dots: [
      { id: 'e1', x: 24, y: 68, icon: '⭐', naturalGroup: 0 },
      { id: 'e2', x: 38, y: 78, icon: '🔷', naturalGroup: 0 },
      { id: 'e3', x: 18, y: 84, icon: '🔺', naturalGroup: 0 },
      { id: 'e4', x: 70, y: 24, icon: '🧸', naturalGroup: 1 },
      { id: 'e5', x: 85, y: 34, icon: '🐳', naturalGroup: 1 },
      { id: 'e6', x: 66, y: 42, icon: '🦭', naturalGroup: 1 }
    ],
    mystery: {
      x: 86,
      y: 56,
      icon: '🧸',
      name: 'عروسک جدید',
      expectedGroup: 1,
      explanation: 'بدون اسم آماده این عروسک نرم کنار همسایه‌های نرم و گرد قرار گرفت.'
    }
  },
  {
    id: 'cm3',
    title: 'سنگ‌ها و گوهرهای کف دریا',
    xLabel: 'درخشندگی',
    yLabel: 'شفافیت',
    xMinLabel: 'کدر',
    xMaxLabel: 'براق',
    yMinLabel: 'مات',
    yMaxLabel: 'شفاف',
    dots: [
      { id: 'g1', x: 22, y: 68, icon: '🪨', naturalGroup: 0 },
      { id: 'g2', x: 36, y: 77, icon: '🌑', naturalGroup: 0 },
      { id: 'g3', x: 18, y: 84, icon: '🪵', naturalGroup: 0 },
      { id: 'g4', x: 68, y: 22, icon: '💎', naturalGroup: 1 },
      { id: 'g5', x: 84, y: 31, icon: '🔮', naturalGroup: 1 },
      { id: 'g6', x: 64, y: 41, icon: '🫧', naturalGroup: 1 }
    ],
    mystery: {
      x: 85,
      y: 56,
      icon: '💎',
      name: 'گوهر جدید',
      expectedGroup: 1,
      explanation: 'در خوشه‌بندی هیچ برچسبی نیست و این گوهر براق از روی نزدیکی به گروه دوم وصل شد.'
    }
  }
];

export function computeDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.round(Math.hypot(a.x - b.x, a.y - b.y));
}

// Computes nearest center index (0 or 1) using Euclidean distance on the 0..100 grid
export function findNearestCenter(
  point: { x: number; y: number },
  centers: [{ x: number; y: number }, { x: number; y: number }]
): 0 | 1 {
  const d0 = Math.hypot(point.x - centers[0].x, point.y - centers[0].y);
  const d1 = Math.hypot(point.x - centers[1].x, point.y - centers[1].y);
  return d0 <= d1 ? 0 : 1;
}

// Compute the centroid (average x,y) of a group of dots
export function computeCentroid(dots: ClusterDot[]): { x: number; y: number } {
  if (dots.length === 0) return { x: 50, y: 50 };
  const sum = dots.reduce((acc, d) => ({ x: acc.x + d.x, y: acc.y + d.y }), { x: 0, y: 0 });
  return { x: sum.x / dots.length, y: sum.y / dots.length };
}

// Evaluate whether two placed group centers separate the two natural clusters cleanly
export function evaluateClusterPlacement(
  dots: ClusterDot[],
  center0: { x: number; y: number },
  center1: { x: number; y: number }
): { separated: boolean; assignments: (0 | 1)[] } {
  const assignments = dots.map((d) => findNearestCenter(d, [center0, center1]));
  const group0Assigned = new Set(
    dots
      .map((dot, idx) => ({ dot, idx }))
      .filter((item) => item.dot.naturalGroup === 0)
      .map((item) => assignments[item.idx])
  );
  const group1Assigned = new Set(
    dots
      .map((dot, idx) => ({ dot, idx }))
      .filter((item) => item.dot.naturalGroup === 1)
      .map((item) => assignments[item.idx])
  );
  const separated =
    group0Assigned.size === 1 &&
    group1Assigned.size === 1 &&
    [...group0Assigned][0] !== [...group1Assigned][0];
  return { separated, assignments };
}

// ---------------- Stage 5: Grand Synthesis (ML Types, Rule vs ML, Voice & Vision) ----------------
export type LearningCategory = 'supervised' | 'unsupervised' | 'rule_vs_ml' | 'voice_vision';

export interface SynthesisQuestion {
  id: string;
  category: LearningCategory;
  tag: string;
  icon: string;
  story: string;
  prompt: string;
  options: {
    id: string;
    icon?: string;
    label: string;
    sub: string;
    correct: boolean;
  }[];
  okFeedback: string;
  hintFeedback: string;
}

export const SYNTHESIS_POOL: SynthesisQuestion[] = [
  {
    id: 'syn1',
    category: 'supervised',
    tag: 'یادگیری با نظارت',
    icon: '🏷️',
    story: 'به ربات ۵۰۰ تا عکسِ صدف با اسمِ زیر هر عکس دادیم تا صدف‌های جدید رو بشناسه.',
    prompt: 'این کار چه نوع یادگیری ماشینیه؟',
    options: [
      { id: 'a', icon: '🏷️', label: 'یادگیری با نظارت', sub: 'مثال‌ها جواب آماده دارن', correct: true },
      { id: 'b', icon: '🫧', label: 'یادگیری بدون نظارت', sub: 'هیچ اسمی نداره', correct: false },
      { id: 'c', icon: '⚙️', label: 'قانون‌نویسیِ ثابت', sub: 'بدون یادگیری از عکس‌ها', correct: false }
    ],
    okFeedback: 'وقتی عکس‌ها برچسب و جوابِ آماده دارن مدل از مثال‌های راهنمایی‌شده یاد می‌گیره که اسمش یادگیری با نظارت هست',
    hintFeedback: 'زیر هر عکس اسمش نوشته شده و این یعنی مثال‌ها برچسب آماده دارن'
  },
  {
    id: 'syn2',
    category: 'supervised',
    tag: 'رگرسیون با نظارت',
    icon: '🌊',
    story: 'توی جدول‌های دیروز ارتفاع موج به سانتی‌متر ثبت شده تا مدل ارتفاع موج فردا رو حدس بزنه.',
    prompt: 'این کار چه نوع یادگیری ماشینیه؟',
    options: [
      { id: 'a', icon: '📈', label: 'رگرسیون با نظارت', sub: 'عدد می‌گیره و عدد حدس می‌زنه', correct: true },
      { id: 'b', icon: '🫧', label: 'یادگیری بدون نظارت', sub: 'چیدن عکس‌های بی‌اسم', correct: false },
      { id: 'c', icon: '⚙️', label: 'قانون‌نویسیِ ثابت', sub: 'فقط یک شرط عددی ثابت', correct: false }
    ],
    okFeedback: 'دادهٔ گذشته جوابِ عددی داره و مدل عدد حدس می‌زنه یعنی با نظارت از نوع رگرسیون',
    hintFeedback: 'برای مثال‌های قبلی جواب دقیق به سانتی‌متر ثبت شده و خروجی یک عدد هست'
  },
  {
    id: 'syn3',
    category: 'unsupervised',
    tag: 'یادگیری بدون نظارت',
    icon: '🫧',
    story: '۱۰۰ تا سنگ دریاییِ بی‌اسم به ماشین دادیم و خودش سنگ‌های شبیه رو توی ۳ گروه چید.',
    prompt: 'این کار چه نوع یادگیری ماشینیه؟',
    options: [
      { id: 'a', icon: '🏷️', label: 'یادگیری با نظارت', sub: 'مثال‌ها برچسب دارن', correct: false },
      { id: 'b', icon: '🫧', label: 'یادگیری بدون نظارت', sub: 'از روی شباهت گروه می‌سازه', correct: true },
      { id: 'c', icon: '⚙️', label: 'قانون‌نویسیِ ثابت', sub: 'برنامه‌نویس اسم هر سنگ رو نوشته', correct: false }
    ],
    okFeedback: 'سنگ‌ها هیچ برچسبی نداشتن و ماشین خودش از روی شباهت گروه ساخت که همون یادگیری بدون نظارته',
    hintFeedback: 'سنگ‌ها هیچ اسمی نداشتن و ماشین فقط با مقایسهٔ شباهت‌ها دسته‌شون کرد'
  },
  {
    id: 'syn4',
    category: 'unsupervised',
    tag: 'یادگیری بدون نظارت',
    icon: '🐠',
    story: 'برنامه اسم ماهی‌ها رو نمی‌دونه اما از روی اندازه و رنگ توی ۲ گروه جدا می‌چیندشون.',
    prompt: 'این کار چه نوع یادگیری ماشینیه؟',
    options: [
      { id: 'a', icon: '🫧', label: 'یادگیری بدون نظارت', sub: 'گروه‌بندی بدون اسم و برچسب', correct: true },
      { id: 'b', icon: '🏷️', label: 'یادگیری با نظارت', sub: 'یادگیری از مثال جواب‌دار', correct: false },
      { id: 'c', icon: '💬', label: 'پردازش متن', sub: 'خواندن کلمه‌ها در جمله', correct: false }
    ],
    okFeedback: 'وقتی اسم و برچسب نیست و شباهت‌ها گروه‌ها رو می‌سازن این کار خوشه‌بندی و بدون نظارت هست',
    hintFeedback: 'اینجا هیچ برچسب آماده‌ای به برنامه داده نشده و فقط شباهت‌ها گروه‌ها رو می‌سازن'
  },
  {
    id: 'syn5',
    category: 'rule_vs_ml',
    tag: 'قانون‌نویسی ساده',
    icon: '⚙️',
    story: 'توی آکواریوم شرط نوشتیم هر وقت دمای آب از ۳۰ درجه بالاتر رفت چراغ قرمز روشن میشه.',
    prompt: 'برای این کار کدوم روش کافیه؟',
    options: [
      { id: 'a', icon: '⚙️', label: 'قانون‌نویسیِ ساده', sub: 'یک شرط ثابت با عدد ۳۰', correct: true },
      { id: 'b', icon: '🏷️', label: 'یادگیری با نظارت', sub: 'آموزش با هزاران عکس', correct: false },
      { id: 'c', icon: '🫧', label: 'یادگیری بدون نظارت', sub: 'ساخت گروه از روی شباهت', correct: false }
    ],
    okFeedback: 'چون یک قانون عددیِ کاملاً مشخص داریم یک دستور ساده کافیه',
    hintFeedback: 'اینجا فقط دما رو با عدد ۳۰ مقایسه میکنیم و نیازی به مثال‌های زیاد نیست'
  },
  {
    id: 'syn6',
    category: 'rule_vs_ml',
    tag: 'یادگیری ماشین',
    icon: '🌿',
    story: 'ربات باغبان با دیدن هزاران عکس برگ یاد میگیره برگِ تشنه رو از برگِ سالم تشخیص بده.',
    prompt: 'این کار با کدوم روش بهتر انجام میشه؟',
    options: [
      { id: 'a', icon: '⚙️', label: 'قانون‌نویسیِ ثابت', sub: 'نوشتن شرط برای تک‌تک نقطه‌ها', correct: false },
      { id: 'b', icon: '🏷️', label: 'یادگیری با نظارت', sub: 'یادگیری از عکس‌های برچسب‌دار', correct: true },
      { id: 'c', icon: '🫧', label: 'یادگیری بدون نظارت', sub: 'چیدن داده‌های بدون هیچ برچسبی', correct: false }
    ],
    okFeedback: 'نور و شکل برگ‌ها همیشه فرق داره پس ربات با مثال‌های برچسب‌دار یاد میگیره',
    hintFeedback: 'برای عکس‌های واقعیِ برگ نمیشه قانون ساده نوشت و مدل از مثال‌های عکس یاد میگیره'
  },
  {
    id: 'syn7',
    category: 'voice_vision',
    tag: 'پردازش صوت',
    icon: '🎙️',
    story: 'درِ قلعه فقط وقتی باز میشه که نگهبان صدای جملهٔ دروازه باز شو رو بشنوه.',
    prompt: 'مدل برای این کار چه مهارتی نیاز داره؟',
    options: [
      { id: 'a', icon: '🎙️', label: 'پردازش صوت', sub: 'تشخیص فرمان از روی موج صدا', correct: true },
      { id: 'b', icon: '📷', label: 'بینایی ماشین', sub: 'دیدن شکل‌ها از روی عکس', correct: false },
      { id: 'c', icon: '⚙️', label: 'قانون‌نویسیِ ساده', sub: 'فقط بررسی یک شرط عددی', correct: false }
    ],
    okFeedback: 'تشخیص فرمان از روی موج صدا همون مهارت پردازش صوت هست',
    hintFeedback: 'ورودی برنامه صدای گفتار بچه‌هاست نه عکس و نه جدول عدد'
  },
  {
    id: 'syn8',
    category: 'voice_vision',
    tag: 'بینایی ماشین',
    icon: '📷',
    story: 'دوربین زیردریایی باید وسط صخره‌ها قطب‌نمای گمشده رو پیدا کنه و دورش کادر بکشه.',
    prompt: 'مدل برای این کار چه مهارتی نیاز داره؟',
    options: [
      { id: 'a', icon: '📷', label: 'بینایی ماشین', sub: 'پیدا کردن اشیا از روی عکس', correct: true },
      { id: 'b', icon: '🎙️', label: 'پردازش صوت', sub: 'شنیدن و تشخیص موج صدا', correct: false },
      { id: 'c', icon: '⚙️', label: 'قانون‌نویسیِ ساده', sub: 'فقط بررسی یک شرط عددی', correct: false }
    ],
    okFeedback: 'پیدا کردن شیء واقعی با دوربین و عکس همون مهارت بینایی ماشین است',
    hintFeedback: 'زیردریایی داره از دوربین و عکس برای دیدن یک شیء استفاده می‌کنه'
  }
];

export interface RunDeck {
  seed: number;
  cinemaItems: CinemaScenario[];
  featureItems: FeatureCase[];
  supervisedItems: SupervisedScenario[];
  clusterMap: ClusterMapScenario;
  synthesisItems: SynthesisQuestion[];
}

export function buildRunDeck(seed: number): RunDeck {
  const categories: LearningCategory[] = ['supervised', 'unsupervised', 'rule_vs_ml', 'voice_vision'];
  const perCategory = categories.map((cat, idx) => {
    const bucket = SYNTHESIS_POOL.filter((item) => item.category === cat);
    return pickShuffled(bucket, 1, seed + 53 + idx * 17)[0];
  });

  const supClass = pickShuffled(
    SUPERVISED_POOL.filter((item) => item.answer === 'classification'),
    1,
    seed + 37
  )[0];
  const supReg = pickShuffled(
    SUPERVISED_POOL.filter((item) => item.answer === 'regression'),
    1,
    seed + 41
  )[0];

  return {
    seed,
    cinemaItems: pickShuffled(CINEMA_POOL, 4, seed + 11),
    featureItems: pickShuffled(FEATURE_POOL, 2, seed + 23),
    supervisedItems: pickShuffled([supClass, supReg], 2, seed + 47),
    clusterMap: CLUSTER_MAPS[Math.abs(seed) % CLUSTER_MAPS.length],
    synthesisItems: pickShuffled(perCategory, 4, seed + 97)
  };
}

// ---------------- Scoring, Combo, Mastery Stars & Replay Persistence ----------------
export function computeAnswerXp(firstTry: boolean, nextStreak: number): number {
  const base = firstTry ? 20 : 10;
  const comboBonus = firstTry ? Math.min(Math.max(nextStreak - 1, 0), 4) * 5 : 0;
  return base + comboBonus;
}

export interface MasterySummary {
  stars: 1 | 2 | 3;
  levelNumber: 1 | 2 | 3;
  levelLabel: string;
  badgeName: string;
  rankTitle: string;
  accuracyPercent: number;
}

export function evaluateMastery(firstTryHits: number, totalQuestions: number): MasterySummary {
  if (totalQuestions <= 0) {
    return {
      stars: 3,
      levelNumber: 3,
      levelLabel: 'سطح ۳ · طلایی',
      badgeName: 'نشان طلاییِ فرماندهٔ الگوها',
      rankTitle: 'فرماندهٔ طلایی الگوها',
      accuracyPercent: 100
    };
  }
  const accuracyPercent = Math.round((firstTryHits / totalQuestions) * 100);
  if (accuracyPercent >= 85) {
    return {
      stars: 3,
      levelNumber: 3,
      levelLabel: 'سطح ۳ · طلایی',
      badgeName: 'نشان طلاییِ فرماندهٔ الگوها',
      rankTitle: 'فرماندهٔ طلایی الگوها',
      accuracyPercent
    };
  }
  if (accuracyPercent >= 60) {
    return {
      stars: 2,
      levelNumber: 2,
      levelLabel: 'سطح ۲ · نقره‌ای',
      badgeName: 'نشان نقره‌ایِ ناوبر هوشمند',
      rankTitle: 'ناوبر هوشمند الگوها',
      accuracyPercent
    };
  }
  return {
    stars: 1,
    levelNumber: 1,
    levelLabel: 'سطح ۱ · برنزی',
    badgeName: 'نشان برنزیِ کاشف کنجکاو',
    rankTitle: 'کاشف کنجکاو جزیره',
    accuracyPercent
  };
}

export interface SavedFinalStats {
  runsCompleted: number;
  bestScore: number;
  bestCombo: number;
  bestStars: number;
  lastSeed: number;
}

const STORAGE_KEY = 'delfina-island2-final-v1';

export function readSavedStats(): SavedFinalStats {
  const fallback: SavedFinalStats = {
    runsCompleted: 0,
    bestScore: 0,
    bestCombo: 0,
    bestStars: 0,
    lastSeed: 101
  };
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<SavedFinalStats>;
    return {
      runsCompleted: Number(parsed.runsCompleted) || 0,
      bestScore: Number(parsed.bestScore) || 0,
      bestCombo: Number(parsed.bestCombo) || 0,
      bestStars: Number(parsed.bestStars) || 0,
      lastSeed: Number(parsed.lastSeed) || 101
    };
  } catch {
    return fallback;
  }
}

export function saveRunCompletion(
  score: number,
  bestRunCombo: number,
  stars: number,
  seed: number
): SavedFinalStats {
  const prev = readSavedStats();
  const next: SavedFinalStats = {
    runsCompleted: prev.runsCompleted + 1,
    bestScore: Math.max(prev.bestScore, score),
    bestCombo: Math.max(prev.bestCombo, bestRunCombo),
    bestStars: Math.max(prev.bestStars, stars),
    lastSeed: seed
  };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage quota failures cleanly
    }
    // Optional integration bridge with the parent Delfina shell if embedded in an iframe
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: 'delfina:progress',
            mission: 'island2-final',
            score,
            stars,
            completed: true
          },
          '*'
        );
      }
    } catch {
      // ignore cross-origin postMessage restrictions
    }
  }
  return next;
}

export const SUMMARY_CARDS = [
  {
    id: 'sum-rule',
    title: 'قانون و مدل',
    tint: 'gold' as const,
    icon: '⚙️',
    body: 'قانون ساده برای شرط‌های ثابت عالیه اما برای عکس و صدا مدل یادگیری ماشین از مثال‌ها الگو میگیره.'
  },
  {
    id: 'sum-data',
    title: 'داده و سرنخ',
    tint: 'mint' as const,
    icon: '🔍',
    body: 'داده‌ها تصویر یا صوت یا متن یا عدد هستن و مدل باید سرنخ خود موضوع رو ببینه نه پس‌زمینه رو.'
  },
  {
    id: 'sum-sup',
    title: 'با نظارت',
    tint: 'lavender' as const,
    icon: '🏷️',
    body: 'وقتی مثال‌ها برچسب دارن انتخاب گروه میشه دسته‌بندی و حدس زدن عدد میشه رگرسیون.'
  },
  {
    id: 'sum-unsup',
    title: 'بدون نظارت',
    tint: 'coral' as const,
    icon: '✨',
    body: 'توی بدون نظارت هیچ اسم و برچسبی نیست و مدل فقط با مقایسهٔ شباهت‌ها داده‌های نزدیک رو کنار هم میچینه.'
  }
];

import React, { useEffect, useState } from 'react';
import { toFa } from '../game/capstoneEngine';
import { DelphiBubble } from '../game/delphiNarrator';

export type DelphiMood = 'curious' | 'celebrating';

interface DelphiDockProps {
  mood: DelphiMood;
  bubbles: DelphiBubble[];
  ctaLabel?: string;
  ctaDisabled?: boolean;
  onCtaClick?: () => void;
  isStartCta?: boolean;
  character?: 'delphi' | 'official';
}

const DELPHI_CURIOUS_SRC = '/src/assets/images/delphi_curious_1794818590874.jpg';
const DELPHI_CELEBRATE_SRC = '/src/assets/images/delphi_celebrate_1794818592315.jpg';
const OFFICIAL_AVATAR_SRC = '/src/assets/images/exam_guide_avatar_1794833842282.jpg';

function renderHighlightedText(text: string, keywords?: string[]): React.ReactNode {
  if (!keywords || keywords.length === 0) return text;

  const escaped = keywords
    .filter((k) => k.trim().length > 0)
    .slice(0, 2)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (escaped.length === 0) return text;

  const splitter = new RegExp(`(${escaped.join('|')})`, 'g');
  const parts = text.split(splitter);

  return parts.map((part, idx) =>
    keywords.includes(part) ? (
      <strong key={idx} className="font-black text-black">
        {part}
      </strong>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );
}

export const DelphiDock: React.FC<DelphiDockProps> = ({
  mood,
  bubbles,
  ctaLabel,
  ctaDisabled = false,
  onCtaClick,
  isStartCta = false,
  character = 'delphi'
}) => {
  const [page, setPage] = useState(0);
  const bubbleSignature = bubbles.map((b) => b.id).join('|');

  useEffect(() => {
    setPage(0);
  }, [bubbleSignature]);

  const total = Math.max(1, bubbles.length);
  const safeIdx = Math.min(page, total - 1);
  const activeBubble = bubbles[safeIdx] ?? { id: 'empty', text: '' };
  const portraitSrc =
    character === 'official'
      ? OFFICIAL_AVATAR_SRC
      : mood === 'celebrating'
        ? DELPHI_CELEBRATE_SRC
        : DELPHI_CURIOUS_SRC;

  return (
    <section
      aria-label={character === 'official' ? 'مسئول آزمون' : 'راهنمای دلفی'}
      className="relative z-20 mx-auto w-full max-w-[640px] px-3 pt-2 pb-4 sm:px-0"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-3">
          <div className="relative shrink-0">
            <div
              className={`animate-delphi relative h-14 w-14 overflow-hidden rounded-full border-2 bg-[#0B1533] shadow-[0_6px_18px_rgba(0,0,0,0.45)] sm:h-16 sm:w-16 ${
                mood === 'celebrating' ? 'border-[#58E6CB]' : 'border-[#FFD24C]'
              }`}
            >
              <img
                src={portraitSrc}
                alt={character === 'official' ? 'مسئول آزمون' : 'دلفی راهنمای تو'}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="relative flex-1 rounded-[22px] border-2 border-[#F2CF66] bg-[#FFFDF7] px-4 py-3 text-[#141933] shadow-[0_10px_28px_rgba(3,10,28,0.45)]">
            <p
              className="text-[13.5px] font-semibold leading-relaxed sm:text-[14.5px]"
              aria-live="polite"
            >
              {renderHighlightedText(activeBubble.text, activeBubble.keywords)}
            </p>

            {/* RTL Pagination: Previous (right ›) · Counter · Next (left ‹) */}
            {total > 1 && (
              <div className="mt-2 flex items-center justify-center gap-3 pt-0.5 text-xs font-black">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safeIdx === 0}
                  aria-label="حباب قبلی"
                  className="grid h-8 w-8 place-items-center rounded-full bg-[#FFD24C] text-base font-black text-[#141933] shadow-[0_2px_0_#C2850D] transition-all hover:bg-[#FFC425] active:translate-y-0.5 disabled:bg-[#EDE6D4] disabled:text-[#8E8978] disabled:shadow-none"
                >
                  <span aria-hidden="true">›</span>
                </button>

                <span className="min-w-[44px] text-center tabular-nums text-[11.5px] font-extrabold text-[#3B4263]">
                  {toFa(safeIdx + 1)} از {toFa(total)}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
                  disabled={safeIdx >= total - 1}
                  aria-label="حباب بعدی"
                  className="grid h-8 w-8 place-items-center rounded-full bg-[#FFD24C] text-base font-black text-[#141933] shadow-[0_2px_0_#C2850D] transition-all hover:bg-[#FFC425] active:translate-y-0.5 disabled:bg-[#EDE6D4] disabled:text-[#8E8978] disabled:shadow-none"
                >
                  <span aria-hidden="true">‹</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {ctaLabel && onCtaClick && (
          <button
            type="button"
            data-start={isStartCta ? 'true' : undefined}
            disabled={ctaDisabled}
            onClick={onCtaClick}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-base font-black text-[#141933] transition-transform duration-150 hover:brightness-[1.03] active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
            style={{
              background: 'linear-gradient(180deg, #FFE178 0%, #F3AF22 100%)',
              boxShadow: ctaDisabled ? 'none' : '0 4px 0 #B87B09, 0 10px 24px rgba(2,10,30,0.45)'
            }}
          >
            <span>{ctaLabel}</span>
            <span aria-hidden="true">‹</span>
          </button>
        )}
      </div>
    </section>
  );
};

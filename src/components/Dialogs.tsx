import React from 'react';
import { STAGES, toFa } from '../game/capstoneEngine';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#061328]/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div className="animate-pop w-full max-w-[420px] rounded-[24px] border-2 border-[#F2C66A] bg-[#FFF8E9] p-1 text-[#253451] shadow-[0_18px_54px_rgba(5,17,37,0.65)]">
        <div className="rounded-[19px] border border-[#E9BF66] p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 id="help-modal-title" className="text-lg font-black text-[#1E1B33]">
              راهنمای مأموریت پایانی جزیرهٔ ۲
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن راهنما"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#FFE9B8] text-lg font-black text-[#1E1B33] hover:bg-[#FFD45A]"
            >
              ×
            </button>
          </div>

          <p className="mt-2 text-xs font-semibold leading-relaxed text-[#383C5C] sm:text-sm">
            توی این مأموریت مهارت‌های یادگیری ماشین رو توی ۵ ایستگاه تمرین میکنی.
          </p>

          <ul className="mt-3 space-y-2 text-xs font-bold text-[#141933] sm:text-sm">
            {STAGES.map((s) => (
              <li
                key={s.id}
                className="flex items-start gap-2 rounded-xl border border-[#EECB76] bg-[#FFF1C5]/75 px-3 py-2"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#3932A8] text-[11px] font-black text-white">
                  {toFa(s.index + 1)}
                </span>
                <div className="pt-0.5">{s.title}</div>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-[11.5px] font-bold text-[#0B6153]">
            اگه بار اول درست جواب بدی امتیاز پیاپی بیشتری میگیری و هر بار چالش‌های تازه میاد.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 min-h-[46px] w-full rounded-full bg-[#3932A8] px-4 py-2 text-sm font-black text-white shadow-[0_3px_0_#241E75] transition-colors hover:bg-[#4942C2]"
          >
            فهمیدم بریم بازی
          </button>
        </div>
      </div>
    </div>
  );
};

interface ExitDialogProps {
  open: boolean;
  stageIndex: number;
  xp: number;
  onCancel: () => void;
  onConfirmReset: () => void;
}

export const ExitDialog: React.FC<ExitDialogProps> = ({
  open,
  stageIndex,
  xp,
  onCancel,
  onConfirmReset
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#061328]/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
    >
      <div className="animate-pop w-full max-w-[360px] rounded-[24px] border-2 border-[#F2CF66] bg-[#FFFDF7] p-1 text-center text-[#141933] shadow-[0_18px_54px_rgba(5,17,37,0.65)]">
        <div className="grid gap-3 rounded-[19px] border border-[#E9BF66] p-4">
          <h2 id="exit-modal-title" className="text-xl font-black">
            برگردیم اول مأموریت؟
          </h2>
          <p className="text-sm font-semibold leading-relaxed text-[#383C5C]">
            اگه الان برگردی به شروع بازی پیشرفت همین دست پاک میشه اما رکورد قبلیت میمونه.
          </p>

          <div className="grid gap-0.5 rounded-xl border border-[#EECB76] bg-[#FFF1C5] px-3 py-2 text-xs font-extrabold text-[#4F3A16]">
            <span>
              ایستگاه فعلی {stageIndex >= 0 ? `${toFa(Math.min(stageIndex + 1, 5))} از ۵` : 'شروع'}
            </span>
            <span>امتیاز این دست {toFa(xp)} ★</span>
          </div>

          <div className="grid grid-cols-[1.3fr_1fr] gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-[46px] rounded-[13px] bg-[#17367A] px-3 py-2 text-xs font-black text-white shadow-[0_3px_0_#0A1940] transition-colors hover:bg-[#1F4699]"
            >
              ادامه
            </button>
            <button
              type="button"
              onClick={onConfirmReset}
              className="min-h-[46px] rounded-[13px] bg-[#A93545] px-3 py-2 text-xs font-black text-white shadow-[0_3px_0_#6B1A26] transition-colors hover:bg-[#8E2A38]"
            >
              برگشت به شروع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

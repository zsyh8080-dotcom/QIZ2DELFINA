import React from 'react';
import { SavedFinalStats } from '../game/capstoneEngine';

interface TitleIntroStageProps {
  savedStats?: SavedFinalStats;
}

export const TitleIntroStage: React.FC<TitleIntroStageProps> = () => {
  return (
    <div className="animate-pop mx-auto w-full max-w-[640px] rounded-[26px] border border-[#7DB3FF]/35 bg-[#10275C]/80 p-4 shadow-[0_18px_48px_rgba(3,10,28,0.5)] sm:p-5">
      <div className="mb-3.5 text-center">
        <h2 className="text-lg font-black leading-snug text-[#FFE178] sm:text-xl">
          آزمون افزایش سطح
        </h2>
        <p className="mt-1 text-sm font-extrabold text-white sm:text-base">
          آماده‌ای توی ۵ ایستگاه سطحت رو بالا ببری و نشانِ ویژه بگیری؟
        </p>
      </div>

      {/* Crisp Hero Illustration */}
      <div className="overflow-hidden rounded-[22px] border border-[#7DB3FF]/35 bg-[#091638] shadow-inner">
        <img
          src="/src/assets/images/island_capstone_scene_1794818592077.jpg"
          alt="دلفی کنار کشتی در مأموریت انواع یادگیری ماشین"
          referrerPolicy="no-referrer"
          className="h-[220px] w-full object-cover object-bottom sm:h-[280px]"
        />
      </div>
    </div>
  );
};

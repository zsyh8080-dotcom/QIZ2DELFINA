import React from 'react';

interface OceanBackdropProps {
  reducedMotion: boolean;
}

const BUBBLES = [
  { left: '8%', size: 12, delay: '0s', duration: '18s' },
  { left: '22%', size: 7, delay: '-6s', duration: '22s' },
  { left: '41%', size: 16, delay: '-11s', duration: '19s' },
  { left: '64%', size: 9, delay: '-4s', duration: '24s' },
  { left: '79%', size: 14, delay: '-9s', duration: '20s' },
  { left: '91%', size: 8, delay: '-14s', duration: '21s' }
];

export const OceanBackdrop: React.FC<OceanBackdropProps> = ({ reducedMotion }) => {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{
        background:
          'radial-gradient(95% 75% at 50% 8%, #164488 0%, #0D2354 48%, #07122D 100%)'
      }}
      aria-hidden="true"
    >
      {/* Subtle diagonal ocean sunbeams matching Delfina mission view */}
      <div
        className="absolute -top-20 right-[12%] h-[135%] w-24 -rotate-12 opacity-25"
        style={{
          background:
            'linear-gradient(180deg, rgba(160, 224, 255, 0.32) 0%, rgba(160, 224, 255, 0) 78%)'
        }}
      />
      <div
        className="absolute -top-20 right-[26%] h-[135%] w-40 -rotate-12 opacity-20"
        style={{
          background:
            'linear-gradient(180deg, rgba(135, 214, 255, 0.25) 0%, rgba(135, 214, 255, 0) 72%)'
        }}
      />
      <div
        className="absolute -top-16 left-[18%] h-[125%] w-28 rotate-12 opacity-15"
        style={{
          background:
            'linear-gradient(180deg, rgba(94, 230, 208, 0.22) 0%, rgba(94, 230, 208, 0) 70%)'
        }}
      />

      {/* Ambient underwater bubbles */}
      {!reducedMotion &&
        BUBBLES.map((b, idx) => (
          <span
            key={idx}
            className="animate-bubble absolute -bottom-8 rounded-full border border-[#A9DFF0]/35 bg-[#A9DFF0]/10"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDelay: b.delay,
              animationDuration: b.duration
            }}
          />
        ))}
    </div>
  );
};

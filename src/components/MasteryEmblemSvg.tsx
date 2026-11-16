import React from 'react';
import { toFa } from '../game/capstoneEngine';

interface MasteryEmblemSvgProps {
  level: 1 | 2 | 3;
  className?: string;
}

const PALETTES: Record<
  1 | 2 | 3,
  {
    rimLight: string;
    rimMid: string;
    rimDark: string;
    innerBgTop: string;
    innerBgBottom: string;
    raysColor: string;
    laurelColor: string;
    ribbonBg: string;
    ribbonFold: string;
    ribbonText: string;
    outfitMain: string;
    outfitAccent: string;
    capeColor: string;
    haloGlow: string;
  }
> = {
  3: {
    rimLight: '#FFF0A8',
    rimMid: '#F5B82E',
    rimDark: '#A86705',
    innerBgTop: '#163578',
    innerBgBottom: '#0A1A42',
    raysColor: '#FFD24C',
    laurelColor: '#FFE178',
    ribbonBg: '#FFD24C',
    ribbonFold: '#B87B09',
    ribbonText: '#141933',
    outfitMain: '#3932A8',
    outfitAccent: '#FFD24C',
    capeColor: '#E13B5A',
    haloGlow: 'rgba(255, 210, 76, 0.55)'
  },
  2: {
    rimLight: '#F0FAFF',
    rimMid: '#8CE6D9',
    rimDark: '#168576',
    innerBgTop: '#133170',
    innerBgBottom: '#08183C',
    raysColor: '#6EF3D6',
    laurelColor: '#9FF6E4',
    ribbonBg: '#58E6CB',
    ribbonFold: '#127E6B',
    ribbonText: '#082B25',
    outfitMain: '#127E6B',
    outfitAccent: '#6EF3D6',
    capeColor: '#2E6BD9',
    haloGlow: 'rgba(94, 230, 208, 0.48)'
  },
  1: {
    rimLight: '#FFE0C2',
    rimMid: '#DF8B4C',
    rimDark: '#8A4414',
    innerBgTop: '#162F6A',
    innerBgBottom: '#0A183B',
    raysColor: '#FFAC70',
    laurelColor: '#FFD1A8',
    ribbonBg: '#FFAC70',
    ribbonFold: '#944714',
    ribbonText: '#261205',
    outfitMain: '#2A5EC2',
    outfitAccent: '#FFAC70',
    capeColor: '#B85A1E',
    haloGlow: 'rgba(255, 172, 112, 0.42)'
  }
};

export const MasteryEmblemSvg: React.FC<MasteryEmblemSvgProps> = ({ level, className = '' }) => {
  const p = PALETTES[level];
  const starPositions = [
    { x: 76, y: 31, rot: -16, idx: 1 },
    { x: 110, y: 23, rot: 0, idx: 2 },
    { x: 144, y: 31, rot: 16, idx: 3 }
  ];

  return (
    <svg
      viewBox="0 0 220 220"
      data-testid="victory-emblem"
      data-level={level}
      aria-label={`نشان ویژهٔ سطح ${toFa(level)}`}
      className={className}
      style={{ filter: `drop-shadow(0 12px 26px ${p.haloGlow})` }}
    >
      <defs>
        <linearGradient id={`rimGrad-${level}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.rimLight} />
          <stop offset="52%" stopColor={p.rimMid} />
          <stop offset="100%" stopColor={p.rimDark} />
        </linearGradient>
        <radialGradient id={`coreBg-${level}`} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor={p.innerBgTop} />
          <stop offset="100%" stopColor={p.innerBgBottom} />
        </radialGradient>
        <clipPath id={`innerCircle-${level}`}>
          <circle cx="110" cy="108" r="64" />
        </clipPath>
      </defs>

      {/* Subtle Burst Rays Behind Medallion */}
      <g opacity={level === 3 ? 0.38 : 0.24}>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <polygon
            key={deg}
            points="110,108 104,10 116,10"
            fill={p.raysColor}
            transform={`rotate(${deg} 110 108)`}
          />
        ))}
      </g>

      {/* Bottom Ribbon Tails */}
      <path d="M52 162 L32 200 L58 190 L70 206 L86 168 Z" fill={p.ribbonFold} />
      <path d="M168 162 L188 200 L162 190 L150 206 L134 168 Z" fill={p.ribbonFold} />

      {/* Outer Notched Medal Shield */}
      <circle cx="110" cy="108" r="82" fill={`url(#rimGrad-${level})`} />
      <circle
        cx="110"
        cy="108"
        r="76"
        fill="none"
        stroke={p.rimDark}
        strokeWidth="2.5"
        strokeDasharray="6 4"
      />
      <circle cx="110" cy="108" r="70" fill={p.rimLight} opacity="0.45" />
      <circle cx="110" cy="108" r="66" fill={`url(#coreBg-${level})`} stroke={p.rimDark} strokeWidth="2.5" />

      {/* Side Laurel Leaves */}
      <g fill={p.laurelColor} opacity="0.92">
        {[128, 112, 96, 80].map((y, idx) => (
          <ellipse
            key={`l-${y}`}
            cx={34 + idx * 2}
            cy={y}
            rx="6"
            ry="3.2"
            transform={`rotate(${-35 + idx * 14} ${34 + idx * 2} ${y})`}
          />
        ))}
        {[128, 112, 96, 80].map((y, idx) => (
          <ellipse
            key={`r-${y}`}
            cx={186 - idx * 2}
            cy={y}
            rx="6"
            ry="3.2"
            transform={`rotate(${35 - idx * 14} ${186 - idx * 2} ${y})`}
          />
        ))}
      </g>

      {/* Top Level Stars Arc */}
      {starPositions.map((st) => {
        const earned = st.idx <= level;
        return (
          <g key={st.idx} transform={`translate(${st.x}, ${st.y}) rotate(${st.rot})`}>
            <circle cx="0" cy="0" r={st.idx === 2 ? 15 : 12.5} fill={p.innerBgBottom} stroke={`url(#rimGrad-${level})`} strokeWidth="2.5" />
            <polygon
              points={
                st.idx === 2
                  ? '0,-9.5 2.7,-3.2 9.4,-2.6 4.2,1.9 5.8,8.5 0,4.9 -5.8,8.5 -4.2,1.9 -9.4,-2.6 -2.7,-3.2'
                  : '0,-7.5 2.1,-2.5 7.4,-2 3.3,1.5 4.5,6.7 0,3.9 -4.5,6.7 -3.3,1.5 -7.4,-2 -2.1,-2.5'
              }
              fill={earned ? '#FFD24C' : '#354A7A'}
              stroke={earned ? '#9E5D00' : '#6A83BA'}
              strokeWidth="1"
            />
          </g>
        );
      })}

      {/* Interior Stage + Character Showing Achieved Level */}
      <g clipPath={`url(#innerCircle-${level})`}>
        {/* Starry sky dots inside medallion */}
        <circle cx="72" cy="74" r="1.8" fill="#FFFFFF" opacity="0.7" />
        <circle cx="148" cy="70" r="2.2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="155" cy="96" r="1.5" fill={p.raysColor} opacity="0.85" />
        <circle cx="64" cy="100" r="1.5" fill={p.raysColor} opacity="0.85" />

        {/* Glowing Horizon Wave */}
        <path d="M40 144 Q110 128 180 144 L180 180 L40 180 Z" fill={p.outfitAccent} opacity="0.22" />

        {/* Level 3 Hero Cape */}
        {level >= 2 && (
          <path
            d={level === 3 ? 'M76 116 Q56 154 70 176 L150 176 Q164 154 144 116 Z' : 'M84 120 Q72 152 80 172 L140 172 Q148 152 136 120 Z'}
            fill={p.capeColor}
          />
        )}

        {/* Explorer Backpack for Level 1 */}
        {level === 1 && (
          <rect x="75" y="118" width="70" height="36" rx="12" fill="#9E521C" stroke="#5A2B09" strokeWidth="2" />
        )}

        {/* Character Torso & Suit */}
        <path
          d="M78 176 L83 128 Q86 116 110 116 Q134 116 137 128 L142 176 Z"
          fill={p.outfitMain}
          stroke="#FFFFFF"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />

        {/* Chest Emblem on Character */}
        <circle cx="110" cy="136" r="9.5" fill={p.outfitAccent} stroke="#141933" strokeWidth="1.5" />
        {level === 3 && (
          <polygon
            points="110,129 112,133.5 117,134 113.2,137 114.3,141.5 110,139 105.7,141.5 106.8,137 103,134 108,133.5"
            fill="#141933"
          />
        )}
        {level === 2 && (
          <path d="M110 130 L114.5 136 L110 142 L105.5 136 Z" fill="#082B25" />
        )}
        {level === 1 && (
          <circle cx="110" cy="136" r="3.5" fill="#141933" />
        )}

        {/* Level 2 Scarf */}
        {level === 2 && (
          <path d="M90 118 Q110 128 130 118 L126 126 Q110 132 94 126 Z" fill="#FFD24C" />
        )}

        {/* Level 3 Golden Shoulder Pauldrons */}
        {level === 3 && (
          <>
            <ellipse cx="83" cy="122" rx="9" ry="5.5" fill="#FFD24C" stroke="#9E5D00" strokeWidth="1.2" />
            <ellipse cx="137" cy="122" rx="9" ry="5.5" fill="#FFD24C" stroke="#9E5D00" strokeWidth="1.2" />
          </>
        )}

        {/* Arms & Level Prop */}
        {level === 3 && (
          <>
            {/* Raised Right Hero Arm holding Golden AI Star Wand */}
            <path d="M136 125 L155 103" stroke={p.outfitMain} strokeWidth="9" strokeLinecap="round" />
            <circle cx="156" cy="102" r="5" fill="#F6C5A2" />
            <line x1="156" y1="102" x2="156" y2="75" stroke="#FFF0A8" strokeWidth="3" strokeLinecap="round" />
            <polygon
              points="156,64 159,71 166,71.5 160.5,76 162,83 156,79 150,83 151.5,76 146,71.5 153,71"
              fill="#FFD24C"
              stroke="#9E5D00"
              strokeWidth="1"
            />
            <path d="M84 125 L70 144" stroke={p.outfitMain} strokeWidth="9" strokeLinecap="round" />
            <circle cx="69" cy="145" r="5" fill="#F6C5A2" />
          </>
        )}

        {level === 2 && (
          <>
            {/* Confident Explorer Holding Pattern Tablet */}
            <path d="M135 126 L149 140" stroke={p.outfitMain} strokeWidth="9" strokeLinecap="round" />
            <path d="M85 126 L73 142" stroke={p.outfitMain} strokeWidth="9" strokeLinecap="round" />
            <rect x="134" y="132" width="22" height="17" rx="3.5" fill="#0B1B45" stroke="#6EF3D6" strokeWidth="2" />
            <circle cx="141" cy="140" r="2.2" fill="#FFD24C" />
            <circle cx="149" cy="140" r="2.2" fill="#6EF3D6" />
          </>
        )}

        {level === 1 && (
          <>
            {/* Curious Explorer Holding Magnifying Glass */}
            <path d="M134 126 L148 136" stroke={p.outfitMain} strokeWidth="9" strokeLinecap="round" />
            <path d="M86 126 L74 142" stroke={p.outfitMain} strokeWidth="9" strokeLinecap="round" />
            <line x1="149" y1="138" x2="156" y2="128" stroke="#FFD24C" strokeWidth="3" strokeLinecap="round" />
            <circle cx="159" cy="122" r="7.5" fill="#9EE7FF" fillOpacity="0.45" stroke="#FFD24C" strokeWidth="2.5" />
          </>
        )}

        {/* Character Head & Expressive Face */}
        <rect x="104" y="109" width="12" height="10" rx="4" fill="#F2BA93" />
        <circle cx="110" cy="94" r="21" fill="#F9CBA8" stroke="#D99870" strokeWidth="1.5" />

        {/* Hair / Back Hair */}
        <path d="M89 92 Q90 71 110 71 Q130 71 131 92 Q125 80 110 81 Q95 80 89 92 Z" fill="#2A203D" />

        {/* Rosy Cheeks & Happy Eyes */}
        <circle cx="98" cy="100" r="3" fill="#FF8C8C" opacity="0.55" />
        <circle cx="122" cy="100" r="3" fill="#FF8C8C" opacity="0.55" />
        <circle cx="102" cy="94" r="2.6" fill="#141933" />
        <circle cx="118" cy="94" r="2.6" fill="#141933" />
        <circle cx="101" cy="93" r="0.9" fill="#FFFFFF" />
        <circle cx="117" cy="93" r="0.9" fill="#FFFFFF" />

        {/* Big Smile */}
        <path
          d={level === 3 ? 'M102 102 Q110 110 118 102' : 'M103 102 Q110 108 117 102'}
          fill="none"
          stroke="#7A3228"
          strokeWidth="2.3"
          strokeLinecap="round"
        />

        {/* Headgear Distinguishing Level Clearly */}
        {level === 3 && (
          /* Golden Commander Crown */
          <g>
            <path
              d="M92 78 L94 61 L103 70 L110 57 L117 70 L126 61 L128 78 Z"
              fill="#FFD24C"
              stroke="#9E5D00"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="110" cy="70" r="3" fill="#E13B5A" />
          </g>
        )}

        {level === 2 && (
          /* Navigator Adventure Goggles on Forehead */
          <g>
            <rect x="89" y="74" width="42" height="6" rx="3" fill="#17367A" />
            <rect x="93" y="70" width="14" height="11" rx="4" fill="#6EF3D6" stroke="#141933" strokeWidth="1.8" />
            <rect x="113" y="70" width="14" height="11" rx="4" fill="#6EF3D6" stroke="#141933" strokeWidth="1.8" />
            <line x1="107" y1="75" x2="113" y2="75" stroke="#141933" strokeWidth="2" />
          </g>
        )}

        {level === 1 && (
          /* Explorer Visor Cap */
          <g>
            <path d="M89 80 Q110 64 131 80 Z" fill="#FFAC70" stroke="#8A4414" strokeWidth="1.5" />
            <path d="M88 80 Q110 75 135 83 L127 85 Q108 81 88 80 Z" fill="#FFD24C" stroke="#8A4414" strokeWidth="1.2" />
          </g>
        )}
      </g>

      {/* Bottom Sculpted Level Ribbon Banner */}
      <g transform="translate(110, 174)">
        <rect
          x="-54"
          y="-15"
          width="108"
          height="30"
          rx="15"
          fill={p.ribbonBg}
          stroke={p.ribbonFold}
          strokeWidth="2.5"
        />
        <text
          x="0"
          y="5"
          textAnchor="middle"
          fill={p.ribbonText}
          fontSize="14.5"
          fontWeight="900"
          fontFamily="Vazirmatn, sans-serif"
        >
          {`سطح ${toFa(level)}`}
        </text>
      </g>
    </svg>
  );
};

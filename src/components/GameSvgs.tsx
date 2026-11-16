import React from 'react';
import { toFa } from '../game/capstoneEngine';

// Custom crisp vector illustrations for Delfina Island 2 Final Mission.
// Designed for ages 8-13 with friendly rounded shapes, ocean/coral/gold palette,
// smooth animations, and reactive interactive visual states.

export const CinemaItemSvg: React.FC<{ id: string; className?: string }> = ({
  id,
  className = 'h-16 w-16'
}) => {
  switch (id) {
    case 'c1': // Ticket + 120cm height ruler
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="8" y="22" width="44" height="34" rx="8" fill="#FFD45A" stroke="#1E1B33" strokeWidth="3" />
          <circle cx="8" cy="39" r="5" fill="#FFF9F0" />
          <circle cx="52" cy="39" r="5" fill="#FFF9F0" />
          <path d="M22 33h16M22 43h12" stroke="#1E1B33" strokeWidth="3" strokeLinecap="round" />
          <rect x="57" y="10" width="14" height="58" rx="4" fill="#BCEFE8" stroke="#1E1B33" strokeWidth="3" />
          <path d="M57 22h6M57 32h9M57 42h6M57 52h9" stroke="#0F6B5C" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'c2': // Film clapperboard + heart
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="12" y="28" width="56" height="40" rx="9" fill="#6258ED" stroke="#1E1B33" strokeWidth="3" />
          <path d="M12 28l52-10-4-10-52 10z" fill="#FFD45A" stroke="#1E1B33" strokeWidth="3" strokeLinejoin="round" />
          <path d="M25 16l6 8M41 13l6 8M55 10l6 8" stroke="#1E1B33" strokeWidth="2.5" />
          <path
            d="M40 58c-8-5-13-10-13-16a7 7 0 0 1 13-3.5A7 7 0 0 1 53 42c0 6-5 11-13 16z"
            fill="#FF8A6B"
            stroke="#FFF9F0"
            strokeWidth="2"
          />
        </svg>
      );
    case 'c3': // Thermometer > 30°C
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="29" y="10" width="18" height="42" rx="9" fill="#FFF" stroke="#1E1B33" strokeWidth="3" />
          <circle cx="38" cy="56" r="14" fill="#FF7B5C" stroke="#1E1B33" strokeWidth="3" />
          <rect x="34" y="24" width="8" height="28" rx="4" fill="#FF7B5C" />
          <path d="M52 22h10M52 32h7M52 42h10" stroke="#1E1B33" strokeWidth="3" strokeLinecap="round" />
          <circle cx="58" cy="22" r="3" fill="#FFD45A" />
        </svg>
      );
    case 'c4': // Camera photo showing dolphin fin
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="10" y="16" width="60" height="48" rx="10" fill="#BCEFE8" stroke="#1E1B33" strokeWidth="3" />
          <path d="M12 52c10-6 18 4 28-2s18-4 28 2v10H12z" fill="#2A74D9" />
          <path
            d="M24 46c3-14 14-21 26-20-3 6-4 12 4 19z"
            fill="#4B43C9"
            stroke="#1E1B33"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="57" cy="27" r="5" fill="#FFD45A" />
        </svg>
      );
    case 'c5': // Microphone & sound waves
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="30" y="14" width="20" height="32" rx="10" fill="#5EE6D0" stroke="#1E1B33" strokeWidth="3" />
          <path d="M22 36a18 18 0 0 0 36 0" fill="none" stroke="#1E1B33" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 54v12M29 66h22" stroke="#1E1B33" strokeWidth="3" strokeLinecap="round" />
          <path d="M14 26c-4 6-4 14 0 20M66 26c4 6 4 14 0 20" fill="none" stroke="#FF8A6B" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    default: // Golden chest at 100 points
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
          <rect x="12" y="34" width="56" height="32" rx="8" fill="#F5B83D" stroke="#1E1B33" strokeWidth="3" />
          <path d="M12 34c0-11 9-18 28-18s28 7 28 18z" fill="#FFE17D" stroke="#1E1B33" strokeWidth="3" />
          <rect x="33" y="30" width="14" height="14" rx="4" fill="#FFF9F0" stroke="#1E1B33" strokeWidth="3" />
          <circle cx="40" cy="37" r="2.5" fill="#1E1B33" />
        </svg>
      );
  }
};

export const SupervisedFishSvg: React.FC<{
  variant: 'clown' | 'puffer';
  size?: 'sm' | 'md';
  mystery?: boolean;
  className?: string;
}> = ({ variant, size = 'md', mystery = false, className = 'h-14 w-16' }) => {
  const scale = size === 'sm' ? 0.86 : 1;
  return (
    <svg viewBox="0 0 80 64" className={className} aria-hidden="true">
      <g transform={`translate(40 32) scale(${scale}) translate(-40 -32)`}>
        {variant === 'clown' ? (
          <>
            {/* Striped Orange Clownfish */}
            <polygon points="15,32 5,20 5,44" fill="#FF6B4A" stroke="#1E1B33" strokeWidth="2.5" strokeLinejoin="round" />
            <ellipse cx="42" cy="32" rx="25" ry="16" fill="#FF7B54" stroke="#1E1B33" strokeWidth="2.5" />
            {/* White stripes */}
            <path d="M31 18c2 9 2 19 0 28" stroke="#FFF9F0" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M48 18c2 9 2 19 0 28" stroke="#FFF9F0" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="57" cy="28" r="3.2" fill="#1E1B33" />
            <circle cx="58" cy="27" r="1" fill="#FFF9F0" />
          </>
        ) : (
          <>
            {/* Spotted Yellow Round Pufferfish */}
            <polygon points="15,32 5,22 5,42" fill="#F5B83D" stroke="#1E1B33" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="42" cy="32" r="20" fill="#FFD45A" stroke="#1E1B33" strokeWidth="2.5" />
            {/* Dark spots */}
            <circle cx="32" cy="25" r="3" fill="#B86B00" />
            <circle cx="40" cy="39" r="3.4" fill="#B86B00" />
            <circle cx="29" cy="37" r="2.6" fill="#B86B00" />
            <circle cx="46" cy="24" r="2.6" fill="#B86B00" />
            <circle cx="54" cy="29" r="3.2" fill="#1E1B33" />
            <circle cx="55" cy="28" r="1" fill="#FFF9F0" />
          </>
        )}
      </g>
    </svg>
  );
};

export const CoralGrowthRegressionSvg: React.FC<{
  solved: boolean;
  answerCm: number;
}> = ({ solved, answerCm }) => {
  const days = [
    { day: '۱', cm: 10, x: 46, h: 24, y: 98, color: '#5EE6D0' },
    { day: '۲', cm: 20, x: 102, h: 46, y: 76, color: '#5EE6D0' },
    { day: '۳', cm: 30, x: 158, h: 68, y: 54, color: '#7ADFD1' }
  ];

  return (
    <svg viewBox="0 0 280 150" className="mx-auto h-40 w-full max-w-[320px]" aria-hidden="true">
      <rect width="280" height="150" rx="16" fill="#08173B" />

      {/* Subtle horizontal grid guides */}
      <line x1="28" y1="32" x2="256" y2="32" stroke="#8CB9FF" strokeOpacity="0.16" strokeDasharray="4 4" />
      <line x1="28" y1="54" x2="256" y2="54" stroke="#8CB9FF" strokeOpacity="0.16" strokeDasharray="4 4" />
      <line x1="28" y1="76" x2="256" y2="76" stroke="#8CB9FF" strokeOpacity="0.16" strokeDasharray="4 4" />
      <line x1="28" y1="98" x2="256" y2="98" stroke="#8CB9FF" strokeOpacity="0.16" strokeDasharray="4 4" />
      {/* Base floor */}
      <line x1="26" y1="122" x2="258" y2="122" stroke="#BFD3F5" strokeOpacity="0.4" strokeWidth="2" />

      {/* Days 1..3 known labeled numeric bars */}
      {days.map((d) => (
        <g key={d.day}>
          <rect x={d.x - 14} y={d.y} width="28" height={d.h} rx="6" fill={d.color} opacity="0.92" />
          <text x={d.x} y={d.y - 7} textAnchor="middle" fill="#FFF9F0" fontSize="11" fontWeight="900">
            {toFa(d.cm)} سم
          </text>
          <text x={d.x} y="138" textAnchor="middle" fill="#BFD3F5" fontSize="10.5" fontWeight="800">
            روز {d.day}
          </text>
        </g>
      ))}

      {/* Day 4 target bar: dashed preview before solve -> full glowing bar after solve */}
      <rect
        x="200"
        y={solved ? 32 : 44}
        width="28"
        height={solved ? 90 : 78}
        rx="6"
        fill={solved ? '#FFD45A' : '#FFD45A'}
        fillOpacity={solved ? 0.95 : 0.16}
        stroke="#FFD45A"
        strokeWidth="2.2"
        strokeDasharray={solved ? undefined : '4 3'}
        style={{ transition: 'all 260ms ease' }}
      />
      <text
        x="214"
        y={solved ? 23 : 36}
        textAnchor="middle"
        fill="#FFD45A"
        fontSize="12"
        fontWeight="900"
      >
        {solved ? `${toFa(answerCm)} سم` : '؟ سم'}
      </text>
      <text x="214" y="138" textAnchor="middle" fill="#FFD45A" fontSize="10.5" fontWeight="900">
        روز ۴
      </text>

      {/* Linear Regression trend line connecting known points up to Day 4 */}
      <line
        x1="46"
        y1="98"
        x2={solved ? 214 : 158}
        y2={solved ? 32 : 54}
        stroke="#FF8A6B"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ transition: 'all 260ms ease' }}
      />
      {!solved && (
        <line
          x1="158"
          y1="54"
          x2="214"
          y2="32"
          stroke="#FFD45A"
          strokeWidth="2.8"
          strokeDasharray="5 4"
        />
      )}
      <circle cx="46" cy="98" r="4.5" fill="#FFF9F0" stroke="#FF8A6B" strokeWidth="2" />
      <circle cx="102" cy="76" r="4.5" fill="#FFF9F0" stroke="#FF8A6B" strokeWidth="2" />
      <circle cx="158" cy="54" r="4.5" fill="#FFF9F0" stroke="#FF8A6B" strokeWidth="2" />
      <circle
        cx="214"
        cy="32"
        r="5.5"
        fill={solved ? '#5EE6D0' : '#FFD45A'}
        stroke="#08173B"
        strokeWidth="2"
      />
    </svg>
  );
};

export const ClusterGlyphSvg: React.FC<{ iconKey: string; className?: string }> = ({
  iconKey,
  className = 'h-6 w-6'
}) => {
  switch (iconKey) {
    case 'octopus':
    case '🐙':
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <circle cx="20" cy="15" r="10" fill="#FF8A6B" stroke="#0B1533" strokeWidth="2" />
          <path d="M11 23c-2 6 2 10 4 5M18 24c0 6 4 6 4 0M25 23c2 5 6 1 4-5" stroke="#FF8A6B" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="16.5" cy="14" r="2" fill="#0B1533" />
          <circle cx="23.5" cy="14" r="2" fill="#0B1533" />
        </svg>
      );
    case 'squid':
    case '🦑':
    case '🪼':
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <path d="M9 19a11 11 0 0 1 22 0z" fill="#7DE8E0" stroke="#0B1533" strokeWidth="2" />
          <path d="M13 20v11M20 20v13M27 20v11" stroke="#5EE6D0" strokeWidth="3" strokeLinecap="round" />
          <circle cx="16" cy="15" r="1.8" fill="#0B1533" />
          <circle cx="24" cy="15" r="1.8" fill="#0B1533" />
        </svg>
      );
    case '🐡':
    case '🐠':
    case '🐟':
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <ellipse cx="22" cy="20" rx="11" ry="8" fill="#FFD45A" stroke="#0B1533" strokeWidth="2" />
          <polygon points="11,20 4,13 4,27" fill="#FF9E44" stroke="#0B1533" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="26" cy="18" r="2" fill="#0B1533" />
        </svg>
      );
    case '🦀':
    case '🐬':
    case '✨':
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <polygon
            points="20,4 24,14 35,14 26,21 29,32 20,25 11,32 14,21 5,14 16,14"
            fill="#FF7B5C"
            stroke="#0B1533"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="19" r="3" fill="#FFF9F0" />
        </svg>
      );
    case '⭐':
    case '🔷':
    case '🔺':
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <polygon points="20,5 34,20 20,35 6,20" fill="#7DE8E0" stroke="#0B1533" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="20" cy="20" r="4" fill="#FFF9F0" />
        </svg>
      );
    case '🧸':
    case '🐳':
    case '🦭':
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <circle cx="13" cy="12" r="4.5" fill="#FFD45A" stroke="#0B1533" strokeWidth="2" />
          <circle cx="27" cy="12" r="4.5" fill="#FFD45A" stroke="#0B1533" strokeWidth="2" />
          <circle cx="20" cy="22" r="10" fill="#FFE8A6" stroke="#0B1533" strokeWidth="2" />
          <circle cx="17" cy="20" r="1.7" fill="#0B1533" />
          <circle cx="23" cy="20" r="1.7" fill="#0B1533" />
          <ellipse cx="20" cy="24.5" rx="3" ry="2" fill="#FF8A6B" />
        </svg>
      );
    case '🪨':
    case '🌑':
    case '🪵':
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <polygon points="9,27 12,13 23,10 32,18 29,29 16,31" fill="#8D99AE" stroke="#0B1533" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M16 17l7 2" stroke="#EDF2F4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case '💎':
    case '🔮':
    case '🫧':
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <polygon points="13,10 27,10 34,19 20,33 6,19" fill="#5EE6D0" stroke="#0B1533" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M13 10l3 9h8l3-9M20 33l-4-14M20 33l4-14" stroke="#FFF9F0" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
          <circle cx="20" cy="20" r="11" fill="#D8DDFF" stroke="#0B1533" strokeWidth="2.5" />
          <circle cx="20" cy="20" r="4.5" fill="#6258ED" />
        </svg>
      );
  }
};

// Reactive SVG marker overlay for Stage 2 scene highlights
const SceneCross: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx="0" cy="0" r="16" fill="#FF6B6B" opacity="0.92" />
    <path d="M-6 -6l12 12M6 -6l-12 12" stroke="#FFF" strokeWidth="3.2" strokeLinecap="round" />
  </g>
);

const SceneCheckRing: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 24 }) => (
  <g>
    <circle
      cx={x}
      cy={y}
      r={r}
      fill="#25B99A"
      fillOpacity="0.18"
      stroke="#25B99A"
      strokeWidth="3.5"
      className="animate-pulse-glow"
    />
    <circle cx={x + r * 0.68} cy={y - r * 0.68} r="10" fill="#25B99A" />
    <path
      d={`M${x + r * 0.68 - 4} ${y - r * 0.68}l3 3 5-6`}
      fill="none"
      stroke="#FFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

// Stage 2 Interactive Reactive SVG Scene illustrating both true features & distracting noise
// Coordinates (viewBox 360x185) align 1-to-1 with FEATURE_POOL hotspots
export const FeatureDetectiveSceneSvg: React.FC<{
  caseId: string;
  foundIds?: string[];
  wrongId?: string | null;
}> = ({ caseId, foundIds = [], wrongId = null }) => {
  const has = (id: string) => foundIds.includes(id);

  if (caseId === 'f1') {
    return (
      <svg viewBox="0 0 360 185" className="h-full w-full" aria-hidden="true">
        <rect width="360" height="185" rx="16" fill="#DCEBFF" />
        {/* Wall clock (top-left x≈58, y≈52 -> 16%, 28%) */}
        <circle cx="58" cy="52" r="24" fill="#FFF9F0" stroke="#4B43C9" strokeWidth="3" />
        <path d="M58 39v13l9 6" stroke="#1E1B33" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Tablecloth (bottom x≈292, y≈146 -> 81%, 79%) */}
        <rect x="0" y="118" width="360" height="67" fill="#FF9E84" />
        <circle cx="42" cy="148" r="8" fill="#FFF9F0" opacity="0.7" />
        <circle cx="96" cy="142" r="7" fill="#FFF9F0" opacity="0.7" />
        <circle cx="292" cy="146" r="9" fill="#FFF9F0" opacity="0.85" />
        <circle cx="332" cy="136" r="7" fill="#FFF9F0" opacity="0.7" />

        {/* Basket & Apples: left apple (155, 89 -> 43%, 48%), right apple (209, 89 -> 58%, 48%) */}
        <path d="M122 118h120l-15 36H137z" fill="#E3A54B" stroke="#1E1B33" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="155" cy="89" r="24" fill="#E63946" stroke="#1E1B33" strokeWidth="3" />
        <path d="M155 65c0-8 7-12 12-10" stroke="#2D6A4F" strokeWidth="3" fill="none" />
        <circle cx="209" cy="90" r="23" fill="#F4A261" stroke="#1E1B33" strokeWidth="3" />
        <circle cx="215" cy="85" r="5" fill="#6D4C3D" />
        <path d="M198 83c3 4 3 11 0 15" stroke="#6D4C3D" strokeWidth="2.5" fill="none" />
        <circle cx="182" cy="90" r="54" fill="none" stroke="#25B99A" strokeWidth="2.5" strokeDasharray="7 5" opacity="0.65" />

        {has('f1b') && <SceneCheckRing x={155} y={89} r={27} />}
        {has('f1a') && <SceneCheckRing x={209} y={90} r={27} />}
        {wrongId === 'f1c' && <SceneCross x={292} y={146} />}
        {wrongId === 'f1d' && <SceneCross x={58} y={52} />}
      </svg>
    );
  }

  if (caseId === 'f2') {
    return (
      <svg viewBox="0 0 360 185" className="h-full w-full" aria-hidden="true">
        <rect width="360" height="185" rx="16" fill="#0B2D6B" />
        {/* Calendar top-right (310, 50 -> 86%, 27%) */}
        <rect x="286" y="24" width="48" height="48" rx="8" fill="#FFF9F0" stroke="#8CB9FF" strokeWidth="2.5" />
        <rect x="286" y="24" width="48" height="14" rx="6" fill="#FF7B5C" />
        <path d="M298 50h24M298 60h16" stroke="#1E1B33" strokeWidth="2.5" strokeLinecap="round" />

        {/* Whale rhythm (100, 104 -> 28%, 56%) */}
        <path
          d="M42 108c0-28 32-45 70-43 26 1 40 16 42 33l19-10v30l-19-9c-8 15-28 22-56 22-36 0-56-9-56-23z"
          fill="#5EE6D0"
          stroke="#FFF9F0"
          strokeWidth="2.5"
        />
        <circle cx="76" cy="96" r="4" fill="#0B1533" />

        {/* Sound waves (184, 78 -> 51%, 42%) */}
        <path
          d="M170 64c8 8 8 24 0 32M186 54c12 13 12 39 0 52M202 44c15 17 15 53 0 70"
          fill="none"
          stroke="#FFD45A"
          strokeWidth="4"
          strokeLinecap="round"
          className="animate-pulse-glow"
        />

        {/* Microphone body (248, 100 -> 69%, 54%) */}
        <rect x="238" y="80" width="20" height="34" rx="10" fill="#FF6B6B" stroke="#FFF9F0" strokeWidth="2.5" />
        <path d="M248 114v28" stroke="#FFF9F0" strokeWidth="3.5" strokeLinecap="round" />

        {has('f2a') && <SceneCheckRing x={184} y={78} r={28} />}
        {has('f2b') && <SceneCheckRing x={100} y={104} r={30} />}
        {wrongId === 'f2c' && <SceneCross x={248} y={100} />}
        {wrongId === 'f2d' && <SceneCross x={310} y={50} />}
      </svg>
    );
  }

  if (caseId === 'f3') {
    return (
      <svg viewBox="0 0 360 185" className="h-full w-full" aria-hidden="true">
        <rect width="360" height="185" rx="16" fill="#EEF1FF" />
        {/* Coral Phone Case (left bezel x≈86, y≈100 -> 24%, 54%) */}
        <rect x="76" y="16" width="208" height="152" rx="22" fill="#FF8A6B" stroke="#1E1B33" strokeWidth="3" />
        <rect x="92" y="28" width="176" height="128" rx="14" fill="#FFF9F0" />

        {/* Battery icon top-right inside screen (245, 44 -> 68%, 24%) */}
        <rect x="228" y="36" width="30" height="14" rx="4" fill="#5EE6D0" stroke="#1E1B33" strokeWidth="2.2" />
        <rect x="258" y="40" width="4" height="6" rx="1" fill="#1E1B33" />

        {/* Top message words (162, 72 -> 45%, 39%) */}
        <rect x="108" y="58" width="118" height="28" rx="9" fill="#D8DDFF" stroke="#6258ED" strokeWidth="2" />
        <rect x="198" y="65" width="14" height="14" rx="4" fill="#FFD45A" stroke="#8A5A00" strokeWidth="1.5" />
        <path d="M120 72h58M120 79h34" stroke="#4B43C9" strokeWidth="3" strokeLinecap="round" />

        {/* Bottom link message (194, 113 -> 54%, 61%) */}
        <rect x="132" y="98" width="122" height="30" rx="9" fill="#FFE8A6" stroke="#F5B83D" strokeWidth="2.5" />
        <circle cx="148" cy="113" r="6" fill="none" stroke="#8A5A00" strokeWidth="2.2" />
        <circle cx="156" cy="113" r="6" fill="none" stroke="#8A5A00" strokeWidth="2.2" />
        <path d="M168 113h72" stroke="#8A5A00" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="6 4" />

        {has('f3a') && <SceneCheckRing x={162} y={72} r={24} />}
        {has('f3b') && <SceneCheckRing x={194} y={113} r={24} />}
        {wrongId === 'f3c' && <SceneCross x={84} y={100} />}
        {wrongId === 'f3d' && <SceneCross x={244} y={44} />}
      </svg>
    );
  }

  // Case f4: Stormy Sea Forecast — crisp Wind Anemometer (۴۵), Pressure Barometer (۹۹۰),
  // clean smooth ocean swells, Sailboat with Decorative Flag, and Captain Nameplate
  return (
    <svg viewBox="0 0 360 185" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="stormSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#091D4A" />
          <stop offset="100%" stopColor="#16408A" />
        </linearGradient>
      </defs>

      <rect width="360" height="185" rx="16" fill="url(#stormSky)" />

      {/* Storm Cloud & Rain Streaks at Top Center */}
      <path
        d="M146 34a14 14 0 0 1 26-7 16 16 0 0 1 30 4 12 12 0 0 1 11 19H148a11 11 0 0 1-2-16z"
        fill="#5373B8"
        stroke="#BFD3F5"
        strokeWidth="2"
      />
      <path
        d="M158 55l-4 9M176 55l-4 9M194 55l-4 9"
        stroke="#7DE8E0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Animated Clean Wind Ribbons on Left & Right without touching gauges */}
      <path
        d="M16 98h62c8 0 10-7 4-11M256 96h70"
        fill="none"
        stroke="#5EE6D0"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray="8 6"
        className="animate-dash"
        opacity="0.8"
      />

      {/* Smooth Back Ocean Swell */}
      <path
        d="M0 132 C45 114 88 118 128 130 C168 140 212 114 256 122 C298 130 332 118 360 124 V185 H0 Z"
        fill="#1D5FC4"
      />

      {/* LEFT SENSOR (f4a · Wind Speed: 86, 56 -> hotspot 24%, 34%) */}
      <g>
        <rect
          x="44"
          y="16"
          width="84"
          height="66"
          rx="14"
          fill="#0B1533"
          stroke="#5EE6D0"
          strokeWidth="2.8"
        />
        <path d="M68 38v16M58 43h20" stroke="#BFD3F5" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="58" cy="43" r="4" fill="#5EE6D0" />
        <circle cx="78" cy="43" r="4" fill="#5EE6D0" />
        <circle cx="68" cy="34" r="4" fill="#FFD45A" />
        <text x="104" y="48" textAnchor="middle" fill="#5EE6D0" fontSize="20" fontWeight="900">
          ۴۵
        </text>
      </g>

      {/* RIGHT SENSOR (f4b · Air Pressure Barometer: 274, 56 -> hotspot 76%, 34%) */}
      <g>
        <rect
          x="232"
          y="16"
          width="84"
          height="66"
          rx="14"
          fill="#0B1533"
          stroke="#FFD45A"
          strokeWidth="2.8"
        />
        <path d="M248 52 A26 26 0 0 1 274 26" fill="none" stroke="#5EE6D0" strokeWidth="6" strokeLinecap="round" />
        <path d="M274 26 A26 26 0 0 1 300 52" fill="none" stroke="#FF6B6B" strokeWidth="6" strokeLinecap="round" />
        <line x1="274" y1="53" x2="292" y2="39" stroke="#FFD45A" strokeWidth="3" strokeLinecap="round" />
        <circle cx="274" cy="53" r="3.5" fill="#FFF9F0" />
        <text x="274" y="71" textAnchor="middle" fill="#FFD45A" fontSize="14" fontWeight="900">
          ۹۹۰
        </text>
      </g>

      {/* CENTER SAILBOAT FLOATING ON SWELL */}
      <line x1="180" y1="126" x2="180" y2="72" stroke="#FFF9F0" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M182 74l30 8-30 9z" fill="#FF8A6B" stroke="#FFF9F0" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="192" cy="82" r="2.5" fill="#FFD45A" />

      <path
        d="M132 126h96l-13 30h-70z"
        fill="#E3A54B"
        stroke="#1E1B33"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <rect x="148" y="133" width="64" height="17" rx="5" fill="#FFF9F0" stroke="#1E1B33" strokeWidth="2" />
      <circle cx="158" cy="141.5" r="3.5" fill="#4B43C9" />
      <path d="M167 141.5h36" stroke="#1E1B33" strokeWidth="2.5" strokeLinecap="round" />

      {/* Front Animated Ocean Wave Lapping Hull Bottom */}
      <g className="animate-wave-float">
        <path
          d="M-12 152 Q36 138 84 152 T180 150 T276 152 T372 148 V192 H-12 Z"
          fill="#0F3E8C"
        />
        <path
          d="M24 146 Q56 138 86 146 M262 146 Q296 138 332 146"
          fill="none"
          stroke="#FFF9F0"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>

      {has('f4a') && <SceneCheckRing x={86} y={49} r={34} />}
      {has('f4b') && <SceneCheckRing x={274} y={49} r={34} />}
      {wrongId === 'f4d' && <SceneCross x={180} y={84} />}
      {wrongId === 'f4c' && <SceneCross x={180} y={142} />}
    </svg>
  );
};

// Stage 5: Illustrated Vector Scene for Real-World AI Synthesis Missions (syn1..syn8)
export const SynthesisSceneSvg: React.FC<{ id: string; solved?: boolean }> = ({
  id,
  solved = false
}) => {
  switch (id) {
    case 'syn1': // Labeled seashells dataset
      return (
        <svg viewBox="0 0 280 110" className="h-28 w-full max-w-[300px]" aria-hidden="true">
          <rect width="280" height="110" rx="14" fill="#0B2256" />
          <g transform="translate(26 18)">
            <rect width="68" height="74" rx="10" fill="#FFF9F0" stroke="#5EE6D0" strokeWidth="2.5" />
            <path d="M18 48c0-15 7-24 16-24s16 9 16 24z" fill="#FFD45A" stroke="#1E1B33" strokeWidth="2" />
            <rect x="10" y="54" width="48" height="12" rx="5" fill="#5EE6D0" />
            <path d="M22 60h24" stroke="#0B1533" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g transform="translate(106 18)">
            <rect width="68" height="74" rx="10" fill="#FFF9F0" stroke="#FF9E84" strokeWidth="2.5" />
            <ellipse cx="34" cy="36" rx="16" ry="11" fill="#FF8A6B" stroke="#1E1B33" strokeWidth="2" />
            <rect x="10" y="54" width="48" height="12" rx="5" fill="#FFD45A" />
            <path d="M20 60h28" stroke="#0B1533" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <path d="M184 55h20" stroke="#5EE6D0" strokeWidth="3" strokeDasharray="5 4" className="animate-dash" />
          <g transform="translate(208 24)">
            <rect width="50" height="62" rx="12" fill={solved ? '#5EE6D0' : '#6258ED'} stroke="#FFF9F0" strokeWidth="2.5" />
            <circle cx="25" cy="24" r="9" fill="#FFF9F0" />
            <path d="M16 44h18" stroke="#FFF9F0" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );
    case 'syn2': // Smooth animated ocean swells + rising wave-height regression bar/line chart + gauge
      return (
        <svg viewBox="0 0 280 110" className="h-28 w-full max-w-[300px]" aria-hidden="true">
          <rect width="280" height="110" rx="14" fill="#0B2256" />
          {/* Smooth animated ocean swells without seams */}
          <g className="animate-wave-float" opacity="0.6">
            <path d="M-10 82 Q35 66 80 82 T170 80 T290 78 V115 H-10 Z" fill="#1D5FC4" />
            <path d="M-10 92 Q45 80 95 92 T195 90 T290 92 V115 H-10 Z" fill="#124294" />
          </g>
          {/* Rising Wave-Height Regression Chart */}
          <rect x="18" y="15" width="110" height="78" rx="11" fill="#FFF9F0" stroke="#8CB9FF" strokeWidth="2.5" />
          <rect x="30" y="64" width="14" height="20" rx="3" fill="#5EE6D0" />
          <rect x="52" y="52" width="14" height="32" rx="3" fill="#FFD45A" />
          <rect x="74" y="38" width="14" height="46" rx="3" fill="#FF8A6B" />
          <rect x="96" y="25" width="14" height="59" rx="3" fill="#6258ED" fillOpacity="0.25" stroke="#6258ED" strokeWidth="1.8" strokeDasharray="3 2" />
          <line x1="34" y1="62" x2="104" y2="23" stroke="#4B43C9" strokeWidth="2.4" strokeDasharray="4 3" />
          <circle cx="37" cy="60" r="3" fill="#1E1B33" />
          <circle cx="59" cy="48" r="3" fill="#1E1B33" />
          <circle cx="81" cy="35" r="3" fill="#1E1B33" />
          <circle cx="103" cy="23" r="4" fill="#FFD45A" stroke="#4B43C9" strokeWidth="1.8" />
          <path d="M136 54h24" stroke="#FFD45A" strokeWidth="3" strokeDasharray="5 4" className="animate-dash" />
          <g transform="translate(166 19)">
            <rect width="94" height="72" rx="12" fill="#08163A" stroke={solved ? '#5EE6D0' : '#FFD45A'} strokeWidth="2.5" />
            <path d="M18 52 A29 29 0 0 1 47 23" fill="none" stroke="#5EE6D0" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M47 23 A29 29 0 0 1 76 52" fill="none" stroke="#FF8A6B" strokeWidth="6.5" strokeLinecap="round" />
            <line x1="47" y1="52" x2="65" y2="33" stroke="#FFD45A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="47" cy="52" r="4.5" fill="#FFF9F0" />
          </g>
        </svg>
      );
    case 'syn3': // 3 clusters of unlabeled stones
    case 'syn4': // 2 fish clusters without labels
      return (
        <svg viewBox="0 0 280 110" className="h-28 w-full max-w-[300px]" aria-hidden="true">
          <rect width="280" height="110" rx="14" fill="#0B2256" />
          <circle cx="72" cy="55" r="38" fill="#5EE6D0" fillOpacity="0.16" stroke="#5EE6D0" strokeWidth="2" strokeDasharray="5 4" />
          <circle cx="204" cy="55" r="38" fill="#FFD45A" fillOpacity="0.16" stroke="#FFD45A" strokeWidth="2" strokeDasharray="5 4" />
          <circle cx="56" cy="44" r="10" fill="#5EE6D0" stroke="#0B1533" strokeWidth="2" />
          <circle cx="84" cy="42" r="9" fill="#5EE6D0" stroke="#0B1533" strokeWidth="2" />
          <circle cx="70" cy="68" r="11" fill="#5EE6D0" stroke="#0B1533" strokeWidth="2" />
          <polygon points="190,34 202,52 178,52" fill="#FFD45A" stroke="#0B1533" strokeWidth="2" />
          <polygon points="218,38 230,56 206,56" fill="#FFD45A" stroke="#0B1533" strokeWidth="2" />
          <polygon points="204,60 216,78 192,78" fill="#FFD45A" stroke="#0B1533" strokeWidth="2" />
          <text x="140" y="60" textAnchor="middle" fill="#BFD3F5" fontSize="13" fontWeight="900">
            ؟
          </text>
        </svg>
      );
    case 'syn5': // Aquarium temperature threshold rule
      return (
        <svg viewBox="0 0 280 110" className="h-28 w-full max-w-[300px]" aria-hidden="true">
          <rect width="280" height="110" rx="14" fill="#0B2256" />
          <rect x="34" y="20" width="84" height="70" rx="14" fill="#FFF9F0" stroke="#8CB9FF" strokeWidth="2.5" />
          <rect x="68" y="30" width="16" height="44" rx="8" fill="#1E1B33" />
          <rect x="72" y="42" width="8" height="30" rx="4" fill="#FF6B4A" />
          <circle cx="76" cy="74" r="10" fill="#FF6B4A" stroke="#1E1B33" strokeWidth="2" />
          <path d="M128 55h38" stroke="#FFD45A" strokeWidth="3" strokeDasharray="5 4" className="animate-dash" />
          <circle cx="206" cy="55" r="24" fill={solved ? '#5EE6D0' : '#FF6B4A'} stroke="#FFF9F0" strokeWidth="3" />
          <text x="206" y="61" textAnchor="middle" fill="#0B1533" fontSize="14" fontWeight="900">
            ۳۰°
          </text>
        </svg>
      );
    case 'syn6': // Leaf health photos (healthy vs thirsty)
      return (
        <svg viewBox="0 0 280 110" className="h-28 w-full max-w-[300px]" aria-hidden="true">
          <rect width="280" height="110" rx="14" fill="#0B2256" />
          <rect x="26" y="20" width="96" height="70" rx="12" fill="#FFF9F0" stroke="#5EE6D0" strokeWidth="2.5" />
          <ellipse cx="74" cy="52" rx="22" ry="13" fill="#5EE6D0" stroke="#0F6B5C" strokeWidth="2.5" transform="rotate(-15 74 52)" />
          <path d="M132 55h24" stroke="#5EE6D0" strokeWidth="3" strokeDasharray="5 4" className="animate-dash" />
          <rect x="166" y="20" width="92" height="70" rx="12" fill="#FFF9F0" stroke={solved ? '#5EE6D0' : '#FFD45A'} strokeWidth="2.5" />
          <ellipse cx="212" cy="52" rx="22" ry="13" fill="#FFD45A" stroke="#8A5A00" strokeWidth="2.5" transform="rotate(15 212 52)" />
        </svg>
      );
    case 'syn7': // Castle gate responding to sound waves
      return (
        <svg viewBox="0 0 280 110" className="h-28 w-full max-w-[300px]" aria-hidden="true">
          <rect width="280" height="110" rx="14" fill="#0B2256" />
          {/* Sound Equalizer Waves */}
          <rect x="34" y="42" width="8" height="26" rx="4" fill="#5EE6D0" className="animate-eq" />
          <rect x="48" y="30" width="8" height="50" rx="4" fill="#FFD45A" className="animate-eq" style={{ animationDelay: '0.15s' }} />
          <rect x="62" y="22" width="8" height="66" rx="4" fill="#FF8A6B" className="animate-eq" style={{ animationDelay: '0.3s' }} />
          <rect x="76" y="34" width="8" height="42" rx="4" fill="#5EE6D0" className="animate-eq" style={{ animationDelay: '0.45s' }} />
          <path d="M98 55h34" stroke="#5EE6D0" strokeWidth="3" strokeDasharray="5 4" className="animate-dash" />
          {/* Underwater Castle Gate */}
          <path d="M148 92V38h18v12h16V38h20v12h16V38h18v54z" fill="#6258ED" stroke="#FFF9F0" strokeWidth="2.5" />
          <path d="M174 92V62a18 18 0 0 1 36 0v30z" fill={solved ? '#5EE6D0' : '#FFD45A'} stroke="#0B1533" strokeWidth="2.5" />
        </svg>
      );
    default: // syn8: Underwater Camera Viewfinder spotting the Golden Compass
      return (
        <svg viewBox="0 0 280 110" className="h-28 w-full max-w-[300px]" aria-hidden="true">
          <rect width="280" height="110" rx="14" fill="#0B2256" />
          <rect x="20" y="14" width="240" height="82" rx="12" fill="#0E3170" stroke="#7ADFD1" strokeWidth="2" strokeDasharray="6 4" />
          <polygon points="44,86 64,46 88,58 106,86" fill="#3C548A" stroke="#8CB9FF" strokeWidth="2" />
          <g transform="translate(182 55)">
            <circle cx="0" cy="0" r="24" fill={solved ? '#5EE6D0' : '#FFD45A'} stroke="#1E1B33" strokeWidth="3" />
            <circle cx="0" cy="0" r="15" fill="#FFF9F0" />
            <polygon points="0,-10 5,0 0,10 -5,0" fill="#D1495B" />
            <rect x="-32" y="-30" width="64" height="60" rx="8" fill="none" stroke="#5EE6D0" strokeWidth="2.5" strokeDasharray="6 4" />
          </g>
        </svg>
      );
  }
};


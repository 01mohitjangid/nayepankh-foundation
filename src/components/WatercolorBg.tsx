/**
 * WatercolorBg.tsx — The watercolor background that runs the whole timeline.
 *
 * It receives a small full-frame blur "bump" at every scene boundary
 * (as in the reference).
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

/** Scene boundaries where the whole frame gets a soft blur pulse. */
const TRANSITION_BUMPS: Array<[number, number]> = [
  [62, 5], [95, 6], [116, 5], [176, 6], [254, 7], [346, 5], [410, 7],
  [508, 5], [588, 8], [637, 6], [658, 7], [718, 6], [790, 8], [827, 5],
  [957, 6],
];

const bgBlurAt = (frame: number): number => {
  let b = 0;
  for (const [center, amp] of TRANSITION_BUMPS) {
    const d = (frame - center) / 7;
    b += amp * Math.exp(-d * d);
  }
  return b;
};

const Streak: React.FC<{
  top: string;
  left: string;
  width: number;
  height: number;
  rotate: number;
  drift: number;
  opacity: number;
}> = ({ top, left, width, height, rotate, drift, opacity }) => (
  <div
    style={{
      position: 'absolute',
      top,
      left,
      width,
      height,
      transform: `translateX(${drift}px) rotate(${rotate}deg)`,
      background:
        'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 45%, rgba(255,255,255,0.9) 55%, rgba(255,255,255,0) 100%)',
      filter: 'blur(46px)',
      opacity,
    }}
  />
);

export const WatercolorBg: React.FC = () => {
  const frame = useCurrentFrame();
  const drift1 = Math.sin(frame / 190) * 70;
  const drift2 = Math.cos(frame / 240) * 55;
  const breathe = 1.03 + Math.sin(frame / 260) * 0.012;
  const blur = bgBlurAt(frame);

  return (
    <AbsoluteFill style={{ background: '#dfe6e9', overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          transform: `scale(${breathe})`,
          filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
        }}
      >
        {/* blue watercolor washes around the edges */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: [
              'radial-gradient(58% 62% at -6% 45%, rgba(140,175,201,0.85) 0%, rgba(140,175,201,0) 70%)',
              'radial-gradient(52% 58% at 104% 16%, rgba(148,183,208,0.75) 0%, rgba(148,183,208,0) 70%)',
              'radial-gradient(48% 52% at 16% 106%, rgba(138,173,200,0.8) 0%, rgba(138,173,200,0) 70%)',
              'radial-gradient(46% 48% at 88% 98%, rgba(148,181,206,0.7) 0%, rgba(148,181,206,0) 70%)',
              'radial-gradient(34% 36% at 50% -8%, rgba(155,188,210,0.55) 0%, rgba(155,188,210,0) 70%)',
              'radial-gradient(30% 40% at 102% 62%, rgba(150,184,208,0.55) 0%, rgba(150,184,208,0) 70%)',
            ].join(','),
          }}
        />
        {/* soft white diagonal streaks (slowly drifting) */}
        <Streak top="6%" left="4%" width={1600} height={200} rotate={-27} drift={drift1} opacity={0.7} />
        <Streak top="32%" left="-8%" width={1850} height={240} rotate={-27} drift={drift2} opacity={0.8} />
        <Streak top="58%" left="10%" width={1500} height={190} rotate={-27} drift={-drift1} opacity={0.6} />
        <Streak top="80%" left="-10%" width={1300} height={160} rotate={-27} drift={drift2 * 0.6} opacity={0.45} />
        {/* bright center */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(58% 55% at 50% 45%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0) 75%)',
          }}
        />
      </AbsoluteFill>
      {/* watercolor-paper bright edge */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 90px 22px rgba(255,255,255,0.7)',
        }}
      />
      {/* paper grain */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity: 0.035 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
        </filter>
        <rect width="1920" height="1080" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

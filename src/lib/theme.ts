/**
 * theme.ts — Video config, colors, easings, and animation helpers.
 *
 * All geometry was measured on the 736×414 reference; R() rescales to 1920×1080.
 */

import React from 'react';
import { Easing, interpolate } from 'remotion';
import { FONT } from './fonts';

export const VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 1080,
};

/** Reference frame was measured at 736×414 — rescale to 1920×1080. */
export const R = (n: number): number => (n * 1920) / 736;

export const COLOR = {
  navy: '#1d3763',
  navyDeep: '#16294a',
  goldTop: '#c48e4e',
  goldBottom: '#a06018',
  ink: '#14181c',
  gray: '#7a7f87',
  blue: '#4a7fe8',
  blueSend: '#4064c8',
  green: '#4bb277',
  greenBorder: '#46a56b',
  skyNum: '#55a3e8',
  grayNum: '#c2c5c7',
  doneBlue: '#6b9bf0',
};

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const ezOut = Easing.out(Easing.cubic);
export const ezInOut = Easing.inOut(Easing.cubic);
export const ezOutQuint = Easing.out(Easing.quad);

/** interpolate + clamp shorthand */
export const lerp = (
  frame: number,
  range: number[],
  out: number[],
  easing?: (t: number) => number,
): number =>
  interpolate(frame, range, out, {
    ...clamp,
    easing,
  });

/** Typewriter substring helper. */
export const typed = (
  text: string,
  frame: number,
  start: number,
  charsPerFrame: number,
): string => {
  const n = Math.max(0, Math.floor((frame - start) * charsPerFrame));
  return text.slice(0, Math.min(text.length, n));
};

export const gradientTextStyle = (top: string, bottom: string): React.CSSProperties => ({
  backgroundImage: `linear-gradient(180deg, ${top} 15%, ${bottom} 88%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
});

export const navyTextStyle = (size: number): React.CSSProperties => ({
  fontFamily: FONT.sans,
  fontWeight: 700,
  fontSize: R(size),
  color: COLOR.navy,
  letterSpacing: '-0.015em',
  textShadow: '0 4px 9px rgba(18,38,72,0.14)',
  whiteSpace: 'nowrap',
});

export const goldStage = (size: number): React.CSSProperties => ({
  fontFamily: FONT.serif,
  fontWeight: 400,
  fontSize: R(size),
  letterSpacing: '0.01em',
  ...gradientTextStyle(COLOR.goldTop, COLOR.goldBottom),
  whiteSpace: 'nowrap',
});

/**
 * primitives.tsx — Shared kinetic-text and UI primitives used by every scene.
 */

import React from 'react';
import { AbsoluteFill, Easing } from 'remotion';
import { COLOR, R, ezInOut, ezOut, lerp } from '../lib/theme';

type WordInProps = {
  frame: number;
  start: number;
  dur?: number;
  children: React.ReactNode;
  rise?: number;
  style?: React.CSSProperties;
};

/** One word fading in from a soft blurred ghost (the reference's word-stagger). */
export const WordIn: React.FC<WordInProps> = ({ frame, start, dur = 11, children, rise = 0, style }) => {
  const t = lerp(frame, [start, start + dur], [0, 1], ezOut);
  return (
    <span
      style={{
        display: 'inline-block',
        opacity: t,
        filter: `blur(${(1 - t) * 14}px)`,
        transform: `translateY(${(1 - t) * rise}px) scale(${0.96 + t * 0.04})`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Full-line exit: shrink + blur + fade (used by most text scenes). */
export const useExit = (frame: number, start: number, dur = 10) => {
  const t = lerp(frame, [start, start + dur], [0, 1], Easing.in(Easing.cubic));
  return {
    opacity: 1 - t,
    scale: 1 - t * 0.16,
    blur: t * 16,
  };
};

/** Centered stage for text scenes. */
export const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <AbsoluteFill
    style={{ justifyContent: 'center', alignItems: 'center', ...style }}
  >
    {children}
  </AbsoluteFill>
);

// Hand-drawn ellipse that sketches itself around a word.
export const SketchEllipse: React.FC<{
  frame: number;
  start: number;
  dur: number;
  width: number;
  height: number;
  stroke: number;
  color?: string;
}> = ({ frame, start, dur, width, height, stroke, color = COLOR.navy }) => {
  const t = lerp(frame, [start, start + dur], [0, 1], ezInOut);
  if (t <= 0) return null;
  const rx = width / 2;
  const ry = height / 2;
  const cx = rx + stroke * 2;
  const cy = ry + stroke * 2;
  // start at the left edge, sweep over the top to the right, close underneath,
  // and overshoot slightly past the start point (hand-drawn look)
  const path = [
    `M ${cx - rx} ${cy + ry * 0.1}`,
    `A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy - ry * 0.05}`,
    `A ${rx * 0.99} ${ry * 1.04} 0 0 1 ${cx - rx * 0.99} ${cy + ry * 0.16}`,
    `A ${rx * 1.02} ${ry * 0.9} 0 0 1 ${cx + rx * 0.4} ${cy - ry * 0.98}`,
  ].join(' ');
  return (
    <svg
      width={width + stroke * 4}
      height={height + stroke * 4}
      viewBox={`0 0 ${width + stroke * 4} ${height + stroke * 4}`}
      style={{ display: 'block', overflow: 'visible', transform: 'rotate(-2.5deg)' }}
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100 - t * 100}
        opacity={0.95}
      />
    </svg>
  );
};

// Black arrow cursor (with a soft shadow), pointing up-left.
export const Cursor: React.FC<{ x: number; y: number; click?: number; opacity?: number }> = ({
  x,
  y,
  click = 0,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `scale(${1 - click * 0.18})`,
      transformOrigin: 'top left',
      opacity,
      filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.35))',
    }}
  >
    <svg width={R(26)} height={R(30)} viewBox="0 0 26 30">
      <path
        d="M2 1 L2 23.5 L7.6 18.6 L11.2 27 L15.4 25.2 L11.8 17 L19 16.6 Z"
        fill="#0d0f14"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/** Blinking text caret. */
export const Caret: React.FC<{ frame: number; height: number; visible?: boolean }> = ({
  frame,
  height,
  visible = true,
}) => (
  <span
    style={{
      display: 'inline-block',
      width: R(1.8),
      height,
      background: '#16181c',
      marginLeft: R(2),
      verticalAlign: '-12%',
      opacity: visible && Math.floor(frame / 16) % 2 === 0 ? 1 : 0,
    }}
  />
);

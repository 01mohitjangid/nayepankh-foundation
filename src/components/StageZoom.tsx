/**
 * StageZoom.tsx — Giant gold "Stage N" text zooming down into place
 * with motion blur (shared by stages 1/2/3).
 */

import React from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { R, goldStage, lerp } from '../lib/theme';

export const StageZoom: React.FC<{
  label: string;
  zoomStart: number;
  zoomDur?: number;
  size?: number;
  fadeOutAt?: number;
  rise?: boolean;
}> = ({ label, zoomStart, zoomDur = 26, size = 36, fadeOutAt, rise }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({
    frame: f - zoomStart,
    fps,
    config: { damping: 16, stiffness: 90, mass: 0.9 },
    durationInFrames: zoomDur + 8,
  });
  const scale = interpolate(sp, [0, 1], [6.4, 1]);
  const vel = Math.abs(
    spring({ frame: f - zoomStart + 1, fps, config: { damping: 16, stiffness: 90, mass: 0.9 }, durationInFrames: zoomDur + 8 }) - sp,
  );
  const fade =
    fadeOutAt === undefined ? 1 : lerp(f, [fadeOutAt, fadeOutAt + 11], [1, 0], Easing.in(Easing.quad));
  const riseY = fadeOutAt === undefined || !rise ? 0 : lerp(f, [fadeOutAt, fadeOutAt + 12], [0, -R(36)]);
  if (f < zoomStart) return null;
  return (
    <div
      style={{
        ...goldStage(size),
        transform: `scale(${scale}) translateY(${riseY}px)`,
        opacity: Math.min(1, (f - zoomStart) / 3) * fade,
        filter: `blur(${Math.min(vel * 55, 14)}px) drop-shadow(0 5px 12px rgba(120,80,20,0.25))`,
      }}
    >
      {label}
    </div>
  );
};

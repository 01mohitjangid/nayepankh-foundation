/**
 * MorphText.tsx — Navy headline that blurs in, holds with a slow zoom,
 * and blur-morphs out (the "Process Visual" → "Visual Layout" swaps).
 */

import React from 'react';
import { Easing, useCurrentFrame } from 'remotion';
import { ezOut, lerp, navyTextStyle } from '../lib/theme';
import { Center } from './primitives';

export const MorphText: React.FC<{
  text: string;
  size?: number;
  inStart: number;
  inDur?: number;
  outStart: number;
  outDur?: number;
  holdZoom?: number;
}> = ({ text, size = 49, inStart, inDur = 10, outStart, outDur = 10, holdZoom = 1.04 }) => {
  const f = useCurrentFrame();
  const tIn = lerp(f, [inStart, inStart + inDur], [0, 1], ezOut);
  const tOut = lerp(f, [outStart, outStart + outDur], [0, 1], Easing.in(Easing.cubic));
  const zoom = lerp(f, [inStart, outStart + outDur], [1, holdZoom]);
  return (
    <Center>
      <div
        style={{
          ...navyTextStyle(size),
          opacity: tIn * (1 - tOut),
          filter: `blur(${(1 - tIn) * 16 + tOut * 14}px)`,
          transform: `scale(${(0.97 + tIn * 0.03) * zoom}) scaleX(${1 + tOut * 0.06})`,
        }}
      >
        {text}
      </div>
    </Center>
  );
};

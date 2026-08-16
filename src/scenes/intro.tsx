/**
 * intro.tsx — Opening kinetic-typography scenes:
 *   Scene 1 — "UI Demo" (navy intro)
 *   Scene 4 — "Smart Workflow" (scale-up + sketch ellipse)
 *   Scene 5 — "Clean" (huge → small) then "ready interface"
 *
 * (Scenes 2/3, the "Process Visual" → "Visual Layout" swaps, are plain
 * <MorphText> instances placed directly on the timeline.)
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { R, ezInOut, ezOut, ezOutQuint, lerp, navyTextStyle } from '../lib/theme';
import { Center, SketchEllipse, WordIn, useExit } from '../components/primitives';

export const SceneUIDemo: React.FC = () => {
  const f = useCurrentFrame(); // local; sequence starts at global 12
  const exit = useExit(f, 42, 12);
  const zoom = lerp(f, [4, 54], [1, 1.05]);
  return (
    <Center>
      <div
        style={{
          ...navyTextStyle(47),
          transform: `scale(${zoom * exit.scale})`,
          opacity: exit.opacity,
          filter: `blur(${exit.blur}px)`,
        }}
      >
        <WordIn frame={f} start={3} dur={12}>
          UI
        </WordIn>{' '}
        <WordIn frame={f} start={9} dur={12}>
          Demo
        </WordIn>
      </div>
    </Center>
  );
};

export const SceneSmartWorkflow: React.FC = () => {
  const f = useCurrentFrame(); // starts at global 112
  const scaleUp = lerp(f, [24, 40], [1, 1.48], ezInOut);
  const exit = useExit(f, 60, 9);
  // motion blur while scaling
  const vel = Math.abs(
    lerp(f + 1, [24, 40], [1, 1.43], ezInOut) - lerp(f - 1, [24, 40], [1, 1.43], ezInOut),
  );
  return (
    <Center>
      <div
        style={{
          position: 'relative',
          transform: `scale(${scaleUp * exit.scale})`,
          opacity: exit.opacity,
          filter: `blur(${vel * 160 + exit.blur}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={navyTextStyle(48)}>
          <WordIn frame={f} start={2} dur={11}>
            Smart
          </WordIn>{' '}
          <WordIn frame={f} start={7} dur={12}>
            Workflow
          </WordIn>
        </div>
        {/* ellipse around "Workflow" — offsets tuned to the text box */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${R(83)}px), calc(-50% + ${R(0)}px))`,
          }}
        >
          <SketchEllipse
            frame={f}
            start={34}
            dur={16}
            width={R(258)}
            height={R(82)}
            stroke={R(3)}
          />
        </div>
      </div>
    </Center>
  );
};

export const SceneClean: React.FC = () => {
  const f = useCurrentFrame(); // starts at global 176
  const scale = lerp(f, [0, 32], [3.6, 1], ezOutQuint);
  const settleBlur = lerp(f, [0, 26], [26, 0], ezOut);
  const exit = useExit(f, 72, 10);
  const zoom = lerp(f, [34, 72], [1, 1.05]);
  return (
    <Center>
      <div
        style={{
          ...navyTextStyle(37),
          transform: `scale(${scale * zoom * exit.scale})`,
          opacity: exit.opacity,
          filter: `blur(${settleBlur + exit.blur}px)`,
        }}
      >
        Clean{' '}
        <WordIn frame={f} start={38} dur={11}>
          ready
        </WordIn>{' '}
        <WordIn frame={f} start={44} dur={12}>
          interface
        </WordIn>
      </div>
    </Center>
  );
};

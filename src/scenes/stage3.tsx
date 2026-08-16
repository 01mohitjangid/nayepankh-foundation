/**
 * stage3.tsx — Stage 3 scenes:
 *   Scene 10/11 — "Analyzing input" (the "UI Ready" morph is a plain
 *                 <MorphText> on the timeline)
 *   Scene 12    — Gold "Stage 3" zoom → "Final Output"
 *   Scene 13    — "Your Message" form (typing + camera tilt)
 */

import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { COLOR, R, ezInOut, ezOut, lerp, navyTextStyle, typed } from '../lib/theme';
import { FONT } from '../lib/fonts';
import { Caret, Center, WordIn, useExit } from '../components/primitives';
import { StageZoom } from '../components/StageZoom';

export const SceneAnalyzing: React.FC = () => {
  const f = useCurrentFrame(); // global 584
  const exit = useExit(f, 48, 10);
  const zoom = lerp(f, [4, 56], [1, 1.05]);
  return (
    <Center>
      <div
        style={{
          ...navyTextStyle(48),
          opacity: exit.opacity,
          transform: `scale(${zoom * exit.scale})`,
          filter: `blur(${exit.blur}px)`,
        }}
      >
        <WordIn frame={f} start={3} dur={14}>
          Analyzing
        </WordIn>{' '}
        <WordIn frame={f} start={11} dur={14}>
          input
        </WordIn>
      </div>
    </Center>
  );
};

export const SceneStage3Final: React.FC = () => {
  const f = useCurrentFrame(); // global 654
  const exit = useExit(f, 58, 10);
  const zoom = lerp(f, [40, 58], [1, 1.045]);
  return (
    <Center>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: exit.opacity,
          transform: `scale(${zoom * exit.scale})`,
          filter: `blur(${exit.blur}px)`,
        }}
      >
        {/* Stage 3 rides above the line and fades as "Final Output" lands */}
        <div style={{ position: 'absolute', transform: `translateY(${R(-6)}px)` }}>
          <StageZoom label="Stage 3" zoomStart={2} size={33} fadeOutAt={24} rise />
        </div>
        <div style={navyTextStyle(70)}>
          <WordIn frame={f} start={24} dur={12} rise={R(26)}>
            Final
          </WordIn>{' '}
          <WordIn frame={f} start={30} dur={13} rise={R(30)}>
            Output
          </WordIn>
        </div>
      </div>
    </Center>
  );
};

export const SceneMessageForm: React.FC = () => {
  const f = useCurrentFrame(); // global 716
  const tIn = lerp(f, [2, 15], [0, 1], ezOut);
  const exitT = lerp(f, [70, 77], [0, 1], Easing.in(Easing.cubic));

  const hello = typed('Hello!', f, 20, 1.4);
  const para = typed("I'd appreciate your help improving this message..", f, 32, 2.2);
  const line3 = typed('Feel free to adjust the tone if needed', f, 57, 3.0);

  const sendOn = lerp(f, [12, 18], [0, 1]);
  const chipsOn = lerp(f, [13, 19], [0, 1]);

  // camera: zoom + slight counter-clockwise tilt while the paragraph types
  const camT = lerp(f, [36, 52], [0, 1], ezInOut);
  const camScale = 1 + camT * 0.78;
  const camRotate = camT * -7.5;
  const camX = camT * R(30);
  const camY = camT * R(85);

  const panelW = R(425);
  const panelH = R(392);

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          transform: `translate(${camX}px, ${camY}px) rotate(${camRotate}deg) scale(${camScale * (1 + exitT * 0.3)})`,
          opacity: tIn * (1 - exitT),
          filter: `blur(${(1 - tIn) * 14 + exitT * 16}px)`,
        }}
      >
        <div
          style={{
            width: panelW,
            height: panelH,
            background: '#fcfcfd',
            borderRadius: R(15),
            boxShadow: '0 18px 48px rgba(120,140,175,0.42)',
            transform: `scale(${1.12 - tIn * 0.12})`,
            position: 'relative',
            boxSizing: 'border-box',
            padding: R(20),
          }}
        >
          <div style={{ fontFamily: FONT.ui, fontWeight: 700, fontSize: R(20), color: '#23262b', marginLeft: R(8) }}>
            Your Message
          </div>
          <div style={{ height: R(1.4), background: '#e4e5e8', marginTop: R(12), marginLeft: R(-20), marginRight: R(-20) }} />
          <div
            style={{
              position: 'absolute',
              left: R(28),
              right: R(28),
              top: R(80),
              height: R(242),
              border: `${R(1.5)}px solid #c9c9cc`,
              borderRadius: R(13),
              background: '#fff',
              padding: R(18),
              boxSizing: 'border-box',
              fontFamily: FONT.ui,
              fontSize: R(15),
              color: '#17181a',
              lineHeight: 1.55,
            }}
          >
            <div>{hello}{hello.length > 0 && hello.length < 6 ? <Caret frame={f} height={R(14)} /> : null}</div>
            <div style={{ marginTop: R(10), width: R(243) }}>
              {para}
              {para.length > 0 && para.length < 50 ? <Caret frame={f} height={R(14)} /> : null}
            </div>
            <div style={{ marginTop: R(10) }}>
              {line3}
              {line3.length > 0 && line3.length < 38 ? <Caret frame={f} height={R(14)} /> : null}
            </div>
            {/* chips */}
            <div style={{ position: 'absolute', bottom: R(14), left: R(18), display: 'flex', gap: R(14), opacity: chipsOn }}>
              {['+  Golder falldert', '+  Features'].map((c) => (
                <div
                  key={c}
                  style={{
                    background: '#dcdcdf',
                    color: '#8b8b90',
                    borderRadius: R(14),
                    height: R(28),
                    display: 'flex',
                    alignItems: 'center',
                    padding: `0 ${R(16)}px`,
                    fontFamily: FONT.ui,
                    fontSize: R(12),
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              right: R(28),
              bottom: R(14),
              width: R(110),
              height: R(34),
              borderRadius: R(7),
              background: COLOR.blueSend,
              opacity: 0.35 + sendOn * 0.65,
              color: '#fff',
              fontFamily: FONT.ui,
              fontWeight: 700,
              fontSize: R(15),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: sendOn > 0.7 ? '0 6px 16px rgba(64,100,200,0.4)' : undefined,
            }}
          >
            Send
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * stage1.tsx — Stage 1 scenes:
 *   Scene 6 — Gold "Stage 1" zoom → "User Request" (typewriter)
 *   Scene 7 — Chat prompt UI (typing, cursor, send click)
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLOR, R, ezInOut, ezOut, lerp, navyTextStyle, typed } from '../lib/theme';
import { FONT } from '../lib/fonts';
import { Caret, Center, Cursor, useExit } from '../components/primitives';
import { StageZoom } from '../components/StageZoom';
import { ClipIcon, MicIcon } from '../components/icons';

export const SceneStage1User: React.FC = () => {
  const f = useCurrentFrame(); // global 252
  const label = typed('User Request', f, 40, 0.5);
  const showBlock = f >= 34;
  const drift = lerp(f, [60, 100], [1.02, 0.99]);
  const exit = useExit(f, 90, 10);
  return (
    <Center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: R(4),
          opacity: exit.opacity,
          transform: `translateY(${R(-10)}px) scale(${drift * exit.scale})`,
          filter: `blur(${exit.blur}px)`,
        }}
      >
        <StageZoom label="Stage 1" zoomStart={2} size={34} />
        {showBlock ? (
          <div style={{ ...navyTextStyle(50), minHeight: R(64) }}>
            {label}
            {f < 78 ? <Caret frame={f} height={R(42)} visible={f >= 36} /> : null}
          </div>
        ) : null}
      </div>
    </Center>
  );
};

export const SceneChat: React.FC = () => {
  const f = useCurrentFrame(); // global 346
  const tIn = lerp(f, [2, 12], [0, 1], ezOut);
  const exit = useExit(f, 62, 7);

  const message = 'Describe Your Request...';
  const shown = typed(message, f, 14, 0.68);
  const showPlaceholder = f < 14;

  // cursor path (reference-frame px): in from left → input → drifts to send
  const cx = lerp(f, [4, 14, 40, 54], [150, 222, 420, 549], ezInOut);
  const cy = lerp(f, [4, 14, 40, 54], [320, 214, 254, 240], ezInOut);
  const click = lerp(f, [56, 58, 61], [0, 1, 0]);

  const boxW = R(430);
  const boxH = R(79);

  return (
    <Center>
      <div
        style={{
          opacity: tIn * exit.opacity,
          transform: `scale(${(0.94 + tIn * 0.06) * exit.scale})`,
          filter: `blur(${(1 - tIn) * 10 + exit.blur}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: R(16),
          position: 'relative',
        }}
      >
        <div
          style={{
            fontFamily: FONT.ui,
            fontWeight: 700,
            fontSize: R(30),
            color: COLOR.ink,
            letterSpacing: '-0.01em',
          }}
        >
          How can i help?
        </div>
        <div
          style={{
            width: boxW,
            height: boxH,
            background: '#ffffff',
            borderRadius: boxH / 2,
            boxShadow:
              '0 16px 34px rgba(130,148,178,0.38), 0 3px 8px rgba(130,148,178,0.22), inset 0 -2px 5px rgba(190,200,220,0.35)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: R(30),
          }}
        >
          <span
            style={{
              fontFamily: FONT.ui,
              fontSize: R(18),
              color: showPlaceholder ? '#9aa0a6' : '#1b1d20',
            }}
          >
            {showPlaceholder ? 'Ask me somthing...' : shown}
          </span>
          {!showPlaceholder && shown.length < message.length ? (
            <Caret frame={f} height={R(18)} />
          ) : null}
          {/* right-side buttons */}
          <div
            style={{
              position: 'absolute',
              right: R(16),
              bottom: R(10),
              display: 'flex',
              gap: R(7),
              alignItems: 'center',
            }}
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  width: R(26),
                  height: R(26),
                  borderRadius: '50%',
                  border: `${R(1.2)}px solid #d7dade`,
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i === 0 ? <ClipIcon size={R(14)} /> : <MicIcon size={R(14)} />}
              </div>
            ))}
            <div
              style={{
                width: R(28),
                height: R(28),
                borderRadius: '50%',
                background: COLOR.blue,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${1 - click * 0.15})`,
                boxShadow: '0 3px 8px rgba(74,127,232,0.45)',
              }}
            >
              <svg width={R(14)} height={R(14)} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V6" />
                <path d="M6 12l6-6 6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Cursor x={R(cx)} y={R(cy)} click={click} opacity={tIn * exit.opacity} />
    </Center>
  );
};

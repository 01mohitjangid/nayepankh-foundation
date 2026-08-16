/**
 * finale.tsx — Closing scenes:
 *   Scene 15 — Progress bar 0→100 → collapse → coin-flip "Done" ✓
 *   Scene 16 — End card (gold "UI Demo" + rights footer)
 */

import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { COLOR, R, ezInOut, ezOut, goldStage, lerp } from '../lib/theme';
import { FONT } from '../lib/fonts';
import { Center, useExit } from '../components/primitives';

export const SceneProgressDone: React.FC = () => {
  const f = useCurrentFrame(); // global 824
  const centerY = R(206);
  const barH = R(52);
  const trackEnd = R(700);
  const centerX = 960;

  // fill fast → slow creep back → collapse to a pill at center
  const tipFill = lerp(f, [4, 18], [0, R(590)], ezOut);
  const tipCreep = lerp(f, [18, 60], [0, R(-165)]);
  const tipCollapse = lerp(f, [60, 74], [0, 1], ezInOut);
  const tipX = interpolate(tipCollapse, [0, 1], [tipFill + tipCreep, centerX + R(40)]);
  const leftX = interpolate(lerp(f, [62, 74], [0, 1], ezInOut), [0, 1], [-R(30), centerX - R(40)]);

  // count 0 → 100
  const count = Math.round(lerp(f, [4, 46], [0, 100], ezOut));

  // pill → circle → flip → check
  const toCircle = lerp(f, [74, 84], [0, 1], ezInOut);
  const flip = lerp(f, [84, 96], [0, 1], ezInOut);
  const checkT = lerp(f, [94, 106], [0, 1], ezOut);
  const doneT = spring({
    frame: f - 88,
    fps: 30,
    config: { damping: 13, stiffness: 120, mass: 0.8 },
    durationInFrames: 26,
  });

  const exit = useExit(f, 126, 10);

  const barVisible = tipCollapse < 1;
  const pillW = interpolate(toCircle, [0, 1], [R(80), R(72)]);
  const pillH = interpolate(toCircle, [0, 1], [barH, R(72)]);

  // color: blue → flash blue → lavender face
  const faceIsWhite = flip > 0.5;
  const counterOpacity = lerp(f, [74, 84], [1, 0]);
  const counterX = lerp(f, [16, 38, 62], [R(610), R(445), centerX], ezInOut);

  const trackIn = lerp(f, [0, 10], [0, 1], ezOut);
  // the white track melts away behind the tip once the fill peaks
  const trackW = lerp(f, [16, 40], [trackEnd + R(30), 0], ezInOut);

  return (
    <AbsoluteFill style={{ opacity: exit.opacity, filter: `blur(${exit.blur}px)` }}>
      {/* counter */}
      {count > 8 && counterOpacity > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: counterX,
            top: R(118),
            transform: 'translateX(-50%)',
            fontFamily: FONT.grotesk,
            fontSize: R(30),
            whiteSpace: 'nowrap',
            opacity: counterOpacity,
          }}
        >
          <span style={{ color: COLOR.skyNum, fontWeight: 700 }}>{count}</span>
          <span style={{ color: COLOR.grayNum, fontWeight: 600 }}>/100</span>
        </div>
      ) : null}

      {/* track */}
      {barVisible && trackW > R(4) ? (
        <div
          style={{
            position: 'absolute',
            left: -R(30),
            top: centerY - barH / 2,
            width: Math.min(trackW, (trackEnd + R(30)) * trackIn),
            height: barH,
            borderRadius: barH / 2,
            background: '#f6f4fb',
            boxShadow: '0 12px 22px rgba(140,150,185,0.38)',
          }}
        />
      ) : null}

      {/* bar fill — sweeping lavender→blue gradient (dark end rides the tip,
          then slides to the left edge as the bar retracts, as in the reference) */}
      {barVisible ? (
        <div
          style={{
            position: 'absolute',
            left: leftX,
            top: centerY - barH / 2,
            width: Math.max(R(80), tipX - leftX),
            height: barH,
            borderRadius: barH / 2,
            background: `linear-gradient(90deg, #e0daf9 0%, #a9b4f0 25%, #78a6f4 55%, #4f8cf2 80%, #4f8cf2 100%)`,
            backgroundSize: '250% 100%',
            backgroundPositionX: `${lerp(f, [8, 30, 66], [30, 55, 100], ezInOut)}%`,
            boxShadow: '0 10px 20px rgba(100,130,220,0.35)',
          }}
        />
      ) : null}

      {/* pill → circle → flip coin → check face */}
      {!barVisible ? (
        <div
          style={{
            position: 'absolute',
            left: centerX - pillW / 2,
            top: centerY - pillH / 2,
            width: pillW,
            height: pillH,
            borderRadius: pillH / 2,
            transform: `scaleX(${Math.abs(Math.cos(flip * Math.PI))})`,
            background: faceIsWhite
              ? 'linear-gradient(180deg, #f2edfc 0%, #e3dbf6 100%)'
              : '#6b97ef',
            boxShadow: faceIsWhite
              ? `0 ${R(5)}px 0 rgba(160,150,200,0.55), 0 ${R(10)}px ${R(16)}px rgba(140,150,190,0.4)`
              : '0 8px 18px rgba(100,140,235,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {faceIsWhite ? (
            <svg width={R(38)} height={R(38)} viewBox="0 0 34 34">
              <path
                d="M8 18 L14.5 24.5 L26.5 10.5"
                fill="none"
                stroke="#7aa2e8"
                strokeWidth={R(1.4)}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={100 - checkT * 100}
              />
            </svg>
          ) : null}
        </div>
      ) : null}

      {/* "Done" */}
      {f >= 88 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: R(102),
            textAlign: 'center',
            fontFamily: FONT.grotesk,
            fontWeight: 700,
            fontSize: R(42),
            color: COLOR.doneBlue,
            opacity: Math.min(1, doneT * 1.4),
            transform: `scale(${0.6 + doneT * 0.4})`,
            filter: `blur(${(1 - Math.min(doneT, 1)) * 6}px)`,
          }}
        >
          Done
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const SceneEndCard: React.FC = () => {
  const f = useCurrentFrame(); // global 954
  const tIn = lerp(f, [2, 28], [0, 1], ezOut);
  const zoom = lerp(f, [26, 126], [1, 1.05]);
  const footerIn = lerp(f, [26, 40], [0, 1]);
  return (
    <Center>
      <div
        style={{
          ...goldStage(94),
          fontFamily: FONT.grotesk,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          opacity: tIn,
          filter: `blur(${(1 - tIn) * 22}px) drop-shadow(0 ${R(6)}px ${R(10)}px rgba(120,80,20,0.3))`,
          transform: `scale(${(0.92 + tIn * 0.08) * zoom})`,
        }}
      >
        UI Demo
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: R(24),
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontWeight: 600,
          fontSize: R(12.5),
          color: '#2c4a7c',
          opacity: footerIn,
        }}
      >
        © All Rights Reserved PrivalFX
      </div>
    </Center>
  );
};

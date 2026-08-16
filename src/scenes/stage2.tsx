/**
 * stage2.tsx — Stage 2 scenes:
 *   Scene 8 — Gold "Stage 2" zoom → "Select Options" (+ sketch ellipse)
 *   Scene 9 — "Setup Preferences" panel (rows, click, scroll, buttons)
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLOR, R, ezInOut, ezOut, lerp, navyTextStyle } from '../lib/theme';
import { FONT } from '../lib/fonts';
import { Center, Cursor, SketchEllipse, WordIn, useExit } from '../components/primitives';
import { StageZoom } from '../components/StageZoom';
import { FormatIcon, GearIcon, SearchIcon } from '../components/icons';

export const SceneStage2Select: React.FC = () => {
  const f = useCurrentFrame(); // global 408
  const exit = useExit(f, 96, 8);
  const drift = lerp(f, [40, 96], [1.0, 1.04]);
  return (
    <Center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: R(6),
          opacity: exit.opacity,
          transform: `translateY(${R(-8)}px) scale(${drift * exit.scale})`,
          filter: `blur(${exit.blur}px)`,
        }}
      >
        <StageZoom label="Stage 2" zoomStart={2} size={34} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: R(-4) }}>
          <div style={navyTextStyle(51)}>
            <WordIn frame={f} start={38} dur={11}>
              Select
            </WordIn>{' '}
            <WordIn frame={f} start={45} dur={13}>
              Options
            </WordIn>
          </div>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${R(90)}px), calc(-50% + ${R(0)}px))`,
            }}
          >
            <SketchEllipse frame={f} start={58} dur={15} width={R(260)} height={R(72)} stroke={R(2.9)} />
          </div>
        </div>
      </div>
    </Center>
  );
};

const PanelRow: React.FC<{
  label: string;
  icon: 'gear' | 'search' | 'format';
  y: number;
  appear: number;
  frame: number;
  selected?: boolean;
}> = ({ label, icon, y, appear, frame, selected }) => {
  const t = lerp(frame, [appear, appear + 10], [0, 1], ezOut);
  const iconOn = lerp(frame, [appear + 8, appear + 15], [0, 1]);
  const iconBg = `rgba(${145 + (1 - iconOn) * 60}, ${176 + (1 - iconOn) * 40}, ${238}, ${0.55 + iconOn * 0.45})`;
  const glyph = iconOn > 0.5 ? '#2f56a8' : '#8a93a5';
  const Icon = icon === 'gear' ? GearIcon : icon === 'search' ? SearchIcon : FormatIcon;
  return (
    <div
      style={{
        position: 'absolute',
        left: R(38),
        top: y,
        width: R(540),
        height: R(88),
        borderRadius: R(15),
        background: selected ? '#f7fef5' : '#ffffff',
        border: selected ? `${R(2.2)}px solid ${COLOR.greenBorder}` : `${R(1.4)}px solid #ccd1d7`,
        opacity: t,
        transform: `translateY(${(1 - t) * R(18)}px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: R(40),
        paddingRight: R(26),
        boxSizing: 'border-box',
      }}
    >
      <span style={{ fontFamily: FONT.ui, fontWeight: 500, fontSize: R(19), color: '#1e2126' }}>
        {label}
      </span>
      <div
        style={{
          width: R(45),
          height: R(45),
          borderRadius: R(10),
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: iconOn > 0.5 ? '0 2px 6px rgba(60,100,200,0.3)' : undefined,
        }}
      >
        <Icon size={R(24)} color={glyph} />
      </div>
    </div>
  );
};

export const SceneSetupPanel: React.FC = () => {
  const f = useCurrentFrame(); // global 506
  const tIn = lerp(f, [2, 14], [0, 1], ezOut);
  const exit = useExit(f, 78, 8);

  // scroll: content slides up revealing buttons
  const scroll = lerp(f, [52, 70], [0, -R(261)], ezInOut);

  // cursor waypoints (reference-frame px): row1 → click → drift → Continue
  const cx = lerp(f, [14, 26, 44, 58, 70], [390, 365, 375, 370, 178], ezInOut);
  const cy = lerp(f, [14, 26, 44, 58, 70], [310, 247, 305, 352, 356], ezInOut);
  const click1 = lerp(f, [28, 30, 33], [0, 1, 0]);
  const click2 = lerp(f, [72, 74, 77], [0, 1, 0]);
  const selected = f >= 30;

  const panelW = R(620);

  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <div
        style={{
          position: 'absolute',
          top: R(75),
          width: panelW,
          height: R(596),
          background: '#fbfbfd',
          borderRadius: R(22),
          boxShadow: '0 18px 50px rgba(120,140,175,0.4)',
          opacity: tIn * exit.opacity,
          transform: `scale(${(0.94 + tIn * 0.06) * exit.scale}) translateY(${(1 - tIn) * R(30)}px)`,
          filter: `blur(${(1 - tIn) * 12 + exit.blur}px)`,
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${scroll}px)` }}>
          <div
            style={{
              textAlign: 'center',
              marginTop: R(42),
              fontFamily: FONT.ui,
              fontWeight: 700,
              fontSize: R(30),
              color: '#17191c',
            }}
          >
            Setup Preferences
          </div>
          <div
            style={{
              textAlign: 'center',
              marginTop: R(8),
              fontFamily: FONT.ui,
              fontWeight: 400,
              fontSize: R(15),
              color: COLOR.gray,
            }}
          >
            Select features to include
          </div>
          <PanelRow label="Activate features" icon="gear" y={R(125)} appear={8} frame={f} selected={selected} />
          <PanelRow label="Apply smart filters" icon="search" y={R(233)} appear={14} frame={f} />
          <PanelRow label="Optimize formatting" icon="format" y={R(341)} appear={20} frame={f} />
          {/* buttons (revealed by the scroll) */}
          <div
            style={{
              position: 'absolute',
              top: R(500),
              left: R(23),
              width: R(240),
              height: R(56),
              borderRadius: R(10),
              background: COLOR.green,
              color: '#fff',
              fontFamily: FONT.ui,
              fontWeight: 700,
              fontSize: R(20),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 18px rgba(75,178,119,0.4)',
              transform: `scale(${1 - click2 * 0.06})`,
            }}
          >
            Continue
          </div>
          <div
            style={{
              position: 'absolute',
              top: R(500),
              left: R(340),
              width: R(240),
              height: R(56),
              borderRadius: R(10),
              background: '#b7bfc9',
              color: '#333f52',
              fontFamily: FONT.ui,
              fontWeight: 500,
              fontSize: R(20),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 14px rgba(140,150,175,0.3)',
            }}
          >
            Cansel
          </div>
        </div>
      </div>
      <Cursor
        x={R(cx)}
        y={R(cy)}
        click={Math.max(click1, click2)}
        opacity={tIn * exit.opacity}
      />
    </AbsoluteFill>
  );
};

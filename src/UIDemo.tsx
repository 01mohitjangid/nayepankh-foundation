/**
 * UIDemo.tsx — Master timeline for the "UI Demo" kinetic-typography video.
 *
 * Every scene is an absolutely-timed <Sequence>; enter/exit overlaps included.
 * The watercolor background runs the whole timeline underneath.
 */

import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { WatercolorBg } from './components/WatercolorBg';
import { MorphText } from './components/MorphText';
import { SceneClean, SceneSmartWorkflow, SceneUIDemo } from './scenes/intro';
import { SceneChat, SceneStage1User } from './scenes/stage1';
import { SceneSetupPanel, SceneStage2Select } from './scenes/stage2';
import { SceneAnalyzing, SceneMessageForm, SceneStage3Final } from './scenes/stage3';
import { SceneEndCard, SceneProgressDone } from './scenes/finale';

export const UIDemoTemplate: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#e7ebec' }}>
      {/* original synthesized music bed (regenerate with audio/gen_music.py) */}
      <Audio src={staticFile('music-bed.wav')} volume={1} />

      <WatercolorBg />

      <Sequence from={12} durationInFrames={58} name="UI Demo">
        <SceneUIDemo />
      </Sequence>

      <Sequence from={58} durationInFrames={42} name="Process Visual">
        <MorphText text="Process Visual" inStart={2} outStart={30} />
      </Sequence>

      <Sequence from={90} durationInFrames={32} name="Visual Layout">
        <MorphText text="Visual Layout" inStart={2} outStart={22} />
      </Sequence>

      <Sequence from={112} durationInFrames={70} name="Smart Workflow">
        <SceneSmartWorkflow />
      </Sequence>

      <Sequence from={176} durationInFrames={84} name="Clean ready interface">
        <SceneClean />
      </Sequence>

      <Sequence from={252} durationInFrames={102} name="Stage 1 / User Request">
        <SceneStage1User />
      </Sequence>

      <Sequence from={346} durationInFrames={70} name="Chat prompt">
        <SceneChat />
      </Sequence>

      <Sequence from={408} durationInFrames={106} name="Stage 2 / Select Options">
        <SceneStage2Select />
      </Sequence>

      <Sequence from={506} durationInFrames={88} name="Setup Preferences">
        <SceneSetupPanel />
      </Sequence>

      <Sequence from={584} durationInFrames={60} name="Analyzing input">
        <SceneAnalyzing />
      </Sequence>

      <Sequence from={632} durationInFrames={30} name="UI Ready">
        <MorphText text="UI Ready" size={45} inStart={4} outStart={22} />
      </Sequence>

      <Sequence from={654} durationInFrames={70} name="Stage 3 / Final Output">
        <SceneStage3Final />
      </Sequence>

      <Sequence from={716} durationInFrames={80} name="Your Message form">
        <SceneMessageForm />
      </Sequence>

      <Sequence from={788} durationInFrames={46} name="Visual Layout II">
        <MorphText text="Visual Layout" inStart={4} outStart={38} />
      </Sequence>

      <Sequence from={824} durationInFrames={138} name="Progress / Done">
        <SceneProgressDone />
      </Sequence>

      <Sequence from={954} durationInFrames={126} name="End card">
        <SceneEndCard />
      </Sequence>
    </AbsoluteFill>
  );
};

import React from 'react';
import { Composition } from 'remotion';
import { UIDemoTemplate } from './UIDemo';
import { VIDEO_CONFIG } from './lib/theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="UIDemo"
      component={UIDemoTemplate}
      durationInFrames={VIDEO_CONFIG.durationInFrames}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
    />
  );
};

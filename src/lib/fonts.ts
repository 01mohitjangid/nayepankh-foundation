/**
 * fonts.ts — Google-font loading for every text style in the video.
 */

import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans';
import { loadFont as loadBree } from '@remotion/google-fonts/BreeSerif';
import { loadFont as loadRoboto } from '@remotion/google-fonts/Roboto';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

const jakarta = loadJakarta('normal', {
  weights: ['500', '600', '700', '800'],
  subsets: ['latin'],
});
const bree = loadBree('normal', { weights: ['400'], subsets: ['latin'] });
const roboto = loadRoboto('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
});
const inter = loadInter('normal', { weights: ['600', '700'], subsets: ['latin'] });

export const FONT = {
  sans: jakarta.fontFamily, // navy kinetic words
  serif: bree.fontFamily, // gold "Stage N"
  ui: roboto.fontFamily, // mock UI panels
  grotesk: inter.fontFamily, // end card / counters
};

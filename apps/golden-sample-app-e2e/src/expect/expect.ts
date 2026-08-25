import { mergeExpects } from '@playwright/test';
import { obscuredExpect } from './to-be-obscured';
import { viewportOverflowExpect } from './to-overflow-viewport';
import { focusOrderExpect } from './to-have-focus-order';
import { a11yExpect } from '@backbase/e2e-tests';

export type { ObscuredAnalysis } from './to-be-obscured';
export type { FocusableElement } from './to-have-focus-order';
export type {
  OverflowIssue,
  OverflowReason,
  ViewportOverflowExclusion,
} from './to-overflow-viewport';

export const expect = mergeExpects(
  a11yExpect,
  viewportOverflowExpect,
  focusOrderExpect,
  obscuredExpect
);

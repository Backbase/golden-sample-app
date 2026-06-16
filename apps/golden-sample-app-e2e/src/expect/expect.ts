import { mergeExpects } from '@playwright/test';
import { obscuredExpect } from './to-be-obscured';
import { textOutsideBoxExpect } from './to-not-have-elements-with-text-outside-the-box';
import { viewportOverflowExpect } from './to-overflow-viewport';
import { focusOrderExpect } from './to-have-focus-order';

export type { ObscuredAnalysis } from './to-be-obscured';
export type {
  OverflowIssue,
  OverflowReason,
  ViewportOverflowExclusion,
} from './to-overflow-viewport';
export type {
  TextOutsideBoxExclusion,
  TextOutsideBoxIssue,
} from './to-not-have-elements-with-text-outside-the-box';

export { analyzeElementObscured } from './to-be-obscured';
export {
  findOverflowIssues,
  overflowIssueLocator,
} from './to-overflow-viewport';
export { findTextOutsideBoxIssues } from './to-not-have-elements-with-text-outside-the-box';

export const expect = mergeExpects(
  viewportOverflowExpect,
  focusOrderExpect,
  obscuredExpect,
  textOutsideBoxExpect
);

import { mergeExpects } from '@playwright/test';
import { a11yExpect } from './a11y-expect';
import { listContainExpect } from './list-to-contain-text-expect';
import { objectListExpect } from './objects-list-expect';
import { objectContainExpect } from './objects-contain-expect';

export const expect = mergeExpects({
  ...a11yExpect,
  ...listContainExpect,
  ...objectListExpect,
  ...objectContainExpect,
});

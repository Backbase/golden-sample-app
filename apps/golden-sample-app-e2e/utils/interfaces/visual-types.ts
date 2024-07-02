import { Locator } from '@playwright/test';

export interface VisualTypes {
  animations?: 'disabled' | 'allow';
  caret?: 'hide' | 'initial';
  mask?: Array<Locator>;
  maxDiffPixelRatio?: number;
  maxDiffPixels?: number;
  omitBackground?: boolean;
  scale?: 'css' | 'device';
  threshold?: number;
  timeout?: number;
}

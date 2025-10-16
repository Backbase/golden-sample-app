import { VisualTypes } from './visual-types';

export interface VisualPageTypes extends VisualTypes {
  clip?: { x: number; y: number; width: number; height: number };
  fullPage?: boolean;
}

import 'dotenv/config';

export enum VisualTestLevel {
  OFF,
  VALIDATION,
  STEPS,
  ALL,
}

export const getVisualLevel = (): VisualTestLevel => {
  if (!process.env['VISUAL_TESTING']) return VisualTestLevel.ALL;
  switch (process.env['VISUAL_TESTING'].toLowerCase()) {
    case 'step':
      return VisualTestLevel.STEPS;
    case 'validation':
      return VisualTestLevel.VALIDATION;
    case 'all':
      return VisualTestLevel.ALL;
    default:
      return VisualTestLevel.OFF;
  }
};

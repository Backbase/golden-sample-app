import { Tab } from '../models/tab.model';

// eslint-disable-next-line no-var
declare var $localize: any;

export const createTabObject = (title: string | undefined, route: string | undefined, index: number): Tab => ({
  title: title || $localize`:Default tab name|:@@positive-pay-journey.tab.default-title:Tab`,
  route: route || (index + 1).toString(),
});

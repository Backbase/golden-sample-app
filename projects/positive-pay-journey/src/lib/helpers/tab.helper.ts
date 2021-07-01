import {Tab} from '../models/tab.model';
import {$localize} from '@angular/localize/src/localize';

const createTabObject = (title: string | undefined, route: string | undefined, index: number): Tab => ({
  title: title || $localize`:Default tab name|:@@positive-pay-journey.tab.default-title:Tab`,
  route: route || (index + 1).toString(),
});

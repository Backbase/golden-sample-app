import { BaseComponent } from './_base-component';

export class LabeledData extends BaseComponent {
  label = this.child('dt');
  value = this.child('dd');
}

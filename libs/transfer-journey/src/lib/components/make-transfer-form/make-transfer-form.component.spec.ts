import { FormBuilder } from '@angular/forms';
import { MakeTransferFormComponent } from './make-transfer-form.component';

describe('MakeTransferFormComponent', () => {
  let component: MakeTransferFormComponent;
  const formBuilder = new FormBuilder();
  beforeEach(() => {
    component = new MakeTransferFormComponent(formBuilder);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

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

  describe('transfer', () => {
    it('shoud mark all as touched', () => {
      component.ngOnInit();
      const spy = jest.spyOn(component.makeTransferForm, 'markAllAsTouched');
      component.transfer();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getError', () => {
    it('shoud mark all as touched', () => {
      component.ngOnInit();
      const errors = component.getError('amount', 'required');
      expect(errors).toBe(true);
    });
  });

  describe('invalidControl', () => {
    it('shoud return false', () => {
      component.ngOnInit();
      const control = component.isInvalidControl('amount');
      expect(control).toBe(false);
    });
  });
});

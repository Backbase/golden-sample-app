import { FormBuilder } from '@angular/forms';
import { MakeTransferFormComponent } from './make-transfer-form.component';
import { ActivatedRoute } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MakeTransferFormComponent', () => {
  let component: MakeTransferFormComponent;
  let route: ActivatedRoute;
  const formBuilder = new FormBuilder();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MakeTransferFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ],
    }).compileComponents();
    route = TestBed.inject(ActivatedRoute);
  });
  beforeEach(() => {
    component = new MakeTransferFormComponent(formBuilder, route);
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

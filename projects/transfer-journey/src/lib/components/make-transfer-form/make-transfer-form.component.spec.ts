import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ButtonModule, CurrencyInputModule, InputValidationMessageModule } from '@backbase/ui-ang';
import { MakeTransferFormComponent } from './make-transfer-form.component';

describe('MakeTransferFormComponent', () => {
  let component: MakeTransferFormComponent;
  let fixture: ComponentFixture<MakeTransferFormComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputValidationMessageModule,
        CurrencyInputModule
      ],
      declarations: [MakeTransferFormComponent],
    });

    fixture = TestBed.createComponent(MakeTransferFormComponent);
    component = fixture.componentInstance;

    component.account = {
      amount: 200,
      id: '001',
      name: 'my account'
    };

    component.maxLimit = 180;

    component.showMaskIndicator = false;

    fixture.detectChanges();
  });

  it('should an error if some fields are not set', () => {
    const button = fixture.debugElement.query(By.css('.bb-button-bar button'));
    button.nativeElement.click();

    fixture.detectChanges();
    const errors = fixture.debugElement.queryAll(By.css('.bb-input-validation-message'));
    errors.forEach((d) => {
      expect(d.nativeElement.innerText).toBe('Required field');
    });

    expect(errors.length).toBe(3);
  });

  it('should call the output if the fields are correct', () => {
    spyOn(component.submitTransfer, 'emit');
    const button = fixture.debugElement.query(By.css('.bb-button-bar button'));

    const input = fixture.debugElement.queryAll(By.css('input'));

    input[1].nativeElement.value = 'account1';
    input[1].nativeElement.dispatchEvent(new Event('input'));
    input[2].nativeElement.value = '100';
    input[2].nativeElement.dispatchEvent(new Event('input'));
    input[3].nativeElement.value = '25';
    input[3].nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    button.nativeElement.click();
    expect(component.submitTransfer.emit).toHaveBeenCalled();
  });
});

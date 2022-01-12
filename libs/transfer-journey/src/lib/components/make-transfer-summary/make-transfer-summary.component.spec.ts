import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonModule } from '@backbase/ui-ang/button';
import { MakeTransferSummaryComponent } from './make-transfer-summary.component';

describe('MakeTransferSummaryComponent', () => {
  let component: MakeTransferSummaryComponent;
  beforeEach(() => {
    component = new MakeTransferSummaryComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

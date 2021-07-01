import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositivePayChecksContainerComponent } from './positive-pay-checks-container.component';

describe('PositivePayChecksContainerComponent', () => {
  let component: PositivePayChecksContainerComponent;
  let fixture: ComponentFixture<PositivePayChecksContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositivePayChecksContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositivePayChecksContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

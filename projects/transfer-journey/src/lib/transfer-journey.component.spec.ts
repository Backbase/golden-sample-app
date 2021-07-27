import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferJourneyComponent } from './transfer-journey.component';

describe('TransferJourneyComponent', () => {
  let component: TransferJourneyComponent;
  let fixture: ComponentFixture<TransferJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferJourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

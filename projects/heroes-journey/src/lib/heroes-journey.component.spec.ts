import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroesJourneyComponent } from './heroes-journey.component';

describe('HeroesJourneyComponent', () => {
  let component: HeroesJourneyComponent;
  let fixture: ComponentFixture<HeroesJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroesJourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

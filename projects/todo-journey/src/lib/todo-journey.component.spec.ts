import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoJourneyComponent } from './todo-journey.component';

describe('TodoJourneyComponent', () => {
  let component: TodoJourneyComponent;
  let fixture: ComponentFixture<TodoJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoJourneyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

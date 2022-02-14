import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserContextComponent } from './user-context.component';

describe('UserContextComponent', () => {
  let fixture: ComponentFixture<UserContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserContextComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContextComponent);
    fixture.detectChanges();
  });

  it('should render select context widget', () => {
    const selectContextWidget = fixture.nativeElement.querySelector('[data-role="user-context-selector"]');

    expect(selectContextWidget).not.toBeNull();
  });
});

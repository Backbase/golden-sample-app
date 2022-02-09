import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContextComponent } from './user-context.component';

describe('UserContextComponent', () => {
  let component: UserContextComponent;
  let fixture: ComponentFixture<UserContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserContextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // todo: add test for rendering of context widget after merge main with jest
});

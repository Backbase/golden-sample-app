import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MakeTransferTitleComponent } from './make-transfer-title.component';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'bb-fake-titles',
  template: `
    <div class="title1">
      <bb-make-transfer-title [title]="title1"></bb-make-transfer-title>
    </div>
    <div class="title12">
      <bb-make-transfer-title [title]="title2"></bb-make-transfer-title>
    </div>
  `,
})
class FakeTitlesComponent {
  title1 = '';
  title2 = 'my title';
}

describe('MakeTransferTitleComponent', () => {
  let fixture: ComponentFixture<FakeTitlesComponent>;
  let component: FakeTitlesComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [FakeTitlesComponent, MakeTransferTitleComponent],
    });

    fixture = TestBed.createComponent(FakeTitlesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should display the title given in the input', () => {
    expect(
      fixture.debugElement.query(By.css('.title12 h1')).nativeElement.innerHTML
    ).toBe('my title');
  });

  it('should not display the title given in the input if it is empty', () => {
    expect(fixture.debugElement.query(By.css('.title11 h1'))).toBeFalsy();
  });
});

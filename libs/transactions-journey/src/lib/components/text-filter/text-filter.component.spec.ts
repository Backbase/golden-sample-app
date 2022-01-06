import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputTextModule } from '@backbase/ui-ang/input-text';
import { TextFilterComponent } from './text-filter.component';

describe('TextFilterComponent', () => {
  it('should call the out event emiter after typing text in the input textbox', () => {
    TestBed.configureTestingModule({
      imports: [InputTextModule, FormsModule],
      declarations: [TextFilterComponent]
    });

    const fixture = TestBed.createComponent(TextFilterComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    spyOn(component.textChange, 'emit');

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'hello';
    input.nativeElement.dispatchEvent(new Event('input'));

    expect(component.textChange.emit).toHaveBeenCalledWith('hello');
  });
});

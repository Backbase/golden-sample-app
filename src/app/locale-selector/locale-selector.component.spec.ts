import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DropdownSingleSelectModule } from '@backbase/ui-ang/dropdown-single-select';
import { documentWrapper, LocaleSelectorComponent } from './locale-selector.component';
import { LocalesService, LOCALES_LIST } from './locales.service';

describe('bb-locale-selector', () => {
  let documentStub: { location: { href: string, origin: string } };
  let localeServiceStub: Pick<LocalesService, |
   'currentLocale' |
   'setLocaleCookie'
   >
  let fixture: ComponentFixture<LocaleSelectorComponent>;

  beforeEach(() => {
    documentStub = {
      location: {
        href: 'test',
        origin: '',
      }
    };

    localeServiceStub = {
      currentLocale: 'en',
      setLocaleCookie: jasmine.createSpy('setLocaleCookie'),
    };

    TestBed.configureTestingModule({
      imports: [DropdownSingleSelectModule, FormsModule, CommonModule],
      declarations: [LocaleSelectorComponent],
      providers: [
        { 
          provide: LOCALES_LIST,
          useValue: ['es', 'en'],
        },
        {
          provide: LocalesService,
          useValue: localeServiceStub,
        }
      ]
    }).overrideComponent(LocaleSelectorComponent, {
      set: {
        providers: [{
          provide: documentWrapper,
          useValue: documentStub,
        }],
      },
    });

    fixture = TestBed.createComponent(LocaleSelectorComponent);
    fixture.detectChanges();
  });

  it('should load all the languages configured', () => {
    const languages = fixture
      .debugElement
      .queryAll(By.css('option'))
      .map((element) => element.nativeElement.innerText.trim());

    expect(languages).toEqual(['Spanish', 'English']);
  });

  it(`should set a new cookie value and refresh the page 
  by calling the respective services after selecting a language`, () => {
    const select = fixture.debugElement.query(By.css('select')).nativeElement;
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(localeServiceStub.setLocaleCookie).toHaveBeenCalledWith('en');
    expect(documentStub.location.origin).toBe(documentStub.location.href);
  });
});

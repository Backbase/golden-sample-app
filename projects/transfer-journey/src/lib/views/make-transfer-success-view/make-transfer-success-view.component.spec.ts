import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ButtonModule } from "@backbase/ui-ang";
import { of } from "rxjs";
import { MakeTransferSuccessViewComponent } from "./make-transfer-success-view.component";
import { MakeTransferJourneyState } from "../../services/make-transfer-journey-state.service";

describe('MakeTransferSuccessViewComponent', () => {
  let fixture: ComponentFixture<MakeTransferSuccessViewComponent>;
  let routerStub: Pick<Router, 'navigate'>;

  beforeEach(() => {
    routerStub = {
      navigate: jasmine.createSpy(),
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, ButtonModule],
      declarations: [MakeTransferSuccessViewComponent],
      providers: [
        {
          provide: Router,
          useValue: routerStub,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                title: 'my title',
              },
            },
          },
        },
        {
          provide: MakeTransferJourneyState,
          useValue: {
            transfer: of({
              fromAccount: '111',
              toAccount: '222',
              amount: 200,
            }),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(MakeTransferSuccessViewComponent);
    fixture.detectChanges();
  });

  it('should show a summary of the transfer', () => {
    const element = fixture.debugElement.query(By.css('div[data-role="transfer-summary"]')).nativeElement;
    const title = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(element.innerText).toBe('you have transfered 200 to 222');
    expect(title.innerText).toBe('my title');
  });

  it('should navigate back to the main view when close button is pushed', () => {
    const element = fixture.debugElement.query(By.css('button')).nativeElement;

    element.click();

    expect(routerStub.navigate).toHaveBeenCalled();
  });
});

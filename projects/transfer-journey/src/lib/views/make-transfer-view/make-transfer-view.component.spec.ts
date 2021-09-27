import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { Account } from "transfer-journey";
import { Transfer } from "../../model/Account";
import { MakeTransferAccountHttpService } from "../../services/make-transfer-accounts.http.service";
import { MakeTransferJourneyConfiguration } from "../../services/make-transfer-journey-config.service";
import { MakeTransferJourneyState } from "../../services/make-transfer-journey-state.service";
import { MakeTransferPermissionsService } from "../../services/make-transfer-permissions.service";
import { MakeTransferViewComponent } from "./make-transfer-view.component";

let fixture: ComponentFixture<MakeTransferViewComponent>;
let routerStub: Pick<Router, 'navigate'>;
let transferStoreStub: Pick<MakeTransferJourneyState, 'next'>;
let makeTransferPermissionsStub: Pick<MakeTransferPermissionsService, 'unlimitedAmountPerTransaction$'>;
let accountsHttpServiceStub: Pick<MakeTransferAccountHttpService, 'currentAccount$'>;
let configurationServiceStub: Pick<MakeTransferJourneyConfiguration, 'maskIndicator' | 'maxTransactionAmount'>;

@Component({
  selector: 'bb-make-transfer-form',
  template: '<div></div>'
})
export class MakeTransferFormFake {
  @Input() account: Account | undefined;
  @Input() showMaskIndicator = true;
  @Input() maxLimit = 0;
  
  @Output() submitTransfer = new EventEmitter<Transfer>();
}

const accountMock = {
  id: '00001',
  name: 'my account name',
  amount: 5690.76,
};

describe('MakeTransferViewComponent', () => {
  transferStoreStub = {
    next: jasmine.createSpy()
  };
  
  makeTransferPermissionsStub = {
    unlimitedAmountPerTransaction$: of(true),
  };

  accountsHttpServiceStub = {
    currentAccount$: of(accountMock),
  }

  configurationServiceStub = {
    maskIndicator: false,
    maxTransactionAmount: 2000,
  }

  routerStub = {
    navigate: jasmine.createSpy(),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [MakeTransferViewComponent, MakeTransferFormFake],
      providers:[
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
          useValue: transferStoreStub
        },
        {
          provide: MakeTransferPermissionsService,
          useValue: makeTransferPermissionsStub
        },
        {
          provide: MakeTransferAccountHttpService,
          useValue: accountsHttpServiceStub
        },
        {
          provide: MakeTransferJourneyConfiguration,
          useValue: configurationServiceStub,
        },
      ],
    });

    fixture = TestBed.createComponent(MakeTransferViewComponent);
    fixture.detectChanges();
  });

  it('should load the title correctly', () => {
    const element = fixture.debugElement.query(By.css('h1')).nativeElement;

    expect(element.innerText).toBe('my title');
  });

  it('should load the account correctly', fakeAsync(() => {
    fixture.whenStable().then(() => {
      const element = fixture.debugElement.query(By.directive(MakeTransferFormFake)).componentInstance as MakeTransferFormFake;

      expect(element.account).toEqual(accountMock);
    });
  }));

  it('should store the payment and navigate to the next step', fakeAsync(() => {
    fixture.whenStable().then(() => {
        const element = fixture.debugElement.query(By.directive(MakeTransferFormFake)).componentInstance as MakeTransferFormFake;
        const transferMock = {
          amount: 100,
          fromAccount: '11',
          toAccount: '22',
        };

        element.submitTransfer.emit(transferMock);

        expect(transferStoreStub.next).toHaveBeenCalledWith(transferMock);
        expect(routerStub.navigate).toHaveBeenCalled();
      });
  }));
});
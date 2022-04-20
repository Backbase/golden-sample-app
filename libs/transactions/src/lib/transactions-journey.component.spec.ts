import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionAdditionalDetailsTemplateDirective } from './directives/transaction-additional-details.directive';
import { TransactionsJourneyConfiguration } from './services/transactions-journey-config.service';
import { TransactionsJourneyComponent } from './transactions-journey.component';

describe('TransactionsJourneyComponent', () => {
    let fixture: ComponentFixture<WrapperComponent>;

    const mockConfig: Partial<TransactionsJourneyConfiguration> = {
        additionalDetailsTpl: undefined
    }

    @Component({
        template: `
            <bb-transactions-journey>
                <ng-template bbTransactionAdditionalDetails>some-template</ng-template>
            </bb-transactions-journey>
        `
    })
    class WrapperComponent {}

    beforeEach(async () => {
        mockConfig.additionalDetailsTpl = undefined;

        await TestBed.configureTestingModule({
            declarations: [WrapperComponent, TransactionsJourneyComponent, TransactionAdditionalDetailsTemplateDirective],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
            { provide: TransactionsJourneyConfiguration, useValue: mockConfig },
            ],
        }).compileComponents();

    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WrapperComponent);
        fixture.detectChanges();
    });

    it('should store provided template for additional details in config servie', () => {
        expect(mockConfig.additionalDetailsTpl).toBeDefined();
    });
});

import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionAdditionalDetailsTemplateDirective } from './directives/transaction-additional-details.directive';
import { ExtensionTemplatesService } from './services/extension-templates.service';
import { TransactionsJourneyComponent } from './transactions-journey.component';

describe('TransactionsJourneyComponent', () => {
    let fixture: ComponentFixture<WrapperComponent>;

    const mockTemplateService: Partial<ExtensionTemplatesService> = {
        additionalDetailsTemplate: undefined
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
        mockTemplateService.additionalDetailsTemplate = undefined;

        await TestBed.configureTestingModule({
            declarations: [WrapperComponent, TransactionsJourneyComponent, TransactionAdditionalDetailsTemplateDirective],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
            { provide: ExtensionTemplatesService, useValue: mockTemplateService },
            ],
        }).compileComponents();

    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WrapperComponent);
        fixture.detectChanges();
    });

    it('should store provided template for additional details in template servie', () => {
        expect(mockTemplateService.additionalDetailsTemplate).toBeDefined();
    });
});

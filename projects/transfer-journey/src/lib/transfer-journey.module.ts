
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRoutes, Route, RouterModule } from '@angular/router';
import { AccountSelectorModule, ButtonModule, CurrencyInputModule, InputValidationMessageModule, ModalModule } from '@backbase/ui-ang';
import { MakeTransferFormComponent } from './components/make-transfer-form.component';
import { MakeTransferSummaryComponent } from './components/make-transfer-summary.component';
import { TRANSLATIONS } from './constants/dynamic-translations';
import { TransferJourneyComponent } from './transfer-journey.component';
import { MakeTransferSuccessViewComponent } from './views/make-transfer-success-view.component';
import { MakeTransferSummaryViewComponent } from './views/make-transfer-summary-view.component';
import { MakeTransferViewComponent } from './views/make-transfer-view.component';

const defaultRoute: Route = {
  path: '',
  component: TransferJourneyComponent,
  children: [
    {
      path: '',
      redirectTo: 'make-transfer',
      pathMatch: 'full'
    },
    {
      path: 'make-transfer',
      component: MakeTransferViewComponent,
      data: {
        title: TRANSLATIONS.makeTransferTitle,
      }
    },
    {
      path: 'make-transfer-summary',
      component: MakeTransferSummaryViewComponent,
      data: {
        title: TRANSLATIONS.makeTransferTitle,
      }
    },
    {
      path: 'make-transfer-success',
      component: MakeTransferSuccessViewComponent,
      data: {
        title: TRANSLATIONS.makeTransferTitle,
      }
    }
  ]
}

@NgModule({
  declarations: [
    TransferJourneyComponent, 
    MakeTransferViewComponent, 
    MakeTransferFormComponent, 
    MakeTransferSummaryComponent, 
    MakeTransferSummaryViewComponent,
    MakeTransferSuccessViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CurrencyInputModule,
    AccountSelectorModule,
    InputValidationMessageModule,
    ReactiveFormsModule,
  ],
  exports: [TransferJourneyComponent]
})
export class TransferJourneyModule {
  static forRoot(data: { [key: string]: unknown; route: Route } = { route: defaultRoute }) {
    return {
      ngModule: TransferJourneyModule,
      providers: [provideRoutes([data.route])],
    };
  }
 }

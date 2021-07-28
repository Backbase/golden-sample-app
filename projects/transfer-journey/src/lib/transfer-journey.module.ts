
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRoutes, Route, RouterModule } from '@angular/router';
import { AccountSelectorModule, ButtonModule, CurrencyInputModule, InputValidationMessageModule, ModalModule } from '@backbase/ui-ang';
import { MakeTransferFormComponent } from './components/make-transfer-form.component';
import { MakeTransferSummaryComponent } from './components/make-transfer-summary.component';
import { TRANSLATIONS } from './constants/dynamic-translations';
import { TransferJourneyComponent } from './transfer-journey.component';
import { MakeTransferComponent } from './views/make-transfer.component';

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
      component: MakeTransferComponent,
      data: {
        title: TRANSLATIONS.makeTransferTitle,
      }
    }
  ]
}

@NgModule({
  declarations: [TransferJourneyComponent, MakeTransferComponent, MakeTransferFormComponent, MakeTransferSummaryComponent],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ModalModule,
    CurrencyInputModule,
    AccountSelectorModule,
    InputValidationMessageModule,
    ReactiveFormsModule,
  ],
  exports: [TransferJourneyComponent]
})
export class TransferJourneyModule {
  static forRoot(data: { [key: string]: any; route: Route } = { route: defaultRoute }) {
    return {
      ngModule: TransferJourneyModule,
      providers: [provideRoutes([data.route])],
    };
  }
 }

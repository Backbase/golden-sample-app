import { Component } from '@angular/core';
import { ArrangementsService } from '@libs/transactions';

@Component({
  selector: 'app-user-accounts-view',
  templateUrl: './user-accounts-view.component.html',
})
export class UserAccountsViewComponent {
  public arrangements$ = this.arrangementsService.arrangements$;

  constructor(private readonly arrangementsService: ArrangementsService) {}
}

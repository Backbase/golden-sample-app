import { Component } from '@angular/core';
import { UserAccountsService } from '../user-accounts.service';

@Component({
  selector: 'app-user-accounts-view',
  templateUrl: './user-accounts-view.component.html',
})
export class UserAccountsViewComponent {
  public arrangements$ = this.userAccountsService.arrangements$

  constructor(private readonly userAccountsService: UserAccountsService) { }
}

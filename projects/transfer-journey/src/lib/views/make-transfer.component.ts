import { Component } from "@angular/core";
import { Account } from "../model/Account";

@Component({
  templateUrl: 'make-transfer.component.html'
})
export class MakeTransferComponent {
  account: Account = {
    id: '00001',
    name: 'my account name',
    amount: 5690.76,
  }
}

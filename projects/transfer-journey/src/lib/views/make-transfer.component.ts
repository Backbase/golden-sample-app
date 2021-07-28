import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MakeTransferJourneyConfigService } from "../make-transfer-journey-config.service";
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

  title = this.route.snapshot.data['title'];

  constructor(private route:ActivatedRoute, public config: MakeTransferJourneyConfigService) {}
}

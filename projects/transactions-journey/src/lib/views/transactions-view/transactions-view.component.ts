import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionsJourneyConfigService } from '../../transactions-journey-config.service';
import { TransactionsHttpService } from '../../transactions.http.service';

@Component({
  templateUrl: './transactions-view.component.html',
  providers: [TransactionsJourneyConfigService],
})
export class TransactionsViewComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly transactionsService: TransactionsHttpService,
    private readonly config: TransactionsJourneyConfigService
  ) { }


  title = this.route.snapshot.data.title;
  transactions = this.transactionsService.getTransactions(0, this.config.pageSize);
  filter = '';
}

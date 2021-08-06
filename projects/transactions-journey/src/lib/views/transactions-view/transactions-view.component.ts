import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionsJourneyConfigService } from '../../transactions-journey-config.service';
import { TransactionsJourneyService } from '../../transactions-journey.service';

@Component({
  templateUrl: './transactions-view.component.html',
  styleUrls: ['./transactions-view.component.scss'],
  providers: [TransactionsJourneyConfigService],
})
export class TransactionsViewComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly transactionsService: TransactionsJourneyService,
    private readonly config: TransactionsJourneyConfigService
  ) { }


  title = this.route.snapshot.data.title;
  items = this.transactionsService.getTransactions(0, this.config.pageSize);
  filter = '';
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  templateUrl: './transaction-details.component.html',
  selector: 'bb-transaction-details',
})
export class TransactionDetailsComponent implements OnInit {
  public transactionDetails;
  private routerState: NavigationExtras | undefined;
  constructor(public route: ActivatedRoute, private router: Router) {
    this.routerState = this?.router?.getCurrentNavigation()?.extras.state;
    if (this.routerState) {
      this.transactionDetails = this.routerState.queryParams;
    } else {
      this.router.navigate(['/transactions'], {
        fragment: this.route.snapshot.paramMap.get('id') || 'top',
      });
    }
    console.log(this.transactionDetails);
  }

  ngOnInit(): void {
    console.log(window.history.state);
  }
}

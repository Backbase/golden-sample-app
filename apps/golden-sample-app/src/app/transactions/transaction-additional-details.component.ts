import {Component, Input, SimpleChanges} from "@angular/core";
import { TransactionAdditionalDetailsComponent } from "@libs/transactions";
import { TransactionItem } from "@backbase/data-ang/transactions";

let instanceCount = 0;

@Component({
  selector: 'app-custom-txn-info',
  styleUrls: ['./transaction-additional-details.component.scss'],
  templateUrl: './transaction-additional-details.component.html'
})
export class TransactionItemAdditionalDetailsComponent implements TransactionAdditionalDetailsComponent {
  @Input()
  context: TransactionItem | undefined;

  private readonly id = instanceCount++;

  maybeLog(thing: any) {
    if (this.id === 1) {
      console.log(thing);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.maybeLog({changes})
  }

  ngOnDestroy(): void {
    this.maybeLog('ngOnDestroy');
  }

  ngOnInit(): void {
    this.maybeLog('ngOnInit');
  }
}
